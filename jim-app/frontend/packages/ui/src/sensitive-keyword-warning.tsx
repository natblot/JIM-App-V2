// Banniere avertissement mots-cles sensibles — Epic 10, Story 10.4
// Non-bloquant : informatif, pas alarmiste
import { View, Text, Pressable } from 'react-native';
import { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';
import { cn } from './utils/cn';

interface SensitiveKeywordWarningProps {
  visible: boolean;
  onReformulate?: () => void;
  onSendAnyway?: () => void;
  className?: string;
}

export function SensitiveKeywordWarning({
  visible,
  onReformulate,
  onSendAnyway,
  className,
}: SensitiveKeywordWarningProps) {
  if (!visible) return null;

  return (
    <AnimatedView
      entering={FadeInDown.duration(200)}
      exiting={FadeOutUp.duration(200)}
      className={cn('bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2', className)}
    >
      <Text className="text-amber-700 text-sm leading-relaxed mb-2">
        Cette information semble contenir des donnees de sante.
        Nous recommandons de ne mentionner que les dates et les infos pratiques.
      </Text>
      <View className="flex-row gap-3">
        {onReformulate && (
          <Pressable
            className="flex-1 bg-amber-100 rounded-lg py-2 min-h-[44px] justify-center"
            onPress={onReformulate}
            accessibilityRole="button"
            accessibilityLabel="Reformuler le message"
          >
            <Text className="text-center text-amber-800 font-medium text-sm">Reformuler</Text>
          </Pressable>
        )}
        {onSendAnyway && (
          <Pressable
            className="flex-1 border border-amber-200 rounded-lg py-2 min-h-[44px] justify-center"
            onPress={onSendAnyway}
            accessibilityRole="button"
            accessibilityLabel="Envoyer quand meme"
          >
            <Text className="text-center text-amber-600 text-sm">Envoyer quand meme</Text>
          </Pressable>
        )}
      </View>
    </AnimatedView>
  );
}
