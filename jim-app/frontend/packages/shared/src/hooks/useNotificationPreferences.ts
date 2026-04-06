// Hook lecture/écriture des préférences push — Epic 7, Story 7.x
// Lit et met à jour les colonnes push_* + email_digest_enabled dans profiles
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

export interface NotificationPreferences {
  push_annonces: boolean;
  push_candidatures: boolean;
  push_messages: boolean;
  push_paused: boolean;
  email_digest_enabled: boolean;
}

// Valeurs par défaut — tout activé, aucune pause
const DEFAULT_PREFERENCES: NotificationPreferences = {
  push_annonces: true,
  push_candidatures: true,
  push_messages: true,
  push_paused: false,
  email_digest_enabled: false,
};

export function useNotificationPreferences(supabase: Supabase) {
  const queryClient = useQueryClient();

  // Lecture des préférences depuis profiles WHERE user_id = auth.uid()
  const { data: preferences, isLoading, isError } = useQuery({
    queryKey: queryKeys.profile.preferences(),
    queryFn: async (): Promise<NotificationPreferences> => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError ?? !user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('profiles')
        .select('push_annonces, push_candidatures, push_messages, push_paused, email_digest_enabled')
        .eq('user_id', user.id)
        .single();

      if (error) throw new Error(error.message);
      if (!data) return DEFAULT_PREFERENCES;

      // Cast explicite — les colonnes Epic 7 peuvent être absentes des types générés
      // tant que la migration 033 n'a pas été re-générée via supabase gen types
      const row = data as Record<string, unknown>;

      return {
        push_annonces: (row.push_annonces as boolean | null) ?? true,
        push_candidatures: (row.push_candidatures as boolean | null) ?? true,
        push_messages: (row.push_messages as boolean | null) ?? true,
        push_paused: (row.push_paused as boolean | null) ?? false,
        email_digest_enabled: (row.email_digest_enabled as boolean | null) ?? false,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — les préférences changent peu
  });

  // Mutation — met à jour les préférences dans profiles
  // Si tous les push sont désactivés → active automatiquement email_digest_enabled
  const updatePreferences = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError ?? !user) throw new Error('Utilisateur non authentifié');

      // Fusionner avec les valeurs actuelles pour détecter si tous les push sont éteints
      const merged: NotificationPreferences = {
        ...(preferences ?? DEFAULT_PREFERENCES),
        ...updates,
      };

      // Règle métier : si tous les canaux push sont désactivés, activer le digest email
      const allPushDisabled =
        !merged.push_annonces &&
        !merged.push_candidatures &&
        !merged.push_messages;

      const payload: Record<string, unknown> = {
        ...updates,
        ...(allPushDisabled ? { email_digest_enabled: true } : {}),
      };

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Invalider le cache pour forcer une re-lecture propre
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile.preferences() });
    },
  });

  return {
    preferences: preferences ?? DEFAULT_PREFERENCES,
    updatePreferences,
    isLoading,
    isError,
  };
}
