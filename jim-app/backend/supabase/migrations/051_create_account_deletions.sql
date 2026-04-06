-- Migration 051 : Table account_deletions — Epic 10 "Droit a l'Oubli"
-- Planifie la suppression/anonymisation sous 30 jours avec token d'annulation

CREATE TABLE account_deletions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Planning
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  cancelled_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,

  -- Token d'annulation (envoye par email)
  cancel_token UUID NOT NULL DEFAULT gen_random_uuid(),

  -- Statut
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'cancelled', 'executed')
  ),

  CONSTRAINT account_deletions_unique_pending UNIQUE (user_id)
);

CREATE INDEX idx_account_deletions_scheduled
  ON account_deletions(scheduled_at) WHERE status = 'pending';
CREATE INDEX idx_account_deletions_token
  ON account_deletions(cancel_token) WHERE status = 'pending';

-- RLS
ALTER TABLE account_deletions ENABLE ROW LEVEL SECURITY;

-- L'utilisateur peut voir sa propre demande de suppression
CREATE POLICY "account_deletions_select_own"
  ON account_deletions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- INSERT/UPDATE via service_role (Edge Functions)
CREATE POLICY "account_deletions_service_all"
  ON account_deletions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
