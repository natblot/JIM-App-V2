// Hook signalement — Epic 12, Story 12.2
import { useMutation } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export interface CreateSignalementInput {
  contenuType: 'profile' | 'annonce' | 'message' | 'avis';
  contenuId: string;
  categorie: string;
  description?: string;
}

export function useCreateSignalement(supabase: Supabase) {
  return useMutation({
    mutationFn: async (input: CreateSignalementInput) => {
      const { data, error } = await supabase.functions.invoke('create-signalement', {
        body: { contenu_type: input.contenuType, contenu_id: input.contenuId, categorie: input.categorie, description: input.description },
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
}
