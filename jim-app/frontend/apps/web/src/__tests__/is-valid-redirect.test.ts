import { describe, it, expect } from 'vitest';
import { isValidRedirect } from '../lib/validate-redirect';

describe('isValidRedirect', () => {
  it('retourne / si null', () => {
    expect(isValidRedirect(null)).toBe('/');
  });

  it('retourne / si chaine vide', () => {
    expect(isValidRedirect('')).toBe('/');
  });

  it('accepte les chemins relatifs', () => {
    expect(isValidRedirect('/annonce/123')).toBe('/annonce/123');
    expect(isValidRedirect('/messages')).toBe('/messages');
    expect(isValidRedirect('/')).toBe('/');
  });

  it('rejette les URLs absolues (open redirect)', () => {
    expect(isValidRedirect('https://evil.com')).toBe('/');
    expect(isValidRedirect('http://evil.com')).toBe('/');
  });

  it('rejette les protocol-relative URLs', () => {
    expect(isValidRedirect('//evil.com')).toBe('/');
  });

  it('rejette les backslashes (contournement IE)', () => {
    expect(isValidRedirect('/\\evil.com')).toBe('/');
  });

  it('rejette javascript: protocol', () => {
    expect(isValidRedirect('javascript:alert(1)')).toBe('/');
    expect(isValidRedirect('JAVASCRIPT:alert(1)')).toBe('/');
  });

  it('accepte les chemins avec query params', () => {
    expect(isValidRedirect('/login?next=foo')).toBe('/login?next=foo');
    expect(isValidRedirect('/annonce/123?tab=details')).toBe('/annonce/123?tab=details');
  });
});
