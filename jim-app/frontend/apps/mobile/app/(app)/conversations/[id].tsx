// Écran de chat — conversation individuelle — Epic 6
// FlashList inversé + ChatInput sticky + header avec nom et contexte annonce
import { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { supabase } from '../../_layout';
import { MessageBubble } from '../../../components/chat/message-bubble';
import { ChatInput } from '../../../components/chat/chat-input';
import { SystemMessage } from '../../../components/chat/system-message';
import { PhishingWarning } from '../../../components/chat/phishing-warning';
import { useMessages } from '../../../hooks/useMessages';
import { useSendMessage } from '../../../hooks/useSendMessage';
import { useMarkAsRead } from '../../../hooks/useMarkAsRead';

// Type message tel que renvoyé par useMessages
interface Message {
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

// Groupe les messages par jour pour insérer des séparateurs "Aujourd'hui", "Hier", etc.
function getDateLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDay.getTime() === startOfToday.getTime()) return "Aujourd'hui";
  if (msgDay.getTime() === startOfYesterday.getTime()) return 'Hier';

  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Type union pour les éléments de la FlashList (messages + séparateurs de date)
type ListItem =
  | { type: 'message'; message: Message }
  | { type: 'date-separator'; label: string; key: string };

// Construit la liste avec les séparateurs de date insérés, de récent (index 0) à ancien
function buildListItems(messages: Message[]): ListItem[] {
  // Tri décroissant pour la FlashList inversée (plus récent = index 0)
  const sorted = [...messages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const items: ListItem[] = [];
  let lastDateLabel = '';

  for (const message of sorted) {
    const label = getDateLabel(message.created_at);
    // Insérer le séparateur dès qu'on change de jour
    if (label !== lastDateLabel) {
      items.push({ type: 'date-separator', label, key: `sep-${label}` });
      lastDateLabel = label;
    }
    items.push({ type: 'message', message });
  }

  return items;
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    currentUserId,
    participantName,
    annonceContext,
  } = useMessages(supabase, id);

  const { mutate: sendMessage } = useSendMessage(supabase);
  const { markAsRead } = useMarkAsRead(supabase, id);

  // Marquer les messages comme lus dès que l'écran est focus
  useFocusEffect(
    useCallback(() => {
      markAsRead();
    }, [markAsRead])
  );

  // Aplatir les pages paginées en liste unique
  const messages: Message[] = messagesData?.pages?.flatMap((p) => p.messages) ?? [];
  const listItems = buildListItems(messages);

  // Dernier message reçu (non système) pour l'avertissement de lien dans la zone basse
  const lastNonSystemMessage = messages
    .filter((m) => !m.is_system_message)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  const showLinkWarning =
    lastNonSystemMessage?.contains_links === true &&
    lastNonSystemMessage.sender_id !== currentUserId &&
    !!lastNonSystemMessage.link_domain;

  const handleSend = (content: string) => {
    sendMessage({ conversationId: id, content });
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <View className="flex-1 bg-jim-background">
      {/* Header Stack.Screen — nom participant + contexte annonce */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <View className="items-center flex-1">
              <Text
                className="text-jim-text font-semibold text-base"
                numberOfLines={1}
              >
                {participantName ?? '…'}
              </Text>
              {annonceContext ? (
                <Text className="text-jim-muted text-xs" numberOfLines={1}>
                  {annonceContext}
                </Text>
              ) : null}
            </View>
          ),
          headerLeft: () => (
            <Pressable
              className="w-11 h-11 items-center justify-center active:opacity-70"
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Retour aux messages"
            >
              <Text className="text-jim-primary text-2xl">‹</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              className="min-h-[44px] min-w-[44px] items-center justify-center px-2 active:opacity-70"
              onPress={() => router.push(`/(app)/profil-contact/${id}` as never)}
              accessibilityRole="button"
              accessibilityLabel="Voir le profil du participant"
            >
              <Text className="text-jim-primary text-sm font-medium">Profil</Text>
            </Pressable>
          ),
          headerStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: false,
        }}
      />

      {/* Liste des messages — inversée (index 0 = plus récent en bas) */}
      <FlashList
        data={listItems}
        inverted
        keyExtractor={(item) =>
          item.type === 'message' ? item.message.id : item.key
        }
        estimatedItemSize={60}
        renderItem={({ item }) => {
          if (item.type === 'date-separator') {
            return (
              <SystemMessage
                content={item.label}
                createdAt={new Date().toISOString()}
              />
            );
          }

          const msg = item.message;
          const isSent = msg.sender_id === (currentUserId ?? '');

          return (
            <MessageBubble
              content={msg.content}
              isSent={isSent}
              isSystemMessage={msg.is_system_message}
              createdAt={msg.created_at}
              readAt={msg.read_at}
              containsLinks={msg.contains_links}
              domain={msg.link_domain}
              isLinkBlocked={msg.is_link_blocked}
              onReport={() => {
                // TODO: signaler via Edge Function — logic par frontend-developer
              }}
            />
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Avertissement lien si le dernier message reçu contient un lien */}
      {showLinkWarning && lastNonSystemMessage.link_domain && (
        <PhishingWarning
          domain={lastNonSystemMessage.link_domain}
          isBlocked={lastNonSystemMessage.is_link_blocked ?? false}
          onReport={() => {
            // TODO: signalement via Edge Function
          }}
        />
      )}

      {/* Zone de saisie sticky en bas */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </View>
  );
}
