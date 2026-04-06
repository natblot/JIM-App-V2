import type { RppsVerificationResult, RppsSearchResult } from './types.ts';

// Interface pour l'adapter API Annuaire Santé
// Permet le mock en dev et le remplacement futur
export interface AnnuaireSanteAdapter {
  verifyByRpps(rppsNumber: string): Promise<RppsVerificationResult | null>;
  searchByName(params: {
    lastName: string;
    firstName: string;
    city?: string;
  }): Promise<RppsSearchResult[]>;
}

// ============================================================
// Client réel — API Annuaire Santé FHIR R4
// ============================================================

const ANNUAIRE_BASE_URL = 'https://gateway.api.esante.gouv.fr/fhir/v1';
const PROFESSION_CODE_KINE = '50'; // Masseur-Kinésithérapeute

function extractPractitionerData(resource: Record<string, unknown>): RppsVerificationResult | null {
  const identifiers = resource.identifier as Array<{ system: string; value: string }> | undefined;
  const rppsIdentifier = identifiers?.find(
    (id) => id.system === 'urn:oid:1.2.250.1.71.4.2.1'
  );
  if (!rppsIdentifier) return null;

  const names = resource.name as Array<{
    family: string;
    given?: string[];
  }> | undefined;
  const primaryName = names?.[0];
  if (!primaryName) return null;

  return {
    rpps_number: rppsIdentifier.value,
    last_name: primaryName.family ?? '',
    first_name: primaryName.given?.[0] ?? '',
    profession_code: PROFESSION_CODE_KINE,
    profession_label: 'Masseur-Kinésithérapeute',
    city: null,
    verified: true,
  };
}

// Retry exponentiel (NFR39)
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Retry sur rate limiting (429) et erreurs serveur (5xx)
      if (response.status === 429 || response.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error('Max retries exceeded');
}

export class AnnuaireSanteClient implements AnnuaireSanteAdapter {
  private readonly apiKey: string;
  private readonly headers: Record<string, string>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.headers = {
      'ESANTE-API-KEY': this.apiKey,
      'Accept': 'application/fhir+json',
      'Content-Type': 'application/fhir+json',
    };
  }

  async verifyByRpps(rppsNumber: string): Promise<RppsVerificationResult | null> {
    const url = `${ANNUAIRE_BASE_URL}/Practitioner?identifier=${rppsNumber}&_count=1`;

    const response = await fetchWithRetry(url, { headers: this.headers });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API Annuaire Santé erreur ${response.status}`);
    }

    const bundle = await response.json() as {
      entry?: Array<{ resource: Record<string, unknown> }>;
    };

    const entry = bundle.entry?.[0];
    if (!entry) return null;

    return extractPractitionerData(entry.resource);
  }

  async searchByName(params: {
    lastName: string;
    firstName: string;
    city?: string;
  }): Promise<RppsSearchResult[]> {
    const queryParams = new URLSearchParams({
      family: params.lastName,
      given: params.firstName,
      _count: '10',
    });
    if (params.city) {
      queryParams.append('address-city', params.city);
    }

    const url = `${ANNUAIRE_BASE_URL}/Practitioner?${queryParams.toString()}`;
    const response = await fetchWithRetry(url, { headers: this.headers });

    if (!response.ok) return [];

    const bundle = await response.json() as {
      entry?: Array<{ resource: Record<string, unknown> }>;
    };

    return (bundle.entry ?? []).map((entry) => {
      const names = entry.resource.name as Array<{
        family: string;
        given?: string[];
      }> | undefined;
      const identifiers = entry.resource.identifier as Array<{
        system: string;
        value: string;
      }> | undefined;

      const rppsId = identifiers?.find(
        (id) => id.system === 'urn:oid:1.2.250.1.71.4.2.1'
      );
      const name = names?.[0];

      return {
        rpps_number: rppsId?.value ?? '',
        last_name: name?.family ?? '',
        first_name: name?.given?.[0] ?? '',
        city: null,
        profession_label: 'Masseur-Kinésithérapeute',
      };
    }).filter((r) => r.rpps_number !== '');
  }
}

// ============================================================
// Mock dev — données de test réalistes
// ============================================================

export class AnnuaireSanteMock implements AnnuaireSanteAdapter {
  private readonly mockData: RppsVerificationResult[] = [
    {
      rpps_number: '10003456789',
      first_name: 'Léa',
      last_name: 'DUPONT',
      profession_code: '50',
      profession_label: 'Masseur-Kinésithérapeute',
      city: 'Lille',
      verified: true,
    },
    {
      rpps_number: '10009876543',
      first_name: 'Thomas',
      last_name: 'MARTIN',
      profession_code: '50',
      profession_label: 'Masseur-Kinésithérapeute',
      city: 'Lyon',
      verified: true,
    },
    {
      rpps_number: '10001234567',
      first_name: 'Michel',
      last_name: 'TOURNIER',
      profession_code: '50',
      profession_label: 'Masseur-Kinésithérapeute',
      city: 'Périgueux',
      verified: true,
    },
  ];

  async verifyByRpps(rppsNumber: string): Promise<RppsVerificationResult | null> {
    // Simuler la latence réseau
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.mockData.find((d) => d.rpps_number === rppsNumber) ?? null;
  }

  async searchByName(params: {
    lastName: string;
    firstName: string;
    city?: string;
  }): Promise<RppsSearchResult[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return this.mockData
      .filter((d) =>
        d.last_name.toLowerCase().includes(params.lastName.toLowerCase()) ||
        d.first_name.toLowerCase().includes(params.firstName.toLowerCase())
      )
      .map(({ rpps_number, first_name, last_name, city, profession_label }) => ({
        rpps_number,
        first_name,
        last_name,
        city,
        profession_label,
      }));
  }
}

// Factory — choisit real ou mock selon l'environnement
export function createAnnuaireSanteClient(): AnnuaireSanteAdapter {
  const apiKey = Deno.env.get('ANNUAIRE_SANTE_API_KEY');
  const isDev = Deno.env.get('SUPABASE_ENV') === 'local' || !apiKey;

  if (isDev) {
    console.log('[AnnuaireSante] Using MOCK client (dev/no API key)');
    return new AnnuaireSanteMock();
  }

  return new AnnuaireSanteClient(apiKey);
}
