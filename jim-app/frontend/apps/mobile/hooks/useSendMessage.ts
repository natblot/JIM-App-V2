// Hook useSendMessage — Epic 6, messagerie
// PLACEHOLDER — implémentation optimiste mockée en attendant le frontend-developer
// L'interface finale sera : useSendMessage(supabase) → { mutate, isPending }
import type { SupabaseClient } from '@jim/shared/adapters/supabase';

interface SendMessageParams {
  conversationId: string;
  content: string;
}

/**
 * Envoie un message dans une conversation.
 * Implémentation optimiste : le message s'affiche immédiatement, le statut passe à 'sent' après confirmation.
 *
 * @param supabase - Client Supabase initialisé
 */
export function useSendMessage(_supabase: SupabaseClient) {
  // TODO (frontend-developer): remplacer par useMutation TanStack Query avec Supabase
  // Logique finale attendue :
  // 1. Optimistic update — ajouter le message localement avec isPending: true
  // 2. Appel Edge Function POST /messages (validation Zod, détection liens)
  // 3. En cas d'erreur : rollback + toast d'erreur
  // 4. En cas de succès : mise à jour du message avec l'id serveur, readAt = null, isPending = false
  //
  // Anti-phishing : l'Edge Function extrait les domaines et les compare à une liste noire
  // avant de persister le message

  return {
    mutate: ({ conversationId, content }: SendMessageParams) => {
      // Placeholder — log uniquement pour le développement
      console.log('[useSendMessage] send', { conversationId, content });
    },
    isPending: false,
    error: null,
  };
}
