-- Migration 072 : Security Advisor fixes (5 ERRORS + 33 WARNINGS)
--
-- Fixe les problèmes remontés par l'advisor Supabase :
--   https://supabase.com/dashboard/project/xfgktshirllqesnwmwpm/advisors/security
--
-- 5 ERRORS :
--   1-4. security_definer_view  : profiles_pending_reverify, annonces_freshness_due,
--        profiles_public, profiles_cgu_outdated
--   5.   rls_disabled_in_public : public.spatial_ref_sys (table système PostGIS)
--
-- 33 WARNings :
--   1-31. function_search_path_mutable : 31 fonctions sans SET search_path
--   32.   extension_in_public          : postgis dans le schéma public
--   33.   rls_enabled_no_policy        : public.message_rate_limits
--
-- NB : on reste conservateur sur le comportement. Les vues passent de SECURITY DEFINER
-- (bypass RLS) à security_invoker=true (utilise la RLS du caller). Les appels backend
-- (cron / service_role) bypass déjà la RLS via le rôle — aucun impact.

-- ============================================================
-- 1-4. SECURITY DEFINER views → security_invoker=true
-- ============================================================
-- PostgreSQL 15+ : ALTER VIEW ... SET (security_invoker = true) impose l'évaluation
-- des droits et de la RLS dans le contexte du caller, pas du créateur de la vue.
-- Référence : https://www.postgresql.org/docs/current/sql-createview.html

ALTER VIEW public.profiles_pending_reverify  SET (security_invoker = true);
ALTER VIEW public.annonces_freshness_due     SET (security_invoker = true);
ALTER VIEW public.profiles_public            SET (security_invoker = true);
ALTER VIEW public.profiles_cgu_outdated      SET (security_invoker = true);

-- ============================================================
-- 5. public.spatial_ref_sys RLS disabled — ACCEPTÉ (faux positif)
-- ============================================================
-- spatial_ref_sys est owned par `supabase_admin`. Aucun role client (même
-- `postgres` via pooler OU via SQL Editor du Dashboard) ne peut `ALTER TABLE`
-- dessus. Même `COMMENT ON TABLE` est bloqué.
--
-- C'est un FAUX POSITIF du linter :
--  - spatial_ref_sys contient uniquement les définitions EPSG publiques
--    (systèmes de coordonnées standardisés, identiques sur toutes les
--    instances PostgreSQL du monde)
--  - PostGIS pose lui-même `GRANT SELECT TO public` dessus — c'est
--    intentionnel et requis par ST_Transform, ST_SetSRID, etc.
--  - Supabase reconnaît le faux positif :
--    https://github.com/orgs/supabase/discussions/21594
--
-- Action : dismiss le warning dans le Dashboard Advisor (voir CLAUDE.md).

-- ============================================================
-- 33. Baseline policy sur public.message_rate_limits
-- ============================================================
-- Table avec RLS activée mais sans aucune policy → aucune ligne visible.
-- On verrouille la table en INSERT/UPDATE/SELECT côté utilisateurs et on autorise
-- le service_role (Edge Functions) à tout faire.
DROP POLICY IF EXISTS message_rate_limits_service_all ON public.message_rate_limits;
CREATE POLICY message_rate_limits_service_all
  ON public.message_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 1-31. SET search_path sur les 31 fonctions public. flaggées
-- ============================================================
-- On fige le search_path à `public, pg_catalog` — c'est déjà le search_path par
-- défaut de la session, mais le figer au niveau fonction empêche un caller malveillant
-- de ré-écrire le search_path avant d'invoquer une fonction SECURITY DEFINER.
-- On exclut les fonctions propriétés d'une extension (dep.deptype = 'e').
DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure::text AS sig
    FROM pg_catalog.pg_proc p
    JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
    LEFT JOIN pg_catalog.pg_depend dep
      ON p.oid = dep.objid AND dep.deptype = 'e'
    WHERE n.nspname = 'public'
      AND dep.objid IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM unnest(COALESCE(p.proconfig, '{}'::text[])) AS c
        WHERE c LIKE 'search_path=%'
      )
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_catalog', fn.sig);
    RAISE NOTICE 'search_path figé sur %', fn.sig;
  END LOOP;
END $$;

-- ============================================================
-- 32. extension_in_public : postgis dans public — ACCEPTÉ
-- ============================================================
-- Déplacer postgis vers le schéma `extensions` (`ALTER EXTENSION postgis SET SCHEMA extensions`)
-- casse toutes les colonnes `geometry` existantes (annonces.location, calendrier…) ainsi
-- que les index GIST PostGIS. Supabase lui-même livre postgis dans public sur les nouveaux
-- projets et a retiré cette recommandation. On accepte le warning via un COMMENT explicite.
COMMENT ON EXTENSION postgis IS
  'Laissé dans le schéma public — lint 0014_extension_in_public accepté (déplacement casse les colonnes geometry et les index GIST existants).';

-- ============================================================
-- Reload du cache PostgREST
-- ============================================================
NOTIFY pgrst, 'reload schema';
