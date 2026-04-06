import { describe, it, expect } from 'vitest';
import { createCalendrierSchema, CALENDRIER_TYPES } from './calendrier.schema';

describe('createCalendrierSchema', () => {
  it('valide une disponibilité correcte (date_debut < date_fin, type par défaut)', () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '2026-04-01',
      date_fin: '2026-04-10',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('disponible');
    }
  });

  it('valide une période indisponible', () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '2026-05-01',
      date_fin: '2026-05-15',
      type: 'indisponible',
    });
    expect(result.success).toBe(true);
  });

  it('valide une période remplacement', () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '2026-06-01',
      date_fin: '2026-06-30',
      type: 'remplacement',
    });
    expect(result.success).toBe(true);
  });

  it('rejette date_fin < date_debut', () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '2026-04-10',
      date_fin: '2026-04-01',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('date_fin');
    }
  });

  it('accepte date_debut == date_fin (même jour)', () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '2026-04-05',
      date_fin: '2026-04-05',
    });
    expect(result.success).toBe(true);
  });

  it('rejette format date invalide (DD/MM/YYYY)', () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '01/04/2026',
      date_fin: '10/04/2026',
    });
    expect(result.success).toBe(false);
  });

  it("rejette type invalide ('occupied')", () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '2026-04-01',
      date_fin: '2026-04-10',
      type: 'occupied',
    });
    expect(result.success).toBe(false);
  });

  it("applique le default type='disponible' si omis", () => {
    const result = createCalendrierSchema.safeParse({
      date_debut: '2026-07-01',
      date_fin: '2026-07-31',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('disponible');
    }
  });
});

describe('CALENDRIER_TYPES', () => {
  it('contient les 3 types attendus', () => {
    expect(CALENDRIER_TYPES).toContain('disponible');
    expect(CALENDRIER_TYPES).toContain('indisponible');
    expect(CALENDRIER_TYPES).toContain('remplacement');
    expect(CALENDRIER_TYPES).toHaveLength(3);
  });

  it("ne contient pas de type 'free' ou 'busy' (anglais)", () => {
    expect(CALENDRIER_TYPES).not.toContain('free');
    expect(CALENDRIER_TYPES).not.toContain('busy');
  });
});
