// Hook mutation optimiste — candidature en < 200ms (NFR2) — Epic 5, Story 5.1
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { CandidatureRow } from '../validators/candidature.schema';

type Supabase = SupabaseClient<Database>;

export interface CreateCandidatureInput {
  annonce_id: string;
  message?: string;
  warnings?: Array<{ type: string; detail: string }>;
}

export function useCreateCandidature(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCandidatureInput) => {
      const { data, error } = await supabase.functions.invoke('create-candidature', {
        body: input,
      });
      if (error) throw new Error(error.message);
      return data as CandidatureRow;
    },

    // Optimistic update AVANT la réponse serveur — l'UI s'affiche en < 200ms
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.candidatures.mine() });
      const previous = queryClient.getQueryData(queryKeys.candidatures.mine());

      queryClient.setQueryData(
        queryKeys.candidatures.mine(),
        (old: CandidatureRow[] | undefined) => [
          {
            id: `temp-${Date.now()}`,
            annonce_id: input.annonce_id,
            remplacant_id: 'current-user',
            message: input.message ?? null,
            statut: 'en_attente' as const,
            warnings: input.warnings ?? [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            viewed_at: null,
            responded_at: null,
          },
          ...(old ?? []),
        ]
      );

      return { previous };
    },

    // Rollback si erreur serveur
    onError: (_err, _input, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.candidatures.mine(), context.previous);
      }
    },

    // Re-sync avec le serveur dans tous les cas
    onSettled: (_data, _err, input) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.candidatures.mine() });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.annonces.detail(input.annonce_id),
      });
    },
  });
}
