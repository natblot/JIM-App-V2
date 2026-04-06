'use client';

// Vue principale du chat — header contact + messages + input
import { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Phone, MoreHorizontal } from 'lucide-react';
import type { SupabaseClient } from '@jim/shared/adapters/supabase/browser';
import type { Database } from '@jim/shared/types/database';
import { useMessages } from '@jim/shared/hooks/useMessages';
import { useSendMessage } from '@jim/shared/hooks/useSendMessage';
import { useMarkAsRead } from '@jim/shared/hooks/useMarkAsRead';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import type { ConversationWithParticipant } from '@jim/shared/hooks/useConversations';

type Supabase = SupabaseClient<Database>;

interface ChatViewProps {
  supabase: Supabase;
  conversation: ConversationWithParticipant;
  currentUserId: string;
  onToggleContactPanel: () => void;
}

export function ChatView({
  supabase,
  conversation,
  currentUserId,
  onToggleContactPanel,
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useMessages(supabase, conversation.id);
  const sendMessage = useSendMessage(supabase);
  const markAsRead = useMarkAsRead(supabase, conversation.id);

  // Marquer comme lu a l'ouverture et quand de nouveaux messages arrivent
  useEffect(() => {
    if (conversation.unread_count > 0) {
      markAsRead.mutate();
    }
  }, [conversation.id, conversation.unread_count]); // eslint-disable-line react-hooks/exhaustive-deps

  // Les messages arrivent en ordre decroissant (recents en premier) — on inverse pour l'affichage
  const sortedMessages = useMemo(
    () => [...(messages ?? [])].reverse(),
    [messages]
  );

  // Scroll en bas quand un nouveau message arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sortedMessages.length]);

  const handleSend = (content: string) => {
    sendMessage.mutate({
      conversation_id: conversation.id,
      content,
    });
  };

  // Determiner l'avatar de l'autre participant pour les bulles recues
  const otherAvatar = conversation.other_participant_avatar;
  const otherName = conversation.other_participant_name;

  return (
    <main className="flex-1 flex flex-col bg-jim-background relative min-w-0">
      {/* Header du chat */}
      <header className="h-20 bg-white border-b border-jim-border px-8 flex justify-between items-center z-10 flex-shrink-0">
        <button
          onClick={onToggleContactPanel}
          className="flex items-center gap-4 hover:opacity-80 transition-opacity"
        >
          {otherAvatar ? (
            <Image
              src={otherAvatar}
              alt={otherName ?? ''}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-jim-primary-pale flex items-center justify-center text-jim-primary font-bold">
              {(otherName ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="font-bold text-lg text-jim-text">
              {otherName ?? 'Praticien'}
            </h2>
            {conversation.annonce_title && (
              <p className="text-xs text-jim-muted">{conversation.annonce_title}</p>
            )}
          </div>
        </button>
        <div className="flex gap-2 items-center">
          <button className="p-2 rounded-full hover:bg-jim-primary-pale text-jim-primary transition-colors">
            <Phone size={20} />
          </button>
          <button
            onClick={onToggleContactPanel}
            className="p-2 rounded-full hover:bg-jim-primary-pale text-jim-muted hover:text-jim-primary transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Zone de messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-4 messaging-scroll"
      >
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? 'justify-end' : 'gap-3'} animate-pulse`}
              >
                {i % 2 !== 0 && <div className="w-8 h-8 rounded-full bg-jim-beige-light" />}
                <div
                  className={`h-12 rounded-3xl ${
                    i % 2 === 0 ? 'bg-jim-primary-pale w-1/3 rounded-tr-none' : 'bg-jim-beige-light w-2/5 rounded-tl-none'
                  }`}
                />
              </div>
            ))}
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-jim-muted text-sm">
            <p>Aucun message pour le moment.</p>
            <p className="text-xs mt-1">Envoyez le premier message !</p>
          </div>
        ) : (
          <>
            {/* Separateur de date */}
            <div className="flex justify-center">
              <span className="text-[10px] uppercase tracking-widest text-jim-muted font-semibold">
                Aujourd&apos;hui
              </span>
            </div>

            {sortedMessages.map((msg, index) => {
              const isOwn = msg.sender_id === currentUserId;
              // Afficher l'avatar seulement pour le premier message d'un groupe du meme expediteur
              const prevMsg = sortedMessages[index - 1];
              const showAvatar = !isOwn && (!prevMsg || prevMsg.sender_id !== msg.sender_id);

              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwnMessage={isOwn}
                  senderAvatar={otherAvatar}
                  senderName={otherName}
                  showAvatar={showAvatar}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Zone de saisie */}
      <MessageInput
        onSend={handleSend}
        isPending={sendMessage.isPending}
        disabled={false}
      />
    </main>
  );
}
