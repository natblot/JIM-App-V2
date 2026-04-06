// Composant ContratStatusBadge — affiche le statut d'un contrat IA avec couleur sémantique
// Utilisé dans les vues de gestion de contrats (Epic 8)
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

export type ContratStatut =
  | 'brouillon'
  | 'en_attente_remplacant'
  | 'confirme';

interface ContratStatusBadgeProps {
  statut: ContratStatut;
  size?: 'sm' | 'md';
  className?: string;
}

// Configuration visuelle par statut de contrat
const STATUT_CONFIG: Record<ContratStatut, { label: string; containerClass: string; textClass: string; dot: string }> = {
  brouillon: {
    label: 'Brouillon',
    containerClass: 'bg-jim-muted/10 border-jim-muted/30',
    textClass: 'text-jim-muted',
    dot: 'bg-jim-muted',
  },
  en_attente_remplacant: {
    label: 'En attente de signature',
    containerClass: 'bg-jim-accent/10 border-jim-accent/30',
    textClass: 'text-jim-accent',
    dot: 'bg-jim-accent',
  },
  confirme: {
    label: 'Confirmé ✓',
    containerClass: 'bg-jim-success/10 border-jim-success/30',
    textClass: 'text-jim-success',
    dot: 'bg-jim-success',
  },
};

export function ContratStatusBadge({ statut, size = 'md', className }: ContratStatusBadgeProps) {
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
      accessibilityLabel={`Statut contrat : ${config.label}`}
    >
      <View className={cn('rounded-full', isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2', config.dot)} />
      <Text className={cn('font-medium', isSmall ? 'text-xs' : 'text-xs', config.textClass)}>
        {config.label}
      </Text>
    </View>
  );
}
