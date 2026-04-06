-- Migration 034 : Création de la table calendrier (disponibilités des remplaçants)
-- Epic 7 — Notifications & Calendrier

CREATE TABLE calendrier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Référence profiles.id (pas auth.users.id) — les remplaçants ont un profil distinct
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL CHECK (date_fin >= date_debut),
  -- Type de période : disponible, indisponible, ou remplacement confirmé
  type TEXT NOT NULL DEFAULT 'disponible' CHECK (type IN ('disponible', 'indisponible', 'remplacement')),
  -- Lien vers la candidature acceptée (uniquement pour type = 'remplacement')
  candidature_id UUID REFERENCES candidatures(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index principal pour les requêtes par profil et période
CREATE INDEX idx_calendrier_profile ON calendrier(profile_id, date_debut, date_fin);

-- Index pour le matching des disponibilités (filtrage par dates)
CREATE INDEX idx_calendrier_disponible ON calendrier(date_debut, date_fin) WHERE type = 'disponible';

ALTER TABLE calendrier ENABLE ROW LEVEL SECURITY;

-- RLS : profile_id est l'id de la table profiles, pas auth.uid() directement
-- On résout via profiles.user_id = auth.uid()

CREATE POLICY select_calendrier_own ON calendrier
  FOR SELECT USING (
    profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY insert_calendrier_own ON calendrier
  FOR INSERT WITH CHECK (
    profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY update_calendrier_own ON calendrier
  FOR UPDATE USING (
    profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  );

-- Les remplacements confirmés ne peuvent pas être supprimés par le client
CREATE POLICY delete_calendrier_own ON calendrier
  FOR DELETE USING (
    profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
    AND type != 'remplacement'
  );

-- Trigger de mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION update_calendrier_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER calendrier_updated_at
  BEFORE UPDATE ON calendrier
  FOR EACH ROW EXECUTE FUNCTION update_calendrier_updated_at();
