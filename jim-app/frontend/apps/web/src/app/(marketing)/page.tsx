import { Suspense } from 'react';
import { PlusCircle } from 'lucide-react';
import { HeroSection } from '../../components/landing/hero-section';
import { HomeGrid } from '../../components/landing/home-grid';
import { KanbanNav } from '../../components/landing/kanban-nav';
import { SidebarPreferences } from '../../components/landing/sidebar-preferences';
import { FloatingMapButton } from '../../components/landing/floating-map-button';
import { fetchActiveAnnonces } from '../../lib/supabase-server';

function SectionLabel() {
  return (
    <div className="relative max-w-[1440px] mx-auto px-4 md:px-10 pt-14 pb-5">
      {/* Filet horizontal */}
      <div className="absolute top-14 left-4 right-4 md:left-10 md:right-10 h-px bg-gradient-to-r from-transparent via-jim-beige-mid to-transparent" />
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] items-end gap-6">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-jim-muted mt-5 mb-3">
            <span className="w-7 h-px bg-jim-primary flex-shrink-0" />
            Missions disponibles · mise à jour live
          </p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-[-0.035em] leading-none text-jim-text max-w-[580px] m-0">
            Ce qui se passe{' '}
            <em className="not-italic font-extrabold text-jim-primary">maintenant</em>{' '}
            dans votre région.
          </h2>
        </div>
        <p className="text-sm text-jim-text-body leading-relaxed max-w-[320px] mb-1 lg:text-right hidden lg:block">
          Filtrez par urgence, proximité ou nouveauté. Les annonces sont triées par pertinence automatique.
        </p>
      </div>
    </div>
  );
}

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

      {/* 2. Section label / divider */}
      <SectionLabel />

      {/* 3. Navigation produit — catégories (sticky, révèle search+publier quand stuck) */}
      <KanbanNav />

      {/* 4. Kanban dashboard */}
      <section id="kanban" className="max-w-[1440px] mx-auto px-4 md:px-10 pt-4 pb-32 lg:pb-24 scroll-mt-[130px]">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 lg:gap-4 lg:min-h-[calc(100vh-200px)]">
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

      {/* CTA sticky mobile — visible <lg. Le FAB Carte est masque <lg pour eviter l'empilement. */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3 bg-gradient-to-t from-jim-background via-jim-background/95 to-transparent">
        <a
          href="/publier"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-jim-primary text-white font-bold text-base shadow-[0_8px_24px_-4px_rgba(255,124,92,0.45)] hover:bg-jim-accent active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/50"
          aria-label="Publier une annonce"
        >
          <PlusCircle size={18} strokeWidth={2.5} />
          Publier une annonce
        </a>
      </div>

      <FloatingMapButton />
    </div>
  );
}
