-- Migration 064 : Colonnes moderation — Epic 12
-- Suspension de compte + masquage de contenu

-- Suspension
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;

-- Masquage
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;

-- Index pour filtrer les contenus masques/suspendus
CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON profiles(suspended) WHERE suspended = true;
CREATE INDEX IF NOT EXISTS idx_annonces_hidden ON annonces(hidden) WHERE hidden = true;
