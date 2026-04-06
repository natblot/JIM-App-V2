// Hooks TanStack Query pour les annonces — Epic 2
// Pattern lecture directe Supabase (pas via Edge Function)
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { AnnonceRow } from '../validators/annonce.schema';

type Supabase = SupabaseClient<Database>;

// ─── Lecture : mes annonces (titulaire) ───────────────────────────────────────

export function useMyAnnonces(supabase: Supabase) {
  return useQuery({
    queryKey: queryKeys.annonces.mine(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return (data ?? []) as AnnonceRow[];
    },
    staleTime: 30_000,
  });
}

// ─── Lecture : détail d'une annonce ─────────────────────────────────────────

export function useAnnonce(supabase: Supabase, id: string) {
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

// ─── Lecture : annonces publiques (remplaçant) ────────────────────────────────

export function useAnnoncesPubliques(
  supabase: Supabase,
  filters?: { ville?: string; retrocessionMin?: number }
) {
  return useQuery({
    queryKey: queryKeys.annonces.list(filters as Record<string, unknown>),
    queryFn: async () => {
      let query = supabase
        .from('annonces')
        .select('*')
        .in('statut', ['active', 'en_cours', 'non_confirmee'])
        .order('is_urgent', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.ville) {
        query = query.ilike('ville', `%${filters.ville}%`);
      }
      if (filters?.retrocessionMin !== undefined) {
        query = query.gte('retrocession', filters.retrocessionMin);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      const result = data ?? [];
      // Trier : natives d'abord, puis agrégées, puis par date décroissante
      return result.sort((a, b) => {
        const aNative = a.source === 'native' ? 0 : 1;
        const bNative = b.source === 'native' ? 0 : 1;
        if (aNative !== bNative) return aNative - bNative;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }) as AnnonceRow[];
    },
    staleTime: 60_000,
  });
}

// ─── Lecture : rétrocession moyenne dans une zone (FR12) ──────────────────────

export function useRetrocessionMoyenne(
  supabase: Supabase,
  lat: number | null,
  lon: number | null,
  radiusKm = 30
) {
  return useQuery({
    queryKey: queryKeys.annonces.retrocessionMoyenne(lat ?? 0, lon ?? 0, radiusKm),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_retrocession_moyenne_zone', {
        lat: lat!,
        lon: lon!,
        radius_km: radiusKm,
      });
      if (error) return null;
      return data as number | null;
    },
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60_000, // 5 minutes
  });
}
