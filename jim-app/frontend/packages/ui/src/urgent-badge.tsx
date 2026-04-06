// Badge "Urgent" — visible dans les listes et cartes
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface UrgentBadgeProps {
  className?: string;
}

export function UrgentBadge({ className }: UrgentBadgeProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-1 bg-jim-destructive px-2.5 py-1 rounded-full',
        className
      )}
      accessibilityLabel="Annonce urgente"
    >
      <Text className="text-white text-xs">⚡</Text>
      <Text className="text-white text-xs font-bold">Urgent</Text>
    </View>
  );
}
