import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@4';
import { createAnnuaireSanteClient } from '../_shared/annuaire-sante.ts';
import { verifyRppsForUser } from '../_shared/rpps-service.ts';
import type { ApiResponse } from '../_shared/types.ts';

// Schéma de validation de l'input
const requestSchema = z.object({
  rpps_number: z.string().regex(/^\d{11}$/, 'Le RPPS doit contenir 11 chiffres'),
});

Deno.serve(async (req: Request): Promise<Response> => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const headers = { 'Content-Type': 'application/json' };

  try {
    // Auth — récupérer l'utilisateur depuis le JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentification requise.' } } satisfies ApiResponse,
        { status: 401, headers }
      );
    }

    // Client Supabase avec le token de l'utilisateur (respecte RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Client admin pour les mises à jour (bypass RLS pour la vérification RPPS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Session invalide. Reconnectez-vous.' } } satisfies ApiResponse,
        { status: 401, headers }
      );
    }

    // Validation input
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: { code: 'VALIDATION_INVALID_RPPS', message: parsed.error.issues[0]?.message ?? 'Données invalides.' } } satisfies ApiResponse,
        { status: 400, headers }
      );
    }

    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, rpps_verified, rpps_cache_expires_at')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return Response.json(
        { error: { code: 'SYSTEM_ERROR', message: 'Profil introuvable.' } } satisfies ApiResponse,
        { status: 404, headers }
      );
    }

    // Cache valide — ne pas rappeler l'API (NFR40)
    if (profile.rpps_verified && profile.rpps_cache_expires_at && new Date(profile.rpps_cache_expires_at) > new Date()) {
      return Response.json(
        { data: { status: 'already_verified', cached: true } } satisfies ApiResponse,
        { status: 200, headers }
      );
    }

    // Appeler le service de vérification
    const annuaireClient = createAnnuaireSanteClient();
    const result = await verifyRppsForUser(annuaireClient, {
      rppsNumber: parsed.data.rpps_number,
      userFirstName: profile.first_name,
      userLastName: profile.last_name,
    });

    if (!result.success) {
      // Cas usurpation — bloquer le compte (FR10)
      if (result.code === 'RPPS_NAME_MISMATCH') {
        await supabaseAdmin
          .from('profiles')
          .update({
            is_blocked: true,
            blocked_reason: `Tentative usurpation RPPS ${parsed.data.rpps_number} le ${new Date().toISOString()}`,
            rpps_verification_status: 'usurpation',
            rpps_last_attempt_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        // Cas API down — mode dégradé (NFR30)
        await supabaseAdmin
          .from('profiles')
          .update({
            rpps_number: parsed.data.rpps_number,
            rpps_verification_status: result.code === 'RPPS_API_DOWN' ? 'api_down' : 'failed',
            rpps_last_attempt_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      }

      const status = result.code === 'RPPS_API_DOWN' ? 503 : 422;
      return Response.json(
        { error: { code: result.code, message: result.message } } satisfies ApiResponse,
        { status, headers }
      );
    }

    // Succès — mettre à jour le profil avec cache 6 mois (NFR40)
    const cacheExpiry = new Date();
    cacheExpiry.setMonth(cacheExpiry.getMonth() + 6);

    await supabaseAdmin
      .from('profiles')
      .update({
        rpps_number: parsed.data.rpps_number,
        rpps_verified: true,
        rpps_verified_at: new Date().toISOString(),
        rpps_cache_expires_at: cacheExpiry.toISOString(),
        rpps_verification_status: 'verified',
        rpps_last_attempt_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    return Response.json(
      {
        data: {
          status: 'verified',
          rpps_number: result.data.rpps_number,
          profession: result.data.profession_label,
        },
      } satisfies ApiResponse,
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[verify-rpps] Unexpected error:', error);
    return Response.json(
      { error: { code: 'SYSTEM_ERROR', message: 'Une erreur inattendue est survenue. Réessayez.' } } satisfies ApiResponse,
      { status: 500, headers }
    );
  }
});
