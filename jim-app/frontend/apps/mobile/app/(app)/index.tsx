// apps/mobile/app/(app)/index.tsx
// Écran d'accueil adapté au rôle — Story 4.1
// Dashboard titulaire (Epic 2) ou vue recherche remplaçant (Epic 4)
// Adapté Epic 5 : section "Candidatures reçues" dans le dashboard titulaire
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useMyAnnonces, useMyProfile } from '@jim/shared';
import { AnnonceSkeleton } from '@jim/ui';
import { supabase } from '../_layout';
import { useQuery } from '@tanstack/react-query';
import RechercheScreen from './recherche';

export default function HomeScreen() {
  const { data: profile, isLoading: isProfileLoading } = useMyProfile(supabase);

  // Attendre le chargement du profil avant d'afficher quoi que ce soit
  if (isProfileLoading || !profile) {
    return (
      <View className="flex-1 bg-jim-background px-4 pt-20">
        <AnnonceSkeleton count={2} />
      </View>
    );
  }

  // Routing conditionnel par rôle
  if (profile.role === 'remplacant') {
    return <RechercheScreen />;
  }

  // Vue titulaire (rôle = 'titulaire' ou indéfini)
  return <TitulaireHome />;
}

// --- Dashboard titulaire (code original préservé) ---

// Interface minimale pour les candidatures reçues
interface CandidatureRecue {
  id: string;
  statut: string;
  created_at: string;
  annonces: { ville: string; id: string } | null;
  profiles: { prenom: string | null; nom: string | null } | null;
}

