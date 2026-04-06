-- Migration 050 : Table rate_limits — Epic 10 "Rate Limiting"
-- Compteurs par identifiant (user/IP) et endpoint avec fenetres glissantes

CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifiant : 'user:<uuid>' ou 'ip:<x.x.x.x>'
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,          -- 'create-account', 'search', 'create-candidature', 'export-data'

  -- Compteurs
  request_count INT NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', now()),
  window_duration INTERVAL NOT NULL,
  max_requests INT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT rate_limits_unique UNIQUE (identifier, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(identifier, endpoint, window_start);

-- RLS : pas d'acces utilisateur — service_role uniquement
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rate_limits_service_all"
  ON rate_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
