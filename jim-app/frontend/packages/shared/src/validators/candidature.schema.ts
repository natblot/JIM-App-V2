// Schéma Zod candidature — source unique de validation — Epic 5
import { z } from 'zod';

export const CANDIDATURE_STATUTS = [
  'en_attente',
  'vue',
  'en_discussion',
  'acceptee',
  'refusee',
  'refusee_auto',
  'retiree',
  'expiree',
] as const;
export type CandidatureStatut = (typeof CANDIDATURE_STATUTS)[number];

// Warning incompatibilité
export const incompatibilityWarningSchema = z.object({
  type: z.enum(['specialite_manquante', 'hors_zone', 'autre']),
  detail: z.string().max(200),
});

// Schéma création candidature
export const createCandidatureSchema = z.object({
  annonce_id: z.string().uuid('ID annonce invalide'),
  message: z
    .string()
    .max(500, 'Le message ne peut pas dépasser 500 caractères')
    .optional(),
  warnings: z.array(incompatibilityWarningSchema).default([]),
});
export type CreateCandidatureInput = z.infer<typeof createCandidatureSchema>;

// Schéma traitement (accept/refuse)
export const processCandidatureSchema = z.object({
  candidature_id: z.string().uuid(),
  action: z.enum(['accepter', 'refuser']),
  refuser_autres: z.boolean().default(true), // FR33 — refus cascade
});
export type ProcessCandidatureInput = z.infer<typeof processCandidatureSchema>;

// Schéma retrait
export const withdrawCandidatureSchema = z.object({
  candidature_id: z.string().uuid(),
});
export type WithdrawCandidatureInput = z.infer<typeof withdrawCandidatureSchema>;

// Type DB
export interface CandidatureRow {
  id: string;
  annonce_id: string;
  remplacant_id: string;
  message: string | null;
  statut: CandidatureStatut;
  warnings: Array<{ type: string; detail: string }>;
  created_at: string;
  updated_at: string;
  viewed_at: string | null;
  responded_at: string | null;
}
