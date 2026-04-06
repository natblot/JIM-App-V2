// Edge Function moderate-content — Epic 12, Story 12.3
// Actions admin : suspendre compte, masquer contenu, rejeter signalement
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

  // Verifier role admin
  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const { data: adminProfile } = await supabaseAdmin.from('profiles').select('role').eq('user_id', user.id).single();
  if (adminProfile?.role !== 'admin') return json({ error: { code: 'FORBIDDEN', message: 'Acces refuse' } }, 403);

  const body = await req.json().catch(() => ({}));
  const { signalement_id, action, reason } = body;

  if (!signalement_id || !action || !['suspend', 'hide_content', 'dismiss'].includes(action)) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'signalement_id et action (suspend/hide_content/dismiss) requis' } }, 422);
  }

  const { ipAddress, userAgent } = extractRequestInfo(req);

  try {
    const { data: signalement } = await supabaseAdmin
      .from('signalements')
      .select('*')
      .eq('id', signalement_id)
      .single();

    if (!signalement) return json({ error: { code: 'NOT_FOUND', message: 'Signalement introuvable' } }, 404);

    if (action === 'suspend') {
      // Trouver le user du contenu signale
      let targetUserId: string | null = null;
      if (signalement.contenu_type === 'profile') targetUserId = signalement.contenu_id;
      else if (signalement.contenu_type === 'annonce') {
        const { data: a } = await supabaseAdmin.from('annonces').select('profile_id').eq('id', signalement.contenu_id).single();
        targetUserId = a?.profile_id;
      }

      if (targetUserId) {
        await supabaseAdmin.from('profiles').update({
          suspended: true, suspended_reason: reason ?? signalement.categorie, suspended_at: new Date().toISOString(),
        }).eq('user_id', targetUserId);
      }

      await logAudit(supabaseAdmin, {
        userId: user.id, action: 'admin.suspend', resourceType: 'profile', resourceId: targetUserId ?? undefined,
        ipAddress, userAgent, details: { signalement_id, reason },
      });
    }

    if (action === 'hide_content') {
      const table = signalement.contenu_type === 'annonce' ? 'annonces' : signalement.contenu_type === 'message' ? 'messages' : null;
      if (table) {
        await supabaseAdmin.from(table).update({ hidden: true }).eq('id', signalement.contenu_id);
      }

      await logAudit(supabaseAdmin, {
        userId: user.id, action: 'admin.hide_content', resourceType: signalement.contenu_type, resourceId: signalement.contenu_id,
        ipAddress, userAgent, details: { signalement_id },
      });
    }

    if (action === 'dismiss') {
      await logAudit(supabaseAdmin, {
        userId: user.id, action: 'admin.dismiss_report', resourceType: 'signalement', resourceId: signalement_id,
        ipAddress, userAgent,
      });
    }

    // Mettre a jour le signalement
    await supabaseAdmin.from('signalements').update({
      status: 'traite', action_prise: action, traite_par: user.id, traite_at: new Date().toISOString(),
    }).eq('id', signalement_id);

    return json({ data: { status: 'traite', action } });
  } catch (err: unknown) {
    return json({ error: { code: 'SYSTEM_ERROR', message: err instanceof Error ? err.message : 'Erreur interne' } }, 500);
  }
});
