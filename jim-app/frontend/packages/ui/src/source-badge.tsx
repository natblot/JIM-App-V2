// Badge discret "Source externe" + fraîcheur — Epic 3
// Design volontairement minimaliste : icône petite, texte gris, pas de fond coloré
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface SourceBadgeProps {
  source: string; // 'rempleo', 'facebook', etc.
  lastVerifiedAt?: string | null | undefined;
  freshnessText?: string | undefined; // formatFreshness(lastVerifiedAt) — passé depuis le parent
  className?: string | undefined;
}

const SOURCE_LABELS: Record<string, string> = {
  rempleo: 'Rempleo',
  facebook: 'Facebook',
  kiné_emploi: 'KinéEmploi',
};

export function SourceBadge({ source, freshnessText, className }: SourceBadgeProps) {
  const sourceLabel = SOURCE_LABELS[source] ?? source;

  return (
    <View className={cn('flex-row items-center gap-1', className)}>
      {/* Icône lien — subtile */}
      <Text className="text-jim-muted text-xs" aria-hidden>🔗</Text>
      <Text className="text-jim-muted text-xs">{sourceLabel}</Text>
      {freshnessText && (
        <>
          <Text className="text-jim-muted text-xs">·</Text>
          <Text className="text-jim-muted text-xs">{freshnessText}</Text>
        </>
      )}
    </View>
  );
}
