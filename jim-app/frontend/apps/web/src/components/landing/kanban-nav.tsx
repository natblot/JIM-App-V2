'use client';

// KanbanNav — navigation produit qui precede le dashboard kanban.
// Positionnee sous le hero : categories pills + search rapide + Publier CTA.
// Remplace l'ancien header 3-lignes (evite la duplication "deux navbars").
import { useState, Suspense } from 'react';
import { SlidersHorizontal, ArrowUp, PlusCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CategoriesNav } from './categories-nav';
import { SearchOverlay } from './search-overlay';

export function KanbanNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeVille = searchParams.get('ville');

  return (
    <>
      <div className="sticky top-[88px] z-30 bg-jim-background/80 backdrop-blur-xl border-y border-jim-border/50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          {/* Categories — occupies remaining horizontal space sur desktop */}
          <div className="flex-1 min-w-0 lg:-ml-1">
            <Suspense>
              <CategoriesNav />
            </Suspense>
          </div>

          {/* Search pill + Publier CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Ouvrir la recherche"
              className="flex-1 lg:flex-initial lg:w-[320px] bg-white rounded-full shadow-sm border border-jim-border/70 flex items-center gap-3 px-4 h-11 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-jim-primary/30"
            >
              <SlidersHorizontal size={16} className="text-jim-muted flex-shrink-0" />
              <span className="flex-grow text-left text-[13px] text-jim-muted truncate">
                {activeVille ?? 'Rechercher une mission, une ville...'}
              </span>
              <span className="bg-jim-primary text-white w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                <ArrowUp size={14} />
              </span>
            </button>
            <a
              href="/publier"
              className="hidden md:flex bg-jim-text text-white h-11 px-5 rounded-full text-[13px] font-bold items-center gap-1.5 hover:bg-jim-primary transition-colors shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/40"
            >
              <PlusCircle size={15} />
              Publier
            </a>
          </div>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
