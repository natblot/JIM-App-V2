// Tests du schéma Zod messagerie — Epic 6
import { describe, it, expect } from 'vitest';
import { sendMessageSchema } from './message.schema';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('sendMessageSchema', () => {
  it('valide un message correct', () => {
    const result = sendMessageSchema.safeParse({
      conversation_id: VALID_UUID,
      content: 'Bonjour, je suis disponible pour le remplacement.',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un contenu vide', () => {
    const result = sendMessageSchema.safeParse({
      conversation_id: VALID_UUID,
      content: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toBe('Le message ne peut pas être vide');
    }
  });

  it('rejette un message de plus de 2000 caractères', () => {
    const result = sendMessageSchema.safeParse({
      conversation_id: VALID_UUID,
      content: 'a'.repeat(2001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toBe('Le message ne peut pas dépasser 2000 caractères');
    }
  });

  it('accepte un message de 2000 caractères exactement', () => {
    const result = sendMessageSchema.safeParse({
      conversation_id: VALID_UUID,
      content: 'a'.repeat(2000),
    });
    expect(result.success).toBe(true);
  });

  it('rejette un conversation_id invalide (pas un UUID)', () => {
    const result = sendMessageSchema.safeParse({
      conversation_id: 'pas-un-uuid',
      content: 'Bonjour',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toBe('ID conversation invalide');
    }
  });

  it('rejette un conversation_id manquant', () => {
    const result = sendMessageSchema.safeParse({
      content: 'Bonjour',
    });
    expect(result.success).toBe(false);
  });
});
