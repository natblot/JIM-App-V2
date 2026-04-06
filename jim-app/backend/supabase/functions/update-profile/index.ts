import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@4';
import type { ApiResponse } from '../_shared/types.ts';

// Schéma de validation mise à jour profil
const updateProfileSchema = z.object({
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional().nullable(),
  specialties: z.array(z.string().max(50)).max(10).optional(),
  mobility_radius_km: z.number().int().min(0).max(500).optional(),
  city: z.string().max(100).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  // phone : optionnel, format FR
  phone: z.string()
    .regex(/^(\+33|0)[1-9](\d{8})$/, 'Numéro de téléphone invalide')
    .optional()
    .nullable(),
});

// Sanitisation basique — strip HTML/JS (NFR17)
function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const headers = { 'Content-Type': 'application/json' };

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentification requise.' } } satisfies ApiResponse,
        { status: 401, headers }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Session invalide.' } } satisfies ApiResponse,
        { status: 401, headers }
      );
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message ?? 'Données invalides.' } } satisfies ApiResponse,
        { status: 400, headers }
      );
    }

    // Sanitiser les champs texte libre (NFR17)
    const sanitized = { ...parsed.data };
    if (sanitized.bio) sanitized.bio = sanitizeText(sanitized.bio);
    if (sanitized.first_name) sanitized.first_name = sanitizeText(sanitized.first_name);
    if (sanitized.last_name) sanitized.last_name = sanitizeText(sanitized.last_name);

    // Mise à jour via client user (respecte RLS — ne peut modifier que son propre profil)
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...sanitized, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[update-profile] DB error:', error);
      return Response.json(
        { error: { code: 'SYSTEM_ERROR', message: 'Impossible de sauvegarder. Réessayez.' } } satisfies ApiResponse,
        { status: 500, headers }
      );
    }

    return Response.json({ data } satisfies ApiResponse, { status: 200, headers });

  } catch (error) {
    console.error('[update-profile] Unexpected error:', error);
    return Response.json(
      { error: { code: 'SYSTEM_ERROR', message: 'Une erreur inattendue est survenue.' } } satisfies ApiResponse,
      { status: 500, headers }
    );
  }
});
