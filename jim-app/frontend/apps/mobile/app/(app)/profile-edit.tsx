import { useState } from 'react';
import {
  View, Text, Pressable, TextInput,
  ScrollView, KeyboardAvoidingView, Platform,
  ActivityIndicator, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  updateProfileSchema, type UpdateProfileFormData,
  KINE_SPECIALTIES, getProfileCompleteness,
} from '@jim/shared';
import { useMyProfile, useUpdateProfile, useUploadAvatar } from '@jim/shared';
import { supabase } from '../_layout';

// Composant pour afficher la barre de complétude du profil
function CompletenessBar({ score, missing }: { score: number; missing: string[] }) {
  const color = score >= 80 ? 'bg-jim-success' : score >= 50 ? 'bg-jim-accent' : 'bg-jim-destructive';

  return (
    <View className="bg-jim-surface border border-jim-border rounded-xl p-4 mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-jim-text font-semibold text-sm">Complétude du profil</Text>
        <Text className={`font-bold text-sm ${score >= 80 ? 'text-jim-success' : score >= 50 ? 'text-jim-accent' : 'text-jim-destructive'}`}>
          {score}%
        </Text>
      </View>
      {/* Barre de progression */}
      <View className="h-2 bg-jim-border rounded-full overflow-hidden">
        <View className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </View>
      {score < 100 && missing.length > 0 && (
        <Text className="text-jim-muted text-xs mt-2">
          Manque : {missing.slice(0, 2).join(', ')}{missing.length > 2 ? ` +${missing.length - 2}` : ''}
        </Text>
      )}
      {score >= 80 && (
        <Text className="text-jim-success text-xs mt-2 font-medium">
          Profil attractif — 3x plus de réponses avec profil complet
        </Text>
      )}
    </View>
  );
}

