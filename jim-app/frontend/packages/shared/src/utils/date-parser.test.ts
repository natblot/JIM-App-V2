import { describe, it, expect } from 'vitest';
import { parseDate } from './date-parser';

describe('parseDate', () => {
  it('accepte le format ISO YYYY-MM-DD', () => {
    expect(parseDate('2026-06-01')).toBe('2026-06-01');
  });

  it('convertit le format DD/MM/YYYY en YYYY-MM-DD', () => {
    expect(parseDate('01/06/2026')).toBe('2026-06-01');
  });

  it('convertit le format D/M/YYYY (chiffre simple)', () => {
    expect(parseDate('1/6/2026')).toBe('2026-06-01');
  });

  it('retourne null pour une chaîne vide', () => {
    expect(parseDate('')).toBeNull();
  });

  it('retourne null pour un format invalide', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });

  it('retourne null pour undefined', () => {
    expect(parseDate(undefined as unknown as string)).toBeNull();
  });
});
