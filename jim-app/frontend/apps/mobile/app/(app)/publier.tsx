// apps/mobile/app/(app)/publier.tsx
// Formulaire de publication d'annonce — 3 étapes — Story 2.1 + 2.2
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { StepIndicator, RetrocessionIndicator } from '@jim/ui';
import {
  annonceStep1Schema,
  annonceStep2Schema,
  annonceStep3Schema,
  useCreateAnnonce,
  useVilleAutocomplete,
  type AnnonceStep1Data,
  type AnnonceStep2Data,
  type AnnonceStep3Data,
  type AnnonceFormData,
  type VilleSuggestion,
} from '@jim/shared';
import { supabase } from '../_layout';

const STEP_LABELS = ['Dates & type', 'Localisation & rétrocession', 'Détails (optionnel)'];

type AllStepsData = AnnonceStep1Data & AnnonceStep2Data & AnnonceStep3Data;

export default function PublierScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AllStepsData>>({});
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const createAnnonce = useCreateAnnonce(supabase);

  // Étape 1 : Dates + type + urgent
  const step1Form = useForm<AnnonceStep1Data>({
    resolver: zodResolver(annonceStep1Schema),
    defaultValues: {
      type_annonce: 'remplacement',
      is_urgent: false,
    },
  });

  // Étape 2 : Localisation + rétrocession
  const step2Form = useForm<AnnonceStep2Data>({
    resolver: zodResolver(annonceStep2Schema),
    defaultValues: {
      retrocession: 82,
      ville: '',
    },
  });

  // Étape 3 : Détails (optionnel)
  const step3Form = useForm<AnnonceStep3Data>({
    resolver: zodResolver(annonceStep3Schema),
    defaultValues: { specialites: [] },
  });

  const handleStep1Next = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  });

  const handleStep2Next = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  });

  const handleStep3Submit = step3Form.handleSubmit(async (data) => {
    const finalData = { ...formData, ...data };
    try {
      const result = await createAnnonce.mutateAsync(finalData as AnnonceFormData);
      setPublishedId(result.id);
    } catch {
      // L'erreur est gérée par le hook — on laisse l'UI en place pour réessayer
    }
  });

  // Écran de succès post-publication
  if (publishedId) {
    return <PublicationSuccess onPress={() => router.replace('/(app)/' as never)} />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-jim-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* En-tête avec bouton retour et indicateur d'étape */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <Pressable
          className="w-11 h-11 items-center justify-center mb-4"
          onPress={currentStep === 1 ? () => router.back() : () => setCurrentStep((s) => s - 1)}
          accessibilityRole="button"
          accessibilityLabel={currentStep === 1 ? 'Annuler' : 'Étape précédente'}
        >
          <Text className="text-jim-primary text-2xl">‹</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-jim-text mb-4">
          Publier une annonce
        </Text>
        <StepIndicator
          totalSteps={3}
          currentStep={currentStep}
          labels={STEP_LABELS}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 && <Step1 form={step1Form} onNext={handleStep1Next} />}
        {currentStep === 2 && <Step2 form={step2Form} onNext={handleStep2Next} />}
        {currentStep === 3 && <Step3 form={step3Form} onSubmit={handleStep3Submit} isSubmitting={createAnnonce.isPending} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Étape 1 : Dates & type ─────────────────────────────────────────────────

function Step1({ form, onNext }: { form: ReturnType<typeof useForm<AnnonceStep1Data>>; onNext: () => void }) {
  const { control, formState: { errors } } = form;

  return (
    <Animated.View entering={FadeInRight.duration(300)} className="gap-6">
      {/* Type d'annonce */}
      <View className="gap-3">
        <Text className="text-jim-text font-semibold">Type de remplacement</Text>
        <Controller
          control={control}
          name="type_annonce"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-2">
              {(['remplacement', 'assistanat', 'collaboration'] as const).map((type) => (
                <Pressable
                  key={type}
                  className={`px-4 py-2.5 rounded-xl border-2 ${
                    value === type
                      ? 'border-jim-primary bg-jim-primary/10'
                      : 'border-jim-border bg-jim-surface'
                  }`}
                  onPress={() => onChange(type)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: value === type }}
                >
                  <Text
                    className={`font-medium capitalize text-sm ${
                      value === type ? 'text-jim-primary' : 'text-jim-text'
                    }`}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
      </View>

      {/* Date début */}
      <View className="gap-2">
        <Text className="text-jim-text font-medium text-sm">Date de début</Text>
        <Controller
          control={control}
          name="date_debut"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text ${
                errors.date_debut ? 'border-jim-destructive' : 'border-jim-border'
              }`}
              placeholder="YYYY-MM-DD (ex: 2026-06-01)"
              placeholderTextColor="#8892A4"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              accessibilityLabel="Date de début du remplacement"
            />
          )}
        />
        {errors.date_debut && (
          <Text className="text-jim-destructive text-xs">{errors.date_debut.message}</Text>
        )}
      </View>

      {/* Date fin */}
      <View className="gap-2">
        <Text className="text-jim-text font-medium text-sm">Date de fin</Text>
        <Controller
          control={control}
          name="date_fin"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text ${
                errors.date_fin ? 'border-jim-destructive' : 'border-jim-border'
              }`}
              placeholder="YYYY-MM-DD (ex: 2026-06-30)"
              placeholderTextColor="#8892A4"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              accessibilityLabel="Date de fin du remplacement"
            />
          )}
        />
        {errors.date_fin && (
          <Text className="text-jim-destructive text-xs">{errors.date_fin.message}</Text>
        )}
      </View>

      {/* Toggle urgent */}
      <View className="bg-jim-destructive/5 border border-jim-destructive/20 rounded-2xl p-4">
        <Controller
          control={control}
          name="is_urgent"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base">⚡</Text>
                  <Text className="text-jim-text font-semibold">Annonce urgente</Text>
                </View>
                <Text className="text-jim-muted text-sm mt-1">
                  Notifie en priorité les remplaçants disponibles à moins de 30 km
                </Text>
              </View>
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#E2E8F0', true: '#EF4444' }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Marquer comme urgent"
              />
            </View>
          )}
        />
      </View>

      {/* Bouton suivant */}
      <Pressable
        className="h-14 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel="Passer à l'étape suivante"
      >
        <Text className="text-white font-semibold text-base">Continuer →</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Étape 2 : Localisation & rétrocession ──────────────────────────────────

