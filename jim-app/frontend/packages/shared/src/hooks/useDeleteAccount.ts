// Hook suppression de compte RGPD — Epic 10, Story 10.2
import { useMutation, useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

interface DeletionStatus {
  id: string;
  status: 'pending' | 'cancelled' | 'executed';
  scheduled_at: string;
  requested_at: string;
}

// Verifier si une suppression est en cours
export function useDeletionStatus(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: ['account-deletion', userId],
    queryFn: async (): Promise<DeletionStatus | null> => {
      const { data, error } = await supabase
        .from('account_deletions')
        .select('id, status, scheduled_at, requested_at')
        .eq('user_id', userId!)
        .eq('status', 'pending')
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as DeletionStatus | null;
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

// Demander la suppression
export function useDeleteAccount(supabase: Supabase) {
  return useMutation({
    mutationFn: async (confirmation: string) => {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { confirmation },
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

// Annuler la suppression via token
export function useCancelDeletion(supabase: Supabase) {
  return useMutation({
    mutationFn: async (cancelToken: string) => {
      const { data, error } = await supabase.functions.invoke('cancel-deletion', {
        body: { cancel_token: cancelToken },
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
}
