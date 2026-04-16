-- Migration 076 : Durcissement RLS profiles + extension profiles_public
--
-- Probleme RGPD identifie au QA 2026-04-16 :
-- La policy "profiles_select_verified_public" autorisait tout user authentifie a
-- SELECT * sur tous les profils RPPS-verifies. Comme RLS filtre les LIGNES et pas
-- les COLONNES, cela exposait email, phone, stripe_account_id, fcm_token, push_token,
-- prefs personnelles, etc. d'un confrere — fuite RGPD critique.
--
-- Fix :
-- 1. DROP la policy permissive
-- 2. Etendre la vue profiles_public avec les colonnes legitimement publiques
--    (score_fiabilite, rpps_number — public dans l'annuaire sante, parrainage_code —
--    code d'invitation par essence public)
-- 3. Repasser profiles_public en security_invoker = false (rollback partiel de 072
--    pour cette vue uniquement) afin de permettre aux call sites anon/authenticated
--    de lire les profils des autres users via la vue (les colonnes sensibles sont
--    masquees par projection de la vue)
-- 4. GRANT SELECT explicite TO anon, authenticated
--
-- Apres ce fix, les seules lectures inter-utilisateurs autorisees passent par
-- profiles_public (ne contient ni email, ni phone, ni stripe, ni push tokens, ni
-- prefs personnelles). La table profiles brute reste lisible UNIQUEMENT par
-- l'utilisateur lui-meme (profiles_select_own) et l'admin (profiles_admin_all).

-- 1. Supprimer la policy permissive
DROP POLICY IF EXISTS "profiles_select_verified_public" ON public.profiles;

-- 2. Recreer profiles_public avec colonnes legitimement publiques.
--    DROP + CREATE car CREATE OR REPLACE VIEW ne sait pas reordonner les colonnes
--    ni en inserer au milieu. Pas de dependances downstream verifie.
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public AS
SELECT
  id,
  user_id,
  role,
  profession_id,
  first_name,
  last_name,
  avatar_url,
  bio,
  specialties,
  mobility_radius_km,
  city,
  department,
  region,
  rpps_number,
  rpps_verified,
  rpps_verified_at,
  score_fiabilite,
  parrainage_code,
  cgu_accepted_at,
  rcp_verified,
  is_blocked,
  launch_period_active,
  created_at,
  updated_at
FROM public.profiles
WHERE rpps_verified = true AND is_blocked = false;

-- 3. security_invoker = false (exception au hardening 072) pour permettre l'acces
--    aux profils d'autres users via la projection de la vue
ALTER VIEW public.profiles_public SET (security_invoker = false);

-- 4. GRANT explicite : anon pour les pages publiques (detail annonce SSR,
--    invite/[code]), authenticated pour l'app
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Rafraichir le cache de schema PostgREST
NOTIFY pgrst, 'reload schema';

COMMENT ON VIEW public.profiles_public IS
  'Vue publique des profils RPPS-verifies non bloques. Expose uniquement les colonnes legitimement publiques (identite professionnelle, reputation, code parrainage). Les colonnes sensibles (email, phone, stripe, push tokens, prefs) restent privees dans la table profiles, accessible uniquement via profiles_select_own ou profiles_admin_all.';
