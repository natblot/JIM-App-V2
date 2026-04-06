// Augmentation NativeWind v4 — ajoute className aux composants React Native
// Nécessaire car @jim/ui n'a pas nativewind en dépendance directe
import 'react-native';
import 'react-native-reanimated';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
    placeholderClassName?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }
  interface SwitchProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface FlatListProps<ItemT> {
    className?: string;
    contentContainerClassName?: string;
  }
}
