# Audit Sécurité — Epic 7 Notifications & Calendrier

**Date :** 2026-03-26
**Auditeur :** security-auditor (autonome)
**Statut global :** CORRECTIONS REQUISES (8 findings, dont 1 critique, 3 hauts, 3 moyens, 1 info)
**Périmètre :** Token FCM (migration 033), table calendrier (034), fonction match_remplacants (035), types notification Epic 7 (036), trigger dispatch (037), consolidation queue (038), Edge Function dispatch-notifications, adaptateur FCM, trigger candidatures (026)

---

## Résumé exécutif

L'architecture de l'Epic 7 est globalement solide sur les points critiques : la fonction `match_remplacants_for_annonce` est correctement restreinte au `service_role`, les RLS de la table `calendrier` isolent bien les données par profil, et l'adaptateur FCM ne transmet aucune donnée personnelle dans les payloads réseau vers Firebase.

Deux points nécessitent une correction avant mise en production :

1. **CRITIQUE (F1)** — Le token FCM (`profiles.fcm_token`) est exposé dans tous les `SELECT * FROM profiles` émis par les utilisateurs authentifiés. La policy `profiles_select_verified_public` n'exclut pas les colonnes sensibles ajoutées en migration 033 (`fcm_token`, `location`, `push_*`, `daily_push_count`). Tout utilisateur authentifié peut récupérer le token FCM d'un autre utilisateur vérifié.

2. **HAUT (F3)** — Le payload de la notification `CANDIDATURE_RECUE` (trigger 026) inclut `candidat_prenom` en clair dans `notification_queue.payload`. Ce prénom est ensuite potentiellement inclus dans le payload FCM envoyé au titulaire, violant NFR18 ("zéro donnée personnelle dans les push").

3. **HAUT (F6) — RÉSOLU (2026-05-10)** — Le token FCM statique (`FCM_ACCESS_TOKEN`) est désormais remplacé par un flux OAuth2 service account avec rotation automatique (`_shared/fcm/access-token.ts`, secret `FCM_SERVICE_ACCOUNT_B64`). Cf. F6 ci-dessous pour le détail de la correction.

Les corrections des Epics précédents (F4, F7, F20 de Epic 6) ont bien été intégrées dans les migrations 032 et confirment la bonne gestion du cycle d'audit.

---

## Tableau des findings

| # | Point d'audit | Statut | Sévérité | Action |
|---|--------------|--------|----------|--------|
| F1 | Token FCM exposé via SELECT profiles (RLS column-level) | À CORRIGER | CRITIQUE | Avant prod |
| F2 | RLS calendrier — isolation SELECT/INSERT/UPDATE/DELETE par profil | CONFORME | — | Aucune |
| F3 | Payload CANDIDATURE_RECUE — prénom remplaçant dans notification_queue | À CORRIGER | HAUT | Avant prod |
| F4 | match_remplacants — GRANT EXECUTE TO service_role uniquement | CONFORME | — | Aucune |
| F5 | match_remplacants — pas de fuite de candidatures concurrentes | CONFORME | — | Aucune |
| F6 | Token FCM statique — risque d'expiration silencieuse | RÉSOLU (2026-05-10) | HAUT | Migration vers OAuth2 service account (`_shared/fcm/access-token.ts`) |
| F7 | Trigger dispatch_notification_immediate — déclenchable manuellement | À VÉRIFIER | HAUT | Voir détail |
| F8 | daily_push_count — reset pg_cron non migré, manipulable côté client | ATTENTION | MOYEN | Avant prod |
| F9 | Payload FCM — ANNONCE_CREEE contient date_debut/date_fin (non personnel) | CONFORME | — | Aucune |
| F10 | Payload FCM — MESSAGE_RECU (trigger 030) — contenu absent du payload | CONFORME | — | Aucune |
| F11 | Payload FCM — CANDIDATURE_ACCEPTEE — pas de coordonnées | CONFORME | — | Aucune |
| F12 | RLS calendrier DELETE — bloque suppression type='remplacement' | CONFORME | — | Aucune |
| F13 | Préférences push modifiables uniquement par l'utilisateur (UPDATE profiles RLS) | CONFORME | — | Aucune |
| F14 | Relances automatiques pg_cron — pas de révélation de candidatures concurrentes | CONFORME | — | Aucune |
| F15 | Token FCM invalide (UNREGISTERED) — nettoyage dans fcm.adapter.ts | CONFORME | — | Aucune |
| F16 | Rate limiting dispatcher — protection boucle trigger | ATTENTION | MOYEN | Post-MVP |
| F17 | pg_cron reset daily_push_count — fuseau horaire UTC non spécifié | MOYEN | MOYEN | Post-MVP |
| F18 | Deep link dans notifications — RLS protège au niveau data | CONFORME | — | Aucune |
| F19 | Email digest — compteur uniquement, pas de liste de candidatures | NON IMPLÉMENTÉ | INFO | Post-MVP |

