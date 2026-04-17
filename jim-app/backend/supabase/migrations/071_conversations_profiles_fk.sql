-- Migration 071 : Ajoute des FK redondantes conversations.participant_{1,2}_id -> profiles(user_id)
-- pour permettre a PostgREST d'embed les profils des deux participants dans useConversations.
--
-- Contexte :
-- - conversations.participant_1_id et participant_2_id referencent auth.users(id) (migration 028)
-- - PostgREST ne peut pas faire d'embed sur auth.users (schema different, pas de colonnes metier)
-- - profiles.user_id est UNIQUE et reference auth.users(id), donc des FK directes
--   entre conversations et profiles(user_id) sont valides et redondantes
-- - Meme correction que la migration 070 pour annonces.profile_id
--
-- NB : on garde les FK historiques vers auth.users pour le cascade delete natif Supabase.

ALTER TABLE conversations
  ADD CONSTRAINT conversations_p1_profiles_fkey
  FOREIGN KEY (participant_1_id) REFERENCES profiles(user_id)
  ON DELETE CASCADE;

ALTER TABLE conversations
  ADD CONSTRAINT conversations_p2_profiles_fkey
  FOREIGN KEY (participant_2_id) REFERENCES profiles(user_id)
  ON DELETE CASCADE;

-- Rafraichir le cache de schema PostgREST pour que les nouvelles relations soient visibles
NOTIFY pgrst, 'reload schema';
