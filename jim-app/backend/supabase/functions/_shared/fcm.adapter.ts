// Adaptateur FCM HTTP v1 — envoi de push notifications via Firebase Cloud Messaging.
// Auth OAuth2 service account (cf. ./fcm/access-token.ts).
// NFR18 : aucune donnée personnelle dans les payloads.

import { getFcmAccessToken } from './fcm/access-token.ts';

/**
 * Envoie une push notification via FCM HTTP v1.
 * Retourne false si le token est invalide (UNREGISTERED) — le service doit alors nettoyer le token.
 * Lève une exception pour toute autre erreur FCM.
 */
export async function sendFcmPush(
  fcmToken: string,
  title: string,
  body: string,
  data: Record<string, string>,
  priority: 'normal' | 'high' = 'normal',
): Promise<boolean> {
  const { token: accessToken, projectId } = await getFcmAccessToken();
  const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const response = await fetch(fcmUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        token: fcmToken,
        notification: { title, body },
        // data : uniquement des string (contrainte FCM) — pas de données personnelles (NFR18)
        data,
        android: {
          priority: priority === 'high' ? 'high' : 'normal',
        },
        apns: {
          headers: {
            'apns-priority': priority === 'high' ? '10' : '5',
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json() as {
      error?: { details?: Array<{ errorCode?: string }> };
    };
    // Token invalide ou désinstallation de l'app → signaler au service pour nettoyage
    if (error?.error?.details?.[0]?.errorCode === 'UNREGISTERED') {
      return false;
    }
    throw new Error(`FCM error: ${JSON.stringify(error)}`);
  }

  return true;
}
