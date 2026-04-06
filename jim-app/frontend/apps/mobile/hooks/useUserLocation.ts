// Hook géolocation — Epic 4
// expo-location avec gestion refus + fallback gracieux
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface UserLocationResult {
  latitude: number | null;
  longitude: number | null;
  permissionDenied: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useUserLocation(): UserLocationResult {
  const [state, setState] = useState<UserLocationResult>({
    latitude: null,
    longitude: null,
    permissionDenied: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function requestLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) {
            setState((s) => ({ ...s, permissionDenied: true, isLoading: false }));
          }
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setState({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            permissionDenied: false,
            isLoading: false,
            error: null,
          });
        }
      } catch {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            isLoading: false,
            error: "Impossible d'obtenir votre position",
          }));
        }
      }
    }

    void requestLocation();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
