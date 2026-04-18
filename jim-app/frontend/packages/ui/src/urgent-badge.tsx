// Badge "Urgent" — visible dans les listes et cartes.
// Wrapper autour de <Badge/> — pattern unifie (palette tone="destructive" solid).
import { Badge } from './badge';

interface UrgentBadgeProps {
  className?: string;
}

export function UrgentBadge({ className }: UrgentBadgeProps) {
  return (
    <Badge
      label="Urgent"
      tone="destructive"
      variant="solid"
      size="md"
      icon="⚡"
      accessibilityLabel="Annonce urgente"
      className={className}
    />
  );
}
