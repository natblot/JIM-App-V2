-- Migration 035 : Fonction de matching annonce → remplaçants disponibles
-- Epic 7 — Notifications & Calendrier
-- Utilisée par le dispatcher pour cibler les remplaçants à notifier

CREATE OR REPLACE FUNCTION match_remplacants_for_annonce(p_annonce_id UUID)
RETURNS TABLE (
  profile_id UUID,
  user_id UUID,
  fcm_token TEXT,
  push_annonces BOOLEAN,
  distance_meters DOUBLE PRECISION
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_date_debut DATE;
  v_date_fin DATE;
  v_location GEOGRAPHY;
BEGIN
  -- Récupère les dates et la localisation de l'annonce
  SELECT a.date_debut, a.date_fin, a.location
  INTO v_date_debut, v_date_fin, v_location
  FROM annonces a
  WHERE a.id = p_annonce_id;

  -- Pas de matching géographique possible sans localisation
  IF v_location IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    p.id AS profile_id,
    p.user_id,
    p.fcm_token,
    p.push_annonces,
    ST_Distance(p.location, v_location) AS distance_meters
  FROM profiles p
  WHERE
    p.role = 'remplacant'
    AND p.rpps_verified = true
    AND p.location IS NOT NULL
    AND p.push_paused = false
    -- Remplaçant dans le rayon de mobilité de l'annonce
    AND ST_DWithin(p.location::geography, v_location::geography, (p.mobility_radius_km * 1000)::float8)
    -- Au moins une période de disponibilité couvrant les dates de l'annonce
    AND EXISTS (
      SELECT 1 FROM calendrier c
      WHERE c.profile_id = p.id
        AND c.type = 'disponible'
        AND c.date_debut <= v_date_debut
        AND c.date_fin >= v_date_fin
    )
    -- N'a pas déjà candidaté (candidatures.remplacant_id = auth.users.id = profiles.user_id)
    AND NOT EXISTS (
      SELECT 1 FROM candidatures cand
      WHERE cand.annonce_id = p_annonce_id
        AND cand.remplacant_id = p.user_id
    )
  -- Plus proche en premier
  ORDER BY ST_Distance(p.location, v_location)
  -- Limite à 50 pour ne pas saturer le dispatcher
  LIMIT 50;
END;
$$;

-- Accessible uniquement au service_role (Edge Functions, pas les clients)
GRANT EXECUTE ON FUNCTION match_remplacants_for_annonce(UUID) TO service_role;
