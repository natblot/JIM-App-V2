// Tests des constantes de domaines bloqués/autorisés — Epic 6 (FR38)
import { describe, it, expect } from 'vitest';
import { BLOCKED_DOMAINS, SAFE_DOMAINS } from './blocked-domains';

describe('blocked-domains', () => {
  it('BLOCKED_DOMAINS contient j1m.app', () => {
    expect(BLOCKED_DOMAINS).toContain('j1m.app');
  });

  it('BLOCKED_DOMAINS contient jim-app.com', () => {
    expect(BLOCKED_DOMAINS).toContain('jim-app.com');
  });

  it('SAFE_DOMAINS contient jim.app', () => {
    expect(SAFE_DOMAINS).toContain('jim.app');
  });

  it('SAFE_DOMAINS contient api-adresse.data.gouv.fr', () => {
    expect(SAFE_DOMAINS).toContain('api-adresse.data.gouv.fr');
  });

  it('jim.app n\'est PAS dans BLOCKED_DOMAINS — évite les faux positifs', () => {
    expect(BLOCKED_DOMAINS).not.toContain('jim.app');
  });

  it('BLOCKED_DOMAINS est un tableau non vide', () => {
    expect(Array.from(BLOCKED_DOMAINS).length).toBeGreaterThan(0);
  });
});
