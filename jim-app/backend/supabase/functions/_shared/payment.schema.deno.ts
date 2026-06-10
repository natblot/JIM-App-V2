// Schéma Zod paiement — version Deno Edge Functions (npm:zod)
// Miroir de packages/shared/src/validators/payment.schema.ts

// deno-lint-ignore-file
import { z } from 'npm:zod@3';

export const SOURCE_MONTANT_VALUES = ['saisie_manuelle', 'facture', 'import'] as const;

export const createPaymentSchema = z.object({
  contrat_id: z.string().uuid('contrat_id doit être un UUID valide'),
  montant_encaisse_cents: z
    .number({ invalid_type_error: 'montant_encaisse_cents doit être un nombre' })
    .int('montant_encaisse_cents doit être un entier')
    .positive('montant_encaisse_cents doit être positif')
    .max(10_000_000, 'Montant maximum : 100 000 EUR'),
  source_montant: z.enum(SOURCE_MONTANT_VALUES).optional().default('saisie_manuelle'),
});
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
