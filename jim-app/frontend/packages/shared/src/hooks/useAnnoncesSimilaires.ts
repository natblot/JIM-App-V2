// Hook annonces similaires (pour le cul-de-sac "Pourvue") — Epic 4
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

interface SimilaireResult {
  id: string;
  type_annonce: string;
  date_debut: string;
  date_fin: string;
  retrocession: number;
  ville: string;
  statut: string;
  is_urgent: boolean;
  source: string;
  distance_meters: number;
}

export function useAnnoncesSimilaires(supabase: Supabase, annonceId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.similaires.detail(annonceId),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('annonces_similaires', {
        p_annonce_id: annonceId,
        p_limit: 3,
      });
      if (error) throw new Error(error.message);
      return (data ?? []) as SimilaireResult[];
    },
    enabled: !!annonceId && enabled,
    staleTime: 60_000,
  });
}
