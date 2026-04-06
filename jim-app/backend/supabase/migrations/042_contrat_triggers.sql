-- Migration 042 : Triggers sur la table contrats — Epic 8
-- Trigger AFTER UPDATE : gestion des changements de statut
-- - brouillon → en_attente_remplacant : notifie le remplaçant (CONTRAT_EN_ATTENTE)
-- - * → confirme : met à jour annonces.statut + notifie les deux parties (CONTRAT_CONFIRME)

CREATE OR REPLACE FUNCTION on_contrat_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Cas 1 : double confirmation — statut passe à 'confirme'
  -- Met à jour l'annonce en 'pourvue' et notifie les deux parties
  IF OLD.statut != 'confirme' AND NEW.statut = 'confirme' THEN
    -- IMPORTANT : colonne s'appelle 'statut' (pas 'status') — convention annonces
    UPDATE annonces
    SET statut = 'pourvue'
    WHERE id = NEW.annonce_id;

    -- Notifier le titulaire
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority, channel)
    VALUES (
      NEW.titulaire_id,
      'CONTRAT_CONFIRME',
      jsonb_build_object('contrat_id', NEW.id, 'annonce_id', NEW.annonce_id),
      'high',
      'push'
    );

    -- Notifier le remplaçant
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority, channel)
    VALUES (
      NEW.remplacant_id,
      'CONTRAT_CONFIRME',
      jsonb_build_object('contrat_id', NEW.id, 'annonce_id', NEW.annonce_id),
      'high',
      'push'
    );
  END IF;

  -- Cas 2 : titulaire confirme sa partie → notifier le remplaçant pour action requise
  IF OLD.statut = 'brouillon' AND NEW.statut = 'en_attente_remplacant' THEN
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority, channel)
    VALUES (
      NEW.remplacant_id,
      'CONTRAT_EN_ATTENTE',
      jsonb_build_object('contrat_id', NEW.id, 'annonce_id', NEW.annonce_id),
      'high',
      'push'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- AFTER UPDATE : ne pas interférer avec d'éventuels triggers BEFORE UPDATE
CREATE TRIGGER contrats_on_confirmed
  AFTER UPDATE ON contrats
  FOR EACH ROW EXECUTE FUNCTION on_contrat_confirmed();

-- Droits d'exécution
GRANT EXECUTE ON FUNCTION on_contrat_confirmed() TO authenticated;
