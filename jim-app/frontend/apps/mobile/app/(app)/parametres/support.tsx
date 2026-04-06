// Ecran Support — Epic 12, Story 12.5
import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useCreateSupportTicket, useMesTickets, useAuthStore } from '@jim/shared';
import { supabase } from '../../_layout';
import Constants from 'expo-constants';

const CATEGORIES = [
  { value: 'bug', label: 'Bug' },
  { value: 'question', label: 'Question' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'partenariat', label: 'Partenariat' },
];

export default function SupportScreen() {
  const { user } = useAuthStore();
  const createTicket = useCreateSupportTicket(supabase);
  const { data: tickets } = useMesTickets(supabase, user?.id);

  const [categorie, setCategorie] = useState('bug');
  const [sujet, setSujet] = useState('');
  const [description, setDescription] = useState('');

  const appVersion = Constants.expoConfig?.version ?? '?';
  const deviceInfo = `${Platform.OS} ${Platform.Version}`;

  const handleSubmit = useCallback(() => {
    if (!sujet.trim() || !description.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir le sujet et la description.');
      return;
    }
    createTicket.mutate(
      { categorie, sujet, description, appVersion, deviceModel: Platform.OS, osVersion: String(Platform.Version) },
      {
        onSuccess: () => {
          Alert.alert('Envoye', 'On vous repond sous 48h.');
          setSujet(''); setDescription('');
        },
        onError: (err) => Alert.alert('Erreur', err.message),
      },
    );
  }, [categorie, sujet, description, createTicket]);

  return (
    <ScrollView className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="p-4">
        <Text className="text-xl font-bold text-jim-text mb-2">Aide & Support</Text>
        <Text className="text-jim-muted text-xs mb-4">v{appVersion} · {deviceInfo}</Text>

        {/* Formulaire */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-jim-text mb-2">Categorie</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {CATEGORIES.map(c => (
              <Pressable key={c.value}
                className={`px-3 py-2 rounded-lg border min-h-[44px] justify-center ${categorie === c.value ? 'bg-jim-primary/10 border-jim-primary' : 'bg-jim-surface border-jim-border'}`}
                onPress={() => setCategorie(c.value)}>
                <Text className={`text-sm ${categorie === c.value ? 'text-jim-primary font-medium' : 'text-jim-text'}`}>{c.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-sm font-medium text-jim-text mb-1">Sujet</Text>
          <TextInput className="bg-jim-surface border border-jim-border rounded-lg px-3 py-2 text-jim-text mb-3"
            value={sujet} onChangeText={setSujet} placeholder="Decrivez brievement" maxLength={200} />

          <Text className="text-sm font-medium text-jim-text mb-1">Description</Text>
          <TextInput className="bg-jim-surface border border-jim-border rounded-lg px-3 py-2 text-jim-text mb-4 min-h-[100px]"
            value={description} onChangeText={setDescription} placeholder="Detaillez votre demande"
            multiline maxLength={2000} textAlignVertical="top" />
        </View>

        <Pressable className={`rounded-xl py-4 min-h-[44px] justify-center mb-6 ${createTicket.isPending ? 'bg-jim-muted/30' : 'bg-jim-primary'}`}
          onPress={handleSubmit} disabled={createTicket.isPending}>
          {createTicket.isPending ? <ActivityIndicator color="#fff" /> : <Text className="text-center text-white font-semibold">Envoyer</Text>}
        </Pressable>

        {/* Historique */}
        {(tickets?.length ?? 0) > 0 && (
          <View>
            <Text className="text-sm font-semibold text-jim-text mb-3">Mes demandes</Text>
            {tickets?.map(t => (
              <View key={t.id} className="bg-jim-surface border border-jim-border rounded-xl p-3 mb-2">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm font-medium text-jim-text">{t.sujet}</Text>
                  <Text className="text-xs text-jim-muted">{t.status}</Text>
                </View>
                <Text className="text-xs text-jim-muted">{new Date(t.created_at).toLocaleDateString('fr-FR')}</Text>
                {t.reponse && <Text className="text-sm text-jim-success mt-2">{t.reponse}</Text>}
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}
