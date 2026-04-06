import { Suspense } from 'react';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';

// Layout marketing — dashboard kanban fixe plein ecran
// Suspense requis car le Header utilise useSearchParams
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden relative bg-[#fdf6ed]">
      <Suspense>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </div>
  );
}
