// Service de dispatch des notifications — Epic 7
// Gère le cycle de vie complet : envoi, retry, fallback email, groupement

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendFcmPush } from './fcm.adapter.ts';

// Limite quotidienne de pushs par utilisateur (NFR : pas de spam)
const DAILY_PUSH_LIMIT = 3;
// Nombre maximum de tentatives avant passage à 'failed'
const MAX_RETRY = 3;

// ----------------------------------------------------------------
// Types internes
// ----------------------------------------------------------------

interface NotificationRow {
  id: string;
  recipient_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  scheduled_at: string;
  status: string;
  retry_count: number;
  channel: string | null;
  priority: string;
}

interface ProfilePrefs {
  fcm_token: string | null;
  push_token: string | null;
  push_token_type: 'fcm' | 'expo';
  push_annonces: boolean;
  push_candidatures: boolean;
  push_messages: boolean;
  push_paused: boolean;
  daily_push_count: number;
}

// ----------------------------------------------------------------
// API publique
// ----------------------------------------------------------------

/**
 * Dispatche une notification unique par son identifiant.
 * Appelé par le trigger immédiat (migration 037).
 */
export async function dispatchNotification(
  supabase: SupabaseClient,
  notificationId: string,
): Promise<void> {
  const { data: notif, error } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('id', notificationId)
    .eq('status', 'pending')
    .single();

  if (error || !notif) return;

  await processNotification(supabase, notif as NotificationRow);
}

/**
 * Dispatche toutes les notifications pending dont scheduled_at <= now().
 * Appelé par pg_cron toutes les 5 minutes.
 */
export async function dispatchBatch(supabase: SupabaseClient): Promise<void> {
  const { data: notifs, error } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(100);

  if (error || !notifs) return;

  // Traitement séquentiel pour éviter la surcharge FCM
  for (const notif of notifs as NotificationRow[]) {
    await processNotification(supabase, notif);
  }
}

// ----------------------------------------------------------------
// Logique de traitement
// ----------------------------------------------------------------

async function processNotification(
  supabase: SupabaseClient,
  notif: NotificationRow,
): Promise<void> {
  // Récupère les préférences push du destinataire
  const { data: profile } = await supabase
    .from('profiles')
    .select('fcm_token, push_token, push_token_type, push_annonces, push_candidatures, push_messages, push_paused, daily_push_count')
    .eq('user_id', notif.recipient_id)
    .single();

  if (!profile) {
    await markStatus(supabase, notif.id, 'skipped', 'Profil introuvable');
    return;
  }

  const prefs = profile as ProfilePrefs;

  // Vérifie si la préférence correspondant à l'event_type est active
  if (!isPushEnabled(prefs, notif.event_type)) {
    await markStatus(supabase, notif.id, 'skipped', 'Préférence push désactivée');
    return;
  }

  // Résoudre le token push (push_token prioritaire, fallback fcm_token)
  const resolvedToken = prefs.push_token ?? prefs.fcm_token;
  const tokenType = prefs.push_token ? prefs.push_token_type : 'fcm';

  // Pas de token → fallback email (MVP : log uniquement)
  if (!resolvedToken) {
    await handleEmailFallback(supabase, notif);
    return;
  }

  // Limite quotidienne atteinte → notification groupée à la place
  if (prefs.daily_push_count >= DAILY_PUSH_LIMIT) {
    await sendGroupedNotification(supabase, notif, resolvedToken, tokenType);
    return;
  }

  // Envoi push (FCM ou Expo Push Service selon le type de token)
  const { title, body, data } = buildFcmPayload(notif);
  const priority = notif.priority === 'high' ? 'high' : 'normal';

  try {
    const success = tokenType === 'expo'
      ? await sendExpoPush(resolvedToken, title, body, data)
      : await sendFcmPush(resolvedToken, title, body, data, priority);

    if (success) {
      await markStatus(supabase, notif.id, 'sent');
      await supabase
        .from('profiles')
        .update({
          daily_push_count: prefs.daily_push_count + 1,
          last_push_sent_at: new Date().toISOString(),
        })
        .eq('user_id', notif.recipient_id);
    } else {
      // Token invalide → nettoyer et passer à email
      await supabase
        .from('profiles')
        .update({ push_token: null, fcm_token: null })
        .eq('user_id', notif.recipient_id);
      await handleEmailFallback(supabase, notif);
    }
  } catch (err) {
    await handleRetry(supabase, notif, err instanceof Error ? err.message : String(err));
  }
}