// Hook de chargement des candidatures non traitées pour le titulaire
function useCandidaturesRecues() {
  return useQuery({
    queryKey: ['candidatures-recues-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          id,
          statut,
          created_at,
          annonces (id, ville),
          profiles:remplacant_id (prenom, nom)
        `)
        .in('statut', ['en_attente', 'vue'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as CandidatureRecue[];
    },
  });
}

function TitulaireHome() {
  const router = useRouter();
  const { data: annonces } = useMyAnnonces(supabase);
  const { data: candidaturesRecues } = useCandidaturesRecues();

  // Compteurs calculés depuis les données réelles
  const actives = annonces?.filter((a) => a.statut === 'active').length ?? 0;
  const enCours = annonces?.filter((a) => a.statut === 'en_cours').length ?? 0;
  const hasAnnonces = (annonces?.length ?? 0) > 0;
  // Candidatures non traitées — badge count
  const candidaturesNonTraitees = candidaturesRecues?.filter((c) => c.statut === 'en_attente').length ?? 0;
  const recentCandidatures = candidaturesRecues?.slice(0, 3) ?? [];

  // Afficher uniquement les 3 annonces les plus récentes sur le dashboard
  const recentAnnonces = annonces?.slice(0, 3) ?? [];

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border"
      >
        <Text className="text-jim-muted text-sm">Bonjour 👋</Text>
        <Text className="text-2xl font-bold text-jim-text mt-1">
          Tableau de bord
        </Text>
      </Animated.View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* CTA Principal — publier une annonce */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Pressable
            className="bg-jim-primary h-16 rounded-2xl items-center justify-center active:bg-jim-primary/90"
            onPress={() => router.push('/(app)/publier' as never)}
            accessibilityRole="button"
            accessibilityLabel="Publier une nouvelle annonce"
          >
            <Text className="text-white font-bold text-base">
              + Publier une annonce
            </Text>
          </Pressable>
        </Animated.View>

        {/* Compteurs rapides */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(150)}
          className="flex-row gap-3"
        >
          <StatCard label="Annonces actives" value={String(actives)} color="jim-success" />
          <StatCard label="En cours" value={String(enCours)} color="jim-accent" />
          <StatCard
            label="Candidatures"
            value={String(candidaturesRecues?.length ?? 0)}
            color="jim-primary"
          />
        </Animated.View>

        {/* Mes annonces récentes */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-jim-text font-bold text-lg">Mes annonces</Text>
            <Pressable
              onPress={() => router.push('/(app)/mes-annonces' as never)}
              accessibilityRole="link"
            >
              <Text className="text-jim-primary text-sm font-medium">Voir tout</Text>
            </Pressable>
          </View>

          {hasAnnonces ? (
            recentAnnonces.map((annonce) => (
              <Pressable
                key={annonce.id}
                className="bg-jim-surface rounded-2xl p-4 border border-jim-border active:opacity-80"
                onPress={() => router.push(`/(app)/annonce/${annonce.id}` as never)}
                accessibilityRole="button"
              >
                <Text className="text-jim-text font-semibold">{annonce.ville}</Text>
                <Text className="text-jim-muted text-sm mt-1">
                  {annonce.date_debut} → {annonce.date_fin} · {annonce.retrocession}%
                </Text>
              </Pressable>
            ))
          ) : (
            <EmptyAnnonceState onPress={() => router.push('/(app)/publier' as never)} />
          )}
        </Animated.View>

        {/* Section "Candidatures reçues" — Epic 5 */}
        <Animated.View entering={FadeInDown.duration(400).delay(250)} className="gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-jim-text font-bold text-lg">Candidatures reçues</Text>
              {/* Badge count — uniquement si des candidatures sont non traitées */}
              {candidaturesNonTraitees > 0 && (
                <View className="bg-jim-primary rounded-full px-2 py-0.5">
                  <Text className="text-white text-xs font-bold">{candidaturesNonTraitees}</Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={() => router.push('/(app)/mes-candidatures' as never)}
              accessibilityRole="link"
              accessibilityLabel="Voir toutes les candidatures reçues"
            >
              <Text className="text-jim-primary text-sm font-medium">Voir tout</Text>
            </Pressable>
          </View>

          {recentCandidatures.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3 pr-2"
            >
              {recentCandidatures.map((candidature) => {
                const nomRemplacant =
                  [candidature.profiles?.prenom, candidature.profiles?.nom]
                    .filter(Boolean)
                    .join(' ') || 'Remplaçant';
                const isNew = candidature.statut === 'en_attente';

                return (
                  <Pressable
                    key={candidature.id}
                    className="bg-jim-surface rounded-2xl p-4 border border-jim-border active:opacity-80 w-52"
                    onPress={() =>
                      router.push(
                        `/(app)/annonce/${candidature.annonces?.id ?? ''}` as never
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Candidature de ${nomRemplacant}`}
                  >
                    {/* Badge nouveau */}
                    {isNew && (
                      <View className="bg-jim-primary/10 border border-jim-primary/20 self-start px-2 py-0.5 rounded-full mb-2">
                        <Text className="text-jim-primary text-xs font-semibold">Nouveau</Text>
                      </View>
                    )}
                    <Text className="text-jim-text font-semibold" numberOfLines={1}>
                      {nomRemplacant}
                    </Text>
                    <Text className="text-jim-muted text-xs mt-1" numberOfLines={1}>
                      {candidature.annonces?.ville ?? '—'}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <View className="bg-jim-surface rounded-2xl p-6 items-center border border-dashed border-jim-border">
              <Text className="text-jim-muted text-sm text-center">
                Aucune candidature en attente — publiez une annonce pour en recevoir
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View className="flex-1 bg-jim-surface rounded-xl p-4 border border-jim-border">
      <Text className={`text-2xl font-bold text-${color}`}>{value}</Text>
      <Text className="text-jim-muted text-xs mt-1">{label}</Text>
    </View>
  );
}

function EmptyAnnonceState({ onPress }: { onPress: () => void }) {
  return (
    <View className="bg-jim-surface rounded-2xl p-8 items-center border border-dashed border-jim-border">
      <Text className="text-4xl mb-3" aria-hidden>📋</Text>
      <Text className="text-jim-text font-semibold text-center">
        Pas encore d'annonce publiée
      </Text>
      <Text className="text-jim-muted text-sm text-center mt-2 mb-4">
        Publiez votre première annonce en moins de 2 minutes
      </Text>
      <Pressable
        className="bg-jim-primary/10 border border-jim-primary/30 rounded-xl px-6 py-3"
        onPress={onPress}
        accessibilityRole="button"
      >
        <Text className="text-jim-primary font-semibold">Commencer</Text>
      </Pressable>
    </View>
  );
}
