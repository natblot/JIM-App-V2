-- Migration 058 : Table propositions_directes — Epic 11 "Proposition via Favoris"
-- Le titulaire propose un remplacement a un favori, annonce privee creee si acceptee

CREATE TABLE propositions_directes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  titulaire_id UUID NOT NULL REFERENCES auth.users(id),
  remplacant_id UUID NOT NULL REFERENCES auth.users(id),

  -- Contenu simplifie
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL CHECK (date_fin >= date_debut),
  retrocession NUMERIC(5,2) NOT NULL CHECK (retrocession BETWEEN 0 AND 100),

  -- Annonce associee (creee automatiquement si acceptee)
  annonce_id UUID REFERENCES annonces(id),

  status TEXT NOT NULL DEFAULT 'envoyee' CHECK (
    status IN ('envoyee', 'acceptee', 'declinee', 'expiree')
  ),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,

  CONSTRAINT propositions_unique UNIQUE (titulaire_id, remplacant_id, date_debut),
  CONSTRAINT propositions_different CHECK (titulaire_id != remplacant_id)
);

CREATE INDEX idx_propositions_remplacant ON propositions_directes(remplacant_id, status);
CREATE INDEX idx_propositions_titulaire ON propositions_directes(titulaire_id);

-- RLS
ALTER TABLE propositions_directes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "propositions_select_own"
  ON propositions_directes FOR SELECT
  TO authenticated
  USING (titulaire_id = auth.uid() OR remplacant_id = auth.uid());

CREATE POLICY "propositions_insert_titulaire"
  ON propositions_directes FOR INSERT
  TO authenticated
  WITH CHECK (
    titulaire_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM favoris f
      WHERE f.titulaire_id = auth.uid()
      AND f.remplacant_id = propositions_directes.remplacant_id
    )
  );

-- Le remplacant peut accepter/decliner
CREATE POLICY "propositions_update_remplacant"
  ON propositions_directes FOR UPDATE
  TO authenticated
  USING (remplacant_id = auth.uid() AND status = 'envoyee')
  WITH CHECK (status IN ('acceptee', 'declinee'));

-- service_role pour les triggers
CREATE POLICY "propositions_service_all"
  ON propositions_directes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
