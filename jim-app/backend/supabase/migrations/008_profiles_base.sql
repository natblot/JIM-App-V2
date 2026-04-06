-- Migration 008: Table profiles de base avec colonnes RPPS et consentement
-- Couvre les stories 1.2 (inscription), 1.4 (RPPS), 1.10 (CGU)
-- Date: 2026-03-20

-- S'assure que l'extension PostGIS est disponible (géospatial pour Epic 4)
CREATE EXTENSION IF NOT EXISTS postgis;

-- S'assure que l'extension pg_cron est disponible (re-vérification RPPS quotidienne)
-- Note: pg_cron est activé au niveau serveur Supabase — pas besoin de CREATE EXTENSION

-- ============================================================
-- TABLE: profiles
-- Description: Profils des professionnels de santé
-- Séparé de auth.users pour contrôle total du schéma
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role                 TEXT        NOT NULL CHECK (role IN ('remplacant', 'titulaire')),
  profession_id        UUID        REFERENCES public.professions(id) ON DELETE SET NULL,

  -- Identité
  first_name           TEXT        NOT NULL DEFAULT '',
  last_name            TEXT        NOT NULL DEFAULT '',
  email                TEXT        NOT NULL,
  phone                TEXT,

  -- RPPS (gate d'identité)
  rpps_number          TEXT        UNIQUE,
  rpps_verified        BOOLEAN     NOT NULL DEFAULT false,
  rpps_verified_at     TIMESTAMPTZ,

  -- Profil professionnel
  avatar_url           TEXT,
  specialties          TEXT[]      NOT NULL DEFAULT '{}',
  mobility_radius_km   INTEGER     NOT NULL DEFAULT 50 CHECK (mobility_radius_km >= 0 AND mobility_radius_km <= 500),
  city                 TEXT,
  department           TEXT,
  region               TEXT,
  bio                  TEXT,

  -- RGPD
  cgu_accepted_at      TIMESTAMPTZ,

  -- Préparation Stripe Connect (Epic 9)
  stripe_account_id    TEXT,
  rcp_verified         BOOLEAN     NOT NULL DEFAULT false,

  -- Administration
  is_blocked           BOOLEAN     NOT NULL DEFAULT false,
  blocked_reason       TEXT,

  -- Modèle économique
  launch_period_active BOOLEAN     NOT NULL DEFAULT true,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_rpps_number ON public.profiles (rpps_number) WHERE rpps_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_rpps_verified ON public.profiles (rpps_verified);

-- Commentaires
COMMENT ON TABLE public.profiles IS 'Profils des professionnels de santé — séparé de auth.users';
COMMENT ON COLUMN public.profiles.rpps_number IS 'Numéro RPPS 11 chiffres — gate d identité obligatoire';
COMMENT ON COLUMN public.profiles.rpps_verified IS 'true = RPPS vérifié via API Annuaire Santé';
COMMENT ON COLUMN public.profiles.cgu_accepted_at IS 'RGPD: timestamp du consentement aux CGU (NULL = non accepté)';
COMMENT ON COLUMN public.profiles.stripe_account_id IS 'Stripe Connect account ID — NULL avant onboarding Epic 9';
COMMENT ON COLUMN public.profiles.launch_period_active IS 'Commission 0% pendant la période de lancement';

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lecture : tout utilisateur authentifié peut voir les profils vérifiés (pour les annonces et candidatures)
CREATE POLICY "profiles_select_verified"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (rpps_verified = true AND is_blocked = false);

-- Lecture : chaque utilisateur peut voir son propre profil (même non vérifié)
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insertion : chaque utilisateur crée son propre profil
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Mise à jour : chaque utilisateur peut modifier son propre profil
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin : accès complet
CREATE POLICY "profiles_admin_all"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- ============================================================
-- TRIGGER: updated_at automatique
-- (La fonction handle_updated_at() est créée dans migration 007)
-- ============================================================

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- FONCTION: Créer un profil automatiquement à l'inscription
-- Déclenché par auth.users ON INSERT via Supabase Auth hook
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'remplacant')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
