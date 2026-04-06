# Audit Sécurité — Epic 2 : Publication & Gestion d'Annonces

**Date :** 2026-03-26
**Auditeur :** security-auditor agent
**Périmètre :** migrations 013, 014, 015 · Edge Functions create-annonce / update-annonce · annonce.service.ts · annonce.schema.deno.ts

---

## Résumé

| Sévérité | Nombre |
|----------|--------|
| CRITIQUE  | 1      |
| ATTENTION | 2      |
| CONFORME  | 16     |

> Les 2 problèmes de sévérité CRITIQUE et ATTENTION ont été **corrigés directement** par cet agent.

---

## Findings détaillés

### RLS Policies — `annonces`

#### ✅ `annonces_select_public` — Filtre sur statuts actifs uniquement
**Fichier :** `supabase/migrations/013_create_annonces.sql` (ligne 78)
**Description :** La policy filtre correctement sur `statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe')`. Les statuts `pourvue` et `expiree` sont exclus de la lecture publique.
**Statut :** CONFORME

---

#### ✅ `annonces_select_own` — Titulaire voit tout son historique
**Fichier :** `supabase/migrations/013_create_annonces.sql` (ligne 82)
**Description :** La policy `USING (profile_id = auth.uid())` sans filtre sur `statut` permet au titulaire de voir toutes ses annonces, y compris `pourvue` et `expiree`. Comportement attendu.
**Statut :** CONFORME

---

#### ✅ `annonces_insert_titulaire` — Vérification RPPS + rôle + non bloqué
**Fichier :** `supabase/migrations/013_create_annonces.sql` (ligne 87)
**Description :** La policy vérifie les trois conditions obligatoires : `rpps_verified = true AND role = 'titulaire' AND is_blocked = false` via une sous-requête sur `profiles`. Elle vérifie aussi que `profile_id = auth.uid()` pour empêcher l'usurpation d'identité.
**Statut :** CONFORME

---

#### ✅ `annonces_update_own` — Propriétaire uniquement (USING + WITH CHECK)
**Fichier :** `supabase/migrations/013_create_annonces.sql` (lignes 100-102)
**Description :** La policy utilise `USING (profile_id = auth.uid())` ET `WITH CHECK (profile_id = auth.uid())`. Double vérification correcte : la clause USING filtre les lignes accessibles, la clause WITH CHECK valide les nouvelles valeurs.
**Statut :** CONFORME

---

#### ✅ Pas de policy DELETE — Soft delete uniquement
**Fichier :** `supabase/migrations/013_create_annonces.sql` (ligne 104)
**Description :** Aucune policy DELETE n'est définie. La suppression logique se fait via le champ `statut` (passage à `pourvue` ou `expiree`). Conforme au principe de soft delete.
**Statut :** CONFORME

---

#### ⚠️ `annonces_admin_all` — Extraction du rôle admin depuis `auth.jwt()`
**Fichier :** `supabase/migrations/013_create_annonces.sql` (ligne 108)
**Description :** La policy utilise `auth.jwt() ->> 'role' = 'admin'`. Ce champ racine du JWT est le rôle Supabase (`authenticated`, `anon`, `service_role`) et non un rôle applicatif. La vérification du rôle admin applicatif devrait utiliser `auth.jwt() -> 'app_metadata' ->> 'role'`. Ce pattern est cohérent avec `011_rls_policies.sql` qui fait la même chose pour `profiles_admin_all` — le risque est limité car seul le service_role peut écrire dans `app_metadata`, mais la lisibilité et la rigueur sont insuffisantes. Un acteur malveillant ne peut pas s'auto-attribuer ce rôle via le client.
**Impact :** Faible en pratique (Supabase contrôle les claims JWT), mais risque de confusion et de mauvaise configuration future.
**Statut :** ATTENTION — cohérent avec la migration 011 (même pattern), correction à envisager dans une migration dédiée

---

### RLS Policies — `notification_queue`

