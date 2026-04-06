'use client';

// Popup d'information pour un marqueur de carte — Phase 3
import Link from 'next/link';
import { Popup } from 'react-map-gl/mapbox';
import { Zap, MapPin, Calendar, ArrowRight } from 'lucide-react';
import type { MapMarker } from '@jim/shared';

interface MapPopupProps {
  marker: MapMarker;
  onClose: () => void;
}

export function MapPopup({ marker, onClose }: MapPopupProps) {
  const dateFormatted = new Date(marker.date_debut).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Popup
      latitude={marker.lat}
      longitude={marker.lng}
      onClose={onClose}
      closeOnClick={false}
      anchor="bottom"
      offset={16}
      className="map-popup"
    >
      <div className="rounded-xl p-3 shadow-lg bg-white text-sm min-w-[200px]">
        {/* Ville + badge urgent */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{marker.ville}</span>
          </div>
          {marker.is_urgent && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase">
              <Zap size={10} /> Urgent
            </span>
          )}
        </div>

        {/* Retrocession et date */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="font-medium text-gray-700">{marker.retrocession}%</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {dateFormatted}
          </span>
        </div>

        {/* Lien vers l'annonce */}
        <Link
          href={`/annonce/${marker.id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold bg-[#ff7c5c] text-white hover:bg-[#e86b4d] transition-colors"
        >
          Voir l&apos;annonce <ArrowRight size={12} />
        </Link>
      </div>
    </Popup>
  );
}
