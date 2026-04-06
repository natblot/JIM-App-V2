// apps/mobile/app/(app)/annonce/[id].tsx
// Détail d'une annonce — Vue titulaire (modifier, fermer, urgent) — Story 2.3
// Adapté Epic 3 : bannière + CTAs différenciés pour les annonces agrégées
// Adapté Epic 4 : skeleton loading, bandeau offline, annonces similaires (Story 4.4)
// Adapté Epic 5 : bouton Candidater (remplaçant), FavoriButton (titulaire), UndoToast retrait
import { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  StatusBadge,
  UrgentBadge,
  AnnonceSkeleton,
  OfflineBanner,
  AnnonceCard,
  FavoriButton,
  UndoToast,
  type AnnonceCardData,
} from '@jim/ui';
import {
  useAnnonce,
  useUpdateAnnonce,
  formatFreshness,
  useNetworkStatus,
  useAnnoncesSimilaires,
  useMyProfile,
} from '@jim/shared';
import { supabase } from '../../_layout';
import { AggregatedBanner } from '../../../components/annonces/aggregated-banner';
import { IncentivePublish } from '../../../components/annonces/incentive-publish';

export default function AnnonceDetailScreen() {
  const {
    id,
    candidature_success,
    candidature_ville,
    candidature_dates,
    candidature_retro,
  } = useLocalSearchParams<{
    id: string;
    candidature_success?: string;
    candidature_ville?: string;
    candidature_dates?: string;
    candidature_retro?: string;
  }>();
  const router = useRouter();

  const { isOffline } = useNetworkStatus();
  const { data: annonce, isLoading } = useAnnonce(supabase, id ?? '');
  const { data: profile } = useMyProfile(supabase);
  const updateAnnonce = useUpdateAnnonce(supabase);

  // Annonces similaires — activées uniquement quand l'annonce est "pourvue" (Story 4.4)
  const { data: similaires } = useAnnoncesSimilaires(
    supabase,
    id ?? '',
    annonce?.statut === 'pourvue'
  );

  const isAggregated = Boolean(annonce?.source && annonce.source !== 'native');
  const isRemplacant = profile?.role === 'remplacant';

  // UndoToast — affiché après retour de l'écran candidater avec succès
  const [undoToastVisible, setUndoToastVisible] = useState(
    candidature_success === '1'
  );

  const undoMessage = candidature_ville
    ? `Candidature envoyée — ${candidature_ville} · ${candidature_dates ?? ''} · ${candidature_retro ?? ''}%`
    : 'Candidature envoyée';

  // Retrait de candidature via undo
  const handleUndo = useCallback(async () => {
    setUndoToastVisible(false);
    // Suppression de la dernière candidature pour cette annonce
    await supabase
      .from('candidatures')
      .delete()
      .eq('annonce_id', id ?? '')
      .order('created_at', { ascending: false })
      .limit(1);
  }, [id]);

  // Gestion favori remplaçant — état local optimiste
  const [isFavori, setIsFavori] = useState(false);

  const handleToggleFavori = useCallback(async () => {
    setIsFavori((prev) => !prev);
    if (!isFavori) {
      // Ajouter aux favoris
      await supabase.from('favoris').insert({ annonce_id: id });
    } else {
      // Retirer des favoris
      await supabase.from('favoris').delete().eq('annonce_id', id);
    }
  }, [isFavori, id]);

  const handleClose = () => {
    if (!annonce) return;
    Alert.alert(
      'Fermer cette annonce ?',
      'L\'annonce passera en statut "Pourvue" et ne sera plus visible dans les recherches.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, fermer',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateAnnonce.mutateAsync({ id: annonce.id, statut: 'pourvue' });
              router.replace('/(app)/mes-annonces' as never);
            } catch {
              Alert.alert('Erreur', 'Impossible de fermer cette annonce pour le moment.');
            }
          },
        },
      ]
    );
  };

  // Écran de chargement — skeleton reprenant la forme du détail
  if (isLoading || !annonce) {
    return (
      <View className="flex-1 bg-jim-background">
        <OfflineBanner isOffline={isOffline} />
        {/* Bouton retour minimal pendant le chargement */}
        <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
          <Pressable
            className="w-11 h-11 items-center justify-center mb-2"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Text className="text-jim-primary text-2xl">‹</Text>
          </Pressable>
        </View>
        <View className="px-4 pt-4">
          <AnnonceSkeleton count={1} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-jim-background">
      {/* Bandeau hors ligne — position absolue */}
      <OfflineBanner isOffline={isOffline} />
      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable
            className="w-11 h-11 items-center justify-center"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Text className="text-jim-primary text-2xl">‹</Text>
          </Pressable>
          {/* FavoriButton — visible uniquement pour les titulaires sur les annonces natives */}
          {!isRemplacant && !isAggregated && (
            <FavoriButton isFavori={isFavori} onToggle={handleToggleFavori} size={22} />
          )}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-jim-text">
            {isRemplacant ? annonce.ville : 'Mon annonce'}
          </Text>
          <View className="flex-row gap-2">
            <StatusBadge statut={annonce.statut} />
            {annonce.is_urgent && <UrgentBadge />}
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="py-6 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Bannière source externe — uniquement pour les annonces agrégées */}
        {isAggregated && (
          <AggregatedBanner
            source={annonce.source!}
            lastVerifiedAt={annonce.source_last_verified_at}
            freshnessText={formatFreshness(annonce.source_last_verified_at)}
          />
        )}

        {/* Infos principales */}
        <Animated.View entering={FadeInDown.duration(400)} className="gap-4 px-6">
          <InfoRow label="Ville" value={annonce.ville} />
          <InfoRow label="Dates" value={`${annonce.date_debut} → ${annonce.date_fin}`} />
          <InfoRow label="Rétrocession" value={`${annonce.retrocession}%`} highlight />
          {annonce.type_cabinet && (
            <InfoRow label="Type de cabinet" value={annonce.type_cabinet} />
          )}
          {annonce.description && (
            <InfoRow label="Description" value={annonce.description} />
          )}
        </Animated.View>

        {/* Section candidatures — uniquement pour les annonces natives + vue titulaire */}
        {!isAggregated && !isRemplacant && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            className="mx-6 bg-jim-surface border border-jim-border rounded-2xl p-4"
          >
            <Text className="text-jim-text font-semibold mb-2">Candidatures reçues</Text>
            <Text className="text-jim-muted text-sm">
              La gestion des candidatures sera disponible dans la prochaine version.
            </Text>
          </Animated.View>
        )}

        {/* Encart incitatif publication — uniquement pour les annonces agrégées */}
        {isAggregated && <IncentivePublish />}

        {/* Annonces similaires — Story 4.4 — affichées quand l'annonce est pourvue */}
        {annonce.statut === 'pourvue' && (
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            className="mx-6 gap-3"
          >
            <Text className="text-jim-text font-bold text-lg">
              Annonces dans la même zone
            </Text>
            {similaires && similaires.length > 0 ? (
              similaires.map((s) => (
                <AnnonceCard
                  key={s.id}
                  annonce={{
                    id: s.id,
                    ville: s.ville,
                    dateDebut: s.date_debut,
                    dateFin: s.date_fin,
                    retrocession: s.retrocession,
                    statut: s.statut as AnnonceCardData['statut'],
                    isUrgent: s.is_urgent,
                    source: s.source,
                  }}
                  onPress={() =>
                    router.push(`/(app)/annonce/${s.id}` as never)
                  }
                />
              ))
            ) : (
              <View className="bg-jim-surface border border-jim-border rounded-2xl p-4">
                <Text className="text-jim-muted text-sm text-center">
                  Pas d'autres annonces dans cette zone pour l'instant — on te tiendra au courant.
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Actions sticky en bas */}
      <View className="px-6 pb-10 pt-4 gap-3 border-t border-jim-border bg-jim-surface">
        {isRemplacant ? (
          /* CTAs vue remplaçant — candidater sur une annonce native */
          !isAggregated ? (
            <Pressable
              className="h-14 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
              onPress={() =>
                router.push({
                  pathname: '/(app)/candidater',
                  params: {
                    annonce_id: annonce.id,
                    ville: annonce.ville,
                    date_debut: annonce.date_debut,
                    date_fin: annonce.date_fin,
                    retrocession: String(annonce.retrocession),
                  },
                } as never)
              }
              accessibilityRole="button"
              accessibilityLabel={`Candidater pour l'annonce de ${annonce.ville}`}
            >
              <Text className="text-white font-semibold">Candidater</Text>
            </Pressable>
          ) : (
            /* CTAs remplaçant sur annonce agrégée */
            <View className="gap-3">
              <Pressable
                className="h-14 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
                onPress={() => Linking.openURL(annonce.source_url ?? '')}
                accessibilityRole="link"
                accessibilityLabel={`Voir l'annonce originale sur ${annonce.source}`}
              >
                <Text className="text-white font-semibold">
                  Voir l'originale sur {annonce.source ?? 'la source'}
                </Text>
              </Pressable>
            </View>
          )
        ) : !isAggregated ? (
          /* CTAs titulaire — annonce native */
          <>
            <Pressable
              className="h-14 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
              onPress={() => router.push('/(app)/publier' as never)}
              accessibilityRole="button"
            >
              <Text className="text-white font-semibold">Modifier l'annonce</Text>
            </Pressable>

            <Pressable
              className={`h-12 rounded-xl border-2 border-jim-destructive/30 items-center justify-center ${
                updateAnnonce.isPending ? 'opacity-50' : 'active:opacity-80'
              }`}
              onPress={handleClose}
              disabled={updateAnnonce.isPending}
              accessibilityRole="button"
              accessibilityLabel="Fermer l'annonce — j'ai trouvé mon remplaçant"
            >
              {updateAnnonce.isPending ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <Text className="text-jim-destructive font-medium">
                  J'ai trouvé mon remplaçant
                </Text>
              )}
            </Pressable>
          </>
        ) : (
          /* CTAs titulaire — annonce agrégée */
          <View className="gap-3">
            <Pressable
              className="h-14 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
              onPress={() => Linking.openURL(annonce.source_url ?? '')}
              accessibilityRole="link"
              accessibilityLabel={`Voir l'annonce originale sur ${annonce.source}`}
            >
              <Text className="text-white font-semibold">
                Voir l'originale sur {annonce.source ?? 'la source'}
              </Text>
            </Pressable>
            <Pressable
              className="h-12 rounded-xl border-2 border-jim-primary/30 items-center justify-center active:opacity-80"
              onPress={() => {/* TODO : useAlerteSimilaire */}}
              accessibilityRole="button"
            >
              <Text className="text-jim-primary font-medium text-sm">
                Recevoir des alertes similaires sur JIM
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* UndoToast — affiché après candidature réussie */}
      <UndoToast
        visible={undoToastVisible}
        message={undoMessage}
        onUndo={handleUndo}
        onDismiss={() => setUndoToastVisible(false)}
        duration={5000}
      />
    </View>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-jim-border">
      <Text className="text-jim-muted text-sm">{label}</Text>
      <Text className={`font-semibold ${highlight ? 'text-jim-primary text-lg' : 'text-jim-text'}`}>
        {value}
      </Text>
    </View>
  );
}
