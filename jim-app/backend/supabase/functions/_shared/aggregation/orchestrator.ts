// Orchestrateur d'agrégation — dispatch parallèle + circuit breaker + métriques
import type { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { AggregationResult } from './types.ts';
import { getActiveSources } from './sources/source-registry.ts';
import { upsertAggregated, expireStaleAnnonces } from './deduplicator.ts';

type Supabase = ReturnType<typeof createClient>;

const CIRCUIT_BREAKER_THRESHOLD = 3; // échecs consécutifs avant désactivation
const CIRCUIT_BREAKER_COOLDOWN_MS = 60 * 60 * 1000; // 1 heure

// Vérifie si le circuit breaker est ouvert pour une source
async function isCircuitOpen(supabase: Supabase, sourceId: string): Promise<boolean> {
  const { data } = await supabase
    .from('aggregation_runs')
    .select('consecutive_failures, completed_at')
    .eq('source', sourceId)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) return false;
  if (data.consecutive_failures < CIRCUIT_BREAKER_THRESHOLD) return false;

  // Vérifier si le cooldown est passé
  const lastRun = data.completed_at ? new Date(data.completed_at).getTime() : 0;
  return Date.now() - lastRun < CIRCUIT_BREAKER_COOLDOWN_MS;
}

// Exécute une source avec timeout et gestion d'erreur
async function runSource(
  supabase: Supabase,
  source: ReturnType<typeof getActiveSources>[number]
): Promise<AggregationResult> {
  const sourceId = source.getSourceId();
  const startedAt = Date.now();
  const result: AggregationResult = {
    source: sourceId,
    found: 0,
    inserted: 0,
    updated: 0,
    expired: 0,
    duplicates_skipped: 0,
    errors: [],
    duration_ms: 0,
    status: 'success',
  };

  // Circuit breaker check
  if (await isCircuitOpen(supabase, sourceId)) {
    result.status = 'failure';
    result.errors.push({ message: 'Circuit breaker ouvert — source temporairement désactivée' });
    return result;
  }

  try {
    // Fetch avec timeout global 30s
    const rawAnnonces = await Promise.race([
      source.fetch(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout 30s')), 30_000)
      ),
    ]);

    result.found = rawAnnonces.length;

    // Alerte si 0 résultats (FR52)
    if (rawAnnonces.length === 0) {
      await supabase.from('notification_queue').insert({
        recipient_id: '00000000-0000-0000-0000-000000000000', // admin system ID
        event_type: 'AGGREGATION_ZERO_RESULTS',
        payload: { source: sourceId, checked_at: new Date().toISOString() },
        channel: 'in_app',
        priority: 'high',
        scheduled_at: new Date().toISOString(),
      });
    }

    // Normaliser + dédupliquer chaque annonce
    const activeUrls: string[] = [];
    for (const raw of rawAnnonces) {
      const normalized = source.normalize(raw);
      if (!normalized) continue;

      activeUrls.push(raw.source_url);

      try {
        const { action } = await upsertAggregated(supabase, normalized, sourceId);
        if (action === 'inserted') result.inserted++;
        else if (action === 'updated') result.updated++;
        else if (action === 'merged') result.updated++;
        else if (action === 'skipped') result.duplicates_skipped++;
      } catch (err) {
        result.errors.push({
          message: err instanceof Error ? err.message : 'Erreur upsert',
          details: { url: raw.source_url },
        });
      }
    }

    // Re-vérification et expiration des annonces obsolètes (FR61)
    result.expired = await expireStaleAnnonces(supabase, sourceId, activeUrls);

  } catch (err) {
    result.status = 'failure';
    result.errors.push({ message: err instanceof Error ? err.message : 'Erreur inconnue' });
  }

  if (result.errors.length > 0 && result.inserted + result.updated === 0) {
    result.status = 'failure';
  } else if (result.errors.length > 0) {
    result.status = 'partial';
  }

  result.duration_ms = Date.now() - startedAt;

  // Enregistrer les métriques
  const prevRun = await supabase
    .from('aggregation_runs')
    .select('consecutive_failures')
    .eq('source', sourceId)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  const prevFailures = prevRun.data?.consecutive_failures ?? 0;
  await supabase.from('aggregation_runs').insert({
    source: sourceId,
    run_status: result.status,
    annonces_found: result.found,
    annonces_inserted: result.inserted,
    annonces_updated: result.updated,
    annonces_expired: result.expired,
    duplicates_skipped: result.duplicates_skipped,
    errors: result.errors,
    consecutive_failures: result.status === 'failure' ? prevFailures + 1 : 0,
    completed_at: new Date().toISOString(),
    duration_ms: result.duration_ms,
  });

  return result;
}

// Point d'entrée principal — dispatch toutes les sources en parallèle
export async function runAggregation(supabase: Supabase): Promise<AggregationResult[]> {
  const sources = getActiveSources();
  const results = await Promise.allSettled(
    sources.map((source) => runSource(supabase, source))
  );

  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : {
          source: sources[i].getSourceId(),
          found: 0,
          inserted: 0,
          updated: 0,
          expired: 0,
          duplicates_skipped: 0,
          errors: [{ message: r.reason instanceof Error ? r.reason.message : 'Erreur' }],
          duration_ms: 0,
          status: 'failure' as const,
        }
  );
}
