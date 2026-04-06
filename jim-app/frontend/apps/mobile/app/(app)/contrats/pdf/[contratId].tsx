// Écran téléchargement PDF du contrat — Epic 8
// Génère le PDF via expo-print (HTML → PDF natif) puis partage via expo-sharing
import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { generateContratHtml } from '@jim/shared';
import type { Contrat } from '@jim/shared';
import { supabase } from '../../../_layout';

// Génère le fichier PDF et retourne son URI local (chemin temporaire)
async function buildPdfUri(contrat: Contrat): Promise<string> {
  const html = generateContratHtml(contrat);
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });
  return uri;
}

export default function ContratPdfScreen() {
  const { contratId } = useLocalSearchParams<{ contratId: string }>();
  const router = useRouter();

  // On charge le contrat par son id — on réutilise useContrat via candidature_id
  // Ici on n'a que contratId, donc on fait une requête directe minimaliste via un hook dédié
  // Pour éviter de créer un hook supplémentaire on passe par une requête Supabase locale
  const [contrat, setContrat] = useState<Contrat | null>(null);
  const [isLoadingContrat, setIsLoadingContrat] = useState(true);

  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Chargement du contrat par son id
  useEffect(() => {
    if (!contratId) return;

    const load = async () => {
      setIsLoadingContrat(true);
      const { data, error } = await supabase
        .from('contrats')
        .select('*')
        .eq('id', contratId)
        .maybeSingle();

      if (error || !data) {
        Alert.alert('Erreur', 'Impossible de charger le contrat.');
        router.back();
        return;
      }

      setContrat(data as Contrat);
      setIsLoadingContrat(false);
    };

    void load();
  }, [contratId, router]);

  // Génération automatique du PDF dès que le contrat est chargé
  useEffect(() => {
    if (!contrat || pdfUri) return;

    const generate = async () => {
      setIsGenerating(true);
      try {
        const uri = await buildPdfUri(contrat);
        setPdfUri(uri);
      } catch {
        Alert.alert(
          'Erreur PDF',
          'La génération du PDF a échoué. Vérifie que ton appareil dispose de suffisamment d\'espace.'
        );
      } finally {
        setIsGenerating(false);
      }
    };

    void generate();
  }, [contrat, pdfUri]);

  // Partage / enregistrement du PDF via expo-sharing
  const handleShare = useCallback(async () => {
    if (!pdfUri) return;

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Partage indisponible',
        'Le partage de fichiers n\'est pas disponible sur cet appareil.'
      );
      return;
    }

    setIsSharing(true);
    try {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Contrat de remplacement — JIM',
        UTI: 'com.adobe.pdf',
      });
    } catch {
      // L'utilisateur a peut-être annulé — pas d'alerte nécessaire
    } finally {
      setIsSharing(false);
    }
  }, [pdfUri]);

  // Régénération manuelle du PDF
  const handleRegenerate = useCallback(async () => {
    if (!contrat) return;
    setPdfUri(null);
    setIsGenerating(true);
    try {
      const uri = await buildPdfUri(contrat);
      setPdfUri(uri);
    } catch {
      Alert.alert('Erreur', 'La régénération du PDF a échoué.');
    } finally {
      setIsGenerating(false);
    }
  }, [contrat]);

  const isLoading = isLoadingContrat || isGenerating;

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <Pressable
          className="w-11 h-11 items-center justify-center mb-2"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text className="text-jim-primary text-2xl">‹</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-jim-text">Télécharger le PDF</Text>
        {contrat && (
          <Text className="text-jim-muted text-sm mt-1">
            Contrat #{contrat.id.slice(0, 8).toUpperCase()}
          </Text>
        )}
      </View>

      {/* Corps */}
      <View className="flex-1 items-center justify-center px-6 gap-6">
        {isLoading ? (
          // État : génération en cours
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="items-center gap-4"
          >
            <View className="w-20 h-20 rounded-full bg-jim-primary/10 items-center justify-center">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
            <Text className="text-jim-text font-semibold text-lg text-center">
              {isLoadingContrat ? 'Chargement du contrat…' : 'Génération du PDF en cours…'}
            </Text>
            <Text className="text-jim-muted text-sm text-center leading-6">
              {isLoadingContrat
                ? 'Récupération des données du contrat…'
                : 'Mise en forme du document, ça prend quelques secondes.'}
            </Text>
          </Animated.View>
        ) : pdfUri ? (
          // État : PDF prêt
          <Animated.View
            entering={FadeInDown.duration(400)}
            className="items-center gap-4 w-full"
          >
            <View
              className="w-20 h-20 rounded-full bg-jim-success/10 items-center justify-center"
              accessibilityLabel="PDF prêt"
            >
              <Text className="text-4xl">✓</Text>
            </View>
            <Text className="text-jim-text font-bold text-xl text-center">PDF prêt !</Text>
            <Text className="text-jim-muted text-sm text-center leading-6">
              Ton contrat de remplacement est généré. Tu peux le partager ou l'enregistrer
              directement sur ton appareil.
            </Text>

            {/* Bouton partager */}
            <Pressable
              className={`w-full h-14 rounded-xl items-center justify-center ${
                isSharing ? 'bg-jim-primary/50' : 'bg-jim-primary active:bg-jim-primary/90'
              }`}
              onPress={handleShare}
              disabled={isSharing}
              accessibilityRole="button"
              accessibilityLabel="Partager ou enregistrer le PDF du contrat"
            >
              {isSharing ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-semibold">Partage en cours…</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold">Partager / Enregistrer</Text>
              )}
            </Pressable>

            {/* Bouton régénérer */}
            <Pressable
              className="h-11 px-6 rounded-xl border border-jim-border items-center justify-center active:opacity-70"
              onPress={handleRegenerate}
              accessibilityRole="button"
              accessibilityLabel="Régénérer le PDF"
            >
              <Text className="text-jim-muted text-sm">Régénérer</Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>

      {/* Disclaimer réglementaire en bas de l'écran */}
      <View className="mx-6 mb-10 p-3 bg-jim-accent/10 border border-jim-accent/20 rounded-xl">
        <Text className="text-jim-muted text-xs leading-relaxed italic text-center">
          Ce document est généré à titre informatif. Il ne constitue pas un acte juridique
          opposable. Conforme RGPD — données traitées par JIM — Job In Med.
        </Text>
      </View>
    </View>
  );
}
