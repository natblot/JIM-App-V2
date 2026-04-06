// Layout Stack pour le groupe de routes conversations — Epic 6
import { Stack } from 'expo-router';

export default function ConversationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
