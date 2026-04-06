// Service de géocodage via api-adresse.data.gouv.fr (gouvernement français)
// Pas de clé API requise, données libres

export interface GeocodingResult {
  ville: string;
  codePostal: string;
  adresseComplete: string;
  latitude: number;
  longitude: number;
}

export interface AddressSuggestion {
  label: string;
  ville: string;
  codePostal: string;
  latitude: number;
  longitude: number;
}

// Autocomplete ville (utilisé côté client aussi)
export async function searchVilles(query: string): Promise<AddressSuggestion[]> {
  if (query.length < 2) return [];

  const url = new URL('https://api-adresse.data.gouv.fr/search/');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'municipality');
  url.searchParams.set('limit', '5');
  url.searchParams.set('autocomplete', '1');

  const response = await fetch(url.toString());
  if (!response.ok) return [];

  const data = await response.json() as {
    features: Array<{
      properties: {
        label: string;
        city: string;
        postcode: string;
      };
      geometry: {
        coordinates: [number, number];
      };
    }>;
  };

  return data.features.map((f) => ({
    label: f.properties.label,
    ville: f.properties.city,
    codePostal: f.properties.postcode,
    latitude: f.geometry.coordinates[1],
    longitude: f.geometry.coordinates[0],
  }));
}

// Géocodage exact d'une ville (utilisé dans l'Edge Function)
export async function geocodeVille(ville: string, codePostal?: string): Promise<GeocodingResult | null> {
  const query = codePostal ? `${ville} ${codePostal}` : ville;
  const suggestions = await searchVilles(query);
  if (suggestions.length === 0) return null;

  const first = suggestions[0];
  return {
    ville: first.ville,
    codePostal: first.codePostal,
    adresseComplete: first.label,
    latitude: first.latitude,
    longitude: first.longitude,
  };
}
