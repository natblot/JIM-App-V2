-- Migration 073 : Rend dispatch_notification_immediate fault-tolerant
-- Epic 7 — Notifications & Calendrier (bugfix)
--
-- PROBLEME: Le trigger notification_immediate_dispatch sur notification_queue
-- echoue quand l'extension pg_net n'est pas installee ('net' schema manquant).
-- Tout INSERT cascading qui genere une notification (ex: INSERT annonces) est
-- alors bloque. Ce bug est apparu pendant le seed E2E paiement 2026-04-11.
--
-- FIX: Wrapper l'appel net.http_post dans un BEGIN/EXCEPTION + detection dynamique
-- de la presence de l'extension via pg_extension. Si pg_net manque, on n'empeche
-- plus les INSERTs metiers. Le batch pg_cron prendra le relais quand il tourne.

CREATE OR REPLACE FUNCTION dispatch_notification_immediate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  net_available BOOLEAN;
BEGIN
  IF NEW.scheduled_at > now() OR NEW.status <> 'pending' THEN
    RETURN NEW;
  END IF;

  -- Detecter la presence de l'extension pg_net (schema 'net')
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
  ) INTO net_available;

  IF NOT net_available THEN
    -- Dispatch batch (pg_cron) prendra le relais
    RETURN NEW;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/dispatch-notifications',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object('notification_id', NEW.id)::text
    );
  EXCEPTION WHEN OTHERS THEN
    -- Ne jamais bloquer l'INSERT metier a cause d'un dispatch notification qui rate
    RAISE WARNING 'dispatch_notification_immediate: http_post a echoue (%): %', SQLSTATE, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION dispatch_notification_immediate IS
  'Trigger immediat des notifications — fault-tolerant : ne bloque jamais un INSERT metier si pg_net indisponible ou endpoint down';
