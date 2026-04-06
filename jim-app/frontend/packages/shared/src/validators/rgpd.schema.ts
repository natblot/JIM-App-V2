// Schemas Zod RGPD — Epic 10
import { z } from 'zod';

// Suppression de compte
export const deleteAccountSchema = z.object({
  confirmation: z.literal('SUPPRIMER', { message: 'Tapez SUPPRIMER pour confirmer' }),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

// Annulation de suppression
export const cancelDeletionSchema = z.object({
  cancel_token: z.string().uuid('Token invalide'),
});
export type CancelDeletionInput = z.infer<typeof cancelDeletionSchema>;
