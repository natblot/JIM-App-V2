'use client';

// Panneau de filtres avances — retrocession, type cabinet, specialites, tri
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const TYPE_CABINET_OPTIONS = [
  { value: '', label: 'Tous les types' },
  { value: 'liberal', label: 'Liberal' },
  { value: 'groupe', label: 'Cabinet de groupe' },
  { value: 'centre_sante', label: 'Centre de sante' },
  { value: 'clinique', label: 'Clinique' },
  { value: 'hopital', label: 'Hopital' },
  { value: 'domicile', label: 'A domicile' },
];

const SPECIALITES_OPTIONS = [
  'respiratoire', 'pediatrique', 'neurologique', 'orthopedique',
  'geriatrique', 'sportive', 'cardiovasculaire', 'vestibulaire',
  'oncologique', 'generale',
];

const SORT_OPTIONS = [
  { value: '', label: 'Plus recentes' },
  { value: 'retrocession_desc', label: 'Retrocession (haute vers basse)' },
  { value: 'retrocession_asc', label: 'Retrocession (basse vers haute)' },
  { value: 'date_debut_asc', label: 'Date de debut (proche)' },
];

interface FiltersPanelProps {
  open: boolean;
  onClose: () => void;
}

export function FiltersPanel({ open, onClose }: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lire les filtres actifs depuis l'URL
  const [retrocessionMin, setRetrocessionMin] = useState(searchParams.get('retro_min') ?? '');
  const [typeCabinet, setTypeCabinet] = useState(searchParams.get('type_cabinet') ?? '');
  const [specialite, setSpecialite] = useState(searchParams.get('specialite') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? '');

  // Sync avec les searchParams si ils changent
  useEffect(() => {
    setRetrocessionMin(searchParams.get('retro_min') ?? '');
    setTypeCabinet(searchParams.get('type_cabinet') ?? '');
    setSpecialite(searchParams.get('specialite') ?? '');
    setSort(searchParams.get('sort') ?? '');
  }, [searchParams]);

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString());
    // Supprimer la page (retour a la 1)
    params.delete('page');

    // Retrocession min
    if (retrocessionMin) params.set('retro_min', retrocessionMin);
    else params.delete('retro_min');

    // Type cabinet
    if (typeCabinet) params.set('type_cabinet', typeCabinet);
    else params.delete('type_cabinet');

    // Specialite
    if (specialite) params.set('specialite', specialite);
    else params.delete('specialite');

    // Tri
    if (sort) params.set('sort', sort);
    else params.delete('sort');

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
    onClose();
  }

  function handleReset() {
    // Garder uniquement ville/lat/lng/r si presents
    const params = new URLSearchParams();
    const ville = searchParams.get('ville');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const r = searchParams.get('r');
    if (ville) params.set('ville', ville);
    if (lat) params.set('lat', lat);
    if (lng) params.set('lng', lng);
    if (r) params.set('r', r);

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
    onClose();
  }

  if (!open) return null;

  const activeCount = [retrocessionMin, typeCabinet, specialite, sort].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[60] bg-jim-text/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-jim-surface shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-jim-border sticky top-0 bg-jim-surface z-10">
          <h2 className="text-lg font-semibold text-jim-text flex items-center gap-2">
            <SlidersHorizontal size={18} /> Filtres
            {activeCount > 0 && (
              <span className="text-xs bg-jim-primary text-white rounded-full px-2 py-0.5">{activeCount}</span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="text-jim-muted hover:text-jim-text-body focus:outline-none focus-visible:ring-2 focus-visible:ring-jim-primary rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Tri */}
          <div>
            <label className="text-sm font-medium text-jim-text-body mb-2 flex items-center gap-1.5">
              <ArrowUpDown size={14} /> Trier par
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-jim-border px-4 py-2.5 text-sm text-jim-text focus:outline-none focus:ring-2 focus:ring-jim-primary/30 focus:border-jim-primary bg-jim-surface"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Retrocession minimum */}
          <div>
            <label className="block text-sm font-medium text-jim-text-body mb-2">
              Retrocession minimum
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={retrocessionMin || 0}
                onChange={(e) => setRetrocessionMin(e.target.value === '0' ? '' : e.target.value)}
                className="flex-grow accent-jim-primary"
                aria-label="Retrocession minimum"
              />
              <span className="text-sm font-semibold text-jim-text w-12 text-right">
                {retrocessionMin ? `${retrocessionMin}%` : 'Tous'}
              </span>
            </div>
          </div>

          {/* Type de cabinet */}
          <div>
            <label className="block text-sm font-medium text-jim-text-body mb-2">
              Type de cabinet
            </label>
            <select
              value={typeCabinet}
              onChange={(e) => setTypeCabinet(e.target.value)}
              className="w-full rounded-xl border border-jim-border px-4 py-2.5 text-sm text-jim-text focus:outline-none focus:ring-2 focus:ring-jim-primary/30 focus:border-jim-primary bg-jim-surface"
            >
              {TYPE_CABINET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Specialite */}
          <div>
            <label className="block text-sm font-medium text-jim-text-body mb-2">
              Specialite
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSpecialite('')}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  !specialite
                    ? 'bg-jim-primary text-white border-jim-primary'
                    : 'bg-jim-surface text-jim-text-body border-jim-border hover:border-jim-primary/40'
                }`}
              >
                Toutes
              </button>
              {SPECIALITES_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecialite(specialite === s ? '' : s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                    specialite === s
                      ? 'bg-jim-primary text-white border-jim-primary'
                      : 'bg-jim-surface text-jim-text-body border-jim-border hover:border-jim-primary/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-jim-surface border-t border-jim-border px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-jim-text-body border border-jim-border hover:bg-jim-beige-light/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-jim-primary"
          >
            Reinitialiser
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-jim-primary hover:bg-jim-accent transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/40"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