---

## Détail des findings CRITIQUE / HAUT

---

### F1 — CRITIQUE : Token FCM exposé via les RLS SELECT publics sur `profiles`

**Source :** `supabase/migrations/011_rls_policies.sql` (policy `profiles_select_verified_public`) + `supabase/migrations/033_profiles_push_fcm.sql`

**Description :**

La migration 033 ajoute les colonnes suivantes à la table `profiles` :
- `fcm_token TEXT`
- `location GEOGRAPHY(Point, 4326)`
- `push_annonces`, `push_candidatures`, `push_messages BOOLEAN`
- `push_paused BOOLEAN`
- `email_digest_enabled BOOLEAN`
- `last_push_sent_at TIMESTAMPTZ`
- `daily_push_count INT`

La policy `profiles_select_verified_public` (migration 011) autorise tout utilisateur authentifié à faire `SELECT * FROM profiles WHERE rpps_verified = true AND is_blocked = false`. Il n'existe aucune restriction au niveau des colonnes dans cette policy. PostgreSQL ne supporte pas nativement la column-level security dans les policies RLS — le `USING` filtre les lignes, pas les colonnes.

**Vecteur d'attaque :**

```sql
-- N'importe quel utilisateur authentifié peut exécuter :
SELECT id, fcm_token, push_paused, daily_push_count
FROM profiles
WHERE rpps_verified = true;
-- → Retourne les tokens FCM de tous les remplaçants vérifiés
```

Un attaquant authentifié récupère les tokens FCM de praticiens cibles et peut :
1. Tenter de les utiliser directement via l'API FCM (nécessite la clé de service Firebase, mais la liste de tokens constitue déjà un actif de valeur pour du ciblage externe).
2. Observer `daily_push_count` et `last_push_sent_at` pour inférer l'activité d'un concurrent.
3. Observer `push_paused` pour savoir si un praticien est en vacances.

La policy `profiles_select_own` (même migration) permet à l'utilisateur de voir son propre profil complet, ce qui est correct. Le problème concerne uniquement la policy publique.

**Correction recommandée :**

Créer une vue `profiles_public` qui exclut les colonnes sensibles, et orienter toutes les requêtes client vers cette vue plutôt que la table directe :

```sql
-- Migration 039 (recommandée)
CREATE VIEW profiles_public AS
SELECT
  id,
  user_id,
  first_name,
  last_name,
  role,
  rpps_verified,
  rpps_number,
  profession_id,
  bio,
  avatar_url,
  mobility_radius_km,
  is_blocked,
  created_at,
  updated_at
  -- Colonnes exclues : fcm_token, location, push_*, email_digest_enabled,
  --                    last_push_sent_at, daily_push_count, email, phone
FROM profiles
WHERE rpps_verified = true AND is_blocked = false;

GRANT SELECT ON profiles_public TO authenticated;
```

Alternativement, si la vue n'est pas adoptable à court terme, révoquer le SELECT direct sur `profiles` pour le rôle `authenticated` et créer une fonction `SECURITY DEFINER` qui retourne uniquement les colonnes autorisées.

**Note :** La colonne `location` (géographie) mérite une attention particulière : elle révèle l'adresse exacte du cabinet du praticien, information sensible dans le contexte médical français.

---

### F3 — HAUT : Payload CANDIDATURE_RECUE — prénom du remplaçant inclus dans notification_queue

