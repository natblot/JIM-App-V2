// Edge Function update-annonce — modification et fermeture manuelle
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { annonceUpdateSchema } from '../_shared/annonce.schema.deno.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: { code: 'AUTH_REQUIRED', message: 'Authentification requise' } }, { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: { code: 'AUTH_INVALID', message: 'Session invalide' } }, { status: 401, headers: corsHeaders });
    }

    const url = new URL(req.url);
    const annonceId = url.searchParams.get('id');
    if (!annonceId) {
      return Response.json({ error: { code: 'VALIDATION_MISSING_ID', message: 'ID annonce manquant' } }, { status: 400, headers: corsHeaders });
    }

    const body = await req.json();
    const validated = annonceUpdateSchema.safeParse(body);
    if (!validated.success) {
      return Response.json({ error: { code: 'VALIDATION_INVALID', message: 'Données invalides', details: validated.error.issues } }, { status: 400, headers: corsHeaders });
    }

    const updateData: Record<string, unknown> = { ...validated.data };
    if (validated.data.statut === 'pourvue') {
      updateData.closed_at = new Date().toISOString();
    }

    // RLS garantit que seul le propriétaire peut modifier
    const { data, error } = await supabase
      .from('annonces')
      .update(updateData)
      .eq('id', annonceId)
      .eq('profile_id', user.id)
      .select('id, statut, ville, date_debut, date_fin, is_urgent')
      .single();

    if (error) {
      return Response.json({ error: { code: 'ANNONCE_UPDATE_FAILED', message: 'Modification impossible' } }, { status: 400, headers: corsHeaders });
    }
    if (!data) {
      return Response.json({ error: { code: 'ANNONCE_NOT_FOUND', message: 'Annonce introuvable ou accès refusé' } }, { status: 404, headers: corsHeaders });
    }

    return Response.json({ data }, { headers: corsHeaders });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return Response.json({ error: { code: 'SYSTEM_ERROR', message } }, { status: 500, headers: corsHeaders });
  }
});
