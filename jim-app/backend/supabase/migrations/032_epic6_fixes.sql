-- Migration 032 : Corrections sécurité Epic 6 (rapport rls-epic6.md)
-- F20 : MESSAGE_RECU absent de la contrainte event_type — corrige défaut fonctionnel bloquant
-- F4  : WITH CHECK tautologique sur messages UPDATE — protéger l'immutabilité du contenu
-- F7  : can_see_contact_info — supprimer le viewer_id arbitraire, utiliser auth.uid()

-- ============================================================
-- F20 : Ajouter MESSAGE_RECU et SIGNALEMENT_MESSAGE à la contrainte
-- ============================================================
ALTER TABLE notification_queue
  DROP CONSTRAINT IF EXISTS notification_event_type_check;

ALTER TABLE notification_queue
  ADD CONSTRAINT notification_event_type_check
  CHECK (event_type IN (
    -- Epic 1
    'RPPS_VERIFIE',
    'RPPS_EN_ATTENTE',
    -- Epic 2
    'ANNONCE_CREEE',
    'ANNONCE_URGENTE',
    'ANNONCE_POURVUE',
    'ANNONCE_NON_CONFIRMEE',
    'ANNONCE_EXPIREE',
    'ANNONCE_FRAICHEUR_J7',
    'ANNONCE_FRAICHEUR_J3',
    -- Epic 3
    'AGGREGATION_ZERO_RESULTS',
    'AGGREGATION_STRUCTURE_CHANGED',
    'AGGREGATION_SOURCE_ERROR',
    -- Epic 5
    'CANDIDATURE_RECUE',
    'CANDIDATURE_ACCEPTEE',
    'CANDIDATURE_REFUSEE',
    'CANDIDATURE_NON_RETENUE',
    'RELANCE_CANDIDATURE_J2',
    'RELANCE_CANDIDATURE_J5',
    'CANDIDATURE_RETIREE',
    -- Epic 6
    'MESSAGE_RECU',
    'SIGNALEMENT_MESSAGE',
    -- Compatibilité ascendante avec les valeurs Epic 1 déjà en base
    'rpps_verified',
    'new_annonce',
    'candidature_accepted'
  ));

-- ============================================================
-- F4 : Trigger BEFORE UPDATE pour protéger l'immutabilité du contenu des messages
-- Remplace le WITH CHECK tautologique de la migration 029
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_message_content_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Seul read_at peut être modifié
  IF NEW.content != OLD.content THEN
    RAISE EXCEPTION 'Le contenu des messages est immutable (RGPD)';
  END IF;
  IF NEW.sender_id != OLD.sender_id THEN
    RAISE EXCEPTION 'Le sender_id est immutable';
  END IF;
  IF NEW.conversation_id != OLD.conversation_id THEN
    RAISE EXCEPTION 'La conversation_id est immutable';
  END IF;
  IF NEW.is_system_message != OLD.is_system_message THEN
    RAISE EXCEPTION 'is_system_message est immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER messages_immutable_content
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION prevent_message_content_update();

-- ============================================================
-- F7 : Remplacer can_see_contact_info par une version sans viewer_id arbitraire
-- La nouvelle version utilise auth.uid() directement
-- ============================================================
DROP FUNCTION IF EXISTS can_see_contact_info(UUID, UUID);

CREATE OR REPLACE FUNCTION can_see_contact_info(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Retourne TRUE si auth.uid() a une conversation avec profile_user_id
  RETURN EXISTS (
    SELECT 1 FROM conversations c
    WHERE (
      (c.participant_1_id = auth.uid() AND c.participant_2_id = profile_user_id)
      OR (c.participant_2_id = auth.uid() AND c.participant_1_id = profile_user_id)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION can_see_contact_info(UUID) TO authenticated;
