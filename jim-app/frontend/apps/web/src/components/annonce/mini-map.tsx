'use client';

// Mini-carte statique Mapbox pour la page detail annonce — Phase 2
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import MapGL, { Marker } from 'react-map-gl/mapbox';

interface MiniMapProps {
  lat: number;
  lng: number;
  ville: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

// Verifie que le token est configure (pas un placeholder)
function isTokenValid(): boolean {
  return Boolean(MAPBOX_TOKEN && MAPBOX_TOKEN.length > 10 && !MAPBOX_TOKEN.startsWith('pk.placeholder'));
}

export function MiniMap({ lat, lng, ville }: MiniMapProps) {
  const [interactive, setInteractive] = useState(false);

  const handleClick = useCallback(() => {
    if (isTokenValid()) {
      setInteractive(true);
    }
  }, []);

  // Fallback si pas de token valide
  if (!isTokenValid()) {
    return (
      <div className="rounded-2xl overflow-hidden h-48 border border-gray-100 bg-gray-50 flex items-center justify-center gap-2 text-gray-400">
        <MapPin size={20} />
        <span className="text-sm font-medium">{ville}</span>
      </div>
    );
  }

  // Mode interactif apres clic
  if (interactive) {
    return (
      <div className="rounded-2xl overflow-hidden h-48 border border-gray-100">
        <MapGL
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
          initialViewState={{ latitude: lat, longitude: lng, zoom: 13 }}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          <Marker latitude={lat} longitude={lng} anchor="bottom">
            <MapPin size={28} className="text-[#ff7c5c] fill-[#ff7c5c]" />
          </Marker>
        </MapGL>
      </div>
    );
  }

  // Mode statique par defaut — image Mapbox
  const staticUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+ff7c5c(${lng},${lat})/${lng},${lat},13/600x200@2x?access_token=${MAPBOX_TOKEN}`;

  return (
    <div
      className="rounded-2xl overflow-hidden h-48 border border-gray-100 cursor-pointer relative"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-label={`Voir la carte interactive de ${ville}`}
    >
      <Image
        src={staticUrl}
        alt={`Localisation ${ville}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 600px"
        unoptimized
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
        <span className="sr-only">Cliquer pour afficher la carte interactive</span>
      </div>
    </div>
  );
}
