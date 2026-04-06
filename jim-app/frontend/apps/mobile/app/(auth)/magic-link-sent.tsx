import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useMagicLink } from '@jim/shared';
import { supabase } from '../_layout';

// Écran de confirmation envoi magic link
// Hero moment : rassurer l'utilisateur que le lien est en route
export default function MagicLinkSentScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const magicLink = useMagicLink(supabase);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    try {
      await magicLink.mutateAsync({ email });
      setResent(true);
      // Réinitialiser le message de confirmation après 5 secondes
      setTimeout(() => setResent(false), 5000);
    } catch {
      // Erreur exposée via magicLink.error
    }
  };

  return (
    <View className="flex-1 bg-jim-background items-center justify-center px-6">
      {/* Icône email animée — hero moment */}
      <Animated.View entering={ZoomIn.duration(600).springify()} className="mb-8">
        <View
          className="w-24 h-24 bg-jim-primary/10 rounded-full items-center justify-center border-2 border-jim-primary/30"
          accessibilityLabel="Icône email"
          accessibilityRole="image"
        >
          <Text className="text-5xl" aria-hidden>📧</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(300)}
        className="items-center gap-3"
      >
        <Text className="text-2xl font-bold text-jim-text text-center">
          Vérifiez votre email
        </Text>

        <Text className="text-jim-muted text-center leading-6 max-w-sm">
          On a envoyé un lien de connexion à{'\n'}
          <Text className="text-jim-text font-medium">{email}</Text>
        </Text>

        {/* Encadré durée de validité */}
        <View className="bg-jim-primary/10 rounded-xl p-4 border border-jim-primary/20 mt-2 w-full max-w-sm">
          <Text className="text-jim-muted text-sm text-center leading-5">
            Le lien est valable{' '}
            <Text className="text-jim-primary font-medium">6 heures</Text>{' '}
            — vous pouvez le cliquer entre deux patients.
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(500)}
        className="mt-10 w-full max-w-sm gap-3"
      >
        {/* Bouton renvoyer */}
        <Pressable
          className={`h-14 rounded-xl items-center justify-center border border-jim-primary
            ${magicLink.isPending || resent ? 'opacity-50' : 'active:bg-jim-primary/10'}`}
          onPress={handleResend}
          disabled={magicLink.isPending || resent}
          accessibilityRole="button"
          accessibilityLabel={
            resent
              ? 'Lien renvoyé avec succès'
              : 'Renvoyer un lien de connexion'
          }
          accessibilityState={{ disabled: magicLink.isPending || resent }}
        >
          <Text className="text-jim-primary font-medium text-base">
            {resent ? '✓ Lien renvoyé' : 'Renvoyer un nouveau lien'}
          </Text>
        </Pressable>

        {/* Erreur renvoi */}
        {magicLink.error && (
          <View className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-3">
            <Text className="text-jim-destructive text-sm text-center">
              {magicLink.error.message}
            </Text>
          </View>
        )}

        {/* Retour */}
        <Pressable
          className="h-12 items-center justify-center"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour à la connexion"
        >
          <Text className="text-jim-muted text-sm">
            ← Retour à la connexion
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
