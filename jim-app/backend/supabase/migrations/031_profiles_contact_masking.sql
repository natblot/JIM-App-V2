-- Migration 031 : Masquage des coordonnées — Epic 6
-- Fonction pour vérifier les droits de consultation des coordonnées de contact
-- NOTE : Les RLS existantes de `profiles` ne sont PAS modifiées ici (opération sensible — cf. rapport sécurité).
-- Cette fonction est appelée côté serveur (Edge Functions) ou client pour conditionner l'affichage.

-- ============================================================
-- Fonction : vérifier si viewer_id peut voir les coordonnées de profile_user_id
-- Condition : une conversation doit exister entre les deux utilisateurs
-- ============================================================
CREATE OR REPLACE FUNCTION can_see_contact_info(viewer_id UUID, profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversations c
    WHERE (
      (c.participant_1_id = viewer_id AND c.participant_2_id = profile_user_id)
      OR (c.participant_2_id = viewer_id AND c.participant_1_id = profile_user_id)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION can_see_contact_info(UUID, UUID) TO authenticated;

-- ============================================================
-- Rate limiting messages : max 60 messages/minute par utilisateur (anti-spam)
-- Table légère avec purge naturelle par expiration de window_start
-- ============================================================
CREATE TABLE IF NOT EXISTS message_rate_limits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Fenêtre temporelle tronquée à la minute
  window_start TIMESTAMPTZ NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, window_start)
);

-- Fonction appelée avant chaque INSERT de message (depuis l'Edge Function send-message)
-- Retourne TRUE si sous la limite, FALSE si quota dépassé
CREATE OR REPLACE FUNCTION check_message_rate_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  -- Fenêtre glissante à la minute
  v_window := date_trunc('minute', now());

  -- Incrément atomique : INSERT ou UPDATE si la fenêtre existe déjà
  INSERT INTO message_rate_limits (user_id, window_start, message_count)
  VALUES (p_user_id, v_window, 1)
  ON CONFLICT (user_id, window_start) DO UPDATE
    SET message_count = message_rate_limits.message_count + 1
  RETURNING message_count INTO v_count;

  -- Limite : 60 messages par minute par utilisateur
  RETURN v_count <= 60;
END;
$$;

GRANT EXECUTE ON FUNCTION check_message_rate_limit(UUID) TO authenticated;
