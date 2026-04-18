// Composant AmbassadeurBadge — badge ambassadeur — Epic 11.
// Wrapper autour de <Badge/> — tone="warning" soft avec icone etoile.
import { Badge, type BadgeSize } from './badge';

interface AmbassadeurBadgeProps {
  size?: BadgeSize;
  className?: string;
}

export function AmbassadeurBadge({ size = 'md', className }: AmbassadeurBadgeProps) {
  return (
    <Badge
      label="Ambassadeur"
      tone="warning"
      variant="soft"
      size={size}
      icon="⭐"
      accessibilityLabel="Ambassadeur JIM"
      className={className}
    />
  );
}
