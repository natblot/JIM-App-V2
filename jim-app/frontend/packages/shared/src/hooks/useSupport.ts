// Hooks support tickets — Epic 12, Story 12.5
import { useMutation, useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export interface SupportTicket {
  id: string;
  categorie: string;
  sujet: string;
  description: string;
  status: string;
  reponse: string | null;
  created_at: string;
}

export function useCreateSupportTicket(supabase: Supabase) {
  return useMutation({
    mutationFn: async (input: {
      categorie: string; sujet: string; description: string;
      appVersion?: string; deviceModel?: string; osVersion?: string; lastScreen?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('create-support-ticket', {
        body: {
          categorie: input.categorie, sujet: input.sujet, description: input.description,
          app_version: input.appVersion, device_model: input.deviceModel,
          os_version: input.osVersion, last_screen: input.lastScreen,
        },
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

export function useMesTickets(supabase: Supabase, userId: string | undefined) {
  return useQuery({
    queryKey: ['support-tickets', userId],
    queryFn: async (): Promise<SupportTicket[]> => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('id, categorie, sujet, description, status, reponse, created_at')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as SupportTicket[];
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
