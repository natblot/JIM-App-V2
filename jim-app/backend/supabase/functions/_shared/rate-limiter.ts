// Middleware rate limiting partage — Epic 10
// Chaque Edge Function l'appelle en premiere ligne avec ses propres seuils
// Utilise la fonction SQL check_rate_limit() pour l'atomicite

interface RateLimitConfig {
  endpoint: string;
  maxRequests: number;
  window: string; // '1 hour', '1 day'
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: string;
}

// Verifier le rate limiting et retourner les headers standard
export async function checkRateLimit(
  supabaseAdmin: { rpc: (fn: string, params: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> },
  userId: string | null,
  ipAddress: string | null,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const identifier = userId ? `user:${userId}` : `ip:${ipAddress ?? 'unknown'}`;

  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_identifier: identifier,
    p_endpoint: config.endpoint,
    p_max_requests: config.maxRequests,
    p_window: config.window,
  });

  if (error) {
    // En cas d'erreur, on laisse passer (fail open) mais on log
    console.error('Rate limit check error:', error);
    return { allowed: true, limit: config.maxRequests, remaining: config.maxRequests, resetAt: '' };
  }

  // Recuperer les infos pour les headers
  const { data: info } = await supabaseAdmin.rpc('get_rate_limit_info', {
    p_identifier: identifier,
    p_endpoint: config.endpoint,
  });

  const currentCount = info?.[0]?.current_count ?? 0;
  const remaining = Math.max(0, config.maxRequests - currentCount);
  const resetAt = info?.[0]?.window_reset ?? new Date(Date.now() + 3600000).toISOString();

  return {
    allowed: data === true,
    limit: config.maxRequests,
    remaining,
    resetAt,
  };
}

// Headers HTTP standard a ajouter dans la reponse
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': result.resetAt,
  };
}

// Reponse 429 pre-formatee
export function tooManyRequestsResponse(result: RateLimitResult): Response {
  return Response.json(
    { error: { code: 'RATE_LIMITED', message: 'Trop de tentatives — reessayez plus tard' } },
    { status: 429, headers: { ...rateLimitHeaders(result), 'Content-Type': 'application/json' } },
  );
}

// Configurations predefinies par endpoint
export const RATE_LIMITS = {
  createAccount: { endpoint: 'create-account', maxRequests: 3, window: '1 day' },
  search: { endpoint: 'search', maxRequests: 100, window: '1 hour' },
  searchDaily: { endpoint: 'search-daily', maxRequests: 500, window: '1 day' },
  createCandidature: { endpoint: 'create-candidature', maxRequests: 20, window: '1 day' },
  sendMessage: { endpoint: 'send-message', maxRequests: 60, window: '1 hour' },
  exportData: { endpoint: 'export-data', maxRequests: 1, window: '1 day' },
} as const;
