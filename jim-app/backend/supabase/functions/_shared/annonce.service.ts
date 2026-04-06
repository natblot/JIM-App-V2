// Service métier annonces — logique partagée entre Edge Functions
import type { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { annonceSchema, type AnnonceFormData } from './annonce.schema.deno.ts';
import { geocodeVille } from './geocoding.service.ts';

// Sanitization basique — strip balises HTML et scripts
function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export interface CreateAnnonceInput extends AnnonceFormData {
  profileId: string;
}

export interface AnnonceServiceResult {
  id: string;
  ville: string;
  statut: string;
  retrocession_moyenne_zone: number | null;
}

// Calcule la rétrocession moyenne dans un rayon de 30km autour d'un point
export async function getRetrocessionMoyenne(
  supabase: ReturnType<typeof createClient>,
  latitude: number,
  longitude: number
): Promise<number | null> {
  const { data } = await supabase.rpc('get_retrocession_moyenne_zone', {
    lat: latitude,
    lon: longitude,
    radius_km: 30,
  });
  return data ?? null;
}

// Crée une annonce avec géocodage et calcul de la rétrocession moyenne
export async function createAnnonce(
  supabase: ReturnType<typeof createClient>,
  input: CreateAnnonceInput
): Promise<AnnonceServiceResult> {
  const validated = annonceSchema.parse(input);

  // Géocodage si coordonnées non fournies
  let latitude = input.latitude;
  let longitude = input.longitude;
  let adresseComplete = input.adresse_complete;

  if (!latitude || !longitude) {
    const geo = await geocodeVille(validated.ville, validated.code_postal);
    if (geo) {
      latitude = geo.latitude;
      longitude = geo.longitude;
      adresseComplete = geo.adresseComplete;
    }
  }

  // Calcul rétrocession moyenne zone
  let retrocessionMoyenne: number | null = null;
  if (latitude && longitude) {
    retrocessionMoyenne = await getRetrocessionMoyenne(supabase, latitude, longitude);
  }

  // Construction du point PostGIS
  const locationWKT = latitude && longitude
    ? `POINT(${longitude} ${latitude})`
    : null;

  const { data, error } = await supabase
    .from('annonces')
    .insert({
      profile_id: input.profileId,
      type_annonce: validated.type_annonce,
      date_debut: validated.date_debut,
      date_fin: validated.date_fin,
      retrocession: validated.retrocession,
      description: validated.description ? sanitizeText(validated.description) : null,
      ville: validated.ville,
      code_postal: validated.code_postal ?? null,
      adresse_complete: adresseComplete ?? null,
      location: locationWKT,
      type_cabinet: validated.type_cabinet ?? null,
      specialites: validated.specialites,
      is_urgent: validated.is_urgent,
      retrocession_moyenne_zone: retrocessionMoyenne,
    })
    .select('id, ville, statut, retrocession_moyenne_zone')
    .single();

  if (error) throw new Error(`Erreur création annonce: ${error.message}`);
  return data;
}
