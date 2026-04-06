// Badge compteur de messages non lus — Epic 6, messagerie
// Affiche un nombre rouge sur fond rouge, format pilule ou rond selon le chiffre
import { View, Text } from 'react-native';

export interface UnreadBadgeProps {
  count: number;
  size?: 'sm' | 'md';
}

export function UnreadBadge({ count, size = 'md' }: UnreadBadgeProps) {
  if (count <= 0) return null;

  // Affiche "9+" si le compteur dépasse 9
  const label = count > 9 ? '9+' : String(count);
  const isMultiDigit = label.length > 1;

  // Dimensions selon la taille et si on a 2+ chiffres (pilule vs rond)
  const containerClasses = [
    'bg-jim-destructive items-center justify-center',
    isMultiDigit ? 'rounded-full px-1.5' : 'rounded-full',
    size === 'sm'
      ? isMultiDigit ? 'h-4 min-w-[16px]' : 'h-4 w-4'
      : isMultiDigit ? 'h-5 min-w-[20px]' : 'h-5 w-5',
  ].join(' ');

  const textClasses = [
    'text-white font-bold',
    size === 'sm' ? 'text-[9px]' : 'text-[11px]',
  ].join(' ');

  return (
    <View className={containerClasses} accessibilityLabel={`${count} messages non lus`}>
      <Text className={textClasses}>{label}</Text>
    </View>
  );
}
