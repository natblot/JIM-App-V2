// Interface standard pour toutes les sources d'agrégation
// Ajouter une source = implémenter cette interface + enregistrer dans source-registry.ts
import type { RawAnnonce, NormalizedAnnonce } from './types.ts';

export interface AggregationSource {
  /** Identifiant unique et stable de la source (ex: 'rempleo') */
  getSourceId(): string;

  /** Récupère les annonces brutes depuis la source externe */
  fetch(): Promise<RawAnnonce[]>;

  /** Normalise une annonce brute en format JIM — retourne null si invalide */
  normalize(raw: RawAnnonce): NormalizedAnnonce | null;

  /** Vérifie si une annonce existe encore sur la source (re-vérification FR61) */
  verify(sourceUrl: string): Promise<boolean>;
}
