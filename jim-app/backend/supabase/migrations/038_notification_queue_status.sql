-- Migration 038 : Consolidation des colonnes du dispatcher dans notification_queue
-- Epic 7 — Notifications & Calendrier
-- Vérifie et ajoute les colonnes nécessaires au dispatcher (status, retry_count, error_message, channel)
-- Ces colonnes ont pu être partiellement créées dans les migrations 010 et 014

-- Colonne de statut du cycle de vie de la notification
ALTER TABLE notification_queue ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'sent', 'failed', 'skipped'));

-- Compteur de tentatives d'envoi (max 3 avant passage à 'failed')
ALTER TABLE notification_queue ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0;

-- Message d'erreur de la dernière tentative échouée
ALTER TABLE notification_queue ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Canal de livraison : push FCM, email, ou notification groupée
ALTER TABLE notification_queue ADD COLUMN IF NOT EXISTS channel TEXT
  CHECK (channel IN ('push', 'email', 'grouped'));

-- Index pour le dispatcher : notifications pending matures ordonnées par priorité
CREATE INDEX IF NOT EXISTS idx_notification_queue_pending
  ON notification_queue(scheduled_at, status)
  WHERE status = 'pending';
