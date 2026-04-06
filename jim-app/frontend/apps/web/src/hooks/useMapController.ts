'use client';

// Hook controleur de la carte geographique — Phase 3
import { useState, useEffect, useCallback } from 'react';
import { useMapAnnonces } from '@jim/shared';
import type { BBox } from '@jim/shared';
import { useAuthContext } from '../components/providers/auth-provider';

export function useMapController() {
  const { supabase } = useAuthContext();
  const [bbox, setBbox] = useState<BBox | null>(null);
  const [debouncedBbox, setDebouncedBbox] = useState<BBox | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Debounce bbox 300ms pour eviter des requetes trop frequentes
  useEffect(() => {
    const t = setTimeout(() => setDebouncedBbox(bbox), 300);
    return () => clearTimeout(t);
  }, [bbox]);

  const { data: markers = [] } = useMapAnnonces(supabase, debouncedBbox);

  const requestGeolocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        // Echec silencieux — geolocalisation refusee ou indisponible
      },
    );
  }, []);

  return {
    markers,
    bbox,
    setBbox,
    selectedId,
    setSelectedId,
    hoveredId,
    setHoveredId,
    userLocation,
    requestGeolocation,
  };
}
