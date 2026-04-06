// Écran préférences notifications — Epic 7, Story 7.x
// 3 toggles catégories + pause globale + info digest email
import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { TogglePreference } from '@jim/ui';

// ---------------------------------------------------------------------------
// Hook placeholder — sera remplacé par l'implémentation frontend-developer
// qui lira/écrira notification_preferences dans Supabase
// ---------------------------------------------------------------------------
interface NotificationPreferences {
  push_paused: boolean;
  push_annonces: boolean;
  push_candidatures: boolean;
  push_messages: boolean;
}

function useNotificationPreferences() {
  // État local de substitution en attendant le hook Supabase
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    push_paused: false,
    push_annonces: true,
    push_candidatures: true,
    push_messages: true,
  });

  const updatePref = (key: keyof NotificationPreferences, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  return { prefs, updatePref };
}
// ---------------------------------------------------------------------------

export default function NotificationsScreen() {
  const router = useRouter();
  const { prefs, updatePref } = useNotificationPreferences();

  // Toutes les catégories désactivées → digest email activé automatiquement
  const allCategoriesOff =
    prefs.push_paused ||
    (!prefs.push_annonces && !prefs.push_candidatures && !prefs.push_messages);

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête avec bouton retour */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        className="flex-row items-center px-4 pt-14 pb-4 bg-jim-surface border-b border-jim-border"
      >
        <Pressable
          className="w-11 h-11 items-center justify-center rounded-xl active:bg-jim-background mr-2"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour aux paramètres"
        >
          <Text className="text-jim-primary text-lg font-medium">←</Text>
        </Pressable>
        <Text className="text-xl font-bold text-jim-text">Notifications</Text>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Bandeau pause globale active */}
        {prefs.push_paused && (
          <Animated.View
            entering={FadeIn.duration(250)}
            className="mx-4 mt-4 px-4 py-3 bg-jim-accent/10 border border-jim-accent/30 rounded-xl"
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <Text className="text-orange-600 font-semibold text-sm">
              Toutes les notifications sont en pause.
            </Text>
          </Animated.View>
        )}

        {/* Section : Pause globale */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(60)}
          className="mx-4 mt-4 bg-jim-surface border border-jim-border rounded-xl overflow-hidden"
        >
          <Text className="text-jim-muted text-xs font-semibold uppercase tracking-wider px-4 pt-4 pb-2">
            Global
          </Text>
          <TogglePreference
            icon="🔕"
            title="Pause notifications"
            description="Suspendre toutes les notifications push"
            value={prefs.push_paused}
            onToggle={(v) => updatePref('push_paused', v)}
          />
        </Animated.View>

        {/* Section : Catégories */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(120)}
          className="mx-4 mt-4 bg-jim-surface border border-jim-border rounded-xl overflow-hidden"
        >
          <Text className="text-jim-muted text-xs font-semibold uppercase tracking-wider px-4 pt-4 pb-2">
            Catégories
          </Text>

          <TogglePreference
            icon="📍"
            title="Annonces"
            description="Nouvelles annonces dans votre zone"
            value={prefs.push_annonces}
            onToggle={(v) => updatePref('push_annonces', v)}
            disabled={prefs.push_paused}
          />
          <TogglePreference
            icon="👤"
            title="Candidatures"
            description="Réponses à vos candidatures"
            value={prefs.push_candidatures}
            onToggle={(v) => updatePref('push_candidatures', v)}
            disabled={prefs.push_paused}
          />
          <TogglePreference
            icon="💬"
            title="Messages"
            description="Nouveaux messages reçus"
            value={prefs.push_messages}
            onToggle={(v) => updatePref('push_messages', v)}
            disabled={prefs.push_paused}
          />
        </Animated.View>

        {/* Info digest email — visible si toutes les notifications sont coupées */}
        {allCategoriesOff && (
          <Animated.View
            entering={FadeIn.duration(350)}
            className="mx-4 mt-4 px-4 py-4 bg-jim-accent/10 border border-jim-accent/30 rounded-xl"
            accessibilityRole="note"
          >
            <Text className="text-jim-muted text-sm leading-5">
              Un résumé hebdomadaire par email sera envoyé automatiquement pour
              que vous ne manquiez aucune opportunité.
            </Text>
          </Animated.View>
        )}

        {/* Espace bas de page */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
