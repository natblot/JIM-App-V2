'use client';

// Etat vide — aucune conversation selectionnee
import { MessageCircle } from 'lucide-react';

export function EmptyChat() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-jim-background text-jim-muted">
      <div className="w-20 h-20 rounded-full bg-jim-primary-pale flex items-center justify-center mb-6">
        <MessageCircle size={36} className="text-jim-primary" />
      </div>
      <h2 className="text-xl font-bold text-jim-text mb-2">Vos messages</h2>
      <p className="text-sm max-w-xs text-center leading-relaxed">
        Selectionnez une conversation pour commencer a discuter avec un praticien.
      </p>
    </main>
  );
}
