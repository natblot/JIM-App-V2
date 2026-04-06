// Tests schema Zod paiement — Epic 9
import { describe, it, expect } from 'vitest';
import { createPaiementSchema, contestPaiementSchema, confirmPaiementSchema, createSubscriptionSchema } from './paiement.schema';

describe('createPaiementSchema', () => {
  it('accepte un paiement valide', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      montant_encaisse_cents: 500_000,
    });
    expect(result.success).toBe(true);
  });

  it('rejette un contrat_id invalide', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: 'not-a-uuid',
      montant_encaisse_cents: 500_000,
    });
    expect(result.success).toBe(false);
  });

  it('rejette un montant negatif', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      montant_encaisse_cents: -100,
    });
    expect(result.success).toBe(false);
  });

  it('rejette un montant zero', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      montant_encaisse_cents: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejette un montant superieur a 100 000 EUR', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      montant_encaisse_cents: 100_001_00,
    });
    expect(result.success).toBe(false);
  });

  it('rejette un montant decimal (pas entier)', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      montant_encaisse_cents: 500.5,
    });
    expect(result.success).toBe(false);
  });

  it('accepte source_montant valide', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      montant_encaisse_cents: 500_000,
      source_montant: 'import_csv',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.source_montant).toBe('import_csv');
  });

  it('defaut source_montant = saisie_manuelle', () => {
    const result = createPaiementSchema.safeParse({
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      montant_encaisse_cents: 500_000,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.source_montant).toBe('saisie_manuelle');
  });
});

describe('contestPaiementSchema', () => {
  it('accepte un UUID valide', () => {
    const result = contestPaiementSchema.safeParse({
      paiement_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un UUID invalide', () => {
    const result = contestPaiementSchema.safeParse({ paiement_id: 'invalid' });
    expect(result.success).toBe(false);
  });
});

describe('confirmPaiementSchema', () => {
  it('accepte des inputs valides', () => {
    const result = confirmPaiementSchema.safeParse({
      paiement_id: '550e8400-e29b-41d4-a716-446655440000',
      payment_method_id: 'pm_test_123',
    });
    expect(result.success).toBe(true);
  });

  it('rejette payment_method_id vide', () => {
    const result = confirmPaiementSchema.safeParse({
      paiement_id: '550e8400-e29b-41d4-a716-446655440000',
      payment_method_id: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('createSubscriptionSchema', () => {
  it('accepte un payment_method_id valide', () => {
    const result = createSubscriptionSchema.safeParse({ payment_method_id: 'pm_test_123' });
    expect(result.success).toBe(true);
  });

  it('rejette un payment_method_id vide', () => {
    const result = createSubscriptionSchema.safeParse({ payment_method_id: '' });
    expect(result.success).toBe(false);
  });
});
