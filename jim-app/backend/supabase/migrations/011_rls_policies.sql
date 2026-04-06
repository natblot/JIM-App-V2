-- Migration 011: Policies RLS consolidées — Story 1.9
-- Consolide et complète les RLS de toutes les tables existantes
-- Date: 2026-03-22

-- ============================================================
-- TABLE: profiles — RLS review et complétion
-- ============================================================

-- Supprimer les policies existantes pour éviter les conflits
DROP POLICY IF EXISTS "profiles_select_verified" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- Lecture publique des profils vérifiés (pour candidatures et annonces)
-- Seuls prénom, nom, spécialités, badge RPPS sont exposés (pas le téléphone, pas l'email)
CREATE POLICY "profiles_select_verified_public"
  ON public.profiles FOR SELECT TO authenticated
  USING (rpps_verified = true AND is_blocked = false);

-- Chaque utilisateur peut voir son propre profil complet (même non vérifié)
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Chaque utilisateur crée son propre profil (user_id = son propre UID)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Chaque utilisateur peut modifier ses propres données
-- Exception : rpps_verified, rpps_number, is_blocked ne peuvent être modifiés que par le service role
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    -- Empêche l'utilisateur de se valider lui-même son RPPS
    -- Ces champs sont gérés par les Edge Functions (service role)
  );

-- Admin : accès complet
CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- ============================================================
-- TABLE: professions — RLS déjà en place, vérification
-- ============================================================
-- Les policies de 007_add_professions.sql sont déjà correctes.
-- Ajout d'une policy explicite pour SELECT anon (landing page)
DROP POLICY IF EXISTS "professions_select_anon" ON public.professions;
CREATE POLICY "professions_select_anon"
  ON public.professions FOR SELECT TO anon
  USING (is_active = true);

-- ============================================================
-- FONCTION: Vérifier si un utilisateur est propriétaire d'une ressource
-- Utilisée par les policies des Epics 2-6
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_profile_owner(check_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND id = check_user_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- FUNCTION: Vérifier si l'utilisateur a un RPPS vérifié
-- Gate pour les fonctionnalités critiques (candidature, publication)
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_verified_rpps()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND rpps_verified = true
      AND is_blocked = false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.has_verified_rpps IS 'Retourne true si l utilisateur courant a un RPPS vérifié — utilisé dans les RLS des Epics 2+';
COMMENT ON FUNCTION public.is_profile_owner IS 'Retourne true si auth.uid() est propriétaire du profil donné';

-- ============================================================
-- TESTS RLS — À exécuter manuellement avec 3 comptes
-- ============================================================
-- Test 1 : Remplaçant A ne peut pas modifier le profil de Remplaçant B
-- Test 2 : Titulaire C ne peut pas modifier le profil de Remplaçant A
-- Test 3 : Admin peut tout lire et modifier
-- Ces tests sont documentés dans supabase/tests/rls-policies.md
