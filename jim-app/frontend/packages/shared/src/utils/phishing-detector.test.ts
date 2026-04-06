// Tests de détection de liens suspects — Epic 6 (FR38)
import { describe, it, expect } from 'vitest';
import { detectPhishing } from './phishing-detector';

describe('detectPhishing', () => {
  it('message sans lien — hasLinks est false', () => {
    const result = detectPhishing('Bonjour, je suis intéressé par le poste.');
    expect(result.hasLinks).toBe(false);
    expect(result.hasBlockedLinks).toBe(false);
    expect(result.links).toHaveLength(0);
  });

  it('lien externe normal — hasLinks true, isBlocked false, isSafe false', () => {
    const result = detectPhishing('Voir mon profil sur https://linkedin.com/in/johndoe');
    expect(result.hasLinks).toBe(true);
    expect(result.hasBlockedLinks).toBe(false);
    expect(result.links[0]!.isBlocked).toBe(false);
    expect(result.links[0]!.isSafe).toBe(false);
  });

  it('typosquatting j1m.app — isBlocked true, hasBlockedLinks true', () => {
    const result = detectPhishing('Inscris-toi sur https://j1m.app/offres');
    expect(result.hasBlockedLinks).toBe(true);
    expect(result.links[0]!.isBlocked).toBe(true);
    expect(result.links[0]!.domain).toBe('j1m.app');
  });

  it('typosquatting jlm.app — isBlocked true', () => {
    const result = detectPhishing('Connecte-toi ici : https://jlm.app');
    expect(result.links[0]!.isBlocked).toBe(true);
    expect(result.links[0]!.domain).toBe('jlm.app');
  });

  it('domaine officiel jim.app — isSafe true, isBlocked false', () => {
    const result = detectPhishing('Retrouve ton contrat sur https://jim.app/contrats');
    expect(result.hasLinks).toBe(true);
    expect(result.links[0]!.isSafe).toBe(true);
    expect(result.links[0]!.isBlocked).toBe(false);
  });

  it('domaine de confiance jim.app via sous-domaine — isSafe true', () => {
    // extractDomain extrait les 2 derniers segments du hostname.
    // "app.jim.app" → "jim.app" → reconnu comme safe.
    // Les domaines multi-segments (rpps.sante.fr, api-adresse.data.gouv.fr)
    // ne sont pas reconnus par extractDomain (qui ne retient que 2 segments).
    const result = detectPhishing('Consulte ton espace sur https://app.jim.app/dashboard');
    expect(result.links[0]!.isSafe).toBe(true);
    expect(result.links[0]!.isBlocked).toBe(false);
    expect(result.links[0]!.domain).toBe('jim.app');
  });

  it('message avec plusieurs liens dont un bloqué — hasBlockedLinks true', () => {
    const result = detectPhishing(
      'Compare https://jim.app et https://j1m.app pour faire ton choix'
    );
    expect(result.hasLinks).toBe(true);
    expect(result.hasBlockedLinks).toBe(true);
    expect(result.links).toHaveLength(2);
  });

  it('URL mal formée — ne crash pas et retourne hasLinks false', () => {
    // La regex /https?:\/\/[^\s]+/ exige au moins un caractère après "://"
    // donc "https://" seul ne matche pas — links reste vide
    expect(() => detectPhishing('https://')).not.toThrow();
    const result = detectPhishing('https://');
    expect(result.hasLinks).toBe(false);
    expect(result.links).toHaveLength(0);
  });

  it('lien http (pas https) — détecté comme lien', () => {
    const result = detectPhishing('Ancien lien : http://example.com/page');
    expect(result.hasLinks).toBe(true);
    expect(result.links[0]!.url).toBe('http://example.com/page');
  });

  it('deux URLs dans le même message — links.length vaut 2', () => {
    const result = detectPhishing(
      'Visite https://jim.app et https://rpps.sante.fr pour plus d\'infos'
    );
    expect(result.links).toHaveLength(2);
    expect(result.hasLinks).toBe(true);
  });
});
