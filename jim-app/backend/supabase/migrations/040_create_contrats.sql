-- Migration 040 : Table contrats — Epic 8 "Contrats IA"
-- Génération de contrats de remplacement signés numériquement par les deux parties

-- ============================================================
-- Table principale : contrats
-- ============================================================
CREATE TABLE contrats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  annonce_id UUID NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
  candidature_id UUID NOT NULL REFERENCES candidatures(id) ON DELETE CASCADE,
  -- FK vers auth.users (PAS profiles) — convention projet : REFERENCES auth.users(id)
  titulaire_id UUID NOT NULL REFERENCES auth.users(id),
  remplacant_id UUID NOT NULL REFERENCES auth.users(id),
  statut TEXT NOT NULL DEFAULT 'brouillon'
    CHECK (statut IN ('brouillon', 'en_attente_remplacant', 'confirme')),
  template_version TEXT NOT NULL DEFAULT 'v1.0',
  -- Données factuelles pré-remplies (identités, dates, adresse, taux)
  donnees JSONB NOT NULL DEFAULT '{}',
  -- Clauses verrouillées (assurance RCP, durée, obligations légales, exercice libéral)
  clauses_obligatoires JSONB NOT NULL DEFAULT '[]',
  -- Clauses éditables avant confirmation (conditions particulières, horaires, logement)
  clauses_optionnelles JSONB NOT NULL DEFAULT '[]',
  -- Horodatage des confirmations — double confirmation requise
  confirme_par_titulaire_at TIMESTAMPTZ,
  confirme_par_remplacant_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Un seul contrat par candidature (idempotent)
CREATE UNIQUE INDEX contrats_candidature_unique ON contrats(candidature_id);

-- Index pour lookups par utilisateur (liste des contrats d'un titulaire / remplaçant)
CREATE INDEX contrats_titulaire_idx ON contrats(titulaire_id);
CREATE INDEX contrats_remplacant_idx ON contrats(remplacant_id);
CREATE INDEX contrats_annonce_idx ON contrats(annonce_id);

-- Mise à jour automatique de updated_at
CREATE TRIGGER contrats_updated_at
  BEFORE UPDATE ON contrats
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- RLS : Row Level Security
-- ============================================================
ALTER TABLE contrats ENABLE ROW LEVEL SECURITY;

-- SELECT : uniquement les parties du contrat (titulaire OU remplaçant)
CREATE POLICY "contrats_select_parties"
  ON contrats FOR SELECT
  TO authenticated
  USING (titulaire_id = auth.uid() OR remplacant_id = auth.uid());

-- INSERT : service_role uniquement (Edge Function generate-contrat)
-- Les utilisateurs ne peuvent pas créer de contrats directement
CREATE POLICY "contrats_insert_service"
  ON contrats FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE : service_role uniquement (confirmation, édition clauses optionnelles)
CREATE POLICY "contrats_update_service"
  ON contrats FOR UPDATE
  TO service_role
  USING (true);

-- DELETE : aucune policy → RLS bloque tout (archivage permanent, contrainte légale)
