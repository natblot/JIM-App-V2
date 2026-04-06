// Hook useContactProfile — Epic 6, fiche profil post-acceptation
// PLACEHOLDER — retourne des données mockées en attendant le frontend-developer
// L'interface finale sera : useContactProfile(supabase, userId) → { data, isLoading, error }
import type { SupabaseClient } from '@jim/shared/adapters/supabase';

export interface ContactProfile {
  userId: string;
  fullName: string;
  rppsVerified: boolean;
  specialties: string[];
  email: string | null;
  phone: string | null;
  /** true si la candidature a été acceptée → coordonnées visibles */
  canSeeContactInfo: boolean;
  isFavorite: boolean;
}

// Donnée mockée pour permettre le développement UI en parallèle
const MOCK_PROFILE: ContactProfile = {
  userId: 'user-other',
  fullName: 'Marie Dupont',
  rppsVerified: true,
  specialties: ['Kinésithérapie du sport', 'Rééducation neurologique'],
  email: 'marie.dupont@example.com',
  phone: '06 12 34 56 78',
  canSeeContactInfo: true,
  isFavorite: false,
};

/**
 * Récupère le profil complet d'un contact.
 * Les coordonnées (email, téléphone) sont exposées uniquement si la candidature a été acceptée
 * (RLS gère cela côté Supabase via la colonne can_see_contact_info ou une jointure avec candidatures).
 *
 * @param supabase - Client Supabase initialisé
 * @param userId - auth.uid() du contact (participant_1_id ou participant_2_id)
 */
export function useContactProfile(_supabase: SupabaseClient, userId: string) {
  // TODO (frontend-developer): remplacer par useQuery TanStack Query :
  // SELECT p.user_id, p.full_name, p.rpps_verified, p.specialties,
  //        p.email, p.phone,
  //        (SELECT COUNT(*) > 0 FROM candidatures c
  //         WHERE (c.candidat_id = auth.uid() OR c.annonce_owner_id = auth.uid())
  //           AND c.statut = 'acceptee'
  //           AND (c.candidat_id = userId OR c.annonce_owner_id = userId)) AS can_see_contact_info
  // FROM profiles p
  // WHERE p.user_id = userId

  return {
    data: userId === 'user-other' ? MOCK_PROFILE : null,
    isLoading: false,
    error: null,
  };
}
