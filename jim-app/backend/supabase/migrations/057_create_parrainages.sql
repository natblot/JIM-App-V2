-- Migration 057 : Table parrainages — Epic 11 "Parrainage & Badge Ambassadeur"
-- Code unique, activation en 2 etapes (inscrit → actif)

CREATE TABLE parrainages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  parrain_id UUID NOT NULL REFERENCES auth.users(id),
  filleul_id UUID REFERENCES auth.users(id),  -- NULL tant que pas inscrit

  code TEXT NOT NULL UNIQUE,  -- 'LEA-JIM-7412'

  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'inscrit', 'actif')
  ),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at TIMESTAMPTZ
);

CREATE INDEX idx_parrainages_parrain ON parrainages(parrain_id);
CREATE INDEX idx_parrainages_code ON parrainages(code);
CREATE INDEX idx_parrainages_filleul ON parrainages(filleul_id) WHERE filleul_id IS NOT NULL;

-- RLS
ALTER TABLE parrainages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parrainages_select_own"
  ON parrainages FOR SELECT
  TO authenticated
  USING (parrain_id = auth.uid() OR filleul_id = auth.uid());

-- INSERT/UPDATE via service_role (Edge Functions)
CREATE POLICY "parrainages_service_all"
  ON parrainages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
