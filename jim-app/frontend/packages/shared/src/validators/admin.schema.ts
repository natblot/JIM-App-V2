// Schemas Zod admin — Epic 12
import { z } from 'zod';

export const createSignalementSchema = z.object({
  contenu_type: z.enum(['profile', 'annonce', 'message', 'avis']),
  contenu_id: z.string().uuid('UUID invalide'),
  categorie: z.enum(['faux_profil', 'annonce_frauduleuse', 'comportement_inapproprie', 'contenu_offensant', 'autre']),
  description: z.string().max(500).optional(),
});
export type CreateSignalementInput = z.infer<typeof createSignalementSchema>;

export const moderateContentSchema = z.object({
  signalement_id: z.string().uuid('UUID invalide'),
  action: z.enum(['suspend', 'hide_content', 'dismiss']),
  reason: z.string().max(500).optional(),
});
export type ModerateContentInput = z.infer<typeof moderateContentSchema>;

export const createSupportTicketSchema = z.object({
  categorie: z.enum(['bug', 'question', 'suggestion', 'partenariat']),
  sujet: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  app_version: z.string().optional(),
  device_model: z.string().optional(),
  os_version: z.string().optional(),
  last_screen: z.string().optional(),
  screenshot_url: z.string().url().optional(),
});
export type CreateSupportTicketInput = z.infer<typeof createSupportTicketSchema>;
