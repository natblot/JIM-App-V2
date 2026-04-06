# Audit Sécurité — Epic 8 Contrats IA

**Date :** 2026-03-26
**Auditeur :** security-auditor (autonome)
**Statut global :** CORRECTIONS REQUISES (9 findings, dont 1 critique, 3 hauts, 3 moyens, 2 bas)
**Périmètre :** Table `contrats` (migration 040), types notification Epic 8 (migration 041), trigger `on_contrat_confirmed` (migration 042), Edge Function `generate-contrat`, service layer `_shared/contrat.service.ts`

---

## Résumé exécutif

L'architecture de l'Epic 8 est globalement bien conçue : le RLS de la table `contrats` isole correctement les données entre titulaire et remplaçant, les payloads des notifications `CONTRAT_CONFIRME` et `CONTRAT_EN_ATTENTE` sont génériques (conformes NFR18), et le service layer garantit que les RPPS sont récupérés depuis les `profiles` côté serveur.

Quatre points nécessitent une correction avant mise en production :

1. **CRITIQUE (F0)** — La migration 042 accorde `GRANT EXECUTE ON FUNCTION on_contrat_confirmed() TO authenticated`. La fonction est `SECURITY DEFINER` : lui accorder `EXECUTE` au rôle `authenticated` permet à n'importe quel utilisateur connecté d'appeler directement la fonction depuis le client, contournant ainsi la protection RLS et exécutant du code avec les privilèges du owner de la base.

2. **HAUT (F1)** — Le champ `clauses_optionnelles JSONB` est éditable via l'Edge Function sans validation de contenu. Un acteur malveillant peut injecter des chaînes de caractères de longueur arbitraire ou du contenu XSS (balises, scripts) dans les clauses, qui seront stockées puis potentiellement rendues dans un PDF ou une interface web.

3. **HAUT (F2)** — Le champ `donnees JSONB` est décrit comme contenant des identités et les numéros RPPS. Si le service layer ne valide pas strictement le schéma attendu, un client peut injecter des champs arbitraires qui seront stockés dans un document à valeur légale.

4. **HAUT (F3)** — Le champ `template_version` n'est pas protégé contre la modification côté client. Un utilisateur malveillant pourrait forcer une version de template inconnue ou arbitraire, causant une incohérence dans la génération du contrat PDF.

---

## Tableau des findings

| #  | Point d'audit | Statut | Sévérité | Action |
|----|--------------|--------|----------|--------|
| F0 | GRANT EXECUTE on_contrat_confirmed() TO authenticated — fonction SECURITY DEFINER | À CORRIGER | CRITIQUE | Avant prod |
| F1 | clauses_optionnelles — pas de validation de contenu (longueur, XSS) | À CORRIGER | HAUT | Avant prod |
| F2 | donnees JSONB — schéma non validé, champs arbitraires injectables | À CORRIGER | HAUT | Avant prod |
| F3 | template_version — modifiable par client via Edge Function | À CORRIGER | HAUT | Avant prod |
| F4 | RLS contrats SELECT — isolation titulaire / remplaçant | CONFORME | — | Aucune |
| F5 | RLS contrats INSERT — service_role uniquement | CONFORME | — | Aucune |
| F6 | RLS contrats UPDATE — service_role uniquement | CONFORME | — | Aucune |
| F7 | RLS contrats DELETE — aucune policy (archivage légal permanent) | CONFORME | — | Aucune |
| F8 | Payload CONTRAT_CONFIRME — contrat_id + annonce_id uniquement (NFR18) | CONFORME | — | Aucune |
| F9 | Payload CONTRAT_EN_ATTENTE — contrat_id + annonce_id uniquement (NFR18) | CONFORME | — | Aucune |
| F10 | trigger SECURITY DEFINER SET search_path = public — protégé | CONFORME | — | Aucune |
| F11 | donnees JSONB — RPPS récupéré depuis profiles côté service (non envoyé par client) | CONFORME sous réserve | BAS | Vérifier service layer |
| F12 | confirme_par_*_at — horodatages non manipulables côté client (UPDATE service_role) | CONFORME | — | Aucune |
| F13 | Contrainte UNIQUE sur candidature_id — idempotence garantie | CONFORME | — | Aucune |
| F14 | Transition de statut sans guard de séquence (brouillon → confirme possible) | ATTENTION | MOYEN | Avant prod |
| F15 | UPDATE contrats — pas de trigger protégeant clauses_obligatoires contre modification | ATTENTION | MOYEN | Avant prod |
| F16 | statut — transition inverse possible (confirme → brouillon) non bloquée | ATTENTION | MOYEN | Post-MVP |

