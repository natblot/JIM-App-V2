// Hook useConversations — Epic 6, messagerie
// PLACEHOLDER — retourne des données mockées en attendant l'implémentation par frontend-developer
// L'interface finale sera : useConversations(supabase) → { data, isLoading, error }
import type { SupabaseClient } from '@jim/shared/adapters/supabase';

export interface ConversationSummary {
  id: string;
  participantName: string;
  annonceTitle: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  isRecentlyActive: boolean;
}

// Données mockées pour permettre le développement UI en parallèle
const MOCK_CONVERSATIONS: ConversationSummary[] = [
  {
    id: 'conv-1',
    participantName: 'Marie Dupont',
    annonceTitle: 'Remplacement Lille 12-15 mars',
    lastMessagePreview: "Bonjour, je suis disponible pour ce remplacement.",
    lastMessageAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    unreadCount: 2,
    isRecentlyActive: true,
  },
  {
    id: 'conv-2',
    participantName: 'Jean Martin',
    annonceTitle: 'Remplacement Paris 20-25 mars',
    lastMessagePreview: "Merci pour votre candidature, j'ai bien reçu votre message.",
    lastMessageAt: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    unreadCount: 0,
    isRecentlyActive: false,
  },
  {
    id: 'conv-3',
    participantName: 'Sophie Bernard',
    annonceTitle: 'Remplacement Lyon 1-5 avril',
    lastMessagePreview: "D'accord, je vous recontacte demain.",
    lastMessageAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    unreadCount: 0,
    isRecentlyActive: false,
  },
];

/**
 * Récupère la liste des conversations de l'utilisateur connecté.
 * Chaque conversation est triée par dernier message (plus récent en premier).
 *
 * @param supabase - Client Supabase initialisé
 */
export function useConversations(_supabase: SupabaseClient) {
  // TODO (frontend-developer): remplacer par useQuery TanStack Query avec Supabase
  // Requête finale attendue :
  // SELECT c.id,
  //        last_msg.content AS last_message_preview,
  //        last_msg.created_at AS last_message_at,
  //        profiles.full_name AS participant_name,
  //        annonces.title AS annonce_title,
  //        COUNT(m.id) FILTER (WHERE m.read_at IS NULL AND m.sender_id != auth.uid()) AS unread_count,
  //        profiles.last_seen_at
  // FROM conversations c
  // JOIN messages last_msg ON last_msg.id = (SELECT id FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1)
  // JOIN profiles ON profiles.user_id = CASE WHEN c.participant_1_id = auth.uid() THEN c.participant_2_id ELSE c.participant_1_id END
  // JOIN annonces ON annonces.id = c.annonce_id
  // LEFT JOIN messages m ON m.conversation_id = c.id
  // WHERE c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid()
  // GROUP BY c.id, last_msg.content, last_msg.created_at, profiles.full_name, annonces.title, profiles.last_seen_at
  // ORDER BY last_message_at DESC

  return {
    data: MOCK_CONVERSATIONS,
    isLoading: false,
    error: null,
  };
}
