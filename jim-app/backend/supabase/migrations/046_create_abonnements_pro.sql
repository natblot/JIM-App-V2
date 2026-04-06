-- Migration 046 : Table abonnements_pro — Epic 9 "Abonnement Pro"
-- Titulaire souscrit pour 0% commission (5,90 EUR/mois via Stripe Billing)

CREATE TABLE abonnements_pro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Convention projet : auth.users(id)
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  stripe_subscription_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'cancelled', 'past_due', 'unpaid')
  ),

  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT abonnements_unique_profile UNIQUE (profile_id)
);

CREATE INDEX idx_abonnements_stripe ON abonnements_pro(stripe_subscription_id);
CREATE INDEX idx_abonnements_status ON abonnements_pro(status) WHERE status = 'active';

-- Trigger updated_at
CREATE TRIGGER set_abonnements_pro_updated_at
  BEFORE UPDATE ON abonnements_pro
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE abonnements_pro ENABLE ROW LEVEL SECURITY;

-- SELECT : chaque utilisateur voit son propre abonnement
CREATE POLICY "abonnements_select_own"
  ON abonnements_pro FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- INSERT/UPDATE via Edge Functions (service_role) uniquement
CREATE POLICY "abonnements_insert_service"
  ON abonnements_pro FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "abonnements_update_service"
  ON abonnements_pro FOR UPDATE
  TO service_role
  USING (true);
