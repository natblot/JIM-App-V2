// Composant StatusBadge — affiche le statut d'une annonce avec couleur sémantique
// Utilisé partout où un statut d'annonce est affiché
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

export type AnnonceStatut =
  | 'active'
  | 'en_cours'
  | 'non_confirmee'
  | 'source_externe'
  | 'pourvue'
  | 'expiree';

interface StatusBadgeProps {
  statut: AnnonceStatut;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUT_CONFIG: Record<AnnonceStatut, { label: string; containerClass: string; textClass: string; dot: string }> = {
  active: {
    label: 'Active',
    containerClass: 'bg-jim-success/10 border-jim-success/30',
    textClass: 'text-jim-success',
    dot: 'bg-jim-success',
  },
  en_cours: {
    label: 'En cours',
    containerClass: 'bg-jim-accent/10 border-jim-accent/30',
    textClass: 'text-jim-accent',
    dot: 'bg-jim-accent',
  },
  non_confirmee: {
    label: 'Non confirmée',
    containerClass: 'bg-jim-muted/10 border-jim-muted/30',
    textClass: 'text-jim-muted',
    dot: 'bg-jim-muted',
  },
  source_externe: {
    label: 'Source externe',
    containerClass: 'bg-jim-primary/10 border-jim-primary/30',
    textClass: 'text-jim-primary',
    dot: 'bg-jim-primary',
  },
  pourvue: {
    label: 'Pourvue',
    containerClass: 'bg-jim-muted/10 border-jim-muted/30',
    textClass: 'text-jim-muted',
    dot: 'bg-jim-muted',
  },
  expiree: {
    label: 'Expirée',
    containerClass: 'bg-jim-text/10 border-jim-text/30',
    textClass: 'text-jim-muted',
    dot: 'bg-jim-muted',
  },
};

export function StatusBadge({ statut, size = 'md', className }: StatusBadgeProps) {
  const config = STATUT_CONFIG[statut];
  const isSmall = size === 'sm';

  return (
    <View
      className={cn(
        'flex-row items-center border rounded-full',
        isSmall ? 'px-2 py-0.5 gap-1' : 'px-3 py-1 gap-1.5',
        config.containerClass,
        className
      )}
      accessibilityLabel={`Statut : ${config.label}`}
    >
      <View className={cn('rounded-full', isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2', config.dot)} />
      <Text className={cn('font-medium', isSmall ? 'text-xs' : 'text-xs', config.textClass)}>
        {config.label}
      </Text>
    </View>
  );
}
