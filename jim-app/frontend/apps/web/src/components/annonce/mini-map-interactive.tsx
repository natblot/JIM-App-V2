'use client';

// Composant Mapbox interactif — isole dans son propre fichier pour etre lazy-load
// via next/dynamic depuis mini-map.tsx. Le bundle mapbox-gl (~250 KB) n'est charge
// que lorsque l'utilisateur active le mode interactif.
import { MapPin } from 'lucide-react';
import MapGL, { Marker } from 'react-map-gl/mapbox';

interface MiniMapInteractiveProps {
  lat: number;
  lng: number;
  token: string;
}

export function MiniMapInteractive({ lat, lng, token }: MiniMapInteractiveProps) {
  return (
    <div className="rounded-2xl overflow-hidden h-48 border border-gray-100">
      <MapGL
        mapboxAccessToken={token}
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
