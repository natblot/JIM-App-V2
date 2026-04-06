-- Migration 055 : Colonnes reputation sur profiles — Epic 11
-- Score de fiabilite, note moyenne, badge ambassadeur, code parrainage

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parrainage_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_ambassadeur BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nb_remplacements INT NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS score_fiabilite NUMERIC(3,1);  -- NULL si < 3 avis
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS note_moyenne NUMERIC(3,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nb_avis INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_parrainage_code
  ON profiles(parrainage_code) WHERE parrainage_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_score
  ON profiles(score_fiabilite DESC NULLS LAST) WHERE score_fiabilite IS NOT NULL;

COMMENT ON COLUMN profiles.score_fiabilite IS 'Score /5 : 60% note + 20% volume + 20% anciennete. NULL si < 3 avis';
COMMENT ON COLUMN profiles.parrainage_code IS 'Code parrainage unique format PRE-JIM-XXXX';
