// apps/mobile/app/(app)/mes-candidatures.tsx
// Écran mes candidatures — vue remplaçant — Story 5.3
// Tabs : En cours | Historique — liste avec pipeline de statut
import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CandidatureCard, PipelineStatus, AnnonceSkeleton } from '@jim/ui';
import { supabase } from '../_layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Statuts considérés comme "en cours" (non terminaux)
const STATUTS_EN_COURS = ['en_attente', 'vue', 'en_discussion', 'acceptee'];
const STATUTS_HISTORIQUE = ['refusee', 'expiree'];

interface Candidature {
  id: string;
  statut: string;
  created_at: string;
  message: string | null;
  annonces: {
    id: string;
    ville: string;
    statut: string;
    date_debut: string;
    date_fin: string;
    retrocession: number;
    is_urgent: boolean;
  } | null;
}

// Hook de chargement des candidatures du remplaçant connecté
function useMesCandidatures() {
  return useQuery({
    queryKey: ['mes-candidatures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          id,
          statut,
          created_at,
          message,
          annonces (
            id,
            ville,
            statut,
            date_debut,
            date_fin,
            retrocession,
            is_urgent
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Candidature[];
    },
  });
}

// Hook pour retirer une candidature
function useRetirerCandidature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (candidatureId: string) => {
      const { error } = await supabase
        .from('candidatures')
        .delete()
        .eq('id', candidatureId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['mes-candidatures'] });
    },
  });
}

type Tab = 'en_cours' | 'historique';

export default function MesCandidaturesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('en_cours');
  const { data: candidatures, isLoading } = useMesCandidatures();
  const retirerCandidature = useRetirerCandidature();

  const enCours = candidatures?.filter((c) => STATUTS_EN_COURS.includes(c.statut)) ?? [];
  const historique = candidatures?.filter((c) => STATUTS_HISTORIQUE.includes(c.statut)) ?? [];

  const displayed = activeTab === 'en_cours' ? enCours : historique;

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
        <Text className="text-2xl font-bold text-jim-text">Mes candidatures</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-jim-surface border-b border-jim-border px-6">
        {(['en_cours', 'historique'] as Tab[]).map((tab) => {
          const count = tab === 'en_cours' ? enCours.length : historique.length;
          const isActive = activeTab === tab;
          const label = tab === 'en_cours' ? 'En cours' : 'Historique';

          return (
            <Pressable
              key={tab}
              className={[
                'flex-1 py-3 items-center border-b-2',
                isActive ? 'border-jim-primary' : 'border-transparent',
              ].join(' ')}
              onPress={() => setActiveTab(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${label} — ${count} candidature${count > 1 ? 's' : ''}`}
            >
              <View className="flex-row items-center gap-2">
                <Text
                  className={[
                    'text-sm font-semibold',
                    isActive ? 'text-jim-primary' : 'text-jim-muted',
                  ].join(' ')}
                >
                  {label}
                </Text>
                {count > 0 && (
                  <View
                    className={[
                      'px-1.5 py-0.5 rounded-full',
                      isActive ? 'bg-jim-primary' : 'bg-jim-muted/30',
                    ].join(' ')}
                  >
                    <Text
                      className={[
                        'text-xs font-bold',
                        isActive ? 'text-white' : 'text-jim-muted',
                      ].join(' ')}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Contenu */}
      {isLoading ? (
        <View className="px-4 pt-4">
          <AnnonceSkeleton count={3} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-6 gap-6"
          showsVerticalScrollIndicator={false}
        >
          {displayed.length === 0 ? (
            <EmptyCandidaturesState
              tab={activeTab}
              onRechercher={() => router.push('/(app)/recherche' as never)}
            />
          ) : (
            displayed.map((candidature, index) => {
              const annonce = candidature.annonces;
              if (!annonce) return null;

              return (
                <Animated.View
                  key={candidature.id}
                  entering={FadeInDown.duration(300).delay(index * 60)}
                  className="gap-3"
                >
                  <CandidatureCard
                    annonceVille={annonce.ville}
                    annonceStatut={annonce.statut}
                    dateDebut={annonce.date_debut}
                    dateFin={annonce.date_fin}
                    retrocession={annonce.retrocession}
                    statut={candidature.statut as Parameters<typeof CandidatureCard>[0]['statut']}
                    createdAt={candidature.created_at}
                    isUrgent={annonce.is_urgent}
                    onPress={() =>
                      router.push(`/(app)/annonce/${annonce.id}` as never)
                    }
                    onRetirer={
                      candidature.statut === 'en_attente'
                        ? () => retirerCandidature.mutate(candidature.id)
                        : undefined
                    }
                  />

                  {/* Pipeline de statut — uniquement pour les candidatures en cours */}
                  {activeTab === 'en_cours' && (
                    <View className="bg-jim-surface border border-jim-border rounded-2xl px-4 py-4">
                      <PipelineStatus statut={candidature.statut} />
                    </View>
                  )}
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

function EmptyCandidaturesState({
  tab,
  onRechercher,
}: {
  tab: Tab;
  onRechercher: () => void;
}) {
  if (tab === 'historique') {
    return (
      <View className="items-center py-12 gap-4">
        <Text className="text-5xl" aria-hidden>📂</Text>
        <Text className="text-jim-text font-bold text-lg text-center">
          Pas encore d'historique
        </Text>
        <Text className="text-jim-muted text-sm text-center leading-5 px-4">
          Vos candidatures acceptées ou refusées apparaîtront ici — gardez le cap !
        </Text>
      </View>
    );
  }

  return (
    <View className="items-center py-12 gap-4">
      <Text className="text-5xl" aria-hidden>🌟</Text>
      <Text className="text-jim-text font-bold text-lg text-center">
        Pas encore de candidatures
      </Text>
      <Text className="text-jim-muted text-sm text-center leading-5 px-4">
        Trouvez des annonces et candidatez en 1 tap — les titulaires reçoivent votre profil en temps réel
      </Text>
      <Pressable
        className="bg-jim-primary/10 border border-jim-primary/30 rounded-xl px-6 py-3 mt-2 active:opacity-80"
        onPress={onRechercher}
        accessibilityRole="button"
        accessibilityLabel="Rechercher des annonces"
      >
        <Text className="text-jim-primary font-semibold">Trouver des annonces</Text>
      </Pressable>
    </View>
  );
}
