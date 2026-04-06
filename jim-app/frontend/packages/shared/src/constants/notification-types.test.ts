// Tests du registre des types de notifications
import { describe, it, expect } from 'vitest';
import { NOTIFICATION_TYPES } from './notification-types';

describe('NOTIFICATION_TYPES', () => {
  it('contient les types Epic 2', () => {
    expect(NOTIFICATION_TYPES.ANNONCE_CREEE).toBe('ANNONCE_CREEE');
    expect(NOTIFICATION_TYPES.ANNONCE_URGENTE).toBe('ANNONCE_URGENTE');
    expect(NOTIFICATION_TYPES.ANNONCE_POURVUE).toBe('ANNONCE_POURVUE');
    expect(NOTIFICATION_TYPES.ANNONCE_FRAICHEUR_J7).toBe('ANNONCE_FRAICHEUR_J7');
    expect(NOTIFICATION_TYPES.ANNONCE_FRAICHEUR_J3).toBe('ANNONCE_FRAICHEUR_J3');
  });

  it('contient les types Epic 1 (rétrocompatibilité)', () => {
    expect(NOTIFICATION_TYPES.RPPS_VERIFIE).toBe('RPPS_VERIFIE');
    expect(NOTIFICATION_TYPES.RPPS_EN_ATTENTE).toBe('RPPS_EN_ATTENTE');
  });

  it('toutes les valeurs sont des strings non vides', () => {
    for (const value of Object.values(NOTIFICATION_TYPES)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
