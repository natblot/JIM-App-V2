-- Migration 065 : Triggers alertes admin — Epic 12
-- P1 → push immediat a Nathan, P2 → digest quotidien

-- Trigger : alerte P1 → notification push immediate a Nathan
CREATE OR REPLACE FUNCTION on_alert_p1_created()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  IF NEW.priority = 'P1' THEN
    SELECT user_id INTO v_admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
    IF v_admin_id IS NOT NULL THEN
      INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
      VALUES (v_admin_id, 'ALERTE_ADMIN_P1',
              jsonb_build_object('type', NEW.type, 'source', NEW.source, 'message', NEW.message),
              'high');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER alert_p1_push
  AFTER INSERT ON admin_alerts
  FOR EACH ROW EXECUTE FUNCTION on_alert_p1_created();

-- Trigger : signalement cree → alerte P2 admin
CREATE OR REPLACE FUNCTION on_signalement_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_alerts (type, source, priority, message, details)
  VALUES ('signalement', 'user_report', 'P2',
          'Nouveau signalement : ' || NEW.categorie,
          jsonb_build_object('signalement_id', NEW.id, 'contenu_type', NEW.contenu_type, 'categorie', NEW.categorie));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER signalement_created_alert
  AFTER INSERT ON signalements
  FOR EACH ROW EXECUTE FUNCTION on_signalement_created();

-- Trigger : ticket support → alerte P3
CREATE OR REPLACE FUNCTION on_ticket_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_alerts (type, source, priority, message, details)
  VALUES ('support_ticket', 'user_support', 'P3',
          'Nouveau ticket : ' || NEW.sujet,
          jsonb_build_object('ticket_id', NEW.id, 'categorie', NEW.categorie));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ticket_created_alert
  AFTER INSERT ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION on_ticket_created();
