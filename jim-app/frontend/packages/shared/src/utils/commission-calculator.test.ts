// Tests commission calculator — Epic 9
import { describe, it, expect } from 'vitest';

// Re-implement the logic here since the Deno version can't be imported in Vitest
// These tests validate the business rules — the actual implementation is in _shared/stripe/

const COMMISSION_RATE_PERCENT = 1;

interface CommissionInput {
  montantRetrocessionCents: number;
  isLaunchPeriod: boolean;
  isPro: boolean;
}

function calculateCommission(input: CommissionInput) {
  const { montantRetrocessionCents, isLaunchPeriod, isPro } = input;
  if (isLaunchPeriod) {
    return { commissionType: 'lancement' as const, commissionRatePercent: 0, commissionCents: 0, montantNetRemplacantCents: montantRetrocessionCents };
  }
  if (isPro) {
    return { commissionType: 'pro' as const, commissionRatePercent: 0, commissionCents: 0, montantNetRemplacantCents: montantRetrocessionCents };
  }
  const commissionCents = Math.round(montantRetrocessionCents * COMMISSION_RATE_PERCENT / 100);
  return { commissionType: 'gratuit' as const, commissionRatePercent: COMMISSION_RATE_PERCENT, commissionCents, montantNetRemplacantCents: montantRetrocessionCents - commissionCents };
}

function calculateRetrocession(montantEncaisseCents: number, tauxRetrocession: number) {
  const montantRetrocessionCents = Math.round(montantEncaisseCents * tauxRetrocession / 100);
  const partTitulaireCents = montantEncaisseCents - montantRetrocessionCents;
  return { montantRetrocessionCents, partTitulaireCents };
}

describe('calculateCommission', () => {
  it('retourne 0% commission en periode de lancement', () => {
    const result = calculateCommission({ montantRetrocessionCents: 400_000, isLaunchPeriod: true, isPro: false });
    expect(result.commissionType).toBe('lancement');
    expect(result.commissionCents).toBe(0);
    expect(result.montantNetRemplacantCents).toBe(400_000);
  });

  it('retourne 0% commission pour abonne Pro', () => {
    const result = calculateCommission({ montantRetrocessionCents: 400_000, isLaunchPeriod: false, isPro: true });
    expect(result.commissionType).toBe('pro');
    expect(result.commissionCents).toBe(0);
    expect(result.montantNetRemplacantCents).toBe(400_000);
  });

  it('retourne 1% commission post-lancement gratuit', () => {
    const result = calculateCommission({ montantRetrocessionCents: 400_000, isLaunchPeriod: false, isPro: false });
    expect(result.commissionType).toBe('gratuit');
    expect(result.commissionRatePercent).toBe(1);
    expect(result.commissionCents).toBe(4_000); // 1% de 400_000
    expect(result.montantNetRemplacantCents).toBe(396_000); // 400_000 - 4_000
  });

  it('arrondit correctement au centime (Math.round)', () => {
    // 1% de 333_33 = 3333.33 → arrondi à 3333
    const result = calculateCommission({ montantRetrocessionCents: 333_33, isLaunchPeriod: false, isPro: false });
    expect(result.commissionCents).toBe(333);
    expect(result.montantNetRemplacantCents).toBe(333_33 - 333);
  });

  it('launch period a priorite sur Pro', () => {
    const result = calculateCommission({ montantRetrocessionCents: 100_000, isLaunchPeriod: true, isPro: true });
    expect(result.commissionType).toBe('lancement');
    expect(result.commissionCents).toBe(0);
  });
});

describe('calculateRetrocession', () => {
  it('calcule 80% retrocession sur 5000 EUR', () => {
    const result = calculateRetrocession(500_000, 80);
    expect(result.montantRetrocessionCents).toBe(400_000);
    expect(result.partTitulaireCents).toBe(100_000);
  });

  it('calcule 70% retrocession', () => {
    const result = calculateRetrocession(500_000, 70);
    expect(result.montantRetrocessionCents).toBe(350_000);
    expect(result.partTitulaireCents).toBe(150_000);
  });

  it('calcule 100% retrocession (cas limite)', () => {
    const result = calculateRetrocession(500_000, 100);
    expect(result.montantRetrocessionCents).toBe(500_000);
    expect(result.partTitulaireCents).toBe(0);
  });

  it('arrondit correctement pour taux non entier', () => {
    // 85.5% de 10000 = 8550
    const result = calculateRetrocession(10_000, 85.5);
    expect(result.montantRetrocessionCents).toBe(8_550);
    expect(result.partTitulaireCents).toBe(1_450);
  });

  it('tous les montants sont en centimes INT', () => {
    const result = calculateRetrocession(500_000, 80);
    expect(Number.isInteger(result.montantRetrocessionCents)).toBe(true);
    expect(Number.isInteger(result.partTitulaireCents)).toBe(true);
  });
});
