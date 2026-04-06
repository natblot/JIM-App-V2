// Hook mutation pour éditer les clauses optionnelles d'un contrat — Epic 8
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { ContratClause } from '../types/contrat';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface UpdateClausesInput {
  contratId: string;
  candidatureId: string;
  clauses: ContratClause[];
}

// Envoie les clauses optionnelles modifiées à l'Edge Function et invalide le cache
export function useUpdateClausesOptionnelles(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contratId, clauses }: UpdateClausesInput) => {
      const { data, error } = await supabase.functions.invoke('generate-contrat', {
        body: {
          action: 'update_clauses',
          contrat_id: contratId,
          clauses_optionnelles: clauses,
        },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, { candidatureId }) => {
      // Recharge le contrat mis à jour
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contrats.byCandidature(candidatureId),
      });
    },
  });
}
