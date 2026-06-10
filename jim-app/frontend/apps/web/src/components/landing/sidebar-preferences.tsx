'use client';

// Sidebar preferences — localisation, prix, filtrage avance
import { useState } from 'react';
import { MapPin, Info, SlidersHorizontal, Home, DollarSign } from 'lucide-react';
import { useCurrentProfile } from '@jim/shared';
import { FiltersPanel } from './filters-panel';
import { useAuthContext } from '../providers/auth-provider';

export function SidebarPreferences() {
  const [showTotal, setShowTotal] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Lecture du profil pour binder la ville (Bug 5.B QA 2026-04-16) — fallback
  // explicite si pas de session ou pas de ville renseignee.
  const { supabase } = useAuthContext();
  const { data: profile } = useCurrentProfile(supabase);
  const localisationLabel = profile?.city
    ? `${profile.city}, France`
    : 'Localisation a renseigner';

  return (
    <>
      {/* Publier une annonce */}
      <a
        href="/publier"
        className="inline-flex items-center justify-center gap-2 w-full bg-jim-text text-white rounded-2xl px-[18px] py-[14px] text-[14px] font-bold tracking-[-0.01em] hover:bg-jim-primary transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/40"
        style={{ boxShadow: '0 4px 14px rgba(58,31,8,.15), 0 1px 2px rgba(58,31,8,.06)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Publier une annonce
      </a>

      {/* Carte Preferences */}
      <div className="bg-jim-surface rounded-[24px] shadow-sm border border-jim-border p-5 flex flex-col gap-5">
        <h3 className="text-[11px] font-bold text-jim-text uppercase tracking-[0.18em]">Preferences</h3>

        {/* Missions a proximite */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-jim-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-jim-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-jim-text">Missions a proximite</p>
            <p className="text-xs text-jim-muted underline decoration-jim-beige-mid underline-offset-2 hover:text-jim-text-body cursor-pointer truncate">
              {localisationLabel}
            </p>
          </div>
        </div>

        {/* Toggle prix total */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-jim-text">Prix total</p>
            <p className="text-xs text-jim-muted flex items-center gap-1">
              <Info size={10} /> Frais inclus
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTotal(!showTotal)}
            aria-pressed={showTotal ? 'true' : 'false'}
            aria-label="Afficher le prix total frais inclus"
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
              showTotal ? 'bg-jim-primary' : 'bg-jim-beige-mid'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
                showTotal ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Carte Filtrage avance */}
      <div className="bg-jim-surface rounded-[24px] shadow-sm border border-jim-border p-5 flex flex-col gap-4">
        <h3 className="text-[11px] font-bold text-jim-text uppercase tracking-[0.18em]">Filtrage avance</h3>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-3 text-left hover:bg-jim-beige-light/60 rounded-xl p-2 -m-2 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-jim-beige-light flex items-center justify-center flex-shrink-0">
            <DollarSign size={18} className="text-jim-text-body" />
          </div>
          <div>
            <p className="text-sm font-semibold text-jim-text">Honoraires minimum</p>
            <p className="text-xs text-jim-muted">Retrocession, tri</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-3 text-left hover:bg-jim-beige-light/60 rounded-xl p-2 -m-2 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-jim-beige-light flex items-center justify-center flex-shrink-0">
            <Home size={18} className="text-jim-text-body" />
          </div>
          <div>
            <p className="text-sm font-semibold text-jim-text">Logement inclus</p>
            <p className="text-xs text-jim-muted">Type cabinet, specialite</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-jim-border text-sm font-semibold text-jim-text-body hover:bg-jim-beige-light/60 hover:border-jim-primary/30 transition-colors"
        >
          <SlidersHorizontal size={14} />
          Tous les filtres
        </button>
      </div>

      {/* Panneau filtres */}
      <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </>
  );
}
