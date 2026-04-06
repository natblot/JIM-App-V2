-- Migration 017 : Tables de support pour l'agrégation d'annonces — Epic 3
-- FRs couverts : FR51 (monitoring), FR16 (déduplication audit)

-- Table monitoring des exécutions d'agrégation
CREATE TABLE aggregation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  run_status TEXT NOT NULL CHECK (run_status IN ('success', 'partial', 'failure')),
  annonces_found INTEGER NOT NULL DEFAULT 0,
  annonces_inserted INTEGER NOT NULL DEFAULT 0,
  annonces_updated INTEGER NOT NULL DEFAULT 0,
  annonces_expired INTEGER NOT NULL DEFAULT 0,
  duplicates_skipped INTEGER NOT NULL DEFAULT 0,
  errors JSONB NOT NULL DEFAULT '[]',
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aggregation_runs_source ON aggregation_runs(source, started_at DESC);
CREATE INDEX idx_aggregation_runs_status ON aggregation_runs(run_status, started_at DESC);

ALTER TABLE aggregation_runs ENABLE ROW LEVEL SECURITY;

-- Admin uniquement pour la lecture des runs
CREATE POLICY "aggregation_runs_admin_select" ON aggregation_runs
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Service role pour l'écriture (Edge Functions)
CREATE POLICY "aggregation_runs_service_insert" ON aggregation_runs
  FOR INSERT WITH CHECK (true);

-- Table d'audit pour les fusions et modifications
CREATE TABLE aggregation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('insert', 'update', 'expire', 'merge', 'restore', 'skip')),
  source TEXT NOT NULL,
  annonce_id UUID REFERENCES annonces(id) ON DELETE SET NULL,
  native_annonce_id UUID REFERENCES annonces(id) ON DELETE SET NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aggregation_logs_annonce ON aggregation_logs(annonce_id);
CREATE INDEX idx_aggregation_logs_event ON aggregation_logs(event_type, created_at DESC);
CREATE INDEX idx_aggregation_logs_source ON aggregation_logs(source, created_at DESC);

ALTER TABLE aggregation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aggregation_logs_admin_select" ON aggregation_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "aggregation_logs_service_insert" ON aggregation_logs
  FOR INSERT WITH CHECK (true);
