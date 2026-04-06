// Composant PaymentStatusBadge — statut du paiement avec couleur semantique — Epic 9
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

export type PaiementStatut =
  | 'brouillon'
  | 'en_attente_validation'
  | 'conteste'
  | 'en_cours'
  | 'confirme'
  | 'echoue'
  | 'rembourse';

interface PaymentStatusBadgeProps {
  statut: PaiementStatut;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUT_CONFIG: Record<PaiementStatut, { label: string; containerClass: string; textClass: string; dot: string }> = {
  brouillon: {
    label: 'Brouillon',
    containerClass: 'bg-jim-muted/10 border-jim-muted/30',
    textClass: 'text-jim-muted',
    dot: 'bg-jim-muted',
  },
  en_attente_validation: {
    label: 'En attente',
    containerClass: 'bg-jim-accent/10 border-jim-accent/30',
    textClass: 'text-jim-accent',
    dot: 'bg-jim-accent',
  },
  conteste: {
    label: 'Conteste',
    containerClass: 'bg-orange-500/10 border-orange-500/30',
    textClass: 'text-orange-600',
    dot: 'bg-orange-500',
  },
  en_cours: {
    label: 'En cours',
    containerClass: 'bg-jim-primary/10 border-jim-primary/30',
    textClass: 'text-jim-primary',
    dot: 'bg-jim-primary',
  },
  confirme: {
    label: 'Confirme',
    containerClass: 'bg-jim-success/10 border-jim-success/30',
    textClass: 'text-jim-success',
    dot: 'bg-jim-success',
  },
  echoue: {
    label: 'Echoue',
    containerClass: 'bg-jim-destructive/10 border-jim-destructive/30',
    textClass: 'text-jim-destructive',
    dot: 'bg-jim-destructive',
  },
  rembourse: {
    label: 'Rembourse',
    containerClass: 'bg-jim-muted/10 border-jim-muted/30',
    textClass: 'text-jim-muted',
    dot: 'bg-jim-muted',
  },
};

export function PaymentStatusBadge({ statut, size = 'md', className }: PaymentStatusBadgeProps) {
  const config = STATUT_CONFIG[statut];
  const isSmall = size === 'sm';

  return (
    <View
      className={cn(
        'flex-row items-center border rounded-full',
        isSmall ? 'px-2 py-0.5 gap-1' : 'px-3 py-1 gap-1.5',
        config.containerClass,
        className,
      )}
      accessibilityLabel={`Statut paiement : ${config.label}`}
    >
      <View className={cn('rounded-full', isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2', config.dot)} />
      <Text className={cn('font-medium text-xs', config.textClass)}>
        {config.label}
      </Text>
    </View>
  );
}
