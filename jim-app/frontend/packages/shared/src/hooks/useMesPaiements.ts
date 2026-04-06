// Hook liste paiements de l'utilisateur — Epic 9, Story 9.4
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { Paiement } from '../types/paiement';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface MesPaiementsResult {
  versements: Paiement[];  // Paiements ou le user est titulaire (payeur)
  receptions: Paiement[];  // Paiements ou le user est remplacant (beneficiaire)
}

export function useMesPaiements(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.paiements.mine(),
    queryFn: async (): Promise<MesPaiementsResult> => {
      // RLS filtre automatiquement : l'utilisateur ne voit que ses propres paiements
      const { data, error } = await supabase
        .from('paiements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      const paiements = (data ?? []) as unknown as Paiement[];
      return {
        versements: paiements.filter((p) => p.titulaire_id === userId),
        receptions: paiements.filter((p) => p.remplacant_id === userId),
      };
    },
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
