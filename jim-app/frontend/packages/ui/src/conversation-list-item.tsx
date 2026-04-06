// Item de liste de conversation — Epic 6, messagerie
// Avatar initiales + nom + aperçu message + timestamp + badge non-lu
import { View, Text, Pressable } from 'react-native';
import { UnreadBadge } from './unread-badge';

export interface ConversationListItemProps {
  participantName: string;
  annonceTitle: string;           // ex: "Remplacement Lille 12-15 mars"
  lastMessagePreview: string;
  lastMessageAt: string;          // ISO timestamp
  unreadCount: number;
  isRecentlyActive: boolean;      // vu dans les 24h
  onPress: () => void;
}

// Extrait les 2 premières initiales du nom complet
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

// Formate le timestamp de façon relative et lisible
function formatFreshness(isoTimestamp: string): string {
  const now = new Date();
  const date = new Date(isoTimestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffD = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `${diffMin} min`;
  if (diffH < 24) return `${diffH} h`;
  if (diffD === 1) return 'Hier';
  if (diffD < 7) return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function ConversationListItem({
  participantName,
  annonceTitle,
  lastMessagePreview,
  lastMessageAt,
  unreadCount,
  isRecentlyActive,
  onPress,
}: ConversationListItemProps) {
  const initials = getInitials(participantName);
  const hasUnread = unreadCount > 0;

  return (
    <Pressable
      className="flex-row items-center gap-3 px-4 py-3 bg-jim-surface active:bg-jim-background"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Conversation avec ${participantName} — ${annonceTitle}${hasUnread ? ` — ${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}` : ''}`}
    >
      {/* Avatar avec badge de présence */}
      <View className="relative">
        <View className="w-12 h-12 rounded-full bg-jim-primary/20 items-center justify-center">
          <Text className="text-jim-primary font-bold text-base">{initials}</Text>
        </View>

        {/* Point vert de présence récente */}
        {isRecentlyActive && (
          <View
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-jim-success border-2 border-jim-surface"
            accessibilityLabel="Actif récemment"
          />
        )}
      </View>

      {/* Contenu central */}
      <View className="flex-1 gap-0.5">
        {/* Nom + timestamp */}
        <View className="flex-row items-center justify-between">
          <Text
            className="text-jim-text font-semibold text-base flex-1 mr-2"
            numberOfLines={1}
          >
            {participantName}
          </Text>
          <Text className="text-jim-muted text-xs shrink-0">
            {formatFreshness(lastMessageAt)}
          </Text>
        </View>

        {/* Titre de l'annonce */}
        <Text className="text-jim-muted text-xs" numberOfLines={1}>
          {annonceTitle}
        </Text>

        {/* Aperçu du dernier message + badge non-lu */}
        <View className="flex-row items-center justify-between mt-0.5">
          <Text
            className={[
              'text-sm flex-1 mr-2',
              hasUnread ? 'text-jim-text font-medium' : 'text-jim-muted',
            ].join(' ')}
            numberOfLines={1}
          >
            {lastMessagePreview}
          </Text>

          {hasUnread && <UnreadBadge count={unreadCount} size="sm" />}
        </View>
      </View>
    </Pressable>
  );
}
