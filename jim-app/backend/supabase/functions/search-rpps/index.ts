import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@4';
import { createAnnuaireSanteClient } from '../_shared/annuaire-sante.ts';
import type { ApiResponse } from '../_shared/types.ts';

const requestSchema = z.object({
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50),
  city: z.string().max(100).optional(),
});

Deno.serve(async (req: Request): Promise<Response> => {
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentification requise.' } } satisfies ApiResponse,
        { status: 401, headers }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Session invalide.' } } satisfies ApiResponse,
        { status: 401, headers }
      );
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: { code: 'VALIDATION_INVALID_RPPS', message: parsed.error.issues[0]?.message ?? 'Données invalides.' } } satisfies ApiResponse,
        { status: 400, headers }
      );
    }

    const annuaireClient = createAnnuaireSanteClient();
    const results = await annuaireClient.searchByName({
      lastName: parsed.data.last_name,
      firstName: parsed.data.first_name,
      city: parsed.data.city,
    });

    return Response.json(
      { data: { results, count: results.length } } satisfies ApiResponse,
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[search-rpps] Unexpected error:', error);
    return Response.json(
      { error: { code: 'SYSTEM_ERROR', message: 'Une erreur inattendue est survenue.' } } satisfies ApiResponse,
      { status: 500, headers }
    );
  }
});
