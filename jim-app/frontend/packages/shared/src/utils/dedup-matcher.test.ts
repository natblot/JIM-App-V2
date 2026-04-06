import { describe, it, expect } from 'vitest';
import { annoncesCorrespondent, isValidSourceUrl } from './dedup-matcher';

const native = {
  ville: 'Lyon',
  date_debut: '2026-06-01',
  date_fin: '2026-06-30',
  source: 'native',
};

const agregee = {
  ville: 'Lyon',
  date_debut: '2026-06-01',
  date_fin: '2026-06-30',
  source: 'rempleo',
  source_url: 'https://www.rempleo.com/annonce/123',
};

describe('annoncesCorrespondent', () => {
  it('retourne true pour une correspondance ville + dates exactes', () => {
    expect(annoncesCorrespondent(native, agregee)).toBe(true);
  });

  it('retourne false si même source', () => {
    const other = { ...agregee, source: 'native' };
    expect(annoncesCorrespondent(native, other)).toBe(false);
  });

  it('retourne false si ville différente', () => {
    const autre = { ...agregee, ville: 'Paris' };
    expect(annoncesCorrespondent(native, autre)).toBe(false);
  });

  it('retourne false si les dates ne se chevauchent pas', () => {
    const futureAnnonce = { ...agregee, date_debut: '2026-08-01', date_fin: '2026-08-31' };
    expect(annoncesCorrespondent(native, futureAnnonce)).toBe(false);
  });

  it('retourne true si les dates se chevauchent partiellement', () => {
    const overlap = { ...agregee, date_debut: '2026-06-20', date_fin: '2026-07-15' };
    expect(annoncesCorrespondent(native, overlap)).toBe(true);
  });

  it('est insensible à la casse pour la ville', () => {
    const upperVille = { ...agregee, ville: 'LYON' };
    expect(annoncesCorrespondent(native, upperVille)).toBe(true);
  });
});

describe('isValidSourceUrl', () => {
  it('accepte une URL https valide', () => {
    expect(isValidSourceUrl('https://www.rempleo.com/annonce/123')).toBe(true);
  });

  it('accepte une URL http valide', () => {
    expect(isValidSourceUrl('http://example.com/annonce')).toBe(true);
  });

  it('rejette une URL javascript:', () => {
    expect(isValidSourceUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejette une URL data:', () => {
    expect(isValidSourceUrl('data:text/html,<h1>XSS</h1>')).toBe(false);
  });

  it('rejette une chaîne non-URL', () => {
    expect(isValidSourceUrl('not-a-url')).toBe(false);
  });

  it('rejette une URL vide', () => {
    expect(isValidSourceUrl('')).toBe(false);
  });
});
