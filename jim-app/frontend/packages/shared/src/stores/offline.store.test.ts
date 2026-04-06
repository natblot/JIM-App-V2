import { describe, it, expect, beforeEach } from 'vitest';
import { useOfflineStore } from './offline.store';
import type { AnnonceRow } from '../validators/annonce.schema';

const makeAnnonce = (id: string): AnnonceRow => ({
  id,
  profile_id: 'user-1',
  type_annonce: 'remplacement',
  date_debut: '2026-06-01',
  date_fin: '2026-06-30',
  retrocession: 82,
  description: null,
  ville: 'Lyon',
  code_postal: '69001',
  adresse_complete: null,
  location: null,
  type_cabinet: null,
  specialites: [],
  statut: 'active',
  is_urgent: false,
  source: 'native',
  source_url: null,
  retrocession_moyenne_zone: null,
  freshness_reminder_count: 0,
  created_at: '2026-03-01T00:00:00Z',
  updated_at: '2026-03-01T00:00:00Z',
  published_at: '2026-03-01T00:00:00Z',
  closed_at: null,
  archived_at: null,
});

beforeEach(() => {
  useOfflineStore.setState({ cachedAnnonces: [], isOnline: true });
});

describe('useOfflineStore', () => {
  it('initialise avec cache vide et statut online', () => {
    const { cachedAnnonces, isOnline } = useOfflineStore.getState();
    expect(cachedAnnonces).toHaveLength(0);
    expect(isOnline).toBe(true);
  });

  it('setIsOnline change le statut réseau', () => {
    useOfflineStore.getState().setIsOnline(false);
    expect(useOfflineStore.getState().isOnline).toBe(false);
  });

  it('cacheAnnonces ajoute des annonces', () => {
    const annonces = [makeAnnonce('a1'), makeAnnonce('a2')];
    useOfflineStore.getState().cacheAnnonces(annonces);
    expect(useOfflineStore.getState().cachedAnnonces).toHaveLength(2);
  });

  it('cacheAnnonces déduplique par id', () => {
    useOfflineStore.getState().cacheAnnonces([makeAnnonce('a1')]);
    useOfflineStore.getState().cacheAnnonces([makeAnnonce('a1'), makeAnnonce('a2')]);
    expect(useOfflineStore.getState().cachedAnnonces).toHaveLength(2);
  });

  it("getAnnonceFromCache retourne l'annonce si présente", () => {
    useOfflineStore.getState().cacheAnnonces([makeAnnonce('a1')]);
    const found = useOfflineStore.getState().getAnnonceFromCache('a1');
    expect(found?.id).toBe('a1');
  });

  it('getAnnonceFromCache retourne undefined si absente', () => {
    const found = useOfflineStore.getState().getAnnonceFromCache('inexistant');
    expect(found).toBeUndefined();
  });

  it('clearCache vide le cache', () => {
    useOfflineStore.getState().cacheAnnonces([makeAnnonce('a1')]);
    useOfflineStore.getState().clearCache();
    expect(useOfflineStore.getState().cachedAnnonces).toHaveLength(0);
  });

  it('respecte la limite de 1000 annonces (FIFO)', () => {
    // Insérer 600 annonces
    const batch1 = Array.from({ length: 600 }, (_, i) => makeAnnonce(`old-${i}`));
    useOfflineStore.getState().cacheAnnonces(batch1);
    // Insérer 500 nouvelles — total devrait être tronqué à 1000
    const batch2 = Array.from({ length: 500 }, (_, i) => makeAnnonce(`new-${i}`));
    useOfflineStore.getState().cacheAnnonces(batch2);
    expect(useOfflineStore.getState().cachedAnnonces).toHaveLength(1000);
    // Les nouvelles sont en premier (FIFO — nouvelles en tête)
    expect(useOfflineStore.getState().cachedAnnonces[0]!.id).toMatch(/^new-/);
  });
});
