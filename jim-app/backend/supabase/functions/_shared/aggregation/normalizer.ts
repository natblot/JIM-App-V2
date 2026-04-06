// Validation commune post-normalisation pour toutes les sources
// Utilise le schéma Zod pour valider le format final
import type { NormalizedAnnonce } from './types.ts';

// Sanitization renforcée — NFR17
// Supprime balises dangereuses, attributs événements inline, protocoles malveillants
function sanitizeText(text: string): string {
  return text
    // Supprimer les balises de script (avec contenu)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Supprimer les balises iframe, object, embed, link, meta (injection potentielle)
    .replace(/<(iframe|object|embed|link|meta|base|form|input|button)[^>]*>/gi, '')
    // Supprimer les attributs événements inline (onerror=, onclick=, onload=, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    // Supprimer tous les autres tags HTML
    .replace(/<[^>]+>/g, '')
    // Supprimer les protocoles dangereux même hors balise
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim()
    .slice(0, 1000);
}

// Tente de parser une date au format DD/MM/YYYY ou YYYY-MM-DD → YYYY-MM-DD
export function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;

  // Format ISO déjà correct
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // Format DD/MM/YYYY (courant en France)
  const dmyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  return null;
}

// Valide et nettoie une annonce normalisée
export function validateNormalized(annonce: NormalizedAnnonce): NormalizedAnnonce | null {
  // Champs obligatoires
  if (!annonce.ville || annonce.ville.length < 2) return null;
  if (!annonce.date_debut || !annonce.date_fin) return null;
  if (annonce.date_fin < annonce.date_debut) return null;

  // Rétrocession dans les bornes
  if (annonce.retrocession !== undefined) {
    if (annonce.retrocession < 0 || annonce.retrocession > 100) {
      annonce.retrocession = undefined;
    }
  }

  // Sanitization
  return {
    ...annonce,
    ville: annonce.ville.trim(),
    description: annonce.description ? sanitizeText(annonce.description) : undefined,
    type_annonce: annonce.type_annonce ?? 'remplacement',
  };
}
