// Composant Badge generique — source unique pour tous les badges JIM.
// Remplace les 8 composants badges dupliques (StatusBadge, UrgentBadge, etc.)
// tout en preservant leur API publique via des wrappers.
//
// Variants :
//   - tone : couleur semantique (primary, success, warning, destructive, neutral, accent)
//   - variant : style (solid, soft, outline)
//   - size : taille (sm, md)
//
// Exemples :
//   <Badge label="Actif" tone="success" variant="soft" dot />
//   <Badge label="Urgent" tone="destructive" variant="solid" icon="⚡" />
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

export type BadgeTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'neutral'
  | 'accent';

export type BadgeVariant = 'solid' | 'soft' | 'outline';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  /** Texte du badge */
  label: string;
  /** Couleur semantique */
  tone?: BadgeTone;
  /** Style visuel */
  variant?: BadgeVariant;
  /** Taille */
  size?: BadgeSize;
  /** Emoji ou caractere icone avant le texte */
  icon?: string;
  /** Afficher un point de couleur avant le texte */
  dot?: boolean;
  /** Label d'accessibilite (override du label texte) */
  accessibilityLabel?: string;
  className?: string;
}

// Configuration des tons — tokens jim-* definis dans tailwind.config.js
const TONE_STYLES: Record<
  BadgeTone,
  {
    solid: { container: string; text: string; dot: string };
    soft: { container: string; text: string; dot: string };
    outline: { container: string; text: string; dot: string };
  }
> = {
  primary: {
    solid: {
      container: 'bg-jim-primary border-jim-primary',
      text: 'text-white',
      dot: 'bg-white',
    },
    soft: {
      container: 'bg-jim-primary-pale border-jim-primary/20',
      text: 'text-jim-primary',
      dot: 'bg-jim-primary',
    },
    outline: {
      container: 'bg-transparent border-jim-primary',
      text: 'text-jim-primary',
      dot: 'bg-jim-primary',
    },
  },
  success: {
    solid: {
      container: 'bg-jim-success border-jim-success',
      text: 'text-white',
      dot: 'bg-white',
    },
    soft: {
      container: 'bg-jim-success-bg border-jim-success/30',
      text: 'text-jim-success',
      dot: 'bg-jim-success',
    },
    outline: {
      container: 'bg-transparent border-jim-success',
      text: 'text-jim-success',
      dot: 'bg-jim-success',
    },
  },
  warning: {
    solid: {
      container: 'bg-jim-warning border-jim-warning',
      text: 'text-white',
      dot: 'bg-white',
    },
    soft: {
      container: 'bg-jim-warning-bg border-jim-warning/30',
      text: 'text-jim-warning',
      dot: 'bg-jim-warning',
    },
    outline: {
      container: 'bg-transparent border-jim-warning',
      text: 'text-jim-warning',
      dot: 'bg-jim-warning',
    },
  },
  destructive: {
    solid: {
      container: 'bg-jim-destructive border-jim-destructive',
      text: 'text-white',
      dot: 'bg-white',
    },
    soft: {
      container: 'bg-jim-destructive-bg border-jim-destructive/30',
      text: 'text-jim-destructive',
      dot: 'bg-jim-destructive',
    },
    outline: {
      container: 'bg-transparent border-jim-destructive',
      text: 'text-jim-destructive',
      dot: 'bg-jim-destructive',
    },
  },
  neutral: {
    solid: {
      container: 'bg-jim-text-body border-jim-text-body',
      text: 'text-white',
      dot: 'bg-white',
    },
    soft: {
      container: 'bg-jim-beige-light border-jim-border',
      text: 'text-jim-text-body',
      dot: 'bg-jim-muted',
    },
    outline: {
      container: 'bg-transparent border-jim-border',
      text: 'text-jim-text-body',
      dot: 'bg-jim-muted',
    },
  },
  accent: {
    solid: {
      container: 'bg-jim-accent border-jim-accent',
      text: 'text-white',
      dot: 'bg-white',
    },
    soft: {
      container: 'bg-jim-accent/10 border-jim-accent/30',
      text: 'text-jim-accent',
      dot: 'bg-jim-accent',
    },
    outline: {
      container: 'bg-transparent border-jim-accent',
      text: 'text-jim-accent',
      dot: 'bg-jim-accent',
    },
  },
};

const SIZE_STYLES: Record<
  BadgeSize,
  { container: string; text: string; dot: string; gap: string }
> = {
  sm: {
    container: 'px-2 py-0.5',
    text: 'text-xs',
    dot: 'w-1.5 h-1.5',
    gap: 'gap-1',
  },
  md: {
    container: 'px-3 py-1',
    text: 'text-xs',
    dot: 'w-2 h-2',
    gap: 'gap-1.5',
  },
};

export function Badge({
  label,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  icon,
  dot = false,
  accessibilityLabel,
  className,
}: BadgeProps) {
  const toneStyle = TONE_STYLES[tone][variant];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <View
      className={cn(
        'flex-row items-center rounded-full border',
        sizeStyle.container,
        sizeStyle.gap,
        toneStyle.container,
        className
      )}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      {dot && (
        <View className={cn('rounded-full', sizeStyle.dot, toneStyle.dot)} />
      )}
      {icon && (
        <Text className={cn(sizeStyle.text, toneStyle.text)} aria-hidden>
          {icon}
        </Text>
      )}
      <Text className={cn('font-medium', sizeStyle.text, toneStyle.text)}>
        {label}
      </Text>
    </View>
  );
}
