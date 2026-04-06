// Composant StarRating — notation etoiles 1-5 — Epic 11
import { View, Pressable, Text } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';
import { cn } from './utils/cn';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

const SIZES = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };
const TAP_SIZES = { sm: 'w-8 h-8', md: 'w-11 h-11', lg: 'w-14 h-14' };

function Star({ filled, onPress, size, readonly }: { filled: boolean; onPress: () => void; size: 'sm' | 'md' | 'lg'; readonly: boolean }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    if (readonly) return;
    scale.value = withSpring(1.2, { damping: 8 }, () => { scale.value = withSpring(1); });
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={readonly}
      className={cn('items-center justify-center', TAP_SIZES[size])}
      accessibilityRole="button"
      accessibilityLabel={`${filled ? 'Retirer' : 'Donner'} cette etoile`}
    >
      <AnimatedView style={animatedStyle}>
        <Text className={cn(SIZES[size], filled ? 'text-amber-400' : 'text-jim-border')}>
          {filled ? '\u2605' : '\u2606'}
        </Text>
      </AnimatedView>
    </Pressable>
  );
}

export function StarRating({ value, onChange, size = 'md', readonly = false, className }: StarRatingProps) {
  return (
    <View className={cn('flex-row items-center justify-center gap-1', className)} accessibilityLabel={`Note : ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} filled={star <= value} onPress={() => onChange?.(star)} size={size} readonly={readonly} />
      ))}
    </View>
  );
}
