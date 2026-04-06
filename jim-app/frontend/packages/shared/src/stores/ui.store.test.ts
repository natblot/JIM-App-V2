import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './ui.store';

// Reset store avant chaque test
beforeEach(() => {
  useUIStore.setState({
    view: 'list',
    filters: { radiusKm: 30 },
    mapPosition: null,
    userLocation: null,
  });
});

describe('useUIStore', () => {
  it('initialise avec les valeurs par défaut', () => {
    const { view, filters } = useUIStore.getState();
    expect(view).toBe('list');
    expect(filters.radiusKm).toBe(30);
    expect(filters.retrocessionMin).toBeUndefined();
  });

  it('setView change la vue active', () => {
    useUIStore.getState().setView('map');
    expect(useUIStore.getState().view).toBe('map');
  });

  it('setFilters fusionne les filtres partiellement', () => {
    useUIStore.getState().setFilters({ radiusKm: 50 });
    const { filters } = useUIStore.getState();
    expect(filters.radiusKm).toBe(50);
    expect(filters.retrocessionMin).toBeUndefined();
  });

  it('setFilters ajoute un filtre rétrocession', () => {
    useUIStore.getState().setFilters({ retrocessionMin: 80 });
    expect(useUIStore.getState().filters.retrocessionMin).toBe(80);
    // Radius toujours à 30 (non modifié)
    expect(useUIStore.getState().filters.radiusKm).toBe(30);
  });

  it('resetFilters restaure les valeurs par défaut', () => {
    useUIStore.getState().setFilters({ radiusKm: 100, retrocessionMin: 85 });
    useUIStore.getState().resetFilters();
    const { filters } = useUIStore.getState();
    expect(filters.radiusKm).toBe(30);
    expect(filters.retrocessionMin).toBeUndefined();
  });

  it('setMapPosition enregistre la position', () => {
    const pos = { latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.1, longitudeDelta: 0.1 };
    useUIStore.getState().setMapPosition(pos);
    expect(useUIStore.getState().mapPosition).toEqual(pos);
  });
});
