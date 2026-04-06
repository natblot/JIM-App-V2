// Ecran Parametres > RGPD — Export + Suppression — Epic 10, Stories 10.1 + 10.2
import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  useExportData,
  useDeleteAccount,
  useDeletionStatus,
  useAuthStore,
} from '@jim/shared';
import { supabase } from '../../_layout';

export default function RgpdScreen() {
  const { user } = useAuthStore();
  const exportData = useExportData(supabase);
  const deleteAccount = useDeleteAccount(supabase);
  const { data: deletionStatus } = useDeletionStatus(supabase, user?.id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleExport = useCallback(() => {
    exportData.mutate(undefined, {
      onSuccess: (result) => {
        if (result.download_url) {
          Alert.alert(
            'Export pret',
            'Votre export est disponible. Le lien expire dans 48h.',
            [
              { text: 'Telecharger', onPress: () => void Linking.openURL(result.download_url) },
              { text: 'Plus tard', style: 'cancel' },
            ],
          );
        }
      },
      onError: (err) => {
        if (err.message.includes('429') || err.message.includes('RATE_LIMITED')) {
          Alert.alert('Export indisponible', 'Un seul export par jour — vous en avez deja demande un aujourd\'hui.');
        } else {
          Alert.alert('Erreur', err.message);
        }
      },
    });
  }, [exportData]);

  const handleDelete = useCallback(() => {
    if (confirmText !== 'SUPPRIMER') {
      Alert.alert('Confirmation requise', 'Tapez SUPPRIMER pour confirmer.');
      return;
    }
    deleteAccount.mutate('SUPPRIMER', {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        Alert.alert(
          'Suppression planifiee',
          'Votre compte sera supprime dans 30 jours. Vous avez recu un email pour annuler.',
        );
      },
      onError: (err) => Alert.alert('Erreur', err.message),
    });
  }, [confirmText, deleteAccount]);

  return (
    <ScrollView className="flex-1 bg-jim-background">
      <Animated.View entering={FadeInDown.duration(400)} className="p-4">
        <Text className="text-xl font-bold text-jim-text mb-2">Vos donnees personnelles</Text>
        <Text className="text-jim-muted text-sm mb-6">
          JIM respecte votre vie privee. Vous pouvez a tout moment exporter ou supprimer vos donnees.
        </Text>

        {/* Suppression en cours */}
        {deletionStatus && (
          <View className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-4 mb-4">
            <Text className="text-jim-destructive font-medium mb-1">Suppression planifiee</Text>
            <Text className="text-jim-destructive/80 text-sm">
              Votre compte sera supprime le{' '}
              {new Date(deletionStatus.scheduled_at).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}.
              Consultez votre email pour annuler.
            </Text>
          </View>
        )}

        {/* Export */}
        <Pressable
          className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-3 min-h-[44px]"
          onPress={handleExport}
          disabled={exportData.isPending}
          accessibilityRole="button"
          accessibilityLabel="Exporter mes donnees"
        >
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-jim-text font-medium">Exporter mes donnees</Text>
              <Text className="text-jim-muted text-xs mt-0.5">
                Telechargez toutes vos donnees au format JSON
              </Text>
            </View>
            {exportData.isPending && <ActivityIndicator size="small" color="#3B82F6" />}
          </View>
        </Pressable>

        {/* Suppression */}
        {!showDeleteConfirm ? (
          <Pressable
            className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-6 min-h-[44px]"
            onPress={() => setShowDeleteConfirm(true)}
            disabled={Boolean(deletionStatus)}
            accessibilityRole="button"
            accessibilityLabel="Supprimer mon compte"
          >
            <Text className="text-jim-destructive font-medium">Supprimer mon compte</Text>
            <Text className="text-jim-muted text-xs mt-0.5">
              Suppression definitive sous 30 jours — annulable
            </Text>
          </Pressable>
        ) : (
          <Animated.View entering={FadeInDown.duration(300)} className="bg-jim-surface border border-jim-destructive/30 rounded-xl p-4 mb-6">
            <Text className="text-jim-text font-semibold mb-3">
              Etes-vous sur de vouloir supprimer votre compte ?
            </Text>
            <View className="mb-3">
              <Text className="text-jim-muted text-xs mb-1">• Vos donnees personnelles seront definitivement supprimees</Text>
              <Text className="text-jim-muted text-xs mb-1">• Vos annonces pourvues seront anonymisees</Text>
              <Text className="text-jim-muted text-xs mb-1">• L'historique de paiements sera conserve 6 ans (obligation fiscale)</Text>
              <Text className="text-jim-muted text-xs">• Cette action est irreversible apres 30 jours</Text>
            </View>
            <Text className="text-jim-text text-sm font-medium mb-2">
              Tapez SUPPRIMER pour confirmer
            </Text>
            <TextInput
              className="bg-jim-background border border-jim-border rounded-lg px-3 py-2 text-jim-text mb-3"
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="SUPPRIMER"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              accessibilityLabel="Confirmation de suppression"
            />
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 border border-jim-border rounded-lg py-3 min-h-[44px] justify-center"
                onPress={() => { setShowDeleteConfirm(false); setConfirmText(''); }}
              >
                <Text className="text-center text-jim-text text-sm">Annuler</Text>
              </Pressable>
              <Pressable
                className={`flex-1 rounded-lg py-3 min-h-[44px] justify-center ${
                  confirmText === 'SUPPRIMER' ? 'bg-jim-destructive' : 'bg-jim-muted/30'
                }`}
                onPress={handleDelete}
                disabled={confirmText !== 'SUPPRIMER' || deleteAccount.isPending}
              >
                {deleteAccount.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className={`text-center font-semibold text-sm ${
                    confirmText === 'SUPPRIMER' ? 'text-white' : 'text-jim-muted'
                  }`}>
                    Confirmer
                  </Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Liens */}
        <View className="border-t border-jim-border pt-4">
          <Pressable className="py-3 min-h-[44px] justify-center" accessibilityRole="link">
            <Text className="text-jim-primary text-sm">Politique de confidentialite</Text>
          </Pressable>
          <Pressable className="py-3 min-h-[44px] justify-center" accessibilityRole="link">
            <Text className="text-jim-primary text-sm">Conditions d'utilisation</Text>
          </Pressable>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
