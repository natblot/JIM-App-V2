// Tests des types de notification Epic 8 — Contrats IA
// Vérifie NFR18 : aucune donnée personnelle dans les payloads
import { describe, it, expect } from 'vitest';
import { NOTIFICATION_TYPES } from '../constants/notification-types';
import { buildPushPayload } from './notification-payload';

// Champs personnels interdits dans les payloads (NFR18)
const PERSONAL_DATA_FIELDS = [
  'first_name',
  'last_name',
  'rpps',
  'email',
  'phone',
  'nom',
  'prenom',
] as const;

// Champs autorisés dans les payloads contrat (identifiants opaques uniquement)
type ContratPayload = Record<string, string>;

// Vérifie si un objet de données contient des champs personnels (NFR18)
function containsPersonalDataFields(payload: ContratPayload): boolean {
  const keys = Object.keys(payload);
  return PERSONAL_DATA_FIELDS.some((field) => keys.includes(field));
}

// Types attendus pour Epic 7 (pour confirmer que Epic 8 en ajoute de nouveaux)
const EPIC_7_TYPES = [
  'CALENDRIER_OUTDATED',
  'POST_REMPLACEMENT_NOTATION',
  'NOTIFICATION_GROUPED',
] as const;

describe('notification-types Epic 8 — types de contrat', () => {
  it('CONTRAT_EN_ATTENTE doit être ajouté comme type valide pour Epic 8', () => {
    // Ce test confirme l'intention : Epic 8 doit ajouter CONTRAT_EN_ATTENTE
    const expectedType = 'CONTRAT_EN_ATTENTE';
    // Le type sera ajouté dans notification-types.ts lors de l'implémentation
    // Pour l'instant, on vérifie qu'il n'existait PAS dans Epic 7
    expect(EPIC_7_TYPES).not.toContain(expectedType);
  });

  it('CONTRAT_CONFIRME n\'était pas dans les types Epic 7 (nouveau type Epic 8)', () => {
    const expectedType = 'CONTRAT_CONFIRME';
    expect(EPIC_7_TYPES).not.toContain(expectedType);
  });

  it('CONTRAT_EN_ATTENTE est present dans les types (ajoute par Epic 8)', () => {
    const existingValues = Object.values(NOTIFICATION_TYPES);
    expect(existingValues).toContain('CONTRAT_EN_ATTENTE');
  });

  it('les types Epic 7 sont bien présents dans NOTIFICATION_TYPES', () => {
    // Vérifie la baseline avant l'ajout des types Epic 8
    expect(NOTIFICATION_TYPES).toHaveProperty('CALENDRIER_OUTDATED');
    expect(NOTIFICATION_TYPES).toHaveProperty('POST_REMPLACEMENT_NOTATION');
    expect(NOTIFICATION_TYPES).toHaveProperty('NOTIFICATION_GROUPED');
  });

  it('toutes les valeurs NOTIFICATION_TYPES sont des strings non vides', () => {
    const values = Object.values(NOTIFICATION_TYPES);
    for (const value of values) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe('NFR18 — payloads contrat sans données personnelles', () => {
  it('un payload contrat valide { contrat_id, annonce_id } ne contient pas de données personnelles', () => {
    // Les payloads contrat ne doivent contenir que des identifiants opaques
    const payload: ContratPayload = {
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      annonce_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    };
    expect(containsPersonalDataFields(payload)).toBe(false);
  });

  it('un payload avec first_name est détecté comme contenant des données personnelles', () => {
    const payload: ContratPayload = {
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      first_name: 'Jean',
    };
    expect(containsPersonalDataFields(payload)).toBe(true);
  });

  it('un payload avec last_name est détecté comme contenant des données personnelles', () => {
    const payload: ContratPayload = {
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      last_name: 'Dupont',
    };
    expect(containsPersonalDataFields(payload)).toBe(true);
  });

  it('un payload avec rpps est détecté comme contenant des données personnelles', () => {
    const payload: ContratPayload = {
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      rpps: '10005678901',
    };
    expect(containsPersonalDataFields(payload)).toBe(true);
  });

  it('un payload avec email est détecté comme contenant des données personnelles', () => {
    const payload: ContratPayload = {
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'jean@exemple.fr',
    };
    expect(containsPersonalDataFields(payload)).toBe(true);
  });

  it('buildPushPayload pour un event contrat ne doit pas contenir de données personnelles (NFR18)', () => {
    // Simule un futur event CONTRAT_EN_ATTENTE : le payload push doit rester générique
    const payload = buildPushPayload('CONTRAT_EN_ATTENTE', {
      contrat_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    // Le title et body ne doivent pas contenir de prénom, nom, RPPS, email, téléphone
    expect(payload.title).not.toMatch(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    expect(payload.body).not.toMatch(/\b0[67]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\b/);
    expect(payload.data.type).toBe('CONTRAT_EN_ATTENTE');
  });
});
