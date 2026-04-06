// Hook retrait candidature — remplaçant — Epic 5, Story 5.8
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export function useWithdrawCandidature(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidatureId: string) => {
      const { data, error } = await supabase.functions.invoke('withdraw-candidature', {
        body: { candidature_id: candidatureId },
      });
      if (error) throw new Error(error.message);
      return data;
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.candidatures.mine() });
    },
  });
}
