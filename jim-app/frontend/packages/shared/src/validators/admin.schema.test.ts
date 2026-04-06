// Tests schemas admin — Epic 12
import { describe, it, expect } from 'vitest';
import { createSignalementSchema, moderateContentSchema, createSupportTicketSchema } from './admin.schema';

describe('createSignalementSchema', () => {
  it('accepte un signalement valide', () => {
    const result = createSignalementSchema.safeParse({
      contenu_type: 'annonce', contenu_id: '550e8400-e29b-41d4-a716-446655440000', categorie: 'annonce_frauduleuse',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un type invalide', () => {
    const result = createSignalementSchema.safeParse({ contenu_type: 'invalid', contenu_id: '550e8400-e29b-41d4-a716-446655440000', categorie: 'autre' });
    expect(result.success).toBe(false);
  });

  it('rejette une categorie invalide', () => {
    const result = createSignalementSchema.safeParse({ contenu_type: 'profile', contenu_id: '550e8400-e29b-41d4-a716-446655440000', categorie: 'spam' });
    expect(result.success).toBe(false);
  });

  it('accepte une description optionnelle', () => {
    const result = createSignalementSchema.safeParse({
      contenu_type: 'message', contenu_id: '550e8400-e29b-41d4-a716-446655440000', categorie: 'contenu_offensant', description: 'Contenu inapproprie',
    });
    expect(result.success).toBe(true);
  });
});

describe('moderateContentSchema', () => {
  it('accepte suspend', () => {
    const result = moderateContentSchema.safeParse({ signalement_id: '550e8400-e29b-41d4-a716-446655440000', action: 'suspend' });
    expect(result.success).toBe(true);
  });

  it('accepte hide_content', () => {
    const result = moderateContentSchema.safeParse({ signalement_id: '550e8400-e29b-41d4-a716-446655440000', action: 'hide_content' });
    expect(result.success).toBe(true);
  });

  it('rejette une action invalide', () => {
    const result = moderateContentSchema.safeParse({ signalement_id: '550e8400-e29b-41d4-a716-446655440000', action: 'delete' });
    expect(result.success).toBe(false);
  });
});

describe('createSupportTicketSchema', () => {
  it('accepte un ticket valide', () => {
    const result = createSupportTicketSchema.safeParse({ categorie: 'bug', sujet: 'App crash', description: 'L\'app crash au lancement' });
    expect(result.success).toBe(true);
  });

  it('rejette un sujet vide', () => {
    const result = createSupportTicketSchema.safeParse({ categorie: 'bug', sujet: '', description: 'test' });
    expect(result.success).toBe(false);
  });

  it('rejette une description trop longue', () => {
    const result = createSupportTicketSchema.safeParse({ categorie: 'bug', sujet: 'test', description: 'a'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  it('rejette une categorie invalide', () => {
    const result = createSupportTicketSchema.safeParse({ categorie: 'urgence', sujet: 'test', description: 'test' });
    expect(result.success).toBe(false);
  });
});
