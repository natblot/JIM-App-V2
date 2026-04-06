// Tests schemas Zod RGPD — Epic 10
import { describe, it, expect } from 'vitest';
import { deleteAccountSchema, cancelDeletionSchema } from './rgpd.schema';

describe('deleteAccountSchema', () => {
  it('accepte "SUPPRIMER"', () => {
    const result = deleteAccountSchema.safeParse({ confirmation: 'SUPPRIMER' });
    expect(result.success).toBe(true);
  });

  it('rejette un texte different', () => {
    const result = deleteAccountSchema.safeParse({ confirmation: 'supprimer' });
    expect(result.success).toBe(false);
  });

  it('rejette un texte vide', () => {
    const result = deleteAccountSchema.safeParse({ confirmation: '' });
    expect(result.success).toBe(false);
  });

  it('rejette sans le champ', () => {
    const result = deleteAccountSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('cancelDeletionSchema', () => {
  it('accepte un UUID valide', () => {
    const result = cancelDeletionSchema.safeParse({ cancel_token: '550e8400-e29b-41d4-a716-446655440000' });
    expect(result.success).toBe(true);
  });

  it('rejette un token invalide', () => {
    const result = cancelDeletionSchema.safeParse({ cancel_token: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });
});
