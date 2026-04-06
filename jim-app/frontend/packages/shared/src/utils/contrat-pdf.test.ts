// Tests de génération HTML du contrat IA — Epic 8
import { describe, it, expect } from 'vitest';
import { generateContratHtml } from './contrat-pdf';
import type { Contrat, ContratDonnees, ContratClause } from '../types/contrat';

// Helper : crée un contrat complet à partir de surcharges partielles
function makeContrat(overrides: Partial<Contrat> & Pick<Contrat, 'donnees' | 'clauses_obligatoires' | 'clauses_optionnelles' | 'statut'>): Contrat {
  return {
    id: 'test-contrat-id',
    annonce_id: 'test-annonce-id',
    candidature_id: 'test-candidature-id',
    titulaire_id: 'test-titulaire-id',
    remplacant_id: 'test-remplacant-id',
    template_version: 'v1.0',
    confirme_par_titulaire_at: null,
    confirme_par_remplacant_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

// Données de test représentatives
const donnees: ContratDonnees = {
  titulaire: { first_name: 'Marie', last_name: 'Dupont', rpps: '10005678901' },
  remplacant: { first_name: 'Jean', last_name: 'Martin', rpps: '10009876543' },
  dates: { debut: '01/07/2026', fin: '31/07/2026' },
  adresse_cabinet: '12 rue de la Paix, 75001 Paris',
  taux_retrocession: 70,
  template_version: 'v1.0',
};

const clausesObligatoires: ContratClause[] = [
  {
    id: 'cl-ob-1',
    titre: 'Exercice libéral',
    contenu: 'Le remplaçant exerce à titre libéral sous sa propre responsabilité.',
    editable: false,
  },
  {
    id: 'cl-ob-2',
    titre: 'Honoraires',
    contenu: 'Les honoraires perçus sont rétrocédés selon le taux convenu.',
    editable: false,
  },
];

const clausesOptionnelles: ContratClause[] = [
  {
    id: 'cl-opt-1',
    titre: 'Permanence téléphonique',
    contenu: 'Le remplaçant assure la permanence téléphonique du lundi au vendredi.',
    editable: true,
  },
];

describe('generateContratHtml', () => {
  const html = generateContratHtml(makeContrat({
    donnees,
    clauses_obligatoires: clausesObligatoires,
    clauses_optionnelles: clausesOptionnelles,
    statut: 'brouillon',
  }));

  it('retourne une string non-vide', () => {
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('contient le nom du titulaire', () => {
    expect(html).toContain('Marie');
    expect(html).toContain('Dupont');
  });

  it('contient le nom du remplaçant', () => {
    expect(html).toContain('Jean');
    expect(html).toContain('Martin');
  });

  it('contient les RPPS du titulaire et du remplaçant', () => {
    expect(html).toContain('10005678901');
    expect(html).toContain('10009876543');
  });

  it('contient le taux de retrocession', () => {
    expect(html).toContain('70');
    expect(html).toContain('%');
  });

  it('contient le disclaimer legal obligatoire (NFR)', () => {
    expect(html).toContain('Avertissement');
    expect(html).toContain('disclaimer');
  });

  it('contient les titres des clauses obligatoires', () => {
    expect(html).toContain('Exercice libéral');
    expect(html).toContain('Honoraires');
  });

  it('contient les titres des clauses optionnelles', () => {
    expect(html).toContain('Permanence téléphonique');
  });

  it('est un document HTML5 valide avec balises de base', () => {
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="fr">');
    expect(html).toContain('</html>');
    expect(html).toContain('<body');
    expect(html).toContain('</body>');
  });

  it('génère un HTML différent selon les données fournies', () => {
    const autresDonnees: ContratDonnees = {
      ...donnees,
      titulaire: { first_name: 'Sophie', last_name: 'Bernard', rpps: '10001122334' },
    };
    const autreHtml = generateContratHtml(makeContrat({
      donnees: autresDonnees,
      clauses_obligatoires: clausesObligatoires,
      clauses_optionnelles: [],
      statut: 'confirme',
    }));
    expect(autreHtml).toContain('Sophie');
    expect(autreHtml).toContain('Bernard');
    expect(autreHtml).not.toContain('Marie Dupont');
  });

  it('fonctionne avec zéro clause optionnelle', () => {
    const htmlSansOptionnelles = generateContratHtml(makeContrat({
      donnees,
      clauses_obligatoires: clausesObligatoires,
      clauses_optionnelles: [],
      statut: 'en_attente_remplacant',
    }));
    expect(htmlSansOptionnelles).toContain('Exercice libéral');
    expect(htmlSansOptionnelles).not.toContain('Permanence téléphonique');
  });
});
