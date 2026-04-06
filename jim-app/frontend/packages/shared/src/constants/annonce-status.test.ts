// Tests des constantes de statuts
import { describe, it, expect } from 'vitest';
import {
  ANNONCE_STATUS,
  ANNONCE_STATUS_LABELS,
  ANNONCE_STATUS_COLORS,
} from './annonce-status';

describe('ANNONCE_STATUS', () => {
  it('contient les 6 statuts attendus', () => {
    const statuts = Object.values(ANNONCE_STATUS);
    expect(statuts).toHaveLength(6);
    expect(statuts).toContain('active');
    expect(statuts).toContain('en_cours');
    expect(statuts).toContain('non_confirmee');
    expect(statuts).toContain('source_externe');
    expect(statuts).toContain('pourvue');
    expect(statuts).toContain('expiree');
  });

  it('chaque statut a un label', () => {
    for (const statut of Object.values(ANNONCE_STATUS)) {
      expect(ANNONCE_STATUS_LABELS[statut]).toBeDefined();
      expect(typeof ANNONCE_STATUS_LABELS[statut]).toBe('string');
    }
  });

  it('chaque statut a une couleur', () => {
    for (const statut of Object.values(ANNONCE_STATUS)) {
      expect(ANNONCE_STATUS_COLORS[statut]).toBeDefined();
    }
  });
});
