'use client';

import { ExternalLink } from 'lucide-react';
import { PostulerButton } from './postuler-button';

// Barre CTA flottante mobile/tablette — pattern marketplace detail (Airbnb/Booking).
// Disparait en >= lg (le sticky aside desktop prend le relais).
// Affiche prix a gauche + bouton Postuler compact a droite.
interface MobileCtaBarProps {
  annonceId: string;
  prixJour: number;
  retro: number;
  isNative: boolean;
  sourceUrl: string | null;
}

export function MobileCtaBar({ annonceId, prixJour, retro, isNative, sourceUrl }: MobileCtaBarProps) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-[0_-4px_16px_rgba(58,31,8,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3 max-w-[600px] mx-auto">
        <div className="flex-shrink-0">
          <p className="text-lg font-bold text-neutral-900 leading-tight">
            {prixJour}€<span className="text-xs font-normal text-neutral-500">/jour</span>
          </p>
          <p className="text-[11px] text-neutral-500">Retrocession {retro}%</p>
        </div>
        <div className="flex-1 min-w-0">
          {isNative ? (
            <PostulerButton annonceId={annonceId} />
          ) : sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors"
            >
              Voir sur la source <ExternalLink size={14} />
            </a>
          ) : (
            <span className="block text-xs text-neutral-500 text-center py-3">
              Source partenaire indisponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