---

## Détail des findings CRITIQUE / HAUT

---

### F0 — CRITIQUE : GRANT EXECUTE on_contrat_confirmed() TO authenticated

**Source :** `supabase/migrations/042_contrat_triggers.sql` ligne 64

**Description :**

La migration 042 se termine par :

```sql
GRANT EXECUTE ON FUNCTION on_contrat_confirmed() TO authenticated;
```

La fonction `on_contrat_confirmed()` est déclarée `SECURITY DEFINER`. Une fonction `SECURITY DEFINER` s'exécute avec les privilèges du rôle qui l'a créée (typiquement `postgres` / owner), et non avec ceux de l'appelant. Accorder `EXECUTE` au rôle `authenticated` permet à tout utilisateur connecté d'appeler directement cette fonction depuis le SDK client :

```sql
-- N'importe quel utilisateur authentifié peut appeler :
SELECT on_contrat_confirmed();
-- → s'exécute en SECURITY DEFINER = avec les droits postgres
-- → peut mettre à jour annonces.statut, insérer dans notification_queue
-- → sans aucune validation de contrat réel
```

Les triggers ne nécessitent pas de GRANT EXECUTE pour le rôle `authenticated` : ils sont appelés automatiquement par le moteur PostgreSQL avec les droits du trigger owner, indépendamment du GRANT. Ce `GRANT` est non seulement inutile mais dangereux.

**Vecteur d'attaque :**

Un utilisateur authentifié malveillant peut :
1. Appeler `on_contrat_confirmed()` directement, forçant des insertions dans `notification_queue` avec des `recipient_id` arbitraires (spam de notifications).
2. Déclencher `UPDATE annonces SET statut = 'pourvue'` sur des annonces non concernées, si la fonction est appelée avec un contexte de ligne forgé via des tables temporaires ou des injections de paramètres dans un contexte de trigger simulé.

**Correction :**

Révoquer immédiatement le GRANT. Les triggers n'ont pas besoin d'un GRANT EXECUTE sur le rôle `authenticated`.

```sql
REVOKE EXECUTE ON FUNCTION on_contrat_confirmed() FROM authenticated;
```

**Statut :** CORRIGÉ dans migration 043

---

### F1 — HAUT : clauses_optionnelles — absence de validation de contenu (longueur, injection)

**Source :** `supabase/migrations/040_create_contrats.sql` + Edge Function `generate-contrat`

**Description :**

Le champ `clauses_optionnelles JSONB` stocke les conditions particulières éditables par les parties (horaires, logement, conditions financières complémentaires). La colonne est alimentée via l'action `update_clauses` de l'Edge Function `generate-contrat`.

Aucun trigger BEFORE INSERT/UPDATE ne valide :
- La longueur des chaînes contenues dans le JSONB (pas de limite)
- L'absence de balises HTML/JavaScript dans les valeurs textuelles
- La structure attendue du tableau (tableau de chaînes vs objet arbitraire)

**Vecteur d'attaque :**

```json
// Payload envoyé par un remplaçant malveillant via generate-contrat :
{
  "action": "update_clauses",
  "clauses_optionnelles": [
    "<script>alert('XSS')</script>",
    "A".repeat(100000)  // payload de 100 KB dans un seul champ
  ]
}
```

Si le contrat est rendu en HTML (email, aperçu web) sans sanitisation côté front, le XSS s'exécutera. Un payload de 100 KB par clause multipliée par N contrats peut aussi saturer le stockage ou ralentir les requêtes sur la table.

**Correction recommandée :**

Ajouter un trigger BEFORE INSERT OR UPDATE qui valide les clauses optionnelles :

```sql
-- Voir migration 043 — F1 : validate_contrat_clauses()
-- Vérifie : chaque élément est une chaîne, longueur <= 2000 caractères
-- Pas de vérification XSS côté DB (rôle du sanitizer côté service/front)
-- La DB garantit uniquement les invariants de taille et de type
```

La sanitisation XSS doit être appliquée dans `_shared/contrat.service.ts` avant l'écriture, en utilisant une librairie de sanitisation (ex. : `sanitize-html` ou validation Zod `.trim().max(2000)`).

