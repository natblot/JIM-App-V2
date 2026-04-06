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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { signUpSchema, type SignUpFormData, useSignUp } from '@jim/shared';
import { supabase } from '../_layout';

// Écran d'inscription — Story 1.2
// Formulaire : rôle + prénom + nom + email + mot de passe + CGU
export default function SignUpScreen() {
  const router = useRouter();
  const signUp = useSignUp(supabase);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    // Pas de defaultValues pour role et cguAccepted — champs obligatoires sans valeur initiale
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp.mutateAsync({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });
      // Redirection vers vérification RPPS (Story 1.4)
      router.replace('/(auth)/rpps-verify' as never);
    } catch {
      // L'erreur est exposée via signUp.error
    }
  };

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
          <Pressable
            className="w-11 h-11 items-center justify-center mb-6"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-jim-primary text-2xl">‹</Text>
          </Pressable>
          <Text className="text-3xl font-bold text-jim-text">
            Créer un compte
          </Text>
          <Text className="text-jim-muted mt-1">
            Rejoignez le réseau des kinésithérapeutes vérifiés
          </Text>
        </Animated.View>

        {/* Sélection du rôle */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(50)}
          className="mb-6"
        >
          <Text className="text-jim-text font-medium mb-3">Je suis…</Text>
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-3">
                {/* Card remplaçant */}
                <Pressable
                  className={`flex-1 h-24 rounded-xl border-2 items-center justify-center gap-1
                    ${
                      value === 'remplacant'
                        ? 'border-jim-primary bg-jim-primary/10'
                        : 'border-jim-border bg-jim-surface'
                    }`}
                  onPress={() => onChange('remplacant')}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: value === 'remplacant' }}
                  accessibilityLabel="Remplaçant — je cherche des remplacements"
                >
                  <Text className="text-2xl" aria-hidden>🔄</Text>
                  <Text
                    className={`font-semibold text-sm ${
                      value === 'remplacant'
                        ? 'text-jim-primary'
                        : 'text-jim-text'
                    }`}
                  >
                    Remplaçant
                  </Text>
                  <Text className="text-jim-muted text-xs">
                    Je cherche des remplacements
                  </Text>
                </Pressable>

                {/* Card titulaire */}
                <Pressable
                  className={`flex-1 h-24 rounded-xl border-2 items-center justify-center gap-1
                    ${
                      value === 'titulaire'
                        ? 'border-jim-primary bg-jim-primary/10'
                        : 'border-jim-border bg-jim-surface'
                    }`}
                  onPress={() => onChange('titulaire')}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: value === 'titulaire' }}
                  accessibilityLabel="Titulaire — je publie des annonces"
                >
                  <Text className="text-2xl" aria-hidden>🏥</Text>
                  <Text
                    className={`font-semibold text-sm ${
                      value === 'titulaire'
                        ? 'text-jim-primary'
                        : 'text-jim-text'
                    }`}
                  >
                    Titulaire
                  </Text>
                  <Text className="text-jim-muted text-xs">
                    Je publie des annonces
                  </Text>
                </Pressable>
              </View>
            )}
          />
          {errors.role && (
            <Text className="text-jim-destructive text-sm mt-2">
              {errors.role.message}
            </Text>
          )}
        </Animated.View>

        {/* Prénom + Nom */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          className="flex-row gap-3 mb-4"
        >
          {/* Prénom */}
          <View className="flex-1">
            <Text className="text-jim-text font-medium mb-2 text-sm">
              Prénom
            </Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                    ${
                      errors.firstName
                        ? 'border-jim-destructive'
                        : 'border-jim-border'
                    }`}
                  placeholder="Léa"
                  placeholderTextColor="#8892A4"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="words"
                  autoComplete="given-name"
                  accessibilityLabel="Prénom"
                />
              )}
            />
            {errors.firstName && (
              <Text className="text-jim-destructive text-xs mt-1">
                {errors.firstName.message}
              </Text>
            )}
          </View>

          {/* Nom */}
          <View className="flex-1">
            <Text className="text-jim-text font-medium mb-2 text-sm">Nom</Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                    ${
                      errors.lastName
                        ? 'border-jim-destructive'
                        : 'border-jim-border'
                    }`}
                  placeholder="Dupont"
                  placeholderTextColor="#8892A4"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="words"
                  autoComplete="family-name"
                  accessibilityLabel="Nom de famille"
                />
              )}
            />
            {errors.lastName && (
              <Text className="text-jim-destructive text-xs mt-1">
                {errors.lastName.message}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Email */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(150)}
          className="mb-4"
        >
          <Text className="text-jim-text font-medium mb-2 text-sm">
            Email professionnel
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                  ${
                    errors.email
                      ? 'border-jim-destructive'
                      : 'border-jim-border'
                  }`}
                placeholder="lea.dupont@gmail.com"
                placeholderTextColor="#8892A4"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                accessibilityLabel="Adresse email professionnelle"
              />
            )}
          />
          {errors.email && (
            <Text className="text-jim-destructive text-sm mt-1">
              {errors.email.message}
            </Text>
          )}
        </Animated.View>

        {/* Mot de passe */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          className="mb-4"
        >
          <Text className="text-jim-text font-medium mb-2 text-sm">
            Mot de passe
          </Text>
          <View className="relative">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 bg-jim-surface border rounded-xl px-4 pr-12 text-jim-text
                    ${
                      errors.password
                        ? 'border-jim-destructive'
                        : 'border-jim-border'
                    }`}
                  placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
                  placeholderTextColor="#8892A4"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  accessibilityLabel="Mot de passe"
                />
              )}
            />
            {/* Bouton afficher/masquer — zone tap 44×44 */}
            <Pressable
              className="absolute right-0 top-0 w-12 h-12 items-center justify-center"
              onPress={() => setShowPassword((v) => !v)}
              accessibilityLabel={
                showPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              }
            >
              <Text className="text-jim-muted text-base">
                {showPassword ? '🙈' : '👁'}
              </Text>
            </Pressable>
          </View>
          {errors.password && (
            <Text className="text-jim-destructive text-sm mt-1">
              {errors.password.message}
            </Text>
          )}
        </Animated.View>

        {/* Confirmation mot de passe */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(225)}
          className="mb-6"
        >
          <Text className="text-jim-text font-medium mb-2 text-sm">
            Confirmer le mot de passe
          </Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                  ${
                    errors.confirmPassword
                      ? 'border-jim-destructive'
                      : 'border-jim-border'
                  }`}
                placeholder="Répétez votre mot de passe"
                placeholderTextColor="#8892A4"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                autoComplete="new-password"
                accessibilityLabel="Confirmer le mot de passe"
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-jim-destructive text-sm mt-1">
              {errors.confirmPassword.message}
            </Text>
          )}
        </Animated.View>

        {/* Checkbox CGU */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(250)}
          className="mb-6"
        >
          <Controller
            control={control}
            name="cguAccepted"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row items-start gap-3">
                {/* Case à cocher — zone tap 44×44 */}
                <Pressable
                  className="w-11 h-11 items-center justify-center -ml-2.5 -mt-2.5 flex-shrink-0"
                  onPress={() => onChange(value ? undefined : true)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: value === true }}
                  accessibilityLabel="Accepter les CGU et la politique de confidentialité"
                >
                  <View
                    className={`w-6 h-6 rounded border-2 items-center justify-center
                      ${
                        value
                          ? 'bg-jim-primary border-jim-primary'
                          : 'bg-jim-surface border-jim-border'
                      }`}
                  >
                    {value === true && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                </Pressable>
                {/* Texte avec liens cliquables vers les écrans légaux */}
                <Text className="text-jim-muted text-sm flex-1 leading-5 mt-0.5">
                  J'accepte les{' '}
                  <Text
                    className="text-jim-primary font-medium"
                    onPress={() => router.push('/(auth)/cgu' as never)}
                    accessibilityRole="link"
                    accessibilityLabel="Lire les Conditions Générales d'Utilisation"
                  >
                    Conditions Générales d'Utilisation
                  </Text>{' '}
                  et la{' '}
                  <Text
                    className="text-jim-primary font-medium"
                    onPress={() => router.push('/(auth)/privacy' as never)}
                    accessibilityRole="link"
                    accessibilityLabel="Lire la Politique de confidentialité"
                  >
                    Politique de confidentialité
                  </Text>
                </Text>
              </View>
            )}
          />
          {errors.cguAccepted && (
            <Text className="text-jim-destructive text-sm mt-2">
              {errors.cguAccepted.message}
            </Text>
          )}
        </Animated.View>

        {/* Erreur serveur */}
        {signUp.error && (
          <View className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-4 mb-4">
            <Text className="text-jim-destructive text-sm">
              {signUp.error.message}
            </Text>
          </View>
        )}

        {/* Bouton S'inscrire */}
        <Pressable
          className={`h-14 rounded-xl items-center justify-center
            ${
              isSubmitting || signUp.isPending
                ? 'bg-jim-primary/50'
                : 'bg-jim-primary active:bg-jim-primary/90'
            }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || signUp.isPending}
          accessibilityRole="button"
          accessibilityLabel="Créer mon compte"
          accessibilityState={{ disabled: isSubmitting || signUp.isPending }}
        >
          {isSubmitting || signUp.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Créer mon compte
            </Text>
          )}
        </Pressable>

        {/* Lien vers connexion */}
        <Pressable
          className="mt-4 items-center py-3"
          onPress={() => router.push('/(auth)/sign-in')}
          accessibilityRole="link"
        >
          <Text className="text-jim-muted text-sm">
            Déjà inscrit ?{' '}
            <Text className="text-jim-primary font-medium">Se connecter</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
