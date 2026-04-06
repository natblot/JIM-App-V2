// Avertissement incompatibilité — Epic 5, Story 5.2
// Avertissement non-bloquant affiché avant la candidature si des incompatibilités sont détectées
import { View, Text, Pressable } from 'react-native';
import { FadeIn } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';

interface Warning {
  type: string;
  detail: string;
}

interface IncompatibilityWarningProps {
  warnings: Warning[];
  onContinue: () => void;
  onCancel: () => void;
}

export function IncompatibilityWarning({
  warnings,
  onContinue,
  onCancel,
}: IncompatibilityWarningProps) {
  return (
    <AnimatedView
      entering={FadeIn.duration(200)}
      className="bg-jim-accent/15 border border-jim-accent/40 rounded-2xl p-5 gap-4"
      accessibilityLiveRegion="assertive"
    >
      {/* En-tête */}
      <View className="flex-row items-start gap-3">
        <Text className="text-2xl" aria-hidden>⚠️</Text>
        <View className="flex-1 gap-1">
          <Text className="text-jim-text font-bold text-base">
            Petite incompatibilité détectée
          </Text>
          <Text className="text-jim-muted text-sm leading-5">
            Ça ne vous empêche pas de candidater — vous pouvez continuer ou annuler.
          </Text>
        </View>
      </View>

      {/* Liste des incompatibilités */}
      {warnings.length > 0 && (
        <View className="gap-2">
          {warnings.map((warning, index) => (
            <View
              key={index}
              className="flex-row items-start gap-2 bg-jim-accent/10 rounded-xl px-3 py-2.5"
            >
              <Text className="text-jim-accent text-xs mt-0.5">•</Text>
              <View className="flex-1">
                <Text className="text-jim-text text-sm font-medium">{warning.type}</Text>
                <Text className="text-jim-muted text-xs mt-0.5 leading-4">{warning.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View className="gap-2">
        <Pressable
          className="h-12 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Candidater quand même malgré l'incompatibilité"
        >
          <Text className="text-white font-semibold">Candidater quand même</Text>
        </Pressable>

        <Pressable
          className="h-11 min-w-[44px] rounded-xl border border-jim-border items-center justify-center active:opacity-70"
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Annuler et revenir"
        >
          <Text className="text-jim-muted font-medium">Annuler</Text>
        </Pressable>
      </View>
    </AnimatedView>
  );
}
