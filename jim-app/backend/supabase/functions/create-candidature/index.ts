// Edge Function create-candidature — Epic 5, Story 5.1
// Handler ≤ 40 lignes — délègue à _shared/candidature.service.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createCandidatureSchema } from '../_shared/candidature.schema.deno.ts';
import { createCandidature } from '../_shared/candidature.service.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return Response.json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, { status: 405, headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return Response.json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifié' } }, { status: 401, headers: corsHeaders });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createCandidatureSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message } }, { status: 422, headers: corsHeaders });
  }

  const result = await createCandidature(supabase, user.id, parsed.data);
  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status ?? 400, headers: corsHeaders });
  }

  return Response.json({ data: result.data }, { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
