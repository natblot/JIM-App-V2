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
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  magicLinkSchema,
  signInSchema,
  type MagicLinkFormData,
  type SignInFormData,
  useMagicLink,
  useSignIn,
} from '@jim/shared';
import { supabase } from '../_layout';

// Mode de connexion — magic link = option principale (Michel, 52 ans, entre deux patients)
type AuthMode = 'magic-link' | 'password';

// Écran de connexion — Story 1.3
// Toggle entre magic link (principal) et email/mot de passe
export default function SignInScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('magic-link');

  const magicLink = useMagicLink(supabase);
  const signIn = useSignIn(supabase);

  // Formulaire magic link
  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: '' },
  });

  // Formulaire email/mot de passe
  const passwordForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onMagicLinkSubmit = async (data: MagicLinkFormData) => {
    try {
      await magicLink.mutateAsync(data);
      router.push({
        pathname: '/(auth)/magic-link-sent',
        params: { email: data.email },
      });
    } catch {
      // Erreur exposée via magicLink.error
    }
  };

  const onPasswordSubmit = async (data: SignInFormData) => {
    try {
      await signIn.mutateAsync(data);
      router.replace('/(app)');
    } catch {
      // Erreur exposée via signIn.error
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
            Se connecter
          </Text>
          <Text className="text-jim-muted mt-1">
            Bon retour — vos remplacements vous attendent
          </Text>
        </Animated.View>

        {/* Toggle magic link / mot de passe */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(50)}
          className="mb-6"
        >
          <View
            className="flex-row bg-jim-surface rounded-xl p-1 border border-jim-border"
            accessibilityRole="tablist"
          >
            <Pressable
              className={`flex-1 h-10 rounded-lg items-center justify-center
                ${mode === 'magic-link' ? 'bg-jim-primary shadow-sm' : ''}`}
              onPress={() => setMode('magic-link')}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'magic-link' }}
              accessibilityLabel="Connexion par lien email"
            >
              <Text
                className={`text-sm font-medium ${
                  mode === 'magic-link' ? 'text-white' : 'text-jim-muted'
                }`}
              >
                Lien email
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 h-10 rounded-lg items-center justify-center
                ${mode === 'password' ? 'bg-jim-primary shadow-sm' : ''}`}
              onPress={() => setMode('password')}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'password' }}
              accessibilityLabel="Connexion par mot de passe"
            >
              <Text
                className={`text-sm font-medium ${
                  mode === 'password' ? 'text-white' : 'text-jim-muted'
                }`}
              >
                Mot de passe
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Formulaire magic link */}
        {mode === 'magic-link' && (
          <Animated.View entering={FadeIn.duration(200)} className="gap-4">
            {/* Encadré explicatif — rassure Michel (52 ans) */}
            <View className="bg-jim-primary/10 rounded-xl p-4 border border-jim-primary/20">
              <Text className="text-jim-primary text-sm font-medium mb-1">
                Connexion sans mot de passe
              </Text>
              <Text className="text-jim-muted text-sm leading-5">
                On vous envoie un lien valable 6 heures — pratique entre deux
                patients.
              </Text>
            </View>

            <View>
              <Text className="text-jim-text font-medium mb-2 text-sm">
                Votre email
              </Text>
              <Controller
                control={magicLinkForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                      ${
                        magicLinkForm.formState.errors.email
                          ? 'border-jim-destructive'
                          : 'border-jim-border'
                      }`}
                    placeholder="michel.tournier@kine-nord.fr"
                    placeholderTextColor="#8892A4"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    accessibilityLabel="Adresse email"
                  />
                )}
              />
              {magicLinkForm.formState.errors.email && (
                <Text className="text-jim-destructive text-sm mt-1">
                  {magicLinkForm.formState.errors.email.message}
                </Text>
              )}
            </View>

            {magicLink.error && (
              <View className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-4">
                <Text className="text-jim-destructive text-sm">
                  {magicLink.error.message}
                </Text>
              </View>
            )}

            <Pressable
              className={`h-14 rounded-xl items-center justify-center mt-2
                ${
                  magicLink.isPending
                    ? 'bg-jim-primary/50'
                    : 'bg-jim-primary active:bg-jim-primary/90'
                }`}
              onPress={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
              disabled={magicLink.isPending}
              accessibilityRole="button"
              accessibilityLabel="Recevoir un lien de connexion"
              accessibilityState={{ disabled: magicLink.isPending }}
            >
              {magicLink.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Recevoir un lien de connexion
                </Text>
              )}
            </Pressable>
          </Animated.View>
        )}

        {/* Formulaire email/mot de passe */}
        {mode === 'password' && (
          <Animated.View entering={FadeIn.duration(200)} className="gap-4">
            <View>
              <Text className="text-jim-text font-medium mb-2 text-sm">
                Email
              </Text>
              <Controller
                control={passwordForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                      ${
                        passwordForm.formState.errors.email
                          ? 'border-jim-destructive'
                          : 'border-jim-border'
                      }`}
                    placeholder="votre@email.fr"
                    placeholderTextColor="#8892A4"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    accessibilityLabel="Adresse email"
                  />
                )}
              />
              {passwordForm.formState.errors.email && (
                <Text className="text-jim-destructive text-sm mt-1">
                  {passwordForm.formState.errors.email.message}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-jim-text font-medium mb-2 text-sm">
                Mot de passe
              </Text>
              <Controller
                control={passwordForm.control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 bg-jim-surface border rounded-xl px-4 text-jim-text
                      ${
                        passwordForm.formState.errors.password
                          ? 'border-jim-destructive'
                          : 'border-jim-border'
                      }`}
                    placeholder="Votre mot de passe"
                    placeholderTextColor="#8892A4"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    autoComplete="current-password"
                    accessibilityLabel="Mot de passe"
                  />
                )}
              />
              {passwordForm.formState.errors.password && (
                <Text className="text-jim-destructive text-sm mt-1">
                  {passwordForm.formState.errors.password.message}
                </Text>
              )}
            </View>

            {signIn.error && (
              <View className="bg-jim-destructive/10 border border-jim-destructive/30 rounded-xl p-4">
                <Text className="text-jim-destructive text-sm">
                  {signIn.error.message}
                </Text>
              </View>
            )}

            <Pressable
              className={`h-14 rounded-xl items-center justify-center
                ${
                  signIn.isPending
                    ? 'bg-jim-primary/50'
                    : 'bg-jim-primary active:bg-jim-primary/90'
                }`}
              onPress={passwordForm.handleSubmit(onPasswordSubmit)}
              disabled={signIn.isPending}
              accessibilityRole="button"
              accessibilityLabel="Se connecter"
              accessibilityState={{ disabled: signIn.isPending }}
            >
              {signIn.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Se connecter
                </Text>
              )}
            </Pressable>
          </Animated.View>
        )}

        {/* Lien vers inscription */}
        <Pressable
          className="mt-6 items-center py-3"
          onPress={() => router.push('/(auth)/sign-up')}
          accessibilityRole="link"
        >
          <Text className="text-jim-muted text-sm">
            Pas encore de compte ?{' '}
            <Text className="text-jim-primary font-medium">Créer un compte</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
