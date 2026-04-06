import { describe, it, expect } from 'vitest';
import { buildPushPayload, containsPersonalData, type PushPayload } from './notification-payload';

describe('buildPushPayload — NFR18 aucune donnée personnelle', () => {
  it("ANNONCE_CREEE : pas d'email, pas de téléphone, pas de RPPS dans title/body", () => {
    const payload = buildPushPayload('ANNONCE_CREEE', {
      distance: '15',
      ville: 'Lyon',
      dates: '1-15 mai',
      annonce_id: 'abc123',
    });
    expect(containsPersonalData(payload)).toBe(false);
    expect(payload.title).toContain('15 km');
    expect(payload.body).toContain('Lyon');
  });

  it('CANDIDATURE_RECUE : message générique (pas de prénom complet)', () => {
    const payload = buildPushPayload('CANDIDATURE_RECUE');
    expect(payload.body).toBe('Un remplaçant a postulé à votre annonce');
    expect(containsPersonalData(payload)).toBe(false);
  });

  it("CANDIDATURE_ACCEPTEE : priorité 'high'", () => {
    const payload = buildPushPayload('CANDIDATURE_ACCEPTEE', {
      conversation_id: 'conv-456',
    });
    expect(payload.priority).toBe('high');
    expect(payload.data.deep_link).toContain('conv-456');
    expect(containsPersonalData(payload)).toBe(false);
  });

  it('MESSAGE_RECU : body ne contient pas le contenu du message', () => {
    const payload = buildPushPayload('MESSAGE_RECU', {
      conversation_id: 'conv-789',
    });
    expect(payload.body).toBe('Vous avez reçu un message');
    expect(containsPersonalData(payload)).toBe(false);
  });

  it('NOTIFICATION_GROUPED : contient le count si fourni', () => {
    const payload = buildPushPayload('NOTIFICATION_GROUPED', { count: '5' });
    expect(payload.body).toContain('5');
    expect(containsPersonalData(payload)).toBe(false);
  });

  it('event_type inconnu → payload générique sans crash', () => {
    const payload = buildPushPayload('TYPE_INCONNU_XYZ');
    expect(payload.title).toBe('JIM');
    expect(payload.body).toBe('Vous avez une nouvelle notification');
    expect(payload.data.type).toBe('TYPE_INCONNU_XYZ');
    expect(payload.priority).toBe('normal');
  });

  it('containsPersonalData : détecte un email dans le payload', () => {
    const payload: PushPayload = {
      title: 'Bonjour jean.dupont@exemple.fr',
      body: 'Votre candidature a été retenue',
      data: { type: 'TEST', deep_link: '/' },
      priority: 'normal',
    };
    expect(containsPersonalData(payload)).toBe(true);
  });

  it('containsPersonalData : détecte un numéro de téléphone', () => {
    const payload: PushPayload = {
      title: 'Nouveau message',
      body: 'Appelez le 06 12 34 56 78',
      data: { type: 'TEST', deep_link: '/' },
      priority: 'normal',
    };
    expect(containsPersonalData(payload)).toBe(true);
  });

  it('containsPersonalData : retourne false pour un payload propre', () => {
    const payload = buildPushPayload('MESSAGE_RECU', { conversation_id: 'conv-123' });
    expect(containsPersonalData(payload)).toBe(false);
  });
});
