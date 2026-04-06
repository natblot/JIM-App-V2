'use client';

// Composant principal de la messagerie — fenetre contenue avec coins arrondis
// Layout : conversations | chat | contact panel (sans sidebar JIM)
import { useState, useEffect, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSupabase } from '../../lib/supabase-browser';
import { useConversations } from '@jim/shared/hooks/useConversations';
import { ConversationList } from './conversation-list';
import { ChatView } from './chat-view';
import { ContactPanel } from './contact-panel';
import { EmptyChat } from './empty-chat';

// QueryClient instancie une seule fois au niveau du module
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export function MessagesView() {
  return (
    <QueryClientProvider client={queryClient}>
      <MessagesViewInner />
    </QueryClientProvider>
  );
}

function MessagesViewInner() {
  const supabase = useMemo(() => getSupabase(), []);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showContactPanel, setShowContactPanel] = useState(true);

  // Recuperer l'utilisateur connecte
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, [supabase]);

  const { data: conversations, isLoading } = useConversations(supabase);

  // Selectionner la premiere conversation par defaut
  useEffect(() => {
    if (!selectedConversationId && conversations && conversations.length > 0) {
      setSelectedConversationId(conversations[0]!.id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation = useMemo(
    () => (conversations ?? []).find((c) => c.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
  }, []);

  const handleToggleContactPanel = useCallback(() => {
    setShowContactPanel((prev) => !prev);
  }, []);

  return (
    <div className="overflow-hidden flex rounded-3xl border border-jim-border bg-white shadow-jim-hover h-[calc(100vh-12rem)] max-h-[800px]">
      <ConversationList
        conversations={conversations ?? []}
        selectedId={selectedConversationId}
        onSelect={handleSelectConversation}
        isLoading={isLoading}
      />

      {selectedConversation && currentUserId ? (
        <ChatView
          supabase={supabase}
          conversation={selectedConversation}
          currentUserId={currentUserId}
          onToggleContactPanel={handleToggleContactPanel}
        />
      ) : (
        <EmptyChat />
      )}

      {showContactPanel && selectedConversation && (
        <ContactPanel
          conversation={selectedConversation}
          onClose={handleToggleContactPanel}
        />
      )}
    </div>
  );
}
