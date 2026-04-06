-- Migration 018 : Index de déduplication sur la table annonces — Epic 3
-- Empêche les doublons agrégés via une contrainte unique conditionnelle

-- Déduplication : même source + même source_url = même annonce
CREATE UNIQUE INDEX idx_annonces_source_url_dedup
  ON annonces(source, source_url)
  WHERE source != 'native' AND source_url IS NOT NULL;

-- Index pour la correspondance native ↔ agrégée (fusion FR20)
-- Utilisé par le deduplicator pour trouver les annonces natives correspondantes
CREATE INDEX idx_annonces_dedup_match
  ON annonces(ville, date_debut, date_fin)
  WHERE statut NOT IN ('expiree', 'pourvue');

-- Priorisation des annonces natives dans les requêtes
-- Index partiel pour les requêtes publiques triées par source
CREATE INDEX idx_annonces_source_priority
  ON annonces(source, created_at DESC)
  WHERE statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe');
