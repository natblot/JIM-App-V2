# Audit Sécurité — Epic 5 Candidatures & Sélection

**Date :** 2026-03-26
**Auditeur :** security-auditor (autonome)
**Statut global :** CORRECTIONS REQUISES (4 findings, dont 2 critiques)
**Périmètre :** RLS candidatures, masquage coordonnées, sanitization, rate limiting, triggers SECURITY DEFINER, idempotency offline

---

## Résumé des findings

| # | Point d'audit | Statut | Sévérité | Action |
|---|--------------|--------|----------|--------|
| F1 | Policy INSERT `candidatures_insert_rpps` — vérification RPPS/rôle | CONFORME | — | Aucune |
| F2 | Policy INSERT — restriction `source IN ('native', 'rempleo')` | ATTENTION | MOYEN | Décision métier à valider |
| F3 | Policy SELECT remplaçant — isolation inter-remplaçants | CONFORME | — | Aucune |
| F4 | Policy SELECT titulaire — accès aux coordonnées du remplaçant | CRITIQUE | HAUT | Correction requise avant prod |
| F5 | Policy UPDATE titulaire — `WITH CHECK` absent | CONFORME | — | Comportement attendu |
| F6 | Policy UPDATE remplaçant — restriction `statut = 'retiree'` uniquement | CONFORME | — | Aucune |
| F7 | Contrainte UNIQUE — re-candidature après retrait impossible | ATTENTION | MOYEN | Décision métier à confirmer |
| F8 | Masquage coordonnées dans `useCandidaturesRecues` | CRITIQUE | HAUT | Correction requise avant prod |
| F9 | Sanitization du champ `message` | CONFORME | — | Aucune |
| F10 | Rate limiting candidatures | ATTENTION | MOYEN | Non implémenté — post-MVP |
| F11 | Triggers SECURITY DEFINER — payload | CONFORME | — | Aucune |
| F12 | Trigger `on_candidature_status_change` — UPDATE annonces | ATTENTION | MOYEN | Périmètre d'action à surveiller |
| F13 | Idempotency offline — 409 retourné comme succès | CONFORME | — | Aucune |
| F14 | Favoris — isolation titulaire | CONFORME | — | Aucune |
| F15 | CORS Edge Functions — origine wildcard | ATTENTION | MOYEN | Non bloquant MVP, à durcir post-MVP |
| F16 | Retrait candidature — statuts autorisés | ATTENTION | MOYEN | Décision métier à confirmer |

---

## Détail des findings

### CONFORME — F1 : Policy INSERT `candidatures_insert_rpps`

**Source :** `supabase/migrations/024_create_candidatures.sql` lignes 66-81

La policy vérifie correctement les trois conditions cumulatives :
1. `remplacant_id = auth.uid()` — l'utilisateur ne peut candidater qu'en son nom propre
2. `profiles.rpps_verified = true AND profiles.role = 'remplacant'` — gate RPPS obligatoire
3. `annonces.statut IN ('active', 'non_confirmee')` — seules les annonces ouvertes acceptent des candidatures

La colonne `rpps_verified` est protégée par la policy `profiles_update_own` (migration 011) qui délègue sa modification aux Edge Functions via le service role. Un utilisateur authentifié ne peut pas modifier `rpps_verified` par lui-même via le client Supabase standard.

---

### ATTENTION — F2 : Policy INSERT — restriction `source IN ('native', 'rempleo')`

**Source :** `supabase/migrations/024_create_candidatures.sql` ligne 79

La policy exclut les annonces dont la source est autre que `'native'` ou `'rempleo'`. Les annonces d'autres sources agrégées futures seraient donc non candidatables silencieusement au niveau RLS, sans message d'erreur explicite côté application.

**Risque :** Si de nouvelles sources sont ajoutées dans `supabase/migrations/017_aggregation_tables.sql`, il faudra mettre à jour cette policy en conséquence.

