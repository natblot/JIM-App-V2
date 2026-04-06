// Ecran Parametres > Paiement — Onboarding Stripe Connect — Epic 9, Stories 9.1 + 9.2
import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProBadge } from '@jim/ui';
import { useStripeOnboardingStatus, useStripeOnboarding, useAuthStore } from '@jim/shared';
import { supabase } from '../../_layout';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Non configure', color: 'text-jim-muted', bg: 'bg-jim-muted/10' },
  in_progress: { label: 'En cours de verification', color: 'text-amber-600', bg: 'bg-amber-50' },
  verified: { label: 'Verifie', color: 'text-jim-success', bg: 'bg-jim-success/10' },
  action_required: { label: 'Action requise', color: 'text-jim-destructive', bg: 'bg-jim-destructive/10' },
};

export default function PaiementSettingsScreen() {
  const { user, profile } = useAuthStore();
  const { data: status, isLoading } = useStripeOnboardingStatus(supabase, user?.id);
  const onboarding = useStripeOnboarding(supabase);

  const isTitulaire = profile?.role === 'titulaire';
  const isRemplacant = profile?.role === 'remplacant';

  const handleOnboarding = useCallback(() => {
    // URLs de callback pour l'onboarding Stripe
    const refreshUrl = 'jimapp://parametres/paiement?refresh=true';
    const returnUrl = 'jimapp://parametres/paiement?success=true';

    onboarding.mutate(
      { refreshUrl, returnUrl },
      {
        onSuccess: (result) => {
          if (result.onboarding_url) {
            void Linking.openURL(result.onboarding_url);
          } else if (result.status === 'verified') {
            Alert.alert('Deja configure', 'Votre compte de paiement est verifie.');
          }
        },
        onError: (err) => {
          if (err.message.includes('RCP')) {
            Alert.alert(
              'Justificatif RCP requis',
              'Un justificatif d\'assurance responsabilite civile professionnelle est necessaire pour recevoir les paiements.',
            );
          } else {
            Alert.alert('Erreur', err.message);
          }
        },
      },
    );
  }, [onboarding]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-jim-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const statusConfig = STATUS_LABELS[status?.onboardingStatus ?? 'not_started'];

  return (
    <ScrollView className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="p-4">
        <Text className="text-xl font-bold text-jim-text mb-2">Paiement</Text>
        <Text className="text-jim-muted text-sm mb-6">
          Service de securisation professionnelle
        </Text>

        {/* Statut actuel */}
        <View className={`rounded-xl border border-jim-border p-4 mb-4 ${statusConfig.bg}`}>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-medium text-jim-text">Statut du compte</Text>
            <Text className={`text-sm font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </Text>
          </View>
          {status?.stripeAccountId && (
            <Text className="text-xs text-jim-muted mt-1">
              Compte Stripe : {status.stripeAccountId.slice(0, 12)}...
            </Text>
          )}
        </View>

        {/* RCP (remplacant) */}
        {isRemplacant && !status?.rcpVerified && (
          <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <Text className="text-amber-700 font-medium text-sm mb-1">
              Justificatif RCP requis
            </Text>
            <Text className="text-amber-600 text-xs">
              Un justificatif d'assurance responsabilite civile professionnelle est necessaire pour recevoir les paiements.
            </Text>
          </View>
        )}

        {/* Bouton onboarding */}
        {status?.onboardingStatus !== 'verified' && (
          <Pressable
            className={`rounded-xl py-4 min-h-[44px] justify-center mb-4 ${
              onboarding.isPending ? 'bg-jim-muted/30' : 'bg-jim-primary'
            }`}
            onPress={handleOnboarding}
            disabled={onboarding.isPending}
            accessibilityRole="button"
            accessibilityLabel={isTitulaire ? 'Configurer le versement des retrocessions' : 'Configurer la reception des paiements'}
          >
            {onboarding.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white font-semibold">
                {isTitulaire
                  ? 'Configurer le versement des retrocessions'
                  : 'Configurer la reception des paiements'}
              </Text>
            )}
          </Pressable>
        )}

        {/* Statut verifie */}
        {status?.onboardingStatus === 'verified' && (
          <View className="bg-jim-success/10 border border-jim-success/30 rounded-xl p-4 mb-4">
            <Text className="text-jim-success font-semibold text-center">
              Compte verifie — vous etes pret !
            </Text>
          </View>
        )}

        {/* Lien vers abonnement Pro */}
        {isTitulaire && (
          <Pressable
            className="bg-jim-surface border border-jim-border rounded-xl p-4 min-h-[44px] justify-center"
            onPress={() => Alert.alert('JIM Pro', 'Disponible apres la periode de lancement.')}
            accessibilityRole="button"
            accessibilityLabel="En savoir plus sur JIM Pro"
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-jim-text font-medium">JIM Pro</Text>
                <Text className="text-jim-muted text-xs">0% de frais de gestion — 5,90 EUR/mois</Text>
              </View>
              <ProBadge />
            </View>
          </Pressable>
        )}
      </Animated.View>
    </ScrollView>
  );
}
