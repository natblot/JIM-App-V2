// Schéma Zod pour les entrées du calendrier (disponibilités des remplaçants)
// Epic 7 — Notifications & Calendrier

import { z } from 'zod';

export const CALENDRIER_TYPES = ['disponible', 'indisponible', 'remplacement'] as const;
export type CalendrierType = (typeof CALENDRIER_TYPES)[number];

// Schéma de base sans refinement — utilisable avec .pick() si besoin
export const calendrierBaseSchema = z.object({
  date_debut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  date_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  type: z.enum(CALENDRIER_TYPES).default('disponible'),
});

// Schéma complet avec validation de cohérence des dates
export const createCalendrierSchema = calendrierBaseSchema.refine(
  (data) => data.date_fin >= data.date_debut,
  { message: 'La date de fin doit être après la date de début', path: ['date_fin'] },
);
export type CreateCalendrierInput = z.infer<typeof createCalendrierSchema>;

export interface CalendrierRow {
  id: string;
  profile_id: string;
  date_debut: string;
  date_fin: string;
  type: CalendrierType;
  candidature_id: string | null;
  created_at: string;
  updated_at: string;
}
