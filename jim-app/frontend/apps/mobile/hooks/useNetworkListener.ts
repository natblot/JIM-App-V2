// Listener réseau natif — connecte NetInfo au store offline
// À appeler une seule fois depuis le _layout.tsx racine
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '@jim/shared';

export function useNetworkListener() {
  const setIsOnline = useOfflineStore((s) => s.setIsOnline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    return unsubscribe;
  }, [setIsOnline]);
}
