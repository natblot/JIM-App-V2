import { Suspense } from 'react';
import { HomeGrid } from '../../components/landing/home-grid';
import { SidebarPreferences } from '../../components/landing/sidebar-preferences';
import { FloatingMapButton } from '../../components/landing/floating-map-button';
import { fetchActiveAnnonces } from '../../lib/supabase-server';

// ISR : revalider toutes les heures
export const revalidate = 3600;

// Page d'accueil — dashboard kanban avec sidebar preferences
// Plus de pagination (kanban scroll infini par colonne)
//
// Responsive (Bug 4.A QA 2026-04-16) :
// - lg+ (>= 1024px) : layout fige h-screen, kanban horizontal 3 colonnes,
//   sidebar visible a gauche, chaque colonne scroll vertical
// - <lg : layout en flux normal (page scrollable verticalement), sidebar masquee,
//   kanban en colonnes empilees full-width — pattern marketplace mobile classique
//   (Indeed, Welcome to the Jungle, Airbnb collections)
export default async function Home() {
  const { annonces } = await fetchActiveAnnonces(50, 0);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] pt-[160px] lg:pt-[200px] px-4 md:px-10 max-w-[1600px] mx-auto gap-6 lg:gap-8">
        {/* Sidebar — masquee sur mobile */}
        <aside className="hidden lg:flex flex-col gap-4 overflow-y-auto no-scrollbar pb-24">
          <Suspense>
            <SidebarPreferences />
          </Suspense>
        </aside>

        {/* Kanban board — horizontal sur desktop, vertical empile sur mobile */}
        <main className="lg:overflow-x-auto no-scrollbar pb-24">
          <Suspense>
            <HomeGrid initialAnnonces={annonces} />
          </Suspense>
        </main>
      </div>
      <FloatingMapButton />
    </div>
  );
}
