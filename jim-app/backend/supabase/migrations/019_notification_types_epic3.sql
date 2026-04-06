-- Migration 019 : Ajout des types de notification Epic 3

-- Supprimer l'ancienne contrainte
ALTER TABLE notification_queue
  DROP CONSTRAINT IF EXISTS notification_event_type_check;

-- Recréer avec les types Epic 3 ajoutés
-- Note : on conserve les valeurs legacy snake_case pour la compatibilité ascendante (Epic 1)
ALTER TABLE notification_queue
  ADD CONSTRAINT notification_event_type_check
  CHECK (event_type IN (
    -- Epic 1
    'RPPS_VERIFIE',
    'RPPS_EN_ATTENTE',
    -- Epic 2
    'ANNONCE_CREEE',
    'ANNONCE_URGENTE',
    'ANNONCE_POURVUE',
    'ANNONCE_NON_CONFIRMEE',
    'ANNONCE_EXPIREE',
    'ANNONCE_FRAICHEUR_J7',
    'ANNONCE_FRAICHEUR_J3',
    -- Epic 3
    'AGGREGATION_ZERO_RESULTS',
    'AGGREGATION_STRUCTURE_CHANGED',
    'AGGREGATION_SOURCE_ERROR',
    -- Epic 5 (placeholders)
    'CANDIDATURE_RECUE',
    'CANDIDATURE_ACCEPTEE',
    'CANDIDATURE_REFUSEE',
    -- Compatibilité ascendante avec les valeurs Epic 1 déjà en base
    'rpps_verified',
    'new_annonce',
    'candidature_accepted'
  ));
