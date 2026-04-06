// Hook envoi de message avec optimistic update < 200ms (NFR2) — Epic 6, Story 6.2
// Offline : enqueue dans le store si pas de réseau
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import { useOfflineStore } from '../stores/offline.store';
import type { MessageRow } from '../validators/message.schema';

type Supabase = SupabaseClient<Database>;

export interface SendMessageInput {
  conversation_id: string;
  content: string;
}

// MessageRow enrichi avec le flag local d'optimistic update
interface OptimisticMessage extends MessageRow {
  _pending: true;
}

export function useSendMessage(supabase: Supabase) {
  const queryClient = useQueryClient();
  const { isOnline, enqueueAction } = useOfflineStore();

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      // Mode offline — on enqueue et on laisse l'optimistic update visible
      if (!isOnline) {
        const idempotencyKey = `send-msg-${input.conversation_id}-${Date.now()}`;
        enqueueAction({
          type: 'SEND_MESSAGE',
          payload: { conversation_id: input.conversation_id, content: input.content },
          idempotencyKey,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        // Retourner null pour que onError ne soit pas déclenché — l'optimistic reste
        return null;
      }

      // Mode online — INSERT direct pour latence < 200ms (pas d'Edge Function)
      const session = (await supabase.auth.getSession()).data.session;
      const senderId = session?.user.id;
      if (!senderId) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: input.conversation_id,
          content: input.content,
          sender_id: senderId,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as unknown as MessageRow;
    },

    // Optimistic update AVANT la réponse serveur — l'UI s'affiche en < 200ms
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages.byConversation(input.conversation_id),
      });

      const previousMessages = queryClient.getQueryData<MessageRow[]>(
        queryKeys.messages.byConversation(input.conversation_id)
      );

      // Récupérer l'userId courant depuis la session Supabase (synchrone via getSession)
      const session = (await supabase.auth.getSession()).data.session;
      const senderId = session?.user.id ?? 'unknown';

      const optimisticMessage: OptimisticMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: input.conversation_id,
        sender_id: senderId,
        content: input.content,
        read_at: null,
        created_at: new Date().toISOString(),
        contains_links: false,
        flagged_phishing: false,
        is_system_message: false,
        _pending: true,
      };

      // Ajouter en tête (messages récents en premier — affichage inversé)
      queryClient.setQueryData(
        queryKeys.messages.byConversation(input.conversation_id),
        (old: MessageRow[] | undefined) => [optimisticMessage, ...(old ?? [])]
      );

      return { previousMessages };
    },

    // Rollback si erreur serveur (pas déclenché en mode offline)
    onError: (_err, input, context) => {
      if (context?.previousMessages !== undefined) {
        queryClient.setQueryData(
          queryKeys.messages.byConversation(input.conversation_id),
          context.previousMessages
        );
      }
    },

    // Re-sync avec le serveur dans tous les cas
    onSettled: (_data, _err, input) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.byConversation(input.conversation_id),
      });
      // Invalider la liste des conversations pour rafraîchir last_message_preview
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.mine(),
      });
    },
  });
}
