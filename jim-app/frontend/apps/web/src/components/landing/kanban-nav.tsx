'use client';

// Subnav sticky — catégories + recherche/publier révélées quand "docked"
import { useState, useRef, useEffect, Suspense } from 'react';
import { Search, Plus } from 'lucide-react';
import { CategoriesNav } from './categories-nav';
import { SearchOverlay } from './search-overlay';

export function KanbanNav() {
  const [stuck, setStuck] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const subnavRef = useRef<HTMLDivElement>(null);

  // Détecte quand le subnav est arrivé à sa position sticky (top 80px)
  useEffect(() => {
    const handleScroll = () => {
      if (!subnavRef.current) return;
      setStuck(subnavRef.current.getBoundingClientRect().top <= 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        ref={subnavRef}
        className={`sticky top-[80px] z-30 bg-jim-background transition-all duration-[250ms] ${
          stuck ? 'border-b border-[rgba(58,31,8,.06)] shadow-[0_4px_20px_rgba(58,31,8,.04)]' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center gap-4 px-4 md:px-10 py-3.5">
          {/* Categories — centre */}
          <nav className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center justify-center gap-1">
            <Suspense>
              <CategoriesNav />
            </Suspense>
          </nav>

          {/* Recherche + Publier — révélés quand stuck */}
          <div
            className={`flex items-center gap-2 flex-shrink-0 overflow-hidden transition-all duration-[300ms] ${
              stuck ? 'opacity-100 max-w-[500px] pointer-events-auto' : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            {/* Search pill */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Ouvrir la recherche"
              className="flex items-center gap-2.5 bg-white border border-jim-beige-mid rounded-full px-3.5 py-1.5 min-w-[200px] sm:min-w-[280px] hover:shadow-sm hover:border-jim-primary/30 transition-all"
            >
              <Search size={14} className="text-jim-muted flex-shrink-0" />
              <span className="flex-1 text-left text-[13px] text-jim-muted truncate">Rechercher une mission, une ville...</span>
              <span className="w-[30px] h-[30px] rounded-full bg-jim-primary flex items-center justify-center text-white flex-shrink-0">
                <Search size={12} strokeWidth={2.5} />
              </span>
            </button>

            {/* Publier */}
            <button
              type="button"
              onClick={() => window.location.href = '/publier'}
              className="inline-flex items-center gap-1.5 bg-jim-text text-white rounded-full px-5 py-3 text-[13px] font-semibold whitespace-nowrap hover:bg-jim-text/90 transition-colors flex-shrink-0 sm:flex"
            >
              <Plus size={15} strokeWidth={2} />
              <span className="hidden sm:block">Publier</span>
            </button>
          </div>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
