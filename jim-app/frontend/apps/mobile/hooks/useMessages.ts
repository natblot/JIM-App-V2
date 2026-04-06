// Hook useMessages — Epic 6, messagerie
// PLACEHOLDER — retourne des données mockées en attendant l'implémentation par frontend-developer
// L'interface finale sera : useMessages(supabase, conversationId) → { data, isLoading, fetchNextPage, hasNextPage, currentUserId, participantName, annonceContext }
import type { SupabaseClient } from '@jim/shared/adapters/supabase';

export interface MessageData {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
  is_system_message: boolean;
  contains_links?: boolean;
  link_domain?: string;
  is_link_blocked?: boolean;
}

interface MessagesPage {
  messages: MessageData[];
  nextCursor: string | null;
}

// Données mockées pour permettre le développement UI en parallèle
const MOCK_CURRENT_USER_ID = 'user-me';

function mockMessages(conversationId: string): MessageData[] {
  return [
    {
      id: `${conversationId}-msg-1`,
      content: "Bonjour, je suis disponible pour votre remplacement du 12 au 15 mars.",
      sender_id: 'user-other',
      created_at: new Date(Date.now() - 2 * 3_600_000).toISOString(),
      read_at: new Date(Date.now() - 1.5 * 3_600_000).toISOString(),
      is_system_message: false,
    },
    {
      id: `${conversationId}-msg-2`,
      content: "Merci pour votre candidature ! Pouvez-vous me décrire votre expérience en cabinet de groupe ?",
      sender_id: MOCK_CURRENT_USER_ID,
      created_at: new Date(Date.now() - 1.5 * 3_600_000).toISOString(),
      read_at: new Date(Date.now() - 1 * 3_600_000).toISOString(),
      is_system_message: false,
    },
    {
      id: `${conversationId}-msg-sys-1`,
      content: "Candidature acceptée — vous pouvez désormais échanger",
      sender_id: 'system',
      created_at: new Date(Date.now() - 3 * 3_600_000).toISOString(),
      read_at: null,
      is_system_message: true,
    },
    {
      id: `${conversationId}-msg-3`,
      content: "J'ai travaillé 3 ans en cabinet de groupe à Bordeaux. Très à l'aise avec les patients chroniques.",
      sender_id: 'user-other',
      created_at: new Date(Date.now() - 30 * 60_000).toISOString(),
      read_at: null,
      is_system_message: false,
    },
  ];
}

/**
 * Récupère les messages d'une conversation avec pagination.
 * 50 messages par page, chargement des pages précédentes via fetchNextPage.
 *
 * @param supabase - Client Supabase initialisé
 * @param conversationId - Identifiant de la conversation
 */
export function useMessages(_supabase: SupabaseClient, conversationId: string) {
  // TODO (frontend-developer): remplacer par useInfiniteQuery TanStack Query avec Supabase
  // Requête finale attendue :
  // SELECT m.id, m.content, m.sender_id, m.created_at, m.read_at, m.is_system_message,
  //        m.contains_links, m.link_domain, m.is_link_blocked
  // FROM messages m
  // WHERE m.conversation_id = conversationId
  // ORDER BY m.created_at DESC
  // LIMIT 50
  // OFFSET cursor
  //
  // Realtime : supabase.channel('conv-{id}').on('postgres_changes', ...).subscribe()
  // pour recevoir les nouveaux messages en temps réel

  const messages = mockMessages(conversationId);

  return {
    data: {
      pages: [{ messages, nextCursor: null } as MessagesPage],
    },
    isLoading: false,
    error: null,
    fetchNextPage: () => Promise.resolve(),
    hasNextPage: false,
    currentUserId: MOCK_CURRENT_USER_ID,
    participantName: 'Marie Dupont',
    annonceContext: 'Lille · 12-15 mars',
  };
}
