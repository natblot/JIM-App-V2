// Composant StatusBadge — affiche le statut d'une annonce avec couleur semantique.
// Wrapper autour de <Badge/> pour preserver l'API publique existante.
import { Badge, type BadgeSize, type BadgeTone } from './badge';

export type AnnonceStatut =
  | 'active'
  | 'en_cours'
  | 'non_confirmee'
  | 'source_externe'
  | 'pourvue'
  | 'expiree';

interface StatusBadgeProps {
  statut: AnnonceStatut;
  size?: BadgeSize;
  className?: string;
}

const STATUT_MAP: Record<AnnonceStatut, { label: string; tone: BadgeTone }> = {
  active:         { label: 'Active',        tone: 'success' },
  en_cours:       { label: 'En cours',      tone: 'accent' },
  non_confirmee:  { label: 'Non confirmée', tone: 'neutral' },
  source_externe: { label: 'Source externe', tone: 'primary' },
  pourvue:        { label: 'Pourvue',       tone: 'neutral' },
  expiree:        { label: 'Expirée',       tone: 'neutral' },
};

export function StatusBadge({ statut, size = 'md', className }: StatusBadgeProps) {
  const { label, tone } = STATUT_MAP[statut];
  return (
    <Badge
      label={label}
      tone={tone}
      variant="soft"
      size={size}
      dot
      accessibilityLabel={`Statut : ${label}`}
      className={className}
    />
  );
}
