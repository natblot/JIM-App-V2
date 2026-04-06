// Hook compteur de messages non lus — Epic 6, Story 6.1
// Dérivé depuis useConversations pour éviter une requête supplémentaire
// Utilisé pour le badge de l'onglet Messagerie
import { useMemo } from 'react';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { useConversations } from './useConversations';

type Supabase = SupabaseClient<Database>;

export interface UseUnreadCountResult {
  // Nombre total de messages non lus toutes conversations confondues
  totalUnread: number;
  // true si au moins un message non lu existe (pour le badge point)
  hasUnread: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function useUnreadCount(supabase: Supabase): UseUnreadCountResult {
  // Réutilise le cache de useConversations — zéro requête supplémentaire
  const { data: conversations, isLoading, isError } = useConversations(supabase);

  const totalUnread = useMemo(
    () => (conversations ?? []).reduce((sum, conv) => sum + (conv.unread_count ?? 0), 0),
    [conversations]
  );

  return {
    totalUnread,
    hasUnread: totalUnread > 0,
    isLoading,
    isError,
  };
}
