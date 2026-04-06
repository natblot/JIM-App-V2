// Hook accès aux annonces en cache offline — Epic 4
import { useOfflineStore } from '../stores/offline.store';

export function useOfflineAnnonces() {
  const cachedAnnonces = useOfflineStore((s) => s.cachedAnnonces);
  const isOnline = useOfflineStore((s) => s.isOnline);

  return {
    cachedAnnonces,
    isOffline: !isOnline,
    count: cachedAnnonces.length,
  };
}
