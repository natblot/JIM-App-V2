-- Migration 025 : Table favoris — Epic 5, Story 5.9

CREATE TABLE IF NOT EXISTS favoris (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulaire_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remplacant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT CHECK (char_length(note) <= 200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT favoris_unique UNIQUE (titulaire_id, remplacant_id),
  CONSTRAINT favoris_no_self CHECK (titulaire_id != remplacant_id)
);

CREATE INDEX IF NOT EXISTS idx_favoris_titulaire ON favoris(titulaire_id);

ALTER TABLE favoris ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS favoris_select_own ON favoris;
CREATE POLICY favoris_select_own ON favoris
  FOR SELECT USING (titulaire_id = auth.uid());

DROP POLICY IF EXISTS favoris_insert_own ON favoris;
CREATE POLICY favoris_insert_own ON favoris
  FOR INSERT WITH CHECK (
    titulaire_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'titulaire'
    )
  );

DROP POLICY IF EXISTS favoris_delete_own ON favoris;
CREATE POLICY favoris_delete_own ON favoris
  FOR DELETE USING (titulaire_id = auth.uid());
