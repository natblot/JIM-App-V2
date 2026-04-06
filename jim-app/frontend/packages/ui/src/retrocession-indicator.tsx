// Indicateur de rétrocession moyenne dans la zone (FR12)
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface RetrocessionIndicatorProps {
  moyenne: number | null;
  currentValue?: number;
  className?: string;
}

export function RetrocessionIndicator({ moyenne, currentValue, className }: RetrocessionIndicatorProps) {
  if (moyenne === null) {
    // Fallback : moyenne nationale kinés (82-85%)
    return (
      <Text className={cn('text-jim-muted text-xs mt-1', className)}>
        Moyenne nationale : 82 – 85%
      </Text>
    );
  }

  // Comparer avec la valeur actuelle si fournie
  const isAbove = currentValue !== undefined && currentValue >= moyenne;
  const colorClass = isAbove ? 'text-jim-success' : 'text-jim-accent';

  return (
    <View className={cn('flex-row items-center gap-1 mt-1', className)}>
      <Text className="text-jim-muted text-xs">Moyenne dans votre zone :</Text>
      <Text className={cn('text-xs font-medium', colorClass)}>
        {moyenne.toFixed(0)}%
      </Text>
      {currentValue !== undefined && (
        <Text className={cn('text-xs', colorClass)}>
          {isAbove ? '↑' : '↓'}
        </Text>
      )}
    </View>
  );
}
