// Gestionnaire de notifications push — Epic 7, Story 7.x
// À monter dans _layout.tsx (racine) pour être actif dès le démarrage de l'app
// Gère deux cas : notification reçue en foreground + tap sur notification (background/killed)
// Supporte Expo Push Token (Expo Go) et FCM natif (dev build/production)
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

// Comportement des notifications en foreground :
// - shouldShowAlert: false → on gère nous-mêmes la bannière in-app (meilleure UX)
// - shouldPlaySound: true → feedback sonore conservé
// - shouldSetBadge: true → badge icône mis à jour automatiquement
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Nom de l'événement custom — permet au NotificationBanner (futur composant) de s'abonner
export const FOREGROUND_NOTIFICATION_EVENT = 'jim:foreground-notification';

export function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    // Listener foreground — notification reçue pendant que l'app est ouverte
    // Émet un événement DOM custom pour que NotificationBanner puisse afficher la bannière in-app
    const foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
      const event = new CustomEvent(FOREGROUND_NOTIFICATION_EVENT, {
        detail: {
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
        },
      });
      // Dispatch sur globalThis pour React Native — pas de window natif
      // Les composants écoutant cet événement via addEventListener peuvent réagir
      if (typeof globalThis !== 'undefined') {
        (globalThis as typeof globalThis & EventTarget).dispatchEvent?.(event);
      }
    });

    // Listener tap — l'utilisateur a tapé sur une notification (app en background ou fermée)
    // Utilise le deep_link depuis le payload pour naviguer via Expo Router
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const deepLink = response.notification.request.content.data?.deep_link as string | undefined;

      if (deepLink) {
        // Délai de 300ms — laisse le temps à l'app de s'initialiser avant la navigation
        // notamment lors d'un cold start (app était fermée)
        setTimeout(() => {
          router.push(deepLink as Parameters<typeof router.push>[0]);
        }, 300);
      }
    });

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, [router]);

  // Composant purement fonctionnel — aucun rendu visuel
  return null;
}

/**
 * Enregistre le device pour les push notifications et retourne le token.
 * Expo Go → Expo Push Token (ExponentPushToken[xxx])
 * Dev Build / Production → Device Push Token (FCM/APNs)
 */
export async function registerForPushNotifications(): Promise<{
  token: string;
  type: 'expo' | 'fcm';
} | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  const isExpo = Constants.appOwnership === 'expo';

  if (isExpo) {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return { token: expoPushToken.data, type: 'expo' };
  }

  // Dev build / Production → token FCM ou APNs natif
  const deviceToken = await Notifications.getDevicePushTokenAsync();
  return {
    token: Platform.OS === 'ios' ? deviceToken.data : deviceToken.data,
    type: 'fcm',
  };
}
