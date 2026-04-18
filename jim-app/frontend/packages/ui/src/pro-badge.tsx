// Composant ProBadge — badge "Pro" pour les abonnes — Epic 9.
// Wrapper autour de <Badge/> — tone="warning" soft (teinte ambre/miel coherente).
import { Badge, type BadgeSize } from './badge';

interface ProBadgeProps {
  size?: BadgeSize;
  className?: string;
}

export function ProBadge({ size = 'md', className }: ProBadgeProps) {
  return (
    <Badge
      label="Pro"
      tone="warning"
      variant="soft"
      size={size}
      accessibilityLabel="Abonne Pro"
      className={className}
    />
  );
}
