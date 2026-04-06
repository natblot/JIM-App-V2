import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, {
  FadeInDown,
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  rppsVerifySchema,
  rppsSearchSchema,
  type RppsVerifyFormData,
  type RppsSearchFormData,
  useRppsVerify,
  useRppsSearch,
  authKeys,
  type RppsSearchResultItem,
} from '@jim/shared';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../_layout';

// Onglet actif — saisie directe (Léa) ou recherche par nom (Michel)
type RppsMode = 'direct' | 'search';

// État de la vérification RPPS
type VerificationState = 'idle' | 'loading' | 'success' | 'api_down' | 'not_found' | 'error';

// Écran de vérification RPPS — Stories 1.4 et 1.5
// Deux modes : saisie directe du numéro ou recherche par nom/prénom
export default function RppsVerifyScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<RppsMode>('direct');
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [searchResults, setSearchResults] = useState<RppsSearchResultItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rppsVerify = useRppsVerify(supabase);
  const rppsSearch = useRppsSearch(supabase);

  // Animation du badge vérifié — hero moment (ZoomIn + spring)
  const badgeScale = useSharedValue(0);
  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  // Formulaire saisie directe
  const directForm = useForm<RppsVerifyFormData>({
    resolver: zodResolver(rppsVerifySchema),
    defaultValues: { rppsNumber: '' },
  });

  // Formulaire recherche par nom/prénom
  const searchForm = useForm<RppsSearchFormData>({
    resolver: zodResolver(rppsSearchSchema),
    defaultValues: { lastName: '', firstName: '', city: '' },
  });

  // Soumission du numéro RPPS — appel Edge Function via hook
  const onDirectSubmit = async (data: RppsVerifyFormData) => {
    setVerificationState('loading');
    setErrorMessage(null);
    try {
      await rppsVerify.mutateAsync(data);
      setVerificationState('success');
      // Animation badge — hero moment 800ms, spring sans bounce
      badgeScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      // Invalider le cache profil pour recharger les données vérifiées
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // Redirection vers l'app après 2 secondes — laisser le temps à l'animation
      setTimeout(() => router.replace('/(app)'), 2000);
    } catch (error) {
      const err = error as Error & { code?: string };
      if (err.code === 'RPPS_API_DOWN') {
        setVerificationState('api_down');
      } else if (err.code === 'RPPS_NOT_FOUND') {
        setVerificationState('not_found');
      } else {
        setVerificationState('error');
        setErrorMessage(err.message ?? "Une erreur inattendue s'est produite.");
      }
    }
  };

  // Soumission de la recherche — retourne une liste de professionnels
  const onSearchSubmit = async (data: RppsSearchFormData) => {
    setErrorMessage(null);
    try {
      const results = await rppsSearch.mutateAsync(data);
      setSearchResults(results);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  // Sélection d'un résultat de recherche — pré-remplit le formulaire et lance la vérification
  const onSelectSearchResult = async (rppsNumber: string) => {
    directForm.setValue('rppsNumber', rppsNumber);
    setMode('direct');
    setSearchResults([]);
    await onDirectSubmit({ rppsNumber });
  };

  // --- Écran succès : hero moment ---
  if (verificationState === 'success') {
    return (
      <View
        className="flex-1 bg-jim-background items-center justify-center px-6"
        accessibilityLiveRegion="polite"
      >
        {/* Badge vérifié — animation ZoomIn + spring */}
        <Animated.View
          entering={ZoomIn.duration(600).springify()}
          style={badgeStyle}
          accessible
          accessibilityLabel="Badge de vérification RPPS obtenu"
        >
          <View className="w-32 h-32 bg-jim-success rounded-full items-center justify-center mb-6 shadow-lg">
            <Text className="text-6xl" aria-hidden>✓</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(400)} className="items-center gap-3">
          <Text className="text-3xl font-bold text-jim-text text-center">
            Identité vérifiée !
          </Text>
          <Text className="text-jim-muted text-center leading-6 max-w-sm">
            Votre badge RPPS est activé. Les titulaires peuvent maintenant voir votre profil certifié.
          </Text>
          <View className="bg-jim-success/10 rounded-full px-4 py-2 border border-jim-success/30 mt-2">
            <Text className="text-jim-success font-semibold text-sm">
              ✓ Masseur-Kinésithérapeute vérifié
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  // --- Écran mode dégradé : Annuaire Santé indisponible (NFR30) ---
  if (verificationState === 'api_down') {
    return (
      <View className="flex-1 bg-jim-background items-center justify-center px-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-4">
          <View
            className="w-24 h-24 bg-jim-accent/10 rounded-full items-center justify-center border-2 border-jim-accent/30"
            accessible
            accessibilityLabel="Vérification en attente"
          >
            <Text className="text-4xl" aria-hidden>⏳</Text>
          </View>

          <Text className="text-2xl font-bold text-jim-text text-center">
            Activation en cours
          </Text>
          <Text className="text-jim-muted text-center leading-6 max-w-sm">
            L'Annuaire Santé est temporairement indisponible. On vérifie votre RPPS dès qu'il est de retour — généralement dans l'heure.
          </Text>

          {/* Encart informatif — ton bienveillant */}
          <View className="bg-jim-primary/8 rounded-xl p-4 border border-jim-primary/20 w-full">
            <Text className="text-jim-muted text-sm text-center leading-5">
              Vous pouvez compléter votre profil pendant l'attente. La candidature sera disponible après validation.
            </Text>
          </View>

          <Pressable
            className="mt-4 h-14 w-full bg-jim-primary rounded-xl items-center justify-center active:bg-jim-primary/90"
            onPress={() => router.replace('/(app)')}
            accessibilityRole="button"
            accessibilityLabel="Continuer vers l'application"
          >
            <Text className="text-white font-semibold text-base">Continuer</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // --- Écran RPPS non trouvé : jeune diplômé non encore enregistré (Story 1.6) ---
  if (verificationState === 'not_found') {
    return (
      <View className="flex-1 bg-jim-background items-center justify-center px-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-4">
          <View
            className="w-24 h-24 bg-jim-accent/10 rounded-full items-center justify-center border-2 border-jim-accent/30"
            accessible
            accessibilityLabel="RPPS non trouvé dans l'annuaire"
          >
            <Text className="text-4xl" aria-hidden>🔍</Text>
          </View>

          <Text className="text-2xl font-bold text-jim-text text-center">
            RPPS non encore enregistré
          </Text>
          <Text className="text-jim-muted text-center leading-6 max-w-sm">
            Votre numéro n'est pas encore dans l'Annuaire Santé — c'est courant pour les jeunes diplômés. On vérifie chaque jour pour vous.
          </Text>

          {/* Encart ton positif — "Activation en cours — on vérifie chaque jour pour vous" */}
          <View className="bg-jim-accent/10 rounded-xl p-4 border border-jim-accent/30 w-full">
            <Text className="text-jim-accent font-semibold text-sm text-center">
              📅 Activation en cours — on vous prévient dès que votre RPPS est activé
            </Text>
          </View>

          <View className="w-full gap-3 mt-2">
            <Pressable
              className="h-14 bg-jim-primary rounded-xl items-center justify-center active:bg-jim-primary/90"
              onPress={() => router.replace('/(app)')}
              accessibilityRole="button"
              accessibilityLabel="Compléter mon profil en attendant"
            >
              <Text className="text-white font-semibold text-base">
                Compléter mon profil
              </Text>
            </Pressable>

            <Pressable
              className="h-12 items-center justify-center"
              onPress={() => setVerificationState('idle')}
              accessibilityRole="button"
              accessibilityLabel="Réessayer avec un autre numéro RPPS"
            >
              <Text className="text-jim-muted text-sm">Réessayer avec un autre numéro</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    );
  }

  // --- Écran principal : formulaire de vérification ---
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-jim-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* En-tête */}
        <Animated.View entering={FadeInDown.duration(400)} className="mb-8">
          <Text className="text-3xl font-bold text-jim-text">Vérification RPPS</Text>
          <Text className="text-jim-muted mt-2 leading-5">
            Votre numéro RPPS certifie votre identité auprès des autres professionnels.
          </Text>
        </Animated.View>

        {/* Toggle direct / recherche — onglets accessibles */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} className="mb-6">
          <View
            className="flex-row bg-jim-surface rounded-xl p-1 border border-jim-border"
            accessibilityRole="tablist"
          >
            <Pressable
              className={`flex-1 h-10 rounded-lg items-center justify-center
                ${mode === 'direct' ? 'bg-jim-primary' : ''}`}
              onPress={() => setMode('direct')}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'direct' }}
              accessibilityLabel="Saisir mon numéro RPPS directement"
            >
              <Text className={`text-sm font-medium ${mode === 'direct' ? 'text-white' : 'text-jim-muted'}`}>
                J'ai mon numéro
              </Text>
            </Pressable>

            <Pressable
              className={`flex-1 h-10 rounded-lg items-center justify-center
                ${mode === 'search' ? 'bg-jim-primary' : ''}`}
              onPress={() => setMode('search')}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'search' }}
              accessibilityLabel="Rechercher mon RPPS par nom et prénom"
            >
              <Text className={`text-sm font-medium ${mode === 'search' ? 'text-white' : 'text-jim-muted'}`}>
                Je le cherche
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ===== MODE SAISIE DIRECTE — pour Léa (24 ans) ===== */}
        {mode === 'direct' && (
          <Animated.View entering={FadeIn.duration(200)} className="gap-5">
            {/* Aide contextuelle — où trouver son RPPS */}
            <View className="bg-jim-primary/8 rounded-xl p-4 border border-jim-primary/20">
              <Text className="text-jim-primary text-sm font-medium mb-1">
                🔒 Où trouver mon RPPS ?
              </Text>
              <Text className="text-jim-muted text-sm leading-5">
                Sur votre carte CPS, votre diplôme, ou sur le site de l'Ordre des Masseurs-Kinésithérapeutes.
              </Text>
            </View>

            {/* Champ numéro RPPS — 11 chiffres, clavier numérique */}
            <View>
              <Text className="text-jim-text font-medium mb-2 text-sm">
                Numéro RPPS (11 chiffres)
              </Text>
              <Controller
                control={directForm.control}
                name="rppsNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-14 bg-jim-surface border-2 rounded-xl px-4 text-jim-text text-lg tracking-widest font-mono
                      ${directForm.formState.errors.rppsNumber
                        ? 'border-jim-destructive'
                        : value.length === 11 ? 'border-jim-success' : 'border-jim-border'}`}
                    placeholder="10003456789"
                    placeholderTextColor="#8892A4"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      // Filtrer : uniquement des chiffres, max 11 caractères
                      onChange(text.replace(/\D/g, '').slice(0, 11));
                    }}
                    value={value}
                    keyboardType="number-pad"
                    maxLength={11}
                    accessibilityLabel="Numéro RPPS"
                    accessibilityHint="Entrez votre numéro RPPS à 11 chiffres"
                  />
                )}
              />
              {/* Compteur de chiffres + message d'erreur */}
              <View className="flex-row justify-between mt-1">
                {directForm.formState.errors.rppsNumber ? (
                  <Text className="text-jim-destructive text-sm">
                    {directForm.formState.errors.rppsNumber.message}
                  </Text>
                ) : (
                  <Text className="text-jim-muted text-xs">Format : 11 chiffres</Text>
                )}
                <Text className="text-jim-muted text-xs">
                  {directForm.watch('rppsNumber').length}/11
                </Text>
              </View>
            </View>

            {/* Message d'erreur générique */}
            {errorMessage && (
              <View
                className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-4"
                accessibilityLiveRegion="assertive"
              >
                <Text className="text-jim-destructive text-sm">{errorMessage}</Text>
              </View>
            )}

            {/* Bouton vérifier */}
            <Pressable
              className={`h-14 rounded-xl items-center justify-center
                ${verificationState === 'loading' || rppsVerify.isPending
                  ? 'bg-jim-primary/50'
                  : 'bg-jim-primary active:bg-jim-primary/90'}`}
              onPress={directForm.handleSubmit(onDirectSubmit)}
              disabled={verificationState === 'loading' || rppsVerify.isPending}
              accessibilityRole="button"
              accessibilityLabel="Vérifier mon numéro RPPS"
              accessibilityState={{ disabled: verificationState === 'loading' || rppsVerify.isPending }}
            >
              {(verificationState === 'loading' || rppsVerify.isPending) ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-medium">Vérification en cours…</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-base">Vérifier mon RPPS</Text>
              )}
            </Pressable>

            {/* Lien de sortie — vérification obligatoire plus tard */}
            <Pressable
              className="h-12 items-center justify-center"
              onPress={() => router.replace('/(app)')}
              accessibilityRole="button"
              accessibilityLabel="Passer pour l'instant, vérification obligatoire plus tard"
            >
              <Text className="text-jim-muted text-sm">
                Passer pour l'instant → vérification obligatoire plus tard
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* ===== MODE RECHERCHE PAR NOM — pour Michel (52 ans) ===== */}
        {mode === 'search' && (
          <Animated.View entering={FadeIn.duration(200)} className="gap-4">
            {/* Aide contextuelle — mode Michel */}
            <View className="bg-jim-accent/10 rounded-xl p-4 border border-jim-accent/20">
              <Text className="text-jim-accent text-sm font-medium mb-1">
                🔍 Retrouvez votre RPPS
              </Text>
              <Text className="text-jim-muted text-sm leading-5">
                Entrez votre nom et prénom tels qu'ils apparaissent sur votre diplôme.
              </Text>
            </View>

            {/* Champs Nom + Prénom côte à côte */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-jim-text font-medium mb-2 text-sm">Nom</Text>
                <Controller
                  control={searchForm.control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                        ${searchForm.formState.errors.lastName ? 'border-jim-destructive' : 'border-jim-border'}`}
                      placeholder="DUPONT"
                      placeholderTextColor="#8892A4"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="characters"
                      accessibilityLabel="Nom de famille"
                    />
                  )}
                />
                {searchForm.formState.errors.lastName && (
                  <Text className="text-jim-destructive text-xs mt-1">
                    {searchForm.formState.errors.lastName.message}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-jim-text font-medium mb-2 text-sm">Prénom</Text>
                <Controller
                  control={searchForm.control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                        ${searchForm.formState.errors.firstName ? 'border-jim-destructive' : 'border-jim-border'}`}
                      placeholder="Michel"
                      placeholderTextColor="#8892A4"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="words"
                      accessibilityLabel="Prénom"
                    />
                  )}
                />
                {searchForm.formState.errors.firstName && (
                  <Text className="text-jim-destructive text-xs mt-1">
                    {searchForm.formState.errors.firstName.message}
                  </Text>
                )}
              </View>
            </View>

            {/* Champ ville — optionnel, pour affiner la recherche */}
            <View>
              <Text className="text-jim-text font-medium mb-2 text-sm">
                Ville{' '}
                <Text className="text-jim-muted font-normal">(optionnel, pour affiner)</Text>
              </Text>
              <Controller
                control={searchForm.control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-12 bg-jim-surface border border-jim-border rounded-xl px-4 text-jim-text"
                    placeholder="Lille, Lyon, Paris…"
                    placeholderTextColor="#8892A4"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                    accessibilityLabel="Ville d'exercice (optionnel)"
                  />
                )}
              />
            </View>

            {/* Message d'erreur recherche */}
            {errorMessage && (
              <View
                className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-4"
                accessibilityLiveRegion="assertive"
              >
                <Text className="text-jim-destructive text-sm">{errorMessage}</Text>
              </View>
            )}

            {/* Bouton rechercher */}
            <Pressable
              className={`h-14 rounded-xl items-center justify-center
                ${rppsSearch.isPending
                  ? 'bg-jim-accent/50'
                  : 'bg-jim-accent active:bg-jim-accent/90'}`}
              onPress={searchForm.handleSubmit(onSearchSubmit)}
              disabled={rppsSearch.isPending}
              accessibilityRole="button"
              accessibilityLabel="Rechercher mon numéro RPPS par nom"
              accessibilityState={{ disabled: rppsSearch.isPending }}
            >
              {rppsSearch.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Rechercher</Text>
              )}
            </Pressable>

            {/* Résultats de recherche */}
            {searchResults.length > 0 && (
              <Animated.View entering={FadeInDown.duration(300)} className="gap-2">
                <Text className="text-jim-text font-medium text-sm">
                  {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                </Text>

                {searchResults.map((result) => (
                  <Pressable
                    key={result.rpps_number}
                    className="bg-jim-surface border border-jim-border rounded-xl p-4 active:bg-jim-primary/5 active:border-jim-primary"
                    onPress={() => onSelectSearchResult(result.rpps_number)}
                    accessibilityRole="button"
                    accessibilityLabel={`Sélectionner ${result.first_name} ${result.last_name}, ${result.profession_label}${result.city ? `, ${result.city}` : ''}, RPPS ${result.rpps_number}`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-jim-text font-semibold">
                          {result.first_name} {result.last_name}
                        </Text>
                        <Text className="text-jim-muted text-sm mt-0.5">
                          {result.profession_label}
                          {result.city ? ` · ${result.city}` : ''}
                        </Text>
                        <Text className="text-jim-muted text-xs mt-1 font-mono">
                          RPPS : {result.rpps_number}
                        </Text>
                      </View>
                      {/* Flèche de sélection — zone tap gérée par le Pressable parent */}
                      <View className="w-8 h-8 bg-jim-primary/10 rounded-full items-center justify-center">
                        <Text className="text-jim-primary text-sm" aria-hidden>›</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </Animated.View>
            )}

            {/* Aucun résultat — message d'aide contextuel */}
            {rppsSearch.isSuccess && searchResults.length === 0 && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                className="bg-jim-accent/10 rounded-xl p-4 border border-jim-accent/20"
                accessibilityLiveRegion="polite"
              >
                <Text className="text-jim-accent font-medium text-sm mb-1">
                  Aucun résultat trouvé
                </Text>
                <Text className="text-jim-muted text-sm leading-5">
                  Vérifiez l'orthographe ou essayez sans la ville. Si votre RPPS vient d'être attribué, il peut prendre quelques jours à apparaître.
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
