'use client';

// Bulle de message — envoyee (droite, orange) ou recue (gauche, blanche)
import Image from 'next/image';
import type { MessageWithPending } from '@jim/shared/hooks/useMessages';

interface MessageBubbleProps {
  message: MessageWithPending;
  isOwnMessage: boolean;
  senderAvatar: string | null;
  senderName: string | null;
  showAvatar: boolean;
}

function formatMessageTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessageBubble({
  message,
  isOwnMessage,
  senderAvatar,
  senderName,
  showAvatar,
}: MessageBubbleProps) {
  // Message systeme (ex: "Remplacement confirme !")
  if (message.is_system_message) {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-jim-primary-pale text-jim-text-body text-xs px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  if (isOwnMessage) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div
          className={`bg-jim-primary text-white p-4 px-6 rounded-3xl rounded-tr-none max-w-[70%] chat-bubble-shadow active-bubble-shadow ${
            message._pending ? 'opacity-70' : ''
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2">
          <span className="text-[10px] text-jim-muted">
            {formatMessageTime(message.created_at)}
          </span>
          {message._pending ? (
            <span className="text-[10px] text-jim-muted">Envoi...</span>
          ) : message.read_at ? (
            <span className="text-[10px] text-jim-primary">Lu</span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-end">
      {/* Avatar de l'expediteur */}
      <div className="w-8 flex-shrink-0">
        {showAvatar && (
          senderAvatar ? (
            <Image
              src={senderAvatar}
              alt={senderName ?? ''}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-jim-primary-pale flex items-center justify-center text-jim-primary text-xs font-bold">
              {(senderName ?? '?').charAt(0).toUpperCase()}
            </div>
          )
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="bg-white p-4 px-6 rounded-3xl rounded-tl-none max-w-[70%] chat-bubble-shadow">
          <p className="text-sm leading-relaxed text-jim-text">{message.content}</p>
        </div>
        <span className="text-[10px] text-jim-muted px-2">
          {formatMessageTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}
