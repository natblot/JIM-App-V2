import { Globe, ChevronUp } from 'lucide-react';

// Footer fixe glass morphism — liens legaux + settings langue/devise/support
export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-8 py-4 text-[11px] text-gray-500 z-40">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Liens gauche */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center">
          <span>&copy; 2026 JIM Inc.</span>
          <span className="hidden md:inline">&bull;</span>
          <a href="/cgu" className="font-bold uppercase tracking-wide hover:text-gray-700 transition-colors">Terms</a>
          <span className="hidden md:inline">&bull;</span>
          <a href="/sitemap.xml" className="font-bold uppercase tracking-wide hover:text-gray-700 transition-colors">Sitemap</a>
          <span className="hidden md:inline">&bull;</span>
          <a href="/confidentialite" className="font-bold uppercase tracking-wide hover:text-gray-700 transition-colors">Privacy</a>
        </div>

        {/* Settings droite */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 font-bold uppercase tracking-wide text-gray-600 hover:text-gray-800 transition-colors">
            <Globe size={12} /> Francais, FR
          </button>
          <button className="flex items-center gap-1 font-bold uppercase tracking-wide text-gray-600 hover:text-gray-800 transition-colors">
            EUR
          </button>
          <button className="flex items-center gap-1 font-bold uppercase tracking-wide text-gray-600 hover:text-gray-800 transition-colors">
            Support <ChevronUp size={10} className="ml-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
