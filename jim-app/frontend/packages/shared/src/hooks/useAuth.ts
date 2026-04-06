import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SignUpFormData, SignInFormData, MagicLinkFormData } from '../validators/auth.schema';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type TypedSupabaseClient = SupabaseClient<Database>;

// Clés de query centralisées
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// Hook: récupérer le profil courant
export function useCurrentProfile(supabase: TypedSupabaseClient) {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook: inscription email/mot de passe
export function useSignUp(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Pick<SignUpFormData, 'email' | 'password' | 'firstName' | 'lastName' | 'role'>) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
          },
        },
      });

      if (error) {
        // Traduire les erreurs Supabase Auth en français
        if (error.message.includes('User already registered')) {
          throw new Error('Un compte existe déjà avec cet email. Connectez-vous.');
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Trop de tentatives. Réessayez dans quelques minutes.');
        }
        throw new Error("Une erreur est survenue lors de l'inscription. Réessayez.");
      }

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

// Hook: connexion email/mot de passe
export function useSignIn(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error("Confirmez votre email avant de vous connecter. Vérifiez votre boîte mail.");
        }
        throw new Error('Une erreur est survenue. Réessayez.');
      }

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

// Hook: magic link
export function useMagicLink(supabase: TypedSupabaseClient) {
  return useMutation({
    mutationFn: async (data: MagicLinkFormData) => {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: false, // Magic link pour utilisateurs existants uniquement
        },
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error('Trop de tentatives. Réessayez dans 1 minute.');
        }
        // Ne pas révéler si l'email existe ou non (sécurité)
        // On retourne un succès même si l'email n'existe pas
        if (!error.message.includes('not found')) {
          throw new Error("Impossible d'envoyer le lien. Réessayez.");
        }
      }

      // Toujours retourner un succès pour la sécurité (ne pas révéler si compte existe)
      return { success: true };
    },
  });
}

// Hook: déconnexion
export function useSignOut(supabase: TypedSupabaseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scope: 'local' | 'global' = 'local') => {
      const { error } = await supabase.auth.signOut({ scope });
      if (error) throw new Error('Déconnexion échouée. Réessayez.');
    },
    onSuccess: () => {
      // Vider tout le cache TanStack Query à la déconnexion
      queryClient.clear();
    },
  });
}
