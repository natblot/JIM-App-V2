// Tests calculateur retrocession web — Epic 13
import { describe, it, expect } from 'vitest';

const URSSAF_RATE = 0.22;
const CARPIMKO_ANNUAL = 3600;
const CARPIMKO_DAILY = CARPIMKO_ANNUAL / 365;

function calculate(montant: number, taux: number, jours: number) {
  const retrocession = Math.round(montant * taux) / 100;
  const partTitulaire = montant - retrocession;
  const chargesUrssaf = Math.round(retrocession * URSSAF_RATE * 100) / 100;
  const chargesCarpimko = Math.round(CARPIMKO_DAILY * jours * 100) / 100;
  const net = retrocession - chargesUrssaf - chargesCarpimko;
  return { retrocession, partTitulaire, chargesUrssaf, chargesCarpimko, net };
}

describe('Calculateur retrocession', () => {
  it('calcule 80% de 5000 EUR', () => {
    const r = calculate(5000, 80, 10);
    expect(r.retrocession).toBe(4000);
    expect(r.partTitulaire).toBe(1000);
  });

  it('calcule URSSAF 22% de la retrocession', () => {
    const r = calculate(5000, 80, 10);
    expect(r.chargesUrssaf).toBe(880);
  });

  it('calcule CARPIMKO au prorata des jours', () => {
    const r = calculate(5000, 80, 10);
    const expected = Math.round(CARPIMKO_DAILY * 10 * 100) / 100;
    expect(r.chargesCarpimko).toBe(expected);
  });

  it('net = retrocession - URSSAF - CARPIMKO', () => {
    const r = calculate(5000, 80, 10);
    expect(r.net).toBeCloseTo(r.retrocession - r.chargesUrssaf - r.chargesCarpimko, 2);
  });

  it('gere 100% retrocession', () => {
    const r = calculate(3000, 100, 5);
    expect(r.retrocession).toBe(3000);
    expect(r.partTitulaire).toBe(0);
  });

  it('gere 50% retrocession', () => {
    const r = calculate(10000, 50, 20);
    expect(r.retrocession).toBe(5000);
    expect(r.partTitulaire).toBe(5000);
  });
});
