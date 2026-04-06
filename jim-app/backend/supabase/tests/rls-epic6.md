# Audit Sécurité — Epic 6 Messagerie Intégrée

**Date :** 2026-03-26
**Auditeur :** security-auditor (autonome)
**Statut global :** CORRECTIONS REQUISES (5 findings, dont 1 critique et 2 hauts)
**Périmètre :** RLS conversations et messages, masquage coordonnées, sanitization, rate limiting, triggers SECURITY DEFINER, typosquatting, chiffrement

---

## Résumé exécutif

L'architecture de la messagerie Epic 6 est globalement solide. La séparation entre la création de conversations (trigger SECURITY DEFINER uniquement) et l'insertion de messages (policy RLS client), le payload générique dans `notification_queue` et l'idempotence du trigger de création sont correctement implémentés.

Trois points bloquants méritent attention avant mise en production :

1. **CRITIQUE (F4)** — La contrainte UPDATE sur `messages` ne protège pas réellement l'immutabilité du contenu : `WITH CHECK (content = content AND ...)` est une tautologie SQL sans effet. Un participant peut modifier le contenu d'un message.
2. **HAUT (F7)** — La fonction `can_see_contact_info()` peut être appelée par n'importe quel utilisateur authentifié avec n'importe quel `viewer_id` arbitraire (le paramètre n'est pas contraint à `auth.uid()`). Un utilisateur peut interroger la relation entre deux autres utilisateurs.
3. **HAUT (F9)** — Le message d'accompagnement de candidature est ré-inséré dans la table `messages` par le trigger `create_conversation_on_accept()` sans re-sanitization. Bien que sanitizé à la création de la candidature, toute modification future du flux candidature pourrait casser cette garantie.

---

## Tableau des findings

| # | Point d'audit | Statut | Sévérité | Action |
|---|--------------|--------|----------|--------|
| F1 | RLS conversations SELECT — isolation participant | CONFORME | — | Aucune |
| F2 | RLS conversations INSERT — côté client impossible | CONFORME | — | Aucune |
| F3 | RLS messages SELECT — isolation via JOIN conversations | CONFORME | — | Aucune |
| F4 | RLS messages UPDATE — immutabilité contenu (WITH CHECK) | À CORRIGER | CRITIQUE | Correction avant prod |
| F5 | RLS messages INSERT — sender_id = auth.uid() + NOT is_system_message | CONFORME | — | Aucune |
| F6 | RLS messages DELETE — absent (conservation RGPD) | CONFORME | — | Aucune |
| F7 | can_see_contact_info() — viewer_id non contraint à auth.uid() | À CORRIGER | HAUT | Correction avant prod |
| F8 | can_see_contact_info() — applicabilité côté serveur | ATTENTION | MOYEN | Décision architecture à valider |
| F9 | Message accompagnement candidature — re-sanitization dans trigger | À CORRIGER | HAUT | Correction recommandée avant prod |
| F10 | Sanitization contenu messages — NFR17 | NON IMPLÉMENTÉ | HAUT | Edge Function send-message absente |
| F11 | Chiffrement au repos AES-256 — NFR11 | CONFORME (infra) | — | Aucune (MVP) |
| F12 | Rate limiting messages — max 60/minute | CONFORME | — | Aucune |
| F13 | Trigger notification_queue — payload générique NFR18 | CONFORME | — | Aucune |
| F14 | Trigger create_conversation — NEW.statut (pas NEW.status) | CONFORME | — | Aucune |
| F15 | Trigger create_conversation — idempotent ON CONFLICT DO NOTHING | CONFORME | — | Aucune |
| F16 | Typosquatting — domaines bloqués | NON IMPLÉMENTÉ | MOYEN | Post-MVP |
| F17 | Signalement message — insertion notification_queue sans données admin | NON IMPLÉMENTÉ | INFO | Post-MVP |
| F18 | Injection is_system_message = true côté client | CONFORME | — | Aucune |
| F19 | Rate limiting conversations — création artificielle | CONFORME (indirect) | — | Aucune |
| F20 | MESSAGE_RECU — absent de la contrainte notification_event_type_check | À CORRIGER | HAUT | Correction avant prod |

---

## Détail des findings CRITIQUE / HAUT

---

### F4 — CRITIQUE : Immutabilité du contenu des messages — WITH CHECK tautologique

**Source :** `supabase/migrations/029_create_messages.sql` lignes 51-63

**Description :**

La policy `update_messages_read_at` définit un `WITH CHECK` censé garantir que seul `read_at` peut être modifié :

```sql
WITH CHECK (
  content = content AND sender_id = sender_id AND is_system_message = is_system_message
)
```

Ces trois expressions comparent une colonne à elle-même. En SQL, `content = content` est toujours TRUE (sauf si `content` est NULL, auquel que ce soit NULL = NULL qui est FALSE — mais `content` est `NOT NULL`). Cette clause est donc une tautologie totale : elle ne contraint rien et permet la modification de n'importe quelle colonne.

**Vecteur d'attaque :**

Un participant authentifié peut envoyer un UPDATE sur un message qu'il a reçu (sender_id != auth.uid()) et modifier librement son contenu, son `sender_id` ou son flag `is_system_message`, contournant totalement la garantie RGPD d'immutabilité.

```sql
-- Attaque possible avec la policy actuelle :
UPDATE messages
SET content = 'contenu falsifié', is_system_message = true
WHERE id = '<id_message_reçu>';
-- Passe la USING clause (sender_id != auth.uid()) ✓
-- Passe le WITH CHECK tautologique ✓
```

**Correction recommandée :**

PostgreSQL ne permet pas de comparer les valeurs OLD et NEW dans un `WITH CHECK` de policy RLS. La solution correcte consiste à utiliser une colonne générée ou une fonction de déclenchement. Il existe deux approches :

**Option A (recommandée MVP)** — Trigger BEFORE UPDATE qui rejette toute modification autre que `read_at` :

```sql
CREATE OR REPLACE FUNCTION prevent_message_content_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.content IS DISTINCT FROM OLD.content
     OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
     OR NEW.is_system_message IS DISTINCT FROM OLD.is_system_message
     OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
  THEN
    RAISE EXCEPTION 'Les messages sont immutables (RGPD). Seul read_at peut être modifié.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_message_immutability
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION prevent_message_content_update();
```

**Option B (post-MVP)** — Remplacer la colonne `read_at` par une table séparée `message_reads`, rendant la table `messages` 100% en INSERT-only.

---

### F7 — HAUT : can_see_contact_info() — viewer_id non contraint à auth.uid()

**Source :** `supabase/migrations/031_profiles_contact_masking.sql` lignes 10-28

**Description :**

La fonction `can_see_contact_info(viewer_id UUID, profile_user_id UUID)` est marquée `SECURITY DEFINER` et accessible à tous les utilisateurs authentifiés via `GRANT EXECUTE ... TO authenticated`. Le paramètre `viewer_id` est libre : aucune vérification ne garantit que `viewer_id = auth.uid()`.

**Vecteur d'attaque :**

Un utilisateur authentifié peut appeler la fonction avec le UUID d'un autre utilisateur comme `viewer_id` et découvrir si deux autres personnes ont une relation de conversation active, révélant ainsi des informations relationnelles sans être lui-même participant :

```sql
-- Interrogation de la relation entre deux autres utilisateurs :
SELECT can_see_contact_info('uuid-user-A', 'uuid-user-B');
-- Retourne TRUE si A et B ont une conversation → fuite d'information
```

Ce vecteur est particulièrement sensible dans le contexte médical : un concurrent peut cartographier les collaborations entre praticiens.

**Correction recommandée :**

Modifier la fonction pour contraindre `viewer_id = auth.uid()`, ou créer une variante sans paramètre qui utilise directement `auth.uid()` :

```sql
CREATE OR REPLACE FUNCTION can_see_contact_info(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversations c
    WHERE (
      (c.participant_1_id = auth.uid() AND c.participant_2_id = profile_user_id)
      OR (c.participant_2_id = auth.uid() AND c.participant_1_id = profile_user_id)
    )
  );
END;
$$;
```

Si la signature à deux paramètres est conservée pour des usages serveur (service role), ajouter une vérification explicite :

```sql
IF viewer_id != auth.uid() THEN
  RAISE EXCEPTION 'viewer_id doit correspondre à l''utilisateur authentifié';
END IF;
```

---

### F9 — HAUT : Message d'accompagnement candidature — absence de re-sanitization dans le trigger

**Source :** `supabase/migrations/030_message_triggers.sql` lignes 44-47

**Description :**

Le trigger `create_conversation_on_accept()` réinsère le champ `NEW.message` de la candidature directement dans la table `messages` :

```sql
IF NEW.message IS NOT NULL AND length(trim(NEW.message)) > 0 THEN
  INSERT INTO messages (conversation_id, sender_id, content, created_at)
  VALUES (v_conv_id, NEW.remplacant_id, NEW.message, NEW.created_at);
END IF;
```

Ce contenu est actuellement sanitizé dans `candidature.service.ts` côté Edge Function avant insertion dans `candidatures`. Cependant :

1. Il n'existe aucune garantie au niveau de la base de données que `candidatures.message` est toujours sanitizé — si un futur flux bypass l'Edge Function (service role direct, script d'import, etc.), le contenu brut atterrirait dans `messages`.
2. La fonction `sanitizeText()` dans l'Edge Function est une sanitization basique (strip tags) sans encodage HTML systématique. Si la couche de rendu traite le contenu comme du HTML sans échappement, un payload `<img onerror=...>` résiduel pourrait passer.

**Vecteur d'attaque :**

Insertion directe en base via service role avec un message non sanitizé → réplication dans la messagerie lors de l'acceptation.

**Correction recommandée :**

Ajouter une sanitization au niveau PostgreSQL dans la fonction trigger. Une approche légère utilisant `regexp_replace` pour strip les patterns dangereux les plus courants :

```sql
-- Dans le trigger, avant l'insertion dans messages :
v_safe_message := regexp_replace(
  regexp_replace(NEW.message, '<[^>]*>', '', 'g'),
  'javascript:', '', 'gi'
);
INSERT INTO messages (..., content, ...) VALUES (..., v_safe_message, ...);
```

Alternativement, ajouter une contrainte `CHECK` au niveau de `candidatures.message` qui rejette les balises HTML.

---

### F10 — HAUT : Absence de l'Edge Function send-message et de la sanitization applicative

**Source :** Répertoire `supabase/functions/` — aucun fichier `send-message`

**Description :**

La checklist prévoit une sanitization du contenu des messages (NFR17 — strip HTML/JS avant insertion). L'architecture de JIM traite les écritures métier via Edge Functions. Or, aucune Edge Function `send-message` n'existe. Les messages peuvent donc être insérés directement via le client Supabase sans passer par une couche de sanitization applicative.

La policy RLS `insert_messages_own` vérifie les droits d'accès mais pas le contenu. La contrainte `CHECK (length(content) > 0 AND length(content) <= 2000)` vérifie uniquement la longueur.

Un utilisateur peut insérer via le SDK client :
```typescript
supabase.from('messages').insert({ content: '<script>alert(1)</script>' })
```

**Impact :** Si l'application de rendu affiche le contenu sans échappement, risque XSS. La colonne `contains_links` détecte les URLs mais pas les balises HTML.

**Correction recommandée :**

Créer l'Edge Function `send-message` selon le pattern établi dans le projet (authentification, validation Zod, sanitization, rate limiting via `check_message_rate_limit()`, puis insertion) — cette fonction est déjà architecturalement prévue (la migration 031 référence "l'Edge Function send-message" pour le rate limiting). Bloquer l'INSERT direct client par suppression de la policy `insert_messages_own` une fois l'Edge Function opérationnelle (qui utilisera le service role).

---

### F20 — HAUT : MESSAGE_RECU absent de la contrainte notification_event_type_check

**Source :** `supabase/migrations/030_message_triggers.sql` ligne 98 vs `027_notification_types_epic5.sql`

**Description :**

Le trigger `update_conversation_on_message()` insère des notifications de type `'MESSAGE_RECU'` dans `notification_queue`. Or, la contrainte `notification_event_type_check` sur cette table (mise à jour en migration 027) ne liste pas `'MESSAGE_RECU'` parmi les valeurs autorisées.

Cela signifie que chaque insertion de message réel déclenchera une violation de contrainte `CHECK` sur `notification_queue`, et la notification ne sera jamais enregistrée. Selon la gestion d'erreurs du trigger (qui n'a pas de bloc `EXCEPTION`), cela peut provoquer l'échec silencieux de toute la transaction d'insertion de message.

**Vecteur d'impact :** Chaque envoi de message échoue silencieusement ou fait échouer toute la transaction, rendant la messagerie non fonctionnelle en production.

**Correction requise :**

Créer une migration `032_notification_types_epic6.sql` qui ajoute `'MESSAGE_RECU'` à la contrainte :

```sql
ALTER TABLE notification_queue DROP CONSTRAINT IF EXISTS notification_event_type_check;
ALTER TABLE notification_queue ADD CONSTRAINT notification_event_type_check
  CHECK (event_type IN (
    -- [...valeurs existantes...]
    'MESSAGE_RECU'
  ));
```

---

## Points conformes

Les points suivants ne nécessitent aucune action :

- **F1 — RLS conversations SELECT** : Policy `select_conversations_own` correctement définie avec `participant_1_id = auth.uid() OR participant_2_id = auth.uid()`. Un utilisateur tiers ne peut pas voir les conversations.

- **F2 — RLS conversations INSERT impossible côté client** : Aucune policy INSERT n'est définie sur `conversations`. La création passe exclusivement par le trigger `create_conversation_on_accept()` en `SECURITY DEFINER`. Un appel direct `supabase.from('conversations').insert(...)` retourne une erreur RLS.

- **F3 — RLS messages SELECT via JOIN conversations** : La policy `select_messages_own` utilise un `EXISTS` avec JOIN sur `conversations`, garantissant qu'un utilisateur ne peut lire que les messages de ses propres conversations. L'isolation est totale : un utilisateur X ne peut pas voir les messages d'une conversation où il n'est pas participant.

- **F5 — RLS messages INSERT : injection is_system_message impossible** : La policy `insert_messages_own` comporte explicitement `AND NOT is_system_message`. Si un client envoie `{ is_system_message: true }`, la policy rejette l'insertion. Les messages système sont exclusivement créés par les triggers `SECURITY DEFINER`.

- **F6 — Absence de DELETE** : Aucune policy DELETE n'est définie sur `messages`. Conservation conforme à l'article 17 exception médicale du RGPD.

- **F11 — Chiffrement AES-256 au repos (NFR11)** : Supabase héberge les données sur AWS RDS avec chiffrement AES-256 au repos activé nativement sur l'ensemble du volume de stockage. Ce point est CONFORME au niveau infrastructure, sans action `pgcrypto` requise pour le MVP. Le chiffrement de bout en bout (E2EE) au niveau applicatif — qui protégerait les données même en cas de compromission de la base — constitue un objectif Phase 3, non requis pour le lancement.

- **F12 — Rate limiting messages 60/minute** : La fonction `check_message_rate_limit()` est correctement implémentée avec un incrément atomique (`INSERT ... ON CONFLICT DO UPDATE`) et une fenêtre à la minute. Elle est référencée dans la migration et doit être appelée depuis l'Edge Function `send-message` (point F10).

- **F13 — Payload notification_queue générique (NFR18)** : Le trigger `update_conversation_on_message()` insère uniquement `conversation_id` dans le payload, sans contenu de message, prénom ou données personnelles. Conforme à NFR18.

- **F14 — Trigger create_conversation : NEW.statut** : La migration 030 utilise correctement `NEW.statut` (colonne française de la table `candidatures`) et non `NEW.status`. Le champ `NEW.remplacant_id` est correctement référencé.

- **F15 — Trigger create_conversation : idempotent** : La clause `ON CONFLICT (candidature_id) DO NOTHING` garantit qu'un double appel du trigger (hypothèse de retry offline) ne crée pas de conversation dupliquée.

- **F18 — Injection is_system_message côté client** : Confirmé conforme (cf. F5).

- **F19 — Rate limiting création de conversations** : La contrainte `UNIQUE (candidature_id)` sur `conversations` empêche structurellement la création artificielle de conversations multiples pour une même candidature. Un utilisateur malveillant ne peut pas générer du spam conversationnel.

---

## Findings de sévérité MOYEN

### F8 — MOYEN : can_see_contact_info() — applicabilité côté serveur

**Source :** `supabase/migrations/031_profiles_contact_masking.sql` — commentaire ligne 3

La migration précise explicitement : *"Cette fonction est appelée côté serveur (Edge Functions) ou client pour conditionner l'affichage."* La RLS sur `profiles` n'est pas modifiée pour filtrer les colonnes coordonnées selon cette condition.

En conséquence, la protection des coordonnées (email, téléphone) repose sur un contrôle applicatif (côté client ou Edge Function) et non sur une contrainte de base de données. Si le client interroge directement `profiles` sans passer par la couche applicative, les coordonnées sont exposées si la RLS profiles les autorise.

**Action :** Valider que la RLS `profiles` masque effectivement les colonnes sensibles pour les utilisateurs non participants (column-level security ou vue filtrée). Si la décision est de déléguer au client, le documenter explicitement comme risque accepté pour le MVP.

### F16 — MOYEN : Typosquatting — domaines bloqués

**Statut :** NON IMPLÉMENTÉ

Aucune liste de domaines bloqués ni vérification anti-typosquatting n'est présente dans les migrations ou les Edge Functions. La colonne `contains_links BOOLEAN` détecte la présence d'un lien mais ne filtre pas les domaines malveillants.

**Action post-MVP :** Implémenter une allowlist/denylist de domaines dans l'Edge Function `send-message` ou une fonction de vérification appelée par le trigger.

---

## Findings de sévérité INFO

### F17 — INFO : Signalement message

**Statut :** NON IMPLÉMENTÉ

Aucune fonctionnalité de signalement de message (flag utilisateur) n'est implémentée. La colonne `flagged_phishing` est présente mais sa mise à jour est réservée aux Edge Functions de modération (non encore créées).

**Action post-MVP :** Créer une Edge Function `report-message` qui insère dans `notification_queue` un événement de type `MESSAGE_SIGNALE` sans exposer le contenu dans le payload (conformément à NFR18).

---

## Recommandations post-MVP (Phase 2 / Phase 3)

| Priorité | Recommandation | Justification |
|----------|---------------|---------------|
| Phase 2 | Remplacer la colonne `read_at` par une table `message_reads` | Messages 100% INSERT-only, simplifie les permissions RLS, meilleure scalabilité (multi-appareils) |
| Phase 2 | Column-level security sur `profiles` pour email/téléphone | Renforcer le masquage coordonnées au niveau DB plutôt qu'applicatif |
| Phase 2 | Allowlist domaines dans la messagerie | Anti-phishing renforcé, liste maintenue par l'équipe JIM |
| Phase 2 | Purge automatique `message_rate_limits` | Les anciennes fenêtres s'accumulent — ajouter un `pg_cron` de nettoyage quotidien |
| Phase 2 | Suppression logique des messages (soft delete) | Permettre à un utilisateur de "supprimer" un message pour lui-même sans le supprimer en base |
| Phase 3 | Chiffrement E2EE applicatif | Protéger les messages même en cas de compromission de la base Supabase |
| Phase 3 | Modération automatique anti-phishing | Edge Function de scan des liens avec un service tiers (ex : Google Safe Browsing) |
