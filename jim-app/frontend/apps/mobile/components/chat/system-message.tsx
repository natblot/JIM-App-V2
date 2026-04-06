// Message système centré — séparateur de date ou notification de statut
// Ligne grise de chaque côté, texte centré italique
import { View, Text } from 'react-native';

export interface SystemMessageProps {
  content: string;
  createdAt: string;
}

export function SystemMessage({ content }: SystemMessageProps) {
  return (
    <View
      className="flex-row items-center px-4 py-3 gap-3"
      accessibilityRole="text"
      accessibilityLabel={content}
    >
      {/* Ligne gauche */}
      <View className="flex-1 h-px bg-jim-border" />

      {/* Texte centré */}
      <Text className="text-jim-muted text-sm italic text-center shrink-0 max-w-[70%]">
        {content}
      </Text>

      {/* Ligne droite */}
      <View className="flex-1 h-px bg-jim-border" />
    </View>
  );
}
