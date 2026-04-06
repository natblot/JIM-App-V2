// Ecran "Mes paiements" — historique versements/receptions — Epic 9, Story 9.4
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PaymentStatusBadge } from '@jim/ui';
import { useMesPaiements, formatEuros, useAuthStore } from '@jim/shared';
import type { Paiement } from '@jim/shared';
import { supabase } from '../../_layout';

function PaiementItem({ paiement, isTitulaire, onPress }: { paiement: Paiement; isTitulaire: boolean; onPress: () => void }) {
  const montant = isTitulaire ? paiement.montant_retrocession_cents : paiement.montant_net_remplacant_cents;
  const date = new Date(paiement.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Pressable
      className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-3 min-h-[44px]"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Paiement ${formatEuros(montant)} du ${date}`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-jim-text">{formatEuros(montant)}</Text>
        <PaymentStatusBadge statut={paiement.status} size="sm" />
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-jim-muted text-xs">{date}</Text>
        <Text className="text-jim-muted text-xs">
          {isTitulaire ? 'Verse' : 'Recu'}
        </Text>
      </View>
    </Pressable>
  );
}

export default function MesPaiementsScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data, isLoading } = useMesPaiements(supabase, user?.id);

  const paiements = [...(data?.versements ?? []), ...(data?.receptions ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-jim-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (paiements.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-jim-background p-8">
        <Text className="text-jim-text text-lg font-semibold mb-2">Aucun paiement</Text>
        <Text className="text-jim-muted text-sm text-center">
          Les versements de retrocession apparaitront ici apres votre premier remplacement.
        </Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(400)} className="flex-1 bg-jim-background">
      <FlatList
        data={paiements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <PaiementItem
            paiement={item}
            isTitulaire={item.titulaire_id === user?.id}
            onPress={() => router.push(`/paiements/${item.contrat_id}`)}
          />
        )}
        ListHeaderComponent={
          <Text className="text-xl font-bold text-jim-text mb-4">Mes paiements</Text>
        }
      />
    </Animated.View>
  );
}
