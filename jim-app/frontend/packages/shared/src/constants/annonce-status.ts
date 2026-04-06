// Constantes des statuts d'annonces — source unique
export const ANNONCE_STATUS = {
  ACTIVE: 'active',
  EN_COURS: 'en_cours',
  NON_CONFIRMEE: 'non_confirmee',
  SOURCE_EXTERNE: 'source_externe',
  POURVUE: 'pourvue',
  EXPIREE: 'expiree',
} as const;

export type AnnonceStatus = (typeof ANNONCE_STATUS)[keyof typeof ANNONCE_STATUS];

// Labels affichés en français
export const ANNONCE_STATUS_LABELS: Record<AnnonceStatus, string> = {
  active: 'Active',
  en_cours: 'En cours',
  non_confirmee: 'Non confirmée',
  source_externe: 'Source externe',
  pourvue: 'Pourvue',
  expiree: 'Expirée',
};

// Couleurs (tokens design JIM) par statut
export const ANNONCE_STATUS_COLORS: Record<AnnonceStatus, string> = {
  active: 'jim-success',
  en_cours: 'jim-accent',
  non_confirmee: 'jim-muted',
  source_externe: 'jim-primary',
  pourvue: 'jim-muted',
  expiree: 'jim-text',
};
