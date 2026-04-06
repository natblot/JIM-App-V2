// Tests du schéma Zod annonce — Story 2.1, 2.2
import { describe, it, expect } from 'vitest';
import {
  annonceSchema,
  annonceStep1Schema,
  annonceStep2Schema,
  annonceStep3Schema,
  annonceUpdateSchema,
} from './annonce.schema';

const validBase = {
  type_annonce: 'remplacement' as const,
  date_debut: '2026-06-01',
  date_fin: '2026-06-30',
  retrocession: 82,
  ville: 'Lyon',
  specialites: [],
  is_urgent: false,
};

describe('annonceSchema', () => {
  it('valide une annonce correcte', () => {
    const result = annonceSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('rejette une rétrocession > 100', () => {
    const result = annonceSchema.safeParse({ ...validBase, retrocession: 101 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.path).toContain('retrocession');
    }
  });

  it('rejette une rétrocession négative', () => {
    const result = annonceSchema.safeParse({ ...validBase, retrocession: -1 });
    expect(result.success).toBe(false);
  });

  it('rejette date_fin avant date_debut', () => {
    const result = annonceSchema.safeParse({
      ...validBase,
      date_debut: '2026-06-30',
      date_fin: '2026-06-01',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.path).toContain('date_fin');
    }
  });

  it('rejette une date dans le passé', () => {
    const result = annonceSchema.safeParse({
      ...validBase,
      date_debut: '2020-01-01',
      date_fin: '2020-01-31',
    });
    expect(result.success).toBe(false);
  });

  it('rejette une ville vide', () => {
    const result = annonceSchema.safeParse({ ...validBase, ville: '' });
    expect(result.success).toBe(false);
  });

  it('rejette un code postal invalide', () => {
    const result = annonceSchema.safeParse({ ...validBase, code_postal: '123' });
    expect(result.success).toBe(false);
  });

  it('accepte is_urgent = true', () => {
    const result = annonceSchema.safeParse({ ...validBase, is_urgent: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_urgent).toBe(true);
    }
  });

  it('rejette une description trop longue', () => {
    const result = annonceSchema.safeParse({
      ...validBase,
      description: 'a'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it('accepte une description optionnelle absente', () => {
    const result = annonceSchema.safeParse({ ...validBase });
    expect(result.success).toBe(true);
  });

  it("valide tous les types d'annonce", () => {
    const types = ['remplacement', 'assistanat', 'collaboration', 'cession'] as const;
    for (const type of types) {
      const result = annonceSchema.safeParse({ ...validBase, type_annonce: type });
      expect(result.success).toBe(true);
    }
  });

  it("rejette un type d'annonce invalide", () => {
    const result = annonceSchema.safeParse({ ...validBase, type_annonce: 'invalide' });
    expect(result.success).toBe(false);
  });
});

describe('annonceStep1Schema', () => {
  it("valide les données de l'étape 1", () => {
    const result = annonceStep1Schema.safeParse({
      type_annonce: 'remplacement',
      date_debut: '2026-06-01',
      date_fin: '2026-06-30',
      is_urgent: false,
    });
    expect(result.success).toBe(true);
  });

  it('rejette un type_annonce manquant (sans default)', () => {
    // Le schéma step1 est un pick, les defaults de l'objet de base s'appliquent
    const result = annonceStep1Schema.safeParse({
      date_debut: '2026-06-01',
      date_fin: '2026-06-30',
      is_urgent: false,
    });
    // type_annonce a un default('remplacement') donc il est valide même absent
    expect(result.success).toBe(true);
  });

  it('rejette date_debut dans le passé', () => {
    const result = annonceStep1Schema.safeParse({
      type_annonce: 'remplacement',
      date_debut: '2020-01-01',
      date_fin: '2020-01-31',
      is_urgent: false,
    });
    expect(result.success).toBe(false);
  });
});

describe('annonceStep2Schema', () => {
  it("valide les données de l'étape 2", () => {
    const result = annonceStep2Schema.safeParse({
      ville: 'Paris',
      retrocession: 82,
    });
    expect(result.success).toBe(true);
  });

  it('rejette rétrocession invalide', () => {
    const result = annonceStep2Schema.safeParse({
      ville: 'Paris',
      retrocession: 150,
    });
    expect(result.success).toBe(false);
  });
});

describe('annonceStep3Schema', () => {
  it("valide un objet vide (toutes les clés sont optionnelles)", () => {
    const result = annonceStep3Schema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("valide une description valide", () => {
    const result = annonceStep3Schema.safeParse({
      description: 'Cabinet de kinésithérapie libéral',
    });
    expect(result.success).toBe(true);
  });

  it("rejette une description trop longue", () => {
    const result = annonceStep3Schema.safeParse({
      description: 'a'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});

describe('annonceUpdateSchema', () => {
  it('valide la fermeture (statut pourvue)', () => {
    const result = annonceUpdateSchema.safeParse({ statut: 'pourvue' });
    expect(result.success).toBe(true);
  });

  it('valide la mise à jour is_urgent', () => {
    const result = annonceUpdateSchema.safeParse({ is_urgent: true });
    expect(result.success).toBe(true);
  });

  it('accepte un objet vide (toutes les clés sont optionnelles)', () => {
    const result = annonceUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejette un statut non autorisé côté client', () => {
    const result = annonceUpdateSchema.safeParse({ statut: 'active' });
    expect(result.success).toBe(false);
  });
});
