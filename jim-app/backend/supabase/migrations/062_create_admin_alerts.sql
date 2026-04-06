-- Migration 062 : Table admin_alerts — Epic 12 "Alertes Automatisations"
CREATE TABLE admin_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'P3' CHECK (priority IN ('P1', 'P2', 'P3')),
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_alerts_priority ON admin_alerts(priority, status, created_at DESC);

-- Pas de RLS utilisateur — service_role only
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_alerts_service_all" ON admin_alerts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "admin_alerts_select_admin" ON admin_alerts
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "admin_alerts_update_admin" ON admin_alerts
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');
