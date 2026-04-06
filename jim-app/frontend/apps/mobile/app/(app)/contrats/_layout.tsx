// Layout du groupe contrats — Stack Expo Router simple — Epic 8
import { Stack } from 'expo-router';

// Stack sans header natif — chaque écran gère son propre en-tête
export default function ContratsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[candidatureId]" />
      <Stack.Screen name="pdf/[contratId]" />
    </Stack>
  );
}
