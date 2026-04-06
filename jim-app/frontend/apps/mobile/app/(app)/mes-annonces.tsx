// apps/mobile/app/(app)/mes-annonces.tsx
// Historique des annonces du titulaire — Story 2.3 + 2.4
import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnnonceCard, type AnnonceCardData } from '@jim/ui';
import { useMyAnnonces, type AnnonceRow } from '@jim/shared';
import { supabase } from '../_layout';

// Transformer une ligne DB en données d'affichage pour AnnonceCard
function toAnnonceCardData(row: AnnonceRow): AnnonceCardData {
  return {
    id: row.id,
    ville: row.ville,
    codePostal: row.code_postal,
    dateDebut: row.date_debut,
    dateFin: row.date_fin,
    retrocession: row.retrocession,
    statut: row.statut as AnnonceCardData['statut'],
    isUrgent: row.is_urgent,
    typeAnnonce: row.type_annonce,
    typeCabinet: row.type_cabinet,
    source: row.source,
  };
}

export default function MesAnnoncesScreen() {
  const router = useRouter();
  const { data: annoncesData, isLoading } = useMyAnnonces(supabase);
  const annonces: AnnonceCardData[] = (annoncesData ?? []).map(toAnnonceCardData);

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <Pressable
          className="w-11 h-11 items-center justify-center mb-2"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text className="text-jim-primary text-2xl">‹</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-jim-text">Mes annonces</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4B7BEC" />
        </View>
      ) : annonces.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View entering={FadeInDown.duration(400)} className="items-center gap-4">
            <Text className="text-5xl">📋</Text>
            <Text className="text-jim-text font-bold text-xl text-center">
              Aucune annonce pour l'instant
            </Text>
            <Text className="text-jim-muted text-center">
              Publiez votre première annonce et trouvez un remplaçant qualifié
            </Text>
            <Pressable
              className="bg-jim-primary h-12 rounded-xl px-8 items-center justify-center"
              onPress={() => router.push('/(app)/publier' as never)}
              accessibilityRole="button"
            >
              <Text className="text-white font-semibold">Publier une annonce</Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : (
        <FlatList
          data={annonces}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-6 py-4 gap-3"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AnnonceCard
              annonce={item}
              onPress={() => router.push(`/(app)/annonce/${item.id}` as never)}
            />
          )}
          ListFooterComponent={
            <View className="h-8" />
          }
        />
      )}

      {/* FAB Publier */}
      <Pressable
        className="absolute bottom-8 right-6 w-16 h-16 bg-jim-primary rounded-full items-center justify-center shadow-lg active:bg-jim-primary/90"
        onPress={() => router.push('/(app)/publier' as never)}
        accessibilityRole="button"
        accessibilityLabel="Publier une nouvelle annonce"
      >
        <Text className="text-white text-3xl font-light leading-none mt-[-2px]">+</Text>
      </Pressable>
    </View>
  );
}