**Source :** `supabase/migrations/026_candidature_triggers.sql` lignes 26-37

**Description :**

Le trigger `notify_titulaire_on_candidature()` insère dans `notification_queue` le payload suivant :

```sql
jsonb_build_object(
  'annonce_id', NEW.annonce_id,
  'ville', v_ville,
  'candidat_prenom', COALESCE(v_prenom, 'Un remplaçant')  -- ← donnée personnelle
)
```

La colonne `candidat_prenom` est le prénom réel du remplaçant (`profiles.first_name`). Ce payload est stocké en clair dans `notification_queue` et sera transmis au dispatcher qui devra décider si ce prénom est inclus dans le titre/corps de la push FCM.

NFR18 stipule : "payload FCM générique uniquement, zéro donnée personnelle". Le prénom est une donnée personnelle au sens du RGPD.

**Risques :**
1. Si le dispatcher inclut `candidat_prenom` dans le `body` de la push FCM, le prénom apparaît dans les notifications système Android/iOS, potentiellement visible sur l'écran verrouillé.
2. La donnée est stockée durablement dans `notification_queue` avec l'identité du remplaçant liée à l'`annonce_id`, créant une corrélation traçable.

**Note sur le dispatcher :** L'absence du fichier `notification.service.ts` dans `_shared/` empêche de vérifier si le prénom est effectivement transmis à FCM. Ce point doit être vérifié lors de la création de ce service.

**Correction recommandée :**

Remplacer le payload personnalisé par un payload générique, en accord avec NFR18 :

```sql
jsonb_build_object(
  'annonce_id', NEW.annonce_id,
  'candidature_id', NEW.id
  -- Le client recharge les données via l'API après réception de la push
)
```

Le titre et corps de la push FCM côté dispatcher devront être : `"Nouvelle candidature"` / `"Un remplaçant a postulé à votre annonce"` — sans prénom. L'identité du candidat est accessible via le deep link (après vérification RLS) depuis l'application.

---

### F6 — HAUT : Token FCM statique — risque d'expiration silencieuse — RÉSOLU (2026-05-10)

**Source :** `supabase/functions/_shared/fcm.adapter.ts` (avant correction : lignes 65-71)

**Description initiale :**

La fonction `getFirebaseAccessToken()` lisait un token statique depuis `FCM_ACCESS_TOKEN` en variable d'environnement, durée de vie ~1h, sans rotation automatique. Toutes les notifications push cessaient silencieusement à expiration.

**Correction appliquée (2026-05-10) :**

Implémentation du flux OAuth2 service account dans `_shared/fcm/access-token.ts` :

- Le service account Firebase JSON est stocké en base64 dans le secret `FCM_SERVICE_ACCOUNT_B64`.
- À chaque appel, `getFcmAccessToken()` retourne un access token mis en cache au niveau du module et rafraîchi 5 minutes avant expiration via signature JWT RS256 (Web Crypto API) + token exchange Google OAuth2.
- Le `project_id` est lu directement depuis le service account (plus de secret `FCM_PROJECT_ID` séparé).
- Aucune dépendance externe : signature JWT via `crypto.subtle.sign` natif Deno.
- Aucun log du JWT ni du payload service account (NFR sécurité CLAUDE.md).

Migration secrets Supabase :

```bash
# 1. Encoder le service account JSON Firebase
cat jim-firebase-adminsdk-xxxxx.json | base64 | tr -d '\n' | pbcopy

# 2. Set le nouveau secret
supabase secrets set FCM_SERVICE_ACCOUNT_B64=<contenu-collé> --workdir backend/supabase

# 3. Supprimer les anciens secrets
supabase secrets unset FCM_ACCESS_TOKEN --workdir backend/supabase
supabase secrets unset FCM_PROJECT_ID --workdir backend/supabase
```

---

### F7 — HAUT : Trigger dispatch_notification_immediate — déclenchable par insertion dans notification_queue

**Source :** `supabase/migrations/037_dispatch_trigger.sql`

**Description :**

Le trigger `notification_immediate_dispatch` se déclenche `AFTER INSERT ON notification_queue`. La policy d'insertion sur `notification_queue` est `notification_queue_insert_service` restreinte au `service_role`. Cela signifie qu'un utilisateur authentifié normal ne peut pas directement insérer dans `notification_queue` et donc ne peut pas déclencher le trigger manuellement.

