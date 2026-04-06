import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys } from './useAuth';
import type { UpdateProfileFormData } from '../validators/profile.schema';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type TypedSupabaseClient = SupabaseClient<Database>;

export const profileKeys = {
  all: ['profile'] as const,
  byUserId: (userId: string) => [...profileKeys.all, userId] as const,
};

// Hook: profil de l'utilisateur courant
export function useMyProfile(
  supabase: TypedSupabaseClient
) {
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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook: mise à jour profil via Edge Function
export function useUpdateProfile(
  supabase: TypedSupabaseClient
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileFormData) => {
      // Convertir camelCase → snake_case pour l'Edge Function
      const payload = {
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.specialties && { specialties: data.specialties }),
        ...(data.mobilityRadiusKm !== undefined && { mobility_radius_km: data.mobilityRadiusKm }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.phone !== undefined && { phone: data.phone }),
      };

      const { data: result, error } = await supabase.functions.invoke('update-profile', {
        body: payload,
      });

      if (error) throw new Error(error.message);

      const response = result as { data?: unknown; error?: { code: string; message: string } };
      if (response.error) throw new Error(response.error.message);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// Hook: upload photo de profil
export function useUploadAvatar(
  supabase: TypedSupabaseClient
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, imageUri }: { userId: string; imageUri: string }) => {
      // Convertir URI en blob pour Supabase Storage
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const fileName = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw new Error("Impossible d'uploader la photo. Réessayez.");

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Sauvegarder l'URL dans le profil via l'Edge Function
      await supabase.functions.invoke('update-profile', {
        body: { avatar_url: publicUrl },
      });

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}
