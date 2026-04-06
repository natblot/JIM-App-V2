// Ecran proposition directe recue — Epic 11, Story 11.5
// Le remplacant accepte ou decline
import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRespondProposition, useMesPropositions, useAuthStore } from '@jim/shared';
import { supabase } from '../../_layout';

export default function PropositionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const respond = useRespondProposition(supabase);
  const { data: propositions } = useMesPropositions(supabase, user?.id);

  const proposition = propositions?.find((p) => p.id === id);

  const handleResponse = useCallback((response: 'acceptee' | 'declinee') => {
    const label = response === 'acceptee' ? 'Accepter' : 'Decliner';
    Alert.alert(
      `${label} la proposition`,
      response === 'acceptee'
        ? 'Le flow standard (messagerie, contrat, paiement) sera initie.'
        : 'Le titulaire sera notifie et pourra publier l\'annonce publiquement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: label,
          style: response === 'declinee' ? 'destructive' : 'default',
          onPress: () => respond.mutate(
            { propositionId: id ?? '', response },
            {
              onSuccess: () => { Alert.alert('Fait !', `Proposition ${response === 'acceptee' ? 'acceptee' : 'declinee'}.`); router.back(); },
              onError: (err) => Alert.alert('Erreur', err.message),
            },
          ),
        },
      ],
    );
  }, [id, respond, router]);

  if (!proposition) {
    return (
      <View className="flex-1 items-center justify-center bg-jim-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const dateDebut = new Date(proposition.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const dateFin = new Date(proposition.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <ScrollView className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="p-4">
        <Text className="text-xl font-bold text-jim-text mb-2">Proposition de remplacement</Text>

        <View className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-4">
          <View className="mb-3">
            <Text className="text-jim-muted text-xs">Dates</Text>
            <Text className="text-jim-text font-medium">{dateDebut} — {dateFin}</Text>
          </View>
          <View>
            <Text className="text-jim-muted text-xs">Retrocession</Text>
            <Text className="text-jim-text font-medium">{proposition.retrocession}%</Text>
          </View>
        </View>

        {proposition.status === 'envoyee' && (
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 border border-jim-border rounded-xl py-4 min-h-[44px] justify-center"
              onPress={() => handleResponse('declinee')}
              disabled={respond.isPending}
              accessibilityRole="button"
              accessibilityLabel="Decliner la proposition"
            >
              <Text className="text-center text-jim-text font-medium">Decliner</Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-jim-primary rounded-xl py-4 min-h-[44px] justify-center"
              onPress={() => handleResponse('acceptee')}
              disabled={respond.isPending}
              accessibilityRole="button"
              accessibilityLabel="Accepter la proposition"
            >
              {respond.isPending ? <ActivityIndicator color="#fff" /> : (
                <Text className="text-center text-white font-semibold">Accepter</Text>
              )}
            </Pressable>
          </View>
        )}

        {proposition.status !== 'envoyee' && (
          <View className={`rounded-xl p-4 ${proposition.status === 'acceptee' ? 'bg-jim-success/10' : 'bg-jim-muted/10'}`}>
            <Text className={`text-center font-medium ${proposition.status === 'acceptee' ? 'text-jim-success' : 'text-jim-muted'}`}>
              Proposition {proposition.status === 'acceptee' ? 'acceptee' : 'declinee'}
            </Text>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}
