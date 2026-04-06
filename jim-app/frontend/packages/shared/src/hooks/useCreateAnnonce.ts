// Hook mutation pour créer une annonce — Epic 2 Story 2.1
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { AnnonceFormData } from '../validators/annonce.schema';

type Supabase = SupabaseClient<Database>;

export interface CreateAnnonceResult {
  id: string;
  ville: string;
  statut: string;
  retrocession_moyenne_zone: number | null;
}

export function useCreateAnnonce(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AnnonceFormData): Promise<CreateAnnonceResult> => {
      const { data: result, error } = await supabase.functions.invoke<CreateAnnonceResult>(
        'create-annonce',
        { body: data }
      );
      if (error) throw new Error(error.message);
      if (!result) throw new Error('Réponse vide du serveur');
      // L'API retourne { data: result } — extraire si nécessaire
      const annonce = (result as unknown as { data: CreateAnnonceResult }).data ?? result;
      return annonce;
    },
    onSuccess: () => {
      // Invalider les listes pour forcer un refetch
      void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.mine() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.lists() });
    },
  });
}