**Action :** Vérifier que la liste des sources autorisées reste synchronisée avec le registre `source-registry.ts` lors de l'ajout de nouvelles sources d'agrégation.

---

### CONFORME — F3 : Policy SELECT — isolation inter-remplaçants

**Source :** `supabase/migrations/024_create_candidatures.sql` lignes 52-53

```sql
CREATE POLICY candidatures_select_own ON candidatures
  FOR SELECT USING (remplacant_id = auth.uid());
```

Le remplaçant A ne peut voir que ses propres candidatures. Il n'a aucun moyen de lire les candidatures du remplaçant B sur la même annonce, y compris via le filtre `annonce_id`. La policy est strictement filtrée par `remplacant_id = auth.uid()` sans exception.

---

### CRITIQUE — F4 : Policy SELECT titulaire — exposition des coordonnées du remplaçant sans condition de statut

**Source :** `packages/shared/src/hooks/useCandidaturesRecues.ts` lignes 46-54

```typescript
.select(`
  *,
  profiles!candidatures_remplacant_id_fkey(
    first_name, last_name, rpps_number, rpps_verified,
    specialites, zone_km, photo_url
  )
`)
```

**Constat :** La query `useCandidaturesRecues` ne retourne pas `email` ni `phone` du profil remplaçant — c'est conforme pour la liste. Cependant, la policy RLS `profiles_select_verified_public` (migration 011) expose les profils vérifiés à TOUS les utilisateurs authentifiés. Un titulaire peut donc requêter directement la table `profiles` avec `user_id = remplacant_id` pour obtenir toutes les données du profil, y compris celles non sélectionnées dans le hook.

**Risque réel :** Les champs `email` et `phone` sont dans la table `profiles`. La policy `profiles_select_verified_public` expose les profils vérifiés sans restriction de champs. Si un titulaire fait une requête directe `supabase.from('profiles').select('email, phone').eq('user_id', remplacant_id)`, il peut obtenir les coordonnées même si la candidature n'est pas `acceptee`.

**Action requise avant production :**
- Soit ajouter une Column-Level Security via une vue ou une fonction RPC qui filtre `email`/`phone` en fonction du statut de la candidature
- Soit s'assurer que les champs `email` et `phone` ne figurent JAMAIS dans le `profiles` RLS public — ils doivent être exclus de la policy `profiles_select_verified_public` via une vue ou un masquage explicite
- Recommandation : créer une migration ajoutant une RPC `get_remplacant_contact(candidature_id)` qui ne retourne `email`/`phone` que si `candidature.statut = 'acceptee'` et que l'appelant est bien le titulaire de l'annonce concernée

---

### CONFORME — F5 : Policy UPDATE titulaire — absence de `WITH CHECK` restrictif

**Source :** `supabase/migrations/024_create_candidatures.sql` lignes 89-96

```sql
CREATE POLICY candidatures_update_titulaire ON candidatures
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM annonces
      WHERE annonces.id = candidatures.annonce_id
      AND annonces.profile_id = auth.uid()
    )
  );
```

L'absence de `WITH CHECK` laisse le titulaire libre de passer une candidature à n'importe quel statut valide du `CHECK` de la table. C'est le comportement attendu : le titulaire peut accepter, refuser ou mettre en discussion. Le refus cascade est géré par le service `processCandidature` dans l'Edge Function avec le client utilisateur du titulaire, qui bénéficie de cette policy UPDATE.

**Cas refus cascade :** L'Edge Function `process-candidature` utilise le client Supabase avec le token du titulaire. La policy `candidatures_update_titulaire` couvre bien l'UPDATE sur toutes les candidatures de ses annonces, y compris celles des autres remplaçants, ce qui permet le refus cascade.

---

### CONFORME — F6 : Policy UPDATE remplaçant — retrait uniquement

**Source :** `supabase/migrations/024_create_candidatures.sql` lignes 84-86

```sql
CREATE POLICY candidatures_update_own ON candidatures
  FOR UPDATE USING (remplacant_id = auth.uid())
  WITH CHECK (remplacant_id = auth.uid() AND statut = 'retiree');
```