Ce point est **conforme** pour les utilisateurs normaux. Cependant, un vecteur résiduel existe :

Si une vulnérabilité dans une politique UPDATE (par exemple sur `candidatures`) permettait à un utilisateur d'insérer indirectement dans `notification_queue` via un trigger de base de données mal configuré, le trigger de dispatch serait automatiquement déclenché. Ce risque est théorique mais mérite d'être documenté.

**Point à vérifier :** Confirmer qu'aucune policy `INSERT` sur `notification_queue` n'est accessible au rôle `authenticated`, y compris via des triggers en chaîne.

**Action :** Exécuter la requête de vérification suivante sur la base :

```sql
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'notification_queue'
ORDER BY cmd;
-- Vérifier qu'aucune policy INSERT ne liste 'authenticated'
```

---

## Findings de sévérité MOYEN

---

### F8 — MOYEN : daily_push_count — reset pg_cron non appliqué automatiquement, manipulation côté client

**Source :** `supabase/migrations/037_dispatch_trigger.sql` lignes 58-63 (commentaire) + `supabase/migrations/011_rls_policies.sql`

**Description :**

Le reset du compteur `daily_push_count` est documenté dans un commentaire de migration 037 comme action manuelle requise dans le dashboard Supabase :

```sql
-- SELECT cron.schedule('reset-daily-push-count', '0 0 * * *',
--   $$UPDATE profiles SET daily_push_count = 0$$);
```

Deux problèmes :

1. **Non-application garantie :** Si l'opérateur ne configure pas ce job pg_cron, le compteur ne se remet jamais à zéro. Après 3 pushs, un utilisateur ne reçoit plus jamais de notification, sans qu'il y ait d'alerte.

2. **Manipulation côté client possible :** La policy `profiles_update_own` autorise un utilisateur à mettre à jour son propre profil sans restriction sur les colonnes. Un utilisateur peut donc réinitialiser lui-même son `daily_push_count` :

```sql
UPDATE profiles SET daily_push_count = 0 WHERE user_id = auth.uid();
-- → Contourne la limite de 3 push/jour
```

**Correction recommandée :**

a) Ajouter un trigger BEFORE UPDATE qui empêche la modification de `daily_push_count` et `last_push_sent_at` par le rôle `authenticated` (uniquement modifiables par `service_role`).

b) Documenter le job pg_cron comme prérequis de déploiement dans `SPRINT-STATUS.md` avec vérification post-déploiement.

---

### F16 — MOYEN : Rate limiting du dispatcher — protection contre une boucle de triggers

**Source :** `supabase/migrations/037_dispatch_trigger.sql`

**Description :**

Le trigger `notification_immediate_dispatch` appelle `net.http_post()` vers l'Edge Function `dispatch-notifications` à chaque INSERT dans `notification_queue`. Si le dispatcher lui-même insère dans `notification_queue` (par exemple pour des notifications groupées `NOTIFICATION_GROUPED` ou pour des relances), cela pourrait créer une boucle infinie.

La migration 038 crée un index `idx_notification_queue_pending` mais aucun mécanisme ne protège contre une boucle trigger → dispatcher → INSERT → trigger.

**À vérifier lors de la création de `notification.service.ts` :** S'assurer que le dispatcher ne fait jamais d'INSERT direct dans `notification_queue` sans passer par une logique de déduplication ou de flag anti-boucle (ex. : colonne `source TEXT` indiquant l'origine de l'insertion, ou CHECK sur `status = 'pending'` uniquement).

---

### F17 — MOYEN : pg_cron reset daily_push_count — fuseau horaire non spécifié

**Source :** `supabase/migrations/037_dispatch_trigger.sql` ligne 62

**Description :**

Le job pg_cron proposé pour le reset du compteur utilise la crontab `'0 0 * * *'`. pg_cron s'exécute en UTC par défaut. Pour des médecins français (UTC+1 en hiver, UTC+2 en été), minuit UTC correspond à 1h ou 2h du matin.

