// Hook état réseau — Epic 4
// Note : implémentation déléguée à l'app mobile via store
// Ce hook lit simplement l'état depuis useOfflineStore
import { useOfflineStore } from '../stores/offline.store';

export function useNetworkStatus() {
  const isOnline = useOfflineStore((s) => s.isOnline);
  return { isOnline, isOffline: !isOnline };
}