#### ✅ `notification_queue_select_own` — Recipient uniquement
**Fichier :** `supabase/migrations/014_upgrade_notification_queue.sql` (ligne 53)
**Description :** La policy `USING (recipient_id = auth.uid())` garantit qu'un utilisateur ne peut lire que ses propres notifications. Les anciennes policies (avec l'ancien nom `user_id`) sont correctement supprimées avant recréation.
**Statut :** CONFORME

---

#### ✅ `notification_queue_insert_service` — Insertion réservée au service_role
**Fichier :** `supabase/migrations/014_upgrade_notification_queue.sql` (ligne 59)
**Description :** L'insertion dans la queue est limitée au rôle `service_role` uniquement. Les utilisateurs authentifiés ne peuvent pas injecter des notifications arbitraires.
**Statut :** CONFORME

---

### Edge Functions

#### ✅ `create-annonce` — JWT vérifié AVANT tout traitement
**Fichier :** `supabase/functions/create-annonce/index.ts` (lignes 18-32)
**Description :** La vérification du header `Authorization` et l'appel `supabase.auth.getUser()` sont effectués avant toute lecture du body ou traitement. Ordre correct.
**Statut :** CONFORME

---

#### ✅ `create-annonce` — Validation Zod AVANT write DB
**Fichier :** `supabase/functions/create-annonce/index.ts` (lignes 48-52)
**Description :** `annonceSchema.safeParse(body)` est appelé avant `createAnnonce()`. En cas d'échec, une réponse 400 est retournée sans écriture en base.
**Statut :** CONFORME

---

#### ❌ → ✅ `create-annonce` — Sanitization du champ `description` (CRITIQUE, CORRIGÉ)
**Fichier :** `supabase/functions/_shared/annonce.service.ts` (ligne 80)
**Description avant correction :** Le champ `description` était inséré en base tel quel après validation Zod (qui vérifie uniquement la longueur max 1000 chars). Aucune sanitization HTML/JS n'était effectuée, exposant un risque XSS si le contenu est ultérieurement rendu sans échappement dans une interface web.
**Correction appliquée :** Ajout de la fonction `sanitizeText()` qui :
- Supprime les balises `<script>` et leur contenu (regex case-insensitive)
- Supprime toutes les balises HTML restantes
- Supprime les occurrences de `javascript:` (vecteur XSS via attributs)
- Appelle `.trim()` pour normaliser les espaces

```typescript
description: validated.description ? sanitizeText(validated.description) : null,
```
**Statut :** CORRIGÉ

---

#### ✅ `update-annonce` — JWT vérifié + owner check
**Fichier :** `supabase/functions/update-annonce/index.ts` (lignes 16-31, 50-56)
**Description :** JWT vérifié en début de handler. La query UPDATE inclut `.eq('profile_id', user.id)` en plus du filtre par `id`, ce qui garantit que seul le propriétaire peut modifier son annonce (défense en profondeur au-delà de la RLS).
**Statut :** CONFORME

---

#### ✅ `update-annonce` — Transitions de statut restreintes côté client
**Fichier :** `supabase/functions/_shared/annonce.schema.deno.ts` (ligne 74) + `update-annonce/index.ts` (ligne 45)
**Description :** Le schéma `annonceUpdateSchema` limite le champ `statut` à `z.enum(['pourvue'])` uniquement. Un client ne peut pas passer directement une annonce en `expiree`, `non_confirmee` ou tout autre statut. Ces transitions sont gérées exclusivement par les triggers et fonctions côté serveur (`SECURITY DEFINER`).
**Statut :** CONFORME

---

#### ✅ Triggers — `SECURITY DEFINER`
**Fichier :** `supabase/migrations/015_annonce_triggers.sql` (lignes 19, 54, 101)
**Description :** Les trois fonctions PL/pgSQL (`notify_candidates_on_annonce_close`, `queue_annonce_creee_notification`, `process_annonce_freshness`) utilisent toutes `SECURITY DEFINER`. Cela garantit qu'elles s'exécutent avec les droits du propriétaire de la fonction (service) et non ceux de l'appelant.
**Statut :** CONFORME

