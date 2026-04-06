// Store UI persisté (filtres, vue liste/carte, position carte) — Epic 4
import { create } from 'zustand';

export interface SearchFilters {
  radiusKm: number;
  dateDebut?: string | undefined;
  dateFin?: string | undefined;
  retrocessionMin?: number | undefined;
}

export interface MapPosition {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface UIState {
  // Vue active
  view: 'list' | 'map';
  setView: (view: 'list' | 'map') => void;

  // Filtres de recherche
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Dernière position carte
  mapPosition: MapPosition | null;
  setMapPosition: (position: MapPosition) => void;

  // Position utilisateur (geolocation)
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
}

const DEFAULT_FILTERS: SearchFilters = {
  radiusKm: 30,
  dateDebut: undefined,
  dateFin: undefined,
  retrocessionMin: undefined,
};

export const useUIStore = create<UIState>((set) => ({
  view: 'list',
  setView: (view) => set({ view }),

  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  mapPosition: null,
  setMapPosition: (mapPosition) => set({ mapPosition }),

  userLocation: null,
  setUserLocation: (userLocation) => set({ userLocation }),
}));
