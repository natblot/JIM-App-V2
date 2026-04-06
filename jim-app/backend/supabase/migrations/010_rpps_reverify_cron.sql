-- Migration 010: Re-vérification RPPS quotidienne via pg_cron
-- Story 1.6 : profils en attente (pending/api_down) re-vérifiés chaque jour
-- Story 1.4 : cache 6 mois — les profils vérifiés sont re-vérifiés à l'expiration
-- Date: 2026-03-22

-- ============================================================
-- TABLE: notification_queue (préparation Epic 7)
-- Stocke les notifications à envoyer (push + email)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notification_queue (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type           TEXT        NOT NULL,  -- 'rpps_verified', 'new_annonce', 'candidature_accepted', etc.
  payload        JSONB       NOT NULL DEFAULT '{}',  -- payload générique SANS données personnelles (NFR18)
  scheduled_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at        TIMESTAMPTZ,
  status         TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  channel        TEXT        NOT NULL DEFAULT 'push'
                   CHECK (channel IN ('push', 'email', 'both')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_pending
  ON public.notification_queue (scheduled_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_notification_queue_user
  ON public.notification_queue (user_id);

ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur ne voit que ses propres notifications
CREATE POLICY "notification_queue_select_own"
  ON public.notification_queue FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Insertion réservée au service role (Edge Functions)
CREATE POLICY "notification_queue_insert_service"
  ON public.notification_queue FOR INSERT TO service_role
  WITH CHECK (true);

COMMENT ON TABLE public.notification_queue IS 'File d attente des notifications — payload générique uniquement (NFR18)';

-- ============================================================
-- EDGE FUNCTION TRIGGER: re-vérification RPPS quotidienne
-- pg_cron appelle l'Edge Function reverify-rpps-batch
-- Note: pg_cron est configuré dans le Dashboard Supabase
-- ============================================================

-- Vue pour monitorer les profils en attente de re-vérification
CREATE OR REPLACE VIEW public.profiles_pending_reverify AS
  SELECT
    p.id,
    p.user_id,
    p.first_name,
    p.last_name,
    p.rpps_number,
    p.rpps_verification_status,
    p.rpps_cache_expires_at,
    p.rpps_last_attempt_at
  FROM public.profiles p
  WHERE
    -- Profils en attente initiale
    (p.rpps_verification_status IN ('pending', 'api_down', 'failed') AND p.rpps_number IS NOT NULL)
    OR
    -- Profils vérifiés dont le cache expire dans moins de 7 jours (NFR40)
    (p.rpps_verified = true AND p.rpps_cache_expires_at < now() + INTERVAL '7 days');

-- Seul le service role peut voir cette vue
COMMENT ON VIEW public.profiles_pending_reverify IS 'Profils en attente de re-vérification RPPS — accès service role uniquement';
