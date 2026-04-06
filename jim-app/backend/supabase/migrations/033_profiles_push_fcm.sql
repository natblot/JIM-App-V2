-- Migration 033 : Ajout colonnes push/FCM et géolocalisation à la table profiles
-- Epic 7 — Notifications & Calendrier

-- Token FCM pour l'envoi de push notifications
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Localisation géographique du remplaçant (pour le matching de proximité)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location GEOGRAPHY(Point, 4326);

-- Préférences de notification push par catégorie
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_annonces BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_candidatures BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_messages BOOLEAN NOT NULL DEFAULT true;

-- Pause globale des push (mode ne pas déranger)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_paused BOOLEAN NOT NULL DEFAULT false;

-- Digest email quotidien (MVP : désactivé par défaut)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_digest_enabled BOOLEAN NOT NULL DEFAULT false;

-- Suivi de la cadence des pushs pour le rate limiting (max 3/jour)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_push_sent_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_push_count INT NOT NULL DEFAULT 0;

-- Index spatial pour le matching géographique (uniquement les remplaçants vérifiés avec localisation)
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST (location)
  WHERE location IS NOT NULL AND rpps_verified = true AND role = 'remplacant';
