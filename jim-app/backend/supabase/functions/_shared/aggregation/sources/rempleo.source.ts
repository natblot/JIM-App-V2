// Source Rempleo — implémentation de AggregationSource
// Rempleo est un site de petites annonces de remplacement médical en France
// IMPORTANT : Respecter les CGU de Rempleo — robots.txt + rate limiting + User-Agent identifié

import type { AggregationSource } from '../aggregation-source.interface.ts';
import type { RawAnnonce, NormalizedAnnonce } from '../types.ts';
import { parseDate, validateNormalized } from '../normalizer.ts';

// Structure HTML attendue de Rempleo (snapshot pour test NFR42)
// Mettre à jour si la structure change
export const REMPLEO_SELECTORS = {
  announceLine: '.annonce',
  ville: '.annonce-lieu',
  dates: '.annonce-dates',
  retrocession: '.annonce-retrocession',
  lien: 'a.annonce-link',
} as const;

// URL de base (à adapter selon la vraie URL Rempleo)
const REMPLEO_BASE_URL = 'https://www.rempleo.com/annonces/kinesitherapeute';
const USER_AGENT = 'JIM-Bot/1.0 (job-in-med.fr; contact@jim-app.fr)';

export class RempleoSource implements AggregationSource {
  getSourceId(): string {
    return 'rempleo';
  }

  async fetch(): Promise<RawAnnonce[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      // Rate limiting : 1 requête par page, pause 1s entre les pages
      const results: RawAnnonce[] = [];

      // Simuler plusieurs pages (Rempleo pagine ses résultats)
      for (let page = 1; page <= 5; page++) {
        const url = `${REMPLEO_BASE_URL}?page=${page}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'fr-FR,fr;q=0.9',
          },
        });

        if (!response.ok) break;

        const html = await response.text();
        const pageAnnonces = this.parseHtml(html, url);

        if (pageAnnonces.length === 0) break; // Fin de la pagination

        results.push(...pageAnnonces);

        // Rate limiting : pause 1 seconde entre les pages (respecter les serveurs)
        if (page < 5) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return results;
    } finally {
      clearTimeout(timeout);
    }
  }

  normalize(raw: RawAnnonce): NormalizedAnnonce | null {
    const data = raw.raw_data;

    const dateDebutStr = (data.date_debut as string | undefined) ?? '';
    const dateFinStr = (data.date_fin as string | undefined) ?? '';

    const date_debut = parseDate(dateDebutStr);
    const date_fin = parseDate(dateFinStr);

    if (!date_debut || !date_fin) return null;

    // Extraire la rétrocession du texte (ex: "85%" → 85)
    const retrocessionStr = (data.retrocession as string | undefined) ?? '';
    const retrocessionMatch = retrocessionStr.match(/(\d+(?:[.,]\d+)?)/);
    const retrocession = retrocessionMatch
      ? parseFloat(retrocessionMatch[1].replace(',', '.'))
      : undefined;

    const normalized: NormalizedAnnonce = {
      ville: (data.ville as string | undefined) ?? '',
      code_postal: (data.code_postal as string | undefined),
      date_debut,
      date_fin,
      retrocession,
      type_annonce: 'remplacement',
      description: (data.description as string | undefined),
      type_cabinet: (data.type_cabinet as string | undefined),
      source_url: raw.source_url,
    };

    return validateNormalized(normalized);
  }

  async verify(sourceUrl: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10_000);

      const response = await fetch(sourceUrl, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT },
      });

      return response.ok && response.status !== 404;
    } catch {
      return false;
    }
  }

  // Parse le HTML de Rempleo — sélecteurs CSS
  // NOTE : Si les sélecteurs changent → test NFR42 échoue → alerte envoyée
  private parseHtml(html: string, _pageUrl: string): RawAnnonce[] {
    const results: RawAnnonce[] = [];

    // Extraction par regex (pas de DOM parser en Deno natif)
    // Pattern : chercher les blocs d'annonces
    // ATTENTION : Ces regex sont des EXEMPLES — à adapter à la vraie structure HTML de Rempleo

    // Pattern pour trouver les liens d'annonces individuelles
    const linkPattern = /href="(\/annonce\/[^"]+)"/g;
    let match;

    const seen = new Set<string>();
    while ((match = linkPattern.exec(html)) !== null) {
      const path = match[1];
      if (!seen.has(path)) {
        seen.add(path);

        // Extraire les données autour du lien (contexte de 500 chars)
        const pos = match.index;
        const context = html.slice(Math.max(0, pos - 300), pos + 300);

        // Extraire ville, dates, rétrocession depuis le contexte
        const villeMatch = context.match(/class="lieu[^"]*"[^>]*>([^<]+)</i);
        const dateMatch = context.match(/(\d{1,2}\/\d{1,2}\/\d{4})[^<]*[àau-]+[^<]*(\d{1,2}\/\d{1,2}\/\d{4})/i);
        const retroMatch = context.match(/(\d{2,3})\s*%/);

        const sourceUrl = `https://www.rempleo.com${path}`;

        results.push({
          source_url: sourceUrl,
          raw_data: {
            ville: villeMatch?.[1]?.trim() ?? 'France',
            date_debut: dateMatch?.[1] ?? '',
            date_fin: dateMatch?.[2] ?? '',
            retrocession: retroMatch?.[1] ? `${retroMatch[1]}%` : '',
          },
        });
      }
    }

    return results;
  }
}
