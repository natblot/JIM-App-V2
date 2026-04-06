// Hook recherche géospatiale — Epic 4
// Appelle la fonction RPC search_annonces_geo via Supabase
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface GeoSearchFilters {
  lat: number;
  lng: number;
  radiusKm: number;
  dateDebut?: string;
  dateFin?: string;
  retrocessionMin?: number;
  limit?: number;
  offset?: number;
}

export interface GeoAnnonce {
  id: string;
  type_annonce: string;
  date_debut: string;
  date_fin: string;
  retrocession: number;
  ville: string;
  code_postal: string | null;
  statut: string;
  is_urgent: boolean;
  source: string;
  source_url: string | null;
  specialites: string[];
  type_cabinet: string | null;
  description: string | null;
  profile_id: string | null;
  created_at: string;
  distance_meters: number;
}

export function useSearchAnnonces(supabase: Supabase, filters: GeoSearchFilters) {
  return useQuery({
    queryKey: queryKeys.search.geo(filters as unknown as Record<string, unknown>),
    queryFn: async () => {
      const params: Record<string, unknown> = {
        p_lat: filters.lat,
        p_lng: filters.lng,
        p_radius_meters: Math.round(filters.radiusKm * 1000),
        p_limit: filters.limit ?? 50,
        p_offset: filters.offset ?? 0,
      };
      if (filters.dateDebut) params.p_date_debut = filters.dateDebut;
      if (filters.dateFin) params.p_date_fin = filters.dateFin;
      if (filters.retrocessionMin != null) params.p_retrocession_min = filters.retrocessionMin;

      const { data, error } = await supabase.rpc(
        'search_annonces_geo',
        params as unknown as Database['public']['Functions']['search_annonces_geo']['Args'],
      );
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as GeoAnnonce[];
    },
    enabled: filters.lat !== 0 && filters.lng !== 0,
    staleTime: 30_000,
  });
}
