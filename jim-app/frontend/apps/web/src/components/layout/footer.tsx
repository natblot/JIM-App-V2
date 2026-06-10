'use client';

import { Globe, ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Footer legal :
// - Sur la landing ("/") : fixed bottom glass morphism (pattern dashboard kanban)
// - Ailleurs : static dans le flux, pour ne pas manger 50px de viewport sur les pages a scroll naturel
export function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  // Glass morphism beige chaud
  const base = 'bg-jim-surface/80 backdrop-blur-md border-t border-jim-border px-8 py-4 text-[11px] text-jim-muted';
  // Landing : fixed bottom en dashboard mode uniquement lg+ (laisse place a la
  // CTA sticky mobile + evite chevauchement). Les autres pages restent statiques.
  const variant = isLanding
    ? 'relative mt-16 lg:mt-0 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-40'
    : 'relative mt-16';

  return (
    <footer className={`${base} ${variant}`}>
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Liens gauche */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center">
          <span>&copy; 2026 JIM Inc.</span>
          <span className="hidden md:inline">&bull;</span>
          <a href="/cgu" className="font-medium hover:text-jim-text-body transition-colors">CGU</a>
          <span className="hidden md:inline">&bull;</span>
          <a href="/sitemap.xml" className="font-medium hover:text-jim-text-body transition-colors">Plan du site</a>
          <span className="hidden md:inline">&bull;</span>
          <a href="/confidentialite" className="font-medium hover:text-jim-text-body transition-colors">Confidentialite</a>
        </div>

        {/* Settings droite */}
        <div className="flex items-center gap-6">
          <button type="button" className="flex items-center gap-2 font-medium text-jim-muted hover:text-jim-text-body transition-colors">
            <Globe size={12} /> Francais
          </button>
          <button type="button" className="flex items-center gap-1 font-medium text-jim-muted hover:text-jim-text-body transition-colors">
            Aide <ChevronUp size={10} className="ml-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
