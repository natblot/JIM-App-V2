// Logique de correspondance pour la déduplication — version testable Node.js
export interface AnnonceForMatch {
  ville: string;
  date_debut: string;
  date_fin: string;
  source: string;
  source_url?: string;
}

// Vérifie si deux annonces correspondent (pour la fusion native ↔ agrégée)
export function annoncesCorrespondent(a: AnnonceForMatch, b: AnnonceForMatch): boolean {
  // Même source → pas une correspondance native/agrégée
  if (a.source === b.source) return false;

  // Correspondance ville (insensible à la casse)
  const villeMatch = a.ville.toLowerCase().trim() === b.ville.toLowerCase().trim();
  if (!villeMatch) return false;

  // Correspondance dates : les périodes se chevauchent
  const aDebut = new Date(a.date_debut);
  const aFin = new Date(a.date_fin);
  const bDebut = new Date(b.date_debut);
  const bFin = new Date(b.date_fin);

  const overlaps = aDebut <= bFin && bDebut <= aFin;
  return overlaps;
}

// Vérifie si une URL source est valide (pas d'injection)
export function isValidSourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) &&
      parsed.hostname.length > 0 &&
      !url.includes('javascript:') &&
      !url.includes('data:');
  } catch {
    return false;
  }
}
