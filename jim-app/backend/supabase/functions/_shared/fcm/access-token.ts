// Génère un access token Firebase Cloud Messaging via OAuth2 service account.
// Le service account JSON est stocké en base64 dans le secret FCM_SERVICE_ACCOUNT_B64.
// Le token est mis en cache au niveau du module pour la durée de vie de l'instance Edge Function
// et rafraîchi 5 minutes avant son expiration réelle.
// Sécurité (NFR — CLAUDE.md) : aucun log du JWT ni du payload service account.

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
  token_uri?: string;
}

interface CachedToken {
  value: string;
  expiresAt: number;
  projectId: string;
}

export interface FcmCredentials {
  token: string;
  projectId: string;
}

const FCM_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const DEFAULT_TOKEN_URI = 'https://oauth2.googleapis.com/token';
const REFRESH_MARGIN_MS = 5 * 60 * 1000;
const TOKEN_TTL_SEC = 3600;

let cached: CachedToken | null = null;

export async function getFcmAccessToken(): Promise<FcmCredentials> {
  const now = Date.now();
  if (cached && cached.expiresAt > now + REFRESH_MARGIN_MS) {
    return { token: cached.value, projectId: cached.projectId };
  }

  const sa = loadServiceAccount();
  const jwt = await signServiceAccountJwt(sa);
  const { accessToken, expiresInSec } = await exchangeJwtForToken(
    jwt,
    sa.token_uri ?? DEFAULT_TOKEN_URI,
  );

  cached = {
    value: accessToken,
    expiresAt: now + expiresInSec * 1000,
    projectId: sa.project_id,
  };
  return { token: accessToken, projectId: sa.project_id };
}

// Reset utile pour les tests et la rotation manuelle de credentials
export function resetFcmAccessTokenCache(): void {
  cached = null;
}

function loadServiceAccount(): ServiceAccount {
  const b64 = Deno.env.get('FCM_SERVICE_ACCOUNT_B64');
  if (!b64) {
    throw new Error(
      'FCM_SERVICE_ACCOUNT_B64 manquant — configurer le service account Firebase en base64 dans les secrets Supabase',
    );
  }

  let json: string;
  try {
    json = new TextDecoder().decode(
      Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
    );
  } catch {
    throw new Error('FCM_SERVICE_ACCOUNT_B64 invalide — base64 mal formé');
  }

  const parsed = JSON.parse(json) as Partial<ServiceAccount>;
  if (!parsed.client_email || !parsed.private_key || !parsed.project_id) {
    throw new Error(
      'FCM_SERVICE_ACCOUNT_B64 invalide — champs client_email, private_key et project_id requis',
    );
  }
  return parsed as ServiceAccount;
}

async function signServiceAccountJwt(sa: ServiceAccount): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: FCM_SCOPE,
    aud: sa.token_uri ?? DEFAULT_TOKEN_URI,
    iat: nowSec,
    exp: nowSec + TOKEN_TTL_SEC,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await importPkcs8PrivateKey(sa.private_key);
  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

async function exchangeJwtForToken(
  jwt: string,
  tokenUri: string,
): Promise<{ accessToken: string; expiresInSec: number }> {
  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    // On ne logge pas le body : peut contenir le JWT en clair en cas d'erreur côté Google
    throw new Error(
      `FCM token exchange failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json() as {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
  };
  if (!data.access_token || typeof data.expires_in !== 'number') {
    throw new Error('FCM token exchange : réponse Google invalide');
  }
  return { accessToken: data.access_token, expiresInSec: data.expires_in };
}

async function importPkcs8PrivateKey(pem: string): Promise<CryptoKey> {
  // Le service account Firebase peut contenir des \n littéraux (sérialisation JSON)
  const normalized = pem.replace(/\\n/g, '\n');
  const body = normalized
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

function base64UrlEncode(input: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(input));
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
