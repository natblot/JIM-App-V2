// Edge Function export-data — Epic 10, Story 10.1
// Export RGPD exhaustif : collecte TOUTES les tables de l'utilisateur → JSON
// CHECKLIST EXHAUSTIVITE (si une table est ajoutee, l'ajouter ici) :
//   [x] profiles          [x] annonces           [x] candidatures
//   [x] conversations     [x] messages           [x] contrats
//   [x] paiements         [x] calendrier         [x] favoris
//   [x] notification_queue [x] abonnements_pro
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, tooManyRequestsResponse, rateLimitHeaders, RATE_LIMITS } from '../_shared/rate-limiter.ts';
import { logAudit, extractRequestInfo, AUDIT_ACTIONS } from '../_shared/audit.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json', ...extraHeaders } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const { ipAddress, userAgent } = extractRequestInfo(req);

  // Rate limiting : 1 export/jour
  const rateResult = await checkRateLimit(supabaseAdmin, user.id, ipAddress, RATE_LIMITS.exportData);
  if (!rateResult.allowed) return tooManyRequestsResponse(rateResult);

  try {
    // Collecter TOUTES les donnees personnelles
    const [
      profileRes,
      annoncesRes,
      candidaturesRes,
      conversationsRes,
      messagesRes,
      contratsRes,
      paiementsRes,
      calendrierRes,
      favorisRes,
      notificationsRes,
      abonnementsRes,
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('user_id', user.id).single(),
      supabaseAdmin.from('annonces').select('*').eq('profile_id', user.id),
      supabaseAdmin.from('candidatures').select('*').eq('remplacant_id', user.id),
      supabaseAdmin.from('conversations').select('*').or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`),
      supabaseAdmin.from('messages').select('*').eq('sender_id', user.id),
      supabaseAdmin.from('contrats').select('id, annonce_id, statut, donnees, clauses_obligatoires, clauses_optionnelles, created_at, updated_at, confirme_par_titulaire_at, confirme_par_remplacant_at').or(`titulaire_id.eq.${user.id},remplacant_id.eq.${user.id}`),
      supabaseAdmin.from('paiements').select('id, contrat_id, montant_encaisse_cents, taux_retrocession, montant_retrocession_cents, part_titulaire_cents, commission_jim_cents, montant_net_remplacant_cents, status, commission_type, created_at, paid_at').or(`titulaire_id.eq.${user.id},remplacant_id.eq.${user.id}`),
      supabaseAdmin.from('calendrier').select('*').eq('profile_id', user.id),
      supabaseAdmin.from('favoris').select('*').or(`titulaire_id.eq.${user.id},remplacant_id.eq.${user.id}`),
      supabaseAdmin.from('notification_queue').select('id, event_type, payload, created_at, status').eq('recipient_id', user.id),
      supabaseAdmin.from('abonnements_pro').select('id, status, current_period_start, current_period_end, cancel_at_period_end, created_at').eq('profile_id', user.id),
    ]);

    const exportData = {
      meta: {
        export_date: new Date().toISOString(),
        format_version: '1.0',
        user_id: user.id,
        description: 'Export RGPD — Toutes vos donnees personnelles stockees par JIM',
      },
      profil: profileRes.data ? {
        ...profileRes.data,
        // Base legale par donnee
        _base_legale: {
          rpps_number: 'interet_legitime',
          first_name: 'interet_legitime',
          last_name: 'interet_legitime',
          email: 'execution_contrat',
          phone: 'execution_contrat',
          specialties: 'consentement',
          city: 'consentement',
          bio: 'consentement',
        },
      } : null,
      annonces: annoncesRes.data ?? [],
      candidatures: candidaturesRes.data ?? [],
      conversations: conversationsRes.data ?? [],
      messages: messagesRes.data ?? [],
      contrats: contratsRes.data ?? [],
      paiements: paiementsRes.data ?? [],
      calendrier: calendrierRes.data ?? [],
      favoris: favorisRes.data ?? [],
      notifications: notificationsRes.data ?? [],
      abonnements: abonnementsRes.data ?? [],
    };

    // Stocker dans Supabase Storage avec URL signee 48h
    const fileName = `exports/${user.id}/${Date.now()}_export.json`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('rgpd-exports')
      .upload(fileName, JSON.stringify(exportData, null, 2), {
        contentType: 'application/json',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Generer URL signee (48h = 172800 secondes)
    const { data: signedUrl } = await supabaseAdmin.storage
      .from('rgpd-exports')
      .createSignedUrl(fileName, 172800);

    // Notifier l'utilisateur
    await supabaseAdmin.from('notification_queue').insert({
      recipient_id: user.id,
      event_type: 'EXPORT_DATA_READY',
      payload: { export_url: signedUrl?.signedUrl },
      priority: 'normal',
    });

    // Log audit
    await logAudit(supabaseAdmin, {
      userId: user.id,
      action: AUDIT_ACTIONS.AUTH_EXPORT_DATA,
      resourceType: 'profile',
      ipAddress,
      userAgent,
      details: { tables_exported: 11 },
    });

    return json(
      { data: { status: 'ready', download_url: signedUrl?.signedUrl, expires_in_hours: 48 } },
      200,
      rateLimitHeaders(rateResult),
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return json({ error: { code: 'EXPORT_ERROR', message } }, 500);
  }
});
