// Helper audit logging — Epic 10
// Appelle la fonction SQL log_audit() pour tracer les actions critiques
// JAMAIS de donnees sensibles dans les details (mots de passe, tokens, IBAN, contenu messages)

interface AuditParams {
  userId: string | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export async function logAudit(supabaseAdmin: { rpc: (fn: string, params: Record<string, unknown>) => Promise<unknown> }, params: AuditParams): Promise<void> {
  try {
    await supabaseAdmin.rpc('log_audit', {
      p_user_id: params.userId,
      p_action: params.action,
      p_resource_type: params.resourceType ?? null,
      p_resource_id: params.resourceId ?? null,
      p_ip_address: params.ipAddress ?? null,
      p_user_agent: params.userAgent ?? null,
      p_details: params.details ?? {},
    });
  } catch (err) {
    // Ne jamais bloquer l'operation principale a cause d'un echec de log
    console.error('Audit log error:', err);
  }
}

// Extraire IP et User-Agent depuis la requete
export function extractRequestInfo(req: Request): { ipAddress: string; userAgent: string } {
  return {
    ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('cf-connecting-ip')
      ?? 'unknown',
    userAgent: req.headers.get('user-agent') ?? 'unknown',
  };
}

// Actions predefinies (pour eviter les typos)
export const AUDIT_ACTIONS = {
  // Auth
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_CREATE_ACCOUNT: 'auth.create_account',
  AUTH_DELETE_ACCOUNT: 'auth.delete_account',
  AUTH_EXPORT_DATA: 'auth.export_data',
  // Annonces
  ANNONCE_PUBLISH: 'annonce.publish',
  ANNONCE_UPDATE: 'annonce.update',
  ANNONCE_CLOSE: 'annonce.close',
  // Candidatures
  CANDIDATURE_CREATE: 'candidature.create',
  CANDIDATURE_ACCEPT: 'candidature.accept',
  CANDIDATURE_REFUSE: 'candidature.refuse',
  CANDIDATURE_WITHDRAW: 'candidature.withdraw',
  // Contrats
  CONTRAT_GENERATE: 'contrat.generate',
  CONTRAT_CONFIRM: 'contrat.confirm',
  CONTRAT_UPDATE_CLAUSES: 'contrat.update_clauses',
  // Paiements
  PAIEMENT_CREATE: 'paiement.create',
  PAIEMENT_CONFIRM: 'paiement.confirm',
  PAIEMENT_CONTEST: 'paiement.contest',
  // Profil
  PROFILE_UPDATE: 'profile.update',
  PROFILE_RPPS_VERIFY: 'profile.rpps_verify',
  // Admin
  ADMIN_ACTION: 'admin.action',
} as const;
