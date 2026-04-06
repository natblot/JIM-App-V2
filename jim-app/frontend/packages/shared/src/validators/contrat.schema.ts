// Schéma Zod contrats IA — source unique de validation — Epic 8
import { z } from 'zod';

// Schéma génération de contrat depuis une candidature acceptée
export const generateContratSchema = z.object({
  candidature_id: z.string().uuid('UUID invalide'),
});
export type GenerateContratInput = z.infer<typeof generateContratSchema>;

// Schéma confirmation de contrat par les deux parties
export const confirmContratSchema = z.object({
  contrat_id: z.string().uuid('UUID invalide'),
});
export type ConfirmContratInput = z.infer<typeof confirmContratSchema>;

// Schéma mise à jour des clauses optionnelles (seules les clauses editable=true)
export const updateClausesSchema = z.object({
  contrat_id: z.string().uuid('UUID invalide'),
  clauses_optionnelles: z.array(
    z.object({
      id: z.string(),
      titre: z.string().min(1).max(100),
      contenu: z.string().max(2000, 'Clause trop longue (max 2000 caractères)'),
      editable: z.literal(true), // Seules les clauses editable=true peuvent être modifiées
    }),
  ),
});
export type UpdateClausesInput = z.infer<typeof updateClausesSchema>;

// Statuts possibles d'un contrat IA
export const CONTRAT_STATUTS = ['brouillon', 'en_attente_remplacant', 'confirme'] as const;
export type ContratStatut = (typeof CONTRAT_STATUTS)[number];
