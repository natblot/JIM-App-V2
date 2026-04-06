import { View, Text, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Écran d'accueil — point d'entrée de l'authentification
// Design : fond marine foncé (jim-text), logo J en saumon (jim-accent), CTA bleus
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-jim-text items-center justify-between px-6 pb-12 pt-20">
      <StatusBar barStyle="light-content" />

      {/* Logo + tagline */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="flex-1 items-center justify-center gap-6"
      >
        {/* Logo JIM — "J" saumon sur fond marine */}
        <View
          className="w-24 h-24 rounded-3xl bg-jim-accent items-center justify-center"
          accessibilityLabel="Logo JIM"
          accessibilityRole="image"
        >
          <Text className="text-5xl font-bold text-jim-text" aria-hidden>
            J
          </Text>
        </View>

        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-white tracking-tight">
            JIM
          </Text>
          <Text className="text-jim-muted text-base text-center leading-relaxed max-w-xs">
            Le réseau des kinésithérapeutes remplaçants et titulaires
          </Text>
        </View>

        {/* Badge de crédibilité */}
        <View className="bg-white/10 rounded-full px-4 py-2">
          <Text className="text-white/70 text-sm">
            Vérifié RPPS · Contrat IA · 0 % commission
          </Text>
        </View>
      </Animated.View>

      {/* Boutons CTA */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(200)}
        className="w-full gap-3"
      >
        <Pressable
          className="h-14 bg-jim-primary rounded-xl items-center justify-center active:opacity-90"
          onPress={() => router.push('/(auth)/sign-up')}
          accessibilityRole="button"
          accessibilityLabel="Créer un compte"
        >
          <Text className="text-white font-semibold text-base">
            Créer un compte
          </Text>
        </Pressable>

        <Pressable
          className="h-14 bg-white/10 rounded-xl items-center justify-center active:opacity-80 border border-white/20"
          onPress={() => router.push('/(auth)/sign-in')}
          accessibilityRole="button"
          accessibilityLabel="Se connecter"
        >
          <Text className="text-white font-medium text-base">
            Se connecter
          </Text>
        </Pressable>

        <Text className="text-white/40 text-xs text-center mt-2">
          Réservé aux professionnels de santé vérifiés RPPS
        </Text>
      </Animated.View>
    </View>
  );
}
