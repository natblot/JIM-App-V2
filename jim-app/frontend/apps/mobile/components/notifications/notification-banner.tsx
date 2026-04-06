// Bannière in-app pour les notifications foreground — Epic 7
// Slide depuis le haut, auto-dismiss après 5s, deep link navigation au tap
// S'abonne à l'événement émis par NotificationHandler (FOREGROUND_NOTIFICATION_EVENT)
import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { FOREGROUND_NOTIFICATION_EVENT } from './notification-handler';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface InAppNotification {
  title: string;
  body: string;
  deepLink?: string;
}

export interface NotificationBannerProps {
  notification: InAppNotification | null;
  onDismiss: () => void;
  onPress?: () => void;
}

// ---------------------------------------------------------------------------
// Composant de présentation (contrôlé par le parent ou le hook ci-dessous)
// ---------------------------------------------------------------------------
export function NotificationBanner({
  notification,
  onDismiss,
  onPress,
}: NotificationBannerProps) {
  if (!notification) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18).stiffness(160)}
      exiting={SlideOutUp.duration(200)}
      // Position absolue en haut de l'écran, au-dessus du contenu
      className="absolute top-0 left-0 right-0 z-50"
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Pressable
        className="mx-3 mt-14 bg-jim-surface rounded-2xl shadow-lg border-b border-jim-border
                   flex-row items-center px-4 py-3 gap-3 active:bg-jim-background"
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${notification.title} — ${notification.body}. Appuyer pour ouvrir.`}
      >
        {/* Icône JIM à gauche — taille fixe 40×40 (dans zone tap ample) */}
        <View
          className="w-10 h-10 rounded-xl bg-jim-primary/20 items-center justify-center shrink-0"
          accessibilityElementsHidden
        >
          <Text className="text-xl">🩺</Text>
        </View>

        {/* Titre + body */}
        <View className="flex-1 gap-0.5">
          <Text
            className="text-jim-text font-semibold text-sm leading-5"
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            className="text-jim-muted text-sm leading-5"
            numberOfLines={2}
          >
            {notification.body}
          </Text>
        </View>

        {/* Bouton fermer — zone tap 44×44 (NFR45) */}
        <Pressable
          className="w-11 h-11 items-center justify-center rounded-xl active:bg-jim-background shrink-0"
          onPress={onDismiss}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Fermer la notification"
        >
          <Text className="text-jim-muted text-base font-medium">✕</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Hook intégré : écoute FOREGROUND_NOTIFICATION_EVENT et gère le auto-dismiss
// Usage : const bannerProps = useNotificationBanner();
//         <NotificationBanner {...bannerProps} />
// ---------------------------------------------------------------------------
export function useNotificationBanner() {
  const router = useRouter();
  const [notification, setNotification] = useState<InAppNotification | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  // S'abonner à l'événement custom émis par NotificationHandler
  useEffect(() => {
    const handleEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        title: string | null;
        body: string | null;
        data: Record<string, unknown>;
      }>;

      const { title, body, data } = customEvent.detail;

      // Ignorer les notifications sans titre ni corps
      if (!title && !body) return;

      setNotification({
        title: title ?? 'JIM',
        body: body ?? '',
        deepLink: data?.deep_link as string | undefined,
      });

      // Auto-dismiss après 5 secondes
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => {
        setNotification(null);
      }, 5_000);
    };

    if (typeof globalThis !== 'undefined') {
      (globalThis as typeof globalThis & EventTarget).addEventListener?.(
        FOREGROUND_NOTIFICATION_EVENT,
        handleEvent
      );
    }

    return () => {
      if (typeof globalThis !== 'undefined') {
        (globalThis as typeof globalThis & EventTarget).removeEventListener?.(
          FOREGROUND_NOTIFICATION_EVENT,
          handleEvent
        );
      }
    };
  }, []);

  const onDismiss = () => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setNotification(null);
  };

  const onPress = () => {
    if (notification?.deepLink) {
      router.push(notification.deepLink as Parameters<typeof router.push>[0]);
    }
    onDismiss();
  };

  return { notification, onDismiss, onPress };
}
