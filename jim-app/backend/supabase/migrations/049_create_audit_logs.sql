-- Migration 049 : Table audit_logs — Epic 10 "Conformite RGPD & Securite"
-- Trace les actions critiques — conserve 1 an (NFR19) — immutable cote client

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Qui (SET NULL car le profil peut etre supprime/anonymise)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,

  -- Quoi
  action TEXT NOT NULL,       -- 'auth.login', 'annonce.publish', 'paiement.create', etc.
  resource_type TEXT,         -- 'annonce', 'candidature', 'contrat', 'paiement', 'profile'
  resource_id UUID,

  -- Details (JAMAIS de donnees sensibles : mots de passe, tokens, IBAN, contenu messages)
  details JSONB DEFAULT '{}',

  -- Quand
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requetes admin
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- RLS : PAS de policies pour les utilisateurs normaux
-- Lecture/ecriture via service_role uniquement (Edge Functions + admin dashboard)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_service_insert"
  ON audit_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "audit_logs_service_select"
  ON audit_logs FOR SELECT
  TO service_role
  USING (true);

-- Pas d'UPDATE ni DELETE — les logs sont immutables
