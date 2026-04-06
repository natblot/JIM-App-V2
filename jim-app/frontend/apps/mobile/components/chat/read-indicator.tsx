// Indicateur de lecture des messages — pending / sent / read
// Crossfade 200ms entre les états via Reanimated
import { ActivityIndicator, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export interface ReadIndicatorProps {
  status: 'pending' | 'sent' | 'read';
}

export function ReadIndicator({ status }: ReadIndicatorProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      className="flex-row items-center"
      accessibilityLabel={
        status === 'pending'
          ? 'Envoi en cours'
          : status === 'sent'
          ? 'Message envoyé'
          : 'Message lu'
      }
    >
      {status === 'pending' && (
        <ActivityIndicator size="small" color="#888" style={{ transform: [{ scale: 0.6 }] }} />
      )}
      {status === 'sent' && (
        <Text className="text-jim-muted text-xs">✓</Text>
      )}
      {status === 'read' && (
        <Text className="text-jim-primary text-xs">✓✓</Text>
      )}
    </Animated.View>
  );
}
