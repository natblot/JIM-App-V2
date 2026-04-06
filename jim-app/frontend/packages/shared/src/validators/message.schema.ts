import { z } from 'zod';

// Schéma d'envoi d'un message — validé côté client ET Edge Function
export const sendMessageSchema = z.object({
  conversation_id: z.string().uuid('ID conversation invalide'),
  content: z
    .string()
    .min(1, 'Le message ne peut pas être vide')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// Schéma pour marquer un message comme lu
export const markAsReadSchema = z.object({
  message_id: z.string().uuid(),
});
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;

// Type correspondant à la ligne messages en base (généré à la main — sera remplacé par supabase gen types)
export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  contains_links: boolean;
  flagged_phishing: boolean;
  is_system_message: boolean;
}

// Type correspondant à la ligne conversations en base
export interface ConversationRow {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  annonce_id: string;
  candidature_id: string;
  created_at: string;
  last_message_at: string;
  last_message_preview: string | null;
}
