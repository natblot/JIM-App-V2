-- Migration 009: Cache vérification RPPS (NFR40 — validité 6 mois)
-- Date: 2026-03-22

-- Ajouter le champ d'expiration du cache RPPS à profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS rpps_cache_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rpps_last_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rpps_verification_status TEXT
    CHECK (rpps_verification_status IN ('pending', 'verified', 'failed', 'usurpation', 'api_down'))
    DEFAULT 'pending';

-- Index pour la re-vérification quotidienne (pg_cron — Story 1.6)
-- Note : pas de now() dans la clause WHERE (non IMMUTABLE) — filtrage fait dans la requête pg_cron
CREATE INDEX IF NOT EXISTS idx_profiles_rpps_reverify
  ON public.profiles (rpps_verification_status, rpps_cache_expires_at);

COMMENT ON COLUMN public.profiles.rpps_cache_expires_at IS 'Expiration du cache RPPS — 6 mois après la dernière vérification réussie (NFR40)';
COMMENT ON COLUMN public.profiles.rpps_verification_status IS 'pending | verified | failed | usurpation | api_down';
