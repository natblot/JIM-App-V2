# Tests RLS — Epic 10 : Conformite RGPD & Securite

## Table `audit_logs`

- [x] Utilisateur authentifie ne peut PAS SELECT audit_logs (pas de policy)
- [x] Utilisateur authentifie ne peut PAS INSERT audit_logs
- [x] service_role peut INSERT et SELECT
- [x] Personne ne peut UPDATE ni DELETE (immutable)

## Table `rate_limits`

- [x] Utilisateur authentifie ne peut PAS acceder a rate_limits
- [x] service_role peut ALL (INSERT, SELECT, UPDATE, DELETE)

## Table `account_deletions`

- [x] User A voit sa propre demande de suppression (pending)
- [x] User B ne voit PAS la demande de User A
- [x] Les utilisateurs ne peuvent PAS INSERT directement (service_role)
- [x] Les utilisateurs ne peuvent PAS UPDATE directement (service_role)

## Table `config_mots_sensibles`

- [x] Tout utilisateur authentifie peut SELECT les mots actifs
- [x] Les utilisateurs ne peuvent PAS INSERT/UPDATE/DELETE
- [x] service_role peut tout (admin)

## Securite export RGPD

- [x] L'export ne contient QUE les donnees de l'utilisateur demandeur
- [x] L'export ne contient PAS de donnees bancaires (IBAN, carte)
- [x] Le lien de telechargement est signe et expire apres 48h
- [x] Rate limiting : 1 export/jour/utilisateur

## Securite suppression

- [x] La suppression est une anonymisation, pas un DELETE physique
- [x] Les FK restent intactes (SET NULL ou anonymisation)
- [x] Les transactions Stripe sont conservees 6 ans
- [x] Le token d'annulation est un UUID non-devinable
- [x] Le delai de 30 jours est respecte

## Securite rate limiting

- [x] Les headers X-RateLimit-* sont presents dans les reponses
- [x] Le rate limiting fonctionne par user ET par IP
- [x] Les fenetres expirees sont nettoyees automatiquement

## Securite audit logs

- [x] Les logs ne contiennent JAMAIS de mots de passe, tokens, IBAN
- [x] Les logs ne contiennent JAMAIS le contenu des messages
- [x] pg_cron supprime les logs > 1 an
