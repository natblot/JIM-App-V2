import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function PushPermissionScreen() {
  const router = useRouter();

  const handleAccept = async () => {
    // TODO: expo-notifications — demander la permission système iOS/Android
    // puis enregistrer le token FCM dans profiles.push_token
    // Pour l'instant, rediriger vers le profil
    router.replace('/(app)/profile-edit');
  };

  const handleDecline = () => {
    // L'utilisateur refuse — fallback email configuré automatiquement (FR46)
    router.replace('/(app)/profile-edit');
  };

  const benefits = [
    { emoji: '📣', text: 'Nouvelle annonce dans votre zone → candidater en 30 secondes' },
    { emoji: '✅', text: 'Candidature acceptée → répondre au titulaire immédiatement' },
    { emoji: '💬', text: 'Message du titulaire → ne jamais rater un échange important' },
  ];

  return (
    <View className="flex-1 bg-jim-background items-center justify-between px-6 pt-20 pb-10">
      <Animated.View entering={FadeInDown.duration(500)} className="flex-1 items-center justify-center gap-6 w-full">
        {/* Icône */}
        <View className="w-24 h-24 bg-jim-primary/10 rounded-full items-center justify-center border-2 border-jim-primary/30">
          <Text className="text-5xl">🔔</Text>
        </View>

        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-jim-text text-center">
            Restez dans la course
          </Text>
          <Text className="text-jim-muted text-center leading-6 max-w-sm">
            Les meilleurs remplacements partent vite. Les notifications vous donnent une longueur d'avance.
          </Text>
        </View>

        {/* Bénéfices */}
        <View className="w-full gap-3">
          {benefits.map((benefit, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.duration(400).delay(100 + index * 80)}
              className="flex-row items-start gap-3 bg-jim-surface border border-jim-border rounded-xl p-4"
            >
              <Text className="text-2xl">{benefit.emoji}</Text>
              <Text className="text-jim-text text-sm leading-5 flex-1">{benefit.text}</Text>
            </Animated.View>
          ))}
        </View>

        <View className="bg-jim-primary/8 rounded-xl p-3 border border-jim-primary/20 w-full">
          <Text className="text-jim-muted text-xs text-center leading-4">
            Max 3 notifications par jour · Vous pouvez les désactiver à tout moment dans les paramètres
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(300)} className="w-full gap-3">
        <Pressable
          className="h-14 bg-jim-primary rounded-xl items-center justify-center active:bg-jim-primary/90"
          onPress={handleAccept}
          accessibilityRole="button"
          accessibilityLabel="Activer les notifications"
        >
          <Text className="text-white font-semibold text-base">Activer les notifications</Text>
        </Pressable>

        <Pressable
          className="h-12 items-center justify-center"
          onPress={handleDecline}
          accessibilityRole="button"
          accessibilityLabel="Pas maintenant"
        >
          <Text className="text-jim-muted text-sm">Pas maintenant — je recevrai un email à la place</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
