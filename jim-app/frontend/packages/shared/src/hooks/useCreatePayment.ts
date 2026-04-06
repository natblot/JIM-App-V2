// Hook creation paiement — Epic 9, Story 9.3
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { SourceMontant } from '../types/paiement';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface CreatePaymentInput {
  contratId: string;
  montantEncaisseCents: number;
  sourceMontant?: SourceMontant;
}

export interface CreatePaymentResult {
  id: string;
  montant_retrocession_cents: number;
  montant_net_remplacant_cents: number;
  commission_jim_cents: number;
  commission_type: string;
  status: string;
}

export function useCreatePayment(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePaymentInput): Promise<CreatePaymentResult> => {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          contrat_id: input.contratId,
          montant_encaisse_cents: input.montantEncaisseCents,
          source_montant: input.sourceMontant ?? 'saisie_manuelle',
        },
      });
      if (error) throw new Error(error.message);
      return data as CreatePaymentResult;
    },
    onSuccess: (_, input) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.paiements.mine() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.paiements.byContrat(input.contratId) });
    },
  });
}
