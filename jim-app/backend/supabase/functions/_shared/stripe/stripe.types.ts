// Types Stripe pour les Edge Functions — Epic 9

export type PaiementStatus =
  | 'brouillon'
  | 'en_attente_validation'
  | 'conteste'
  | 'en_cours'
  | 'confirme'
  | 'echoue'
  | 'rembourse';

export type CommissionType = 'lancement' | 'gratuit' | 'pro';

export type StripeOnboardingStatus = 'not_started' | 'in_progress' | 'verified' | 'action_required';

export interface PaiementRow {
  id: string;
  contrat_id: string;
  annonce_id: string;
  titulaire_id: string;
  remplacant_id: string;
  montant_encaisse_cents: number;
  taux_retrocession: number;
  montant_retrocession_cents: number;
  part_titulaire_cents: number;
  commission_jim_cents: number;
  montant_net_remplacant_cents: number;
  source_montant: string;
  stripe_payment_intent_id: string | null;
  status: PaiementStatus;
  commission_type: CommissionType;
}

export interface CreatePaymentParams {
  contratId: string;
  montantEncaisseCents: number;
  sourceMontant: string;
  userId: string;
}

export interface ConfirmPaymentParams {
  paiementId: string;
  paymentMethodId: string;
  userId: string;
}
