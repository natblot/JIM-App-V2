// Hook autocomplete pour la recherche de villes — api-adresse.data.gouv.fr
// Utilisé dans le formulaire de publication (Story 2.1)
import { useState, useEffect, useRef } from 'react';

export interface VilleSuggestion {
  label: string;
  ville: string;
  codePostal: string;
  latitude: number;
  longitude: number;
}

export function useVilleAutocomplete(query: string, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<VilleSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      // Annuler la requête précédente
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsLoading(true);
      try {
        const url = new URL('https://api-adresse.data.gouv.fr/search/');
        url.searchParams.set('q', query);
        url.searchParams.set('type', 'municipality');
        url.searchParams.set('limit', '5');
        url.searchParams.set('autocomplete', '1');

        const response = await fetch(url.toString(), {
          signal: abortRef.current!.signal,
        });

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await response.json()) as {
          features: Array<{
            properties: { label: string; city: string; postcode: string };
            geometry: { coordinates: [number, number] };
          }>;
        };

        setSuggestions(
          data.features.map((f) => ({
            label: f.properties.label,
            ville: f.properties.city,
            codePostal: f.properties.postcode,
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0],
          }))
        );
      } catch (err) {
        // Ignorer les erreurs d'abort
        if (err instanceof Error && err.name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return { suggestions, isLoading };
}
