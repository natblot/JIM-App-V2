'use client';

// Zone de saisie de message — input + boutons action (piece jointe, micro, emoji)
import { useState, useCallback } from 'react';
import { Paperclip, Mic, Smile, Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  isPending: boolean;
  disabled: boolean;
}

export function MessageInput({ onSend, isPending, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed || isPending || disabled) return;
    onSend(trimmed);
    setContent('');
  }, [content, isPending, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const hasContent = content.trim().length > 0;

  return (
    <div className="p-6 bg-white border-t border-jim-border">
      <div className="relative flex items-center bg-jim-background rounded-3xl p-2 pr-4 shadow-jim transition-shadow focus-within:shadow-jim-hover">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-6 text-sm text-jim-text placeholder:text-jim-muted"
          placeholder="Ecrire un message..."
          maxLength={2000}
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-2 rounded-full text-jim-muted hover:bg-jim-primary-pale hover:text-jim-primary transition-colors"
            title="Joindre un fichier"
          >
            <Paperclip size={20} />
          </button>

          {hasContent ? (
            <button
              type="button"
              onClick={handleSend}
              disabled={isPending || disabled}
              className="p-2 bg-jim-primary text-white rounded-full hover:scale-105 transition-all shadow-sm disabled:opacity-50"
              title="Envoyer"
            >
              <Send size={20} />
            </button>
          ) : (
            <button
              type="button"
              className="p-2 bg-jim-primary text-white rounded-full hover:scale-105 transition-all shadow-sm"
              title="Message vocal"
            >
              <Mic size={20} />
            </button>
          )}

          <button
            type="button"
            className="p-2 rounded-full text-jim-muted hover:bg-jim-primary-pale hover:text-jim-primary transition-colors"
            title="Emoji"
          >
            <Smile size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
