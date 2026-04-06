// Bannière informative pour les annonces agrégées — affichée en haut du détail
import { View, Text } from 'react-native';

interface AggregatedBannerProps {
  source: string;
  lastVerifiedAt?: string | null;
  freshnessText?: string;
}

const SOURCE_NAMES: Record<string, string> = {
  rempleo: 'Rempleo',
  facebook: 'Facebook',
};

export function AggregatedBanner({ source, freshnessText }: AggregatedBannerProps) {
  const sourceName = SOURCE_NAMES[source] ?? source;

  return (
    <View className="mx-6 mt-4 p-3 bg-jim-primary/5 border border-jim-primary/20 rounded-xl flex-row items-start gap-3">
      <Text className="text-base" aria-hidden>🔗</Text>
      <View className="flex-1">
        <Text className="text-jim-primary text-sm font-medium">
          Annonce provenant de {sourceName}
        </Text>
        <Text className="text-jim-muted text-xs mt-0.5">
          Les informations sont vérifiées automatiquement toutes les 6h.
          {freshnessText && ` Dernière vérification : ${freshnessText.toLowerCase()}.`}
        </Text>
      </View>
    </View>
  );
}
