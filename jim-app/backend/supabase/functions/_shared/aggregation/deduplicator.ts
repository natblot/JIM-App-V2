// Logique de déduplication et fusion annonces agrégées ↔ natives — FR16, FR20
import type { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { NormalizedAnnonce } from './types.ts';

type Supabase = ReturnType<typeof createClient>;

// Validation source_url : uniquement http/https, pas d'injection javascript: ou data:
function isValidSourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      ['http:', 'https:'].includes(parsed.protocol) &&
      parsed.hostname.length > 0 &&
      !url.includes('javascript:') &&
      !url.includes('data:')
    );
  } catch {
    return false;
  }
}

// Vérifie si une annonce agrégée existe déjà (par source_url)
export async function findExistingAggregated(
  supabase: Supabase,
  source: string,
  sourceUrl: string
): Promise<{ id: string; statut: string } | null> {
  const { data } = await supabase
    .from('annonces')
    .select('id, statut')
    .eq('source', source)
    .eq('source_url', sourceUrl)
    .single();
  return data ?? null;
}

// Recherche une annonce native correspondante (pour fusion FR20)
// Correspondance : même ville (approx) + dates qui se chevauchent
export async function findMatchingNative(
  supabase: Supabase,
  normalized: NormalizedAnnonce
): Promise<{ id: string } | null> {
  const { data } = await supabase
    .from('annonces')
    .select('id')
    .eq('source', 'native')
    .ilike('ville', normalized.ville)
    .lte('date_debut', normalized.date_fin)
    .gte('date_fin', normalized.date_debut)
    .not('statut', 'in', '("expiree","pourvue")')
    .limit(1)
    .single();
  return data ?? null;
}

// Insère ou met à jour une annonce agrégée
export async function upsertAggregated(
  supabase: Supabase,
  normalized: NormalizedAnnonce,
  source: string
): Promise<{ action: 'inserted' | 'updated' | 'skipped' | 'merged'; id: string }> {
  // Validation source_url avant toute opération DB (protection injection)
  if (!normalized.source_url || !isValidSourceUrl(normalized.source_url)) {
    throw new Error(`Invalid source_url rejected: "${normalized.source_url}"`);
  }

  // 1. Chercher une annonce native correspondante → fusion
  const native = await findMatchingNative(supabase, normalized);
  if (native) {
    // Fusion : marquer la native avec le lien vers l'originale
    await supabase
      .from('annonces')
      .update({ source_url: normalized.source_url, source_last_verified_at: new Date().toISOString() })
      .eq('id', native.id);

    // Log la fusion
    await supabase.from('aggregation_logs').insert({
      event_type: 'merge',
      source,
      annonce_id: native.id,
      details: { source_url: normalized.source_url, ville: normalized.ville },
    });

    return { action: 'merged', id: native.id };
  }

  // 2. UPSERT par (source, source_url)
  const insertData = {
    profile_id: null as unknown as string, // annonces agrégées sans profil propriétaire
    source,
    source_url: normalized.source_url,
    source_last_verified_at: new Date().toISOString(),
    type_annonce: normalized.type_annonce,
    date_debut: normalized.date_debut,
    date_fin: normalized.date_fin,
    retrocession: normalized.retrocession ?? 82,
    ville: normalized.ville,
    code_postal: normalized.code_postal ?? null,
    description: normalized.description ?? null,
    type_cabinet: normalized.type_cabinet ?? null,
    specialites: normalized.specialites ?? [],
    statut: 'source_externe' as const,
    is_urgent: false,
    location: normalized.latitude && normalized.longitude
      ? `POINT(${normalized.longitude} ${normalized.latitude})`
      : null,
  };

  const { data, error } = await supabase
    .from('annonces')
    .upsert(insertData, { onConflict: 'source,source_url', ignoreDuplicates: false })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Upsert failed: ${error?.message ?? 'no data'}`);
  }

  return { action: 'inserted', id: data.id };
}

// Expire les annonces dont la source_url n'est plus vérifiable depuis 48h
export async function expireStaleAnnonces(
  supabase: Supabase,
  source: string,
  activeSourceUrls: string[]
): Promise<number> {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  // Valider toutes les URLs actives avant usage (protection injection)
  const validActiveUrls = activeSourceUrls.filter(isValidSourceUrl);

  // Récupérer toutes les annonces périmées, puis filtrer côté application
  // pour éviter l'interpolation directe d'URLs dans la query (injection SQL)
  const { data: candidates } = await supabase
    .from('annonces')
    .select('id, source_url')
    .eq('source', source)
    .eq('statut', 'source_externe')
    .lt('source_last_verified_at', cutoff);

  const stale = (candidates ?? []).filter(
    (a) => !validActiveUrls.includes(a.source_url)
  );

  if (!stale || stale.length === 0) return 0;

  const ids = stale.map((a) => a.id);
  await supabase.from('annonces').update({ statut: 'expiree', archived_at: new Date().toISOString() }).in('id', ids);

  // Log les expirations
  await supabase.from('aggregation_logs').insert(
    ids.map((id) => ({ event_type: 'expire', source, annonce_id: id, details: {} }))
  );

  return ids.length;
}
