// Bulle de message — envoyé (droite, fond jim-primary) ou reçu (gauche, fond jim-surface)
// Animations Reanimated 3.x — SlideInRight (envoyé) / FadeIn (reçu) + withSpring scale
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  SlideInRight,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { ReadIndicator } from './read-indicator';
import { PhishingWarning } from './phishing-warning';

export interface MessageBubbleProps {
  content: string;
  isSent: boolean;            // true = envoyé par moi, false = reçu
  isSystemMessage: boolean;
  createdAt: string;
  readAt: string | null;
  isPending?: boolean;        // message offline en attente
  containsLinks?: boolean;
  domain?: string;            // domaine extrait du lien si containsLinks
  isLinkBlocked?: boolean;    // si le lien a été bloqué
  onReport?: () => void;
}

// Styles de border radius asymétriques (queue de bulle) — non supportés par NativeWind
const styles = StyleSheet.create({
  bubbleSent: {
    borderRadius: 16,
    borderBottomRightRadius: 4,  // "queue" côté envoyeur
  },
  bubbleReceived: {
    borderRadius: 16,
    borderBottomLeftRadius: 4,   // "queue" côté receveur
  },
});

// Formate l'heure d'envoi au format HH:MM
function formatTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// Calcule le statut de lecture pour ReadIndicator
function getReadStatus(
  isPending: boolean,
  readAt: string | null
): 'pending' | 'sent' | 'read' {
  if (isPending) return 'pending';
  if (readAt) return 'read';
  return 'sent';
}

export function MessageBubble({
  content,
  isSent,
  isSystemMessage,
  createdAt,
  readAt,
  isPending = false,
  containsLinks = false,
  domain,
  isLinkBlocked = false,
  onReport,
}: MessageBubbleProps) {
  // Animation d'échelle spring pour les messages envoyés (0.95 → 1)
  const scale = useSharedValue(isSent ? 0.95 : 1);

  useEffect(() => {
    if (isSent) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  }, [isSent, scale]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Rendu simplifié pour les messages système
  if (isSystemMessage) {
    return (
      <View
        className="items-center px-4 py-2"
        accessibilityRole="text"
        accessibilityLabel={content}
      >
        <Text className="text-jim-muted text-sm italic text-center">{content}</Text>
      </View>
    );
  }

  return (
    <View className={['mb-2 px-3', isSent ? 'items-end' : 'items-start'].join(' ')}>
      {/* Bulle principale avec animation d'entrée + scale spring */}
      <Animated.View
        entering={isSent ? SlideInRight.duration(150) : FadeIn.duration(200)}
        style={[
          isSent ? styles.bubbleSent : styles.bubbleReceived,
          isSent ? scaleStyle : undefined,
        ]}
        className={[
          'max-w-[80%] px-4 py-2.5',
          isSent
            ? 'bg-jim-primary'                              // envoyé : fond bleu
            : 'bg-jim-surface border border-jim-border',    // reçu : fond blanc + bordure
        ].join(' ')}
        accessibilityRole="text"
        accessibilityLabel={`${isSent ? 'Vous' : 'Participant'} : ${content}`}
      >
        <Text
          className={['text-base leading-5', isSent ? 'text-white' : 'text-jim-text'].join(' ')}
          selectable
        >
          {content}
        </Text>
      </Animated.View>

      {/* Horodatage + indicateur de lecture (côté envoyé uniquement) */}
      <View
        className={[
          'flex-row items-center gap-1.5 mt-0.5 px-1',
          isSent ? 'flex-row-reverse' : 'flex-row',
        ].join(' ')}
      >
        <Text className="text-jim-muted text-[10px]">{formatTime(createdAt)}</Text>
        {isSent && (
          <ReadIndicator status={getReadStatus(isPending, readAt)} />
        )}
      </View>

      {/* Avertissement de lien phishing inline sous la bulle */}
      {containsLinks && domain && onReport && (
        <PhishingWarning
          domain={domain}
          isBlocked={isLinkBlocked}
          onReport={onReport}
        />
      )}
    </View>
  );
}
