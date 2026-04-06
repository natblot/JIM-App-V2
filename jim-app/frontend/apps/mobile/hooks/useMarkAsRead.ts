// Hook useMarkAsRead — Epic 6, messagerie
// PLACEHOLDER — marque les messages comme lus à l'ouverture de l'écran
// L'interface finale sera : useMarkAsRead(supabase, conversationId) → { markAsRead }
import { useCallback } from 'react';
import type { SupabaseClient } from '@jim/shared/adapters/supabase';

/**
 * Marque tous les messages non lus d'une conversation comme lus.
 * À appeler via useFocusEffect dans l'écran de chat.
 *
 * @param supabase - Client Supabase initialisé
 * @param conversationId - Identifiant de la conversation
 */
export function useMarkAsRead(_supabase: SupabaseClient, _conversationId: string) {
  // TODO (frontend-developer): remplacer par l'appel Supabase réel :
  // UPDATE messages
  // SET read_at = NOW()
  // WHERE conversation_id = conversationId
  //   AND sender_id != auth.uid()
  //   AND read_at IS NULL
  //
  // Puis invalidate queryKey ['conversations'] pour mettre à jour le badge non-lu

  const markAsRead = useCallback(() => {
    // Placeholder — log uniquement
    console.log('[useMarkAsRead] marking as read for conversation', _conversationId);
  }, [_conversationId]);

  return { markAsRead };
}
