// Composant jour du calendrier de disponibilités — Epic 7
// Carré 44×44 avec fond coloré selon le type de jour
import { View, Text, Pressable } from 'react-native';

export type CalendarDayType = 'disponible' | 'indisponible' | 'remplacement' | 'none';

export interface CalendarDayProps {
  date: Date;
  type: CalendarDayType;
  isSelected: boolean;
  isInRange: boolean;   // dans une plage de sélection en cours
  isToday: boolean;
  onPress: (date: Date) => void;
}

// Mappe chaque type de jour vers ses classes NativeWind de fond
function getBackgroundClass(
  type: CalendarDayType,
  isSelected: boolean,
  isInRange: boolean
): string {
  if (isSelected) return 'bg-jim-primary/30';
  if (isInRange) return 'bg-jim-primary/15';

  switch (type) {
    case 'disponible':
      return 'bg-jim-success/20';
    case 'indisponible':
      return 'bg-jim-muted/20';
    case 'remplacement':
      return 'bg-jim-primary/20';
    default:
      return 'bg-transparent';
  }
}

export function CalendarDay({
  date,
  type,
  isSelected,
  isInRange,
  isToday,
  onPress,
}: CalendarDayProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = date < today;

  const dayNumber = date.getDate();
  const bgClass = getBackgroundClass(type, isSelected, isInRange);

  // Label accessibilité formaté en français
  const accessibilityLabel = [
    date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
    isToday ? "— aujourd'hui" : '',
    type === 'disponible' ? '— disponible' : '',
    type === 'indisponible' ? '— indisponible' : '',
    type === 'remplacement' ? '— remplacement en cours' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      // Zone tap minimum 44×44 (NFR45)
      className={[
        'w-11 h-11 items-center justify-center rounded-lg',
        bgClass,
        isSelected ? 'border-2 border-jim-primary' : '',
        isPast ? 'opacity-40' : '',
      ].join(' ')}
      onPress={() => onPress(date)}
      disabled={false}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        className={[
          'text-sm font-medium',
          isPast ? 'text-jim-muted' : 'text-jim-text',
        ].join(' ')}
      >
        {dayNumber}
      </Text>

      {/* Point bleu sous le numéro si c'est aujourd'hui */}
      {isToday && (
        <View
          className="absolute bottom-1 w-1 h-1 rounded-full bg-jim-primary"
          accessibilityLabel="Aujourd'hui"
        />
      )}
    </Pressable>
  );
}
