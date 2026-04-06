// Tests du schéma Zod candidature — Epic 5
import { describe, it, expect } from 'vitest';
import {
  createCandidatureSchema,
  processCandidatureSchema,
  withdrawCandidatureSchema,
} from './candidature.schema';

describe('createCandidatureSchema', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';

  it('valide une candidature sans message', () => {
    const result = createCandidatureSchema.safeParse({ annonce_id: validUuid });
    expect(result.success).toBe(true);
  });

  it('valide une candidature avec message', () => {
    const result = createCandidatureSchema.safeParse({
      annonce_id: validUuid,
      message: '3 ans d\'expérience en musculo',
    });
    expect(result.success).toBe(true);
    expect(result.data?.message).toBe('3 ans d\'expérience en musculo');
  });

  it('rejette un message trop long (> 500 chars)', () => {
    const result = createCandidatureSchema.safeParse({
      annonce_id: validUuid,
      message: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rejette un annonce_id invalide', () => {
    const result = createCandidatureSchema.safeParse({ annonce_id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('accepte un message de 500 chars exactement', () => {
    const result = createCandidatureSchema.safeParse({
      annonce_id: validUuid,
      message: 'a'.repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it('accepte un message null/undefined (optionnel)', () => {
    const result = createCandidatureSchema.safeParse({ annonce_id: validUuid, message: undefined });
    expect(result.success).toBe(true);
  });

  it('valide avec warnings', () => {
    const result = createCandidatureSchema.safeParse({
      annonce_id: validUuid,
      warnings: [{ type: 'specialite_manquante', detail: 'Nécessite massage sportif' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejette un warning avec type invalide', () => {
    const result = createCandidatureSchema.safeParse({
      annonce_id: validUuid,
      warnings: [{ type: 'type_inconnu', detail: 'test' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('processCandidatureSchema', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';

  it('valide accepter avec refus_autres=true', () => {
    const result = processCandidatureSchema.safeParse({
      candidature_id: validUuid,
      action: 'accepter',
      refuser_autres: true,
    });
    expect(result.success).toBe(true);
  });

  it('valide refuser', () => {
    const result = processCandidatureSchema.safeParse({
      candidature_id: validUuid,
      action: 'refuser',
    });
    expect(result.success).toBe(true);
    expect(result.data?.refuser_autres).toBe(true); // default
  });

  it('rejette une action invalide', () => {
    const result = processCandidatureSchema.safeParse({
      candidature_id: validUuid,
      action: 'ignorer',
    });
    expect(result.success).toBe(false);
  });
});

describe('withdrawCandidatureSchema', () => {
  it('valide un UUID valide', () => {
    const result = withdrawCandidatureSchema.safeParse({
      candidature_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un ID invalide', () => {
    const result = withdrawCandidatureSchema.safeParse({ candidature_id: 'bad-id' });
    expect(result.success).toBe(false);
  });
});
