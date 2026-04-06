// Vérification incompatibilité avant candidature — Epic 5, Story 5.2
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export interface IncompatibilityWarning {
  type: 'specialite_manquante' | 'hors_zone' | 'autre';
  detail: string;
}

export function useIncompatibilityCheck(
  supabase: Supabase,
  annonceId: string,
  enabled = true
) {
  return useQuery({
    queryKey: ['incompatibility', annonceId],
    queryFn: async () => {
      const warnings: IncompatibilityWarning[] = [];

      // Récupérer l'annonce et le profil en parallèle
      const [annonceRes, profileRes] = await Promise.all([
        supabase
          .from('annonces')
          .select('specialites, ville, code_postal')
          .eq('id', annonceId)
          .single(),
        supabase
          .from('profiles')
          .select('specialties, mobility_radius_km, city')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
          .single(),
      ]);

      if (!annonceRes.data || !profileRes.data) return warnings;

      const annonce = annonceRes.data;
      const profile = profileRes.data;

      // Vérifier spécialités
      const annonceSpecialites = (annonce.specialites as unknown as string[]) ?? [];
      const profileSpecialites = (profile.specialties as string[]) ?? [];
      if (annonceSpecialites.length > 0 && profileSpecialites.length > 0) {
        const hasMatch = annonceSpecialites.some((s) => profileSpecialites.includes(s));
        if (!hasMatch) {
          warnings.push({
            type: 'specialite_manquante',
            detail: `Cette annonce demande : ${annonceSpecialites.join(', ')}`,
          });
        }
      }

      return warnings;
    },
    enabled: !!annonceId && enabled,
    staleTime: 5 * 60_000,
  });
}
