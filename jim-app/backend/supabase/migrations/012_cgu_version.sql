-- Migration 012 : Versionnage des CGU pour Story 1.10
-- Permet de détecter les mises à jour CGU et d'inviter à re-accepter

-- Ajout du numéro de version CGU accepté dans profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS cgu_version INTEGER NOT NULL DEFAULT 1;

-- Table de référence pour la version courante des CGU
CREATE TABLE IF NOT EXISTS cgu_versions (
  id          INTEGER PRIMARY KEY,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT NOT NULL
);

-- Insérer la version 1 (CGU initiales)
INSERT INTO cgu_versions (id, description)
VALUES (1, 'CGU initiales — lancement JIM MVP')
ON CONFLICT (id) DO NOTHING;

-- RLS sur cgu_versions : lecture publique, écriture admin seulement
ALTER TABLE cgu_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cgu_versions_select_all"
  ON cgu_versions FOR SELECT USING (true);

CREATE POLICY "cgu_versions_admin_all"
  ON cgu_versions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Fonction utilitaire : retourne la version CGU courante
CREATE OR REPLACE FUNCTION current_cgu_version()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(MAX(id), 1) FROM cgu_versions;
$$;

-- Vue : utilisateurs ayant une version CGU obsolète
CREATE OR REPLACE VIEW profiles_cgu_outdated AS
  SELECT p.user_id, p.cgu_version, current_cgu_version() AS current_version
  FROM profiles p
  WHERE p.cgu_version < current_cgu_version()
    AND p.is_blocked = false;
