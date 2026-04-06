// Page carte geographique des remplacements — plein ecran
import type { Metadata } from 'next';
import { SplitView } from '../../components/map/split-view';

export const metadata: Metadata = {
  title: 'Carte des remplacements | JIM',
  description: 'Explorez les remplacements kinesitherapeute disponibles sur la carte interactive.',
};

export default function CartePage() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#fdf6ed]">
      {/* Header minimal carte */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm z-10">
        <a href="/" className="text-2xl font-extrabold text-[#ff7c5c] tracking-tighter">
          jim
        </a>
        <a
          href="/"
          className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1"
        >
          ← Retour aux annonces
        </a>
      </div>

      {/* Carte split-view plein ecran */}
      <div className="flex-1 min-h-0">
        <SplitView />
      </div>
    </div>
  );
}
