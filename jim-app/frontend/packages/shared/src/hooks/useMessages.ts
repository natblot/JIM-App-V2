// Hook messages d'une conversation avec Realtime + pagination — Epic 6, Story 6.2
// INSERT → append au cache, UPDATE (read_at) → mise à jour chirurgicale
import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { MessageRow } from '../validators/message.schema';

type Supabase = SupabaseClient<Database>;

// MessageRow enrichi avec le flag local d'optimistic update
export interface MessageWithPending extends MessageRow {
  _pending?: boolean;
}

const PAGE_SIZE = 50;

// Fetch une page de messages (les plus récents en premier pour l'affichage inversé)
async function fetchMessages(
  supabase: Supabase,
  conversationId: string,
  cursor?: string
): Promise<MessageWithPending[]> {
  let query = supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  // Pagination par curseur — charger les messages plus anciens
  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as MessageWithPending[];
}

export function useMessages(supabase: Supabase, conversationId: string | null) {
  const queryClient = useQueryClient();

  // Realtime — écoute INSERT (nouveau message) et UPDATE (read_at)
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageWithPending;
          queryClient.setQueryData(
            queryKeys.messages.byConversation(conversationId),
            (old: MessageWithPending[] | undefined) => {
              if (!old) return [newMsg];
              // Éviter les doublons (optimistic déjà présent avec temp-id)
              const withoutTemp = old.filter(
                (m) => !m._pending || m.conversation_id !== newMsg.conversation_id
              );
              // Les messages récents sont en tête (affichage inversé)
              return [newMsg, ...withoutTemp];
            }
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Mise à jour chirurgicale du read_at dans le cache
          const updated = payload.new as MessageRow;
          queryClient.setQueryData(
            queryKeys.messages.byConversation(conversationId),
            (old: MessageWithPending[] | undefined) =>
              (old ?? []).map((m) =>
                m.id === updated.id ? { ...m, read_at: updated.read_at } : m
              )
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, supabase, queryClient]);

  // Query principale — 50 derniers messages
  const query = useQuery({
    queryKey: queryKeys.messages.byConversation(conversationId ?? ''),
    queryFn: () => fetchMessages(supabase, conversationId!),
    enabled: !!conversationId,
    staleTime: 10_000,
  });

  // Charger les messages plus anciens (pagination)
  const loadMore = useCallback(async () => {
    if (!conversationId || query.isFetching) return;

    const current = queryClient.getQueryData<MessageWithPending[]>(
      queryKeys.messages.byConversation(conversationId)
    );
    // Le curseur est le created_at du message le plus ancien (en bas de la liste inversée)
    const oldest = current?.[current.length - 1];
    if (!oldest) return;

    const older = await fetchMessages(supabase, conversationId, oldest.created_at);
    if (older.length === 0) return;

    queryClient.setQueryData(
      queryKeys.messages.byConversation(conversationId),
      (old: MessageWithPending[] | undefined) => [...(old ?? []), ...older]
    );
  }, [conversationId, supabase, queryClient, query.isFetching]);

  return { ...query, loadMore, pageSize: PAGE_SIZE };
}
