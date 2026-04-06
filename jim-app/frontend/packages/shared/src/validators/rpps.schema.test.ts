import { describe, expect, it } from 'vitest';
import { rppsVerifySchema, rppsSearchSchema } from './rpps.schema';

describe('rppsVerifySchema', () => {
  it('valide un RPPS 11 chiffres', () => {
    expect(rppsVerifySchema.safeParse({ rppsNumber: '10003456789' }).success).toBe(true);
  });

  it('rejette un RPPS trop court', () => {
    expect(rppsVerifySchema.safeParse({ rppsNumber: '1234567890' }).success).toBe(false);
  });

  it('rejette un RPPS avec des lettres', () => {
    expect(rppsVerifySchema.safeParse({ rppsNumber: '1000345678A' }).success).toBe(false);
  });

  it('rejette un RPPS vide', () => {
    expect(rppsVerifySchema.safeParse({ rppsNumber: '' }).success).toBe(false);
  });
});

describe('rppsSearchSchema', () => {
  it('valide nom + prénom', () => {
    expect(rppsSearchSchema.safeParse({ lastName: 'Dupont', firstName: 'Léa' }).success).toBe(true);
  });

  it('valide avec ville optionnelle', () => {
    expect(rppsSearchSchema.safeParse({ lastName: 'Martin', firstName: 'Thomas', city: 'Lyon' }).success).toBe(true);
  });

  it('rejette un nom trop court', () => {
    expect(rppsSearchSchema.safeParse({ lastName: 'D', firstName: 'Léa' }).success).toBe(false);
  });
});
