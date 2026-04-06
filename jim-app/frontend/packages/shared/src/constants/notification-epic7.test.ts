import { describe, it, expect } from 'vitest';
import { NOTIFICATION_TYPES } from './notification-types';

describe('notification-types Epic 7', () => {
  it('contient CALENDRIER_OUTDATED', () => {
    expect(NOTIFICATION_TYPES).toHaveProperty('CALENDRIER_OUTDATED');
    expect(NOTIFICATION_TYPES.CALENDRIER_OUTDATED).toBe('CALENDRIER_OUTDATED');
  });

  it('contient POST_REMPLACEMENT_NOTATION', () => {
    expect(NOTIFICATION_TYPES).toHaveProperty('POST_REMPLACEMENT_NOTATION');
    expect(NOTIFICATION_TYPES.POST_REMPLACEMENT_NOTATION).toBe('POST_REMPLACEMENT_NOTATION');
  });

  it('contient NOTIFICATION_GROUPED', () => {
    expect(NOTIFICATION_TYPES).toHaveProperty('NOTIFICATION_GROUPED');
    expect(NOTIFICATION_TYPES.NOTIFICATION_GROUPED).toBe('NOTIFICATION_GROUPED');
  });

  it('MESSAGE_RECU est toujours présent (Epic 6)', () => {
    expect(NOTIFICATION_TYPES).toHaveProperty('MESSAGE_RECU');
    expect(NOTIFICATION_TYPES.MESSAGE_RECU).toBe('MESSAGE_RECU');
  });

  it('CANDIDATURE_ACCEPTEE est toujours présent (Epic 5)', () => {
    expect(NOTIFICATION_TYPES).toHaveProperty('CANDIDATURE_ACCEPTEE');
    expect(NOTIFICATION_TYPES.CANDIDATURE_ACCEPTEE).toBe('CANDIDATURE_ACCEPTEE');
  });

  it('Toutes les valeurs sont des strings non vides', () => {
    const values = Object.values(NOTIFICATION_TYPES);
    for (const value of values) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