/**
 * Vérifie si la préférence push est active pour un event_type donné.
 */
function isPushEnabled(prefs: ProfilePrefs, eventType: string): boolean {
  if (prefs.push_paused) return false;

  // Annonces : ANNONCE_* et CALENDRIER_OUTDATED
  if (
    eventType.startsWith('ANNONCE_') ||
    eventType === 'CALENDRIER_OUTDATED'
  ) {
    return prefs.push_annonces;
  }

  // Candidatures : CANDIDATURE_* et RELANCE_*
  if (
    eventType.startsWith('CANDIDATURE_') ||
    eventType.startsWith('RELANCE_') ||
    eventType === 'POST_REMPLACEMENT_NOTATION'
  ) {
    return prefs.push_candidatures;
  }

  // Messages
  if (eventType === 'MESSAGE_RECU') {
    return prefs.push_messages;
  }

  // Notifications groupées et système : toujours envoyées (sauf pause globale)
  return true;
}

/**
 * Construit le payload FCM selon l'event_type.
 * NFR18 : aucune donnée personnelle dans les titres/body.
 */
function buildFcmPayload(
  notif: NotificationRow,
): { title: string; body: string; data: Record<string, string> } {
  const p = notif.payload;

  switch (notif.event_type) {
    case 'ANNONCE_CREEE':
      return {
        title: 'Nouvelle annonce disponible',
        body: 'Une annonce correspond à vos critères — ouvrez JIM',
        data: { deep_link: `annonces/${String(p.annonce_id ?? '')}` },
      };

    case 'ANNONCE_URGENTE':
      return {
        title: 'Annonce urgente disponible',
        body: 'Une annonce urgente correspond à vos critères — ouvrez JIM',
        data: { deep_link: `annonces/${String(p.annonce_id ?? '')}` },
      };

    case 'CANDIDATURE_RECUE':
      return {
        title: 'Candidature reçue',
        body: 'Un remplaçant a postulé à votre annonce',
        data: { deep_link: 'mes-annonces' },
      };

    case 'CANDIDATURE_ACCEPTEE':
      return {
        title: 'Candidature acceptée !',
        body: 'Votre candidature a été retenue',
        data: { deep_link: `conversations/${String(p.conversation_id ?? '')}` },
      };

    case 'CANDIDATURE_REFUSEE':
    case 'CANDIDATURE_NON_RETENUE':
      return {
        title: 'Candidature',
        body: 'Le titulaire a choisi un autre profil',
        data: { deep_link: 'recherche' },
      };

    case 'MESSAGE_RECU':
      return {
        title: 'Nouveau message',
        body: 'Vous avez reçu un message',
        data: { deep_link: `conversations/${String(p.conversation_id ?? '')}` },
      };

    case 'RELANCE_CANDIDATURE_J2':
    case 'RELANCE_CANDIDATURE_J5':
      return {
        title: 'Candidature en attente',
        body: 'Vous avez une candidature non traitée',
        data: { deep_link: 'mes-annonces' },
      };

    case 'CALENDRIER_OUTDATED':
      return {
        title: 'Mettez à jour votre calendrier',
        body: 'Vos disponibilités expirent bientôt',
        data: { deep_link: 'calendrier' },
      };

    case 'POST_REMPLACEMENT_NOTATION':
      return {
        title: 'Évaluez votre remplacement',
        body: 'Donnez votre avis sur ce remplacement terminé',
        data: { deep_link: `remplacements/${String(p.remplacement_id ?? '')}` },
      };

    case 'NOTIFICATION_GROUPED':
      return {
        title: 'Nouvelles notifications',
        body: `${String(p.count ?? '')} nouvelles notifications — ouvrez JIM`,
        data: { deep_link: '/' },
      };

    default:
      return {
        title: 'JIM',
        body: 'Vous avez une nouvelle notification',
        data: { deep_link: '/' },
      };
  }
}

