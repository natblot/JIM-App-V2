// Hook liste des conversations avec Realtime — Epic 6, Story 6.1
// Met à jour la liste en temps réel sur INSERT et UPDATE (dernier message, unread_count)
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { ConversationRow } from '../validators/message.schema';

type Supabase = SupabaseClient<Database>;

// ConversationRow enrichi avec les données du profil de l'autre participant
export interface ConversationWithParticipant extends ConversationRow {
  other_participant_name: string | null;
  other_participant_avatar: string | null;
  annonce_title: string | null;
  unread_count: number;
}

// Fetch toutes les conversations de l'utilisateur connecté, triées par dernière activité
async function fetchConversations(
  supabase: Supabase
): Promise<ConversationWithParticipant[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Utilisateur non authentifié');

  const userId = user.id;

  // Sélectionner les conversations + données des profils des deux participants
  // Le JOIN sur profiles est fait via deux colonnes FK vers auth.users
  const { data, error } = await supabase
    .from('conversations')
    .select(
      `
      *,
      participant1:profiles!conversations_participant_1_id_fkey(user_id, display_name, avatar_url),
      participant2:profiles!conversations_participant_2_id_fkey(user_id, display_name, avatar_url),
      annonces(titre)
      `
    )
    .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Compter les messages non lus par conversation
  const { data: unreadData } = await supabase
    .from('messages')
    .select('conversation_id')
    .neq('sender_id', userId)
    .is('read_at', null);

  // Regrouper les unread par conversation
  const unreadMap: Record<string, number> = {};
  for (const row of unreadData ?? []) {
    unreadMap[row.conversation_id] = (unreadMap[row.conversation_id] ?? 0) + 1;
  }

  // Enrichir chaque conversation avec le profil de l'autre participant
  return (data ?? []).map((conv) => {
    const p1 = conv.participant1 as unknown as { user_id: string; display_name: string | null; avatar_url: string | null } | null;
    const p2 = conv.participant2 as unknown as { user_id: string; display_name: string | null; avatar_url: string | null } | null;
    const annonce = conv.annonces as unknown as { titre: string | null } | null;

    // L'autre participant est celui qui n'est pas l'utilisateur connecté
    const other = p1?.user_id === userId ? p2 : p1;

    return {
      id: conv.id,
      participant_1_id: conv.participant_1_id,
      participant_2_id: conv.participant_2_id,
      annonce_id: conv.annonce_id,
      candidature_id: conv.candidature_id,
      created_at: conv.created_at,
      last_message_at: conv.last_message_at,
      last_message_preview: conv.last_message_preview,
      other_participant_name: other?.display_name ?? null,
      other_participant_avatar: other?.avatar_url ?? null,
      annonce_title: annonce?.titre ?? null,
      unread_count: unreadMap[conv.id] ?? 0,
    };
  }) as unknown as ConversationWithParticipant[];
}

export function useConversations(supabase: Supabase) {
  const queryClient = useQueryClient();

  // Realtime — écoute les INSERT et UPDATE sur les conversations de l'utilisateur
  useEffect(() => {
    let userId: string | null = null;

    // Récupérer l'userId pour construire le channel filtré
    void supabase.auth.getUser().then(({ data }) => {
      userId = data.user?.id ?? null;
      if (!userId) return;

      const channel = supabase
        .channel(`conversations-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'conversations',
            // Deux filtres possibles (participant_1 ou participant_2)
            // Supabase ne supporte pas OR dans filter → on invalide sur tout INSERT
          },
          () => {
            void queryClient.invalidateQueries({
              queryKey: queryKeys.conversations.mine(),
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
          },
          (payload) => {
            // Mise à jour chirurgicale du cache si la conversation appartient à l'utilisateur
            const updated = payload.new as ConversationRow;
            const isParticipant =
              updated.participant_1_id === userId ||
              updated.participant_2_id === userId;

            if (isParticipant) {
              queryClient.setQueryData(
                queryKeys.conversations.mine(),
                (old: ConversationWithParticipant[] | undefined) => {
                  if (!old) return old;
                  return old
                    .map((c) =>
                      c.id === updated.id
                        ? {
                            ...c,
                            last_message_at: updated.last_message_at,
                            last_message_preview: updated.last_message_preview,
                          }
                        : c
                    )
                    // Re-trier par dernière activité
                    .sort(
                      (a, b) =>
                        new Date(b.last_message_at).getTime() -
                        new Date(a.last_message_at).getTime()
                    );
                }
              );
            }
          }
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    });
  }, [supabase, queryClient]);

  return useQuery({
    queryKey: queryKeys.conversations.mine(),
    queryFn: () => fetchConversations(supabase),
    staleTime: 30_000,
  });
}
