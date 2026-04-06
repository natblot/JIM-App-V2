-- Migration 037 : Trigger de dispatch immédiat pour les notifications
-- Epic 7 — Notifications & Calendrier
-- Déclenche l'Edge Function dispatch-notifications dès l'insertion si scheduled_at <= now()

CREATE OR REPLACE FUNCTION dispatch_notification_immediate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Dispatch immédiat uniquement si la notification est due maintenant
  IF NEW.scheduled_at <= now() AND NEW.status = 'pending' THEN
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/dispatch-notifications',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object('notification_id', NEW.id)::text
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER notification_immediate_dispatch
  AFTER INSERT ON notification_queue
  FOR EACH ROW EXECUTE FUNCTION dispatch_notification_immediate();

COMMENT ON FUNCTION dispatch_notification_immediate IS
  'Trigger immédiat pour les notifications dues. Actions pg_cron manuelles requises dans le dashboard Supabase (voir SPRINT-STATUS.md).';

-- ============================================================
-- ACTIONS MANUELLES REQUISES dans le dashboard Supabase
-- (pg_cron n'est pas accessible dans les migrations standard)
-- ============================================================
--
-- 1. Activer l'extension pg_cron :
--    CREATE EXTENSION IF NOT EXISTS pg_cron;
--
-- 2. Batch toutes les 5 minutes pour les notifications différées :
--    SELECT cron.schedule(
--      'dispatch-notifications-batch',
--      '*/5 * * * *',
--      $$
--        SELECT net.http_post(
--          url := current_setting('app.settings.supabase_url') || '/functions/v1/dispatch-notifications',
--          headers := jsonb_build_object(
--            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
--            'Content-Type', 'application/json'
--          ),
--          body := '{"batch":true}'
--        );
--      $$
--    );
--
-- 3. Reset du compteur daily_push_count chaque nuit à minuit :
--    SELECT cron.schedule(
--      'reset-daily-push-count',
--      '0 0 * * *',
--      $$UPDATE profiles SET daily_push_count = 0$$
--    );
--
-- 4. Alerte calendrier obsolète (J+30) — chaque jour à 8h :
--    SELECT cron.schedule(
--      'calendrier-outdated-alert',
--      '0 8 * * *',
--      $$
--        INSERT INTO notification_queue (recipient_id, event_type, payload, scheduled_at, channel)
--        SELECT
--          p.user_id,
--          'CALENDRIER_OUTDATED',
--          jsonb_build_object('profile_id', p.id),
--          now(),
--          'push'
--        FROM profiles p
--        WHERE p.role = 'remplacant'
--          AND p.rpps_verified = true
--          AND NOT EXISTS (
--            SELECT 1 FROM calendrier c
--            WHERE c.profile_id = p.id
--              AND c.date_fin >= CURRENT_DATE + INTERVAL '30 days'
--          );
--      $$
--    );
-- ============================================================
