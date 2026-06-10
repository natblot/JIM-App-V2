'use client';

import { Map } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Bouton carte flottant — dark warm brown, navigue vers la page carte.
// Visible uniquement en lg+ : sur mobile/tablette la CTA sticky "Publier"
// occupe deja l'espace bottom-right et la kanban scroll verticale ne
// laisse pas de creneau lisible pour un FAB secondaire.
export function FloatingMapButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/carte')}
      aria-label="Voir les missions sur la carte"
      className="hidden lg:flex fixed bottom-24 right-8 z-50 bg-jim-text text-jim-background items-center gap-2 px-6 py-3.5 rounded-full shadow-[0_12px_32px_-12px_rgba(58,31,8,0.45)] hover:opacity-95 transition transform hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/40"
    >
      <Map size={18} />
      <span className="font-bold text-sm">Carte</span>
    </button>
  );
}
