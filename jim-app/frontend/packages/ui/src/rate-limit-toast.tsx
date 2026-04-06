// Toast rate limiting — Epic 10, Story 10.3
// Message factuel avec countdown
import { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';
import { cn } from './utils/cn';

interface RateLimitToastProps {
  visible: boolean;
  resetAt?: string; // ISO date string
  className?: string;
}

export function RateLimitToast({ visible, resetAt, className }: RateLimitToastProps) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!resetAt || !visible) return;

    const updateCountdown = () => {
      const diff = new Date(resetAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('');
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setRemaining(`${minutes}:${String(seconds).padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [resetAt, visible]);

  if (!visible) return null;

  return (
    <AnimatedView
      entering={FadeInDown.duration(200)}
      exiting={FadeOutDown.duration(200)}
      className={cn('bg-jim-muted/10 border border-jim-muted/30 rounded-xl p-3', className)}
    >
      <Text className="text-jim-muted text-sm text-center">
        Trop de tentatives{remaining ? ` — disponible dans ${remaining}` : ' — reessayez plus tard'}
      </Text>
    </AnimatedView>
  );
}