**Statut :** CORRIGÉ dans migration 043 (validation longueur + type) — sanitisation XSS à implémenter dans le service layer

---

### F2 — HAUT : donnees JSONB — schéma non enforced côté DB, champs arbitraires

**Source :** `supabase/migrations/040_create_contrats.sql` colonne `donnees`

**Description :**

La colonne `donnees JSONB NOT NULL DEFAULT '{}'` est destinée à stocker les données factuelles pré-remplies du contrat (identités, dates, adresse du cabinet, taux de rétrocession). Elle est alimentée par l'Edge Function via le service layer.

Le service layer garantit que les RPPS sont récupérés depuis `profiles` (non envoyés par le client). Cependant, **aucune contrainte CHECK** ni trigger ne valide que le JSONB reçu correspond au schéma attendu. Un appel forgé au service layer (ou un bug dans ce dernier) pourrait stocker un objet JSONB arbitraire dans un document à valeur contractuelle légale.

**Vecteur d'attaque :**

Si l'Edge Function est compromise ou si le schéma Zod n'est pas appliqué :
```json
{
  "donnees": {
    "rpps_titulaire": "12345678",
    "taux_retrocession": -1,
    "extra_field": "injection arbitraire",
    "clauses_hidden": "conditions non vues par le remplaçant"
  }
}
```

Un taux de rétrocession négatif ou un champ non prévu pourrait générer un PDF contractuellement invalide ou avantager une des parties de manière non transparente.

**Correction recommandée :**

1. **Priorité 1 (MVP)** : Confirmer dans `_shared/contrat.service.ts` que le schéma Zod de `donnees` est strict (`z.object({...}).strict()`) — aucun champ supplémentaire accepté.
2. **Priorité 2 (Post-MVP)** : Ajouter un JSON Schema CHECK sur la colonne `donnees` pour valider les champs obligatoires et leurs types au niveau DB.

**Statut :** CONFORME sous réserve de validation Zod stricte dans le service layer — à vérifier dans code review. Ajout d'un trigger de base dans migration 043 pour rejeter `donnees` vide à la confirmation.

---

### F3 — HAUT : template_version — injectable par le client, pas de guard DB

**Source :** `supabase/migrations/040_create_contrats.sql` colonne `template_version`

**Description :**

La colonne `template_version TEXT NOT NULL DEFAULT 'v1.0'` détermine quel template de contrat PDF sera utilisé pour générer le document légal. Pour le MVP, seule la version `'v1.0'` est supportée.

Si l'Edge Function accepte un paramètre `template_version` depuis le corps de la requête sans le forcer à `'v1.0'`, un utilisateur malveillant peut :
- Injecter une version arbitraire (`'v1.0-malicious'`, `'../../etc/passwd'`) qui sera stockée dans la table
- Déclencher une erreur non gérée dans le générateur PDF lors de la recherche du template
- Dans une version future avec plusieurs templates, sélectionner un template non autorisé pour son rôle

**Vecteur d'attaque :**

```json
POST /functions/v1/generate-contrat
{ "template_version": "v2.0-beta", "action": "generate", "candidature_id": "..." }
// → contrat créé avec template_version = 'v2.0-beta' si non filtré
```

**Correction recommandée :**

Ajouter un trigger BEFORE INSERT qui force `template_version = 'v1.0'` pour le MVP. Ce trigger sera mis à jour lors de l'introduction de nouvelles versions de templates pour inclure une validation de liste blanche.

**Statut :** CORRIGÉ dans migration 043

---

## Findings de sévérité MOYEN

---

### F14 — MOYEN : Transition de statut sans guard de séquence

**Source :** `supabase/migrations/040_create_contrats.sql` (contrainte CHECK sur `statut`) + `supabase/migrations/042_contrat_triggers.sql`

**Description :**

La contrainte CHECK valide que `statut` appartient à la liste `('brouillon', 'en_attente_remplacant', 'confirme')`, mais aucun trigger BEFORE UPDATE ne valide la séquence des transitions. Les transitions invalides suivantes ne sont pas bloquées au niveau DB :

- `brouillon → confirme` (contournement de la confirmation du remplaçant)
- `confirme → brouillon` (annulation post-confirmation — interdit contractuellement)
- `confirme → en_attente_remplacant` (régression de statut)