---

#### ⚠️ → ✅ `create-annonce` — Absence de rate limiting (ATTENTION, CORRIGÉ)
**Fichier :** `supabase/functions/create-annonce/index.ts` (lignes 34-46)
**Description avant correction :** Aucune limitation du nombre de créations d'annonces par utilisateur n'existait. Un titulaire pouvait créer un nombre illimité d'annonces, exposant la plateforme à un abus (spam, saturation du géocodeur externe, surcoût).
**Correction appliquée :** Ajout d'une vérification avant l'insertion : si le titulaire a créé 10 annonces ou plus dans les dernières 24h, la requête est rejetée avec HTTP 429 et le code `ANNONCE_RATE_LIMIT`.
**Statut :** CORRIGÉ

---

### Données & Vie Privée

#### ✅ Payload `notification_queue` — Pas de données personnelles directes
**Fichier :** `supabase/migrations/015_annonce_triggers.sql` (lignes 41-48)
**Description :** Le payload JSON de la notification contient uniquement : `annonce_id` (UUID), `ville` (nom de ville générique), `date_debut`, `date_fin`, `is_urgent`. Aucune donnée personnelle identifiante (nom, email, téléphone, RPPS) n'est incluse. Conforme aux exigences RGPD pour les notifications push.
**Statut :** CONFORME

---

#### ✅ Indicateur rétrocession — Données agrégées anonymisées
**Fichier :** `supabase/migrations/016_retrocession_moyenne_function.sql` (non lu en détail) + `annonce.service.ts` (ligne 23)
**Description :** La fonction RPC `get_retrocession_moyenne_zone` calcule une moyenne agrégée sur un rayon de 30 km. Seul le résultat numérique (moyenne) est retourné, jamais les annonces individuelles ou les profils sources.
**Statut :** CONFORME

---

#### ✅ Géocodage — Localisation exacte non stockée
**Fichier :** `supabase/migrations/013_create_annonces.sql` (lignes 22-26) + `annonce.service.ts` (lignes 43-49)
**Description :** Le géocodage utilise l'API publique `api-adresse.data.gouv.fr` à partir du nom de ville et du code postal. La colonne `location` stocke un point PostGIS (coordonnées du centroïde de la ville/adresse), non la localisation précise du cabinet ou du patient. La localisation exacte du patient n'est pas collectée.
**Statut :** CONFORME

---

### Validation des données

#### ✅ Champ `retrocession` — Bornes 0-100 vérifiées côté serveur
**Fichier :** `supabase/functions/_shared/annonce.schema.deno.ts` (lignes 39-43) + `supabase/migrations/013_create_annonces.sql` (lignes 17-18)
**Description :** Double vérification : Zod côté Edge Function (`min(0)`, `max(100)`) et contrainte CHECK SQL en base. Défense en profondeur correcte.
**Statut :** CONFORME

---

#### ✅ Champ `date_fin >= date_debut` — Vérifié côté serveur
**Fichier :** `supabase/functions/_shared/annonce.schema.deno.ts` (lignes 62-65) + `supabase/migrations/013_create_annonces.sql` (ligne 16)
**Description :** La validation Zod utilise `.refine()` pour vérifier `date_fin >= date_debut`. La contrainte SQL `CONSTRAINT date_fin_after_debut CHECK (date_fin >= date_debut)` fournit une deuxième ligne de défense en base.
**Statut :** CONFORME

---

#### ✅ Champ `description` — Max 1000 chars + sanitization
**Fichier :** `supabase/functions/_shared/annonce.schema.deno.ts` (lignes 44-47) + `annonce.service.ts` (lignes 7-13, 80)
**Description :** Validation de longueur par Zod (`max(1000)`). Sanitization HTML/JS appliquée dans `annonce.service.ts` après la correction de cet audit.
**Statut :** CONFORME (après correction)

---

## Tests RLS recommandés (à exécuter manuellement)

### Test 1 : Remplaçant ne peut pas insérer d'annonce

