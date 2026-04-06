// Schéma Zod pour les annonces — version Deno Edge Functions (npm:zod)
// Miroir de packages/shared/src/validators/annonce.schema.ts
// Importé par les Edge Functions qui tournent dans l'environnement Deno

// deno-lint-ignore-file
import { z } from 'npm:zod@3';

// Statuts possibles d'une annonce
export const ANNONCE_STATUTS = [
  'active',
  'en_cours',
  'non_confirmee',
  'source_externe',
  'pourvue',
  'expiree',
] as const;
export type AnnonceStatut = (typeof ANNONCE_STATUTS)[number];

// Types d'annonces supportés
export const ANNONCE_TYPES = [
  'remplacement',
  'assistanat',
  'collaboration',
  'cession',
] as const;
export type AnnonceType = (typeof ANNONCE_TYPES)[number];

// Schéma complet
export const annonceSchema = z
  .object({
    type_annonce: z.enum(ANNONCE_TYPES).default('remplacement'),
    date_debut: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
      .refine((d) => new Date(d) >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: 'La date de début ne peut pas être dans le passé',
      }),
    date_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
    retrocession: z
      .number()
      .min(0, 'La rétrocession ne peut pas être négative')
      .max(100, 'La rétrocession ne peut pas dépasser 100%')
      .multipleOf(0.5, 'La rétrocession doit être un multiple de 0,5%'),
    description: z
      .string()
      .max(1000, 'La description ne peut pas dépasser 1000 caractères')
      .optional(),
    ville: z.string().min(2, 'La ville est obligatoire'),
    code_postal: z
      .string()
      .regex(/^\d{5}$/, 'Code postal invalide')
      .optional(),
    adresse_complete: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    type_cabinet: z
      .enum(['liberal', 'groupe', 'centre', 'hopital', 'clinique', 'autre'])
      .optional(),
    specialites: z.array(z.string()).default([]),
    is_urgent: z.boolean().default(false),
  })
  .refine((data) => data.date_fin >= data.date_debut, {
    message: 'La date de fin doit être après la date de début',
    path: ['date_fin'],
  });

export type AnnonceFormData = z.infer<typeof annonceSchema>;

// Schéma pour la mise à jour (tous les champs optionnels sauf les invariants)
export const annonceUpdateSchema = annonceSchema
  .omit({ type_annonce: true })
  .partial()
  .extend({
    statut: z.enum(['pourvue']).optional(), // seule transition autorisée côté client
    is_urgent: z.boolean().optional(),
  });
export type AnnonceUpdateData = z.infer<typeof annonceUpdateSchema>;
