// Hook lecture contrat par candidature_id — Epic 8
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { Contrat } from '../types/contrat';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

// Récupère le contrat associé à une candidature (au plus un)
export function useContrat(supabase: Supabase, candidatureId: string) {
  return useQuery({
    queryKey: queryKeys.contrats.byCandidature(candidatureId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contrats')
        .select('*')
        .eq('candidature_id', candidatureId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Contrat | null;
    },
    enabled: Boolean(candidatureId),
    staleTime: 15_000,
  });
}
