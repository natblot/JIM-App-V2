// Hook onboarding Stripe Connect — Epic 9, Stories 9.1 + 9.2
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { StripeOnboardingStatus } from '../types/paiement';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

interface OnboardingResult {
  onboarding_url?: string;
  account_id?: string;
  status?: string;
  charges_enabled?: boolean;
}

interface OnboardingStatus {
  stripeAccountId: string | null;
  onboardingStatus: StripeOnboardingStatus;
  rcpVerified: boolean;
}

// Lire le statut d'onboarding du profil courant
export function useStripeOnboardingStatus(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.profiles.detail(userId ?? ''), 'stripe-status'],
    queryFn: async (): Promise<OnboardingStatus> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('stripe_account_id, stripe_onboarding_status, rcp_verified')
        .eq('user_id', userId!)
        .single();
      if (error) throw new Error(error.message);
      return {
        stripeAccountId: data.stripe_account_id,
        onboardingStatus: data.stripe_onboarding_status as StripeOnboardingStatus,
        rcpVerified: data.rcp_verified,
      };
    },
    enabled: Boolean(userId),
    staleTime: 10_000,
  });
}

// Lancer l'onboarding Stripe Connect
export function useStripeOnboarding(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { refreshUrl: string; returnUrl: string }): Promise<OnboardingResult> => {
      const { data, error } = await supabase.functions.invoke('stripe-onboarding', {
        body: { refresh_url: params.refreshUrl, return_url: params.returnUrl },
      });
      if (error) throw new Error(error.message);
      return data as OnboardingResult;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
    },
  });
}
