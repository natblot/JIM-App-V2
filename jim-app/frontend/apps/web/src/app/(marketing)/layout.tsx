import { Suspense } from 'react';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';

// Layout marketing — transparent : chaque page gere sa propre geometrie.
// La landing applique h-screen overflow-hidden elle-meme (dashboard kanban),
// les autres pages (detail annonce, marketing) conservent le scroll naturel.
// Suspense requis car le Header utilise useSearchParams.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-[#fdf6ed] min-h-screen">
      <Suspense>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </div>
  );
}
