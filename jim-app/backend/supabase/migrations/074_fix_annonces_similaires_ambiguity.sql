-- Migration 073 : Fix "column reference 'retrocession' is ambiguous" (42702)
--
-- Bug remonte par le front (useAnnoncesSimilaires) : POST /rpc/annonces_similaires retournait 400.
-- Cause : en PL/pgSQL, les colonnes de RETURNS TABLE sont traitees comme des variables locales.
-- La colonne `retrocession` de la RETURNS TABLE entre en conflit avec `a.retrocession` dans
-- ORDER BY ABS(a.retrocession - v_retrocession), meme qualifiee.
--
-- Fix canonique : directive `#variable_conflict use_column` en tete du body, qui resout
-- les ambiguites en favorisant la colonne SQL. Aucun changement de signature client.

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
#variable_conflict use_column
DECLARE
  v_lat          DOUBLE PRECISION;
  v_lng          DOUBLE PRECISION;
  v_retrocession NUMERIC;
BEGIN
  -- Recuperer les coordonnees et la retrocession de l'annonce cible
  SELECT
    ST_Y(location::geometry),
    ST_X(location::geometry),
    annonces.retrocession
  INTO v_lat, v_lng, v_retrocession
  FROM annonces
  WHERE annonces.id = p_annonce_id;

  -- Retourner vide si l'annonce cible n'a pas de geolocalisation
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
    a.id <> p_annonce_id
    AND a.statut IN ('active', 'en_cours', 'source_externe')
    AND a.location IS NOT NULL
    AND a.date_debut >= CURRENT_DATE
    AND ST_DWithin(a.location, ST_MakePoint(v_lng, v_lat)::geography, 50000)
  ORDER BY
    ST_Distance(a.location, ST_MakePoint(v_lng, v_lat)::geography),
    ABS(a.retrocession - v_retrocession)
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_catalog;

GRANT EXECUTE ON FUNCTION annonces_similaires TO authenticated;
