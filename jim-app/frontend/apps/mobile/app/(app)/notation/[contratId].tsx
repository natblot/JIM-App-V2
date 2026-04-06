// Ecran notation post-remplacement — Epic 11, Story 11.1
// 3 taps : etoiles → tag → confirmer
import { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StarRating } from '@jim/ui';
import { useCreateAvis } from '@jim/shared';
import type { AvisTag } from '@jim/shared';
import { supabase } from '../../_layout';

const TAGS: { value: AvisTag; label: string }[] = [
  { value: 'ponctuel', label: 'Ponctuel' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'recommande', label: 'Recommande' },
  { value: 'bonne_communication', label: 'Bonne communication' },
];

export default function NotationScreen() {
  const { contratId } = useLocalSearchParams<{ contratId: string }>();
  const router = useRouter();
  const createAvis = useCreateAvis(supabase);

  const [note, setNote] = useState(0);
  const [selectedTags, setSelectedTags] = useState<AvisTag[]>([]);

  const toggleTag = useCallback((tag: AvisTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleConfirm = useCallback(() => {
    if (note === 0) { Alert.alert('Note requise', 'Selectionnez une note de 1 a 5 etoiles.'); return; }

    createAvis.mutate(
      { contratId: contratId ?? '', note, tags: selectedTags },
      {
        onSuccess: () => {
          Alert.alert('Merci !', 'Votre avis a ete enregistre. Il sera anonyme pendant 7 jours.');
          router.back();
        },
        onError: (err) => {
          if (err.message.includes('ALREADY_RATED')) {
            Alert.alert('Deja note', 'Vous avez deja note ce remplacement.');
          } else {
            Alert.alert('Erreur', err.message);
          }
        },
      },
    );
  }, [note, selectedTags, contratId, createAvis, router]);

  return (
    <ScrollView className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="p-6 items-center">
        <Text className="text-xl font-bold text-jim-text mb-2 text-center">
          Comment s'est passe le remplacement ?
        </Text>
        <Text className="text-jim-muted text-sm mb-8 text-center">
          Votre avis sera anonyme pendant 7 jours
        </Text>

        {/* Etoiles */}
        <StarRating value={note} onChange={setNote} size="lg" className="mb-8" />

        {/* Tags */}
        <View className="flex-row flex-wrap justify-center gap-3 mb-8">
          {TAGS.map((tag) => {
            const selected = selectedTags.includes(tag.value);
            return (
              <Pressable
                key={tag.value}
                className={`rounded-full px-4 py-2.5 border min-h-[44px] justify-center ${
                  selected ? 'bg-jim-primary/10 border-jim-primary' : 'bg-jim-surface border-jim-border'
                }`}
                onPress={() => toggleTag(tag.value)}
                accessibilityRole="button"
                accessibilityLabel={tag.label}
                accessibilityState={{ selected }}
              >
                <Text className={`text-sm font-medium ${selected ? 'text-jim-primary' : 'text-jim-text'}`}>
                  {tag.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Confirmer */}
        <Pressable
          className={`w-full rounded-xl py-4 min-h-[44px] justify-center ${
            note > 0 && !createAvis.isPending ? 'bg-jim-primary' : 'bg-jim-muted/30'
          }`}
          onPress={handleConfirm}
          disabled={note === 0 || createAvis.isPending}
          accessibilityRole="button"
          accessibilityLabel="Confirmer la notation"
        >
          <Text className={`text-center font-semibold ${note > 0 ? 'text-white' : 'text-jim-muted'}`}>
            Confirmer
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}
