import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore, getSupabaseClient, useAnnonceRealtime } from '@jim/shared';
// Gestionnaire push — Epic 7 (listeners foreground + deep link)
import { NotificationHandler } from '../components/notifications/notification-handler';

// Client TanStack Query — singleton pour toute l'app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  },
});

// Client Supabase initialisé avec les vars d'environnement Expo
// Exporté pour être partagé par tous les écrans sans re-créer le client
export const supabase = getSupabaseClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

// Composant interne — placé à l'intérieur de QueryClientProvider pour accéder aux hooks TanStack Query
function AppProviders() {
  const { setUser, setSession, setInitialized } = useAuthStore();

  useEffect(() => {
    // Écouter les changements d'état d'auth Supabase — source de vérité unique
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setInitialized]);

  // Souscription Realtime annonces — propagation statuts < 2s (NFR9, Story 2.5)
  useAnnonceRealtime(supabase);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* NotificationHandler monté après QueryClientProvider — gère listeners push (Epic 7) */}
        {/* Ne pas appeler requestPermissionsAsync ici — géré dans l'écran push-permission (Story 1.8) */}
        <NotificationHandler />
        <AppProviders />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
