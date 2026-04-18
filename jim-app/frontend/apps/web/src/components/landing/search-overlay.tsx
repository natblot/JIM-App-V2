'use client';

// Overlay de recherche — autocomplete ville + dates + navigation
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useVilleAutocomplete } from '@jim/shared';
import type { VilleSuggestion } from '@jim/shared';

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedVille, setSelectedVille] = useState<VilleSuggestion | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, isLoading } = useVilleAutocomplete(query);

  // Focus auto a l'ouverture
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fermer avec Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  function handleSelectVille(s: VilleSuggestion) {
    setSelectedVille(s);
    setQuery(s.ville);
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (selectedVille) {
      params.set('ville', selectedVille.ville);
      params.set('lat', selectedVille.latitude.toString());
      params.set('lng', selectedVille.longitude.toString());
      params.set('r', '30');
    }
    if (dateDebut) params.set('date_debut', dateDebut);
    if (dateFin) params.set('date_fin', dateFin);

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
    onClose();
  }

  // Recherche lancee si au moins une ville ou une date est selectionnee
  const canSearch = !!selectedVille || !!dateDebut || !!dateFin;

  return (
    <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl mx-auto mt-20 sm:mt-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Champ de recherche ville */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
            <Search size={18} className="text-brand flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedVille(null); }}
              placeholder="Rechercher une ville..."
              className="flex-grow text-sm text-neutral-900 placeholder-neutral-400 outline-none"
            />
            {isLoading && <Loader2 size={16} className="animate-spin text-neutral-400" />}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la recherche"
              className="flex items-center justify-center min-w-[44px] min-h-[44px] text-neutral-600 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-jim-primary rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Champs dates */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
            <Calendar size={18} className="text-neutral-400 flex-shrink-0" />
            <div className="flex items-center gap-2 flex-grow">
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="text-sm text-neutral-900 border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="A partir du"
              />
              <span className="text-neutral-400 text-sm">→</span>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                min={dateDebut || undefined}
                className="text-sm text-neutral-900 border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Jusqu'au"
              />
            </div>
          </div>

          {/* Resultats autocomplete */}
          {!selectedVille && suggestions.length > 0 && (
            <ul className="max-h-48 overflow-y-auto">
              {suggestions.map((s) => (
                <li key={`${s.ville}-${s.codePostal}`}>
                  <button
                    onClick={() => handleSelectVille(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-brand" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{s.ville}</p>
                      <p className="text-xs text-neutral-500">{s.codePostal}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Ville selectionnee */}
          {selectedVille && (
            <div className="px-4 py-3 flex items-center gap-2 bg-brand-light/50">
              <MapPin size={14} className="text-brand" />
              <span className="text-sm font-medium text-neutral-800">{selectedVille.ville} ({selectedVille.codePostal})</span>
              <button onClick={() => { setSelectedVille(null); setQuery(''); }} className="ml-auto text-neutral-400 hover:text-neutral-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Indication initiale */}
          {!selectedVille && query.length < 2 && (
            <div className="px-4 py-4 text-center text-sm text-neutral-400">
              Tapez une ville ou selectionnez des dates
            </div>
          )}

          {/* Etat vide */}
          {!selectedVille && query.length >= 2 && !isLoading && suggestions.length === 0 && (
            <div className="px-4 py-4 text-center text-sm text-neutral-500">
              Aucune ville trouvee pour &laquo; {query} &raquo;
            </div>
          )}

          {/* Bouton rechercher */}
          {canSearch && (
            <div className="px-4 py-3 border-t border-neutral-100">
              <button
                onClick={handleSearch}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-dark transition-colors"
              >
                Rechercher
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
