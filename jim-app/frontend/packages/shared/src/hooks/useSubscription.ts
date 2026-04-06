// Hook abonnement Pro — Epic 9, Story 9.6
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { AbonnementPro } from '../types/paiement';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

// Lire le statut de l'abonnement Pro
export function useSubscription(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.subscription.mine(),
    queryFn: async (): Promise<AbonnementPro | null> => {
      const { data, error } = await supabase
        .from('abonnements_pro')
        .select('*')
        .eq('profile_id', userId!)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as unknown as AbonnementPro | null;
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

// Souscrire a l'abonnement Pro
export function useCreateSubscription(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { payment_method_id: paymentMethodId },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.subscription.mine() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
    },
  });
}

// Annuler l'abonnement Pro
export function useCancelSubscription(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cancelAtPeriodEnd: boolean = true) => {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        method: 'DELETE',
        body: { cancel_at_period_end: cancelAtPeriodEnd },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.subscription.mine() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
    },
  });
}
