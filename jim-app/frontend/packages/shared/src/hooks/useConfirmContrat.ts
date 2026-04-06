// Hook mutation pour confirmer un contrat (titulaire ou remplaçant) — Epic 8
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface ConfirmContratInput {
  contratId: string;
  candidatureId: string;
}

// Confirme le contrat côté utilisateur connecté (action identifiée via JWT Supabase)
// L'Edge Function détermine si c'est le titulaire ou le remplaçant qui confirme
export function useConfirmContrat(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contratId }: ConfirmContratInput) => {
      const { data, error } = await supabase.functions.invoke('generate-contrat', {
        body: { action: 'confirm', contrat_id: contratId },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, { candidatureId }) => {
      // Rafraîchit le contrat et la liste des annonces (statut peut changer)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contrats.byCandidature(candidatureId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.annonces.all,
      });
    },
  });
}
