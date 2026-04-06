// Detecteur de mots-cles sensibles — Epic 10, Story 10.4
// Detection COTE CLIENT uniquement — le texte original n'est PAS envoye au serveur si reformule
// Normalisation Unicode pour matcher les variantes accentuees

export interface SensitiveKeywordMatch {
  keyword: string;
  position: number;
}

// Normaliser un texte : minuscules + suppression diacritiques
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Detecter les mots-cles sensibles dans un texte
// Retourne la liste des mots-cles trouves
export function detectSensitiveKeywords(text: string, keywords: string[]): string[] {
  if (!text || text.trim().length === 0 || keywords.length === 0) return [];

  const normalizedText = normalize(text);

  return keywords.filter((kw) => {
    const normalizedKw = normalize(kw);
    return normalizedText.includes(normalizedKw);
  });
}

// Verifier qu'un mot n'est PAS un faux positif contextuel
// "kinesitherapeute", "cabinet", "patient" ne doivent PAS trigger
const FALSE_POSITIVES = [
  'kinesitherapeute',
  'kinesitherapie',
  'cabinet',
  'patient',
  'praticien',
  'therapeute',
  'therapie',
  'consultation',
  'ordonnance',
  'prescription',
  'seance',
  'bilan',
  'reeducation',
];

export function filterFalsePositives(matches: string[]): string[] {
  return matches.filter((match) => {
    const normalized = normalize(match);
    return !FALSE_POSITIVES.some((fp) => normalize(fp) === normalized);
  });
}
