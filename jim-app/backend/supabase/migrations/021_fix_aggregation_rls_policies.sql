-- Migration 021 : Renforcement RLS aggregation_runs et aggregation_logs
-- SÉCURITÉ : Les policies service_insert avec WITH CHECK (true) permettaient
-- à tout utilisateur authentifié d'insérer des données. Correction : restreindre
-- l'insertion au service_role uniquement (qui bypasse RLS par nature) et
-- interdire explicitement les insertions non-service via auth.role().

-- aggregation_runs : supprimer la policy d'insert ouverte
DROP POLICY IF EXISTS "aggregation_runs_service_insert" ON aggregation_runs;
-- Supprimer aussi la policy deny si elle existe déjà (idempotence)
DROP POLICY IF EXISTS "aggregation_runs_deny_user_insert" ON aggregation_runs;

-- Remplacer par une policy qui bloque les utilisateurs normaux
-- Le service_role bypasse RLS, donc cette table n'est inscriptible
-- que via les Edge Functions s'exécutant en service_role
CREATE POLICY "aggregation_runs_deny_user_insert" ON aggregation_runs
  FOR INSERT WITH CHECK (false);

-- aggregation_logs : même correction
DROP POLICY IF EXISTS "aggregation_logs_service_insert" ON aggregation_logs;
-- Supprimer aussi la policy deny si elle existe déjà (idempotence)
DROP POLICY IF EXISTS "aggregation_logs_deny_user_insert" ON aggregation_logs;

CREATE POLICY "aggregation_logs_deny_user_insert" ON aggregation_logs
  FOR INSERT WITH CHECK (false);

-- Note : le service_role (Edge Functions) bypasse ces policies par définition.
-- Ces policies WITH CHECK (false) servent uniquement à bloquer les utilisateurs
-- normaux qui tenteraient d'insérer directement via le client Supabase.