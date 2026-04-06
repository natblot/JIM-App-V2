// Hook de détection de liens suspects dans le contenu d'un message — Epic 6 (FR38)
// Purement synchrone via useMemo — pas de requête réseau
import { useMemo } from 'react';
import { detectPhishing } from '../utils/phishing-detector';
export type { PhishingLink, PhishingResult } from '../utils/phishing-detector';

// Enveloppe React autour de la fonction pure detectPhishing
// Recalcul uniquement si le contenu du message change
export function usePhishingDetection(content: string) {
  return useMemo(() => detectPhishing(content), [content]);
}
