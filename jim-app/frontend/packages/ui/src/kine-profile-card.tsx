// Card profil kiné — deux variantes : default (résultats recherche) + compact (listes candidatures)
// Données lues exclusivement depuis profiles_public (pas de profiles direct — règle RGPD)
import { View, Text, Pressable, Image } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';
import { cn } from './utils/cn';
import { ScoreBadge } from './score-badge';

export interface KineProfileCardData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  specialties?: string[] | null;
  mobilityRadiusKm?: number | null;
  city?: string | null;
  department?: string | null;
  rppsVerified?: boolean | null;
  scoreFiabilite?: number | null; // /5, NULL si < 3 avis (champ score_fiabilite)
}

interface KineProfileCardProps {
  profile: KineProfileCardData;
  onPress?: () => void;
  variant?: 'default' | 'compact';
  className?: string;
  animationDelay?: number; // undefined = pas d'animation, 0+ = FadeInDown avec ce délai
}

function getInitials(firstName: string, lastName: string): string {
  return ((firstName[0] ?? '') + (lastName[0] ?? '')).toUpperCase();
}

function KineAvatar({
  avatarUrl,
  initials,
  size,
}: {
  avatarUrl?: string | null;
  initials: string;
  size: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <View
      className={cn(
        dim,
        'rounded-full bg-jim-primary/20 overflow-hidden items-center justify-center flex-shrink-0'
      )}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          className="w-full h-full"
          accessibilityLabel="Photo de profil"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text className={cn('text-jim-primary font-bold', textSize)}>{initials}</Text>
      )}
    </View>
  );
}

export function KineProfileCard({
  profile,
  onPress,
  variant = 'default',
  className,
  animationDelay,
}: KineProfileCardProps) {
  const initials = getInitials(profile.firstName, profile.lastName);
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const location = [
    profile.city,
    profile.department ? `(${profile.department})` : null,
  ]
    .filter(Boolean)
    .join(' ');
  const specialties = profile.specialties ?? [];

  const a11yLabel = [
    `Profil de ${fullName}`,
    location || null,
    profile.rppsVerified ? 'RPPS vérifié' : null,
  ]
    .filter(Boolean)
    .join(', ');

  const card = (
    <Pressable
      className={cn(
        'bg-jim-surface rounded-2xl border border-jim-border p-4',
        'active:opacity-80',
        className
      )}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      {variant === 'compact' ? (
        // Compact : ligne horizontale — listes candidatures reçues, favoris
        <View className="flex-row items-center gap-3">
          <KineAvatar avatarUrl={profile.avatarUrl} initials={initials} size="sm" />

          <View className="flex-1 gap-1 min-w-0">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-jim-text font-bold text-sm" numberOfLines={1}>
                {fullName}
              </Text>
              {profile.rppsVerified && (
                <View className="bg-jim-success/10 border border-jim-success/30 px-1.5 py-0.5 rounded-full">
                  <Text className="text-jim-success text-[10px] font-bold">✓ RPPS</Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-2 flex-wrap">
              {location ? (
                <Text className="text-jim-muted text-xs">{location}</Text>
              ) : null}
              {specialties.slice(0, 2).map((s) => (
                <View key={s} className="bg-jim-primary/10 px-2 py-0.5 rounded-full">
                  <Text className="text-jim-primary text-[10px] font-medium capitalize">{s}</Text>
                </View>
              ))}
              {specialties.length > 2 && (
                <Text className="text-jim-muted text-[10px]">+{specialties.length - 2}</Text>
              )}
            </View>
          </View>

          {profile.scoreFiabilite != null && (
            <ScoreBadge score={profile.scoreFiabilite} nbAvis={3} size="sm" />
          )}
        </View>
      ) : (
        // Default : carte verticale — résultats de recherche, propositions directes
        <View className="gap-3">
          {/* En-tête : avatar + identité + RPPS */}
          <View className="flex-row items-start gap-3">
            <KineAvatar avatarUrl={profile.avatarUrl} initials={initials} size="md" />
            <View className="flex-1 gap-1">
              <Text className="text-jim-text font-bold text-base leading-tight">
                {fullName}
              </Text>
              {location ? (
                <Text className="text-jim-muted text-sm">{location}</Text>
              ) : null}
              {profile.rppsVerified && (
                <View className="self-start flex-row items-center gap-1 bg-jim-success/10 border border-jim-success/30 px-2.5 py-1 rounded-full">
                  <Text className="text-jim-success text-xs font-bold">✓ RPPS vérifié</Text>
                </View>
              )}
            </View>
          </View>

          {/* Bio — 2 lignes max */}
          {profile.bio ? (
            <Text className="text-jim-muted text-sm leading-relaxed" numberOfLines={2}>
              {profile.bio}
            </Text>
          ) : null}

          {/* Spécialités — pills, max 3 + overflow */}
          {specialties.length > 0 && (
            <View className="flex-row flex-wrap gap-1.5">
              {specialties.slice(0, 3).map((s) => (
                <View
                  key={s}
                  className="bg-jim-primary/10 border border-jim-primary/20 px-2.5 py-1 rounded-full"
                >
                  <Text className="text-jim-primary text-xs font-medium capitalize">{s}</Text>
                </View>
              ))}
              {specialties.length > 3 && (
                <View className="bg-jim-muted/20 px-2.5 py-1 rounded-full">
                  <Text className="text-jim-muted text-xs">+{specialties.length - 3}</Text>
                </View>
              )}
            </View>
          )}

          {/* Pied : score fiabilité + rayon de mobilité */}
          <View className="pt-3 border-t border-jim-border flex-row items-center justify-between">
            {profile.scoreFiabilite != null ? (
              <ScoreBadge score={profile.scoreFiabilite} nbAvis={3} size="sm" />
            ) : (
              <View />
            )}
            {profile.mobilityRadiusKm != null && (
              <Text className="text-jim-muted text-xs">
                Rayon {profile.mobilityRadiusKm} km
              </Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );

  if (animationDelay !== undefined) {
    return (
      <AnimatedView entering={FadeInDown.duration(300).delay(animationDelay)}>
        {card}
      </AnimatedView>
    );
  }
  return card;
}
