import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@jim/shared';
import { supabase } from '../_layout';

// Version courante des CGU — à incrémenter lors de chaque mise à jour
const CURRENT_CGU_VERSION = 1;

// Layout du groupe app — protégé par authentification + vérification version CGU
export default function AppLayout() {
  const { user, isInitialized } = useAuthStore();
  const [cguOutdated, setCguOutdated] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  // Vérifier si la version CGU de l'utilisateur est à jour
  useEffect(() => {
    if (!user) return;

    const checkCguVersion = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('cgu_version')
        .eq('user_id', user.id)
        .single();

      if (data && data.cgu_version < CURRENT_CGU_VERSION) {
        setCguOutdated(true);
      }
    };

    void checkCguVersion();
  }, [user]);

  // Accepter la nouvelle version des CGU
  const handleAcceptCgu = async () => {
    if (!user) return;
    setIsAccepting(true);

    await supabase
      .from('profiles')
      .update({
        cgu_version: CURRENT_CGU_VERSION,
        cgu_accepted_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    setIsAccepting(false);
    setCguOutdated(false);
  };

  // Attendre l'initialisation de l'auth avant de décider
  if (!isInitialized) return null;

  // Rediriger vers l'accueil auth si non connecté
  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="recherche" />
        <Stack.Screen name="profile-edit" />
        <Stack.Screen name="push-permission" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="publier" />
        <Stack.Screen name="mes-annonces" />
        <Stack.Screen name="annonce/[id]" />
        {/* Epic 5 — candidatures & favoris */}
        <Stack.Screen name="candidater" options={{ presentation: 'modal' }} />
        <Stack.Screen name="mes-candidatures" />
        <Stack.Screen name="favoris" />
        {/* Epic 6 — messagerie intégrée */}
        <Stack.Screen name="messages" />
        <Stack.Screen name="conversations/[id]" />
        <Stack.Screen name="profil-contact/[userId]" />
        {/* Epic 7 — notifications & calendrier */}
        <Stack.Screen name="parametres/notifications" />
        <Stack.Screen name="calendrier" />
        {/* Epic 8 — contrats IA */}
        <Stack.Screen name="contrats/[candidatureId]" />
        <Stack.Screen name="contrats/pdf/[contratId]" />
      </Stack>

      {/* Bandeau de re-acceptation CGU — Story 1.10 */}
      <Modal
        visible={cguOutdated}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          /* Intentionnellement bloquant — re-acceptation obligatoire */
        }}
      >
        <View className="flex-1 bg-jim-background">
          {/* En-tête */}
          <View className="px-6 pt-14 pb-6 bg-jim-surface border-b border-jim-border">
            <Text className="text-2xl font-bold text-jim-text">
              Mise à jour de nos CGU
            </Text>
            <Text className="text-jim-muted mt-2 leading-5">
              Nos Conditions Générales d'Utilisation ont été mises à jour.
              Merci de les lire et de les accepter pour continuer à utiliser JIM.
            </Text>
          </View>

          {/* Résumé des changements */}
          <ScrollView
            className="flex-1 px-6 py-6"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4">
              <View className="p-4 bg-jim-accent/10 rounded-xl border border-jim-accent/30">
                <Text className="font-semibold text-jim-text mb-2">
                  Principaux changements
                </Text>
                <Text className="text-jim-muted text-sm leading-6">
                  Version {CURRENT_CGU_VERSION} — les conditions initiales
                  régissant l'utilisation de la plateforme JIM pour les
                  kinésithérapeutes professionnels.
                </Text>
              </View>

              <Text className="text-jim-muted text-sm leading-6">
                En continuant à utiliser JIM, vous acceptez les nouvelles
                Conditions Générales d'Utilisation et la Politique de
                confidentialité mise à jour, conformément au RGPD.
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View className="px-6 pb-10 pt-4 gap-3 border-t border-jim-border bg-jim-surface">
            <Pressable
              className={`h-14 rounded-xl items-center justify-center
                ${isAccepting ? 'bg-jim-primary/50' : 'bg-jim-primary active:bg-jim-primary/90'}`}
              onPress={handleAcceptCgu}
              disabled={isAccepting}
              accessibilityRole="button"
              accessibilityLabel="Accepter les nouvelles CGU"
            >
              {isAccepting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  J'accepte les nouvelles CGU
                </Text>
              )}
            </Pressable>
            <Text className="text-jim-muted text-xs text-center leading-4">
              En cas de refus, votre accès sera suspendu jusqu'à acceptation.
              Contactez support@jim-app.fr si vous avez des questions.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
