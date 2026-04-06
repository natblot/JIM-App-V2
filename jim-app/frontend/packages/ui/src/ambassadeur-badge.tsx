// Composant AmbassadeurBadge — badge dore ambassadeur — Epic 11
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface AmbassadeurBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function AmbassadeurBadge({ size = 'md', className }: AmbassadeurBadgeProps) {
  const isSmall = size === 'sm';

  return (
    <View
      className={cn(
        'flex-row items-center rounded-full border',
        'bg-amber-50 border-amber-300',
        isSmall ? 'px-2 py-0.5 gap-1' : 'px-3 py-1 gap-1.5',
        className,
      )}
      accessibilityLabel="Ambassadeur JIM"
    >
      <Text className={cn('font-bold text-amber-700', isSmall ? 'text-xs' : 'text-xs')}>
        Ambassadeur
      </Text>
    </View>
  );
}
