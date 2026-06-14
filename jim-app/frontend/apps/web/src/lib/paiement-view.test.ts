import { describe, it, expect } from 'vitest';
import type { Paiement, PaiementStatus } from '@jim/shared/types/paiement';
import {
  bucketForStatus,
  derivePaiementTotals,
  groupByMonth,
  monthLabel,
  formatEurosInt,
} from './paiement-view';

// Fabrique un Paiement minimal — seuls les champs lus par la vue comptent.
function paiement(overrides: Partial<Paiement>): Paiement {
  return {
    id: 'p1',
    contrat_id: 'c1',
    annonce_id: 'a1',
    titulaire_id: 't1',
    remplacant_id: 'r1',
    montant_encaisse_cents: 0,
    taux_retrocession: 70,
    montant_retrocession_cents: 0,
    part_titulaire_cents: 0,
    commission_jim_cents: 0,
    montant_net_remplacant_cents: 0,
    source_montant: 'saisie_manuelle',
    stripe_payment_intent_id: null,
    stripe_transfer_id: null,
    stripe_charge_id: null,
    status: 'confirme',
    commission_type: 'lancement',
    created_at: '2026-05-12T10:00:00.000Z',
    updated_at: '2026-05-12T10:00:00.000Z',
    paid_at: null,
    contested_at: null,
    resolved_at: null,
    ...overrides,
  };
}

describe('bucketForStatus — mapping statuts réels → buckets UI (variante A)', () => {
  const cases: Array<[PaiementStatus, 'paid' | 'pending' | 'escrow' | null]> = [
    ['confirme', 'paid'],
    ['en_cours', 'escrow'],
    ['brouillon', 'pending'],
    ['en_attente_validation', 'pending'],
    ['conteste', 'pending'],
    ['echoue', null],
    ['rembourse', null],
  ];
  it.each(cases)('%s → %s', (status, expected) => {
    expect(bucketForStatus(status)).toBe(expected);
  });
});

describe('derivePaiementTotals', () => {
  it('Disponible = somme des réceptions confirme uniquement', () => {
    const t = derivePaiementTotals(
      [
        paiement({ status: 'confirme', montant_net_remplacant_cents: 124000 }),
        paiement({ status: 'confirme', montant_net_remplacant_cents: 82000 }),
        paiement({ status: 'en_cours', montant_net_remplacant_cents: 151600 }),
        paiement({ status: 'en_attente_validation', montant_net_remplacant_cents: 69100 }),
      ],
      2026,
    );
    expect(t.disponibleCents).toBe(206000);
  });

  it('Séquestre = somme des réceptions en_cours uniquement', () => {
    const t = derivePaiementTotals(
      [
        paiement({ status: 'en_cours', montant_net_remplacant_cents: 151600 }),
        paiement({ status: 'confirme', montant_net_remplacant_cents: 124000 }),
      ],
      2026,
    );
    expect(t.sequestreCents).toBe(151600);
  });

  it('Reçu sur l’année = confirme de l’année courante, avec le compte de missions', () => {
    const t = derivePaiementTotals(
      [
        paiement({ status: 'confirme', montant_net_remplacant_cents: 100000, created_at: '2026-01-09T00:00:00Z' }),
        paiement({ status: 'confirme', montant_net_remplacant_cents: 50000, created_at: '2026-12-31T23:00:00Z' }),
        paiement({ status: 'confirme', montant_net_remplacant_cents: 99999, created_at: '2025-11-01T00:00:00Z' }),
      ],
      2026,
    );
    expect(t.recuAnneeCents).toBe(150000);
    expect(t.recuAnneeCount).toBe(2);
  });

  it('exclut echoue et rembourse de TOUS les totaux', () => {
    const t = derivePaiementTotals(
      [
        paiement({ status: 'echoue', montant_net_remplacant_cents: 500000 }),
        paiement({ status: 'rembourse', montant_net_remplacant_cents: 500000 }),
      ],
      2026,
    );
    expect(t).toEqual({
      disponibleCents: 0,
      sequestreCents: 0,
      recuAnneeCents: 0,
      recuAnneeCount: 0,
    });
  });
});

describe('groupByMonth', () => {
  it('regroupe par mois et trie du plus récent au plus ancien', () => {
    const groups = groupByMonth([
      { createdAt: '2026-04-27T00:00:00Z', id: 'a' },
      { createdAt: '2026-05-12T00:00:00Z', id: 'b' },
      { createdAt: '2026-05-02T00:00:00Z', id: 'c' },
    ]);
    expect(groups.map((g) => g.month)).toEqual(['Mai 2026', 'Avril 2026']);
    // l’ordre d’entrée est préservé à l’intérieur d’un mois
    expect(groups[0]?.items.map((i) => i.id)).toEqual(['b', 'c']);
    expect(groups[1]?.items.map((i) => i.id)).toEqual(['a']);
  });

  it('renvoie un tableau vide pour une liste vide', () => {
    expect(groupByMonth([])).toEqual([]);
  });
});

describe('formatEurosInt — centimes → euros entiers fr-FR (séparateur milliers)', () => {
  it('arrondit au plus proche et groupe les milliers', () => {
    expect(formatEurosInt(193100)).toBe('1 931');
    expect(formatEurosInt(124000)).toBe('1 240');
    expect(formatEurosInt(0)).toBe('0');
    expect(formatEurosInt(1428800)).toBe('14 288');
  });
});

describe('monthLabel', () => {
  it('met la première lettre du mois en majuscule', () => {
    expect(monthLabel('2026-05-12T00:00:00Z')).toBe('Mai 2026');
    expect(monthLabel('2026-08-01T00:00:00Z')).toBe('Août 2026');
  });
});
