// Empty State — Epic 4, Story 4.6
// 4 variantes contextuelles avec ton bienveillant (collègue kinésithérapeute)
import { View, Text, Pressable } from 'react-native';
import { FadeIn, SlideInUp } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';

export type EmptyStateVariant =
  | 'no-results'   // Aucun résultat avec filtres actifs
  | 'empty-zone'   // Zone rurale sans annonces
  | 'empty-map'    // Carte vide
  | 'offline';     // Hors ligne sans cache

export interface EmptyStateProps {
  variant: EmptyStateVariant;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

// Configuration par variante
const VARIANT_CONFIG = {
  'no-results': {
    icon: '🔍',
    title: 'Aucune annonce ne correspond à vos critères',
    subtitle:
      "Essayez d'élargir votre zone ou de modifier vos filtres",
    primaryCta: 'Réinitialiser les filtres',
    secondaryCta: 'Créer une alerte',
  },
  'empty-zone': {
    icon: '📍',
    title: "Pas encore d'annonces dans votre zone",
    subtitle:
      "On sait que c'est pas facile en zone rurale — on travaille dessus",
    primaryCta: 'Élargir la zone',
    secondaryCta: 'Créer une alerte',
  },
  'empty-map': {
    icon: '📍',
    title: "Pas encore d'annonces ici",
    subtitle:
      'Élargissez votre zone de recherche ou créez une alerte',
    primaryCta: 'Créer une alerte',
    secondaryCta: undefined,
  },
  offline: {
    icon: '📵',
    title: 'Vous êtes hors ligne',
    subtitle:
      'Connectez-vous à Internet pour découvrir les annonces disponibles près de chez vous',
    primaryCta: undefined,
    secondaryCta: undefined,
  },
} as const;

export function EmptyState({
  variant,
  onPrimaryAction,
  onSecondaryAction,
}: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <AnimatedView
      entering={FadeIn.duration(400).delay(50).springify().damping(20)}
      className="flex-1 items-center justify-center px-8 py-16"
      accessibilityLiveRegion="polite"
    >
      {/* Icône animée séparément pour l'effet de slide */}
      <AnimatedView
        entering={SlideInUp.duration(400).delay(100).springify().damping(18)}
        className="mb-6"
      >
        <Text
          className="text-6xl text-center"
          aria-hidden
        >
          {config.icon}
        </Text>
      </AnimatedView>

      {/* Titre */}
      <Text className="text-jim-text font-bold text-xl text-center leading-tight mb-3">
        {config.title}
      </Text>

      {/* Sous-titre */}
      <Text className="text-jim-muted text-base text-center leading-6 mb-8">
        {config.subtitle}
      </Text>

      {/* CTAs — pas pour le mode offline */}
      {variant !== 'offline' && (
        <View className="gap-3 w-full max-w-xs">
          {/* CTA principal */}
          {config.primaryCta && onPrimaryAction && (
            <Pressable
              className="h-14 rounded-2xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
              onPress={onPrimaryAction}
              accessibilityRole="button"
              accessibilityLabel={config.primaryCta}
            >
              <Text className="text-white font-semibold text-base">
                {config.primaryCta}
              </Text>
            </Pressable>
          )}

          {/* CTA secondaire */}
          {config.secondaryCta && onSecondaryAction && (
            <Pressable
              className="h-12 rounded-2xl border border-jim-primary/40 items-center justify-center active:opacity-70"
              onPress={onSecondaryAction}
              accessibilityRole="button"
              accessibilityLabel={config.secondaryCta}
            >
              <Text className="text-jim-primary font-medium text-sm">
                {config.secondaryCta}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </AnimatedView>
  );
}
