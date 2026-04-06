// Types paiement — Epic 9 "Paiement Securise Stripe Connect"

export type PaiementStatus =
  | 'brouillon'
  | 'en_attente_validation'
  | 'conteste'
  | 'en_cours'
  | 'confirme'
  | 'echoue'
  | 'rembourse';

export type CommissionType = 'lancement' | 'gratuit' | 'pro';

export type SourceMontant = 'saisie_manuelle' | 'import_csv' | 'import_pdf' | 'api_directe';

export type StripeOnboardingStatus = 'not_started' | 'in_progress' | 'verified' | 'action_required';

export type AbonnementProStatus = 'active' | 'cancelled' | 'past_due' | 'unpaid';

// Paiement de retrocession complet
export interface Paiement {
  id: string;
  contrat_id: string;
  annonce_id: string;
  titulaire_id: string;
  remplacant_id: string;
  // Montants en centimes
  montant_encaisse_cents: number;
  taux_retrocession: number;
  montant_retrocession_cents: number;
  part_titulaire_cents: number;
  commission_jim_cents: number;
  montant_net_remplacant_cents: number;
  source_montant: SourceMontant;
  // Stripe IDs
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  stripe_charge_id: string | null;
  // Statut
  status: PaiementStatus;
  commission_type: CommissionType;
  // Dates
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  contested_at: string | null;
  resolved_at: string | null;
}

// Abonnement Pro
export interface AbonnementPro {
  id: string;
  profile_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: AbonnementProStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// Resultat du calcul de commission
export interface CommissionResult {
  commissionType: CommissionType;
  commissionRatePercent: number;
  commissionCents: number;
  montantNetRemplacantCents: number;
}

// Ventilation du versement (pour l'affichage)
export interface PaymentBreakdownData {
  montantEncaisseCents: number;
  tauxRetrocession: number;
  montantRetrocessionCents: number;
  partTitulaireCents: number;
  commissionJimCents: number;
  montantNetRemplacantCents: number;
  commissionType: CommissionType;
  isLaunchPeriod: boolean;
}
