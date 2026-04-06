-- Migration 061 : Table signalements — Epic 12 "Administration & Moderation"
CREATE TABLE signalements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  contenu_type TEXT NOT NULL CHECK (contenu_type IN ('profile', 'annonce', 'message', 'avis')),
  contenu_id UUID NOT NULL,
  categorie TEXT NOT NULL CHECK (
    categorie IN ('faux_profil', 'annonce_frauduleuse', 'comportement_inapproprie', 'contenu_offensant', 'autre')
  ),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'en_attente' CHECK (
    status IN ('en_attente', 'en_cours', 'traite', 'rejete')
  ),
  action_prise TEXT,
  traite_par UUID REFERENCES auth.users(id),
  traite_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT signalements_unique UNIQUE (reporter_id, contenu_type, contenu_id)
);

CREATE INDEX idx_signalements_status ON signalements(status, created_at DESC) WHERE status = 'en_attente';
CREATE INDEX idx_signalements_contenu ON signalements(contenu_type, contenu_id);

ALTER TABLE signalements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "signalements_select_own" ON signalements
  FOR SELECT TO authenticated USING (reporter_id = auth.uid());

CREATE POLICY "signalements_select_admin" ON signalements
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "signalements_insert_own" ON signalements
  FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "signalements_update_admin" ON signalements
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "signalements_service_all" ON signalements
  FOR ALL TO service_role USING (true) WITH CHECK (true);
