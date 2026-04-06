// Store offline — cache annonces + statut réseau + queue actions — Epic 4 / Epic 5 / Epic 6
import { create } from 'zustand';
import type { AnnonceRow } from '../validators/annonce.schema';

// Type action offline — Epic 5 + Epic 6
export interface OfflinePendingAction {
  type: 'CREATE_CANDIDATURE' | 'SEND_MESSAGE';
  payload: Record<string, unknown>;
  idempotencyKey: string;
  status: 'pending' | 'syncing' | 'failed';
  createdAt: string;
}

interface OfflineState {
  // Statut réseau
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;

  // Cache annonces (FIFO, 1000 max)
  cachedAnnonces: AnnonceRow[];
  cacheAnnonces: (annonces: AnnonceRow[]) => void;
  getAnnonceFromCache: (id: string) => AnnonceRow | undefined;
  clearCache: () => void;

  // Queue actions offline — Epic 5
  pendingActions: OfflinePendingAction[];
  enqueueAction: (action: OfflinePendingAction) => void;
  dequeueAction: (idempotencyKey: string) => void;
  clearPendingActions: () => void;
}

const MAX_CACHE = 1000;

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: true,
  setIsOnline: (isOnline) => set({ isOnline }),

  cachedAnnonces: [],
  cacheAnnonces: (annonces) =>
    set((state) => {
      // Fusionner avec le cache existant, dédupliquer par id, FIFO 1000 max
      const merged = [
        ...annonces,
        ...state.cachedAnnonces.filter(
          (a) => !annonces.find((n) => n.id === a.id)
        ),
      ];
      return { cachedAnnonces: merged.slice(0, MAX_CACHE) };
    }),
  getAnnonceFromCache: (id) => get().cachedAnnonces.find((a) => a.id === id),
  clearCache: () => set({ cachedAnnonces: [] }),

  // Queue actions offline — Epic 5
  pendingActions: [],
  enqueueAction: (action) =>
    set((state) => {
      // Dédupliquer par idempotencyKey — évite les double-envois offline
      const alreadyQueued = state.pendingActions.some(
        (a) => a.idempotencyKey === action.idempotencyKey
      );
      if (alreadyQueued) return state;
      return { pendingActions: [...state.pendingActions, action] };
    }),
  dequeueAction: (idempotencyKey) =>
    set((state) => ({
      pendingActions: state.pendingActions.filter(
        (a) => a.idempotencyKey !== idempotencyKey
      ),
    })),
  clearPendingActions: () => set({ pendingActions: [] }),
}));
