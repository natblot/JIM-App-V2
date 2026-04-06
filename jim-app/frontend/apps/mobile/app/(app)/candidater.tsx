// apps/mobile/app/(app)/candidater.tsx
// Écran de candidature — Story 5.1 + 5.2
// Flow : [détail annonce] → [avertissement?] → [message optionnel] → [confirmation + UndoToast]
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { IncompatibilityWarning } from '@jim/ui';
import { supabase } from '../_layout';

const MAX_MESSAGE_LENGTH = 500;

export default function CandidaterScreen() {
  const { annonce_id, ville, date_debut, date_fin, retrocession } =
    useLocalSearchParams<{
      annonce_id: string;
      ville: string;
      date_debut: string;
      date_fin: string;
      retrocession: string;
    }>();

  const router = useRouter();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Incompatibilités simulées — à brancher sur la logique métier réelle
  const [warnings] = useState<Array<{ type: string; detail: string }>>([]);
  const [warningsAcknowledged, setWarningsAcknowledged] = useState(false);

  // Animation check de succès
  const checkScale = useSharedValue(0);
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const hasWarnings = warnings.length > 0 && !warningsAcknowledged;

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }

  async function handleSend(avecMessage: boolean) {
    setIsLoading(true);

    try {
      // Appel direct à la Edge Function — à remplacer par useCreateCandidature quand disponible
      const { error } = await supabase.functions.invoke('create-candidature', {
        body: {
          annonce_id: annonce_id,
          message: avecMessage ? message.trim() : null,
        },
      });

      if (error) throw error;

      // Animation check de succès — spring stiffness 300, damping 20
      checkScale.value = withSpring(1, { stiffness: 300, damping: 20 });
      setShowSuccess(true);

      // Revenir à la page détail avec paramètre de succès pour déclencher l'UndoToast
      setTimeout(() => {
        router.replace({
          pathname: '/(app)/annonce/[id]',
          params: {
            id: annonce_id,
            candidature_success: '1',
            candidature_ville: ville ?? '',
            candidature_dates: `${formatDate(date_debut ?? '')} - ${formatDate(date_fin ?? '')}`,
            candidature_retro: retrocession ?? '',
          },
        } as never);
      }, 600);
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-jim-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border flex-row items-center justify-between">
        <Text className="text-xl font-bold text-jim-text">Candidater</Text>
        <Pressable
          className="w-11 h-11 items-center justify-center rounded-full bg-jim-muted/10 active:opacity-70"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
        >
          <Text className="text-jim-muted text-lg">✕</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Résumé compact de l'annonce */}
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="bg-jim-surface border border-jim-border rounded-2xl p-4 gap-2"
        >
          <Text className="text-jim-text font-bold text-lg">{ville}</Text>
          <Text className="text-jim-muted text-sm">
            {formatDate(date_debut ?? '')} → {formatDate(date_fin ?? '')}
          </Text>
          <Text className="text-jim-primary font-bold text-xl">
            {retrocession}%{' '}
            <Text className="text-jim-muted text-sm font-normal">rétrocession</Text>
          </Text>
        </Animated.View>

        {/* Avertissement incompatibilité — non bloquant */}
        {hasWarnings && (
          <Animated.View entering={FadeInDown.duration(300).delay(100)}>
            <IncompatibilityWarning
              warnings={warnings}
              onContinue={() => setWarningsAcknowledged(true)}
              onCancel={() => router.back()}
            />
          </Animated.View>
        )}

        {/* Zone message optionnel — visible si pas d'avertissement ou si avertissement acquitté */}
        {!hasWarnings && (
          <Animated.View
            entering={FadeInDown.duration(300).delay(100)}
            className="gap-3"
          >
            <View className="gap-1">
              <Text className="text-jim-text font-semibold">
                Un message pour le titulaire ?{' '}
                <Text className="text-jim-muted font-normal">(optionnel)</Text>
              </Text>
              <Text className="text-jim-muted text-xs">
                Un message personnalisé augmente vos chances d'être retenu.
              </Text>
            </View>

            <View className="bg-jim-surface border border-jim-border rounded-2xl p-4">
              <TextInput
                className="text-jim-text text-sm leading-6 min-h-[100px]"
                multiline
                textAlignVertical="top"
                placeholder="Ex : 3 ans d'expérience en musculo, disponible toute la période"
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={(text) => {
                  if (text.length <= MAX_MESSAGE_LENGTH) setMessage(text);
                }}
                maxLength={MAX_MESSAGE_LENGTH}
                accessibilityLabel="Message optionnel pour le titulaire"
              />
              {/* Compteur */}
              <Text
                className={[
                  'text-xs text-right mt-2',
                  message.length >= MAX_MESSAGE_LENGTH - 20
                    ? 'text-jim-destructive'
                    : 'text-jim-muted',
                ].join(' ')}
              >
                {message.length} / {MAX_MESSAGE_LENGTH}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Overlay succès */}
        {showSuccess && (
          <View className="items-center py-4">
            <Animated.View
              style={checkStyle}
              className="w-16 h-16 rounded-full bg-jim-success/15 items-center justify-center"
            >
              <Text className="text-3xl">✓</Text>
            </Animated.View>
            <Text className="text-jim-success font-semibold mt-3">Candidature envoyée !</Text>
          </View>
        )}
      </ScrollView>

      {/* Actions sticky en bas */}
      {!hasWarnings && !showSuccess && (
        <View className="px-6 pb-10 pt-4 gap-3 border-t border-jim-border bg-jim-surface">
          {/* Bouton principal — visible si message rempli */}
          {message.trim().length > 0 && (
            <Pressable
              className={[
                'h-14 rounded-xl items-center justify-center',
                isLoading
                  ? 'bg-jim-primary/50'
                  : 'bg-jim-primary active:bg-jim-primary/90',
              ].join(' ')}
              onPress={() => handleSend(true)}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Envoyer la candidature avec message"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Envoyer avec message</Text>
              )}
            </Pressable>
          )}

          {/* Bouton secondaire — toujours disponible */}
          <Pressable
            className={[
              'h-12 rounded-xl border-2 border-jim-primary/30 items-center justify-center',
              isLoading ? 'opacity-50' : 'active:opacity-80',
            ].join(' ')}
            onPress={() => handleSend(false)}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Envoyer la candidature sans message"
          >
            {isLoading && message.trim().length === 0 ? (
              <ActivityIndicator color="#3B82F6" />
            ) : (
              <Text className="text-jim-primary font-medium">
                {message.trim().length > 0 ? 'Envoyer sans message' : 'Envoyer la candidature'}
              </Text>
            )}
          </Pressable>

          {/* Lien annuler */}
          <Pressable
            className="h-11 items-center justify-center active:opacity-60"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Annuler et revenir"
          >
            <Text className="text-jim-muted text-sm">Annuler</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
