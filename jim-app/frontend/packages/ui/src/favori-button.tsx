// Bouton favori — icône cœur animée — Epic 5, Story 5.9
// Toggle favori avec animation spring sur le cœur
import { Pressable } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { AnimatedText } from './utils/animated';

interface FavoriButtonProps {
  isFavori: boolean;
  onToggle: () => void;
  size?: number;
}

export function FavoriButton({ isFavori, onToggle, size = 24 }: FavoriButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    // Animation spring : 0.8 → 1.2 → 1 — stiffness 300, damping 20
    scale.value = withSequence(
      withSpring(0.8, { stiffness: 300, damping: 20 }),
      withSpring(1.2, { stiffness: 300, damping: 20 }),
      withSpring(1, { stiffness: 300, damping: 20 })
    );
    onToggle();
  }

  return (
    <Pressable
      // Zone tap minimum 44×44 points
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      accessibilityState={{ selected: isFavori }}
    >
      <AnimatedText
        style={[
          animatedStyle,
          {
            fontSize: size,
            // Rouge vif si favori, gris sinon
            color: isFavori ? '#EF4444' : '#9CA3AF',
          },
        ]}
        aria-hidden
      >
        {isFavori ? '❤️' : '🤍'}
      </AnimatedText>
    </Pressable>
  );
}
