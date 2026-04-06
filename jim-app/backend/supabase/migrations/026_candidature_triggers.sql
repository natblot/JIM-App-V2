-- Migration 026 : Triggers candidatures — Epic 5

-- Trigger 1 : Notification titulaire à la création d'une candidature
CREATE OR REPLACE FUNCTION notify_titulaire_on_candidature()
RETURNS TRIGGER AS $$
DECLARE
  v_titulaire_id UUID;
  v_ville TEXT;
  v_prenom TEXT;
BEGIN
  -- Récupérer le titulaire et la ville de l'annonce
  SELECT a.profile_id, a.ville
  INTO v_titulaire_id, v_ville
  FROM annonces a
  WHERE a.id = NEW.annonce_id;

  -- Récupérer le prénom du remplaçant
  SELECT p.first_name
  INTO v_prenom
  FROM profiles p
  WHERE p.user_id = NEW.remplacant_id;

  -- Insérer la notification
  IF v_titulaire_id IS NOT NULL THEN
    INSERT INTO notification_queue (
      recipient_id, event_type, payload, priority, channel
    ) VALUES (
      v_titulaire_id,
      'CANDIDATURE_RECUE',
      jsonb_build_object(
        'annonce_id', NEW.annonce_id,
        'ville', v_ville,
        'candidat_prenom', COALESCE(v_prenom, 'Un remplaçant')
      ),
      'high',
      'push'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER candidature_created_notify
  AFTER INSERT ON candidatures
  FOR EACH ROW EXECUTE FUNCTION notify_titulaire_on_candidature();

-- Trigger 2 : Statut acceptée/refusée → notification remplaçant + transition annonce
CREATE OR REPLACE FUNCTION on_candidature_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Candidature acceptée
  IF NEW.statut = 'acceptee' AND OLD.statut != 'acceptee' THEN
    -- Notifier le remplaçant
    INSERT INTO notification_queue (
      recipient_id, event_type, payload, priority, channel
    ) VALUES (
      NEW.remplacant_id,
      'CANDIDATURE_ACCEPTEE',
      jsonb_build_object('annonce_id', NEW.annonce_id),
      'high',
      'push'
    );

    -- Passer l'annonce en "en_cours" (NOTE: colonne s'appelle "statut" pas "status")
    UPDATE annonces
    SET statut = 'en_cours', updated_at = now()
    WHERE id = NEW.annonce_id AND statut = 'active';

    -- SET responded_at
    NEW.responded_at := now();
  END IF;

  -- Candidature refusée (par le titulaire)
  IF NEW.statut = 'refusee' AND OLD.statut NOT IN ('refusee', 'refusee_auto') THEN
    INSERT INTO notification_queue (
      recipient_id, event_type, payload, priority, channel
    ) VALUES (
      NEW.remplacant_id,
      'CANDIDATURE_REFUSEE',
      jsonb_build_object('annonce_id', NEW.annonce_id),
      'normal',
      'push'
    );

    NEW.responded_at := now();
  END IF;

  -- Candidature vue par le titulaire
  IF NEW.statut = 'vue' AND OLD.statut = 'en_attente' THEN
    NEW.viewed_at := now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER candidature_status_change
  BEFORE UPDATE ON candidatures
  FOR EACH ROW EXECUTE FUNCTION on_candidature_status_change();

-- pg_cron : expirer les candidatures à J+7 (actions manuelles requises dans le dashboard)
-- Commenter car pg_cron.schedule() peut ne pas être disponible en migration
-- À exécuter manuellement dans le dashboard Supabase SQL Editor :
/*
SELECT cron.schedule(
  'expire-candidatures-j7',
  '0 8 * * *',
  $$
  UPDATE candidatures
  SET statut = 'expiree', updated_at = now()
  WHERE statut = 'en_attente'
    AND created_at < now() - INTERVAL '7 days';
  $$
);
*/
