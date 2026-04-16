// Client Supabase SSR pour les pages web — Epic 13
import { createClient } from '@supabase/supabase-js'; // eslint-disable-line no-restricted-imports -- adapter SSR serveur

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createServerSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Types pour les annonces retournees par la landing page
export interface AnnonceRow {
  id: string;
  ville: string | null;
  code_postal: string | null;
  date_debut: string;
  date_fin: string;
  retrocession: number | null;
  description: string | null;
  type_annonce: string | null;
  type_cabinet: string | null;
  specialites: string[] | null;
  statut: string;
  is_urgent: boolean;
  source: string;
  source_url: string | null;
  created_at: string;
  photo_urls: string[];
}

// Profil titulaire simplifie pour l'affichage
export interface TitulaireProfile {
  first_name: string | null;
  rpps_verified: boolean;
  score_fiabilite: number | null;
  created_at: string;
}

// Type pour le detail d'une annonce (page SSR)
export interface AnnonceDetail extends AnnonceRow {
  adresse_complete: string | null;
  profile_id: string | null;
  // Profil titulaire joint (nullable si annonce agregee)
  titulaire?: TitulaireProfile | null;
}

// Fetch des annonces actives pour la grille d'accueil — avec pagination
export async function fetchActiveAnnonces(
  limit = 20,
  offset = 0,
): Promise<{ annonces: AnnonceRow[]; total: number }> {
  if (!isSupabaseConfigured()) return { annonces: [], total: 0 };
  const supabase = createServerSupabase();

  // Requete avec count exact pour la pagination
  const { data, error, count } = await supabase
    .from('annonces')
    .select('id, ville, code_postal, date_debut, date_fin, retrocession, description, type_annonce, type_cabinet, specialites, statut, is_urgent, source, source_url, created_at, photo_urls', { count: 'exact' })
    .in('statut', ['active', 'en_cours'])
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[supabase-server] fetchActiveAnnonces error:', error.message);
    return { annonces: [], total: 0 };
  }
  return { annonces: (data as AnnonceRow[]) ?? [], total: count ?? 0 };
}

// Fetch d'une annonce par ID (detail SSR) — avec profil titulaire
// Migration 076 : RLS profiles durcie -> on ne peut plus embed profiles directement
// (la SSR utilise un client anon, sans session user). On fetch l'annonce, puis le
// profil titulaire via profiles_public en 2e query.
export async function fetchAnnonceById(id: string): Promise<AnnonceDetail | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('annonces')
    .select(`
      id, ville, code_postal, adresse_complete, date_debut, date_fin, retrocession,
      description, type_annonce, type_cabinet, specialites, statut, is_urgent,
      source, source_url, profile_id, created_at, photo_urls
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('[supabase-server] fetchAnnonceById error:', error.message);
    return null;
  }

  const annonceFields = data as unknown as Omit<AnnonceDetail, 'titulaire'>;

  // Resoudre le profil titulaire via profiles_public (vue publique, GRANT TO anon)
  let titulaire: TitulaireProfile | null = null;
  if (annonceFields.profile_id) {
    const { data: profRow } = await supabase
      .from('profiles_public')
      .select('first_name, rpps_verified, score_fiabilite, created_at')
      .eq('user_id', annonceFields.profile_id)
      .maybeSingle();
    if (profRow) titulaire = profRow as TitulaireProfile;
  }

  return { ...annonceFields, titulaire };
}

// Fetch des coordonnees d'une annonce pour la mini-carte (Phase 2)
export async function fetchAnnonceCoords(id: string): Promise<{ lat: number; lng: number } | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabase();
  const { data } = await supabase.rpc('annonce_coords', { p_annonce_id: id });
  if (data && Array.isArray(data) && data.length > 0) {
    const row = data[0] as { lat: number; lng: number };
    return { lat: row.lat, lng: row.lng };
  }
  return null;
}

// Fetch des IDs actifs pour le sitemap
export async function fetchAnnonceIdsForSitemap(): Promise<{ id: string; updated_at: string }[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('annonces')
    .select('id, updated_at')
    .in('statut', ['active', 'en_cours'])
    .eq('source', 'native')
    .order('updated_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[supabase-server] fetchAnnonceIdsForSitemap error:', error.message);
    return [];
  }
  return (data ?? []) as { id: string; updated_at: string }[];
}
