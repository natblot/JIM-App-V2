import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@jim/shared';

// Layout du groupe auth — pas de navigation bar
// Redirige vers l'app si l'utilisateur est déjà connecté
export default function AuthLayout() {
  const { user, isInitialized } = useAuthStore();

  // Attendre l'initialisation avant de décider
  if (!isInitialized) return null;

  // Rediriger vers l'app si déjà connecté
  if (user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Approximation de jim-background (#F5F7FC) en hex pour contentStyle
        contentStyle: { backgroundColor: '#F5F7FC' },
        animation: 'slide_from_right',
      }}
    />
  );
}
