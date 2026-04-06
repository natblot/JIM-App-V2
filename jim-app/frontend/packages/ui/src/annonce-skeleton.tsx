// Skeleton de chargement — reprend la forme de AnnonceCard
// Shimmer animation opacity 0.3 → 0.7 en loop, 1.5s
import { View } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';
import { useEffect } from 'react';

function SkeletonRect({
  className,
  opacity,
}: {
  className: string;
  opacity: ReturnType<typeof useSharedValue<number>>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedView
      style={animatedStyle}
      className={`bg-jim-border rounded-lg ${className}`}
    />
  );
}

interface AnnonceSkeletonProps {
  count?: number;
}

function SingleSkeleton({ opacity }: { opacity: ReturnType<typeof useSharedValue<number>> }) {
  return (
    <View className="bg-jim-surface rounded-2xl border border-jim-border p-4 mb-3">
      {/* Badges ligne */}
      <View className="flex-row items-center gap-2 mb-3">
        <SkeletonRect className="h-6 w-20" opacity={opacity} />
        <SkeletonRect className="h-6 w-14" opacity={opacity} />
      </View>

      {/* Ville */}
      <SkeletonRect className="h-6 w-2/3 mb-2" opacity={opacity} />

      {/* Dates */}
      <SkeletonRect className="h-4 w-1/2 mb-2" opacity={opacity} />

      {/* Type cabinet */}
      <SkeletonRect className="h-4 w-1/3" opacity={opacity} />

      {/* Séparateur + rétrocession */}
      <View className="mt-3 pt-3 border-t border-jim-border flex-row items-center justify-between">
        <SkeletonRect className="h-8 w-16" opacity={opacity} />
        <SkeletonRect className="h-4 w-20" opacity={opacity} />
      </View>
    </View>
  );
}

export function AnnonceSkeleton({ count = 3 }: AnnonceSkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, {
        duration: 750,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // loop infini
      true // reverse (ping-pong)
    );
    // Nettoyage automatique via unmount — pas de cancelAnimation nécessaire
  }, [opacity]);

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SingleSkeleton key={index} opacity={opacity} />
      ))}
    </View>
  );
}
