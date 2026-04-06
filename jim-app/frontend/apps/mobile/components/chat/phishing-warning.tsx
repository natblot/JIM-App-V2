// Avertissement de lien suspect — Epic 6 sécurité messagerie
// Bannière orange avec option de signalement
import { View, Text, Pressable } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

export interface PhishingWarningProps {
  domain: string;
  isBlocked: boolean;
  onReport: () => void;
}

export function PhishingWarning({ domain, isBlocked, onReport }: PhishingWarningProps) {
  return (
    <Animated.View
      entering={SlideInDown.duration(200)}
      className="mx-2 mt-1 rounded-xl border border-jim-accent bg-jim-accent/20 px-3 py-2.5"
      accessibilityRole="alert"
      accessibilityLabel={
        isBlocked
          ? `Lien suspect bloqué : ${domain}`
          : `Ce message contient un lien externe : ${domain}`
      }
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 gap-0.5">
          {/* Icône + titre */}
          <Text className="text-jim-accent font-semibold text-sm">
            {isBlocked ? '⚠️ Ce lien semble suspect et a été bloqué' : '⚠️ Ce message contient un lien externe'}
          </Text>

          {/* Domaine en gras */}
          <Text className="text-jim-text text-xs">
            Domaine : <Text className="font-bold">{domain}</Text>
          </Text>
        </View>

        {/* Bouton signaler */}
        <Pressable
          className="min-h-[44px] min-w-[44px] items-center justify-center px-2 active:opacity-70"
          onPress={onReport}
          accessibilityRole="button"
          accessibilityLabel={`Signaler le domaine ${domain}`}
        >
          <Text className="text-jim-destructive text-xs font-semibold">Signaler</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
