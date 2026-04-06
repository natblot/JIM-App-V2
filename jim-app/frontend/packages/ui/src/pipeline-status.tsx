// Pipeline statut candidature — Epic 5, Story 5.3
// Visualisation de la progression d'une candidature en 4 étapes
import { View, Text } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';
import { useEffect as useAnimatedEffect } from 'react';

// Étapes ordonnées du pipeline (hors refus et expiration)
const PIPELINE_STEPS = [
  { key: 'en_attente', label: 'Envoyée' },
  { key: 'vue', label: 'Vue' },
  { key: 'en_discussion', label: 'En discussion' },
  { key: 'acceptee', label: 'Acceptée' },
] as const;

interface PipelineStatusProps {
  statut: string;
}

// Calcule l'index de l'étape active dans le pipeline
function getStepIndex(statut: string): number {
  return PIPELINE_STEPS.findIndex((s) => s.key === statut);
}

// Cercle animé pour l'étape active (pulse)
function ActiveStepCircle() {
  const scale = useSharedValue(1);

  useAnimatedEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.4,
  }));

  return (
    <View className="relative w-8 h-8 items-center justify-center">
      {/* Halo pulsant */}
      <AnimatedView
        style={animatedStyle}
        className="absolute w-8 h-8 rounded-full bg-jim-primary"
      />
      {/* Cercle central */}
      <View className="w-5 h-5 rounded-full bg-jim-primary" />
    </View>
  );
}

export function PipelineStatus({ statut }: PipelineStatusProps) {
  const activeIndex = getStepIndex(statut);
  const isRefusee = statut === 'refusee';
  const isExpiree = statut === 'expiree';
  const isTerminal = isRefusee || isExpiree;

  return (
    <View className="gap-3">
      {/* Ligne de progression */}
      <View className="flex-row items-center">
        {PIPELINE_STEPS.map((step, index) => {
          const isPast = !isTerminal && index < activeIndex;
          const isActive = !isTerminal && index === activeIndex;
          const isFuture = isTerminal || index > activeIndex;

          return (
            <View key={step.key} className="flex-row items-center flex-1">
              {/* Cercle étape */}
              <View className="items-center">
                {isActive ? (
                  <ActiveStepCircle />
                ) : (
                  <View
                    className={[
                      'w-5 h-5 rounded-full border-2',
                      isRefusee
                        ? 'bg-jim-destructive border-jim-destructive'
                        : isPast
                          ? 'bg-jim-muted border-jim-muted'
                          : isFuture
                            ? 'border-jim-border bg-transparent'
                            : 'bg-jim-primary border-jim-primary',
                    ].join(' ')}
                  />
                )}
              </View>

              {/* Ligne de connexion (sauf pour la dernière étape) */}
              {index < PIPELINE_STEPS.length - 1 && (
                <View
                  className={[
                    'flex-1 h-0.5 mx-1',
                    isRefusee
                      ? 'bg-jim-destructive/40'
                      : isPast
                        ? 'bg-jim-muted/60'
                        : 'bg-jim-border',
                  ].join(' ')}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Labels des étapes */}
      <View className="flex-row">
        {PIPELINE_STEPS.map((step, index) => {
          const isPast = !isTerminal && index < activeIndex;
          const isActive = !isTerminal && index === activeIndex;

          return (
            <View key={step.key} className="flex-1 items-center">
              <Text
                className={[
                  'text-xs text-center',
                  isRefusee
                    ? 'text-jim-destructive font-medium'
                    : isActive
                      ? 'text-jim-primary font-semibold'
                      : isPast
                        ? 'text-jim-muted'
                        : 'text-jim-border',
                ].join(' ')}
                numberOfLines={2}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Message contextuel pour les statuts terminaux */}
      {isRefusee && (
        <View className="bg-jim-destructive/8 border border-jim-destructive/20 rounded-xl px-4 py-3">
          <Text className="text-jim-destructive text-sm text-center">
            Profil non retenu cette fois — ne te décourage pas, d'autres annonces t'attendent
          </Text>
        </View>
      )}

      {isExpiree && (
        <View className="bg-jim-muted/8 border border-jim-muted/20 rounded-xl px-4 py-3">
          <Text className="text-jim-muted text-sm text-center">
            Sans réponse après 7 jours — le titulaire n'a peut-être plus besoin d'un remplaçant
          </Text>
        </View>
      )}
    </View>
  );
}