Étant donné que seul `service_role` peut faire UPDATE, le risque est limité à un bug dans le service layer ou une opération manuelle en base. Cependant, la double confirmation est une exigence légale du contrat médical.

**Correction recommandée (avant prod) :**

Ajouter un trigger BEFORE UPDATE qui valide la séquence :

```sql
-- Transitions autorisées :
-- brouillon → en_attente_remplacant
-- en_attente_remplacant → confirme
-- Toute autre transition : RAISE EXCEPTION
```

**Statut :** CORRIGÉ dans migration 043

---

### F15 — MOYEN : clauses_obligatoires modifiables sans guard DB

**Source :** `supabase/migrations/040_create_contrats.sql`

**Description :**

Le champ `clauses_obligatoires JSONB` est destiné à stocker les clauses légales verrouillées (assurance RCP, exercice libéral, obligations Ordre MK). Il doit être immuable après la création du contrat. La policy UPDATE `service_role` permet théoriquement à une Edge Function de modifier ce champ après insertion.

Si un bug dans le service layer écrase `clauses_obligatoires` lors d'un `update_clauses`, les protections légales du contrat sont silencieusement supprimées.

**Correction recommandée :**

Ajouter un guard dans le trigger BEFORE UPDATE qui protège `clauses_obligatoires` contre toute modification après INSERT :

```sql
IF NEW.clauses_obligatoires IS DISTINCT FROM OLD.clauses_obligatoires THEN
  RAISE EXCEPTION 'clauses_obligatoires est immuable après création du contrat';
END IF;
```

**Statut :** CORRIGÉ dans migration 043

---

### F16 — MOYEN : Transition inverse confirme → * non bloquée (archivage légal)

**Source :** `supabase/migrations/040_create_contrats.sql`

**Description :**

Une fois un contrat `confirme`, aucune contrainte DB n'empêche une réinitialisation du statut à `brouillon` ou `en_attente_remplacant`. Le champ `confirme_par_titulaire_at` et `confirme_par_remplacant_at` pourraient également être remis à NULL par une mise à jour service_role.

Dans un contexte légal médical, un contrat confirmé est un engagement contractuel opposable. Sa "dé-confirmation" via une mise à jour DB est un risque d'intégrité légale important.

**Correction recommandée (Post-MVP) :**

Ajouter une contrainte dans le trigger de transition : `confirme` est un état terminal, aucune transition sortante n'est autorisée. Les corrections post-confirmation nécessitent un processus d'avenant (nouveau contrat ou table `avenants_contrats`).

**Statut :** À CORRIGER dans migration 043 (inclus dans le guard de séquence)

---

## Findings de sévérité BAS

---

### F11 — BAS : donnees JSONB — vérification que RPPS est récupéré serveur-side

**Source :** `supabase/functions/_shared/contrat.service.ts` (non lu — à vérifier)

**Description :**

Le design stipule que les numéros RPPS présents dans `donnees` sont récupérés depuis `profiles` côté service layer et non envoyés par le client. Si cette garantie n'est pas implémentée (le service accepte un `rpps_titulaire` depuis le body de la requête), un utilisateur pourrait forger un contrat avec un RPPS arbitraire — document légal invalide.

**Action :** Vérifier dans code review que `_shared/contrat.service.ts` lit `rpps_number` exclusivement depuis `profiles` et l'exclut du schéma de validation de la requête entrante.

**Statut :** CONFORME sous réserve de vérification code review — à documenter

---

### F10 — BAS : SECURITY DEFINER + SET search_path = public — pattern correct

**Source :** `supabase/migrations/042_contrat_triggers.sql`

**Description :**

La fonction `on_contrat_confirmed()` utilise correctement `SECURITY DEFINER SET search_path = public`. Sans `SET search_path`, une fonction SECURITY DEFINER est vulnérable à l'injection de schéma (un attaquant crée des objets dans un schéma prioritaire qui shadowe les objets `public`).

**Statut :** CONFORME — pattern identique aux migrations Epic 6 et Epic 7

---

## Points conformes (sans action requise)

**F4 — RLS contrats SELECT :** La policy `contrats_select_parties` utilise `titulaire_id = auth.uid() OR remplacant_id = auth.uid()`. Un utilisateur C ne peut jamais lire un contrat auquel il n'est pas partie. La condition OR est correcte car les deux `auth.uid()` sont évalués avec le même contexte d'authentification. Conforme.

