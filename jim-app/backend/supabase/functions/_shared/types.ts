// Types partagés pour les Edge Functions JIM

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Résultat de la vérification RPPS
export interface RppsVerificationResult {
  rpps_number: string;
  first_name: string;
  last_name: string;
  profession_code: string; // "50" = Kinésithérapeute
  profession_label: string;
  city: string | null;
  verified: boolean;
}

// Résultat de recherche RPPS
export interface RppsSearchResult {
  rpps_number: string;
  first_name: string;
  last_name: string;
  city: string | null;
  profession_label: string;
}

// Payload d'erreur RPPS
export type RppsErrorCode =
  | 'RPPS_NOT_FOUND'           // RPPS non trouvé dans l'Annuaire
  | 'RPPS_NAME_MISMATCH'       // RPPS trouvé mais nom ne correspond pas
  | 'RPPS_WRONG_PROFESSION'    // RPPS trouvé mais pas kinésithérapeute
  | 'RPPS_API_DOWN'            // API Annuaire Santé indisponible
  | 'RPPS_RATE_LIMITED'        // Rate limiting de l'API
  | 'RPPS_ALREADY_VERIFIED'    // RPPS déjà vérifié (cache valide)
  | 'VALIDATION_INVALID_RPPS'  // Format RPPS invalide
  | 'AUTH_REQUIRED'            // Utilisateur non authentifié
  | 'SYSTEM_ERROR';            // Erreur interne
