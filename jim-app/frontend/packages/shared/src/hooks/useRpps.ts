import { useMutation } from '@tanstack/react-query';
import type { RppsVerifyFormData, RppsSearchFormData } from '../validators/rpps.schema';

// Résultat d'un professionnel trouvé dans l'Annuaire Santé
export interface RppsSearchResultItem {
  rpps_number: string;
  first_name: string;
  last_name: string;
  city: string | null;
  profession_label: string;
}

// Clés de query RPPS (pour invalidation future)
export const rppsKeys = {
  all: ['rpps'] as const,
};

import type { SupabaseClient as BaseSupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type SupabaseClient = BaseSupabaseClient<Database>;

// Erreur enrichie avec code métier pour distinguer les cas RPPS_API_DOWN / RPPS_NOT_FOUND
class RppsError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'RppsError';
  }
}

// Hook: vérification d'un numéro RPPS via Edge Function
// Appelle la fonction `rpps-verify` qui interroge l'Annuaire Santé
export function useRppsVerify(supabase: SupabaseClient) {
  return useMutation({
    mutationFn: async (data: RppsVerifyFormData) => {
      const { data: result, error } = await supabase.functions.invoke('verify-rpps', {
        body: { rpps_number: data.rppsNumber },
      });

      if (error) {
        // Vérifier si l'Annuaire Santé est indisponible (mode dégradé NFR30)
        const message = error.message ?? '';
        if (message.includes('RPPS_API_DOWN') || message.includes('503') || message.includes('unavailable')) {
          throw new RppsError(
            "L'Annuaire Santé est temporairement indisponible. Votre profil sera vérifié dès le retour du service.",
            'RPPS_API_DOWN',
          );
        }
        if (message.includes('RPPS_NOT_FOUND') || message.includes('not found')) {
          throw new RppsError(
            "Ce numéro RPPS n'a pas été trouvé dans l'Annuaire Santé. Il peut prendre quelques jours à apparaître si vous venez d'être diplômé.",
            'RPPS_NOT_FOUND',
          );
        }
        throw new RppsError(
          "Une erreur est survenue lors de la vérification. Réessayez.",
          'RPPS_ERROR',
        );
      }

      return result as { status: 'verified' | 'pending'; profession_label?: string };
    },
  });
}

// Hook: recherche d'un professionnel dans l'Annuaire Santé par nom/prénom/ville
// Utilisé pour aider Michel (52 ans) à retrouver son numéro RPPS
export function useRppsSearch(supabase: SupabaseClient) {
  return useMutation({
    mutationFn: async (data: RppsSearchFormData): Promise<RppsSearchResultItem[]> => {
      const { data: result, error } = await supabase.functions.invoke('search-rpps', {
        body: {
          last_name: data.lastName,
          first_name: data.firstName,
          city: data.city ?? null,
        },
      });

      if (error) {
        throw new Error("La recherche a échoué. Vérifiez votre connexion et réessayez.");
      }

      return (result as { results: RppsSearchResultItem[] }).results ?? [];
    },
  });
}
