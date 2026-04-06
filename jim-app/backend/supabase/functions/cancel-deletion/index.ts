// Edge Function cancel-deletion — Epic 10, Story 10.2
// Annule une suppression planifiee via le token recu par email
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logAudit } from '../_shared/audit.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const body = await req.json().catch(() => ({}));
  const { cancel_token } = body;

  if (!cancel_token || typeof cancel_token !== 'string') {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'cancel_token requis' } }, 422);
  }

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  // Trouver la suppression en attente avec ce token
  const { data: deletion, error } = await supabaseAdmin
    .from('account_deletions')
    .select('id, user_id, status, scheduled_at')
    .eq('cancel_token', cancel_token)
    .eq('status', 'pending')
    .maybeSingle();

  if (error || !deletion) {
    return json({ error: { code: 'TOKEN_INVALID', message: 'Lien d\'annulation invalide ou expire' } }, 404);
  }

  // Annuler la suppression
  await supabaseAdmin
    .from('account_deletions')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', deletion.id);

  // Debloquer le profil si bloque
  await supabaseAdmin
    .from('profiles')
    .update({ is_blocked: false, blocked_reason: null })
    .eq('user_id', deletion.user_id);

  // Log audit
  await logAudit(supabaseAdmin, {
    userId: deletion.user_id,
    action: 'auth.cancel_deletion',
    resourceType: 'profile',
    details: { deletion_id: deletion.id },
  });

  return json({
    data: {
      status: 'cancelled',
      message: 'La suppression de votre compte a ete annulee. Vous pouvez continuer a utiliser JIM.',
    },
  });
});
