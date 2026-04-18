// packages/ui/src/index.ts — barrel export @jim/ui (seul fichier avec barrel autorisé)
export { cn } from './utils/cn';
// Composant Badge generique — source unique, utilise par tous les badges specialises
export { Badge } from './badge';
export type { BadgeTone, BadgeVariant, BadgeSize } from './badge';
export { StatusBadge } from './status-badge';
export type { AnnonceStatut } from './status-badge';
export { UrgentBadge } from './urgent-badge';
export { StepIndicator } from './step-indicator';
export { RetrocessionIndicator } from './retrocession-indicator';
export { AnnonceCard } from './annonce-card';
export type { AnnonceCardData } from './annonce-card';
export { SourceBadge } from './source-badge';
// Epic 4 — composants recherche
export { FilterBar } from './filter-bar';
export { EmptyState } from './empty-state';
export type { EmptyStateVariant, EmptyStateProps } from './empty-state';
export { OfflineBanner } from './offline-banner';
export type { OfflineBannerProps } from './offline-banner';
export { AnnonceSkeleton } from './annonce-skeleton';
// Epic 5 — composants candidature & favoris
export { CandidatureCard } from './candidature-card';
export { PipelineStatus } from './pipeline-status';
export { UndoToast } from './undo-toast';
export { IncompatibilityWarning } from './incompatibility-warning';
export { FavoriButton } from './favori-button';
// Epic 6 — messagerie intégrée
export { UnreadBadge } from './unread-badge';
export type { UnreadBadgeProps } from './unread-badge';
export { ConversationListItem } from './conversation-list-item';
export type { ConversationListItemProps } from './conversation-list-item';
// Epic 7 — notifications & calendrier
export { TogglePreference } from './toggle-preference';
export type { TogglePreferenceProps } from './toggle-preference';
export { CalendarDay } from './calendar-day';
export type { CalendarDayProps, CalendarDayType } from './calendar-day';
// Epic 8 — contrats IA
export { ContratStatusBadge } from './contrat-status-badge';
export type { ContratStatut } from './contrat-status-badge';
export { ContratSummary } from './contrat-summary';
export type { ContratSummaryProps } from './contrat-summary';
export { ContratClause } from './contrat-clause';
export type { ContratClauseProps } from './contrat-clause';
// Epic 9 — paiement securise
export { PaymentStatusBadge } from './payment-status-badge';
export type { PaiementStatut } from './payment-status-badge';
export { PaymentBreakdown } from './payment-breakdown';
export { ProBadge } from './pro-badge';
// Epic 10 — RGPD & Securite
export { SensitiveKeywordWarning } from './sensitive-keyword-warning';
export { RateLimitToast } from './rate-limit-toast';
// Epic 11 — Reputation & Parrainage
export { StarRating } from './star-rating';
export { ScoreBadge } from './score-badge';
export { AmbassadeurBadge } from './ambassadeur-badge';
// Card profil kiné — résultats recherche + listes candidatures
export { KineProfileCard } from './kine-profile-card';
export type { KineProfileCardData } from './kine-profile-card';
