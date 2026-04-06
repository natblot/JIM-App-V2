'use client';

import { Map } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Bouton carte flottant — dark style, navigue vers la page carte
export function FloatingMapButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/carte')}
      className="fixed bottom-24 right-8 z-50 bg-slate-800 text-white flex items-center gap-2 px-6 py-3.5 rounded-full shadow-2xl hover:bg-slate-900 transition transform hover:scale-105 active:scale-95"
    >
      <Map size={18} />
      <span className="font-bold text-sm hidden sm:inline">Carte</span>
    </button>
  );
}
