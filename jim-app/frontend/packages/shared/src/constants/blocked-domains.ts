// Domaines bloqués — typosquatting anti-phishing (FR38)
export const BLOCKED_DOMAINS = [
  'j1m.app',
  'jim-app.com',
  'jlm.app',
  'j1m-app.com',
  'jim.app.com',
  'getjim.app',
] as const;

// Domaines de confiance — pas d'avertissement affiché à l'utilisateur
export const SAFE_DOMAINS = [
  'jim.app',
  'api-adresse.data.gouv.fr',
  'rpps.sante.fr',
] as const;
