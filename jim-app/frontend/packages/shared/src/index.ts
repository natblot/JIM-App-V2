// @jim/shared — exports centralisés
export * from './constants';
export * from './adapters';
export * from './validators';
export * from './stores';
export * from './hooks';
export type { Database, Json } from './types/database';
export { formatFreshness } from './utils/format-freshness';
// Types contrats IA — Epic 8
export type { Contrat, ContratDonnees, ContratClause, ContratStatut } from './types/contrat';
// Helper PDF contrats — Epic 8
export { generateContratHtml } from './utils/contrat-pdf';
// Types paiement — Epic 9
export type {
  Paiement, AbonnementPro, CommissionResult, PaymentBreakdownData,
  PaiementStatus, CommissionType, SourceMontant, StripeOnboardingStatus, AbonnementProStatus,
} from './types/paiement';
// CSV parser — Epic 9
export { parseCsvFacturation } from './utils/csv-parser';
export type { CsvParseResult } from './utils/csv-parser';
// Detecteur mots-cles sensibles — Epic 10
export { detectSensitiveKeywords, filterFalsePositives } from './utils/sensitive-keyword-detector';
export type { SensitiveKeywordMatch } from './utils/sensitive-keyword-detector';
