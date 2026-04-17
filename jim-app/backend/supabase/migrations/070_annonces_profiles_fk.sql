-- Migration 070 : Ajoute une FK redondante annonces.profile_id -> profiles(user_id)
-- pour permettre a PostgREST d'embed le profil titulaire dans fetchAnnonceById.
--
-- Contexte :
-- - annonces.profile_id pointe vers auth.users(id) (migration 013)
-- - PostgREST ne peut pas faire d'embed sur auth.users (schema different, pas de colonnes metier)
-- - profiles.user_id est UNIQUE et reference auth.users(id), donc une FK directe
--   entre annonces.profile_id et profiles.user_id est valide et redondante
-- - Le frontend utilise le hint 'annonces_profile_id_profiles_fkey' pour embed
--   profiles (first_name, rpps_verified, reputation_score, created_at).
--
-- NB : on garde la FK historique vers auth.users pour le cascade delete natif Supabase.

ALTER TABLE annonces
  ADD CONSTRAINT annonces_profile_id_profiles_fkey
  FOREIGN KEY (profile_id) REFERENCES profiles(user_id)
  ON DELETE CASCADE;

-- Rafraichir le cache de schema PostgREST pour que la nouvelle relation soit visible
NOTIFY pgrst, 'reload schema';