Ce n'est pas un problème de sécurité mais un risque UX : un praticien qui reçoit 3 pushs à 23h30 heure locale devra attendre 1h30 à 2h avant le reset. Pour le domaine médical, ce délai est acceptable.

**Action :** Documenter explicitement dans le commentaire que le reset est en UTC, ou ajuster à `'0 23 * * *'` pour un reset à minuit heure française (en hiver).

---

## Points conformes

Les points suivants ne nécessitent aucune action avant la mise en production :

**F2 — RLS calendrier — isolation totale :** Les quatre policies (`select_calendrier_own`, `insert_calendrier_own`, `update_calendrier_own`, `delete_calendrier_own`) utilisent la sous-requête `(SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)` avec `LIMIT 1` pour éviter des résultats multiples. Un utilisateur A ne peut pas lire, modifier ou supprimer les entrées calendrier d'un utilisateur B. L'isolation est correcte.

**F4 — match_remplacants : GRANT restreint au service_role :** La ligne `GRANT EXECUTE ON FUNCTION match_remplacants_for_annonce(UUID) TO service_role` est correctement positionnée. La fonction n'est pas accessible au rôle `authenticated`. Un utilisateur client ne peut pas l'appeler directement via le SDK Supabase. La fonction est `SECURITY DEFINER` avec `SET search_path = public`, ce qui respecte les bonnes pratiques.

**F5 — match_remplacants : pas de fuite de candidatures concurrentes :** Le filtre `NOT EXISTS (SELECT 1 FROM candidatures WHERE annonce_id = p_annonce_id AND remplacant_id = p.user_id)` exclut uniquement les remplaçants ayant déjà candidaté, sans révéler combien d'autres ont candidaté ni leur identité. La fonction retourne uniquement `profile_id`, `user_id`, `fcm_token`, `push_annonces`, `distance_meters` — destinés exclusivement au dispatcher (service_role).

