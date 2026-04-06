-- Migration 020 : Rendre profile_id nullable pour les annonces agrégées
-- Les annonces sources externes n'ont pas de propriétaire JIM

ALTER TABLE annonces ALTER COLUMN profile_id DROP NOT NULL;

-- Mettre à jour la policy insert pour garder la contrainte sur les annonces natives
DROP POLICY IF EXISTS "annonces_insert_titulaire" ON annonces;

CREATE POLICY "annonces_insert_titulaire" ON annonces
  FOR INSERT WITH CHECK (
    -- Annonces natives : doit être le propriétaire vérifié RPPS
    (source = 'native' AND profile_id = auth.uid() AND EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
        AND rpps_verified = true
        AND role = 'titulaire'
        AND is_blocked = false
    ))
    OR
    -- Annonces agrégées : uniquement via service_role (Edge Functions)
    -- Le service_role bypasse RLS, cette branche est donc théorique
    (source != 'native' AND profile_id IS NULL)
  );

-- Policy lecture : inclure les annonces source_externe même sans profile_id
DROP POLICY IF EXISTS "annonces_select_public" ON annonces;

CREATE POLICY "annonces_select_public" ON annonces
  FOR SELECT USING (
    statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe')
  );
