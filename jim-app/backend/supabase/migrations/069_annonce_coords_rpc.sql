-- RPC pour extraire les coordonnees lat/lng d'une annonce (PostGIS)
CREATE OR REPLACE FUNCTION annonce_coords(p_annonce_id UUID)
RETURNS TABLE (lat DOUBLE PRECISION, lng DOUBLE PRECISION)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT ST_Y(location::geometry), ST_X(location::geometry)
  FROM annonces WHERE id = p_annonce_id AND location IS NOT NULL;
$$;

GRANT EXECUTE ON FUNCTION annonce_coords TO anon, authenticated;
