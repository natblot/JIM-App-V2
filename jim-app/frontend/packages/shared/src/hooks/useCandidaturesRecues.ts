// Hook candidatures reçues par le titulaire + Realtime — Epic 5, Story 5.5
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { CandidatureRow } from '../validators/candidature.schema';

type Supabase = SupabaseClient<Database>;

export function useCandidaturesRecues(supabase: Supabase, annonceId: string) {
  const queryClient = useQueryClient();

  // Realtime — nouvelles candidatures en temps réel pour le titulaire
  useEffect(() => {
    if (!annonceId) return;

    const channel = supabase
      .channel(`candidatures-annonce:${annonceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'candidatures',
          filter: `annonce_id=eq.${annonceId}`,
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.candidatures.byAnnonce(annonceId),
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [annonceId, supabase, queryClient]);

  return useQuery({
    queryKey: queryKeys.candidatures.byAnnonce(annonceId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          *,
          profiles!candidatures_remplacant_id_profiles_fkey(
            first_name, last_name, rpps_number, rpps_verified,
            specialites, zone_km, photo_url
          )
        `)
        .eq('annonce_id', annonceId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as CandidatureRow[];
    },
    enabled: !!annonceId,
    staleTime: 15_000,
  });
}
