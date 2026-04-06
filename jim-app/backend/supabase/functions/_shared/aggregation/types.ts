// Types de l'interface d'agrégation — partagés entre toutes les sources

export interface RawAnnonce {
  source_url: string;
  raw_data: Record<string, unknown>;
}

export interface NormalizedAnnonce {
  ville: string;
  code_postal?: string;
  date_debut: string; // ISO 8601 YYYY-MM-DD
  date_fin: string;
  retrocession?: number;
  type_annonce: 'remplacement' | 'assistanat' | 'collaboration' | 'cession';
  description?: string;
  type_cabinet?: string;
  specialites?: string[];
  source_url: string;
  latitude?: number;
  longitude?: number;
}

export interface AggregationResult {
  source: string;
  found: number;
  inserted: number;
  updated: number;
  expired: number;
  duplicates_skipped: number;
  errors: Array<{ message: string; details?: unknown }>;
  duration_ms: number;
  status: 'success' | 'partial' | 'failure';
}

export interface CircuitBreakerState {
  source: string;
  consecutive_failures: number;
  last_failure_at: string | null;
  is_open: boolean; // true = source désactivée temporairement
}
