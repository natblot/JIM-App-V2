// Bandeau hors ligne — Epic 4, Story 4.5
// Slide depuis le haut quand offline, disparaît quand reconnecté
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';

export interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  const insets = useSafeAreaInsets();

  if (!isOffline) return null;

  return (
    <AnimatedView
      entering={SlideInUp.duration(200)}
      exiting={SlideOutUp.duration(200)}
      // Position absolue en haut — respecte le notch/Dynamic Island
      style={{ paddingTop: insets.top }}
      className="absolute top-0 left-0 right-0 z-50 bg-jim-primary px-4 pb-3 flex-row items-center gap-2"
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
    >
      <Text className="text-lg" aria-hidden>
        📵
      </Text>
      <Text className="text-white font-semibold text-sm">
        Hors ligne — données en cache
      </Text>
    </AnimatedView>
  );
}
