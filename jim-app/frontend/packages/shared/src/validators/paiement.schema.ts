// Schema Zod paiement — source unique de validation — Epic 9
import { z } from 'zod';

// Creation d'un paiement (titulaire declare les honoraires)
export const createPaiementSchema = z.object({
  contrat_id: z.string().uuid('UUID contrat invalide'),
  montant_encaisse_cents: z
    .number()
    .int('Le montant doit etre un entier (centimes)')
    .positive('Le montant doit etre positif')
    .max(100_000_00, 'Montant maximum : 100 000 EUR'),
  source_montant: z.enum(['saisie_manuelle', 'import_csv', 'import_pdf', 'api_directe']).default('saisie_manuelle'),
});
export type CreatePaiementInput = z.infer<typeof createPaiementSchema>;

// Contestation par le remplacant
export const contestPaiementSchema = z.object({
  paiement_id: z.string().uuid('UUID paiement invalide'),
});
export type ContestPaiementInput = z.infer<typeof contestPaiementSchema>;

// Mise a jour du montant apres litige (titulaire ajuste)
export const updatePaiementMontantSchema = z.object({
  paiement_id: z.string().uuid('UUID paiement invalide'),
  montant_encaisse_cents: z
    .number()
    .int('Le montant doit etre un entier (centimes)')
    .positive('Le montant doit etre positif')
    .max(100_000_00, 'Montant maximum : 100 000 EUR'),
});
export type UpdatePaiementMontantInput = z.infer<typeof updatePaiementMontantSchema>;

// Confirmation du versement (titulaire valide le paiement Stripe)
export const confirmPaiementSchema = z.object({
  paiement_id: z.string().uuid('UUID paiement invalide'),
  payment_method_id: z.string().min(1, 'Payment method requis'),
});
export type ConfirmPaiementInput = z.infer<typeof confirmPaiementSchema>;

// Abonnement Pro
export const createSubscriptionSchema = z.object({
  payment_method_id: z.string().min(1, 'Payment method requis'),
});
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const cancelSubscriptionSchema = z.object({
  cancel_at_period_end: z.boolean().default(true),
});
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;

// Statuts possibles
export const PAIEMENT_STATUTS = [
  'brouillon',
  'en_attente_validation',
  'conteste',
  'en_cours',
  'confirme',
  'echoue',
  'rembourse',
] as const;
export type PaiementStatut = (typeof PAIEMENT_STATUTS)[number];
