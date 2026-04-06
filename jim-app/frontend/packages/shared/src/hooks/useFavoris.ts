// Hook favoris titulaire — Epic 5, Story 5.9
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface FavoriRow {
  id: string;
  titulaire_id: string;
  remplacant_id: string;
  note: string | null;
  created_at: string;
}

export function useFavoris(supabase: Supabase) {
  return useQuery({
    queryKey: queryKeys.favoris.mine(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favoris')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as FavoriRow[];
    },
    staleTime: 60_000,
  });
}

export function useAddFavori(supabase: Supabase) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ remplacantId, note }: { remplacantId: string; note?: string }) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('favoris')
        .insert({ remplacant_id: remplacantId, titulaire_id: user.id, note: note ?? null })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as FavoriRow;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.favoris.mine() });
    },
  });
}

export function useRemoveFavori(supabase: Supabase) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (favoriId: string) => {
      const { error } = await supabase.from('favoris').delete().eq('id', favoriId);
      if (error) throw new Error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.favoris.mine() });
    },
  });
}
