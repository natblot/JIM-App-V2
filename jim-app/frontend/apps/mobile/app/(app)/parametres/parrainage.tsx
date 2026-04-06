// Ecran Parametres > Parrainage — Epic 11, Story 11.3
import { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Share, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AmbassadeurBadge } from '@jim/ui';
import { useParrainageCode, useGenerateParrainageCode, useParrainages, useAuthStore } from '@jim/shared';
import { supabase } from '../../_layout';

export default function ParrainageScreen() {
  const { user } = useAuthStore();
  const { data: code, isLoading } = useParrainageCode(supabase, user?.id);
  const generateCode = useGenerateParrainageCode(supabase);
  const { data: parrainages } = useParrainages(supabase, user?.id);

  const nbTotal = parrainages?.length ?? 0;
  const nbActifs = parrainages?.filter((p) => p.status === 'actif').length ?? 0;
  const isAmbassadeur = nbActifs > 0;

  const displayCode = code ?? 'Generer votre code';

  const handleShare = useCallback(async () => {
    const shareCode = code ?? (await generateCode.mutateAsync());
    try {
      await Share.share({
        message: `Rejoins JIM, la plateforme des kinesitherapeutes ! Utilise mon code ${shareCode} a l'inscription. https://jim.app/inscription?code=${shareCode}`,
      });
    } catch {
      // L'utilisateur a annule le partage
    }
  }, [code, generateCode]);

  const handleCopy = useCallback(async () => {
    const copyCode = code ?? (await generateCode.mutateAsync());
    // expo-clipboard serait ideal ici, fallback via Share
    Alert.alert('Code copie', copyCode);
  }, [code, generateCode]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-jim-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="p-4">
        <View className="items-center mb-6">
          {isAmbassadeur && <AmbassadeurBadge className="mb-3" />}
          <Text className="text-xl font-bold text-jim-text">Parrainage</Text>
          <Text className="text-jim-muted text-sm mt-1 text-center">
            Invitez vos confreres — ils decouvrent JIM, vous obtenez le badge Ambassadeur
          </Text>
        </View>

        {/* Code parrainage */}
        <Pressable
          className="bg-jim-surface border-2 border-dashed border-jim-primary/30 rounded-xl p-6 mb-4 items-center"
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copier le code parrainage"
        >
          <Text className="text-jim-muted text-xs mb-2">Votre code parrainage</Text>
          <Text className="text-2xl font-bold text-jim-primary tracking-widest">
            {displayCode}
          </Text>
        </Pressable>

        {/* Bouton partage */}
        <Pressable
          className="bg-jim-primary rounded-xl py-4 mb-6 min-h-[44px] justify-center"
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Partager le code"
        >
          <Text className="text-center text-white font-semibold">Partager</Text>
        </Pressable>

        {/* Compteur */}
        <View className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-4">
          <Text className="text-jim-text font-medium mb-2">Vos parrainages</Text>
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-jim-text">{nbTotal}</Text>
              <Text className="text-jim-muted text-xs">Parraines</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-jim-success">{nbActifs}</Text>
              <Text className="text-jim-muted text-xs">Actifs</Text>
            </View>
          </View>
        </View>

        {!isAmbassadeur && nbTotal > 0 && (
          <Text className="text-jim-muted text-xs text-center">
            Le badge Ambassadeur s'active quand votre filleul complete sa premiere action sur JIM.
          </Text>
        )}
      </Animated.View>
    </ScrollView>
  );
}
