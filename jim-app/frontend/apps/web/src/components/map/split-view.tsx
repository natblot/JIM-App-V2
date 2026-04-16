'use client';

// Vue splitee liste + carte geographique — Phase 3
import { useMemo, useRef, useEffect } from 'react';
import { useMapController } from '../../hooks/useMapController';
import { MapView } from './map-view';
import { MapPopup } from './map-popup';
import { ListingCard } from '../landing/listing-card';
import type { ListingData } from '../landing/listing-card';
import type { MapMarker } from '@jim/shared';
import { Navigation } from 'lucide-react';

// Conversion MapMarker -> ListingData pour la sidebar
// Affiche le pourcentage de retrocession reel — pas de prix journalier fabrique
// (voir Bug 3 du QA 2026-04-16).
function markerToListing(marker: MapMarker): ListingData {
  const retro = marker.retrocession ?? 80;

  return {
    id: marker.id,
    ville: marker.ville,
    description: `Remplacement kine a ${marker.ville}`,
    retrocessionPct: retro,
    isUrgent: marker.is_urgent,
    source: marker.source,
    dateDebut: marker.date_debut,
    isRppsVerified: marker.source === 'native',
  };
}

export function SplitView() {
  const {
    markers,
    setBbox,
    selectedId,
    setSelectedId,
    hoveredId,
    setHoveredId,
    userLocation,
    requestGeolocation,
  } = useMapController();

  // Reference pour scroller automatiquement vers la carte selectionnee
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Convertir les marqueurs en ListingData
  const listings = useMemo(() => markers.map(markerToListing), [markers]);

  // Trouver le marqueur selectionne pour le popup
  const selectedMarker = useMemo(
    () => (selectedId ? markers.find((m) => m.id === selectedId) ?? null : null),
    [markers, selectedId],
  );

  // Scroller vers la carte selectionnee dans la liste
  useEffect(() => {
    if (!selectedId) return;
    const el = cardRefs.current.get(selectedId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-[minmax(380px,480px)_1fr]">
      {/* Panneau gauche — liste des annonces (masque en mobile) */}
      <div
        ref={listRef}
        className="hidden lg:flex flex-col overflow-y-auto border-r border-gray-100 bg-[#fdf6ed]"
      >
        {/* En-tete de la liste */}
        <div className="flex-shrink-0 bg-[#fdf6ed] border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              {markers.length} annonce{markers.length !== 1 ? 's' : ''}
            </h2>
            <button
              onClick={requestGeolocation}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#ff7c5c] transition-colors"
              title="Me localiser"
            >
              <Navigation size={14} />
              <span className="hidden xl:inline">Autour de moi</span>
            </button>
          </div>
          {userLocation && (
            <p className="text-[10px] text-gray-400 mt-1">
              Position : {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
            </p>
          )}
        </div>

        {/* Liste des cartes */}
        <div className="flex-1 px-3 py-3 space-y-3">
          {listings.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              Deplacez la carte pour decouvrir des annonces
            </div>
          ) : (
            listings.map((listing) => (
              <div
                key={listing.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(listing.id, el);
                }}
                onMouseEnter={() => setHoveredId(listing.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`transition-all rounded-[24px] ${
                  selectedId === listing.id
                    ? 'ring-2 ring-[#ff7c5c] ring-offset-2'
                    : hoveredId === listing.id
                      ? 'ring-1 ring-gray-200'
                      : ''
                }`}
              >
                <ListingCard listing={listing} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panneau droit — carte (plein ecran en mobile) */}
      <div className="flex-1 relative min-h-0">
        <MapView
          markers={markers}
          onBoundsChange={setBbox}
          selectedId={selectedId ?? undefined}
          hoveredId={hoveredId ?? undefined}
          onMarkerClick={(id) => setSelectedId(id)}
          onMarkerHover={(id) => setHoveredId(id)}
        />

        {/* Popup du marqueur selectionne */}
        {selectedMarker && (
          <MapPopup
            marker={selectedMarker}
            onClose={() => setSelectedId(null)}
          />
        )}

        {/* Bouton geolocalisation flottant (mobile) */}
        <button
          onClick={requestGeolocation}
          className="lg:hidden absolute bottom-6 right-6 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
          aria-label="Me localiser"
        >
          <Navigation size={20} className="text-gray-700" />
        </button>

        {/* Compteur annonces (mobile) */}
        <div className="lg:hidden absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm shadow-md rounded-full px-4 py-2 text-xs font-bold text-gray-900">
          {markers.length} annonce{markers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
