// Composant ProBadge — badge "Pro" dore pour les abonnes — Epic 9
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface ProBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function ProBadge({ size = 'md', className }: ProBadgeProps) {
  const isSmall = size === 'sm';

  return (
    <View
      className={cn(
        'flex-row items-center rounded-full border',
        'bg-amber-50 border-amber-300',
        isSmall ? 'px-2 py-0.5' : 'px-3 py-1',
        className,
      )}
      accessibilityLabel="Abonne Pro"
    >
      <Text className={cn('font-bold text-amber-700', isSmall ? 'text-xs' : 'text-xs')}>
        Pro
      </Text>
    </View>
  );
}
