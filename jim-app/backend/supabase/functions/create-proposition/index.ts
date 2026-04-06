// Edge Function create-proposition — Epic 11, Story 11.5
// Proposition directe d'un titulaire a un favori
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logAudit, extractRequestInfo } from '../_shared/audit.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const body = await req.json().catch(() => ({}));
  const { remplacant_id, date_debut, date_fin, retrocession } = body;

  if (!remplacant_id || !date_debut || !date_fin || retrocession == null) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'remplacant_id, date_debut, date_fin et retrocession requis' } }, 422);
  }

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  try {
    // Verifier que l'utilisateur est titulaire
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('user_id', user.id).single();
    if (profile?.role !== 'titulaire') return json({ error: { code: 'NOT_TITULAIRE', message: 'Seul un titulaire peut envoyer une proposition' } }, 403);

    // Verifier que le remplacant est dans les favoris
    const { data: favori } = await supabaseAdmin
      .from('favoris')
      .select('id')
      .eq('titulaire_id', user.id)
      .eq('remplacant_id', remplacant_id)
      .maybeSingle();

    if (!favori) return json({ error: { code: 'NOT_FAVORI', message: 'Ce remplacant n\'est pas dans vos favoris' } }, 403);

    // Creer la proposition (RLS INSERT gere aussi la verification)
    const { data: proposition, error: insertErr } = await supabase
      .from('propositions_directes')
      .insert({ titulaire_id: user.id, remplacant_id, date_debut, date_fin, retrocession })
      .select('id, status, created_at')
      .single();

    if (insertErr) {
      if (insertErr.code === '23505') return json({ error: { code: 'ALREADY_PROPOSED', message: 'Proposition deja envoyee pour ces dates' } }, 409);
      throw insertErr;
    }

    const { ipAddress, userAgent } = extractRequestInfo(req);
    await logAudit(supabaseAdmin, {
      userId: user.id, action: 'proposition.create', resourceType: 'proposition', resourceId: proposition.id,
      ipAddress, userAgent, details: { remplacant_id, date_debut, date_fin },
    });

    return json({ data: proposition });
  } catch (err: unknown) {
    return json({ error: { code: 'SYSTEM_ERROR', message: err instanceof Error ? err.message : 'Erreur interne' } }, 500);
  }
});
