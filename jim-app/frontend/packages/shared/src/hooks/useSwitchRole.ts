// Hook changement de role — Epic 11, Story 11.4
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

type Role = 'remplacant' | 'titulaire';

export function useSwitchRole(supabase: Supabase, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRole: Role) => {
      if (!userId) throw new Error('Non authentifie');

      // Verifier qu'il n'y a pas de remplacement en cours
      // (contrat confirme avec date_fin dans le futur)
      const { data: contrats } = await supabase
        .from('contrats')
        .select('id, donnees')
        .or(`titulaire_id.eq.${userId},remplacant_id.eq.${userId}`)
        .eq('statut', 'confirme');

      const now = new Date().toISOString().split('T')[0]!;
      const activeReplacement = (contrats ?? []).some((c) => {
        const donnees = c.donnees as Record<string, unknown> | null;
        const dates = donnees?.dates as { fin?: string } | undefined;
        return dates?.fin && dates.fin >= now;
      });

      if (activeReplacement) {
        throw new Error('REMPLACEMENT_EN_COURS');
      }

      // Mettre a jour le role
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return newRole;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.profiles.my() });
    },
  });
}
