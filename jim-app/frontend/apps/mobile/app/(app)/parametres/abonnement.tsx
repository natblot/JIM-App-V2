// Ecran Abonnement Pro — Epic 9, Story 9.6
import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProBadge } from '@jim/ui';
import { useSubscription, useCancelSubscription, useAuthStore } from '@jim/shared';
import { supabase } from '../../_layout';

const ADVANTAGES = [
  { title: '0% de frais de gestion', desc: 'Sur tous vos versements de retrocession' },
  { title: 'Badge Pro visible', desc: 'Renforcez votre credibilite professionnelle' },
  { title: 'Support prioritaire', desc: 'Reponse sous 24h garantie' },
];

export default function AbonnementScreen() {
  const { user, profile } = useAuthStore();
  const { data: subscription, isLoading } = useSubscription(supabase, user?.id);
  const cancelSub = useCancelSubscription(supabase);

  const isActive = subscription?.status === 'active';
  const isLaunchPeriod = profile?.launch_period_active ?? true;

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Annuler l\'abonnement Pro',
      'Votre abonnement restera actif jusqu\'a la fin de la periode en cours. Les frais de gestion de 1% s\'appliqueront ensuite.',
      [
        { text: 'Garder Pro', style: 'cancel' },
        {
          text: 'Annuler',
          style: 'destructive',
          onPress: () => cancelSub.mutate(true, {
            onSuccess: () => Alert.alert('Abonnement annule', 'Votre abonnement Pro restera actif jusqu\'a la fin de la periode.'),
            onError: (err) => Alert.alert('Erreur', err.message),
          }),
        },
      ],
    );
  }, [cancelSub]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-jim-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="p-4">
        {/* Header */}
        <View className="items-center mb-6">
          <ProBadge size="md" className="mb-3" />
          <Text className="text-2xl font-bold text-jim-text">JIM Pro</Text>
          <Text className="text-jim-muted text-sm mt-1">5,90 EUR / mois</Text>
        </View>

        {/* Periode de lancement */}
        {isLaunchPeriod && (
          <View className="bg-jim-success/10 border border-jim-success/30 rounded-xl p-4 mb-4">
            <Text className="text-jim-success font-medium text-center text-sm">
              Pendant la periode de lancement, tous les versements sont sans frais de gestion.
              L'abonnement Pro sera disponible par la suite.
            </Text>
          </View>
        )}

        {/* Avantages */}
        <View className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-4">
          <Text className="text-sm font-semibold text-jim-text mb-3">Avantages</Text>
          {ADVANTAGES.map((adv, i) => (
            <View key={i} className="flex-row items-start mb-3 last:mb-0">
              <View className="w-5 h-5 rounded-full bg-jim-primary/10 items-center justify-center mr-3 mt-0.5">
                <Text className="text-jim-primary text-xs font-bold">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-jim-text font-medium text-sm">{adv.title}</Text>
                <Text className="text-jim-muted text-xs">{adv.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Comparaison */}
        <View className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-6">
          <Text className="text-sm font-semibold text-jim-text mb-3">Comparaison</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-jim-muted text-sm">Gratuit</Text>
            <Text className="text-jim-text text-sm">1% de frais de gestion</Text>
          </View>
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <Text className="text-jim-text text-sm font-medium mr-2">Pro</Text>
              <ProBadge size="sm" />
            </View>
            <Text className="text-jim-success text-sm font-semibold">0% de frais de gestion</Text>
          </View>
          <Text className="text-jim-muted text-xs mt-3">
            Des 590 EUR de versements/mois, le Pro s'amortit.
          </Text>
        </View>

        {/* Bouton action */}
        {isActive ? (
          <View>
            <View className="bg-jim-success/10 border border-jim-success/30 rounded-xl p-4 mb-4">
              <Text className="text-jim-success font-semibold text-center">Abonnement Pro actif</Text>
              {subscription.cancel_at_period_end && (
                <Text className="text-jim-muted text-xs text-center mt-1">
                  Sera annule le {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                </Text>
              )}
            </View>
            {!subscription.cancel_at_period_end && (
              <Pressable
                className="border border-jim-destructive/30 rounded-xl py-3 min-h-[44px] justify-center"
                onPress={handleCancel}
                disabled={cancelSub.isPending}
                accessibilityRole="button"
                accessibilityLabel="Annuler l'abonnement Pro"
              >
                <Text className="text-center text-jim-destructive text-sm">
                  Annuler mon abonnement
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <Pressable
            className={`rounded-xl py-4 min-h-[44px] justify-center ${
              isLaunchPeriod ? 'bg-jim-muted/30' : 'bg-jim-primary'
            }`}
            disabled={isLaunchPeriod}
            onPress={() => Alert.alert('Abonnement Pro', 'Disponible apres la periode de lancement.')}
            accessibilityRole="button"
            accessibilityLabel="S'abonner a JIM Pro"
          >
            <Text className={`text-center font-semibold ${isLaunchPeriod ? 'text-jim-muted' : 'text-white'}`}>
              {isLaunchPeriod ? 'Disponible apres le lancement' : 'S\'abonner — 5,90 EUR/mois'}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </ScrollView>
  );
}
