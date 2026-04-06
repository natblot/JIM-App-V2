// Hooks propositions directes — Epic 11, Story 11.5
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export interface Proposition {
  id: string;
  titulaire_id: string;
  remplacant_id: string;
  date_debut: string;
  date_fin: string;
  retrocession: number;
  status: 'envoyee' | 'acceptee' | 'declinee' | 'expiree';
  created_at: string;
  responded_at: string | null;
}

// Creer une proposition directe
export function useCreateProposition(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { remplacantId: string; dateDebut: string; dateFin: string; retrocession: number }) => {
      const { data, error } = await supabase.functions.invoke('create-proposition', {
        body: { remplacant_id: input.remplacantId, date_debut: input.dateDebut, date_fin: input.dateFin, retrocession: input.retrocession },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['propositions'] });
    },
  });
}

// Repondre a une proposition
export function useRespondProposition(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { propositionId: string; response: 'acceptee' | 'declinee' }) => {
      const { data, error } = await supabase.functions.invoke('respond-proposition', {
        body: { proposition_id: input.propositionId, response: input.response },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['propositions'] });
    },
  });
}

// Lister mes propositions recues (remplacant)
export function useMesPropositions(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: ['propositions', 'received', userId],
    queryFn: async (): Promise<Proposition[]> => {
      const { data, error } = await supabase
        .from('propositions_directes')
        .select('*')
        .eq('remplacant_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Proposition[];
    },
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
