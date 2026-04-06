-- Migration 053 : Fonctions SQL audit + rate limiting — Epic 10
-- Fonctions reutilisables par toutes les Edge Functions

-- ============================================================
-- Fonction : log_audit — insere un log d'audit
-- ============================================================
CREATE OR REPLACE FUNCTION log_audit(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, details)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_ip_address, p_user_agent, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Fonction : check_rate_limit — verifie et incremente le compteur
-- Retourne true si la requete est autorisee, false si le quota est depasse
-- ============================================================
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_max_requests INT,
  p_window INTERVAL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
  v_window_start TIMESTAMPTZ;
BEGIN
  -- Fenetre par heure pour les limites horaires, par jour pour les limites quotidiennes
  IF p_window <= INTERVAL '1 hour' THEN
    v_window_start := date_trunc('hour', now());
  ELSE
    v_window_start := date_trunc('day', now());
  END IF;

  -- Upsert le compteur
  INSERT INTO rate_limits (identifier, endpoint, request_count, window_start, window_duration, max_requests)
  VALUES (p_identifier, p_endpoint, 1, v_window_start, p_window, p_max_requests)
  ON CONFLICT (identifier, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Fonction : get_rate_limit_info — retourne les infos pour les headers X-RateLimit-*
-- ============================================================
CREATE OR REPLACE FUNCTION get_rate_limit_info(
  p_identifier TEXT,
  p_endpoint TEXT
)
RETURNS TABLE(current_count INT, max_allowed INT, window_reset TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rl.request_count,
    rl.max_requests,
    rl.window_start + rl.window_duration
  FROM rate_limits rl
  WHERE rl.identifier = p_identifier
    AND rl.endpoint = p_endpoint
  ORDER BY rl.window_start DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
