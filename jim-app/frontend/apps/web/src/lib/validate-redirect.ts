// Validation du parametre ?redirect= — empeche les open redirects
export function isValidRedirect(url: string | null): string {
  if (!url) return '/';
  // Accepter UNIQUEMENT les chemins relatifs commencant par /
  if (!url.startsWith('/')) return '/';
  // Rejeter les protocoles deguises (//evil.com)
  if (url.startsWith('//')) return '/';
  // Rejeter les backslashes (contournement navigateurs anciens)
  if (url.includes('\\')) return '/';
  // Rejeter javascript: protocol encode
  if (url.toLowerCase().includes('javascript:')) return '/';
  return url;
}
