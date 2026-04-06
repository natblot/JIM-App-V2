-- Migration 063 : Table support_tickets — Epic 12 "Formulaire de Support"
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES auth.users(id),
  categorie TEXT NOT NULL CHECK (categorie IN ('bug', 'question', 'suggestion', 'partenariat')),
  sujet TEXT NOT NULL CHECK (length(sujet) > 0 AND length(sujet) <= 200),
  description TEXT NOT NULL CHECK (length(description) > 0 AND length(description) <= 2000),
  app_version TEXT,
  device_model TEXT,
  os_version TEXT,
  last_screen TEXT,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'ouvert' CHECK (status IN ('ouvert', 'en_cours', 'resolu', 'ferme')),
  reponse TEXT,
  repondu_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_tickets_profile ON support_tickets(profile_id, created_at DESC);
CREATE INDEX idx_support_tickets_status ON support_tickets(status) WHERE status IN ('ouvert', 'en_cours');

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tickets_select_own" ON support_tickets
  FOR SELECT TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "tickets_insert_own" ON support_tickets
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "tickets_select_admin" ON support_tickets
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "tickets_update_admin" ON support_tickets
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "tickets_service_all" ON support_tickets
  FOR ALL TO service_role USING (true) WITH CHECK (true);
