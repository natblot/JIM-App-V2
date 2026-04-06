// Tests schemas Zod avis + proposition — Epic 11
import { describe, it, expect } from 'vitest';
import { createAvisSchema, createPropositionSchema, respondPropositionSchema } from './avis.schema';

describe('createAvisSchema', () => {
  it('accepte un avis valide', () => {
    const result = createAvisSchema.safeParse({ contrat_id: '550e8400-e29b-41d4-a716-446655440000', note: 4, tags: ['ponctuel'] });
    expect(result.success).toBe(true);
  });

  it('rejette une note < 1', () => {
    const result = createAvisSchema.safeParse({ contrat_id: '550e8400-e29b-41d4-a716-446655440000', note: 0 });
    expect(result.success).toBe(false);
  });

  it('rejette une note > 5', () => {
    const result = createAvisSchema.safeParse({ contrat_id: '550e8400-e29b-41d4-a716-446655440000', note: 6 });
    expect(result.success).toBe(false);
  });

  it('rejette un tag invalide', () => {
    const result = createAvisSchema.safeParse({ contrat_id: '550e8400-e29b-41d4-a716-446655440000', note: 3, tags: ['invalid_tag'] });
    expect(result.success).toBe(false);
  });

  it('accepte sans tags (defaut [])', () => {
    const result = createAvisSchema.safeParse({ contrat_id: '550e8400-e29b-41d4-a716-446655440000', note: 5 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tags).toEqual([]);
  });

  it('rejette un contrat_id invalide', () => {
    const result = createAvisSchema.safeParse({ contrat_id: 'not-uuid', note: 3 });
    expect(result.success).toBe(false);
  });
});

describe('createPropositionSchema', () => {
  it('accepte une proposition valide', () => {
    const result = createPropositionSchema.safeParse({
      remplacant_id: '550e8400-e29b-41d4-a716-446655440000',
      date_debut: '2026-04-01',
      date_fin: '2026-04-15',
      retrocession: 80,
    });
    expect(result.success).toBe(true);
  });

  it('rejette une retrocession > 100', () => {
    const result = createPropositionSchema.safeParse({
      remplacant_id: '550e8400-e29b-41d4-a716-446655440000',
      date_debut: '2026-04-01', date_fin: '2026-04-15', retrocession: 150,
    });
    expect(result.success).toBe(false);
  });

  it('rejette un format de date invalide', () => {
    const result = createPropositionSchema.safeParse({
      remplacant_id: '550e8400-e29b-41d4-a716-446655440000',
      date_debut: '01/04/2026', date_fin: '2026-04-15', retrocession: 80,
    });
    expect(result.success).toBe(false);
  });
});

describe('respondPropositionSchema', () => {
  it('accepte "acceptee"', () => {
    const result = respondPropositionSchema.safeParse({ proposition_id: '550e8400-e29b-41d4-a716-446655440000', response: 'acceptee' });
    expect(result.success).toBe(true);
  });

  it('accepte "declinee"', () => {
    const result = respondPropositionSchema.safeParse({ proposition_id: '550e8400-e29b-41d4-a716-446655440000', response: 'declinee' });
    expect(result.success).toBe(true);
  });

  it('rejette une reponse invalide', () => {
    const result = respondPropositionSchema.safeParse({ proposition_id: '550e8400-e29b-41d4-a716-446655440000', response: 'peut-etre' });
    expect(result.success).toBe(false);
  });
});
