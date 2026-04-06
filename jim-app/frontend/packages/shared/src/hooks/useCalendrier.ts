// Hook CRUD disponibilités calendrier — Epic 7, Story 7.x
// profile_id = profiles.id (UUID PK) — PAS auth.uid() directement
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';

type Supabase = SupabaseClient<Database>;

// Types métier pour le calendrier — la table n'est pas encore dans les types générés (migration 033)
// À remplacer par Database['public']['Tables']['calendrier']['Row'] après supabase gen types
export type CalendrierType = 'disponible' | 'indisponible' | 'remplacement';

export interface CalendrierEntry {
  id: string;
  profile_id: string;
  date_debut: string; // ISO 8601 UTC
  date_fin: string;   // ISO 8601 UTC
  type: CalendrierType;
  candidature_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateCalendrierInput {
  date_debut: string; // ISO 8601 UTC
  date_fin: string;   // ISO 8601 UTC
  type: Exclude<CalendrierType, 'remplacement'>; // remplacement créé via addReplacement
  notes?: string;
}

// Récupère le profile_id (profiles.id) depuis auth.uid()
async function getProfileId(supabase: Supabase): Promise<string> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError ?? !user) throw new Error('Utilisateur non authentifié');

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Profil introuvable');

  return (data as { id: string }).id;
}

export function useCalendrier(supabase: Supabase) {
  const queryClient = useQueryClient();

  // Lecture de toutes les disponibilités de l'utilisateur courant
  const {
    data: entries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.calendrier.mine(),
    queryFn: async (): Promise<CalendrierEntry[]> => {
      const profileId = await getProfileId(supabase);

      const { data, error } = await supabase
        .from('calendrier')
        .select('*')
        .eq('profile_id', profileId)
        .order('date_debut', { ascending: true });

      if (error) throw new Error(error.message);

      return (data ?? []) as unknown as CalendrierEntry[];
    },
    staleTime: 60 * 1000, // 1 minute
  });

  // Mutation — ajout d'une disponibilité ou indisponibilité
  const addDisponibilite = useMutation({
    mutationFn: async (input: CreateCalendrierInput) => {
      const profileId = await getProfileId(supabase);

      const { data, error } = await supabase
        .from('calendrier')
        .insert({
          profile_id: profileId,
          date_debut: input.date_debut,
          date_fin: input.date_fin,
          type: input.type,
          candidature_id: null,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as unknown as CalendrierEntry;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.calendrier.mine() });
    },
  });

  // Mutation — suppression d'une entrée (interdit pour type = 'remplacement')
  const deleteDisponibilite = useMutation({
    mutationFn: async (id: string) => {
      // Vérification côté client — les remplacements ne peuvent pas être supprimés ici
      const current = entries?.find((e) => e.id === id);
      if (current?.type === 'remplacement') {
        throw new Error('Un remplacement confirmé ne peut pas être supprimé depuis le calendrier.');
      }

      const { error } = await supabase
        .from('calendrier')
        .delete()
        .eq('id', id)
        .neq('type', 'remplacement'); // Double protection côté DB

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.calendrier.mine() });
    },
  });

  // Mutation — ajout d'un remplacement confirmé (lié à une candidature acceptée)
  const addReplacement = useMutation({
    mutationFn: async ({
      date_debut,
      date_fin,
      candidature_id,
    }: {
      date_debut: string;
      date_fin: string;
      candidature_id: string;
    }) => {
      const profileId = await getProfileId(supabase);

      const { data, error } = await supabase
        .from('calendrier')
        .insert({
          profile_id: profileId,
          date_debut,
          date_fin,
          type: 'remplacement',
          candidature_id,
          notes: null,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as unknown as CalendrierEntry;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.calendrier.mine() });
    },
  });

  return {
    entries: entries ?? [],
    addDisponibilite,
    deleteDisponibilite,
    addReplacement,
    isLoading,
    isError,
  };
}