**F9 — Payload ANNONCE_CREEE :** Le trigger `queue_annonce_creee_notification()` (migration 015) inclut `annonce_id`, `ville`, `date_debut`, `date_fin`, `is_urgent` dans le payload. La ville et les dates ne sont pas des données personnelles (elles sont publiques dans l'annonce). Conforme à NFR18.

**F10 — Payload MESSAGE_RECU :** Le trigger `update_conversation_on_message()` (migration 030, validé en Epic 6) insère uniquement `conversation_id` dans le payload, sans contenu de message. Conforme à NFR18.

**F11 — Payload CANDIDATURE_ACCEPTEE :** Le trigger `on_candidature_status_change()` (migration 026) insère uniquement `annonce_id` dans le payload pour `CANDIDATURE_ACCEPTEE` et `CANDIDATURE_REFUSEE`. Pas de coordonnées, pas de nom de titulaire. Conforme à NFR18.

**F12 — RLS calendrier DELETE bloque type='remplacement' :** La policy `delete_calendrier_own` ajoute explicitement `AND type != 'remplacement'`. Un remplaçant ne peut pas supprimer une entrée calendrier liée à un remplacement confirmé, ce qui protège l'intégrité des données contractuelles. Correct.

**F13 — Préférences push modifiables uniquement par l'utilisateur :** La policy `profiles_update_own` permet la modification de `push_annonces`, `push_candidatures`, `push_messages`, `push_paused` uniquement par `user_id = auth.uid()`. Un tiers ne peut pas désactiver les préférences d'un autre utilisateur. Correct. (Voir F8 pour le cas de `daily_push_count`.)

**F14 — Relances pg_cron (candidatures J+2, J+5) :** Les jobs de relance insèrent dans `notification_queue` avec uniquement `candidature_id` en payload (migration 027). Ils ne révèlent pas le nombre de candidatures concurrentes ni l'identité des autres candidats. Conforme.

**F15 — Nettoyage token FCM invalide (UNREGISTERED) :** L'adaptateur FCM (`fcm.adapter.ts`) retourne `false` quand FCM répond `UNREGISTERED`. Le service appelant doit alors mettre à jour `profiles.fcm_token = NULL`. Ce mécanisme est correctement architecturé. À vérifier dans `notification.service.ts` que la mise à jour `fcm_token = NULL` est bien appelée quand `sendFcmPush` retourne `false`.

**F18 — Deep link et accès aux données :** Les deep links dans les notifications (ex. : `/annonce/{id}`, `/candidature/{id}`) permettent de naviguer vers une ressource. L'accès réel aux données est toujours contrôlé par les RLS côté serveur. Un deep link forgé ou intercepté ne permet pas d'accéder à des données non autorisées : la requête Supabase retournera une erreur RLS. Conforme.

---

## Finding INFO

### F19 — INFO : Email digest — non implémenté

**Statut :** NON IMPLÉMENTÉ

La colonne `email_digest_enabled BOOLEAN DEFAULT false` est créée en migration 033. La fonctionnalité d'email digest quotidien n'est pas encore implémentée (Edge Function, template email, job pg_cron d'envoi). Conformément à la spécification, elle est désactivée par défaut pour le MVP.

**Action post-MVP :** L'email digest ne devra contenir qu'un compteur agrégé ("3 nouvelles candidatures", "2 nouveaux messages") — sans liste nominative ni contenu de message. Prévoir un audit de sécurité spécifique lors de l'implémentation.

---

## Synthèse des corrections avant mise en production

| Priorité | Finding | Action concrète | Migration |
|----------|---------|----------------|-----------|
| 1 — CRITIQUE | F1 — fcm_token exposé | Créer vue `profiles_public` excluant fcm_token, location, push_*, daily_push_count | 039 |
| 2 — HAUT | F3 — prénom dans CANDIDATURE_RECUE | Retirer `candidat_prenom` du payload trigger 026, remplacer par message générique | 040 |
| 3 — HAUT | F8 — daily_push_count manipulable | Trigger BEFORE UPDATE sur profiles bloquant modification de daily_push_count par authenticated | 040 |
| 4 — HAUT | F6 — token FCM statique | OAuth2 service account avec cache + rotation auto | RÉSOLU 2026-05-10 (`_shared/fcm/access-token.ts`) |
| 5 — HAUT | F7 — INSERT notification_queue | Vérifier absence de policy INSERT authenticated sur notification_queue | Vérification DB |

---

## Recommandations post-MVP (Phase 2 / Phase 3)

| Priorité | Recommandation | Justification |
|----------|---------------|---------------|
| ~~Phase 2~~ RÉSOLU 2026-05-10 | OAuth2 service account pour FCM (`FCM_SERVICE_ACCOUNT_B64`) | Implémenté dans `_shared/fcm/access-token.ts` — rotation automatique avec cache module-level |
| Phase 2 | Vue `profiles_public` ou column-level security sur profiles | Protège fcm_token, location, push_*, daily_push_count de l'exposition publique |
| Phase 2 | Trigger BEFORE UPDATE sur profiles — colonnes système immuables | Empêcher la manipulation de daily_push_count, last_push_sent_at, rpps_verified côté client |
| Phase 2 | Monitoring des erreurs FCM et alerte opérationnelle | Détecter l'expiration du token, les pics d'erreurs UNREGISTERED, les boucles de dispatch |
| Phase 2 | Rate limiting sur l'Edge Function dispatch-notifications | Éviter une cascade de requêtes si le trigger fire trop fréquemment (ex. : insertion batch en rafale) |
| Phase 2 | Purge automatique des entrées notification_queue anciennes (> 30 jours) | La table grossit indéfiniment — job pg_cron de nettoyage |
| Phase 2 | Validation pg_cron des jobs manuels au déploiement | Créer un script de vérification post-déploiement qui confirme les jobs pg_cron (dispatch batch, reset compteur, alerte calendrier) |
| Phase 3 | Chiffrement E2EE des tokens FCM au repos (`pgcrypto`) | Protection supplémentaire en cas de dump de base, au-delà du chiffrement volume AWS RDS |
| Phase 3 | Email digest — audit sécurité dédié | Vérifier que le contenu ne révèle pas de données personnelles de tiers (remplaçants candidats, expéditeurs de messages) |
| Phase 3 | Analyse géographique des tokens FCM par appareil | Détecter l'utilisation d'un token depuis une localisation anormale (compromission de compte) |
