'use client';

// Carte interactive Mapbox avec clustering — Phase 3
import { useCallback, useRef } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import type { MapMarker, BBox } from '@jim/shared';

// react-map-gl ajoute `features` au MapMouseEvent quand interactiveLayerIds est configure
// Le type officiel ne le reflète pas — on definit un type augmente
interface MapClickEvent {
  features?: Array<{
    layer?: { id?: string };
    geometry: { type: string; coordinates: number[] };
    properties?: Record<string, unknown>;
  }>;
}

export interface MapViewProps {
  markers: MapMarker[];
  onBoundsChange: (bbox: BBox) => void;
  selectedId?: string | undefined;
  hoveredId?: string | undefined;
  onMarkerClick: (id: string) => void;
  onMarkerHover: (id: string | null) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

// Verifie que le token Mapbox est valide
function isTokenValid(): boolean {
  return MAPBOX_TOKEN.length > 10 && !MAPBOX_TOKEN.startsWith('pk.placeholder');
}

// Conversion MapMarker[] → GeoJSON FeatureCollection
function markersToGeoJSON(markers: MapMarker[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: markers.map((m) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [m.lng, m.lat],
      },
      properties: {
        id: m.id,
        is_urgent: m.is_urgent,
        statut: m.statut,
        ville: m.ville,
        retrocession: m.retrocession,
        date_debut: m.date_debut,
        source: m.source,
      },
    })),
  };
}

export function MapView({
  markers,
  onBoundsChange,
  selectedId,
  hoveredId,
  onMarkerClick,
  onMarkerHover,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  // Extraire les bounds apres chaque mouvement de carte
  const handleMoveEnd = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    onBoundsChange({
      swLat: bounds.getSouthWest().lat,
      swLng: bounds.getSouthWest().lng,
      neLat: bounds.getNorthEast().lat,
      neLng: bounds.getNorthEast().lng,
    });
  }, [onBoundsChange]);

  // Gestion du clic sur un marqueur ou cluster
  const handleClick = useCallback(
    (e: MapClickEvent) => {
      const clusterFeature = e.features?.find((f) => f.layer?.id === 'clusters');
      if (clusterFeature && clusterFeature.geometry.type === 'Point') {
        const map = mapRef.current;
        if (!map) return;
        map.easeTo({
          center: clusterFeature.geometry.coordinates as [number, number],
          zoom: (map.getZoom() ?? 5) + 2,
          duration: 500,
        });
        return;
      }

      const pointFeature = e.features?.find((f) => f.layer?.id === 'unclustered-point');
      const pointId = pointFeature?.properties?.id;
      if (typeof pointId === 'string') {
        onMarkerClick(pointId);
      }
    },
    [onMarkerClick],
  );

  // Gestion du hover
  const handleMouseMove = useCallback(
    (e: MapClickEvent) => {
      const pointFeature = e.features?.find((f) => f.layer?.id === 'unclustered-point');
      const pointId = pointFeature?.properties?.id;
      if (typeof pointId === 'string') {
        onMarkerHover(pointId);
      } else {
        onMarkerHover(null);
      }
    },
    [onMarkerHover],
  );

  const handleMouseLeave = useCallback(() => {
    onMarkerHover(null);
  }, [onMarkerHover]);

  // Fallback si pas de token
  if (!isTokenValid()) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Carte indisponible — token Mapbox non configure</p>
      </div>
    );
  }

  const geojson = markersToGeoJSON(markers);

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/light-v11"
      initialViewState={{ latitude: 46.603, longitude: 1.888, zoom: 5.5 }}
      style={{ width: '100%', height: '100%' }}
      onMoveEnd={handleMoveEnd}
      onClick={handleClick as never}
      onMouseMove={handleMouseMove as never}
      onMouseLeave={handleMouseLeave as never}
      interactiveLayerIds={['clusters', 'unclustered-point']}
      attributionControl={false}
    >
      <Source
        id="annonces"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        {/* Couche clusters — cercles orange */}
        <Layer
          id="clusters"
          type="circle"
          filter={['has', 'point_count']}
          paint={{
            'circle-color': '#ff7c5c',
            'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 50, 32],
            'circle-opacity': 0.85,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />

        {/* Couche nombre dans les clusters */}
        <Layer
          id="cluster-count"
          type="symbol"
          filter={['has', 'point_count']}
          layout={{
            'text-field': ['get', 'point_count_abbreviated'],
            'text-size': 13,
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          }}
          paint={{ 'text-color': '#ffffff' }}
        />

        {/* Couche points individuels */}
        <Layer
          id="unclustered-point"
          type="circle"
          filter={['!', ['has', 'point_count']]}
          paint={{
            'circle-color': [
              'case',
              ['==', ['get', 'is_urgent'], true],
              '#ff7c5c',
              '#4b5563',
            ],
            'circle-radius': [
              'case',
              ['any',
                ['==', ['get', 'id'], selectedId ?? ''],
                ['==', ['get', 'id'], hoveredId ?? ''],
              ],
              10,
              7,
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.9,
          }}
        />
      </Source>
    </MapGL>
  );
}
