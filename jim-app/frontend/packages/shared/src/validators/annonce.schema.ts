// Schéma Zod pour les annonces — Story 2.1
// Source unique de validation côté client ET serveur (Edge Functions)
import { z } from 'zod';

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

// Schéma de base (sans refinement cross-champs — permet .pick() et .omit())
const annonceBaseSchema = z.object({
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
});

// Schéma complet avec validation cross-champs
export const annonceSchema = annonceBaseSchema.refine(
  (data) => data.date_fin >= data.date_debut,
  {
    message: 'La date de fin doit être après la date de début',
    path: ['date_fin'],
  },
);

export type AnnonceFormData = z.infer<typeof annonceSchema>;

// Schémas par étape — .pick() sur le base schema (avant .refine())
export const annonceStep1Schema = annonceBaseSchema
  .pick({
    type_annonce: true,
    date_debut: true,
    date_fin: true,
    is_urgent: true,
  })
  .refine((data) => data.date_fin >= data.date_debut, {
    message: 'La date de fin doit être après la date de début',
    path: ['date_fin'],
  });
export type AnnonceStep1Data = z.infer<typeof annonceStep1Schema>;

export const annonceStep2Schema = annonceBaseSchema.pick({
  ville: true,
  code_postal: true,
  adresse_complete: true,
  latitude: true,
  longitude: true,
  retrocession: true,
});
export type AnnonceStep2Data = z.infer<typeof annonceStep2Schema>;

export const annonceStep3Schema = annonceBaseSchema
  .pick({
    description: true,
    type_cabinet: true,
    specialites: true,
  })
  .partial();
export type AnnonceStep3Data = z.infer<typeof annonceStep3Schema>;

// Schéma pour la mise à jour (tous les champs optionnels sauf les invariants)
export const annonceUpdateSchema = annonceBaseSchema
  .omit({ type_annonce: true })
  .partial()
  .extend({
    statut: z.enum(['pourvue']).optional(), // seule transition autorisée côté client
    is_urgent: z.boolean().optional(),
  });
export type AnnonceUpdateData = z.infer<typeof annonceUpdateSchema>;

// Type de la ligne DB (enrichi après query)
export interface AnnonceRow {
  id: string;
  profile_id: string;
  type_annonce: AnnonceType;
  date_debut: string;
  date_fin: string;
  retrocession: number;
  description: string | null;
  ville: string;
  code_postal: string | null;
  adresse_complete: string | null;
  location: string | null;
  type_cabinet: string | null;
  specialites: string[];
  statut: AnnonceStatut;
  is_urgent: boolean;
  source: string;
  source_url: string | null;
  retrocession_moyenne_zone: number | null;
  freshness_reminder_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  closed_at: string | null;
  archived_at: string | null;
}
