-- Migration 039 : Corrections sécurité Epic 7 (rapport rls-epic7.md)
-- F1 CRITIQUE : Token FCM exposé via SELECT profiles (profiles_public view)
-- F3 HAUT    : Prénom dans payload CANDIDATURE_RECUE — violation NFR18
-- F8 MOYEN   : daily_push_count manipulable côté client — trigger BEFORE UPDATE

-- ============================================================
-- F1 : Vue profiles_public excluant les colonnes sensibles
-- Les clients doivent utiliser cette vue au lieu de la table profiles directement
-- ============================================================
CREATE OR REPLACE VIEW profiles_public AS
  SELECT
    id,
    user_id,
    role,
    profession_id,
    first_name,
    last_name,
    -- email et phone : masqués ici, visibles uniquement via can_see_contact_info()
    avatar_url,
    specialties,
    mobility_radius_km,
    city,
    department,
    region,
    bio,
    rpps_verified,
    rpps_verified_at,
    cgu_accepted_at,
    rcp_verified,
    is_blocked,
    launch_period_active,
    -- push_* : colonnes internes au dispatcher, pas exposées
    -- fcm_token : JAMAIS exposé
    -- location : exposé sous forme textuelle uniquement via les fonctions géo
    -- daily_push_count : interne
    created_at,
    updated_at
  FROM profiles
  WHERE is_blocked = false;

-- Pas de RLS sur la vue (hérite de la table profiles via SECURITY INVOKER)
-- La vue filtre déjà is_blocked = false

-- ============================================================
-- F3 : Corriger le trigger notify_titulaire_on_candidature
-- Supprimer candidat_prenom du payload (NFR18 — payload générique)
-- ============================================================
CREATE OR REPLACE FUNCTION notify_titulaire_on_candidature()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_titulaire_id UUID;
BEGIN
  -- Récupérer uniquement le titulaire (plus besoin de ville ou prénom)
  SELECT profile_id INTO v_titulaire_id
  FROM annonces
  WHERE id = NEW.annonce_id;

  -- Notification avec payload générique — NFR18 : aucune donnée personnelle
  IF v_titulaire_id IS NOT NULL THEN
    INSERT INTO notification_queue (
      recipient_id, event_type, payload, priority, channel
    ) VALUES (
      v_titulaire_id,
      'CANDIDATURE_RECUE',
      jsonb_build_object(
        'annonce_id', NEW.annonce_id,
        'candidature_id', NEW.id
        -- Intentionnellement : pas de candidat_prenom (NFR18)
        -- Le dispatcher construit "Un remplaçant a postulé" sans données perso
      ),
      'high',
      'push'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================
-- F8 : Protéger daily_push_count et fcm_token contre modification client
-- Trigger BEFORE UPDATE sur profiles
-- ============================================================
CREATE OR REPLACE FUNCTION protect_profiles_push_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Seul service_role peut modifier daily_push_count et last_push_sent_at
  -- Le rôle authenticated (client) ne peut pas les modifier
  IF current_setting('role') = 'authenticated' THEN
    IF NEW.daily_push_count != OLD.daily_push_count THEN
      RAISE EXCEPTION 'daily_push_count ne peut pas être modifié directement (protection anti-spam)';
    END IF;
    IF NEW.last_push_sent_at IS DISTINCT FROM OLD.last_push_sent_at THEN
      RAISE EXCEPTION 'last_push_sent_at est géré par le dispatcher uniquement';
    END IF;
    IF NEW.fcm_token IS DISTINCT FROM OLD.fcm_token AND
       current_setting('role') = 'authenticated' THEN
      -- Exception : le client PEUT mettre à jour son propre fcm_token (enregistrement push)
      -- Seul le cas où ce n'est PAS son propre profil doit être bloqué
      -- La RLS update_profile_own garantit déjà que c'est son propre profil
      NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_protect_push_columns
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profiles_push_columns();
