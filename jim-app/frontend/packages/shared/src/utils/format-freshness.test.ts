import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatFreshness } from './format-freshness';

describe('formatFreshness', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-26T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retourne "Non vérifié" pour une valeur null', () => {
    expect(formatFreshness(null)).toBe('Non vérifié');
  });

  it('retourne "Non vérifié" pour undefined', () => {
    expect(formatFreshness(undefined)).toBe('Non vérifié');
  });

  it('retourne "Il y a X min" pour moins d\'une heure', () => {
    const date = new Date('2026-03-26T11:30:00Z').toISOString();
    expect(formatFreshness(date)).toBe('Il y a 30 min');
  });

  it('retourne "Il y a Xh" pour moins d\'un jour', () => {
    const date = new Date('2026-03-26T08:00:00Z').toISOString();
    expect(formatFreshness(date)).toBe('Il y a 4h');
  });

  it('retourne "Il y a 1 jour" pour hier', () => {
    const date = new Date('2026-03-25T12:00:00Z').toISOString();
    expect(formatFreshness(date)).toBe('Il y a 1 jour');
  });

  it('retourne "Il y a X jours" pour moins d\'une semaine', () => {
    const date = new Date('2026-03-23T12:00:00Z').toISOString();
    expect(formatFreshness(date)).toBe('Il y a 3 jours');
  });

  it('retourne "Il y a X semaine(s)" pour plus d\'une semaine', () => {
    const date = new Date('2026-03-12T12:00:00Z').toISOString();
    expect(formatFreshness(date)).toBe('Il y a 2 semaine(s)');
  });
});
