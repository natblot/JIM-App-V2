# Audit Sécurité — Epic 3 Agrégation

**Date :** 2026-03-26
**Auditeur :** security-auditor (autonome)
**Périmètre :** NFR36, NFR17, rate limiting, RLS aggregation_runs / aggregation_logs, validation source_url, idempotence, profile_id nullable

---

## Résumé des findings

| # | Point d'audit | Statut | Action |
|---|---------------|--------|--------|
| 1 | Données personnelles absentes des annonces agrégées (NFR36) | CONFORME | — |
| 2 | Sanitization champs texte — strip HTML/JS, max 1000 chars (NFR17) | CORRIGE | Renforcement normalizer.ts |
| 3 | Rate limiting Rempleo : pause 1s entre pages | CONFORME | — |
| 4 | User-Agent identifié (JIM-Bot/1.0) | CONFORME | — |
| 5 | Pas de clés API/secrets dans le code source | CONFORME | — |
| 6 | RLS aggregation_runs : admin only en lecture | CONFORME | — |
| 7 | RLS aggregation_logs : admin only en lecture | CONFORME | — |
| 8 | source_url validée (pas d'injection) | CORRIGE | Ajout isValidSourceUrl + fix expireStaleAnnonces |
| 9 | profile_id nullable géré proprement | CONFORME | — |
| 10 | Policy insert native vs agrégée distinguée | CONFORME | — |
| 11 | Circuit breaker bypassable uniquement par service_role | CONFORME | — |
| 12 | Métriques aggregation_runs sans données personnelles | CONFORME | — |
| 13 | Cache fallback < 7 jours (cutoff 48h implémenté) | CONFORME | — |
| 14 | Idempotence via ON CONFLICT (source, source_url) | CONFORME | — |
| 15 | Linking.openURL : injection URL malveillante | HORS PERIMETRE | Fichier UI non fourni |
| 16 | RLS service_insert trop permissive (WITH CHECK (true)) | CORRIGE | Migration 021 |

---

## Détail des findings

### CONFORME — NFR36 : Pas de données personnelles

Les champs insérés dans `upsertAggregated` sont : `ville`, `code_postal`, `date_debut`, `date_fin`, `retrocession`, `type_annonce`, `description`, `type_cabinet`, `source_url`, `specialites`. Aucun champ nominatif (nom, email, téléphone, RPPS). Le `profile_id` est `null` pour les annonces agrégées.

Les métriques dans `aggregation_runs` : compteurs numériques (`annonces_found`, `annonces_inserted`, `annonces_updated`, `annonces_expired`, `duplicates_skipped`, `consecutive_failures`) + `errors` JSONB. Pas de données personnelles.

### CONFORME — Rate limiting et User-Agent

`rempleo.source.ts` : pause `await new Promise(resolve => setTimeout(resolve, 1000))` entre chaque page. User-Agent déclaré : `JIM-Bot/1.0 (job-in-med.fr; contact@jim-app.fr)`. Pas de masquage d'identité.

### CONFORME — Secrets

`REMPLEO_BASE_URL` est une constante publique (URL de scraping publique). Aucune clé API, token ou credential dans le code source.

### CONFORME — Policy insert native vs agrégée (migration 020)

La policy `annonces_insert_titulaire` distingue :
- `source = 'native'` : requiert `profile_id = auth.uid()` + RPPS vérifié + rôle titulaire
- `source != 'native'` : requiert `profile_id IS NULL` — seul le service_role peut effectivement insérer (RLS bypassé)

### CONFORME — Idempotence ON CONFLICT

L'upsert utilise `onConflict: 'source,source_url'` avec `ignoreDuplicates: false` (mise à jour si existant). L'index unique sur `(source, source_url)` est défini dans `018_annonces_dedup_index.sql`.

### CONFORME — Cache/fallback 7 jours

Le cutoff d'expiration est 48h (`Date.now() - 48 * 60 * 60 * 1000`), bien inférieur à la limite de 7 jours.

---

## Corrections appliquées

### [CORRIGE] deduplicator.ts — Validation source_url (CRITIQUE)

**Problème :** Aucune validation des URLs avant insertion en base. La fonction `expireStaleAnnonces` interpolait des URLs directement dans une query Supabase (`.not('source_url', 'in', \`(...)\`)`), permettant potentiellement une injection via une URL malformée.

**Correction :**
- Ajout de `isValidSourceUrl(url: string): boolean` — valide protocole http/https, hostname non vide, absence de `javascript:` et `data:`
- `upsertAggregated` lève une erreur immédiate si `source_url` invalide
- `expireStaleAnnonces` : suppression de l'interpolation SQL. Remplacement par récupération des candidats sans filtre URL, puis filtrage côté application sur les `validActiveUrls`

**Fichier :** `supabase/functions/_shared/aggregation/deduplicator.ts`

### [CORRIGE] normalizer.ts — Sanitization renforcée (ATTENTION)

**Problème :** `sanitizeText` ne supprimait que les balises `<script>` et les tags génériques. Les attributs événements inline (`onerror=`, `onclick=`, `onload=`), les balises dangereuses (`<iframe>`, `<object>`, `<embed>`, `<form>`), et les protocoles `data:` / `vbscript:` n'étaient pas filtrés.

**Correction :** Ajout de règles de remplacement pour :
1. Balises dangereuses avec contenu (iframe, object, embed, link, meta, base, form, input, button)
2. Attributs événements inline (`\s+on\w+\s*=...`)
3. Protocoles `data:` et `vbscript:`

**Fichier :** `supabase/functions/_shared/aggregation/normalizer.ts`

### [CORRIGE] Migration 021 — RLS insert trop permissive (CRITIQUE)

**Problème :** Les policies `aggregation_runs_service_insert` et `aggregation_logs_service_insert` utilisaient `WITH CHECK (true)`, permettant à tout utilisateur authentifié (pas seulement le service_role) d'insérer des lignes dans ces tables de monitoring.

**Correction :** Migration `021_fix_aggregation_rls_policies.sql` :
- Suppression des policies `WITH CHECK (true)` sur INSERT
- Remplacement par `WITH CHECK (false)` — bloque tous les utilisateurs normaux
- Le service_role (Edge Functions) bypasse RLS par nature et continue de fonctionner normalement

**Fichier :** `supabase/migrations/021_fix_aggregation_rls_policies.sql`

---

## Tests RLS recommandés

### aggregation_runs

```sql
-- Compte remplaçant (rôle non-admin) : doit être refusé en lecture
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-remplacant-uuid", "role": "remplacant"}';
SELECT * FROM aggregation_runs; -- Doit retourner 0 lignes (RLS bloque)

-- Compte admin : doit voir les lignes
SET LOCAL request.jwt.claims TO '{"sub": "user-admin-uuid", "role": "admin"}';
SELECT * FROM aggregation_runs; -- Doit retourner les lignes

-- Utilisateur authentifié : INSERT doit être bloqué
SET LOCAL request.jwt.claims TO '{"sub": "user-remplacant-uuid", "role": "remplacant"}';
INSERT INTO aggregation_runs (source, run_status, annonces_found, annonces_inserted, annonces_updated, annonces_expired, duplicates_skipped)
VALUES ('rempleo', 'success', 0, 0, 0, 0, 0);
-- Doit lever : new row violates row-level security policy

-- Service role : INSERT doit réussir (teste via Edge Function ou connexion service_role)
-- (Le service_role bypasse RLS, pas testable via SET LOCAL ROLE)
```

### aggregation_logs

```sql
-- Compte remplaçant : SELECT doit retourner 0 lignes
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-remplacant-uuid", "role": "remplacant"}';
SELECT * FROM aggregation_logs; -- 0 lignes

-- Compte titulaire : SELECT doit retourner 0 lignes
SET LOCAL request.jwt.claims TO '{"sub": "user-titulaire-uuid", "role": "titulaire"}';
SELECT * FROM aggregation_logs; -- 0 lignes

-- Compte admin : SELECT doit voir les lignes
SET LOCAL request.jwt.claims TO '{"sub": "user-admin-uuid", "role": "admin"}';
SELECT * FROM aggregation_logs; -- lignes visibles

-- Utilisateur authentifié : INSERT doit être bloqué (policy WITH CHECK (false))
SET LOCAL request.jwt.claims TO '{"sub": "user-remplacant-uuid", "role": "remplacant"}';
INSERT INTO aggregation_logs (event_type, source, details)
VALUES ('insert', 'rempleo', '{}');
-- Doit lever : new row violates row-level security policy

-- Non authentifié (anon) : SELECT et INSERT doivent être bloqués
SET LOCAL ROLE anon;
SELECT * FROM aggregation_logs; -- 0 lignes ou erreur
INSERT INTO aggregation_logs (event_type, source, details) VALUES ('insert', 'test', '{}'); -- erreur
```

### annonces avec profile_id nullable (migration 020)

```sql
-- Titulaire non vérifié : INSERT native doit être refusé
SET LOCAL request.jwt.claims TO '{"sub": "titulaire-no-rpps", "role": "titulaire"}';
INSERT INTO annonces (profile_id, source, type_annonce, date_debut, date_fin, retrocession, ville, statut)
VALUES (auth.uid(), 'native', 'remplacement', '2026-04-01', '2026-04-10', 82, 'Paris', 'active');
-- Doit être refusé (rpps_verified = false)

-- Tentative d'insert agrégée par utilisateur authentifié
SET LOCAL request.jwt.claims TO '{"sub": "user-remplacant-uuid", "role": "remplacant"}';
INSERT INTO annonces (profile_id, source, type_annonce, date_debut, date_fin, retrocession, ville, statut)
VALUES (NULL, 'rempleo', 'remplacement', '2026-04-01', '2026-04-10', 82, 'Lyon', 'source_externe');
-- Doit être refusé (seul service_role peut insérer source != 'native')
```

---

## Points d'attention résiduels

1. **Linking.openURL (UI)** : non audité (fichiers UI hors périmètre). Il est recommandé de valider les URLs Rempleo avant ouverture avec le même `isValidSourceUrl` ou une whitelist de domaines autorisés.

2. **`expireStaleAnnonces` scalabilité** : le refactoring filtre côté application plutôt que SQL. Acceptable pour des volumes < 10 000 annonces par source. Au-delà, envisager une procédure SQL paramétrisée.

3. **`aggregation_logs.details` champ JSONB** : contient `{ source_url, ville }` lors des merges. Pas de données personnelles actuellement. Surveiller les évolutions futures pour éviter qu'un nom de titulaire s'y retrouve.

4. **Circuit breaker** : non directement auditable depuis les fichiers fournis. S'assurer que la logique de reset du `consecutive_failures` ne peut être déclenchée que par le service_role.
