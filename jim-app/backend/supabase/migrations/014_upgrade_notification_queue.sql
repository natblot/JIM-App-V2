-- Migration 014 : Amélioration notification_queue pour Epic 2
-- La table existe depuis migration 010 — on l'étend sans la recréer
-- Colonnes actuelles : id, user_id, type, payload, scheduled_at, sent_at, status, channel, created_at

-- Renommer user_id → recipient_id pour cohérence avec le schéma Supabase
ALTER TABLE notification_queue RENAME COLUMN user_id TO recipient_id;

-- Renommer type → event_type (éviter le mot-clé réservé)
ALTER TABLE notification_queue RENAME COLUMN type TO event_type;

-- Ajouter les colonnes manquantes
ALTER TABLE notification_queue
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high')),
  ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Ajouter la contrainte sur event_type (types d'événements Epic 2)
-- Note: les types seront étendus aux Epics suivants
ALTER TABLE notification_queue
  ADD CONSTRAINT notification_event_type_check
  CHECK (event_type IN (
    -- Epic 2
    'ANNONCE_CREEE',
    'ANNONCE_URGENTE',
    'ANNONCE_POURVUE',
    'ANNONCE_NON_CONFIRMEE',
    'ANNONCE_EXPIREE',
    'ANNONCE_FRAICHEUR_J7',
    'ANNONCE_FRAICHEUR_J3',
    -- Epic 1 (existants — anciens types snake_case migrés vers SCREAMING_SNAKE)
    'RPPS_VERIFIE',
    'RPPS_EN_ATTENTE',
    -- Compatibilité ascendante avec les valeurs Epic 1 déjà en base
    'rpps_verified',
    'new_annonce',
    'candidature_accepted'
  ));

-- Index optimisé pour le dispatcher (Epic 7)
CREATE INDEX IF NOT EXISTS idx_notification_queue_pending_scheduled
  ON notification_queue(scheduled_at, priority)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_notification_queue_recipient
  ON notification_queue(recipient_id);

-- Mettre à jour la RLS : les utilisateurs ne lisent que leurs propres notifications
-- Supprimer l'ancienne policy (créée avec user_id dans migration 010)
DROP POLICY IF EXISTS "notification_queue_select_own" ON notification_queue;
DROP POLICY IF EXISTS "Utilisateur voit ses propres notifications" ON notification_queue;

CREATE POLICY "notification_queue_select_own" ON notification_queue
  FOR SELECT USING (recipient_id = auth.uid());

-- L'insertion reste réservée au service_role (via Edge Functions)
DROP POLICY IF EXISTS "notification_queue_insert_service" ON notification_queue;

CREATE POLICY "notification_queue_insert_service"
  ON notification_queue FOR INSERT TO service_role
  WITH CHECK (true);