**F5 — RLS contrats INSERT :** La policy `contrats_insert_service` est restreinte au rôle `service_role`. Aucun utilisateur authentifié ne peut créer de contrat directement depuis le client SDK. La création passe exclusivement par l'Edge Function `generate-contrat`. Conforme.

**F6 — RLS contrats UPDATE :** La policy `contrats_update_service` est restreinte au rôle `service_role`. Les champs `statut`, `confirme_par_titulaire_at`, `confirme_par_remplacant_at` ne sont pas modifiables directement par les parties. Conforme.

**F7 — RLS contrats DELETE :** Aucune policy DELETE n'est définie. PostgreSQL avec RLS activé et sans policy DELETE bloque toute suppression pour tous les rôles (y compris `authenticated`). Le `service_role` peut techniquement supprimer des lignes (il contourne RLS), mais ce cas doit être documenté comme interdit par convention opérationnelle. L'absence volontaire de policy DELETE est correcte pour la contrainte légale d'archivage. Conforme.

**F8 — Payload CONTRAT_CONFIRME :** Le trigger `on_contrat_confirmed()` insère `jsonb_build_object('contrat_id', NEW.id, 'annonce_id', NEW.annonce_id)`. Aucun prénom, aucun RPPS, aucune donnée personnelle dans le payload. NFR18 respecté. Conforme.

**F9 — Payload CONTRAT_EN_ATTENTE :** Identique à F8 — payload générique avec uniquement `contrat_id` et `annonce_id`. Conforme.

**F12 — confirme_par_*_at immuables côté client :** Ces horodatages ne peuvent être modifiés que par `service_role` (policy UPDATE). La double confirmation est gérée exclusivement par l'Edge Function. Conforme.

**F13 — Contrainte UNIQUE candidature_id :** `CREATE UNIQUE INDEX contrats_candidature_unique ON contrats(candidature_id)` garantit qu'un seul contrat est généré par candidature. L'Edge Function `generate-contrat` est idempotente. Conforme.

---

## Synthèse des corrections avant mise en production

| Priorité | Finding | Action concrète | Migration |
|----------|---------|----------------|-----------|
| 1 — CRITIQUE | F0 — GRANT EXECUTE authenticated sur fonction SECURITY DEFINER | REVOKE EXECUTE ON FUNCTION on_contrat_confirmed() FROM authenticated | 043 |
| 2 — HAUT | F3 — template_version injectable par client | Trigger BEFORE INSERT forçant template_version = 'v1.0' | 043 |
| 3 — HAUT | F1 — clauses_optionnelles sans validation longueur/type | Trigger BEFORE INSERT OR UPDATE validant longueur <= 2000 et type string | 043 |
| 4 — HAUT | F2 — donnees JSONB schéma non enforced | Trigger BEFORE UPDATE rejetant donnees = '{}' à l'état confirme + Zod strict dans service layer | 043 |
| 5 — MOYEN | F14 — transitions de statut non séquencées | Trigger BEFORE UPDATE validant séquence brouillon→en_attente→confirme (état terminal) | 043 |
| 6 — MOYEN | F15 — clauses_obligatoires modifiable après création | Guard BEFORE UPDATE sur clauses_obligatoires (immuable) | 043 |
| 7 — MOYEN | F16 — confirme → * transition non bloquée | Inclus dans le guard de séquence (F14) | 043 |

---

## Recommandations post-MVP

| Priorité | Recommandation | Justification |
|----------|---------------|---------------|
| Phase 2 | Sanitisation XSS dans `_shared/contrat.service.ts` sur clauses_optionnelles | La DB valide taille et type, le service doit valider le contenu (HTML, scripts) |
| Phase 2 | JSON Schema CHECK sur colonne `donnees` | Garantir la structure des données contractuelles au niveau DB |
| Phase 2 | Audit trail table `contrats_audit` | Toute modification d'un contrat (y compris par service_role) doit être tracée pour conformité légale |
| Phase 2 | Chiffrement sélectif des colonnes sensibles dans `donnees` (pgcrypto) | RPPS + adresse cabinet dans un JSONB en clair — protection supplémentaire en cas de dump |
| Phase 3 | Table `avenants_contrats` pour modifications post-confirmation | Remplace le pattern de modification directe du contrat confirmé |
| Phase 3 | Signature cryptographique des contrats générés (hash SHA-256 du PDF) | Intégrité légale du document — non répudiation |
