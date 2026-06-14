// Logique de présentation de la page /paiement — vue remplaçant (gains reçus).
// Pur, testé (paiement-view.test.ts). Aucune dépendance React/Supabase ici.
//
// Mapping statuts réels → buckets UI (variante A validée) :
//   confirme              → 'paid'    (Reçue)
//   en_cours              → 'escrow'  (Séquestre : fonds sécurisés, pas encore libérés)
//   brouillon             → 'pending' (En attente)
//   en_attente_validation → 'pending'
//   conteste              → 'pending'
//   echoue / rembourse    → null      (exclus de la liste ET des totaux)
//
// Montants TOUJOURS en centimes en entrée. Le mot "commission" n'apparaît jamais ici.

import type { Paiement, PaiementStatus } from '@jim/shared/types/paiement';

export type FactureStatus = 'paid' | 'pending' | 'escrow';

const STATUS_BUCKET: Record<PaiementStatus, FactureStatus | null> = {
  confirme: 'paid',
  en_cours: 'escrow',
  brouillon: 'pending',
  en_attente_validation: 'pending',
  conteste: 'pending',
  echoue: null,
  rembourse: null,
};

/** Bucket UI d'un paiement, ou null s'il ne doit apparaître ni en liste ni dans les totaux. */
export function bucketForStatus(status: PaiementStatus): FactureStatus | null {
  return STATUS_BUCKET[status] ?? null;
}

export interface PaiementTotals {
  /** Σ des réceptions confirme. Proxy du solde disponible : pas de backend payout/solde aujourd'hui. */
  disponibleCents: number;
  /** Σ des réceptions en_cours (séquestre applicatif). */
  sequestreCents: number;
  /** Σ des réceptions confirme sur l'année courante. */
  recuAnneeCents: number;
  /** Nombre de réceptions confirme sur l'année courante (« N missions »). */
  recuAnneeCount: number;
}

/** Dérive les 3 totaux affichés à partir des réceptions (montant net remplaçant). */
export function derivePaiementTotals(receptions: Paiement[], year: number): PaiementTotals {
  let disponibleCents = 0;
  let sequestreCents = 0;
  let recuAnneeCents = 0;
  let recuAnneeCount = 0;

  for (const p of receptions) {
    const bucket = bucketForStatus(p.status);
    const net = p.montant_net_remplacant_cents;
    if (bucket === 'paid') {
      disponibleCents += net;
      if (new Date(p.created_at).getUTCFullYear() === year) {
        recuAnneeCents += net;
        recuAnneeCount += 1;
      }
    } else if (bucket === 'escrow') {
      sequestreCents += net;
    }
  }

  return { disponibleCents, sequestreCents, recuAnneeCents, recuAnneeCount };
}

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** Clé de tri d'un mois, ex. « 2026-05 ». */
export function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Libellé d'un mois, ex. « Mai 2026 » (première lettre capitalisée). */
export function monthLabel(iso: string): string {
  const d = new Date(iso);
  const m = MONTHS_FR[d.getUTCMonth()] ?? '';
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${d.getUTCFullYear()}`;
}

export interface MonthGroup<T> {
  key: string;
  month: string;
  items: T[];
}

/**
 * Regroupe des éléments datés par mois, du plus récent au plus ancien.
 * L'ordre d'entrée est préservé à l'intérieur de chaque mois
 * (les réceptions arrivent déjà triées created_at desc).
 */
export function groupByMonth<T extends { createdAt: string }>(items: T[]): MonthGroup<T>[] {
  const map = new Map<string, MonthGroup<T>>();
  for (const it of items) {
    const key = monthKey(it.createdAt);
    let group = map.get(key);
    if (!group) {
      group = { key, month: monthLabel(it.createdAt), items: [] };
      map.set(key, group);
    }
    group.items.push(it);
  }
  return [...map.values()].sort((a, b) => b.key.localeCompare(a.key));
}

const EUROS_INT = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

/**
 * Centimes → euros entiers, séparateur de milliers = espace simple, sans symbole € .
 * (Intl fr-FR utilise une espace fine insécable U+202F ; on la normalise pour coller
 * au markup du design « 1 931 ».)
 */
export function formatEurosInt(cents: number): string {
  return EUROS_INT.format(Math.round(cents / 100)).replace(/\s/g, ' ');
}
