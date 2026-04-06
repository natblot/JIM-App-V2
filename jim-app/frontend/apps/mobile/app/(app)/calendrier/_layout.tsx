// Layout Stack pour le groupe de routes calendrier — Epic 7
import { Stack } from 'expo-router';

export default function CalendrierLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
