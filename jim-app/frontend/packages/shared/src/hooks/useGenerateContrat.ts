// Hook mutation pour générer un contrat via Edge Function generate-contrat — Epic 8
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

// Résultat retourné par l'Edge Function lors de la génération
export interface GenerateContratResult {
  contrat_id: string;
}

// Lance la génération d'un contrat IA et invalide le cache après succès
export function useGenerateContrat(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidatureId: string): Promise<GenerateContratResult> => {
      const { data, error } = await supabase.functions.invoke('generate-contrat', {
        body: { candidature_id: candidatureId },
      });
      if (error) throw new Error(error.message);
      return data as GenerateContratResult;
    },
    onSuccess: (_, candidatureId) => {
      // Invalide le contrat de cette candidature pour recharger depuis Supabase
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contrats.byCandidature(candidatureId),
      });
    },
  });
}
