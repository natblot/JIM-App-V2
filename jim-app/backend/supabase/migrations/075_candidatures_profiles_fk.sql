-- Migration 075 : Ajoute une FK redondante candidatures.remplacant_id -> profiles(user_id)
-- pour permettre a PostgREST d'embed le profil remplacant dans useCandidaturesRecues
-- et le dashboard candidatures (titulaire et remplacant).
--
-- Contexte :
-- - candidatures.remplacant_id pointe vers auth.users(id) (migration 024)
-- - PostgREST ne peut pas faire d'embed sur auth.users (schema different, pas de colonnes metier)
-- - Sans cette FK, l'UI dashboard candidatures retourne HTTP 400 PGRST200
--   (decouvert lors du QA exploratoire 2026-04-16)
-- - Meme pattern correctif que migrations 070 (annonces) et 071 (conversations)
--
-- NB : on garde la FK historique vers auth.users pour le cascade delete natif Supabase.

-- Idempotent : skip si la contrainte existe deja (rejeu de la migration sur un DB
-- ou le fix a deja ete applique manuellement via SQL Editor)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'candidatures_remplacant_id_profiles_fkey'
      AND conrelid = 'public.candidatures'::regclass
  ) THEN
    ALTER TABLE candidatures
      ADD CONSTRAINT candidatures_remplacant_id_profiles_fkey
      FOREIGN KEY (remplacant_id) REFERENCES profiles(user_id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Rafraichir le cache de schema PostgREST pour que la nouvelle relation soit visible
NOTIFY pgrst, 'reload schema';
