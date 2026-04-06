// Tests statuts candidature — Epic 5
import { describe, it, expect } from 'vitest';
import { CANDIDATURE_STATUTS } from '../validators/candidature.schema';

describe('CANDIDATURE_STATUTS', () => {
  it('contient tous les statuts attendus', () => {
    expect(CANDIDATURE_STATUTS).toContain('en_attente');
    expect(CANDIDATURE_STATUTS).toContain('vue');
    expect(CANDIDATURE_STATUTS).toContain('en_discussion');
    expect(CANDIDATURE_STATUTS).toContain('acceptee');
    expect(CANDIDATURE_STATUTS).toContain('refusee');
    expect(CANDIDATURE_STATUTS).toContain('refusee_auto');
    expect(CANDIDATURE_STATUTS).toContain('retiree');
    expect(CANDIDATURE_STATUTS).toContain('expiree');
  });

  it('contient exactement 8 statuts', () => {
    expect(CANDIDATURE_STATUTS).toHaveLength(8);
  });

  it("ne contient pas l'ancien statut status (anglais)", () => {
    // Vérifier la cohérence du nommage français
    expect(CANDIDATURE_STATUTS).not.toContain('pending');
    expect(CANDIDATURE_STATUTS).not.toContain('accepted');
    expect(CANDIDATURE_STATUTS).not.toContain('refused');
  });
});