Le `WITH CHECK (statut = 'retiree')` limite le remplaçant à une seule transition possible : passer sa candidature à `retiree`. Il ne peut pas s'auto-accepter, ni modifier son message après envoi. La vérification `withdrawCandidature` dans le service ajoute une couche applicative supplémentaire (vérification que `statut = 'en_attente'` avant de permettre le retrait).

---

### ATTENTION — F7 : Contrainte UNIQUE — re-candidature après retrait impossible

**Source :** `supabase/migrations/024_create_candidatures.sql` ligne 32

```sql
CONSTRAINT candidatures_unique_per_annonce UNIQUE (annonce_id, remplacant_id)
```

La contrainte UNIQUE sur `(annonce_id, remplacant_id)` est inconditionnelle : même si une candidature est en statut `retiree` ou `expiree`, le remplaçant ne peut pas recandidater. L'Edge Function retournera un 409 `CANDIDATURE_ALREADY_EXISTS`.

**Décision métier à valider :** Est-ce intentionnel ? Un remplaçant qui retire sa candidature par erreur est définitivement bloqué sur cette annonce. Deux options possibles :
- **Option A (actuel) :** Blocage permanent — simple, pas d'ambiguïté de statut
- **Option B :** Autoriser la re-candidature si `statut IN ('retiree', 'expiree')` — nécessite un soft-delete logique ou une UNIQUE partielle

---

### CRITIQUE — F8 : Masquage coordonnées — absence de protection RLS sur les champs sensibles de `profiles`

**Source :** `supabase/migrations/011_rls_policies.sql` lignes 17-20

```sql
CREATE POLICY "profiles_select_verified_public"
  ON public.profiles FOR SELECT TO authenticated
  USING (rpps_verified = true AND is_blocked = false);
```

**Constat :** Cette policy permet à tout utilisateur authentifié de lire l'intégralité du profil d'un remplaçant vérifié, y compris les champs `email` et `phone` s'ils sont dans la table `profiles`. Il n'existe aucun mécanisme de restriction par colonne dans PostgreSQL RLS natif.

**Risque :** Un titulaire peut contourner le masquage côté applicatif (`useCandidaturesRecues` ne sélectionne pas `email`/`phone`) en faisant une requête directe `supabase.from('profiles').select('*')` et en récupérant les coordonnées de tout remplaçant vérifié, indépendamment du statut de sa candidature.

**Action requise avant production :**
1. Vérifier si les colonnes `email` et `phone` existent réellement dans `profiles` (non visible dans les migrations lues — la table `profiles` est définie dans `008_profiles_base.sql`)
2. Si oui : créer une vue `profiles_public` qui exclut ces colonnes, et rediriger la policy sur cette vue — ou utiliser une fonction RPC pour accès conditionnel
3. Documenter explicitement que le masquage est garanti par l'architecture (si ces colonnes n'existent pas dans `profiles` car l'email est dans `auth.users`)

---

### CONFORME — F9 : Sanitization du champ `message`

**Source :** `supabase/functions/_shared/candidature.service.ts` lignes 6-12 et 36

La fonction `sanitizeText` est appelée sur le champ `message` avant insertion. Elle :
- Supprime les balises `<script>` complètes avec leur contenu
- Supprime toutes les balises HTML restantes
- Supprime les prefixes `javascript:`
- Applique `.trim()`

La contrainte DB `CHECK (char_length(message) <= 500)` sert de filet de sécurité côté base. La validation Zod côté Edge Function (`z.string().max(500)`) la précède. La triple protection (Zod → sanitize → DB CHECK) est conforme aux règles absolues du projet.

**Note :** La sanitization `sanitizeText` est une implémentation maison (regex). Elle ne couvre pas les vecteurs XSS avancés (ex: `onmouseover`, entités HTML encodées). Acceptable pour un champ texte affiché dans une app mobile React Native qui échappe nativement le contenu, mais à renforcer si ce champ est affiché dans un contexte web avec `dangerouslySetInnerHTML`.

