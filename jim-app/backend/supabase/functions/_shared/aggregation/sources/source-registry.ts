// Registre des sources actives — ajouter une source = juste l'enregistrer ici
import type { AggregationSource } from '../aggregation-source.interface.ts';
import { RempleoSource } from './rempleo.source.ts';

// Sources disponibles (activer/désactiver sans toucher au code cœur)
const ACTIVE_SOURCES: AggregationSource[] = [
  new RempleoSource(),
  // new FacebookSource(),   // Phase 2 — PAS dans le MVP
  // new KneeSource(),       // Exemple d'extension future
];

export function getActiveSources(): AggregationSource[] {
  return ACTIVE_SOURCES;
}
