// Hook lecture avis d'un profil — Epic 11, Story 11.2
// Gere l'anonymat 7 jours cote client
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export interface AvisRow {
  id: string;
  auteur_id: string;
  note: number;
  tags: string[];
  anonyme_until: string;
  created_at: string;
  // Jointes
  auteur_first_name?: string;
  auteur_last_name?: string;
}

export interface AvisDisplay {
  id: string;
  note: number;
  tags: string[];
  date: string;
  auteurName: string; // "Un kinesitherapeute verifie" si anonyme
  isAnonymous: boolean;
}

export function useAvisProfile(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: ['avis', 'profile', userId],
    queryFn: async (): Promise<AvisDisplay[]> => {
      const { data, error } = await supabase
        .from('avis')
        .select('id, auteur_id, note, tags, anonyme_until, created_at')
        .eq('destinataire_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      const now = new Date();
      return (data ?? []).map((a: AvisRow) => {
        const isAnonymous = new Date(a.anonyme_until) > now;
        return {
          id: a.id,
          note: a.note,
          tags: a.tags ?? [],
          date: a.created_at,
          auteurName: isAnonymous ? 'Un kinesitherapeute verifie' : '',
          isAnonymous,
        };
      });
    },
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
