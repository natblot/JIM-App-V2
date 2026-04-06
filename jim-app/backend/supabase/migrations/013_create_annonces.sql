-- Migration 013 : Table annonces — Epic 2 Publication & Gestion d'Annonces
-- FRs couverts : FR11, FR12, FR13, FR14, FR17, FR18, FR19, FR59
-- Note: profiles.user_id = auth.users.id (colonnes distinctes dans notre schéma)

CREATE TABLE annonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Propriétaire (référence auth.users via profiles.user_id)
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contenu obligatoire (Story 2.1)
  type_annonce TEXT NOT NULL DEFAULT 'remplacement'
    CHECK (type_annonce IN ('remplacement', 'assistanat', 'collaboration', 'cession')),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  CONSTRAINT date_fin_after_debut CHECK (date_fin >= date_debut),
  retrocession NUMERIC(5,2) NOT NULL
    CHECK (retrocession >= 0 AND retrocession <= 100),
  description TEXT,

  -- Localisation (géocodée depuis api-adresse.data.gouv.fr)
  ville TEXT NOT NULL,
  code_postal TEXT,
  adresse_complete TEXT,
  location GEOGRAPHY(POINT, 4326),

  -- Infos cabinet héritées du profil au moment de la publication
  type_cabinet TEXT,
  specialites JSONB NOT NULL DEFAULT '[]',

  -- Statut & cycle de vie (Story 2.5)
  statut TEXT NOT NULL DEFAULT 'active'
    CHECK (statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe', 'pourvue', 'expiree')),

  -- Urgence (Story 2.2)
  is_urgent BOOLEAN NOT NULL DEFAULT false,

  -- Agrégation (prépare Epic 3)
  source TEXT NOT NULL DEFAULT 'native',
  source_url TEXT,
  source_id TEXT,
  source_last_verified_at TIMESTAMPTZ,
  merged_with_native_id UUID REFERENCES annonces(id),

  -- Rétrocession moyenne zone calculée à la publication (FR12)
  retrocession_moyenne_zone NUMERIC(5,2),

  -- Relances fraîcheur (FR19)
  freshness_reminder_j7_at TIMESTAMPTZ,
  freshness_reminder_j3_at TIMESTAMPTZ,
  freshness_reminder_count INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

-- Index critiques
CREATE INDEX idx_annonces_statut_created ON annonces(statut, created_at DESC);
CREATE INDEX idx_annonces_location ON annonces USING GIST(location);
CREATE INDEX idx_annonces_profile ON annonces(profile_id);
CREATE INDEX idx_annonces_dates ON annonces(date_debut, date_fin);
CREATE INDEX idx_annonces_source ON annonces(source) WHERE source != 'native';
CREATE INDEX idx_annonces_urgent ON annonces(is_urgent, created_at DESC) WHERE is_urgent = true;

-- Trigger updated_at — utilise handle_updated_at() créée en migration 007
CREATE TRIGGER set_annonces_updated_at
  BEFORE UPDATE ON annonces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies
ALTER TABLE annonces ENABLE ROW LEVEL SECURITY;

-- Lecture publique : annonces visibles (active, en cours, non confirmée, source externe)
CREATE POLICY "annonces_select_public" ON annonces
  FOR SELECT USING (statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe'));

-- Lecture propre : le titulaire voit TOUTES ses annonces (y compris historique)
CREATE POLICY "annonces_select_own" ON annonces
  FOR SELECT USING (profile_id = auth.uid());

-- Insertion : titulaires vérifiés RPPS uniquement
-- Note: on joint via profiles.user_id = auth.uid() (PK de profiles = id, pas user_id)
CREATE POLICY "annonces_insert_titulaire" ON annonces
  FOR INSERT WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.rpps_verified = true
        AND profiles.role = 'titulaire'
        AND profiles.is_blocked = false
    )
  );

-- Mise à jour : propre annonce uniquement
CREATE POLICY "annonces_update_own" ON annonces
  FOR UPDATE USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Pas de DELETE policy = impossible via RLS (soft delete via statut)

-- Admin : accès total
CREATE POLICY "annonces_admin_all" ON annonces
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
