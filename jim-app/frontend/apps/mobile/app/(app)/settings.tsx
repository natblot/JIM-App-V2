import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSignOut, useAuthStore } from '@jim/shared';
import { supabase } from '../_layout';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const signOut = useSignOut(supabase);

  const handleSignOutAll = () => {
    Alert.alert(
      'Déconnecter tous les appareils',
      'Vous allez être déconnecté de tous vos appareils. Cette action révoque tous vos tokens de session.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter tout',
          style: 'destructive',
          onPress: async () => {
            try {
              // scope 'global' = révoque tous les refresh tokens (FR7)
              await signOut.mutateAsync('global');
              router.replace('/(auth)/welcome');
            } catch {
              Alert.alert('Erreur', 'Déconnexion impossible. Réessayez.');
            }
          },
        },
      ]
    );
  };

  const handleSignOutLocal = async () => {
    try {
      await signOut.mutateAsync('local');
      router.replace('/(auth)/welcome');
    } catch {
      Alert.alert('Erreur', 'Déconnexion impossible. Réessayez.');
    }
  };

  const sections = [
    {
      title: 'Compte',
      items: [
        {
          label: 'Mon profil',
          description: 'Spécialités, zone, photo',
          emoji: '👤',
          onPress: () => router.push('/(app)/profile-edit'),
          destructive: false,
        },
        {
          label: 'Notifications',
          description: 'Gérer mes préférences',
          emoji: '🔔',
          onPress: () => router.push('/(app)/parametres/notifications'),
          destructive: false,
        },
        {
          label: 'Disponibilités',
          description: 'Mon calendrier de disponibilités',
          emoji: '📅',
          onPress: () => router.push('/(app)/calendrier'),
          destructive: false,
        },
      ],
    },
    {
      title: 'Sécurité',
      items: [
        {
          label: 'Se déconnecter',
          description: 'Cet appareil uniquement',
          emoji: '↪️',
          onPress: handleSignOutLocal,
          destructive: false,
        },
        {
          label: 'Déconnecter tous les appareils',
          description: 'Révoque toutes les sessions actives',
          emoji: '🔒',
          onPress: handleSignOutAll,
          destructive: true,
        },
      ],
    },
    {
      title: 'À propos',
      items: [
        {
          label: "Conditions d'utilisation",
          description: 'CGU JIM',
          emoji: '📄',
          onPress: () => { /* Ouvrir URL CGU */ },
          destructive: false,
        },
        {
          label: 'Politique de confidentialité',
          description: 'RGPD & données',
          emoji: '🛡️',
          onPress: () => { /* Ouvrir URL politique */ },
          destructive: false,
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="px-6 pt-16 pb-4">
        <Text className="text-2xl font-bold text-jim-text">Paramètres</Text>
        <Text className="text-jim-muted text-sm mt-1">{user?.email}</Text>
      </Animated.View>

      {sections.map((section, sIndex) => (
        <Animated.View
          key={section.title}
          entering={FadeInDown.duration(400).delay(50 + sIndex * 60)}
          className="px-6 mb-6"
        >
          <Text className="text-jim-muted text-xs font-semibold uppercase tracking-wider mb-2">
            {section.title}
          </Text>
          <View className="bg-jim-surface border border-jim-border rounded-xl overflow-hidden">
            {section.items.map((item, iIndex) => (
              <View key={item.label}>
                {iIndex > 0 && <View className="h-px bg-jim-border mx-4" />}
                <Pressable
                  className="flex-row items-center px-4 py-3.5 active:bg-jim-background min-h-[52px]"
                  onPress={item.onPress}
                  disabled={signOut.isPending}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Text className="text-xl w-8">{item.emoji}</Text>
                  <View className="flex-1 ml-2">
                    <Text className={`font-medium text-sm ${item.destructive ? 'text-jim-destructive' : 'text-jim-text'}`}>
                      {item.label}
                    </Text>
                    <Text className="text-jim-muted text-xs">{item.description}</Text>
                  </View>
                  {signOut.isPending && item.label.includes('Déconnecter') ? (
                    <ActivityIndicator size="small" color="#8892A4" />
                  ) : (
                    <Text className="text-jim-muted text-lg">›</Text>
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        </Animated.View>
      ))}

      {/* Version */}
      <View className="items-center mt-auto pb-8">
        <Text className="text-jim-muted text-xs">JIM v1.0.0 · Fait par un kiné, pour les kinés</Text>
      </View>
    </View>
  );
}
