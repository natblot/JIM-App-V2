-- Migration 027 : Extension des types de notification pour Epic 5

-- Supprimer l'ancienne contrainte (créée dans migration 019)
ALTER TABLE notification_queue
  DROP CONSTRAINT IF EXISTS notification_event_type_check;

-- Recréer avec les types Epic 5 ajoutés
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
    -- Epic 5
    'CANDIDATURE_RECUE',
    'CANDIDATURE_ACCEPTEE',
    'CANDIDATURE_REFUSEE',
    'CANDIDATURE_NON_RETENUE',
    'RELANCE_CANDIDATURE_J2',
    'RELANCE_CANDIDATURE_J5',
    'CANDIDATURE_RETIREE',
    -- Compatibilité ascendante avec les valeurs Epic 1 déjà en base
    'rpps_verified',
    'new_annonce',
    'candidature_accepted'
  ));
