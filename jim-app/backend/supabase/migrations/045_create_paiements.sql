-- Migration 045 : Table paiements — Epic 9 "Paiement Securise Stripe Connect"
-- Versement de retrocession : titulaire (payeur) → remplacant (beneficiaire)
-- Montants en centimes (INT) pour eviter les erreurs de virgule flottante

CREATE TABLE paiements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations (convention projet : auth.users(id))
  contrat_id UUID NOT NULL REFERENCES contrats(id),
  annonce_id UUID NOT NULL REFERENCES annonces(id),
  titulaire_id UUID NOT NULL REFERENCES auth.users(id),
  remplacant_id UUID NOT NULL REFERENCES auth.users(id),

  -- Montants (en centimes)
  montant_encaisse_cents INT NOT NULL CHECK (montant_encaisse_cents > 0),
  taux_retrocession NUMERIC(5,2) NOT NULL CHECK (taux_retrocession > 0 AND taux_retrocession <= 100),
  montant_retrocession_cents INT NOT NULL CHECK (montant_retrocession_cents > 0),
  part_titulaire_cents INT NOT NULL CHECK (part_titulaire_cents >= 0),
  commission_jim_cents INT NOT NULL DEFAULT 0 CHECK (commission_jim_cents >= 0),
  montant_net_remplacant_cents INT NOT NULL CHECK (montant_net_remplacant_cents > 0),

  -- Source du montant encaisse
  source_montant TEXT NOT NULL DEFAULT 'saisie_manuelle' CHECK (
    source_montant IN ('saisie_manuelle', 'import_csv', 'import_pdf', 'api_directe')
  ),

  -- Stripe (IDs uniquement — jamais de donnees bancaires)
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  stripe_charge_id TEXT,

  -- Statut
  status TEXT NOT NULL DEFAULT 'brouillon' CHECK (
    status IN ('brouillon', 'en_attente_validation', 'conteste', 'en_cours', 'confirme', 'echoue', 'rembourse')
  ),

  -- Type de commission appliquee
  commission_type TEXT NOT NULL DEFAULT 'lancement' CHECK (
    commission_type IN ('lancement', 'gratuit', 'pro')
  ),

  -- Metadonnees
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  contested_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,

  -- Contraintes
  CONSTRAINT paiements_unique_contrat UNIQUE (contrat_id),
  CONSTRAINT paiements_source_ne_destination CHECK (titulaire_id != remplacant_id)
);

-- Index
CREATE INDEX idx_paiements_titulaire ON paiements(titulaire_id, status);
CREATE INDEX idx_paiements_remplacant ON paiements(remplacant_id, status);
CREATE INDEX idx_paiements_stripe ON paiements(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_paiements_contrat ON paiements(contrat_id);

-- Trigger updated_at
CREATE TRIGGER set_paiements_updated_at
  BEFORE UPDATE ON paiements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- RLS : Row Level Security
-- ============================================================
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;

-- SELECT : les deux parties voient leur paiement
CREATE POLICY "paiements_select_parties"
  ON paiements FOR SELECT
  TO authenticated
  USING (titulaire_id = auth.uid() OR remplacant_id = auth.uid());

-- INSERT : le titulaire (payeur) cree le paiement
CREATE POLICY "paiements_insert_titulaire"
  ON paiements FOR INSERT
  TO authenticated
  WITH CHECK (titulaire_id = auth.uid());

-- UPDATE : service_role uniquement (via Edge Functions — webhook, confirmation)
CREATE POLICY "paiements_update_service"
  ON paiements FOR UPDATE
  TO service_role
  USING (true);

-- UPDATE : le remplacant peut contester (status → conteste)
CREATE POLICY "paiements_update_remplacant_contest"
  ON paiements FOR UPDATE
  TO authenticated
  USING (remplacant_id = auth.uid() AND status = 'en_attente_validation')
  WITH CHECK (status = 'conteste');

-- UPDATE : le titulaire peut modifier un brouillon ou ajuster apres litige
CREATE POLICY "paiements_update_titulaire_draft"
  ON paiements FOR UPDATE
  TO authenticated
  USING (titulaire_id = auth.uid() AND status IN ('brouillon', 'conteste'))
  WITH CHECK (status IN ('brouillon', 'en_attente_validation'));

-- Pas de DELETE — archivage permanent (contrainte legale)