export default function ProfileEditScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useMyProfile(supabase);
  const updateProfile = useUpdateProfile(supabase);
  const uploadAvatar = useUploadAvatar(supabase);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Valeurs par défaut du formulaire — on force chaque champ à ne jamais être undefined
  // pour éviter les erreurs exactOptionalPropertyTypes en mode strict
  const formValues = profile ? {
    firstName: profile.first_name ?? '',
    lastName: profile.last_name ?? '',
    bio: profile.bio ?? '',
    specialties: (profile.specialties as string[] | null) ?? [],
    mobilityRadiusKm: profile.mobility_radius_km ?? 50,
    city: profile.city ?? '',
    phone: profile.phone ?? '',
  } : {
    firstName: '',
    lastName: '',
    bio: '',
    specialties: [] as string[],
    mobilityRadiusKm: 50,
    city: '',
    phone: '',
  };

  const { control, handleSubmit, watch, formState: { errors, isDirty } } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: formValues,
  });

  const selectedSpecialties = watch('specialties') ?? [];
  const mobilityRadius = watch('mobilityRadiusKm') ?? 50;

  // Calcul complétude — on passe uniquement les champs définis pour respecter exactOptionalPropertyTypes
  const completeness = profile
    ? getProfileCompleteness({
        ...(profile.avatar_url !== undefined && { avatar_url: profile.avatar_url }),
        ...(profile.bio !== undefined && { bio: profile.bio }),
        ...(profile.specialties !== null && profile.specialties !== undefined && { specialties: profile.specialties as string[] }),
        ...(profile.mobility_radius_km !== null && profile.mobility_radius_km !== undefined && { mobility_radius_km: profile.mobility_radius_km }),
        ...(profile.phone !== undefined && { phone: profile.phone }),
        ...(profile.rpps_verified !== null && profile.rpps_verified !== undefined && { rpps_verified: profile.rpps_verified }),
      })
    : { score: 0, missing: [] };

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Erreur affichée via updateProfile.error
    }
  };

  const toggleSpecialty = (code: string, onChange: (val: string[]) => void) => {
    const current = selectedSpecialties;
    if (current.includes(code)) {
      onChange(current.filter((s) => s !== code));
    } else {
      onChange([...current, code]);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-jim-background items-center justify-center">
        <ActivityIndicator color="#3B6BFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-jim-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-center mb-6">
          <Pressable
            className="w-11 h-11 items-center justify-center mr-3"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Text className="text-jim-primary text-2xl">‹</Text>
          </Pressable>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-jim-text">Mon profil</Text>
            {profile?.rpps_verified && (
              <View className="flex-row items-center gap-1 mt-0.5">
                <View className="w-2 h-2 rounded-full bg-jim-success" />
                <Text className="text-jim-success text-xs font-medium">RPPS vérifié</Text>
              </View>
            )}
          </View>
          {/* Bouton Enregistrer sticky */}
          {isDirty && (
            <Pressable
              className={`h-9 px-4 rounded-lg items-center justify-center
                ${updateProfile.isPending ? 'bg-jim-primary/50' : 'bg-jim-primary'}`}
              onPress={handleSubmit(onSubmit)}
              disabled={updateProfile.isPending}
              accessibilityRole="button"
              accessibilityLabel="Enregistrer les modifications"
            >
              {updateProfile.isPending
                ? <ActivityIndicator color="white" size="small" />
                : <Text className="text-white font-semibold text-sm">Enregistrer</Text>
              }
            </Pressable>
          )}
        </Animated.View>

        {/* Barre de complétude */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <CompletenessBar score={completeness.score} missing={completeness.missing} />
        </Animated.View>

        {/* Photo de profil */}
        <Animated.View entering={FadeInDown.duration(400).delay(75)} className="items-center mb-8">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-jim-border overflow-hidden">
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  className="w-full h-full"
                  accessibilityLabel="Photo de profil"
                />
              ) : (
                <View className="w-full h-full bg-jim-primary/10 items-center justify-center">
                  <Text className="text-3xl">👤</Text>
                </View>
              )}
            </View>
            <Pressable
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-jim-primary rounded-full items-center justify-center border-2 border-white"
              onPress={async () => {
                // TODO: expo-image-picker — Story 1.7 AC
                // Nécessite permission caméra/galerie demandée au bon moment
              }}
              accessibilityRole="button"
              accessibilityLabel="Changer la photo de profil"
            >
              <Text className="text-white text-sm">✏️</Text>
            </Pressable>
          </View>
          {uploadAvatar.isPending && (
            <Text className="text-jim-muted text-xs mt-2">Upload en cours…</Text>
          )}
        </Animated.View>

        {/* Identité */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="mb-6">
          <Text className="text-jim-text font-semibold mb-3">Identité</Text>
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-jim-muted text-xs mb-1">Prénom</Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                      ${errors.firstName ? 'border-jim-destructive' : 'border-jim-border'}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    autoCapitalize="words"
                    accessibilityLabel="Prénom"
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Text className="text-jim-muted text-xs mb-1">Nom</Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                      ${errors.lastName ? 'border-jim-destructive' : 'border-jim-border'}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    autoCapitalize="characters"
                    accessibilityLabel="Nom de famille"
                  />
                )}
              />
            </View>
          </View>

          {/* Bio */}
          <Text className="text-jim-muted text-xs mb-1">Présentation (optionnel)</Text>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-jim-surface border rounded-xl px-4 py-3 text-jim-text
                  ${errors.bio ? 'border-jim-destructive' : 'border-jim-border'}`}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
                placeholder="Ex : Kinésithérapeute spécialisé en rééducation orthopédique, 8 ans d'expérience…"
                placeholderTextColor="#8892A4"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                maxLength={500}
                accessibilityLabel="Présentation personnelle"
              />
            )}
          />
          <View className="flex-row justify-end mt-1">
            <Text className="text-jim-muted text-xs">{(watch('bio') ?? '').length}/500</Text>
          </View>
        </Animated.View>

        {/* Spécialités */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} className="mb-6">
          <Text className="text-jim-text font-semibold mb-1">Spécialités</Text>
          <Text className="text-jim-muted text-xs mb-3">
            Sélectionnez vos domaines d'expertise — améliore le matching des annonces
          </Text>
          <Controller
            control={control}
            name="specialties"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {KINE_SPECIALTIES.map((specialty) => {
                  const isSelected = (value ?? []).includes(specialty.code);
                  return (
                    <Pressable
                      key={specialty.code}
                      className={`px-3 py-2 rounded-full border
                        ${isSelected
                          ? 'bg-jim-primary border-jim-primary'
                          : 'bg-jim-surface border-jim-border'}`}
                      onPress={() => toggleSpecialty(specialty.code, onChange)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                      accessibilityLabel={specialty.label}
                    >
                      <Text className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-jim-text'}`}>
                        {specialty.label.replace('Kinésithérapie ', '')}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </Animated.View>

        {/* Zone de mobilité */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="mb-6">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-jim-text font-semibold">Zone de mobilité</Text>
            <View className="bg-jim-primary/10 rounded-full px-3 py-1">
              <Text className="text-jim-primary font-bold text-sm">{mobilityRadius} km</Text>
            </View>
          </View>
          <Text className="text-jim-muted text-xs mb-4">
            Distance maximale que vous acceptez de parcourir pour un remplacement
          </Text>
          <Controller
            control={control}
            name="mobilityRadiusKm"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                {/* Presets rapides */}
                <View className="flex-row gap-2">
                  {[10, 25, 50, 100, 200].map((km) => (
                    <Pressable
                      key={km}
                      className={`flex-1 h-10 rounded-lg border items-center justify-center
                        ${value === km
                          ? 'bg-jim-primary border-jim-primary'
                          : 'bg-jim-surface border-jim-border'}`}
                      onPress={() => onChange(km)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: value === km }}
                      accessibilityLabel={`${km} kilomètres`}
                    >
                      <Text className={`text-sm font-medium ${value === km ? 'text-white' : 'text-jim-text'}`}>
                        {km} km
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          />
        </Animated.View>

        {/* Ville + téléphone */}
        <Animated.View entering={FadeInDown.duration(400).delay(225)} className="mb-6">
          <Text className="text-jim-text font-semibold mb-3">Contact & localisation</Text>
          <View className="gap-3">
            <View>
              <Text className="text-jim-muted text-xs mb-1">Ville principale</Text>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-12 bg-jim-surface border border-jim-border rounded-xl px-4 text-jim-text"
                    placeholder="Lille"
                    placeholderTextColor="#8892A4"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    autoCapitalize="words"
                    accessibilityLabel="Ville principale d'exercice"
                  />
                )}
              />
            </View>
            <View>
              <Text className="text-jim-muted text-xs mb-1">
                Téléphone <Text className="text-jim-muted">(visible uniquement après acceptation)</Text>
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                      ${errors.phone ? 'border-jim-destructive' : 'border-jim-border'}`}
                    placeholder="06 12 34 56 78"
                    placeholderTextColor="#8892A4"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    keyboardType="phone-pad"
                    accessibilityLabel="Numéro de téléphone"
                  />
                )}
              />
              {errors.phone && (
                <Text className="text-jim-destructive text-xs mt-1">{errors.phone.message}</Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Feedback succès */}
        {saveSuccess && (
          <View className="bg-jim-success/10 border border-jim-success/30 rounded-xl p-4 mb-4">
            <Text className="text-jim-success text-sm font-medium text-center">
              Profil mis à jour avec succès
            </Text>
          </View>
        )}

        {updateProfile.error && (
          <View className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-4 mb-4">
            <Text className="text-jim-destructive text-sm">{updateProfile.error.message}</Text>
          </View>
        )}

        {/* Bouton enregistrer bas de page */}
        <Pressable
          className={`h-14 rounded-xl items-center justify-center
            ${!isDirty || updateProfile.isPending ? 'bg-jim-primary/40' : 'bg-jim-primary active:bg-jim-primary/90'}`}
          onPress={handleSubmit(onSubmit)}
          disabled={!isDirty || updateProfile.isPending}
          accessibilityRole="button"
          accessibilityLabel="Enregistrer les modifications du profil"
          accessibilityState={{ disabled: !isDirty }}
        >
          {updateProfile.isPending
            ? <ActivityIndicator color="white" />
            : <Text className="text-white font-semibold text-base">
                {isDirty ? 'Enregistrer' : 'Profil à jour'}
              </Text>
          }
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
