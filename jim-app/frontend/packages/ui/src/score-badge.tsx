// Composant ScoreBadge — score de fiabilite /5 — Epic 11
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface ScoreBadgeProps {
  score: number | null;
  nbAvis: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function ScoreBadge({ score, nbAvis, size = 'md', className }: ScoreBadgeProps) {
  if (score === null || nbAvis < 3) {
    return (
      <View className={cn('bg-jim-muted/10 rounded-full px-2 py-0.5', className)}>
        <Text className="text-jim-muted text-xs">Nouveau</Text>
      </View>
    );
  }

  const isSmall = size === 'sm';
  const color = score >= 4 ? 'text-jim-success' : score >= 3 ? 'text-jim-accent' : 'text-jim-destructive';
  const bg = score >= 4 ? 'bg-jim-success/10 border-jim-success/30' : score >= 3 ? 'bg-jim-accent/10 border-jim-accent/30' : 'bg-jim-destructive/10 border-jim-destructive/30';

  return (
    <View
      className={cn('flex-row items-center border rounded-full', bg, isSmall ? 'px-2 py-0.5 gap-1' : 'px-3 py-1 gap-1.5', className)}
      accessibilityLabel={`Score de fiabilite : ${score} sur 5, ${nbAvis} avis`}
    >
      <Text className={cn('font-bold', color, isSmall ? 'text-xs' : 'text-sm')}>{score.toFixed(1)}</Text>
      <Text className={cn('text-jim-muted', isSmall ? 'text-xs' : 'text-xs')}>/5</Text>
    </View>
  );
}