/**
 * Envoie un push via Expo Push Service (pour les tokens ExponentPushToken[xxx]).
 */
async function sendExpoPush(
  token: string,
  title: string,
  body: string,
  data: Record<string, string>,
): Promise<boolean> {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: token,
      title,
      body,
      data,
      sound: 'default',
    }),
  });

  if (!response.ok) return false;

  const result = await response.json();
  // Expo renvoie { data: { status: 'ok' } } en cas de succès
  return result?.data?.status === 'ok';
}

/**
 * Envoie une notification groupée quand la limite quotidienne est atteinte.
 * Remplace toutes les notifications pending du jour par un seul push résumé.
 */
async function sendGroupedNotification(
  supabase: SupabaseClient,
  notif: NotificationRow,
  pushToken: string,
  tokenType: 'fcm' | 'expo',
): Promise<void> {
  const { count } = await supabase
    .from('notification_queue')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', notif.recipient_id)
    .eq('status', 'pending');

  const groupCount = (count ?? 1) + 1;
  const title = 'Nouvelles notifications';
  const body = `${groupCount} nouvelles notifications — ouvrez JIM`;
  const data = { deep_link: '/' };

  try {
    const success = tokenType === 'expo'
      ? await sendExpoPush(pushToken, title, body, data)
      : await sendFcmPush(pushToken, title, body, data, 'normal');

    if (success) {
      await markStatus(supabase, notif.id, 'skipped', 'Groupée dans la notification résumée');
    } else {
      await handleRetry(supabase, notif, 'Push groupé échoué');
    }
  } catch (err) {
    await handleRetry(supabase, notif, err instanceof Error ? err.message : String(err));
  }
}

/**
 * Fallback email quand aucun token FCM n'est disponible.
 * MVP : log uniquement — Phase 2 : Supabase Auth sendEmail.
 */
async function handleEmailFallback(
  supabase: SupabaseClient,
  notif: NotificationRow,
): Promise<void> {
  // MVP : on passe en 'skipped' avec la raison — l'email digest sera géré par une Edge Function dédiée
  await markStatus(supabase, notif.id, 'skipped', 'Pas de token FCM — email digest en attente');
}

/**
 * Gère le retry avec backoff exponentiel (30s × retry_count²).
 * Après MAX_RETRY tentatives, passe à 'failed'.
 */
async function handleRetry(
  supabase: SupabaseClient,
  notif: NotificationRow,
  errorMessage: string,
): Promise<void> {
  const newRetryCount = notif.retry_count + 1;

  if (newRetryCount >= MAX_RETRY) {
    await markStatus(supabase, notif.id, 'failed', errorMessage);
    return;
  }

  // Backoff exponentiel : 30s, 120s, 270s
  const delaySeconds = 30 * Math.pow(newRetryCount, 2);
  const nextAttempt = new Date(Date.now() + delaySeconds * 1000).toISOString();

  await supabase
    .from('notification_queue')
    .update({
      retry_count: newRetryCount,
      error_message: errorMessage,
      scheduled_at: nextAttempt,
    })
    .eq('id', notif.id);
}

/**
 * Met à jour le statut d'une notification dans notification_queue.
 */
async function markStatus(
  supabase: SupabaseClient,
  notifId: string,
  status: 'sent' | 'failed' | 'skipped',
  errorMessage?: string,
): Promise<void> {
  await supabase
    .from('notification_queue')
    .update({
      status,
      ...(errorMessage ? { error_message: errorMessage } : {}),
    })
    .eq('id', notifId);
}