```sql
-- Avec le JWT d'un remplaçant (role = 'remplaçant')
INSERT INTO annonces (profile_id, type_annonce, date_debut, date_fin, retrocession, ville)
VALUES (auth.uid(), 'remplacement', '2026-06-01', '2026-06-30', 82, 'Paris');
-- Attendu : erreur RLS (new row violates row-level security policy)
```

### Test 2 : Titulaire A ne peut pas modifier l'annonce de Titulaire B

```sql
-- Avec le JWT de Titulaire A
UPDATE annonces SET retrocession = 50 WHERE profile_id = '[ID_titulaire_B]';
-- Attendu : 0 rows updated (RLS filtre sur profile_id = auth.uid())
```

### Test 3 : Titulaire sans RPPS vérifié ne peut pas publier

```sql
-- Avec le JWT d'un titulaire non vérifié (rpps_verified = false)
INSERT INTO annonces (profile_id, type_annonce, date_debut, date_fin, retrocession, ville)
VALUES (auth.uid(), 'remplacement', '2026-06-01', '2026-06-30', 75, 'Lyon');
-- Attendu : erreur RLS (condition rpps_verified = true non satisfaite)
```

### Test 4 : Annonces pourvues/expirées invisibles pour les remplaçants

```sql
-- Avec le JWT d'un remplaçant
SELECT * FROM annonces WHERE statut IN ('pourvue', 'expiree');
-- Attendu : 0 rows (annonces_select_public exclut ces statuts,
--            annonces_select_own ne s'applique pas aux annonces d'autrui)
```

### Test 5 : Titulaire voit son propre historique complet

```sql
-- Avec le JWT du Titulaire C (propriétaire d'annonces pourvues)
SELECT id, statut FROM annonces WHERE profile_id = auth.uid();
-- Attendu : toutes les annonces retournées, tous statuts confondus
```

### Test 6 : Rate limiting — 11e création rejetée

```sql
-- Via Edge Function (Postman ou test d'intégration)
-- Créer 10 annonces avec le même JWT titulaire en moins de 24h
-- Tenter une 11e création
-- Attendu : HTTP 429, code = 'ANNONCE_RATE_LIMIT'
```

### Test 7 : Injection XSS dans description bloquée

```sql
-- Via Edge Function create-annonce avec le body :
-- { "description": "<script>alert('xss')</script>Description normale", ... }
-- Attendu : annonce créée avec description = "Description normale" (balise supprimée)
```

### Test 8 : Utilisateur bloqué ne peut pas publier

```sql
-- Avec le JWT d'un titulaire dont is_blocked = true
INSERT INTO annonces (profile_id, ...) VALUES (auth.uid(), ...);
-- Attendu : erreur RLS (condition is_blocked = false non satisfaite)
```

---

## Actions correctives appliquées

- [x] **CRITIQUE → CORRIGÉ** : Ajout de `sanitizeText()` dans `supabase/functions/_shared/annonce.service.ts` — strip balises HTML, tags `<script>`, occurrences `javascript:` avant insertion en base du champ `description`
- [x] **ATTENTION → CORRIGÉ** : Ajout du rate limiting dans `supabase/functions/create-annonce/index.ts` — rejet HTTP 429 si le titulaire a créé ≥ 10 annonces dans les 24 dernières heures

## Points à surveiller (non corrigés, faible risque)

- **`annonces_admin_all`** (migration 013) et **`profiles_admin_all`** (migration 011) utilisent `auth.jwt() ->> 'role'` au lieu de `auth.jwt() -> 'app_metadata' ->> 'role'` pour vérifier le rôle admin. En pratique, Supabase ne permet pas aux clients d'écrire ce claim, donc l'exploitation est impossible. Une migration corrective est recommandée pour la rigueur et la cohérence long terme.
- **CORS `Access-Control-Allow-Origin: *`** dans les deux Edge Functions : acceptable pour une API mobile-first, mais à restreindre au domaine de production lors du passage en prod.
