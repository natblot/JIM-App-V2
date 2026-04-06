// apps/mobile/app/(app)/favoris.tsx
// Carnet de favoris — titulaire — Story 5.9
// Liste des remplaçants favoris avec swipe pour retirer
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated';
import { FavoriButton, AnnonceSkeleton } from '@jim/ui';
import { supabase } from '../_layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FavoriProfile {
  id: string;
  remplacant_id: string;
  created_at: string;
  profiles: {
    id: string;
    prenom: string | null;
    nom: string | null;
    rpps: string | null;
    specialites: string[] | null;
  } | null;
}

// Hook de chargement des favoris du titulaire connecté
function useFavoris() {
  return useQuery({
    queryKey: ['favoris'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favoris')
        .select(`
          id,
          remplacant_id,
          created_at,
          profiles:remplacant_id (
            id,
            prenom,
            nom,
            rpps,
            specialites
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FavoriProfile[];
    },
  });
}

// Hook pour retirer un favori
function useRetirerFavori() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (favoriId: string) => {
      const { error } = await supabase
        .from('favoris')
        .delete()
        .eq('id', favoriId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['favoris'] });
    },
  });
}

// Génère les initiales d'un profil
function getInitiales(prenom: string | null, nom: string | null): string {
  const p = prenom?.charAt(0).toUpperCase() ?? '';
  const n = nom?.charAt(0).toUpperCase() ?? '';
  return `${p}${n}` || '??';
}

export default function FavorisScreen() {
  const router = useRouter();
  const { data: favoris, isLoading } = useFavoris();
  const retirerFavori = useRetirerFavori();

  function handleRetirer(favori: FavoriProfile) {
    const nom = [favori.profiles?.prenom, favori.profiles?.nom].filter(Boolean).join(' ') || 'ce remplaçant';
    Alert.alert(
      'Retirer des favoris ?',
      `${nom} sera retiré de vos favoris.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => retirerFavori.mutate(favori.id),
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <Pressable
          className="w-11 h-11 items-center justify-center mb-2 active:opacity-70"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text className="text-jim-primary text-2xl">‹</Text>
        </Pressable>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-jim-text">Mes favoris</Text>
          {favoris && favoris.length > 0 && (
            <View className="bg-jim-primary/10 border border-jim-primary/20 px-2.5 py-1 rounded-full">
              <Text className="text-jim-primary text-sm font-semibold">{favoris.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Contenu */}
      {isLoading ? (
        <View className="px-4 pt-4">
          <AnnonceSkeleton count={3} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-6 gap-4"
          showsVerticalScrollIndicator={false}
        >
          {!favoris || favoris.length === 0 ? (
            <EmptyFavorisState />
          ) : (
            favoris.map((favori, index) => {
              const profile = favori.profiles;
              const nomComplet =
                [profile?.prenom, profile?.nom].filter(Boolean).join(' ') || 'Remplaçant';

              return (
                <Animated.View
                  key={favori.id}
                  entering={FadeInDown.duration(300).delay(index * 60)}
                  exiting={FadeOutRight.duration(250)}
                  className="bg-jim-surface border border-jim-border rounded-2xl p-4"
                >
                  <View className="flex-row items-center gap-4">
                    {/* Avatar initiales */}
                    <View className="w-12 h-12 rounded-full bg-jim-primary/15 items-center justify-center flex-shrink-0">
                      <Text className="text-jim-primary font-bold text-base">
                        {getInitiales(profile?.prenom ?? null, profile?.nom ?? null)}
                      </Text>
                    </View>

                    {/* Infos remplaçant */}
                    <View className="flex-1 gap-1">
                      <Text className="text-jim-text font-bold text-base">{nomComplet}</Text>

                      {/* Badge RPPS */}
                      {profile?.rpps && (
                        <View className="flex-row items-center gap-1.5">
                          <View className="bg-jim-success/10 border border-jim-success/30 px-2 py-0.5 rounded-full">
                            <Text className="text-jim-success text-xs font-medium">RPPS vérifié</Text>
                          </View>
                        </View>
                      )}

                      {/* Spécialités */}
                      {profile?.specialites && profile.specialites.length > 0 && (
                        <Text className="text-jim-muted text-xs" numberOfLines={1}>
                          {profile.specialites.slice(0, 3).join(' · ')}
                        </Text>
                      )}
                    </View>

                    {/* Bouton favori (toggle pour retirer) */}
                    <FavoriButton
                      isFavori
                      onToggle={() => handleRetirer(favori)}
                      size={22}
                    />
                  </View>

                  {/* Bouton retirer (accessible) */}
                  <Pressable
                    className="mt-3 pt-3 border-t border-jim-border h-11 items-center justify-center rounded-lg active:opacity-70"
                    onPress={() => handleRetirer(favori)}
                    accessibilityRole="button"
                    accessibilityLabel={`Retirer ${nomComplet} des favoris`}
                  >
                    <Text className="text-jim-destructive text-sm font-medium">Retirer des favoris</Text>
                  </Pressable>
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

function EmptyFavorisState() {
  return (
    <View className="items-center py-12 gap-4">
      <Text className="text-5xl" aria-hidden>🤍</Text>
      <Text className="text-jim-text font-bold text-lg text-center">
        Aucun favori pour l'instant
      </Text>
      <Text className="text-jim-muted text-sm text-center leading-5 px-4">
        Sauvegardez des remplaçants que vous appréciez — retrouvez-les ici pour les recontacter facilement
      </Text>
    </View>
  );
}
