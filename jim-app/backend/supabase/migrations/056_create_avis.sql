-- Migration 056 : Table avis — Epic 11 "Notation Mutuelle"
-- Avis immutables, anonymes 7 jours, lies a un contrat termine

CREATE TABLE avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations (convention projet : auth.users(id))
  auteur_id UUID NOT NULL REFERENCES auth.users(id),
  destinataire_id UUID NOT NULL REFERENCES auth.users(id),
  contrat_id UUID NOT NULL REFERENCES contrats(id),

  -- Notation
  note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  tags TEXT[] NOT NULL DEFAULT '{}',

  -- Visibilite : anonyme pendant 7 jours
  anonyme_until TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Contraintes
  CONSTRAINT avis_unique_per_contrat_per_auteur UNIQUE (contrat_id, auteur_id),
  CONSTRAINT avis_different_persons CHECK (auteur_id != destinataire_id)
);

CREATE INDEX idx_avis_destinataire ON avis(destinataire_id, created_at DESC);
CREATE INDEX idx_avis_auteur ON avis(auteur_id);
CREATE INDEX idx_avis_contrat ON avis(contrat_id);

-- RLS
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

-- Tout authentifie peut lire les avis (anonymat gere cote applicatif)
CREATE POLICY "avis_select_public"
  ON avis FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les participants a un contrat termine peuvent noter
CREATE POLICY "avis_insert_own"
  ON avis FOR INSERT
  TO authenticated
  WITH CHECK (
    auteur_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM contrats c
      WHERE c.id = contrat_id
      AND c.statut = 'confirme'
      AND (c.titulaire_id = auth.uid() OR c.remplacant_id = auth.uid())
      AND (
        (c.titulaire_id = auth.uid() AND c.remplacant_id = destinataire_id)
        OR (c.remplacant_id = auth.uid() AND c.titulaire_id = destinataire_id)
      )
    )
  );

-- Pas d'UPDATE ni DELETE — les avis sont IMMUTABLES
