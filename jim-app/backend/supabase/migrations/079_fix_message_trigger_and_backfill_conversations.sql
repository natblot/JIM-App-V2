-- Migration 079 : Fix trigger update_conversation_on_message + backfill conversations
--
-- Probleme decouvert au QA 2026-04-16 (Bug 5.A) :
-- La fonction update_conversation_on_message (migration 030) referencait
-- p.full_name dans un split_part — colonne inexistante dans profiles (qui a
-- first_name + last_name separes). Cette erreur bloquait silencieusement TOUT
-- INSERT INTO messages, y compris le message systeme insere par
-- create_conversation_on_accept lors de l'acceptation d'une candidature.
--
-- Symptome observe : aucune conversation ne pouvait etre creee. Tester en SQL
-- (UPDATE candidatures SET statut = 'acceptee') remontait l'erreur :
--   "column p.full_name does not exist"
--
-- Le bug existe depuis Epic 6 (mars 2026) mais n'a jamais bloque la prod
-- car aucun parcours candidature -> conversation reel n'avait ete teste.
--
-- Fix :
-- 1. CREATE OR REPLACE FUNCTION : remplacer p.full_name par p.first_name
--    (la variable v_sender_prenom n'est meme pas utilisee dans le payload —
--    on garde le code "au cas ou" pour preserver l'intention initiale).
-- 2. Backfill : creer la conversation manquante pour la candidature deja
--    acceptee dans le seed (insertion directe statut=acceptee, ne declenche
--    pas le trigger AFTER UPDATE). Idempotent via ON CONFLICT.

-- 1. Fix de la fonction trigger
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_recipient_id UUID;
  v_sender_prenom TEXT;
BEGIN
  -- Mettre a jour la conversation uniquement pour les messages reels (pas systeme)
  IF NOT NEW.is_system_message THEN
    UPDATE conversations SET
      last_message_at = NEW.created_at,
      last_message_preview = LEFT(NEW.content, 50)
    WHERE id = NEW.conversation_id;
  END IF;

  -- Notification MESSAGE_RECU vers l'autre participant
  -- Payload generique : uniquement l'ID de conversation (NFR18)
  -- Fix Bug 5.A : p.first_name au lieu de split_part(p.full_name, ' ', 1)
  SELECT
    CASE
      WHEN c.participant_1_id = NEW.sender_id THEN c.participant_2_id
      ELSE c.participant_1_id
    END,
    p.first_name
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
        -- Intentionnellement pas le contenu (NFR18 zero donnee personnelle)
      ),
      'normal'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Backfill des conversations manquantes pour les candidatures deja acceptees
-- Pattern reproduit du trigger create_conversation_on_accept (migration 030)
-- mais en bulk pour rattraper celles qui ont ete inserees directement statut=acceptee
INSERT INTO conversations (participant_1_id, participant_2_id, annonce_id, candidature_id)
SELECT
  a.profile_id,
  c.remplacant_id,
  c.annonce_id,
  c.id
FROM candidatures c
JOIN annonces a ON a.id = c.annonce_id
WHERE c.statut = 'acceptee'
  AND a.profile_id IS NOT NULL
  AND a.profile_id != c.remplacant_id
  AND NOT EXISTS (
    SELECT 1 FROM conversations conv WHERE conv.candidature_id = c.id
  )
ON CONFLICT (candidature_id) DO NOTHING;

-- Message systeme de bienvenue pour chaque conversation creee par le backfill
INSERT INTO messages (conversation_id, sender_id, content, is_system_message)
SELECT
  conv.id,
  conv.participant_1_id,
  'Remplacement confirme ! Coordonnez les details dans cette conversation.',
  true
FROM conversations conv
WHERE NOT EXISTS (
  SELECT 1 FROM messages m
  WHERE m.conversation_id = conv.id AND m.is_system_message = true
);
