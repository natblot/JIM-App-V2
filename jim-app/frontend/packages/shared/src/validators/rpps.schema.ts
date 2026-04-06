import { z } from 'zod';

// Validation format RPPS (11 chiffres)
export const rppsVerifySchema = z.object({
  rppsNumber: z
    .string()
    .min(1, 'Le numéro RPPS est requis')
    .regex(/^\d{11}$/, 'Le numéro RPPS doit contenir exactement 11 chiffres'),
});

// Recherche par nom
export const rppsSearchSchema = z.object({
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50),
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50),
  city: z.string().max(100).optional(),
});

export type RppsVerifyFormData = z.infer<typeof rppsVerifySchema>;
export type RppsSearchFormData = z.infer<typeof rppsSearchSchema>;
