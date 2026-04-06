-- Migration 007: Ajout de la table professions pour le support multi-professions
-- NFR22: Le schéma de base de données doit être multi-professions dès le jour 1
-- Date: 2026-03-20

-- ============================================================
-- TABLE: professions
-- Description: Référentiel des professions médicales supportées
-- Config JSONB pour personaliser par profession sans migration schema
-- ============================================================

CREATE TABLE IF NOT EXISTS public.professions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT        NOT NULL UNIQUE,           -- Identifiant interne: 'kinesitherapie', 'orthophonie', etc.
  label        TEXT        NOT NULL,                  -- Label affiché: 'Kinésithérapeute', 'Orthophoniste'
  label_plural TEXT        NOT NULL,                  -- Pluriel: 'Kinésithérapeutes'
  config       JSONB       NOT NULL DEFAULT '{}',     -- Config par profession (spécialités, template contrat, RPPS config)
  is_active    BOOLEAN     NOT NULL DEFAULT true,     -- Activer/désactiver sans suppression
  sort_order   INTEGER     NOT NULL DEFAULT 0,        -- Ordre d'affichage
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_professions_code ON public.professions (code);
CREATE INDEX IF NOT EXISTS idx_professions_is_active ON public.professions (is_active) WHERE is_active = true;

-- Commentaires pour documentation
COMMENT ON TABLE public.professions IS 'Référentiel des professions médicales supportées par JIM';
COMMENT ON COLUMN public.professions.config IS 'Config JSONB par profession: specialites[], contrat_template_id, rpps_profession_code, etc.';

-- ============================================================
-- SEED: Kinésithérapie (première profession supportée)
-- ============================================================

INSERT INTO public.professions (code, label, label_plural, config, is_active, sort_order)
VALUES (
  'kinesitherapie',
  'Kinésithérapeute',
  'Kinésithérapeutes',
  jsonb_build_object(
    'specialites', jsonb_build_array(
      jsonb_build_object('code', 'respiratoire', 'label', 'Kinésithérapie respiratoire'),
      jsonb_build_object('code', 'pediatrique', 'label', 'Kinésithérapie pédiatrique'),
      jsonb_build_object('code', 'neurologique', 'label', 'Kinésithérapie neurologique'),
      jsonb_build_object('code', 'orthopedique', 'label', 'Kinésithérapie orthopédique'),
      jsonb_build_object('code', 'geriatrique', 'label', 'Kinésithérapie gériatrique'),
      jsonb_build_object('code', 'sportive', 'label', 'Kinésithérapie sportive'),
      jsonb_build_object('code', 'cardiovasculaire', 'label', 'Kinésithérapie cardiovasculaire'),
      jsonb_build_object('code', 'vestibulaire', 'label', 'Kinésithérapie vestibulaire'),
      jsonb_build_object('code', 'oncologique', 'label', 'Kinésithérapie oncologique'),
      jsonb_build_object('code', 'generale', 'label', 'Kinésithérapie générale')
    ),
    'rpps_profession_code', '50',
    'rpps_profession_label', 'Masseur-Kinésithérapeute',
    'contrat_template_id', null,
    'retrocession_moyenne_pct', 85,
    'retrocession_range', jsonb_build_object('min', 70, 'max', 100)
  ),
  true,
  1
)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.professions ENABLE ROW LEVEL SECURITY;

-- Lecture publique (tous les utilisateurs authentifiés peuvent voir les professions)
CREATE POLICY "professions_select_authenticated"
  ON public.professions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Modification réservée aux admins (role 'admin' dans les claims JWT)
CREATE POLICY "professions_admin_all"
  ON public.professions
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Lecture publique pour les utilisateurs anonymes (landing page)
CREATE POLICY "professions_select_anon"
  ON public.professions
  FOR SELECT
  TO anon
  USING (is_active = true);

-- ============================================================
-- TRIGGER: updated_at automatique
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_professions_updated_at
  BEFORE UPDATE ON public.professions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
