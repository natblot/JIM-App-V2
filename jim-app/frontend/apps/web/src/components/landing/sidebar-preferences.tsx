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
      {/* Carte Preferences */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 flex flex-col gap-5">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Preferences</h3>

        {/* Missions a proximite */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-brand" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Missions a proximite</p>
            <p className="text-xs text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-gray-700 cursor-pointer truncate">
              {localisationLabel}
            </p>
          </div>
        </div>

        {/* Toggle prix total */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Prix total</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Info size={10} /> Frais inclus
            </p>
          </div>
          <button
            onClick={() => setShowTotal(!showTotal)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
              showTotal ? 'bg-brand' : 'bg-gray-300'
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
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filtrage avance</h3>

        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-3 text-left hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <DollarSign size={18} className="text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Honoraires minimum</p>
            <p className="text-xs text-gray-500">Retrocession, tri</p>
          </div>
        </button>

        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-3 text-left hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Home size={18} className="text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Logement inclus</p>
            <p className="text-xs text-gray-500">Type cabinet, specialite</p>
          </div>
        </button>

        <button
          onClick={() => setFiltersOpen(true)}
          className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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
