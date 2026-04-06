-- Migration 047 : Triggers de notification pour les paiements — Epic 9
-- Insere dans notification_queue lors des changements de statut

-- ============================================================
-- Trigger : paiement confirme → notification haute priorite
-- ============================================================
CREATE OR REPLACE FUNCTION on_paiement_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirme' AND OLD.status != 'confirme' THEN
    NEW.paid_at := now();

    -- Notifier le remplacant (beneficiaire) en priorite haute
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES
      (NEW.remplacant_id, 'PAIEMENT_CONFIRME',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'high'),
      (NEW.titulaire_id, 'PAIEMENT_CONFIRME',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'normal');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER paiement_confirmed_notify
  BEFORE UPDATE ON paiements
  FOR EACH ROW EXECUTE FUNCTION on_paiement_confirmed();

-- ============================================================
-- Trigger : paiement initie → notification
-- ============================================================
CREATE OR REPLACE FUNCTION on_paiement_initiated()
RETURNS TRIGGER AS $$
BEGIN
  -- Nouveau paiement en attente de validation → notifier le remplacant
  IF NEW.status = 'en_attente_validation' AND (OLD IS NULL OR OLD.status != 'en_attente_validation') THEN
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES
      (NEW.remplacant_id, 'PAIEMENT_INITIE',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'high');
  END IF;

  -- Paiement conteste → notifier le titulaire
  IF NEW.status = 'conteste' AND OLD.status != 'conteste' THEN
    NEW.contested_at := now();
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES
      (NEW.titulaire_id, 'LITIGE_OUVERT',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'high');
  END IF;

  -- Litige resolu (retour vers en_attente_validation depuis conteste)
  IF OLD.status = 'conteste' AND NEW.status = 'en_attente_validation' THEN
    NEW.resolved_at := now();
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES
      (NEW.remplacant_id, 'LITIGE_RESOLU',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'normal'),
      (NEW.titulaire_id, 'LITIGE_RESOLU',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'normal');
  END IF;

  -- Paiement echoue → notifier les deux parties
  IF NEW.status = 'echoue' AND OLD.status != 'echoue' THEN
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES
      (NEW.titulaire_id, 'PAIEMENT_ECHOUE',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'high'),
      (NEW.remplacant_id, 'PAIEMENT_ECHOUE',
       jsonb_build_object('paiement_id', NEW.id, 'contrat_id', NEW.contrat_id),
       'high');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER paiement_status_change_notify
  BEFORE UPDATE ON paiements
  FOR EACH ROW EXECUTE FUNCTION on_paiement_initiated();

-- Trigger sur INSERT pour notifier lors de la creation en_attente_validation
CREATE TRIGGER paiement_insert_notify
  AFTER INSERT ON paiements
  FOR EACH ROW
  WHEN (NEW.status = 'en_attente_validation')
  EXECUTE FUNCTION on_paiement_initiated();
