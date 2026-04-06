// Utilitaire pur de détection de liens suspects — sans React, testable unitairement
// Utilisé par usePhishingDetection et les Edge Functions
import { BLOCKED_DOMAINS, SAFE_DOMAINS } from '../constants/blocked-domains';

export interface PhishingLink {
  url: string;
  domain: string;
  isBlocked: boolean;
  isSafe: boolean;
}

export interface PhishingResult {
  hasLinks: boolean;
  hasBlockedLinks: boolean;
  links: PhishingLink[];
}

// Extrait le domaine racine depuis une URL (ex: "sub.jim.app" → "jim.app")
function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.hostname.split('.');
    // Conserver les deux derniers segments (domaine + TLD)
    return parts.slice(-2).join('.');
  } catch {
    return '';
  }
}

// Détecte les liens suspects dans un contenu texte
// Fonction pure — pas d'effet de bord
export function detectPhishing(content: string): PhishingResult {
  const URL_REGEX = /https?:\/\/[^\s]+/g;
  const matches = content.match(URL_REGEX) ?? [];

  if (matches.length === 0) {
    return { hasLinks: false, hasBlockedLinks: false, links: [] };
  }

  const links: PhishingLink[] = matches.map((url) => {
    const domain = extractDomain(url);
    const isBlocked = BLOCKED_DOMAINS.some(
      (blocked) => domain === blocked || domain.endsWith(`.${blocked}`)
    );
    const isSafe = SAFE_DOMAINS.some(
      (safe) => domain === safe || domain.endsWith(`.${safe}`)
    );
    return { url, domain, isBlocked, isSafe };
  });

  return {
    hasLinks: true,
    hasBlockedLinks: links.some((l) => l.isBlocked),
    links,
  };
}