function Step2({ form, onNext }: { form: ReturnType<typeof useForm<AnnonceStep2Data>>; onNext: () => void }) {
  const { control, watch, setValue, formState: { errors } } = form;
  const retrocessionValue = watch('retrocession');
  watch('ville');
  const [villeQuery, setVilleQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, isLoading: isSuggesting } = useVilleAutocomplete(villeQuery);

  const handleVilleSuggestionSelect = (suggestion: VilleSuggestion) => {
    setValue('ville', suggestion.ville);
    setValue('code_postal', suggestion.codePostal);
    setVilleQuery('');
    setShowSuggestions(false);
  };

  return (
    <Animated.View entering={FadeInRight.duration(300)} className="gap-6">
      {/* Ville avec autocomplete */}
      <View className="gap-2">
        <Text className="text-jim-text font-medium text-sm">Ville du cabinet</Text>
        <Controller
          control={control}
          name="ville"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text ${
                errors.ville ? 'border-jim-destructive' : 'border-jim-border'
              }`}
              placeholder="Rechercher une ville..."
              placeholderTextColor="#8892A4"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                setVilleQuery(text);
                setShowSuggestions(true);
              }}
              value={value}
              autoCapitalize="words"
              accessibilityLabel="Ville du cabinet de kinésithérapie"
            />
          )}
        />
        {errors.ville && (
          <Text className="text-jim-destructive text-xs">{errors.ville.message}</Text>
        )}
        {/* Suggestions autocomplete */}
        {showSuggestions && suggestions.length > 0 && (
          <View className="bg-jim-surface border border-jim-border rounded-xl overflow-hidden shadow-sm">
            <FlatList
              data={suggestions}
              keyExtractor={(item) => `${item.ville}-${item.codePostal}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  className="px-4 py-3 border-b border-jim-border last:border-0 active:bg-jim-background"
                  onPress={() => handleVilleSuggestionSelect(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Text className="text-jim-text text-sm">{item.ville}</Text>
                  <Text className="text-jim-muted text-xs">{item.codePostal}</Text>
                </Pressable>
              )}
            />
          </View>
        )}
        {isSuggesting && villeQuery.length >= 2 && (
          <ActivityIndicator size="small" color="#4B7BEC" />
        )}
      </View>

      {/* Taux de rétrocession */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-jim-text font-medium text-sm">Taux de rétrocession</Text>
          <Text className="text-jim-primary font-bold text-xl">
            {retrocessionValue?.toFixed(0) ?? '82'}%
          </Text>
        </View>

        {/* Valeurs prédéfinies */}
        <View className="flex-row flex-wrap gap-2 mt-2">
          {[70, 75, 80, 82, 85, 90, 95].map((val) => (
            <Controller
              key={val}
              control={control}
              name="retrocession"
              render={({ field: { onChange, value } }) => (
                <Pressable
                  className={`flex-1 min-w-16 h-11 rounded-xl border-2 items-center justify-center ${
                    value === val
                      ? 'border-jim-primary bg-jim-primary/10'
                      : 'border-jim-border bg-jim-surface'
                  }`}
                  onPress={() => onChange(val)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: value === val }}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      value === val ? 'text-jim-primary' : 'text-jim-text'
                    }`}
                  >
                    {val}%
                  </Text>
                </Pressable>
              )}
            />
          ))}
        </View>

        {/* Saisie manuelle */}
        <Controller
          control={control}
          name="retrocession"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text ${
                errors.retrocession ? 'border-jim-destructive' : 'border-jim-border'
              }`}
              placeholder="Autre valeur (0-100)"
              placeholderTextColor="#8892A4"
              onChangeText={(t) => {
                const n = parseFloat(t);
                if (!isNaN(n)) onChange(n);
              }}
              value={value?.toString()}
              keyboardType="decimal-pad"
              accessibilityLabel="Taux de rétrocession personnalisé"
            />
          )}
        />
        {errors.retrocession && (
          <Text className="text-jim-destructive text-xs">{errors.retrocession.message}</Text>
        )}

        {/* Indicateur moyenne zone — branché par frontend-developer avec useRetrocessionMoyenne */}
        <RetrocessionIndicator moyenne={null} currentValue={retrocessionValue} />
      </View>

      <Pressable
        className="h-14 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
        onPress={onNext}
        accessibilityRole="button"
      >
        <Text className="text-white font-semibold text-base">Continuer →</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Étape 3 : Détails optionnels ───────────────────────────────────────────

function Step3({
  form,
  onSubmit,
  isSubmitting,
}: {
  form: ReturnType<typeof useForm<AnnonceStep3Data>>;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const { control } = form;

  return (
    <Animated.View entering={FadeInRight.duration(300)} className="gap-6">
      <View className="bg-jim-primary/5 border border-jim-primary/20 rounded-2xl p-4">
        <Text className="text-jim-primary font-medium text-sm">
          Ces informations sont optionnelles mais augmentent vos chances de trouver un remplaçant
        </Text>
      </View>

      {/* Type de cabinet */}
      <View className="gap-2">
        <Text className="text-jim-text font-medium text-sm">Type de cabinet</Text>
        <Controller
          control={control}
          name="type_cabinet"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-2">
              {(
                [
                  { key: 'liberal', label: 'Libéral' },
                  { key: 'groupe', label: 'Cabinet groupe' },
                  { key: 'centre', label: 'Centre' },
                  { key: 'hopital', label: 'Hôpital' },
                ] as const
              ).map(({ key, label }) => (
                <Pressable
                  key={key}
                  className={`px-4 py-2.5 rounded-xl border-2 ${
                    value === key
                      ? 'border-jim-secondary bg-jim-secondary/10'
                      : 'border-jim-border bg-jim-surface'
                  }`}
                  onPress={() => onChange(value === key ? undefined : key)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: value === key }}
                >
                  <Text
                    className={`font-medium text-sm ${
                      value === key ? 'text-jim-secondary' : 'text-jim-text'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
      </View>

      {/* Description */}
      <View className="gap-2">
        <Text className="text-jim-text font-medium text-sm">Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-jim-surface border border-jim-border rounded-xl px-4 py-3 text-jim-text"
              placeholder="Type de patientèle, logement proposé, parking..."
              placeholderTextColor="#8892A4"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={1000}
              accessibilityLabel="Description de l'annonce"
            />
          )}
        />
      </View>

      {/* Bouton publier */}
      <Pressable
        className={`h-14 rounded-xl items-center justify-center ${
          isSubmitting ? 'bg-jim-primary/50' : 'bg-jim-primary active:bg-jim-primary/90'
        }`}
        onPress={onSubmit}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Publier l'annonce"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-base">Publier l'annonce</Text>
        )}
      </Pressable>

      <Pressable
        className="items-center py-3"
        onPress={onSubmit}
        disabled={isSubmitting}
        accessibilityRole="button"
      >
        <Text className="text-jim-muted text-sm">Publier sans les détails optionnels</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Écran de succès post-publication ───────────────────────────────────────

function PublicationSuccess({ onPress }: { onPress: () => void }) {
  return (
    <View className="flex-1 bg-jim-background items-center justify-center px-8">
      <Animated.View entering={FadeInDown.duration(600).springify()} className="items-center gap-6">
        {/* Icône succès */}
        <View className="w-24 h-24 rounded-full bg-jim-success/10 border-2 border-jim-success items-center justify-center">
          <Text className="text-5xl">✓</Text>
        </View>

        {/* Message principal */}
        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-jim-text text-center">
            Annonce en ligne !
          </Text>
          <Text className="text-jim-muted text-center leading-6">
            Les kinésithérapeutes remplaçants de votre zone seront notifiés automatiquement.
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          className="bg-jim-primary h-14 rounded-xl px-8 items-center justify-center active:bg-jim-primary/90"
          onPress={onPress}
          accessibilityRole="button"
        >
          <Text className="text-white font-semibold text-base">Voir mes annonces</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
