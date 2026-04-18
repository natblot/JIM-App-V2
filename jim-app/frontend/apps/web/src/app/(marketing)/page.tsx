import { Suspense } from 'react';
import { HeroSection } from '../../components/landing/hero-section';
import { HomeGrid } from '../../components/landing/home-grid';
import { KanbanNav } from '../../components/landing/kanban-nav';
import { SidebarPreferences } from '../../components/landing/sidebar-preferences';
import { FloatingMapButton } from '../../components/landing/floating-map-button';
import { fetchActiveAnnonces } from '../../lib/supabase-server';

// ISR : revalider toutes les heures
export const revalidate = 3600;

// Landing hybride :
// 1. Header minimal flottant (logo + auth) — composant <Header/> dans layout
// 2. HeroSection editorial (chaleur, identite, CTA principal)
// 3. KanbanNav sticky (categories + search + Publier) — navigation du dashboard
// 4. Kanban dashboard (produit en action)
//
// Responsive :
// - lg+ : hero full width + kanban dashboard h-full avec sidebar preferences
// - <lg : stack vertical naturel, CTA sticky bottom mobile
export default async function Home() {
  const { annonces } = await fetchActiveAnnonces(50, 0);

  return (
    <div>
      {/* 1. Hero — chaleur editoriale */}
      <HeroSection />

      {/* 2. Navigation produit — categories + search (sticky sous le hero) */}
      <KanbanNav />

      {/* 3. Kanban dashboard */}
      <section id="kanban" className="max-w-[1600px] mx-auto px-4 md:px-10 pt-8 pb-32 lg:pb-24 scroll-mt-[140px]">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 lg:min-h-[calc(100vh-200px)]">
          <aside className="hidden lg:flex flex-col gap-4 overflow-y-auto no-scrollbar">
            <Suspense>
              <SidebarPreferences />
            </Suspense>
          </aside>
          <main className="lg:overflow-hidden">
            <Suspense>
              <HomeGrid initialAnnonces={annonces} />
            </Suspense>
          </main>
        </div>
      </section>

      {/* CTA sticky mobile — visible <lg */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-jim-background via-jim-background/95 to-transparent">
        <a
          href="/publier"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-br from-jim-primary to-jim-accent text-white font-bold text-base shadow-[0_8px_24px_rgba(255,124,92,0.4)] active:scale-[0.98] transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/50"
          aria-label="Publier une annonce"
        >
          <span className="text-xl" aria-hidden>+</span>
          Publier une annonce
        </a>
      </div>

      <FloatingMapButton />
    </div>
  );
}
