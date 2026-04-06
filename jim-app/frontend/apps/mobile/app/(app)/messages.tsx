// Écran liste des conversations — Epic 6, Story 6.x
// FlashList des conversations actives avec badge total non-lus
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ConversationListItem, AnnonceSkeleton, UnreadBadge } from '@jim/ui';
import { supabase } from '../_layout';
import { useConversations } from '../../hooks/useConversations';

// Type local correspondant aux données renvoyées par useConversations
interface ConversationItem {
  id: string;
  participantName: string;
  annonceTitle: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  isRecentlyActive: boolean;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { data: conversations, isLoading } = useConversations(supabase);

  // Calcul du total de messages non lus pour le badge en-tête
  const totalUnread = (conversations ?? []).reduce(
    (acc, c) => acc + c.unreadCount,
    0
  );

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <View className="flex-row items-center gap-3">
          <Text className="text-2xl font-bold text-jim-text">Messages</Text>
          {totalUnread > 0 && <UnreadBadge count={totalUnread} size="md" />}
        </View>
      </View>

      {/* Contenu principal */}
      {isLoading ? (
        // Squelettes de chargement — réutilise AnnonceSkeleton pour la cohérence
        <View className="px-4 pt-4">
          <AnnonceSkeleton count={3} />
        </View>
      ) : (
        <FlashList
          data={conversations ?? []}
          keyExtractor={(item: ConversationItem) => item.id}
          estimatedItemSize={76}
          renderItem={({ item }: { item: ConversationItem }) => (
            <ConversationListItem
              participantName={item.participantName}
              annonceTitle={item.annonceTitle}
              lastMessagePreview={item.lastMessagePreview}
              lastMessageAt={item.lastMessageAt}
              unreadCount={item.unreadCount}
              isRecentlyActive={item.isRecentlyActive}
              onPress={() => router.push(`/(app)/conversations/${item.id}` as never)}
            />
          )}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-jim-border mx-4" />
          )}
          ListEmptyComponent={<EmptyConversations />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// Empty state bienveillant — aucune conversation pour l'instant
function EmptyConversations() {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16 gap-4">
      <Text className="text-5xl" aria-hidden>💬</Text>
      <Text className="text-jim-text font-bold text-xl text-center">
        Aucune conversation pour l'instant
      </Text>
      <Text className="text-jim-muted text-base text-center leading-6">
        Vos échanges apparaîtront ici après acceptation d'une candidature
      </Text>
    </View>
  );
}
