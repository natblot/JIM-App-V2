// Hook Supabase Realtime pour les statuts annonces — Epic 2 Story 2.5
// Propagation des changements de statut < 2 secondes (NFR9)
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { AnnonceRow } from '../validators/annonce.schema';

type Supabase = SupabaseClient<Database>;

// Souscrit aux changements temps réel sur la table annonces
// À appeler dans le layout racine (app/_layout.tsx) pour une écoute globale
export function useAnnonceRealtime(supabase: Supabase) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('annonces-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'annonces',
        },
        (payload) => {
          const updated = payload.new as AnnonceRow;
          // Mettre à jour le cache du détail
          queryClient.setQueryData(queryKeys.annonces.detail(updated.id), updated);
          // Invalider les listes pour rafraîchir
          void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.lists() });
          void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.mine() });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'annonces',
        },
        () => {
          // Nouvelle annonce — invalider toutes les listes
          void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.lists() });
          void queryClient.invalidateQueries({ queryKey: queryKeys.annonces.mine() });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);
}
