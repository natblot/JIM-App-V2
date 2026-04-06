// Ecran paiement/versement retrocession — Epic 9, Story 9.3 + 9.4 + 9.5
// Vue titulaire : declarer honoraires + confirmer versement
// Vue remplacant : voir le montant + contester si desaccord
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PaymentBreakdown, PaymentStatusBadge } from '@jim/ui';
import {
  usePaiementByContrat,
  useCreatePayment,
  useCommissionCalculator,
  formatEuros,
  useAuthStore,
} from '@jim/shared';
import { supabase } from '../../_layout';

export default function PaiementScreen() {
  const { contratId } = useLocalSearchParams<{ contratId: string }>();
  const { user } = useAuthStore();

  const { data: paiement, isLoading: paiementLoading } = usePaiementByContrat(supabase, contratId);
  const createPayment = useCreatePayment(supabase);

  const [montantSaisi, setMontantSaisi] = useState('');
  const montantCents = Math.round(parseFloat(montantSaisi.replace(',', '.') || '0') * 100);

  // Taux de retrocession depuis le contrat (via le paiement existant ou defaut 80)
  const tauxRetrocession = paiement?.taux_retrocession ?? 80;
  const isTitulaire = user?.id === paiement?.titulaire_id;

  // Calcul en temps reel pour l'apercu (client-side uniquement)
  const breakdown = useCommissionCalculator({
    montantEncaisseCents: montantCents,
    tauxRetrocession,
    isPro: false,
    isLaunchPeriod: true,
  });

  const handleCreatePayment = useCallback(() => {
    if (montantCents <= 0) {
      Alert.alert('Montant invalide', 'Veuillez saisir le montant des honoraires encaisses.');
      return;
    }
    Alert.alert(
      'Confirmer le versement',
      `Vous allez initier un versement de ${formatEuros(breakdown.montantNetRemplacantCents)} au remplacant.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            createPayment.mutate(
              { contratId: contratId ?? '', montantEncaisseCents: montantCents },
              {
                onSuccess: () => Alert.alert('Versement initie', 'Le remplacant sera notifie pour valider le montant.'),
                onError: (err) => Alert.alert('Erreur', err.message),
              },
            );
          },
        },
      ],
    );
  }, [montantCents, breakdown.montantNetRemplacantCents, contratId, createPayment]);

  const handleContest = useCallback(() => {
    if (!paiement) return;
    Alert.alert(
      'Contester le montant',
      'Vous signalez un desaccord sur le montant declare. Le titulaire sera notifie.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Contester',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('paiements')
              .update({ status: 'conteste' })
              .eq('id', paiement.id);
            if (error) Alert.alert('Erreur', error.message);
          },
        },
      ],
    );
  }, [paiement]);

  if (paiementLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-jim-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Si un paiement existe deja, afficher son statut
  if (paiement) {
    return (
      <ScrollView className="flex-1 bg-jim-background">
        <Animated.View entering={FadeInDown.duration(400)} className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-jim-text">Versement de retrocession</Text>
            <PaymentStatusBadge statut={paiement.status} />
          </View>

          <PaymentBreakdown
            montantEncaisseCents={paiement.montant_encaisse_cents}
            tauxRetrocession={paiement.taux_retrocession}
            montantRetrocessionCents={paiement.montant_retrocession_cents}
            partTitulaireCents={paiement.part_titulaire_cents}
            commissionJimCents={paiement.commission_jim_cents}
            montantNetRemplacantCents={paiement.montant_net_remplacant_cents}
            isLaunchPeriod={paiement.commission_type === 'lancement'}
            className="mb-4"
          />

          {/* Litige : remplacant peut contester */}
          {!isTitulaire && paiement.status === 'en_attente_validation' && (
            <Pressable
              className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 min-h-[44px] justify-center"
              onPress={handleContest}
              accessibilityRole="button"
              accessibilityLabel="Contester le montant declare"
            >
              <Text className="text-center text-orange-700 font-medium">
                Contester le montant declare
              </Text>
            </Pressable>
          )}

          {/* Litige en cours */}
          {paiement.status === 'conteste' && (
            <View className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <Text className="text-orange-700 font-medium mb-1">Desaccord sur le montant</Text>
              <Text className="text-orange-600 text-sm">
                Echangez via la messagerie pour trouver un accord. Le titulaire peut ajuster le montant.
              </Text>
            </View>
          )}

          {/* Paiement confirme */}
          {paiement.status === 'confirme' && (
            <View className="bg-jim-success/10 border border-jim-success/30 rounded-xl p-4 mb-4">
              <Text className="text-jim-success font-semibold text-center text-lg mb-1">
                Paiement confirme
              </Text>
              <Text className="text-jim-success/80 text-center text-sm">
                {isTitulaire
                  ? `Versement de ${formatEuros(paiement.montant_retrocession_cents)} effectue`
                  : `Vous recevrez ${formatEuros(paiement.montant_net_remplacant_cents)} sous 48-72h`}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    );
  }

  // Pas de paiement → formulaire de creation (titulaire uniquement)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-jim-background"
    >
      <ScrollView className="flex-1">
        <Animated.View entering={FadeInDown.duration(400)} className="p-4">
          <Text className="text-xl font-bold text-jim-text mb-2">
            Versement de retrocession
          </Text>
          <Text className="text-jim-muted text-sm mb-6">
            Service de securisation professionnelle — versez la retrocession en toute confiance
          </Text>

          {/* Saisie du montant */}
          <Text className="text-sm font-medium text-jim-text mb-2">
            Honoraires encaisses pendant le remplacement
          </Text>
          <View className="flex-row items-center bg-jim-surface border border-jim-border rounded-xl px-4 py-3 mb-4">
            <TextInput
              className="flex-1 text-2xl font-bold text-jim-text"
              value={montantSaisi}
              onChangeText={setMontantSaisi}
              placeholder="0,00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              accessibilityLabel="Montant des honoraires encaisses en euros"
            />
            <Text className="text-jim-muted text-lg ml-2">EUR</Text>
          </View>

          {/* Apercu en temps reel */}
          {montantCents > 0 && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <PaymentBreakdown
                montantEncaisseCents={breakdown.montantEncaisseCents}
                tauxRetrocession={breakdown.tauxRetrocession}
                montantRetrocessionCents={breakdown.montantRetrocessionCents}
                partTitulaireCents={breakdown.partTitulaireCents}
                commissionJimCents={breakdown.commissionJimCents}
                montantNetRemplacantCents={breakdown.montantNetRemplacantCents}
                isLaunchPeriod={breakdown.isLaunchPeriod}
                className="mb-6"
              />
            </Animated.View>
          )}

          {/* Bouton confirmer */}
          <Pressable
            className={`rounded-xl py-4 min-h-[44px] justify-center ${
              montantCents > 0 && !createPayment.isPending
                ? 'bg-jim-primary'
                : 'bg-jim-muted/30'
            }`}
            onPress={handleCreatePayment}
            disabled={montantCents <= 0 || createPayment.isPending}
            accessibilityRole="button"
            accessibilityLabel="Confirmer le versement"
          >
            {createPayment.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white font-semibold text-base">
                Confirmer le versement
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
