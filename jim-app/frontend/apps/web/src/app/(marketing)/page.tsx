import { Suspense } from 'react';
import { HomeGrid } from '../../components/landing/home-grid';
import { SidebarPreferences } from '../../components/landing/sidebar-preferences';
import { FloatingMapButton } from '../../components/landing/floating-map-button';
import { fetchActiveAnnonces } from '../../lib/supabase-server';

// ISR : revalider toutes les heures
export const revalidate = 3600;

// Page d'accueil — dashboard kanban avec sidebar preferences
// Plus de pagination (kanban scroll infini par colonne)
export default async function Home() {
  const { annonces } = await fetchActiveAnnonces(50, 0);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] h-screen pt-[200px] px-6 md:px-10 max-w-[1600px] mx-auto gap-8">
        {/* Sidebar — masquee sur mobile */}
        <aside className="hidden lg:flex flex-col gap-4 overflow-y-auto no-scrollbar pb-24">
          <Suspense>
            <SidebarPreferences />
          </Suspense>
        </aside>

        {/* Kanban board — scrollable horizontalement */}
        <main className="overflow-x-auto no-scrollbar pb-24">
          <Suspense>
            <HomeGrid initialAnnonces={annonces} />
          </Suspense>
        </main>
      </div>
      <FloatingMapButton />
    </>
  );
}
