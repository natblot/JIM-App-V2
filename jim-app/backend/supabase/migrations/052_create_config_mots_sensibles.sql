-- Migration 052 : Table config_mots_sensibles — Epic 10 "Detection Mots-Cles"
-- Mots-cles configurables sans deploiement — charges cote client

CREATE TABLE config_mots_sensibles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mot TEXT NOT NULL UNIQUE,
  categorie TEXT NOT NULL DEFAULT 'sante',
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed initial : mots-cles de sante a detecter
INSERT INTO config_mots_sensibles (mot, categorie) VALUES
  ('maladie', 'sante'),
  ('cancer', 'sante'),
  ('burn-out', 'sante'),
  ('burnout', 'sante'),
  ('arret maladie', 'sante'),
  ('grossesse', 'sante'),
  ('enceinte', 'sante'),
  ('handicap', 'sante'),
  ('depression', 'sante'),
  ('traitement', 'sante'),
  ('operation', 'sante'),
  ('hospitalisation', 'sante'),
  ('pathologie', 'sante'),
  ('diagnostic', 'sante'),
  ('chimiotherapie', 'sante'),
  ('psychiatrique', 'sante');

-- RLS : lecture publique (charges cote client pour detection locale)
ALTER TABLE config_mots_sensibles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mots_sensibles_select_public"
  ON config_mots_sensibles FOR SELECT
  TO authenticated
  USING (actif = true);

-- INSERT/UPDATE/DELETE via service_role (admin)
CREATE POLICY "mots_sensibles_admin_all"
  ON config_mots_sensibles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
