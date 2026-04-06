-- Migration 022 : Fonctions de recherche géographique PostGIS (Epic 4)
-- Fonctions : search_annonces_geo, search_annonces_bbox, retrocession_moyenne_zone, annonces_similaires
-- NFR : latence < 100ms pour 500 annonces, index partiels sur annonces actives
-- Utilise toujours `statut` (jamais `status`)

-- ============================================================
-- INDEX DE PERFORMANCE (avant les fonctions)
-- ============================================================

-- Index partiel GIST sur les annonces actives avec géolocalisation
-- Couvre ST_DWithin et ST_MakeEnvelope sans scanner les annonces archivées
CREATE INDEX IF NOT EXISTS idx_annonces_active_location
  ON annonces USING GIST (location)
  WHERE statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe');

-- Index sur date_debut pour le tri ordonné des annonces actives
CREATE INDEX IF NOT EXISTS idx_annonces_date_debut
  ON annonces (date_debut ASC)
  WHERE statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe');

-- ============================================================
-- FONCTION 1 : search_annonces_geo
-- Recherche radiale autour d'un point (lat/lng + rayon en mètres)
-- Filtres optionnels : dates, rétrocession minimale
-- Tri : urgence d'abord, puis annonces natives, puis date_debut ASC
-- ============================================================

