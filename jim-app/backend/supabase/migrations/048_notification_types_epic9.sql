-- Migration 048 : Extension des types de notification pour Epic 9
-- Ajoute PAIEMENT_INITIE, PAIEMENT_CONFIRME, PAIEMENT_ECHOUE, LITIGE_OUVERT, LITIGE_RESOLU, LITIGE_ESCALADE
-- Preserve TOUTES les valeurs existantes (migrations 014 + 019 + 027 + 036 + 041)

ALTER TABLE notification_queue
  DROP CONSTRAINT IF EXISTS notification_event_type_check;

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
    -- Epic 6
    'MESSAGE_RECU',
    'SIGNALEMENT_MESSAGE',
    -- Epic 7
    'CALENDRIER_OUTDATED',
    'POST_REMPLACEMENT_NOTATION',
    'NOTIFICATION_GROUPED',
    -- Epic 8
    'CONTRAT_EN_ATTENTE',
    'CONTRAT_CONFIRME',
    -- Epic 9 — Paiement Securise
    'PAIEMENT_INITIE',
    'PAIEMENT_CONFIRME',
    'PAIEMENT_ECHOUE',
    'LITIGE_OUVERT',
    'LITIGE_RESOLU',
    'LITIGE_ESCALADE',
    -- Compatibilite ascendante
    'rpps_verified',
    'new_annonce',
    'candidature_accepted'
  ));
