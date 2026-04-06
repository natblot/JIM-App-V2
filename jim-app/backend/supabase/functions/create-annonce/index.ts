// Edge Function create-annonce — handler ≤ 40 lignes
// Validation Zod → géocodage → insertion DB → trigger notification_queue
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { annonceSchema } from '../_shared/annonce.schema.deno.ts';
import { createAnnonce } from '../_shared/annonce.service.ts';

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

    // Rate limiting : max 10 annonces par titulaire par 24h
    const { count } = await supabase
      .from('annonces')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (count !== null && count >= 10) {
      return Response.json(
        { error: { code: 'ANNONCE_RATE_LIMIT', message: 'Limite de 10 annonces par jour atteinte' } },
        { status: 429, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const validated = annonceSchema.safeParse(body);
    if (!validated.success) {
      return Response.json({ error: { code: 'VALIDATION_INVALID', message: 'Données invalides', details: validated.error.issues } }, { status: 400, headers: corsHeaders });
    }

    const annonce = await createAnnonce(supabase, { ...validated.data, profileId: user.id });
    return Response.json({ data: annonce }, { headers: corsHeaders });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return Response.json({ error: { code: 'SYSTEM_ERROR', message } }, { status: 500, headers: corsHeaders });
  }
});
