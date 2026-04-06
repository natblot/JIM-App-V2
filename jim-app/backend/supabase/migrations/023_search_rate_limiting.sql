-- Migration 023 : Rate limiting pour la recherche (NFR16)
-- Limite : 100 requêtes par heure par compte authentifié
-- Implémentation DB pure — une Edge Function peut prendre le relais si nécessaire
-- La table utilise une fenêtre glissante à l'heure (date_trunc)

-- ============================================================
-- TABLE : search_rate_limits
-- Clé primaire composée (user_id, window_start) — une ligne par heure par utilisateur
-- ============================================================

CREATE TABLE IF NOT EXISTS search_rate_limits (
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', NOW()),
  request_count INT         NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, window_start)
);

-- ============================================================
-- RLS — chaque utilisateur ne voit que ses propres lignes
-- ============================================================

ALTER TABLE search_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "search_rate_limits_own" ON search_rate_limits;
CREATE POLICY "search_rate_limits_own" ON search_rate_limits
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- FONCTION : check_search_rate_limit
-- Incrémente le compteur dans la fenêtre horaire courante.
-- Retourne TRUE si sous la limite (≤ 100), FALSE si dépassée.
-- Utilise UPSERT atomique pour éviter les race conditions.
-- ============================================================

CREATE OR REPLACE FUNCTION check_search_rate_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INT;
BEGIN
  -- Upsert atomique dans la fenêtre horaire courante
  INSERT INTO search_rate_limits (user_id, window_start, request_count)
  VALUES (p_user_id, date_trunc('hour', NOW()), 1)
  ON CONFLICT (user_id, window_start)
  DO UPDATE SET request_count = search_rate_limits.request_count + 1
  RETURNING request_count INTO v_count;

  -- 100 req/h maximum (NFR16)
  RETURN v_count <= 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Nettoyage automatique des fenêtres expirées (> 48h)
-- Évite une croissance illimitée de la table
-- ============================================================

CREATE OR REPLACE FUNCTION cleanup_search_rate_limits()
RETURNS VOID AS $$
BEGIN
  DELETE FROM search_rate_limits
  WHERE window_start < NOW() - INTERVAL '48 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant explicite pour les fonctions SECURITY DEFINER
GRANT EXECUTE ON FUNCTION check_search_rate_limit TO authenticated;
-- cleanup appelée uniquement par le service role (cron pg_cron si disponible)
GRANT EXECUTE ON FUNCTION cleanup_search_rate_limits TO service_role;