CREATE OR REPLACE FUNCTION search_annonces_geo(
  p_lat             DOUBLE PRECISION,
  p_lng             DOUBLE PRECISION,
  p_radius_meters   INT              DEFAULT 30000,
  p_date_debut      DATE             DEFAULT NULL,
  p_date_fin        DATE             DEFAULT NULL,
  p_retrocession_min NUMERIC         DEFAULT NULL,
  p_limit           INT              DEFAULT 50,
  p_offset          INT              DEFAULT 0
)
RETURNS TABLE (
  id              UUID,
  type_annonce    TEXT,
  date_debut      DATE,
  date_fin        DATE,
  retrocession    NUMERIC,
  ville           TEXT,
  code_postal     TEXT,
  statut          TEXT,
  is_urgent       BOOLEAN,
  source          TEXT,
  source_url      TEXT,
  specialites     JSONB,
  type_cabinet    TEXT,
  description     TEXT,
  profile_id      UUID,
  created_at      TIMESTAMPTZ,
  distance_meters DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.type_annonce,
    a.date_debut,
    a.date_fin,
    a.retrocession,
    a.ville,
    a.code_postal,
    a.statut,
    a.is_urgent,
    a.source,
    a.source_url,
    a.specialites,
    a.type_cabinet,
    a.description,
    a.profile_id,
    a.created_at,
    ST_Distance(a.location, ST_MakePoint(p_lng, p_lat)::geography) AS distance_meters
  FROM annonces a
  WHERE
    a.statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe')
    AND a.location IS NOT NULL
    AND ST_DWithin(a.location, ST_MakePoint(p_lng, p_lat)::geography, p_radius_meters)
    AND (p_date_debut IS NULL OR a.date_debut >= p_date_debut)
    AND (p_date_fin   IS NULL OR a.date_fin   <= p_date_fin)
    AND (p_retrocession_min IS NULL OR a.retrocession >= p_retrocession_min)
  ORDER BY
    CASE WHEN a.is_urgent THEN 0 ELSE 1 END,
    CASE WHEN a.source = 'native' THEN 0 ELSE 1 END,
    a.date_debut ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- FONCTION 2 : search_annonces_bbox
-- Recherche dans une bounding box (coin SW + coin NE)
-- Utilisée par la carte pour charger les marqueurs visibles
-- Retourne uniquement les champs nécessaires au rendu carte
-- ============================================================

CREATE OR REPLACE FUNCTION search_annonces_bbox(
  p_sw_lat DOUBLE PRECISION,
  p_sw_lng DOUBLE PRECISION,
  p_ne_lat DOUBLE PRECISION,
  p_ne_lng DOUBLE PRECISION,
  p_limit  INT DEFAULT 200
)
RETURNS TABLE (
  id           UUID,
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  statut       TEXT,
  is_urgent    BOOLEAN,
  source       TEXT,
  ville        TEXT,
  date_debut   DATE,
  retrocession NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    ST_Y(a.location::geometry) AS lat,
    ST_X(a.location::geometry) AS lng,
    a.statut,
    a.is_urgent,
    a.source,
    a.ville,
    a.date_debut,
    a.retrocession
  FROM annonces a
  WHERE
    a.statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe')
    AND a.location IS NOT NULL
    AND a.location && ST_MakeEnvelope(p_sw_lng, p_sw_lat, p_ne_lng, p_ne_lat, 4326)::geography
  ORDER BY
    CASE WHEN a.is_urgent THEN 0 ELSE 1 END,
    CASE WHEN a.source = 'native' THEN 0 ELSE 1 END
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- FONCTION 3 : retrocession_moyenne_zone
-- Alias mis à jour de get_retrocession_moyenne_zone (migration 016)
-- Filtre sur les statuts actifs pertinents — exclut 'pourvue'
-- Conserve get_retrocession_moyenne_zone pour compatibilité ascendante
-- ============================================================

CREATE OR REPLACE FUNCTION retrocession_moyenne_zone(
  p_lat       DOUBLE PRECISION,
  p_lng       DOUBLE PRECISION,
  p_radius_km INT DEFAULT 30
)
RETURNS NUMERIC(5,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT ROUND(AVG(retrocession)::NUMERIC, 2)
  FROM annonces
  WHERE statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe')
    AND location IS NOT NULL
    AND ST_DWithin(
      location,
      ST_MakePoint(p_lng, p_lat)::geography,
      p_radius_km * 1000  -- conversion km → mètres
    )
    AND created_at >= NOW() - INTERVAL '6 months';
$$;

-- ============================================================
-- FONCTION 4 : annonces_similaires
-- Retourne des annonces proches géographiquement d'une annonce donnée
-- Triées par distance puis par écart de rétrocession
-- ============================================================

CREATE OR REPLACE FUNCTION annonces_similaires(
  p_annonce_id UUID,
  p_limit      INT DEFAULT 3
)
RETURNS TABLE (
  id              UUID,
  type_annonce    TEXT,
  date_debut      DATE,
  date_fin        DATE,
  retrocession    NUMERIC,
  ville           TEXT,
  statut          TEXT,
  is_urgent       BOOLEAN,
  source          TEXT,
  distance_meters DOUBLE PRECISION
) AS $$
DECLARE
  v_lat          DOUBLE PRECISION;
  v_lng          DOUBLE PRECISION;
  v_retrocession NUMERIC;
BEGIN
  -- Récupérer les coordonnées et la rétrocession de l'annonce cible
  SELECT
    ST_Y(location::geometry),
    ST_X(location::geometry),
    retrocession
  INTO v_lat, v_lng, v_retrocession
  FROM annonces
  WHERE id = p_annonce_id;

  -- Retourner vide si l'annonce cible n'a pas de géolocalisation
  IF v_lat IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    a.id,
    a.type_annonce,
    a.date_debut,
    a.date_fin,
    a.retrocession,
    a.ville,
    a.statut,
    a.is_urgent,
    a.source,
    ST_Distance(a.location, ST_MakePoint(v_lng, v_lat)::geography) AS distance_meters
  FROM annonces a
  WHERE
    a.id != p_annonce_id
    AND a.statut IN ('active', 'en_cours', 'source_externe')
    AND a.location IS NOT NULL
    AND a.date_debut >= CURRENT_DATE
    AND ST_DWithin(a.location, ST_MakePoint(v_lng, v_lat)::geography, 50000)
  ORDER BY
    ST_Distance(a.location, ST_MakePoint(v_lng, v_lat)::geography),
    ABS(a.retrocession - v_retrocession)
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- GRANTS — SECURITY DEFINER avec accès explicite par rôle
-- ============================================================

GRANT EXECUTE ON FUNCTION search_annonces_geo TO authenticated;
GRANT EXECUTE ON FUNCTION search_annonces_bbox TO authenticated;
GRANT EXECUTE ON FUNCTION retrocession_moyenne_zone TO authenticated;
GRANT EXECUTE ON FUNCTION annonces_similaires TO authenticated;
