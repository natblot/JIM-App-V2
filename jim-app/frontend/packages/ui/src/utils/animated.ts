// Wrappers typés pour les composants Animated de react-native-reanimated
// Contournement du bug de types connu : react-native-reanimated v4 + React 19
// Les Animated.* wrappers perdent la compat JSX en mode strict
// cf. https://github.com/software-mansion/react-native-reanimated/issues/6468
import Animated from 'react-native-reanimated';
import type { ViewProps, TextProps } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import type { ComponentType } from 'react';

type AnimatedViewProps = AnimatedProps<ViewProps> & { className?: string };
type AnimatedTextProps = AnimatedProps<TextProps> & { className?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AnimatedView = Animated.View as any as ComponentType<AnimatedViewProps>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AnimatedText = Animated.Text as any as ComponentType<AnimatedTextProps>;
