// Tests du schéma Zod contrats IA — Epic 8
import { describe, it, expect } from 'vitest';
import {
  generateContratSchema,
  confirmContratSchema,
  updateClausesSchema,
  CONTRAT_STATUTS,
  type ContratStatut,
} from './contrat.schema';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_UUID_2 = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

describe('generateContratSchema', () => {
  it('accepte un UUID valide pour candidature_id', () => {
    const result = generateContratSchema.safeParse({ candidature_id: VALID_UUID });
    expect(result.success).toBe(true);
  });

  it('rejette un candidature_id vide', () => {
    const result = generateContratSchema.safeParse({ candidature_id: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain('UUID invalide');
    }
  });

  it('rejette un candidature_id qui n\'est pas un UUID valide', () => {
    const result = generateContratSchema.safeParse({ candidature_id: 'pas-un-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejette si candidature_id est absent', () => {
    const result = generateContratSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('confirmContratSchema', () => {
  it('accepte un UUID valide pour contrat_id', () => {
    const result = confirmContratSchema.safeParse({ contrat_id: VALID_UUID });
    expect(result.success).toBe(true);
  });

  it('rejette un contrat_id vide', () => {
    const result = confirmContratSchema.safeParse({ contrat_id: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain('UUID invalide');
    }
  });

  it('rejette un contrat_id qui n\'est pas un UUID valide', () => {
    const result = confirmContratSchema.safeParse({ contrat_id: 'contrat-123-invalide' });
    expect(result.success).toBe(false);
  });
});

describe('updateClausesSchema', () => {
  it('accepte un contrat valide avec clauses editables', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: VALID_UUID,
      clauses_optionnelles: [
        {
          id: 'clause-1',
          titre: 'Clause de garde',
          contenu: 'Le remplaçant assure les gardes du cabinet.',
          editable: true,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepte un tableau de clauses vide (reset possible)', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: VALID_UUID,
      clauses_optionnelles: [],
    });
    expect(result.success).toBe(true);
  });

  it('rejette une clause dont le contenu dépasse 2000 caractères', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: VALID_UUID,
      clauses_optionnelles: [
        {
          id: 'clause-1',
          titre: 'Clause longue',
          contenu: 'a'.repeat(2001),
          editable: true,
        },
      ],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages.some((m) => m.includes('2000'))).toBe(true);
    }
  });

  it('accepte un contenu exactement à 2000 caractères', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: VALID_UUID,
      clauses_optionnelles: [
        {
          id: 'clause-1',
          titre: 'Clause limite',
          contenu: 'a'.repeat(2000),
          editable: true,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejette une clause avec editable=false (seules les clauses éditables sont modifiables)', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: VALID_UUID,
      clauses_optionnelles: [
        {
          id: 'clause-obligatoire',
          titre: 'Clause obligatoire',
          contenu: 'Cette clause est fixée par la loi.',
          editable: false,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('rejette si contrat_id n\'est pas un UUID valide', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: 'pas-un-uuid',
      clauses_optionnelles: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejette un titre de clause vide', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: VALID_UUID,
      clauses_optionnelles: [
        {
          id: 'clause-1',
          titre: '',
          contenu: 'Contenu valide.',
          editable: true,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('accepte plusieurs clauses valides', () => {
    const result = updateClausesSchema.safeParse({
      contrat_id: VALID_UUID_2,
      clauses_optionnelles: [
        { id: 'c1', titre: 'Clause 1', contenu: 'Texte 1', editable: true },
        { id: 'c2', titre: 'Clause 2', contenu: 'Texte 2', editable: true },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.clauses_optionnelles).toHaveLength(2);
    }
  });
});

describe('ContratStatut — valeurs valides', () => {
  it('brouillon est un statut valide', () => {
    const statut: ContratStatut = 'brouillon';
    expect(CONTRAT_STATUTS).toContain(statut);
  });

  it('en_attente_remplacant est un statut valide', () => {
    const statut: ContratStatut = 'en_attente_remplacant';
    expect(CONTRAT_STATUTS).toContain(statut);
  });

  it('confirme est un statut valide', () => {
    const statut: ContratStatut = 'confirme';
    expect(CONTRAT_STATUTS).toContain(statut);
  });

  it('refuse n\'est pas un statut de contrat valide', () => {
    // Vérifie que le type ne contient pas de valeur invalide au runtime
    expect(CONTRAT_STATUTS).not.toContain('refuse');
  });

  it('les 3 statuts attendus sont présents et seulement eux', () => {
    expect(CONTRAT_STATUTS).toHaveLength(3);
    expect(CONTRAT_STATUTS).toEqual(['brouillon', 'en_attente_remplacant', 'confirme']);
  });
});
