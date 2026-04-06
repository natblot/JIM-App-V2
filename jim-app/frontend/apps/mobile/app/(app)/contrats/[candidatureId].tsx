// Écran principal contrat de remplacement — Epic 8
// 4 états : pas encore généré / brouillon (titulaire) / en_attente_remplacant / confirmé
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ContratStatusBadge,
  ContratSummary,
  ContratClause,
} from '@jim/ui';
import {
  useContrat,
  useGenerateContrat,
  useConfirmContrat,
  useUpdateClausesOptionnelles,
  useAuthStore,
} from '@jim/shared';
import type { ContratClause as ContratClauseType } from '@jim/shared';
import { supabase } from '../../_layout';

// Disclaimer réglementaire affiché en bas de chaque état du contrat
function DisclaimerFooter() {
  return (
    <View className="mx-4 my-4 p-3 bg-jim-accent/10 border border-jim-accent/20 rounded-xl">
      <Text className="text-jim-muted text-xs leading-relaxed italic">
        Ce document a été généré automatiquement à titre informatif. Il ne constitue pas un acte
        juridique opposable. Vérifiez sa conformité auprès d'un professionnel du droit avant
        signature définitive. Conforme RGPD.
      </Text>
    </View>
  );
}

export default function ContratScreen() {
  const { candidatureId } = useLocalSearchParams<{ candidatureId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  // Hooks données
  const { data: contrat, isLoading } = useContrat(supabase, candidatureId ?? '');
  const generateContrat = useGenerateContrat(supabase);
  const confirmContrat = useConfirmContrat(supabase);
  const updateClauses = useUpdateClausesOptionnelles(supabase);

  // Copie locale des clauses optionnelles pour les mutations optimistes
  const [clausesEditables, setClausesEditables] = useState<ContratClauseType[] | null>(null);

  // Clauses optionnelles à afficher — priorise la copie locale si disponible
  const clausesOptionnelles =
    clausesEditables ?? contrat?.clauses_optionnelles ?? [];

  // Détermine si l'utilisateur connecté est le titulaire du contrat
  const isTitulaire = Boolean(contrat && user && contrat.titulaire_id === user.id);

  // --- Actions ---

  const handleGenerate = useCallback(async () => {
    try {
      await generateContrat.mutateAsync(candidatureId ?? '');
    } catch {
      Alert.alert('Erreur', 'La génération du contrat a échoué. Réessaie dans quelques instants.');
    }
  }, [generateContrat, candidatureId]);

  const handleConfirm = useCallback(async () => {
    if (!contrat) return;
    Alert.alert(
      'Confirmer le contrat ?',
      'En confirmant, vous apposez votre signature électronique. Cette action est définitive.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await confirmContrat.mutateAsync({
                contratId: contrat.id,
                candidatureId: candidatureId ?? '',
              });
            } catch {
              Alert.alert('Erreur', 'La confirmation a échoué. Réessaie dans quelques instants.');
            }
          },
        },
      ]
    );
  }, [contrat, confirmContrat, candidatureId]);

  // Édition d'une clause optionnelle — mise à jour locale puis sauvegarde
  const handleEditClause = useCallback(
    async (clauseId: string, newContent: string) => {
      if (!contrat) return;

      // Mise à jour optimiste locale
      const updated = clausesOptionnelles.map((c) =>
        c.id === clauseId ? { ...c, contenu: newContent } : c
      );
      setClausesEditables(updated);

      try {
        await updateClauses.mutateAsync({
          contratId: contrat.id,
          candidatureId: candidatureId ?? '',
          clauses: updated,
        });
        // On efface la copie locale : le cache TanStack Query prend le relais
        setClausesEditables(null);
      } catch {
        // Rollback optimiste en cas d'erreur
        setClausesEditables(contrat.clauses_optionnelles);
        Alert.alert('Erreur', 'Impossible de sauvegarder la clause. Réessaie.');
      }
    },
    [contrat, clausesOptionnelles, updateClauses, candidatureId]
  );

  const handleDownloadPdf = useCallback(() => {
    if (!contrat) return;
    router.push(`/(app)/contrats/pdf/${contrat.id}` as never);
  }, [contrat, router]);

  // --- Rendu : loading ---
  if (isLoading) {
    return (
      <View className="flex-1 bg-jim-background">
        {/* En-tête minimal pendant le chargement */}
        <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
          <Pressable
            className="w-11 h-11 items-center justify-center mb-2"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Text className="text-jim-primary text-2xl">‹</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-jim-text">Contrat de remplacement</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-jim-muted mt-3 text-sm">Chargement du contrat…</Text>
        </View>
      </View>
    );
  }

  // --- Rendu : état 1 — pas encore généré ---
  if (!contrat) {
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
          <Text className="text-2xl font-bold text-jim-text">Contrat de remplacement</Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="py-8 px-6 gap-6">
          <Animated.View entering={FadeInDown.duration(400)} className="items-center gap-4">
            {/* Icône document */}
            <View className="w-20 h-20 rounded-full bg-jim-primary/10 items-center justify-center">
              <Text className="text-4xl">📄</Text>
            </View>
            <Text className="text-jim-text font-bold text-xl text-center">
              Contrat pas encore généré
            </Text>
            <Text className="text-jim-muted text-sm text-center leading-6">
              JIM génère automatiquement un contrat de remplacement conforme à partir des
              informations de la candidature. La génération prend quelques secondes.
            </Text>
          </Animated.View>

          <DisclaimerFooter />
        </ScrollView>

        {/* CTA sticky — Générer */}
        <View className="px-6 pb-10 pt-4 border-t border-jim-border bg-jim-surface">
          <Pressable
            className={`h-14 rounded-xl items-center justify-center ${
              generateContrat.isPending
                ? 'bg-jim-primary/50'
                : 'bg-jim-primary active:bg-jim-primary/90'
            }`}
            onPress={handleGenerate}
            disabled={generateContrat.isPending}
            accessibilityRole="button"
            accessibilityLabel="Générer le contrat de remplacement"
          >
            {generateContrat.isPending ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold">Génération en cours…</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold">Générer le contrat</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // --- Rendu : états 2, 3 et 4 (contrat existant) ---
  const isConfirme = contrat.statut === 'confirme';
  const isBrouillon = contrat.statut === 'brouillon';
  const isEnAttenteRemplacant = contrat.statut === 'en_attente_remplacant';

  // Le remplaçant voit le contrat en lecture seule (état 3) ou confirmé (état 4)
  const showEditableClauses = isBrouillon && isTitulaire;

  // Label du bouton CTA principal selon l'état et le rôle
  function getCtaLabel(): string {
    if (isConfirme) return 'Télécharger le PDF';
    if (isBrouillon && isTitulaire) return 'Confirmer (titulaire)';
    if (isEnAttenteRemplacant && !isTitulaire) return 'Confirmer et signer';
    return 'Télécharger le PDF';
  }

  function getCtaStyle(): string {
    if (isConfirme) return 'bg-jim-success active:bg-jim-success/90';
    return 'bg-jim-primary active:bg-jim-primary/90';
  }

  function handleCta() {
    if (isConfirme) {
      handleDownloadPdf();
      return;
    }
    handleConfirm();
  }

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête : titre + badge statut */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable
            className="w-11 h-11 items-center justify-center"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Text className="text-jim-primary text-2xl">‹</Text>
          </Pressable>
          <ContratStatusBadge statut={contrat.statut} />
        </View>
        <Text className="text-2xl font-bold text-jim-text">Contrat de remplacement</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="py-4 gap-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Résumé contrat — 5 points de conformité */}
          <Animated.View entering={FadeInDown.duration(400)} className="mx-4">
            <ContratSummary
              titulaire={contrat.donnees.titulaire}
              remplacant={contrat.donnees.remplacant}
              dates={contrat.donnees.dates}
              adresse_cabinet={contrat.donnees.adresse_cabinet}
              taux_retrocession={contrat.donnees.taux_retrocession}
              badge_ordre_mk={isConfirme}
            />
          </Animated.View>

          {/* Clauses obligatoires — toujours verrouillées */}
          {contrat.clauses_obligatoires.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(80)}
              className="mx-4 gap-3"
            >
              <Text className="text-jim-text font-bold text-base">Clauses obligatoires</Text>
              {contrat.clauses_obligatoires.map((clause) => (
                <ContratClause
                  key={clause.id}
                  title={clause.titre}
                  content={clause.contenu}
                  editable={false}
                />
              ))}
            </Animated.View>
          )}

          {/* Clauses optionnelles — éditables si titulaire + brouillon */}
          {clausesOptionnelles.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(160)}
              className="mx-4 gap-3"
            >
              <Text className="text-jim-text font-bold text-base">Clauses complémentaires</Text>
              {showEditableClauses ? (
                <Text className="text-jim-muted text-xs">
                  Appuie sur une clause pour la personnaliser avant de confirmer.
                </Text>
              ) : null}
              {clausesOptionnelles.map((clause) => (
                <ContratClause
                  key={clause.id}
                  title={clause.titre}
                  content={clause.contenu}
                  editable={showEditableClauses}
                  onEdit={
                    showEditableClauses
                      ? (newContent) => handleEditClause(clause.id, newContent)
                      : undefined
                  }
                />
              ))}
            </Animated.View>
          )}

          {/* Badge confirmé — état 4 */}
          {isConfirme && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(240)}
              className="mx-4 p-4 bg-jim-success/10 border border-jim-success/30 rounded-xl items-center gap-1"
              accessibilityLabel="Contrat confirmé par les deux parties"
            >
              <Text className="text-jim-success text-2xl">✓</Text>
              <Text className="text-jim-success font-bold text-base">Contrat confirmé</Text>
              <Text className="text-jim-success text-xs text-center">
                Les deux parties ont signé. Ce contrat est opposable.
              </Text>
            </Animated.View>
          )}

          {/* Disclaimer remplaçant — état 3 */}
          {isEnAttenteRemplacant && !isTitulaire && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(200)}
              className="mx-4 p-3 bg-jim-accent/10 border border-jim-accent/30 rounded-xl"
            >
              <Text className="text-jim-muted text-xs leading-relaxed">
                En confirmant, tu aposes ta signature électronique sur ce contrat. Lis attentivement
                toutes les clauses. En cas de doute, consulte un professionnel du droit.
              </Text>
            </Animated.View>
          )}

          <DisclaimerFooter />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Actions sticky en bas */}
      <View className="px-6 pb-10 pt-4 gap-3 border-t border-jim-border bg-jim-surface">
        {/* Bouton télécharger PDF — visible dès que le contrat existe (sauf brouillon) */}
        {!isBrouillon && (
          <Pressable
            className="h-12 rounded-xl border-2 border-jim-primary/30 items-center justify-center active:opacity-80"
            onPress={handleDownloadPdf}
            accessibilityRole="button"
            accessibilityLabel="Télécharger le contrat en PDF"
          >
            <Text className="text-jim-primary font-medium">Télécharger le PDF</Text>
          </Pressable>
        )}

        {/* CTA principal */}
        {!isConfirme ? (
          <Pressable
            className={`h-14 rounded-xl items-center justify-center ${
              confirmContrat.isPending ? 'opacity-50' : getCtaStyle()
            }`}
            onPress={handleCta}
            disabled={confirmContrat.isPending}
            accessibilityRole="button"
            accessibilityLabel={getCtaLabel()}
          >
            {confirmContrat.isPending ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold">Confirmation…</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold">{getCtaLabel()}</Text>
            )}
          </Pressable>
        ) : (
          /* État confirmé — CTA plein écran téléchargement PDF */
          <Pressable
            className={`h-14 rounded-xl items-center justify-center ${getCtaStyle()}`}
            onPress={handleDownloadPdf}
            accessibilityRole="button"
            accessibilityLabel="Télécharger le contrat confirmé en PDF"
          >
            <Text className="text-white font-semibold">{getCtaLabel()}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
