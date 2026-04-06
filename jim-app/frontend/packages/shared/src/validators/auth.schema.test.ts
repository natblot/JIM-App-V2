import { describe, expect, it } from 'vitest';
import { signUpSchema, signInSchema, magicLinkSchema } from './auth.schema';

describe('signUpSchema', () => {
  const validData = {
    email: 'lea@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
    role: 'remplacant' as const,
    firstName: 'Léa',
    lastName: 'Dupont',
    cguAccepted: true as const,
  };

  it('valide des données correctes', () => {
    const result = signUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejette un email invalide', () => {
    const result = signUpSchema.safeParse({ ...validData, email: 'pas-un-email' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain('email');
  });

  it('rejette un mot de passe trop court', () => {
    const result = signUpSchema.safeParse({ ...validData, password: 'Ab1', confirmPassword: 'Ab1' });
    expect(result.success).toBe(false);
  });

  it('rejette des mots de passe non concordants', () => {
    const result = signUpSchema.safeParse({ ...validData, confirmPassword: 'Different1' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain('confirmPassword');
  });

  it('rejette un rôle invalide', () => {
    const result = signUpSchema.safeParse({ ...validData, role: 'admin' });
    expect(result.success).toBe(false);
  });

  it('rejette si CGU non acceptées', () => {
    const result = signUpSchema.safeParse({ ...validData, cguAccepted: false });
    expect(result.success).toBe(false);
  });
});

describe('magicLinkSchema', () => {
  it('valide un email correct', () => {
    expect(magicLinkSchema.safeParse({ email: 'thomas@cabinet.fr' }).success).toBe(true);
  });

  it('rejette un email vide', () => {
    expect(magicLinkSchema.safeParse({ email: '' }).success).toBe(false);
  });
});

describe('signInSchema', () => {
  it('valide email + mot de passe', () => {
    expect(signInSchema.safeParse({ email: 'michel@kine.fr', password: 'password' }).success).toBe(true);
  });

  it('rejette mot de passe vide', () => {
    expect(signInSchema.safeParse({ email: 'michel@kine.fr', password: '' }).success).toBe(false);
  });
});
