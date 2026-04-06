// Composant toggle de préférence — Epic 7, notifications
// Ligne icon + titre + description + Switch React Native
import { View, Text, Switch } from 'react-native';

export interface TogglePreferenceProps {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export function TogglePreference({
  icon,
  title,
  description,
  value,
  onToggle,
  disabled = false,
}: TogglePreferenceProps) {
  return (
    <View
      className={[
        'flex-row items-center px-4 py-4 border-b border-jim-border',
        disabled ? 'opacity-50' : '',
      ].join(' ')}
      accessibilityRole="none"
    >
      {/* Icône à gauche */}
      <Text
        className="text-2xl w-8 mr-3"
        aria-hidden
      >
        {icon}
      </Text>

      {/* Colonne texte centrale */}
      <View className="flex-1 mr-3">
        <Text className="text-jim-text font-semibold text-sm leading-5">
          {title}
        </Text>
        <Text className="text-jim-muted text-sm leading-5 mt-0.5">
          {description}
        </Text>
      </View>

      {/* Switch à droite — zone tap min 44×44 assurée par le Switch natif */}
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          true: 'oklch(0.55 0.18 250)',   // jim-primary
          false: 'oklch(0.90 0.01 250)',  // jim-border
        }}
        thumbColor="white"
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityState={{ checked: value, disabled }}
      />
    </View>
  );
}
