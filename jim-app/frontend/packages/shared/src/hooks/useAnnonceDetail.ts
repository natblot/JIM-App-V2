// Hook détail annonce avec Realtime — Epic 4
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { AnnonceRow } from '../validators/annonce.schema';

type Supabase = SupabaseClient<Database>;

export function useAnnonceDetail(supabase: Supabase, id: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`annonce-detail:${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'annonces', filter: `id=eq.${id}` },
        (payload) => {
          queryClient.setQueryData(queryKeys.annonces.detail(id), payload.new);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [id, supabase, queryClient]);

  return useQuery({
    queryKey: queryKeys.annonces.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data as AnnonceRow;
    },
    enabled: !!id,
    staleTime: 10_000,
  });
}
