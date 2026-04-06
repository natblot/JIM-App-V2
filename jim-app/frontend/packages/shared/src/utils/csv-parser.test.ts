// Tests CSV parser facturation — Epic 9
import { describe, it, expect } from 'vitest';
import { parseCsvFacturation } from './csv-parser';

describe('parseCsvFacturation', () => {
  it('parse un CSV Kine4000 valide', () => {
    const csv = `Date;Patient;Acte;Montant;Mode
15/03/2026;Dupont Jean;AMS;23,00;CPAM
15/03/2026;Martin Marie;AMC;50,00;CB
16/03/2026;Bernard Paul;AMS;23,00;CPAM`;

    const result = parseCsvFacturation(csv);
    expect(result.success).toBe(true);
    expect(result.format).toBe('kine4000');
    expect(result.lignes).toBe(3);
    expect(result.montantTotalCents).toBe(96_00); // 23 + 50 + 23 = 96 EUR
  });

  it('parse un montant avec espace (format FR)', () => {
    const csv = `Date;Patient;Montant
15/03/2026;Dupont;1 234,56`;

    const result = parseCsvFacturation(csv);
    expect(result.success).toBe(true);
    expect(result.montantTotalCents).toBe(123_456);
  });

  it('retourne erreur pour fichier vide', () => {
    const result = parseCsvFacturation('');
    expect(result.success).toBe(false);
    expect(result.erreur).toContain('vide');
  });

  it('retourne erreur pour format inconnu', () => {
    const csv = `id,name,value
1,test,42`;

    const result = parseCsvFacturation(csv);
    expect(result.success).toBe(false);
    expect(result.format).toBe('unknown');
    expect(result.erreur).toContain('non reconnu');
  });

  it('retourne erreur si colonne montant absente', () => {
    const csv = `Date;Patient;Acte
15/03/2026;Dupont;AMS`;

    const result = parseCsvFacturation(csv);
    expect(result.success).toBe(false);
  });

  it('ignore les lignes vides', () => {
    const csv = `Date;Montant
15/03/2026;50,00

16/03/2026;30,00`;

    const result = parseCsvFacturation(csv);
    expect(result.success).toBe(true);
    expect(result.lignes).toBe(2);
    expect(result.montantTotalCents).toBe(80_00);
  });

  it('gere le separateur virgule (CSV standard)', () => {
    const csv = `Date,Montant
15/03/2026,50.00`;

    const result = parseCsvFacturation(csv);
    expect(result.success).toBe(true);
    expect(result.montantTotalCents).toBe(50_00);
  });
});
