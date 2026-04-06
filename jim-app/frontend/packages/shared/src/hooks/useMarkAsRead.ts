// Hook marquer les messages comme lus — Epic 6, Story 6.3
// À appeler au focus de l'écran et au scroll vers le bas
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { MessageRow } from '../validators/message.schema';

type Supabase = SupabaseClient<Database>;

export function useMarkAsRead(supabase: Supabase, conversationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!conversationId) return;

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Utilisateur non authentifié');

      // Marquer tous les messages non lus de l'autre participant comme lus
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null);

      if (error) throw new Error(error.message);
    },

    // Optimistic update — mettre read_at immédiatement dans le cache local
    onMutate: async () => {
      if (!conversationId) return;

      await queryClient.cancelQueries({
        queryKey: queryKeys.messages.byConversation(conversationId),
      });

      const previousMessages = queryClient.getQueryData<MessageRow[]>(
        queryKeys.messages.byConversation(conversationId)
      );

      const session = (await supabase.auth.getSession()).data.session;
      const userId = session?.user.id;

      // Mettre read_at sur tous les messages non lus de l'autre participant
      queryClient.setQueryData(
        queryKeys.messages.byConversation(conversationId),
        (old: MessageRow[] | undefined) =>
          (old ?? []).map((m) =>
            m.sender_id !== userId && m.read_at === null
              ? { ...m, read_at: new Date().toISOString() }
              : m
          )
      );

      return { previousMessages };
    },

    onError: (_err, _vars, context) => {
      // Rollback si l'update échoue
      if (context?.previousMessages !== undefined && conversationId) {
        queryClient.setQueryData(
          queryKeys.messages.byConversation(conversationId),
          context.previousMessages
        );
      }
    },

    onSettled: () => {
      // Invalider la liste des conversations pour mettre à jour le unread_count affiché
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.mine(),
      });
      if (conversationId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages.byConversation(conversationId),
        });
      }
    },
  });
}
