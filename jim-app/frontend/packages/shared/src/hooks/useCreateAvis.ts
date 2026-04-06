// Hook creation avis — Epic 11, Story 11.1
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import type { AvisTag } from '../validators/avis.schema';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface CreateAvisInput {
  contratId: string;
  note: number;
  tags: AvisTag[];
}

export function useCreateAvis(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAvisInput) => {
      const { data, error } = await supabase.functions.invoke('create-avis', {
        body: { contrat_id: input.contratId, note: input.note, tags: input.tags },
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
    },
  });
}
