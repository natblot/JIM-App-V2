-- Migration 059 : Fonctions reputation — Epic 11
-- Score de fiabilite, triggers avis, triggers proposition, generation code parrainage

-- ============================================================
-- Fonction : recalculer le score de fiabilite
-- Formule : 60% note + 20% volume (plafonne /20) + 20% anciennete (plafonne /24 mois)
-- ============================================================
CREATE OR REPLACE FUNCTION update_score_fiabilite(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_note_moyenne NUMERIC;
  v_nb_avis INT;
  v_nb_remplacements INT;
  v_anciennete_mois INT;
  v_score NUMERIC;
BEGIN
  SELECT AVG(note), COUNT(*) INTO v_note_moyenne, v_nb_avis
  FROM avis WHERE destinataire_id = p_user_id;

  SELECT nb_remplacements INTO v_nb_remplacements
  FROM profiles WHERE user_id = p_user_id;

  SELECT EXTRACT(MONTH FROM AGE(now(), created_at))::INT INTO v_anciennete_mois
  FROM profiles WHERE user_id = p_user_id;

  IF v_nb_avis >= 3 THEN
    v_score := (v_note_moyenne / 5.0) * 0.6
             + LEAST(v_nb_remplacements / 20.0, 1.0) * 0.2
             + LEAST(COALESCE(v_anciennete_mois, 0) / 24.0, 1.0) * 0.2;
    v_score := ROUND(v_score * 5, 1);
  ELSE
    v_score := NULL;
  END IF;

  UPDATE profiles SET
    note_moyenne = v_note_moyenne,
    nb_avis = v_nb_avis,
    score_fiabilite = v_score
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Trigger : avis cree → recalculer le score du destinataire
-- ============================================================
CREATE OR REPLACE FUNCTION on_avis_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_score_fiabilite(NEW.destinataire_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER avis_created_update_score
  AFTER INSERT ON avis
  FOR EACH ROW EXECUTE FUNCTION on_avis_created();

-- ============================================================
-- Trigger : proposition directe acceptee → notifier
-- ============================================================
CREATE OR REPLACE FUNCTION on_proposition_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'acceptee' AND OLD.status = 'envoyee' THEN
    NEW.responded_at := now();
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES
      (NEW.titulaire_id, 'PROPOSITION_ACCEPTEE',
       jsonb_build_object('proposition_id', NEW.id, 'remplacant_id', NEW.remplacant_id),
       'high'),
      (NEW.remplacant_id, 'PROPOSITION_ACCEPTEE',
       jsonb_build_object('proposition_id', NEW.id, 'titulaire_id', NEW.titulaire_id),
       'high');
  END IF;

  IF NEW.status = 'declinee' AND OLD.status = 'envoyee' THEN
    NEW.responded_at := now();
    INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
    VALUES (NEW.titulaire_id, 'PROPOSITION_DECLINEE',
            jsonb_build_object('proposition_id', NEW.id),
            'normal');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER proposition_status_change
  BEFORE UPDATE ON propositions_directes
  FOR EACH ROW EXECUTE FUNCTION on_proposition_status_change();

-- Trigger INSERT : notifier le remplacant quand une proposition est envoyee
CREATE OR REPLACE FUNCTION on_proposition_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_queue (recipient_id, event_type, payload, priority)
  VALUES (NEW.remplacant_id, 'PROPOSITION_ENVOYEE',
          jsonb_build_object('proposition_id', NEW.id, 'titulaire_id', NEW.titulaire_id,
                             'date_debut', NEW.date_debut, 'date_fin', NEW.date_fin,
                             'retrocession', NEW.retrocession),
          'high');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER proposition_created_notify
  AFTER INSERT ON propositions_directes
  FOR EACH ROW EXECUTE FUNCTION on_proposition_created();

-- ============================================================
-- Fonction : generer un code parrainage unique
-- ============================================================
CREATE OR REPLACE FUNCTION generate_parrainage_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_prenom TEXT;
  v_code TEXT;
BEGIN
  SELECT UPPER(LEFT(first_name, 3)) INTO v_prenom
  FROM profiles WHERE user_id = p_user_id;

  v_prenom := COALESCE(v_prenom, 'JIM');

  v_code := v_prenom || '-JIM-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

  WHILE EXISTS (SELECT 1 FROM profiles WHERE parrainage_code = v_code) LOOP
    v_code := v_prenom || '-JIM-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END LOOP;

  UPDATE profiles SET parrainage_code = v_code WHERE user_id = p_user_id;
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
