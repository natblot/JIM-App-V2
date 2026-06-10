-- Migration 080 : table stripe_events pour idempotence des webhooks
-- Stripe peut rejouer un evenement jusqu'a 10 fois — sans deduplication,
-- invoice.payment_succeeded peut renouveler la periode 2x.

CREATE TABLE IF NOT EXISTS stripe_events (
  event_id    TEXT        PRIMARY KEY,
  event_type  TEXT        NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Nettoyage automatique apres 30 jours (les replays Stripe ne depassent pas 3 jours)
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed_at ON stripe_events (processed_at);

-- RLS : inaccessible aux utilisateurs — service_role only
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
-- Aucune policy → acces service_role uniquement (bypass RLS)

COMMENT ON TABLE stripe_events IS
  'Deduplication des webhooks Stripe. Un event_id present = deja traite, ne pas retraiter.';
