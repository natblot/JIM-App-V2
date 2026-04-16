// Hook candidatures reçues par le titulaire + Realtime — Epic 5, Story 5.5
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { queryKeys } from './query-keys';
import type { CandidatureRow } from '../validators/candidature.schema';

type Supabase = SupabaseClient<Database>;

export function useCandidaturesRecues(supabase: Supabase, annonceId: string) {
  const queryClient = useQueryClient();

  // Realtime — nouvelles candidatures en temps réel pour le titulaire
  useEffect(() => {
    if (!annonceId) return;

    const channel = supabase
      .channel(`candidatures-annonce:${annonceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'candidatures',
          filter: `annonce_id=eq.${annonceId}`,
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.candidatures.byAnnonce(annonceId),
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [annonceId, supabase, queryClient]);

  return useQuery({
    queryKey: queryKeys.candidatures.byAnnonce(annonceId),
    queryFn: async () => {
      // Migration 076 : RLS profiles durcie -> on ne peut plus embed profiles directement.
      // On fetch d'abord les candidatures, puis on resoud les profils via profiles_public
      // (vue projetant uniquement les colonnes publiques) en 2e query + merge client.
      const { data: cands, error } = await supabase
        .from('candidatures')
        .select('*')
        .eq('annonce_id', annonceId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      const userIds = Array.from(
        new Set((cands ?? []).map((c) => c.remplacant_id).filter(Boolean) as string[])
      );
      let profileMap = new Map<string, Record<string, unknown>>();
      if (userIds.length > 0) {
        const { data: profs, error: profErr } = await supabase
          .from('profiles_public')
          .select('user_id, first_name, last_name, rpps_number, rpps_verified, specialties, mobility_radius_km, avatar_url')
          .in('user_id', userIds);
        if (profErr) throw new Error(profErr.message);
        profileMap = new Map((profs ?? []).map((p) => [p.user_id, p as Record<string, unknown>]));
      }

      // Re-injecte le profil sous la cle "profiles" pour preserver la shape attendue par
      // les composants consommateurs (CandidatureCard, etc.)
      return (cands ?? []).map((c) => ({
        ...c,
        profiles: profileMap.get(c.remplacant_id) ?? null,
      })) as unknown as CandidatureRow[];
    },
    enabled: !!annonceId,
    staleTime: 15_000,
  });
}
