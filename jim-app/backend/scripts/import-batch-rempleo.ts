#!/usr/bin/env ts-node
// Script one-shot : import batch annonces Rempleo avant la beta
// Usage : npx ts-node scripts/import-batch-rempleo.ts [--verify-only] [--dry-run]
// Idempotent : peut être ré-exécuté sans créer de doublons
//
// NOTE : Ce script importe depuis supabase/functions/_shared/ qui utilise des imports Deno (URLs esm.sh).
// Pour l'exécuter en Node.js/ts-node, il faut un compilateur ou bundler compatible (ex: esbuild).
// Alternative : exécuter directement via Deno : deno run --allow-net --allow-env scripts/import-batch-rempleo.ts

import { createClient } from '@supabase/supabase-js'; // eslint-disable-line no-restricted-imports -- script Node.js standalone
import { RempleoSource } from '../supabase/functions/_shared/aggregation/sources/rempleo.source';
import { upsertAggregated } from '../supabase/functions/_shared/aggregation/deduplicator';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis');
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERIFY_ONLY = args.includes('--verify-only');

// Géocodage via api-adresse.data.gouv.fr (même service que geocoding.service.ts)
async function geocodeVille(
  ville: string,
  codePostal?: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const q = encodeURIComponent(`${ville}${codePostal ? ' ' + codePostal : ''}`);
    const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${q}&type=municipality&limit=1`);
    if (!res.ok) return null;
    const json = await res.json() as { features?: Array<{ geometry?: { coordinates?: [number, number] } }> };
    const coords = json.features?.[0]?.geometry?.coordinates;
    if (!coords) return null;
    return { longitude: coords[0], latitude: coords[1] };
  } catch {
    return null;
  }
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const source = new RempleoSource();

  console.log(`Import batch Rempleo — ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'}${VERIFY_ONLY ? ' (vérification seulement)' : ''}`);

  if (VERIFY_ONLY) {
    // Mode vérification : retirer les annonces périmées
    console.log('Mode vérification : re-check des annonces existantes...');

    const { data: existing } = await supabase
      .from('annonces')
      .select('id, source_url, source_last_verified_at')
      .eq('source', 'rempleo')
      .eq('statut', 'source_externe');

    let expired = 0;
    for (const annonce of existing ?? []) {
      const isAlive = await source.verify(annonce.source_url ?? '');
      if (!isAlive) {
        if (!DRY_RUN) {
          await supabase
            .from('annonces')
            .update({ statut: 'expiree', archived_at: new Date().toISOString() })
            .eq('id', annonce.id);
        }
        expired++;
        console.log(`  Expiree : ${annonce.source_url}`);
      }
    }
    console.log(`\n${expired} annonce(s) expiree(s) sur ${existing?.length ?? 0} verifiees`);
    return;
  }

  // Import principal
  console.log('Recuperation des annonces Rempleo...');
  const rawAnnonces = await source.fetch();
  console.log(`   Trouvees : ${rawAnnonces.length}`);

  const stats = { inserted: 0, skipped: 0, errors: 0, merged: 0 };

  for (const raw of rawAnnonces) {
    const normalized = source.normalize(raw);
    if (!normalized) {
      stats.errors++;
      console.log(`  Normalisation echouee : ${raw.source_url}`);
      continue;
    }

    // Géocodage si pas de coordonnées
    if (!normalized.latitude && !normalized.longitude) {
      const geo = await geocodeVille(normalized.ville, normalized.code_postal);
      if (geo) {
        normalized.latitude = geo.latitude;
        normalized.longitude = geo.longitude;
      }
    }

    if (DRY_RUN) {
      console.log(`  [DRY] ${normalized.ville} | ${normalized.date_debut} -> ${normalized.date_fin} | ${normalized.retrocession ?? '?'}%`);
      stats.inserted++;
      continue;
    }

    try {
      const { action } = await upsertAggregated(supabase, normalized, 'rempleo');
      if (action === 'inserted') { stats.inserted++; console.log(`  Inseree : ${normalized.ville}`); }
      else if (action === 'merged') { stats.merged++; console.log(`  Fusionnee : ${normalized.ville}`); }
      else { stats.skipped++; }
    } catch (err) {
      stats.errors++;
      console.error(`  Erreur : ${err instanceof Error ? err.message : err}`);
    }

    // Rate limiting : pause 500ms entre chaque insert
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\nRapport d'import :");
  console.log(`   Inserees      : ${stats.inserted}`);
  console.log(`   Fusionnees    : ${stats.merged}`);
  console.log(`   Doublons skip : ${stats.skipped}`);
  console.log(`   Erreurs       : ${stats.errors}`);
  console.log(`   Total traite  : ${rawAnnonces.length}`);
}

main().catch((err) => {
  console.error('Erreur fatale :', err);
  process.exit(1);
});
