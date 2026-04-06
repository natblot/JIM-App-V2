// Hook mutation pour modifier ou fermer une annonce — Epic 2 Story 2.3
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { AnnonceUpdateData } from '../validators/annonce.schema';

type Supabase = SupabaseClient<Database>;

export interface UpdateAnnonceInput extends AnnonceUpdateData {
  id: string;
}

export function useUpdateAnnonce(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateAnnonceInput) => {
      const { data: result, error } = await supabase.functions.invoke(
        `update-annonce?id=${id}`,
        { body: data }
      );
      if (error) throw new Error(error.message);
      const annonce = (result as { data: unknown }).data ?? result;
      return annonce;
    },
    onSuccess: (_data, variables) => {
      // Invalider le détail de l'annonce modifiée + les listes
      void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.mine() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.lists() });
    },
  });
}
