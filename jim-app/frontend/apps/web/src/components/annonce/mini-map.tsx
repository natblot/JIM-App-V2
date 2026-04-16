'use client';

// Mini-carte statique Mapbox pour la page detail annonce — Phase 2
// Le bundle mapbox-gl (~250 KB) est lazy-load via next/dynamic : il n'est charge
// que lorsque l'utilisateur clique sur l'image pour activer le mode interactif.
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy-load du composant Mapbox interactif (bundle evite tant que le user ne clique pas)
const InteractiveMap = dynamic(
  () => import('./mini-map-interactive').then((m) => m.MiniMapInteractive),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl overflow-hidden h-48 border border-gray-100 bg-gray-50 animate-pulse" />
    ),
  }
);

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

  // Mode interactif apres clic — chargement dynamique du bundle mapbox-gl
  if (interactive) {
    return <InteractiveMap lat={lat} lng={lng} token={MAPBOX_TOKEN} />;
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
