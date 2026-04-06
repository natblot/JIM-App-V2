'use client';

// Liste des conversations avec recherche — panneau gauche de la messagerie
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { SquarePen, Search } from 'lucide-react';
import type { ConversationWithParticipant } from '@jim/shared/hooks/useConversations';

interface ConversationListProps {
  conversations: ConversationWithParticipant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

// Temps relatif en francais
function formatRelativeTime(isoDate: string | null): string {
  if (!isoDate) return '';
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "a l'instant";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hier';
  if (days < 7) return `${days}j`;
  return new Date(isoDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// Initiales depuis le nom
function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading,
}: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.other_participant_name?.toLowerCase().includes(q) ||
        c.last_message_preview?.toLowerCase().includes(q) ||
        c.annonce_title?.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  return (
    <section className="w-80 bg-white border-r border-jim-border flex flex-col flex-shrink-0 rounded-l-3xl">
      {/* En-tete */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-jim-text">Messages</h1>
          <button
            className="p-2 rounded-full hover:bg-jim-primary-pale text-jim-muted hover:text-jim-primary transition-colors"
            title="Nouveau message"
          >
            <SquarePen size={20} />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-jim-muted transition-colors group-focus-within:text-jim-primary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-jim-background border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-jim-primary-soft focus:bg-white transition-all placeholder:text-jim-muted"
            placeholder="Rechercher dans les messages..."
          />
        </div>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 messaging-scroll">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-jim-beige-light" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-jim-beige-light rounded w-3/4" />
                    <div className="h-2 bg-jim-beige-light rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-jim-muted text-sm">
            {search ? 'Aucun resultat' : 'Aucune conversation'}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((conv) => {
              const isSelected = conv.id === selectedId;
              const hasUnread = conv.unread_count > 0;
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`w-full text-left p-4 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-jim-primary-pale active-bubble-shadow'
                      : 'hover:bg-jim-background border border-transparent hover:border-jim-border'
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.other_participant_avatar ? (
                        <Image
                          src={conv.other_participant_avatar}
                          alt={conv.other_participant_name ?? ''}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-jim-primary-pale flex items-center justify-center text-jim-primary font-bold text-sm">
                          {getInitials(conv.other_participant_name)}
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3
                          className={`text-sm truncate ${
                            hasUnread ? 'font-bold text-jim-text' : 'font-semibold text-jim-text'
                          }`}
                        >
                          {conv.other_participant_name ?? 'Praticien'}
                        </h3>
                        <span className="text-[10px] text-jim-muted flex-shrink-0 ml-2">
                          {formatRelativeTime(conv.last_message_at)}
                        </span>
                      </div>
                      {conv.annonce_title && (
                        <p className="text-[10px] text-jim-muted truncate mb-0.5">
                          {conv.annonce_title}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs truncate leading-relaxed ${
                            hasUnread ? 'font-medium text-jim-text-body' : 'text-jim-muted'
                          }`}
                        >
                          {conv.last_message_preview ?? 'Nouvelle conversation'}
                        </p>
                        {hasUnread && (
                          <div className="ml-2 flex-shrink-0 bg-jim-primary w-5 h-5 rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">
                              {conv.unread_count > 9 ? '9+' : conv.unread_count}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
