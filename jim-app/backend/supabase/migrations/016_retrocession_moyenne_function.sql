-- Migration 016 : Fonction de calcul de la rétrocession moyenne dans une zone (FR12)

CREATE OR REPLACE FUNCTION get_retrocession_moyenne_zone(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 30
)
RETURNS NUMERIC(5,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT ROUND(AVG(retrocession)::NUMERIC, 2)
  FROM annonces
  WHERE statut IN ('active', 'en_cours', 'pourvue')
    AND location IS NOT NULL
    AND ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(lon, lat), 4326)::GEOGRAPHY,
      radius_km * 1000  -- conversion km → mètres
    )
    AND created_at >= NOW() - INTERVAL '6 months';
$$;

-- Grant pour les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION get_retrocession_moyenne_zone TO authenticated;
