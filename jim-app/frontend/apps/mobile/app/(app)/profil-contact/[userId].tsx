// Fiche profil post-acceptation — accessible depuis le header du chat — Epic 6
// Coordonnées visibles uniquement si la candidature a été acceptée
import { View, Text, Pressable, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '../../_layout';
import { useContactProfile } from '../../../hooks/useContactProfile';

// Extrait les 2 premières initiales du nom complet
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Ouvre le client mail avec l'adresse pré-remplie
function handleEmail(email: string) {
  void Linking.openURL(`mailto:${email}`);
}

// Ouvre le composeur téléphonique avec le numéro pré-rempli
function handlePhone(phone: string) {
  void Linking.openURL(`tel:${phone}`);
}

export default function ProfilContactScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const { data: profile, isLoading } = useContactProfile(supabase, userId);

  return (
    <View className="flex-1 bg-jim-background">
      {/* Header */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Profil',
          headerLeft: () => (
            <Pressable
              className="w-11 h-11 items-center justify-center active:opacity-70"
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Retour"
            >
              <Text className="text-jim-primary text-2xl">‹</Text>
            </Pressable>
          ),
          headerStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: false,
        }}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3b82f6" size="large" />
        </View>
      ) : !profile ? (
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <Text className="text-5xl" aria-hidden>🤷</Text>
          <Text className="text-jim-text font-bold text-xl text-center">
            Profil introuvable
          </Text>
          <Text className="text-jim-muted text-base text-center">
            Ce profil n'est plus disponible
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-6 gap-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar + nom + badge RPPS */}
          <Animated.View
            entering={FadeInDown.duration(300).delay(0)}
            className="items-center gap-3"
          >
            {/* Avatar initiales */}
            <View className="w-24 h-24 rounded-full bg-jim-primary/20 items-center justify-center">
              <Text className="text-jim-primary font-bold text-3xl">
                {getInitials(profile.fullName)}
              </Text>
            </View>

            {/* Nom complet */}
            <Text className="text-jim-text font-bold text-2xl text-center">
              {profile.fullName}
            </Text>

            {/* Badge RPPS vérifié */}
            {profile.rppsVerified && (
              <View className="flex-row items-center gap-1.5 bg-jim-success/10 border border-jim-success/30 px-3 py-1.5 rounded-full">
                <Text className="text-jim-success text-xs font-bold">✓ RPPS vérifié</Text>
              </View>
            )}
          </Animated.View>

          {/* Spécialités — pills */}
          {profile.specialties && profile.specialties.length > 0 && (
            <Animated.View entering={FadeInDown.duration(300).delay(60)} className="gap-2">
              <Text className="text-jim-muted text-xs font-semibold uppercase tracking-wide">
                Spécialités
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {profile.specialties.map((specialty) => (
                  <View
                    key={specialty}
                    className="bg-jim-primary/10 border border-jim-primary/30 px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-jim-primary text-sm font-medium">{specialty}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Coordonnées */}
          <Animated.View entering={FadeInDown.duration(300).delay(120)} className="gap-3">
            <Text className="text-jim-muted text-xs font-semibold uppercase tracking-wide">
              Coordonnées
            </Text>

            {profile.canSeeContactInfo ? (
              <View className="gap-3">
                {/* Email */}
                {profile.email && (
                  <Pressable
                    className="flex-row items-center gap-3 bg-jim-surface border border-jim-border rounded-xl px-4 py-4 min-h-[56px] active:opacity-80"
                    onPress={() => handleEmail(profile.email!)}
                    accessibilityRole="button"
                    accessibilityLabel={`Envoyer un email à ${profile.email}`}
                  >
                    <Text className="text-2xl" aria-hidden>✉️</Text>
                    <View className="flex-1">
                      <Text className="text-jim-muted text-xs">Email</Text>
                      <Text className="text-jim-text font-medium">{profile.email}</Text>
                    </View>
                    <Text className="text-jim-primary text-sm font-medium">Écrire</Text>
                  </Pressable>
                )}

                {/* Téléphone */}
                {profile.phone && (
                  <Pressable
                    className="flex-row items-center gap-3 bg-jim-surface border border-jim-border rounded-xl px-4 py-4 min-h-[56px] active:opacity-80"
                    onPress={() => handlePhone(profile.phone!)}
                    accessibilityRole="button"
                    accessibilityLabel={`Appeler le ${profile.phone}`}
                  >
                    <Text className="text-2xl" aria-hidden>📞</Text>
                    <View className="flex-1">
                      <Text className="text-jim-muted text-xs">Téléphone</Text>
                      <Text className="text-jim-text font-medium">{profile.phone}</Text>
                    </View>
                    <Text className="text-jim-primary text-sm font-medium">Appeler</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              // Coordonnées masquées avant acceptation de la candidature
              <View className="bg-jim-muted/10 border border-jim-muted/30 rounded-xl px-4 py-4">
                <Text className="text-jim-muted text-sm text-center">
                  🔒 Coordonnées visibles après acceptation
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Bouton favori */}
          {!profile.isFavorite && (
            <Animated.View entering={FadeInDown.duration(300).delay(180)}>
              <Pressable
                className="h-14 rounded-2xl border border-jim-primary/40 items-center justify-center active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="Sauvegarder ce profil en favori"
                onPress={() => {
                  // TODO: implémenter via useFavoriteContact hook
                }}
              >
                <Text className="text-jim-primary font-semibold text-base">
                  ♡ Sauvegarder en favori
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
