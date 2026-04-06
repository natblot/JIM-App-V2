-- Migration 030 : Triggers messagerie — Epic 6
-- Deux triggers : création automatique de conversation + mise à jour + notification

-- ============================================================
-- Trigger 1 : Créer une conversation quand une candidature passe à 'acceptee'
-- ============================================================
CREATE OR REPLACE FUNCTION create_conversation_on_accept()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_annonce_profile_id UUID;
  v_conv_id UUID;
BEGIN
  -- Déclencher uniquement lors du passage à 'acceptee' (NEW.statut — pas NEW.status)
  IF NEW.statut = 'acceptee' AND OLD.statut != 'acceptee' THEN
    -- Récupérer le titulaire de l'annonce
    -- annonces.profile_id REFERENCES auth.users(id) — c'est bien un auth.users.id
    SELECT profile_id INTO v_annonce_profile_id
    FROM annonces
    WHERE id = NEW.annonce_id;

    -- Créer la conversation
    -- ON CONFLICT DO NOTHING : idempotent si le trigger est appelé plusieurs fois
    INSERT INTO conversations (participant_1_id, participant_2_id, annonce_id, candidature_id)
    VALUES (v_annonce_profile_id, NEW.remplacant_id, NEW.annonce_id, NEW.id)
    ON CONFLICT (candidature_id) DO NOTHING
    RETURNING id INTO v_conv_id;

    -- Traitement uniquement si la conversation vient d'être créée (pas de doublon)
    IF v_conv_id IS NOT NULL THEN
      -- Message système de bienvenue (is_system_message = true, inséré par SECURITY DEFINER)
      INSERT INTO messages (conversation_id, sender_id, content, is_system_message)
      VALUES (
        v_conv_id,
        v_annonce_profile_id,
        'Remplacement confirmé ! Coordonnez les détails dans cette conversation.',
        true
      );

      -- Republier le message d'accompagnement de la candidature s'il existe
      IF NEW.message IS NOT NULL AND length(trim(NEW.message)) > 0 THEN
        INSERT INTO messages (conversation_id, sender_id, content, created_at)
        VALUES (v_conv_id, NEW.remplacant_id, NEW.message, NEW.created_at);
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- AFTER UPDATE pour ne pas interférer avec le BEFORE UPDATE trigger de l'Epic 5 (on_candidature_status_change)
CREATE TRIGGER candidature_accepted_create_conversation
  AFTER UPDATE ON candidatures
  FOR EACH ROW EXECUTE FUNCTION create_conversation_on_accept();

-- ============================================================
-- Trigger 2 : Mettre à jour la conversation et envoyer une notification à chaque nouveau message
-- ============================================================
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recipient_id UUID;
  v_sender_prenom TEXT;
BEGIN
  -- Mettre à jour la conversation uniquement pour les messages réels (pas les messages système)
  IF NOT NEW.is_system_message THEN
    UPDATE conversations SET
      last_message_at = NEW.created_at,
      last_message_preview = LEFT(NEW.content, 50)
    WHERE id = NEW.conversation_id;
  END IF;

  -- Notification MESSAGE_RECU vers l'autre participant
  -- Payload générique : uniquement l'ID de conversation (NFR18 — pas le contenu du message)
  SELECT
    CASE
      WHEN c.participant_1_id = NEW.sender_id THEN c.participant_2_id
      ELSE c.participant_1_id
    END,
    split_part(p.full_name, ' ', 1)
  INTO v_recipient_id, v_sender_prenom
  FROM conversations c
  JOIN profiles p ON p.user_id = NEW.sender_id
  WHERE c.id = NEW.conversation_id;

  IF v_recipient_id IS NOT NULL AND NOT NEW.is_system_message THEN
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES (
      v_recipient_id,
      'MESSAGE_RECU',
      jsonb_build_object(
        'conversation_id', NEW.conversation_id
        -- Intentionnellement : pas le contenu du message (NFR18 — zéro donnée personnelle dans le payload push)
      ),
      'normal'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER message_sent_update_conversation
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- Droits d'exécution pour le rôle authenticated (appelées en SECURITY DEFINER mais visibles)
GRANT EXECUTE ON FUNCTION create_conversation_on_accept() TO authenticated;
GRANT EXECUTE ON FUNCTION update_conversation_on_message() TO authenticated;
