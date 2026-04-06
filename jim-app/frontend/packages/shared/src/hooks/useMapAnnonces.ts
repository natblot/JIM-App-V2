// Hook annonces pour la carte (bounding box) — Epic 4
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface BBox {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  statut: string;
  is_urgent: boolean;
  source: string;
  ville: string;
  date_debut: string;
  retrocession: number;
}

export function useMapAnnonces(supabase: Supabase, bbox: BBox | null) {
  return useQuery({
    queryKey: queryKeys.search.bbox(bbox as unknown as Record<string, number>),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('search_annonces_bbox', {
        p_sw_lat: bbox!.swLat,
        p_sw_lng: bbox!.swLng,
        p_ne_lat: bbox!.neLat,
        p_ne_lng: bbox!.neLng,
        p_limit: 200,
      });
      if (error) throw new Error(error.message);
      return (data ?? []) as MapMarker[];
    },
    enabled: bbox !== null,
    staleTime: 30_000,
  });
}