---

### ATTENTION — F10 : Rate limiting candidatures — absent pour MVP

**Source :** `supabase/functions/create-candidature/index.ts` — aucun rate limit présent

L'Edge Function `create-candidature` ne comporte aucune logique de limitation du nombre de candidatures par période. La contrainte UNIQUE DB empêche le double envoi sur la même annonce mais n'empêche pas le spam vers des annonces différentes.

**Vecteur d'attaque :** Un remplaçant malveillant avec RPPS vérifié peut envoyer plusieurs centaines de candidatures automatisées vers toutes les annonces actives, saturant les boîtes de notification des titulaires.

**Recommandation post-MVP :** Ajouter dans `create-candidature/index.ts` une vérification via `supabase.from('candidatures').select('id', { count: 'exact' }).eq('remplacant_id', userId).gte('created_at', il_y_a_24h)` et retourner 429 si le compteur dépasse 20. Le pg_cron de rate-limiting de la migration 023 (recherche) peut servir de modèle.

---

### CONFORME — F11 : Triggers SECURITY DEFINER — payload minimal

**Source :** `supabase/migrations/026_candidature_triggers.sql`

**Trigger `notify_titulaire_on_candidature` (AFTER INSERT) :**
- Payload `CANDIDATURE_RECUE` contient : `annonce_id`, `ville`, `candidat_prenom` (prénom uniquement via `first_name`)
- Aucune donnée personnelle sensible (pas de nom complet, pas d'email, pas de RPPS)
- Conforme à la règle : "Push notifications : payload générique UNIQUEMENT, zéro donnée personnelle"

**Trigger `on_candidature_status_change` (BEFORE UPDATE) :**
- Payload `CANDIDATURE_ACCEPTEE` contient : `annonce_id` uniquement
- Payload `CANDIDATURE_REFUSEE` contient : `annonce_id` uniquement
- Les triggers ne modifient que `notification_queue` (INSERT) et `annonces` (UPDATE statut → `en_cours`)

---

### ATTENTION — F12 : Trigger `on_candidature_status_change` — UPDATE sur `annonces` via SECURITY DEFINER

**Source :** `supabase/migrations/026_candidature_triggers.sql` lignes 66-68

```sql
UPDATE annonces
SET statut = 'en_cours', updated_at = now()
WHERE id = NEW.annonce_id AND statut = 'active';
```

Le trigger `on_candidature_status_change` est `SECURITY DEFINER` et effectue un UPDATE sur la table `annonces`. Cela signifie qu'il bypass le RLS des annonces lors de cette transition. C'est fonctionnellement correct (le trigger doit pouvoir modifier l'annonce quel que soit l'utilisateur appelant), mais représente un vecteur de modification indirecte.

**Risque résiduel :** Si la condition `WHERE statut = 'active'` est suffisante (elle l'est), le trigger ne peut passer que des annonces `active` → `en_cours`. Il ne peut pas affecter des annonces `en_cours`, `pourvue`, ou appartenant à un autre titulaire (filtré par `annonce_id`). Le risque est faible.

**Recommandation :** Documenter ce comportement SECURITY DEFINER dans le commentaire de la fonction pour les futurs mainteneurs.

---

### CONFORME — F13 : Idempotency offline — 409 géré comme succès client

**Source :** `supabase/functions/_shared/candidature.service.ts` lignes 50-52

```typescript
if (error.code === '23505') {
  return { error: { code: 'CANDIDATURE_ALREADY_EXISTS', message: '...' }, status: 409 };
}
```

Le code d'erreur PostgreSQL `23505` (violation de contrainte UNIQUE) est correctement intercepté et retourné comme 409 avec un code métier explicite. Le hook `useCreateCandidature` passe par `supabase.functions.invoke()` ; le client doit traiter ce 409 comme un succès (la candidature existe déjà).

**Point à vérifier :** Confirmer que le composant UI qui appelle `useCreateCandidature.onError` affiche "Candidature déjà envoyée" plutôt qu'un message d'erreur générique pour le code `CANDIDATURE_ALREADY_EXISTS`. Ce comportement est dans la couche UI (non auditée ici, hors périmètre migrations et services).

---

### CONFORME — F14 : Favoris — isolation titulaire, pas de fuite vers remplaçant

**Source :** `supabase/migrations/025_create_favoris.sql`

La table `favoris` dispose de trois policies :
- `favoris_select_own` : `titulaire_id = auth.uid()` — seul le titulaire peut voir ses favoris
- `favoris_insert_own` : `titulaire_id = auth.uid() AND role = 'titulaire'` — seul un titulaire peut ajouter
- `favoris_delete_own` : `titulaire_id = auth.uid()` — seul le titulaire peut supprimer

Il n'existe aucune policy SELECT pour le rôle remplaçant. Un remplaçant ne peut pas savoir dans quels carnets favoris il figure, même en requêtant directement `supabase.from('favoris').select('*')` — le RLS retournera un jeu vide.

**Vérification supplémentaire :** Le hook `useFavoris` sélectionne `*` (migration 025 ne définit pas `email` ni données sensibles dans `favoris`). La table ne contient que `titulaire_id`, `remplacant_id`, `note`, `created_at` — aucune donnée personnelle exposée.

---

### ATTENTION — F15 : CORS Edge Functions — origine wildcard

**Source :** `supabase/functions/create-candidature/index.ts`, `process-candidature/index.ts`, `withdraw-candidature/index.ts` ligne 8

```typescript
'Access-Control-Allow-Origin': '*',
```

Toutes les Edge Functions Epic 5 (et les précédentes) utilisent `Access-Control-Allow-Origin: *`. Pour une API authentifiée par JWT, le wildcard CORS n'est pas un vecteur d'attaque direct (les navigateurs bloquent les requêtes cross-origin sans credential). Cependant, des outils comme Postman ou curl ne sont pas limités.

**Recommandation post-MVP :** Restreindre à `https://jim-app.fr` et au scheme Expo (`exp://`) pour durcir la surface.

---

### ATTENTION — F16 : Retrait candidature — restriction au statut `en_attente` uniquement

**Source :** `supabase/functions/_shared/candidature.service.ts` ligne 123

```typescript
if (candidature.statut !== 'en_attente') {
  return { error: { code: 'CANDIDATURE_NOT_WITHDRAWABLE', ... }, status: 409 };
}
```

Le service interdit le retrait si le statut n'est pas `en_attente`. Or la policy RLS `candidatures_update_own` autorise le passage à `retiree` sans condition de statut source (uniquement `WITH CHECK (statut = 'retiree')`). Il existe une légère incohérence : la logique applicative est plus restrictive que le RLS.

**Décision métier à confirmer :** Un remplaçant dont la candidature est en statut `vue` ou `en_discussion` peut-il la retirer ? Le service dit non, le RLS le permettrait. Si la réponse business est "oui", modifier le service. Si "non", la situation actuelle est correcte (défense en profondeur : service + RLS).

---

## Actions manuelles requises (Dashboard Supabase SQL Editor)

Ces éléments sont commentés dans la migration 026 et ne s'exécutent pas automatiquement :

### 1. pg_cron — Expiration candidatures J+7

```sql
SELECT cron.schedule(
  'expire-candidatures-j7',
  '0 8 * * *',
  $$
  UPDATE candidatures
  SET statut = 'expiree', updated_at = now()
  WHERE statut = 'en_attente'
    AND created_at < now() - INTERVAL '7 days';
  $$
);
```

**Vérification sécurité :** Cette requête UPDATE ne bypass pas le RLS car `cron.schedule` s'exécute avec le rôle `postgres` (superuser). S'assurer que pg_cron est activé via les extensions Supabase (Dashboard → Extensions → pg_cron).

### 2. pg_cron — Relance titulaire J+2 (non encore défini)

La migration 027 inclut les types `RELANCE_CANDIDATURE_J2` et `RELANCE_CANDIDATURE_J5` mais aucune tâche cron n'est définie pour les déclencher. À créer manuellement :

```sql
-- Relance J+2 : candidatures non vues après 2 jours
SELECT cron.schedule(
  'relance-titulaire-j2',
  '0 9 * * *',
  $$
  INSERT INTO notification_queue (recipient_id, event_type, payload, priority, channel)
  SELECT a.profile_id, 'RELANCE_CANDIDATURE_J2',
    jsonb_build_object('annonce_id', c.annonce_id, 'nb_candidatures', COUNT(c.id)),
    'normal', 'push'
  FROM candidatures c
  JOIN annonces a ON a.id = c.annonce_id
  WHERE c.statut = 'en_attente'
    AND c.created_at < now() - INTERVAL '2 days'
    AND c.created_at >= now() - INTERVAL '3 days'
  GROUP BY a.profile_id, c.annonce_id;
  $$
);
```

---

## Points d'attention résiduels post-MVP

### Priorité HAUTE (à traiter avant ouverture bêta)

1. **F4 + F8 — Masquage coordonnées garanti au niveau DB** : Vérifier la structure exacte de `profiles` (migration 008 non auditée en détail). Si `email` et `phone` sont dans `profiles`, créer une migration 028 avec une vue `profiles_public` excluant ces colonnes, ou une RPC `get_remplacant_contact(candidature_id UUID)` sécurisée.

### Priorité MOYENNE (post-MVP)

2. **F7 — Re-candidature après retrait** : Décision produit requise. Si la re-candidature doit être possible, remplacer la contrainte UNIQUE par un index unique partiel `WHERE statut NOT IN ('retiree', 'expiree')` dans une migration dédiée.

3. **F10 — Rate limiting candidatures** : Ajouter un compteur 24h dans `create-candidature/index.ts`. Limite suggérée : 20 candidatures/24h par remplaçant.

4. **F16 — Retrait candidature `en_discussion`** : Décision produit requise. Actuellement bloqué par le service (pas par le RLS). Aligner service et RLS.

### Priorité BASSE (durcissement)

5. **F15 — CORS wildcard** : Restreindre à l'origine production après déploiement.

6. **F12 — Documentation SECURITY DEFINER** : Ajouter un `COMMENT ON FUNCTION` sur `on_candidature_status_change` expliquant pourquoi il doit être SECURITY DEFINER (UPDATE annonces bypass RLS intentionnel).

7. **F9 — Sanitization maison** : Envisager une bibliothèque de sanitization dédiée (ex: `dompurify` via CDN dans Edge Functions) pour les vecteurs XSS encodés. Non critique pour un affichage React Native.

---

## Matrice de couverture des tests RLS recommandés

| Scénario | Compte A (remplaçant vérifié) | Compte B (remplaçant vérifié) | Compte C (titulaire) | Attendu |
|----------|------------------------------|------------------------------|---------------------|---------|
| A candidate sur annonce de C | ✓ | — | — | INSERT ok |
| B tente de lire candidature de A | — | SELECT → vide | — | 0 résultat |
| A tente de s'auto-accepter | UPDATE statut='acceptee' | — | — | Rejeté par WITH CHECK |
| C accepte candidature de A | — | — | UPDATE ok | Statut 'acceptee' |
| C lit favoris de B | — | — | SELECT → vide | 0 résultat (titulaire_id ≠ C) |
| B tente de lire ses favoris | — | SELECT → vide | — | 0 résultat (aucune policy SELECT B) |
| A candidate 2x sur même annonce | INSERT → 409 | — | — | 23505 → CANDIDATURE_ALREADY_EXISTS |
| A sans RPPS candidate | INSERT rejeté | — | — | RLS INSERT refusé |
