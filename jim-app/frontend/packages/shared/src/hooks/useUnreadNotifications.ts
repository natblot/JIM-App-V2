// Hook compteur notifications non lues — Epic 7, Story 7.x
// Interroge notification_queue WHERE recipient_id = auth.uid() AND status = 'pending'
// Polling toutes les 30s — pas de Realtime sur notification_queue (coût trop élevé)
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface UseUnreadNotificationsResult {
  // Nombre de notifications en attente destinées à l'utilisateur courant
  count: number;
  // true si au moins une notification est en attente
  hasUnread: boolean;
  isLoading: boolean;
  isError: boolean;
}

const POLLING_INTERVAL_MS = 30_000; // 30 secondes — pas de Realtime sur notification_queue

export function useUnreadNotifications(supabase: Supabase): UseUnreadNotificationsResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.notifications.unread(),
    queryFn: async (): Promise<number> => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError ?? !user) return 0;

      // COUNT via head: true — évite de rapatrier les rows, retourne juste le count
      const { count, error } = await supabase
        .from('notification_queue')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('status', 'pending');

      if (error) throw new Error(error.message);

      return count ?? 0;
    },
    // Polling toutes les 30s — Realtime non activé sur notification_queue
    refetchInterval: POLLING_INTERVAL_MS,
    // Ne pas refécher en arrière-plan si l'onglet/app est inactif
    refetchIntervalInBackground: false,
    staleTime: POLLING_INTERVAL_MS,
  });

  const count = data ?? 0;

  return {
    count,
    hasUnread: count > 0,
    isLoading,
    isError,
  };
}
