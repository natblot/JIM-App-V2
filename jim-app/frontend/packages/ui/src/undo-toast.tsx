// Toast undo avec countdown — Epic 5, Story 5.1
// Toast de confirmation avec possibilité d'annuler (5s par défaut)
import { View, Text, Pressable } from 'react-native';
import {
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';
import { useEffect, useRef } from 'react';

interface UndoToastProps {
  visible: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

// Largeur animée de la barre de progression
function ProgressBar({ duration }: { duration: number }) {
  const width = useSharedValue(1);

  useEffect(() => {
    width.value = 1;
    width.value = withTiming(0, { duration });
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    flex: width.value,
  }));

  return (
    <View className="h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
      <AnimatedView style={animatedStyle} className="h-full bg-white/60 rounded-full" />
    </View>
  );
}

export function UndoToast({
  visible,
  message,
  onUndo,
  onDismiss,
  duration = 5000,
}: UndoToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;

    // Démarrer le compte à rebours de dismissal
    timerRef.current = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <AnimatedView
      entering={SlideInDown.duration(200)}
      exiting={SlideOutDown.duration(200)}
      className="absolute bottom-8 left-4 right-4 z-50"
      accessibilityLiveRegion="polite"
    >
      <View className="bg-jim-text/90 rounded-2xl px-5 py-4 shadow-lg">
        {/* Ligne principale : icône + message + bouton annuler */}
        <View className="flex-row items-center gap-3">
          {/* Icône check */}
          <View className="w-7 h-7 rounded-full bg-jim-success/20 items-center justify-center flex-shrink-0">
            <Text className="text-jim-success text-base">✓</Text>
          </View>

          {/* Message */}
          <Text
            className="text-white text-sm flex-1 leading-5"
            numberOfLines={2}
          >
            {message}
          </Text>

          {/* Bouton Annuler */}
          <Pressable
            className="min-h-[44px] min-w-[44px] items-center justify-center px-1 active:opacity-70"
            onPress={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              onUndo();
            }}
            accessibilityRole="button"
            accessibilityLabel="Annuler l'action"
          >
            <Text className="text-jim-accent font-semibold text-sm">Annuler</Text>
          </Pressable>
        </View>

        {/* Barre de progression countdown */}
        <ProgressBar duration={duration} />
      </View>
    </AnimatedView>
  );
}
