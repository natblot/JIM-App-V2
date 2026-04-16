-- Migration 077 : Backfill du JSONB contrats.donnees avec sous-objets titulaire/remplacant
--
-- Probleme decouvert au QA 2026-04-16 :
-- L'Edge Function generate-contrat ecrivait dans donnees.titulaire / donnees.remplacant
-- (avec rpps : SELECT 'rpps' inexistant -> undefined) et le seed inserait une shape
-- plate { taux_retrocession, date_debut, date_fin, ville, adresse } — incompatible
-- avec ce que ContractDetail consomme cote UI (donnees.titulaire.first_name etc.).
-- Resultat : la page /contrat/[id] crashait systematiquement.
--
-- Ce backfill aligne tous les contrats existants sur la shape cible :
--   {
--     titulaire:       { first_name, last_name, rpps },
--     remplacant:      { first_name, last_name, rpps },
--     dates:           { debut, fin },
--     adresse_cabinet,
--     taux_retrocession,
--     template_version: 'v1.0'
--   }
--
-- Idempotent : le WHERE final saute les contrats deja conformes (titulaire + remplacant
-- + sous-cle rpps presents).

UPDATE contrats c
SET donnees = jsonb_build_object(
  'titulaire',
    jsonb_build_object(
      'first_name', pt.first_name,
      'last_name',  pt.last_name,
      'rpps',       pt.rpps_number
    ),
  'remplacant',
    jsonb_build_object(
      'first_name', pr.first_name,
      'last_name',  pr.last_name,
      'rpps',       pr.rpps_number
    ),
  'dates',
    jsonb_build_object(
      'debut', a.date_debut,
      'fin',   a.date_fin
    ),
  'adresse_cabinet',  a.adresse_complete,
  'taux_retrocession', a.retrocession,
  'template_version', 'v1.0'
)
FROM annonces a, profiles pt, profiles pr
WHERE c.annonce_id = a.id
  AND pt.user_id = c.titulaire_id
  AND pr.user_id = c.remplacant_id
  AND (
    NOT (c.donnees ? 'titulaire')
    OR NOT (c.donnees ? 'remplacant')
    OR NOT (c.donnees -> 'titulaire' ? 'rpps')
  );
