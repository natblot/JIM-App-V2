// Hook lecture paiement avec Realtime — Epic 9, Story 9.4
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { Paiement } from '../types/paiement';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

// Recuperer un paiement par ID avec souscription Realtime
export function usePaiement(supabase: Supabase, paiementId: string | undefined) {
  const queryClient = useQueryClient();

  // Souscription Realtime pour le statut en temps reel
  useEffect(() => {
    if (!paiementId) return;

    const channel = supabase
      .channel(`paiement-${paiementId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'paiements', filter: `id=eq.${paiementId}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.paiements.detail(paiementId) });
        },
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [supabase, paiementId, queryClient]);

  return useQuery({
    queryKey: queryKeys.paiements.detail(paiementId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paiements')
        .select('*')
        .eq('id', paiementId!)
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Paiement;
    },
    enabled: Boolean(paiementId),
    staleTime: 5_000,
  });
}

// Recuperer le paiement d'un contrat (au plus un)
export function usePaiementByContrat(supabase: Supabase, contratId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.paiements.byContrat(contratId ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paiements')
        .select('*')
        .eq('contrat_id', contratId!)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as unknown as Paiement | null;
    },
    enabled: Boolean(contratId),
    staleTime: 10_000,
  });
}
