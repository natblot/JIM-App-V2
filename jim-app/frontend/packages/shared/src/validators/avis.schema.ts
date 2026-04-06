// Schemas Zod avis + proposition — Epic 11
import { z } from 'zod';

export const AVIS_TAGS = ['ponctuel', 'professionnel', 'recommande', 'bonne_communication'] as const;
export type AvisTag = (typeof AVIS_TAGS)[number];

export const createAvisSchema = z.object({
  contrat_id: z.string().uuid('UUID contrat invalide'),
  note: z.number().int().min(1, 'Note minimum : 1').max(5, 'Note maximum : 5'),
  tags: z.array(z.enum(AVIS_TAGS)).default([]),
});
export type CreateAvisInput = z.infer<typeof createAvisSchema>;

export const createPropositionSchema = z.object({
  remplacant_id: z.string().uuid('UUID remplacant invalide'),
  date_debut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date : YYYY-MM-DD'),
  date_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date : YYYY-MM-DD'),
  retrocession: z.number().min(0).max(100),
});
export type CreatePropositionInput = z.infer<typeof createPropositionSchema>;

export const respondPropositionSchema = z.object({
  proposition_id: z.string().uuid('UUID proposition invalide'),
  response: z.enum(['acceptee', 'declinee']),
});
export type RespondPropositionInput = z.infer<typeof respondPropositionSchema>;
