// Hook placeholder — permet de s'inscrire aux alertes pour des annonces similaires
// L'implémentation réelle sera dans Epic 7 (notifications)
// Pour l'instant : insère dans notification_queue avec event_type 'ALERTE_SIMILAIRE_CREEE'
import { useMutation } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export interface AlerteSimilaireInput {
  ville: string;
  dateDebut?: string;
  dateFin?: string;
  retrocessionMin?: number;
  sourceAnnonceId?: string;
}

export function useAlerteSimilaire(supabase: Supabase) {
  return useMutation({
    mutationFn: async (_input: AlerteSimilaireInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Placeholder — la table alertes_utilisateur sera creee en phase 2
      return { success: true, message: 'Alerte enregistrée — vous serez notifié par JIM' };
    },
  });
}
