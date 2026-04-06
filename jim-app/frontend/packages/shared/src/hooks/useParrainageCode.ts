// Hook code parrainage — Epic 11, Story 11.3
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export function useParrainageCode(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: ['parrainage', 'code', userId],
    queryFn: async (): Promise<string | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('parrainage_code')
        .eq('user_id', userId!)
        .single();
      if (error) throw new Error(error.message);
      return data?.parrainage_code ?? null;
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

export function useGenerateParrainageCode(supabase: Supabase) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('activate-parrainage', { body: {} });
      if (error) throw new Error(error.message);
      return data?.code as string;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['parrainage'] });
    },
  });
}

export function useParrainages(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: ['parrainage', 'list', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parrainages')
        .select('id, filleul_id, status, created_at, activated_at')
        .eq('parrain_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
