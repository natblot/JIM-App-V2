-- Migration 044 : Colonnes Stripe sur profiles pour Epic 9
-- stripe_account_id et rcp_verified existent deja (migration 008)
-- On ajoute stripe_onboarding_status et is_pro

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_onboarding_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (stripe_onboarding_status IN ('not_started', 'in_progress', 'verified', 'action_required'));

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN NOT NULL DEFAULT false;

-- Index pour les requetes sur les comptes Stripe actifs
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account
  ON profiles(stripe_account_id)
  WHERE stripe_account_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_is_pro
  ON profiles(is_pro)
  WHERE is_pro = true;

COMMENT ON COLUMN profiles.stripe_onboarding_status IS 'Statut onboarding Stripe Connect: not_started, in_progress, verified, action_required';
COMMENT ON COLUMN profiles.is_pro IS 'Abonnement Pro actif — 0% commission sur les versements';
