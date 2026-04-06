// Hook traitement candidature (accept/refuse) — titulaire — Epic 5, Story 5.6
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface ProcessCandidatureInput {
  candidature_id: string;
  annonce_id: string;
  action: 'accepter' | 'refuser';
  refuser_autres?: boolean;
}

export function useProcessCandidature(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProcessCandidatureInput) => {
      const { data, error } = await supabase.functions.invoke('process-candidature', {
        body: {
          candidature_id: input.candidature_id,
          action: input.action,
          refuser_autres: input.refuser_autres ?? true,
        },
      });
      if (error) throw new Error(error.message);
      return data;
    },

    onSettled: (_data, _err, input) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.candidatures.byAnnonce(input.annonce_id),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.annonces.detail(input.annonce_id),
      });
    },
  });
}
