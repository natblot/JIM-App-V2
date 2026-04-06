// Tests detecteur mots-cles sensibles — Epic 10
import { describe, it, expect } from 'vitest';
import { detectSensitiveKeywords, filterFalsePositives } from './sensitive-keyword-detector';

const KEYWORDS = [
  'maladie', 'cancer', 'burn-out', 'burnout', 'arret maladie',
  'grossesse', 'enceinte', 'handicap', 'depression', 'traitement',
  'operation', 'hospitalisation', 'pathologie', 'diagnostic',
];

describe('detectSensitiveKeywords', () => {
  it('detecte "arret maladie" dans un texte', () => {
    const result = detectSensitiveKeywords('Je suis en arret maladie cette semaine', KEYWORDS);
    expect(result).toContain('arret maladie');
    expect(result).toContain('maladie');
  });

  it('detecte "grossesse" avec accents', () => {
    const result = detectSensitiveKeywords('Absence pour grossesse', KEYWORDS);
    expect(result).toContain('grossesse');
  });

  it('detecte les variantes sans accents', () => {
    const result = detectSensitiveKeywords('depression post-partum', KEYWORDS);
    expect(result).toContain('depression');
  });

  it('ne detecte rien dans un texte neutre', () => {
    const result = detectSensitiveKeywords('Cabinet ferme du 12 au 15 mars', KEYWORDS);
    expect(result).toHaveLength(0);
  });

  it('retourne vide pour un texte vide', () => {
    expect(detectSensitiveKeywords('', KEYWORDS)).toHaveLength(0);
    expect(detectSensitiveKeywords('  ', KEYWORDS)).toHaveLength(0);
  });

  it('retourne vide si pas de mots-cles', () => {
    expect(detectSensitiveKeywords('test maladie', [])).toHaveLength(0);
  });

  it('est insensible a la casse', () => {
    const result = detectSensitiveKeywords('CANCER detecte', KEYWORDS);
    expect(result).toContain('cancer');
  });
});

describe('filterFalsePositives', () => {
  it('ne filtre pas les vrais positifs', () => {
    const result = filterFalsePositives(['maladie', 'cancer']);
    expect(result).toEqual(['maladie', 'cancer']);
  });

  it('filtre "kinesitherapeute" (contexte normal)', () => {
    // Ce mot ne devrait jamais etre dans les keywords,
    // mais s'il y est par erreur, il est filtre
    const result = filterFalsePositives(['kinesitherapeute']);
    expect(result).toHaveLength(0);
  });

  it('filtre "cabinet" (contexte normal)', () => {
    const result = filterFalsePositives(['cabinet']);
    expect(result).toHaveLength(0);
  });

  it('garde les mots sensibles meme si des faux positifs sont presents', () => {
    const result = filterFalsePositives(['maladie', 'cabinet', 'cancer']);
    expect(result).toEqual(['maladie', 'cancer']);
  });
});
