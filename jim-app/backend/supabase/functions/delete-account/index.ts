// Edge Function delete-account — Epic 10, Story 10.2
// Deux modes :
//   1. POST avec auth user → planifie la suppression (J+30)
//   2. POST avec service_role + deletion_id → execute la suppression (appele par pg_cron)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logAudit, extractRequestInfo, AUDIT_ACTIONS } from '../_shared/audit.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const body = await req.json().catch(() => ({}));

  // Mode 2 : execution par pg_cron — l'appelant doit presenter la service_role_key en Authorization
  if (body.deletion_id) {
    const callerAuth = req.headers.get('Authorization');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (!callerAuth || callerAuth !== `Bearer ${serviceRoleKey}`) {
      return json({ error: { code: 'FORBIDDEN', message: 'Acces reserve au service interne' } }, 403);
    }
    return await executeDeletion(supabaseAdmin, body.deletion_id);
  }

  // Mode 1 : planification par l'utilisateur
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const { ipAddress, userAgent } = extractRequestInfo(req);

  // Verifier confirmation explicite
  if (body.confirmation !== 'SUPPRIMER') {
    return json({ error: { code: 'CONFIRMATION_REQUIRED', message: 'Tapez SUPPRIMER pour confirmer' } }, 422);
  }

  // Verifier qu'il n'y a pas deja une suppression en cours
  const { data: existing } = await supabaseAdmin
    .from('account_deletions')
    .select('id, status, scheduled_at')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .maybeSingle();

  if (existing) {
    return json({ error: { code: 'DELETION_ALREADY_PENDING', message: 'Une suppression est deja planifiee' } }, 409);
  }

  try {
    // Planifier la suppression dans 30 jours
    const { data: deletion, error: insertError } = await supabaseAdmin
      .from('account_deletions')
      .insert({ user_id: user.id })
      .select('id, scheduled_at, cancel_token')
      .single();

    if (insertError) throw insertError;

    // Log audit
    await logAudit(supabaseAdmin, {
      userId: user.id,
      action: AUDIT_ACTIONS.AUTH_DELETE_ACCOUNT,
      resourceType: 'profile',
      ipAddress,
      userAgent,
      details: { scheduled_at: deletion.scheduled_at, status: 'requested' },
    });

    // Notifier l'utilisateur
    await supabaseAdmin.from('notification_queue').insert({
      recipient_id: user.id,
      event_type: 'ACCOUNT_DELETION_SCHEDULED',
      payload: { scheduled_at: deletion.scheduled_at },
      priority: 'high',
    });

    return json({
      data: {
        status: 'scheduled',
        scheduled_at: deletion.scheduled_at,
        message: 'Votre compte sera supprime dans 30 jours. Vous avez recu un email pour annuler.',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return json({ error: { code: 'DELETE_ERROR', message } }, 500);
  }
});

// Execution de la suppression (anonymisation)
async function executeDeletion(supabaseAdmin: ReturnType<typeof createClient>, deletionId: string): Promise<Response> {
  const { data: deletion, error } = await supabaseAdmin
    .from('account_deletions')
    .select('id, user_id, status')
    .eq('id', deletionId)
    .single();

  if (error || !deletion) return json({ error: { code: 'DELETION_NOT_FOUND', message: 'Suppression introuvable' } }, 404);
  if (deletion.status !== 'pending') return json({ data: { status: 'already_processed' } });

  const userId = deletion.user_id;

  try {
    // 1. Anonymiser le profil (PAS de DELETE — integrinte referentielle)
    await supabaseAdmin
      .from('profiles')
      .update({
        first_name: 'Un',
        last_name: 'kinesitherapeute verifie',
        email: `deleted-${userId.slice(0, 8)}@jim.app`,
        phone: null,
        avatar_url: null,
        bio: null,
        city: null,
        department: null,
        region: null,
        specialties: [],
        rpps_number: null,
        rpps_verified: false,
        stripe_account_id: null,
        stripe_onboarding_status: 'not_started',
        is_pro: false,
        is_blocked: true,
        blocked_reason: 'account_deleted',
      })
      .eq('user_id', userId);

    // 2. Supprimer le contenu des messages (garder la structure)
    await supabaseAdmin
      .from('messages')
      .update({ content: '[Message supprime]' })
      .eq('sender_id', userId);

    // 3. Supprimer calendrier
    await supabaseAdmin.from('calendrier').delete().eq('profile_id', userId);

    // 4. Supprimer favoris
    await supabaseAdmin.from('favoris').delete().or(`titulaire_id.eq.${userId},remplacant_id.eq.${userId}`);

    // 5. Supprimer candidatures (sauf celles liees a des contrats)
    await supabaseAdmin
      .from('candidatures')
      .delete()
      .eq('remplacant_id', userId)
      .not('statut', 'eq', 'acceptee');

    // 6. Paiements et abonnements_pro : CONSERVER 6 ans (obligation fiscale)
    // Seul l'anonymisation du profil suffit — les montants et IDs Stripe restent

    // 7. Annonces pourvues : anonymiser (les actives sont fermees)
    await supabaseAdmin
      .from('annonces')
      .update({ statut: 'expiree' })
      .eq('profile_id', userId)
      .in('statut', ['active', 'en_cours']);

    // 8. Marquer la suppression comme executee
    await supabaseAdmin
      .from('account_deletions')
      .update({ status: 'executed', executed_at: new Date().toISOString() })
      .eq('id', deletionId);

    // 9. Desactiver le compte auth
    await supabaseAdmin.auth.admin.deleteUser(userId);

    // 10. Log audit
    await logAudit(supabaseAdmin, {
      userId,
      action: AUDIT_ACTIONS.AUTH_DELETE_ACCOUNT,
      resourceType: 'profile',
      details: { status: 'executed', deletion_id: deletionId },
    });

    return json({ data: { status: 'executed', user_id: userId } });
  } catch (err: unknown) {
    console.error('Delete account execution error:', err);
    return json({ error: { code: 'EXECUTION_ERROR', message: 'Erreur lors de la suppression' } }, 500);
  }
}
