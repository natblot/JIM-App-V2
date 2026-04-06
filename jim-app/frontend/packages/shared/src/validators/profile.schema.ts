import { z } from 'zod';

// Spécialités disponibles pour la kinésithérapie (depuis la config JSONB professions)
export const KINE_SPECIALTIES = [
  { code: 'respiratoire', label: 'Kinésithérapie respiratoire' },
  { code: 'pediatrique', label: 'Kinésithérapie pédiatrique' },
  { code: 'neurologique', label: 'Kinésithérapie neurologique' },
  { code: 'orthopedique', label: 'Kinésithérapie orthopédique' },
  { code: 'geriatrique', label: 'Kinésithérapie gériatrique' },
  { code: 'sportive', label: 'Kinésithérapie sportive' },
  { code: 'cardiovasculaire', label: 'Kinésithérapie cardiovasculaire' },
  { code: 'vestibulaire', label: 'Kinésithérapie vestibulaire' },
  { code: 'oncologique', label: 'Kinésithérapie oncologique' },
  { code: 'generale', label: 'Kinésithérapie générale' },
] as const;

export type SpecialtyCode = typeof KINE_SPECIALTIES[number]['code'];

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'Prénom trop court').max(50).optional(),
  lastName: z.string().min(2, 'Nom trop court').max(50).optional(),
  bio: z.string().max(500, 'La bio ne doit pas dépasser 500 caractères').optional().nullable(),
  specialties: z.array(z.string()).max(10).optional(),
  mobilityRadiusKm: z.number().int().min(5, 'Minimum 5 km').max(500, 'Maximum 500 km').optional(),
  city: z.string().max(100).optional().nullable(),
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{8})$/, 'Format : 06 12 34 56 78 ou +33 6 12 34 56 78')
    .optional()
    .nullable(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Calcul du score de complétude du profil
export function getProfileCompleteness(profile: {
  avatar_url?: string | null;
  bio?: string | null;
  specialties?: string[];
  mobility_radius_km?: number;
  phone?: string | null;
  rpps_verified?: boolean;
}): { score: number; missing: string[] } {
  const checks = [
    { done: !!profile.rpps_verified, label: 'Identité RPPS vérifiée' },
    { done: !!profile.avatar_url, label: 'Photo de profil' },
    { done: !!profile.bio && profile.bio.length > 20, label: 'Présentation' },
    { done: (profile.specialties?.length ?? 0) > 0, label: 'Spécialités' },
    { done: (profile.mobility_radius_km ?? 0) > 0, label: 'Zone de mobilité' },
    { done: !!profile.phone, label: 'Téléphone' },
  ];

  const done = checks.filter((c) => c.done).length;
  const missing = checks.filter((c) => !c.done).map((c) => c.label);

  return {
    score: Math.round((done / checks.length) * 100),
    missing,
  };
}
