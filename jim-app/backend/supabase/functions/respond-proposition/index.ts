// Edge Function respond-proposition — Epic 11, Story 11.5
// Le remplacant accepte ou decline une proposition directe
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
  const { proposition_id, response } = body;

  if (!proposition_id || !response || !['acceptee', 'declinee'].includes(response)) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'proposition_id et response (acceptee/declinee) requis' } }, 422);
  }

  try {
    // RLS UPDATE policy verifie que l'user est le remplacant et status = envoyee
    const { data: updated, error: updateErr } = await supabase
      .from('propositions_directes')
      .update({ status: response })
      .eq('id', proposition_id)
      .select('id, status, titulaire_id, remplacant_id')
      .single();

    if (updateErr) throw updateErr;
    if (!updated) return json({ error: { code: 'PROPOSITION_NOT_FOUND', message: 'Proposition introuvable ou deja traitee' } }, 404);

    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { ipAddress, userAgent } = extractRequestInfo(req);
    await logAudit(supabaseAdmin, {
      userId: user.id, action: `proposition.${response}`, resourceType: 'proposition', resourceId: proposition_id,
      ipAddress, userAgent,
    });

    return json({ data: updated });
  } catch (err: unknown) {
    return json({ error: { code: 'SYSTEM_ERROR', message: err instanceof Error ? err.message : 'Erreur interne' } }, 500);
  }
});
