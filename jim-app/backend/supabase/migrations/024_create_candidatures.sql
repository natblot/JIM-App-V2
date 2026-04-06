-- Migration 024 : Table candidatures — Epic 5
-- FRs couverts : FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR58, FR64

-- Vérifier que update_updated_at_column() existe
-- (créé dans une migration précédente)

CREATE TABLE candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  annonce_id UUID NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
  remplacant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contenu
  message TEXT CHECK (char_length(message) <= 500),

  -- Statut
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (
    statut IN ('en_attente', 'vue', 'en_discussion', 'acceptee', 'refusee', 'refusee_auto', 'retiree', 'expiree')
  ),

  -- Métadonnées
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,

  -- Incompatibilités détectées avant envoi
  warnings JSONB DEFAULT '[]',

  -- Contrainte unicité : 1 candidature par remplaçant par annonce
  CONSTRAINT candidatures_unique_per_annonce UNIQUE (annonce_id, remplacant_id)
);

-- Index
CREATE INDEX idx_candidatures_annonce ON candidatures(annonce_id, statut);
CREATE INDEX idx_candidatures_remplacant ON candidatures(remplacant_id, statut);
CREATE INDEX idx_candidatures_status_date ON candidatures(statut, created_at DESC)
  WHERE statut IN ('en_attente', 'vue', 'en_discussion');
CREATE INDEX idx_candidatures_expiration ON candidatures(created_at)
  WHERE statut = 'en_attente';

-- Trigger updated_at (réutilise la fonction existante)
CREATE TRIGGER set_candidatures_updated_at
  BEFORE UPDATE ON candidatures
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- RLS
ALTER TABLE candidatures ENABLE ROW LEVEL SECURITY;

-- Le remplaçant voit ses propres candidatures
CREATE POLICY candidatures_select_own ON candidatures
  FOR SELECT USING (remplacant_id = auth.uid());

-- Le titulaire voit les candidatures sur ses annonces
CREATE POLICY candidatures_select_titulaire ON candidatures
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM annonces
      WHERE annonces.id = candidatures.annonce_id
      AND annonces.profile_id = auth.uid()
    )
  );

-- Seuls les remplaçants vérifiés RPPS peuvent candidater (sur annonces actives uniquement)
CREATE POLICY candidatures_insert_rpps ON candidatures
  FOR INSERT WITH CHECK (
    remplacant_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.rpps_verified = true
      AND profiles.role = 'remplacant'
    )
    AND EXISTS (
      SELECT 1 FROM annonces
      WHERE annonces.id = annonce_id
      AND annonces.statut IN ('active', 'non_confirmee')
      AND annonces.source IN ('native', 'rempleo')
    )
  );

-- Le remplaçant peut retirer sa propre candidature (en_attente → retiree)
CREATE POLICY candidatures_update_own ON candidatures
  FOR UPDATE USING (remplacant_id = auth.uid())
  WITH CHECK (remplacant_id = auth.uid() AND statut = 'retiree');

-- Le titulaire peut accepter/refuser les candidatures sur SES annonces
CREATE POLICY candidatures_update_titulaire ON candidatures
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM annonces
      WHERE annonces.id = candidatures.annonce_id
      AND annonces.profile_id = auth.uid()
    )
  );

-- Pas de DELETE — soft delete via statut
