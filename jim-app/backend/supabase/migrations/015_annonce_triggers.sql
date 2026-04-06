-- Migration 015 : Triggers métier pour les annonces — Epic 2

-- Trigger 1 : Notifier les candidats quand une annonce passe en 'pourvue'
-- (La table candidatures n'existe pas encore en Epic 2, ce trigger sera activé en Epic 5)
-- On crée la fonction maintenant pour préparer Epic 5

CREATE OR REPLACE FUNCTION notify_candidates_on_annonce_close()
RETURNS TRIGGER AS $$
BEGIN
  -- Seulement quand le statut passe à 'pourvue'
  IF NEW.statut = 'pourvue' AND OLD.statut != 'pourvue' THEN
    -- Insérer dans notification_queue pour tous les candidats en attente
    -- (La table candidatures sera créée en Epic 5 — ce trigger sera complété alors)
    -- Pour l'instant, on log juste le changement
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER annonce_status_changed_notify
  AFTER UPDATE OF statut ON annonces
  FOR EACH ROW EXECUTE FUNCTION notify_candidates_on_annonce_close();

-- Trigger 2 : Insérer notification ANNONCE_CREEE dans la queue après création
CREATE OR REPLACE FUNCTION queue_annonce_creee_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer un placeholder — Epic 7 dispatche les notifications réelles
  -- Pour l'instant on insère pour le propriétaire (confirmations futures)
  INSERT INTO notification_queue (
    recipient_id,
    event_type,
    payload,
    channel,
    priority,
    scheduled_at
  ) VALUES (
    NEW.profile_id,
    CASE WHEN NEW.is_urgent THEN 'ANNONCE_URGENTE' ELSE 'ANNONCE_CREEE' END,
    jsonb_build_object(
      'annonce_id', NEW.id,
      'ville', NEW.ville,
      'date_debut', NEW.date_debut,
      'date_fin', NEW.date_fin,
      'is_urgent', NEW.is_urgent
    ),
    'in_app',
    CASE WHEN NEW.is_urgent THEN 'high' ELSE 'normal' END,
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mise à jour de la contrainte channel pour inclure 'in_app'
ALTER TABLE notification_queue
  DROP CONSTRAINT IF EXISTS notification_queue_channel_check;

ALTER TABLE notification_queue
  ADD CONSTRAINT notification_queue_channel_check
  CHECK (channel IN ('push', 'email', 'both', 'in_app'));

CREATE TRIGGER annonce_created_queue_notification
  AFTER INSERT ON annonces
  FOR EACH ROW EXECUTE FUNCTION queue_annonce_creee_notification();

-- Vue utilitaire : annonces nécessitant une relance fraîcheur
CREATE OR REPLACE VIEW annonces_freshness_due AS
  SELECT id, profile_id, ville, date_fin, freshness_reminder_count, statut
  FROM annonces
  WHERE statut = 'active'
    AND date_fin >= CURRENT_DATE  -- pas encore expirée
    AND (
      -- Relance J-7 : pas encore envoyée et dans la fenêtre
      (freshness_reminder_j7_at IS NULL AND date_fin - CURRENT_DATE <= 7)
      OR
      -- Relance J-3 : J-7 envoyée mais pas J-3
      (freshness_reminder_j7_at IS NOT NULL AND freshness_reminder_j3_at IS NULL AND date_fin - CURRENT_DATE <= 3)
    );

-- Fonction : passer les annonces en 'non_confirmee' quand J-3 sans réponse
CREATE OR REPLACE FUNCTION process_annonce_freshness()
RETURNS void AS $$
BEGIN
  -- Passer en non_confirmée les annonces à J-3 sans réponse fraîcheur
  UPDATE annonces
  SET statut = 'non_confirmee'
  WHERE statut = 'active'
    AND freshness_reminder_j3_at IS NOT NULL
    AND date_fin - CURRENT_DATE <= 3
    AND freshness_reminder_count >= 2;

  -- Expirer les annonces dont la date_fin est passée
  UPDATE annonces
  SET statut = 'expiree',
      archived_at = now()
  WHERE statut IN ('active', 'non_confirmee', 'en_cours')
    AND date_fin < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
