// Hook liste candidatures du remplaçant + Realtime — Epic 5, Story 5.3
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { CandidatureRow } from '../validators/candidature.schema';

type Supabase = SupabaseClient<Database>;

export function useMesCandidatures(supabase: Supabase, userId: string | null) {
  const queryClient = useQueryClient();

  // Realtime — statut mis à jour quand le titulaire agit
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('candidatures-mine')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'candidatures',
          filter: `remplacant_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.setQueryData(
            queryKeys.candidatures.mine(),
            (old: CandidatureRow[] | undefined) =>
              (old ?? []).map((c) =>
                c.id === payload.new.id ? (payload.new as CandidatureRow) : c
              )
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, supabase, queryClient]);

  return useQuery({
    queryKey: queryKeys.candidatures.mine(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select('*, annonces(ville, date_debut, date_fin, retrocession, statut, is_urgent, source)')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as (CandidatureRow & { annonces: Record<string, unknown> })[];
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}
