// Encart incitatif pour inviter le titulaire agrégé à publier directement sur JIM
// Design subtil — pas un popup, juste un encart en bas de page
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export function IncentivePublish() {
  const router = useRouter();

  return (
    <View className="mx-6 mb-6 p-4 bg-jim-success/5 border border-jim-success/20 rounded-2xl gap-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-lg" aria-hidden>✨</Text>
        <Text className="text-jim-text font-semibold flex-1 text-sm">
          Publiez directement sur JIM
        </Text>
      </View>
      <Text className="text-jim-muted text-sm leading-5">
        Les annonces JIM reçoivent <Text className="font-semibold text-jim-text">3x plus de candidatures</Text> —
        toutes vérifiées RPPS. Créez votre annonce en moins de 2 minutes.
      </Text>
      <Pressable
        className="bg-jim-success/10 border border-jim-success/30 rounded-xl px-4 py-2.5 items-center active:opacity-80"
        onPress={() => router.push('/(app)/publier' as never)}
        accessibilityRole="button"
      >
        <Text className="text-jim-success font-semibold text-sm">
          Publier mon annonce gratuitement
        </Text>
      </Pressable>
    </View>
  );
}
