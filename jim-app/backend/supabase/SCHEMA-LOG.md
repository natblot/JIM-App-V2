# Schema Log — JIM

## Migrations créées

### 007_add_professions.sql — 2026-03-20
- Table `professions` avec config JSONB par profession
- Seed kinésithérapie (première profession, code: 'kinesitherapie')
- RLS: SELECT public, ALL admin
- Trigger updated_at
- **Extension PostGIS** : CREATE EXTENSION IF NOT EXISTS postgis

### 008_profiles_base.sql — 2026-03-20
- Table `profiles` avec colonnes RPPS, CGU, Stripe, mobilité
- RLS: SELECT public (profils vérifiés), CRUD own
- Trigger updated_at
- Fonction handle_new_user() (auto-création profil à l'inscription)
- Trigger on_auth_user_created sur auth.users

### 010_rpps_reverify_cron.sql — 2026-03-22
- Table `notification_queue` (préparation Epic 7) : payload générique, channels push/email
- View `profiles_pending_reverify` : profils en attente de re-vérification
- RLS notification_queue : SELECT own, INSERT service_role

## pg_cron — Configuration manuelle dans Supabase Dashboard
Le Dashboard Supabase ne permet pas de configurer pg_cron via migrations.
Aller dans : Dashboard → Database → Extensions → pg_cron (activer si nécessaire)
Puis dans SQL Editor :

```sql
-- Re-vérification RPPS quotidienne à 3h UTC
SELECT cron.schedule(
  'reverify-rpps-batch',
  '0 3 * * *',
  $$
    SELECT net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/reverify-rpps-batch',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := '{}'::jsonb
    );
  $$
);
```

### 011_rls_policies.sql — 2026-03-22
- RLS profiles : policies consolidées (select_verified_public, select_own, insert_own, update_own, admin)
- Fonctions SQL : `has_verified_rpps()` (gate RPPS pour Epics 2+), `is_profile_owner()`
- RLS professions : ajout policy anon

## Fonctions SQL utilitaires

| Fonction | Usage |
|---|---|
| `has_verified_rpps()` | Gate RPPS — utilisée dans RLS Epics 2+ (annonces, candidatures) |
| `is_profile_owner(uuid)` | Vérifie ownership — utilisée dans RLS annonces |
| `handle_updated_at()` | Trigger updated_at — partagé par toutes les tables |
| `handle_new_user()` | Auto-create profile à l'inscription Supabase Auth |

## Tables et leurs RLS

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| professions | authenticated + anon (actives) | admin | admin | admin |
| profiles | authenticated (vérifiés) + own | own | own | admin |

## Variables d'environnement requises

Voir `.env.local.example` à la racine :
- `EXPO_PUBLIC_SUPABASE_URL` — URL du projet Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Clé anon (publique)
- `SUPABASE_SERVICE_ROLE_KEY` — Clé service role (Edge Functions UNIQUEMENT)

## Commandes utiles

```bash
# Générer les types TypeScript depuis le projet Supabase
npx supabase gen types typescript --project-id <project-id> > packages/shared/src/types/database.ts

# Appliquer les migrations localement
npx supabase db reset

# Vérifier le schéma distant
npx supabase db diff --schema public
```

## Epic 2 — Tables & fonctions

### Migrations ajoutées
- `013_create_annonces.sql` : table `annonces` (publication, statuts, géolocalisation PostGIS, source agrégation)
- `014_upgrade_notification_queue.sql` : amélioration `notification_queue` (recipient_id, event_type, priority, retry_count)
- `015_annonce_triggers.sql` : triggers métier (updated_at, notification ANNONCE_CREEE/URGENTE, fraîcheur)
- `016_retrocession_moyenne_function.sql` : fonction `get_retrocession_moyenne_zone(lat, lon, radius_km)`

### RLS Policies ajoutées
- `annonces_select_public` : lecture publique des annonces actives
- `annonces_select_own` : titulaire voit toutes ses annonces (y compris historique)
- `annonces_insert_titulaire` : insertion réservée aux titulaires RPPS vérifiés
- `annonces_update_own` : modification réservée au propriétaire
- `annonces_admin_all` : accès total pour les admins
- `notification_queue_select_own` : utilisateur ne voit que ses notifications (mise à jour pour recipient_id)

### Edge Functions déployées
- `create-annonce` : création annonce avec géocodage api-adresse.data.gouv.fr et calcul rétrocession moyenne
- `update-annonce` : modification et fermeture manuelle (statut → pourvue)

### Fonctions SQL
- `get_retrocession_moyenne_zone(lat, lon, radius_km)` : moyenne des rétrocessions dans un rayon (FR12)
- `notify_candidates_on_annonce_close()` : trigger pour notifier candidats (complété en Epic 5)
- `queue_annonce_creee_notification()` : trigger insertion notification_queue après création annonce
- `process_annonce_freshness()` : fonction à appeler par pg_cron pour les relances J-7/J-3/J0

### Note technique : imports Deno
Les Edge Functions utilisent `_shared/annonce.schema.deno.ts` (avec `npm:zod@3`) plutôt que d'importer depuis `packages/shared/src/validators/` — les packages npm Node.js ne sont pas directement importables dans l'environnement Deno sans le préfixe `npm:`.

### pg_cron à configurer manuellement (Dashboard Supabase)
```sql
-- Relances fraîcheur annonces (FR19) — à exécuter depuis le Dashboard Supabase > SQL Editor
SELECT cron.schedule('annonce-freshness-check', '0 8 * * *', $$
  SELECT process_annonce_freshness();
$$);
```

## Epic 3 — Agrégation d'Annonces Externes

### Migrations ajoutées
- `017_aggregation_tables.sql` : tables `aggregation_runs` (monitoring) et `aggregation_logs` (audit)
- `018_annonces_dedup_index.sql` : index déduplication + priorisation natives
- `019_notification_types_epic3.sql` : extension contrainte event_type (AGGREGATION_*)
- `020_annonces_profile_nullable.sql` : profile_id nullable pour les annonces agrégées

### RLS Policies ajoutées
- `aggregation_runs_admin_select` : admin only
- `aggregation_runs_service_insert` : service_role (Edge Functions)
- `aggregation_logs_admin_select` : admin only
- `aggregation_logs_service_insert` : service_role

### Edge Function déployée
- `aggregate-annonces` : handler HTTP → orchestrator → sources parallèles → deduplication → métriques

### Architecture pipeline
- Interface `AggregationSource` dans `_shared/aggregation/aggregation-source.interface.ts`
- Orchestrateur avec circuit breaker (3 échecs → pause 1h)
- Source Rempleo (scraping respectueux, rate limiting 1 req/s, User-Agent identifié)
- Déduplicateur (upsert par source+URL, fusion native↔agrégée, expiration 48h)
- Script batch `scripts/import-batch-rempleo.ts` (idempotent, dry-run supporté)

### pg_cron à configurer (Dashboard Supabase SQL Editor)
```sql
-- Agrégation toutes les 6h (NFR41)
SELECT cron.schedule(
  'aggregate-annonces-6h',
  '0 */6 * * *',
  $$SELECT net.http_post(
    url := 'https://xfgktshirllqesnwmwpm.supabase.co/functions/v1/aggregate-annonces',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  )$$
);
```

## Epic 9 — Paiement Sécurisé Stripe Connect

### Migrations ajoutées
- `044_profiles_stripe.sql` : colonnes `stripe_onboarding_status` (CHECK 4 valeurs), `is_pro` (BOOLEAN) sur profiles
- `045_create_paiements.sql` : table `paiements` (montants centimes INT, 7 statuts, source_montant, IDs Stripe, contrainte unique contrat, CHECK source ≠ destination)
- `046_create_abonnements_pro.sql` : table `abonnements_pro` (stripe_subscription_id, stripe_customer_id, 4 statuts, unique profile)
- `047_paiement_triggers.sql` : triggers notification (PAIEMENT_INITIE/CONFIRME/ECHOUE, LITIGE_OUVERT/RESOLU) avec insertion notification_queue
- `048_notification_types_epic9.sql` : extension contrainte event_type (+6 types Epic 9)

### RLS Policies ajoutées
- `paiements_select_parties` : les deux parties du paiement (titulaire OU remplaçant)
- `paiements_insert_titulaire` : seul le titulaire peut créer un paiement
- `paiements_update_service` : service_role pour les webhooks
- `paiements_update_remplacant_contest` : remplaçant peut contester (en_attente → conteste)
- `paiements_update_titulaire_draft` : titulaire peut modifier un brouillon ou ajuster après litige
- `abonnements_select_own` : chaque utilisateur voit son propre abonnement
- `abonnements_insert_service` / `abonnements_update_service` : service_role uniquement

### Edge Functions déployées
- `stripe-onboarding` : crée Connected Account Express + Account Link URL pour le KYC
- `create-payment` : calcul rétrocession + insert paiement en_attente_validation
- `stripe-webhook` : handler 6 events Stripe (signature vérifiée, idempotent)
- `create-subscription` : abonnement Pro 5,90€/mois (POST = souscrire, DELETE = annuler)

### Services partagés (_shared/stripe/)
- `stripe.service.ts` : onboarding (createConnectedAccount, createAccountLink), paiement (preparePayment, executePayment), abonnement (createProSubscription, cancelProSubscription)
- `stripe.webhook-handler.ts` : verifyWebhookSignature + handleWebhookEvent (6 handlers idempotents)
- `commission.calculator.ts` : calculateCommission (lancement=0%, gratuit=1%, pro=0%) + calculateRetrocession
- `stripe.types.ts` : PaiementRow, CreatePaymentParams, ConfirmPaymentParams

### Fonctions SQL triggers
- `on_paiement_confirmed()` : statut → confirme → set paid_at + INSERT notification_queue (haute priorité remplaçant)
- `on_paiement_initiated()` : statut → en_attente_validation, conteste, echoue → INSERT notification_queue

### Secrets Edge Functions à configurer (Settings > Edge Functions > Secrets)
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_test_xxx
```

## Epic 10 — Conformite RGPD & Securite

### Migrations ajoutees
- `049_create_audit_logs.sql` : table `audit_logs` (user_id SET NULL, action, resource_type/id, ip, user_agent, details JSONB, immutable)
- `050_create_rate_limits.sql` : table `rate_limits` (identifier, endpoint, compteurs fenetres glissantes, unique constraint)
- `051_create_account_deletions.sql` : table `account_deletions` (planning J+30, cancel_token UUID, 3 statuts)
- `052_create_config_mots_sensibles.sql` : table `config_mots_sensibles` + seed 16 mots sante
- `053_audit_functions.sql` : fonctions `log_audit()`, `check_rate_limit()`, `get_rate_limit_info()`
- `054_notification_types_epic10.sql` : extension contrainte event_type (+3 types Epic 10)

### RLS Policies ajoutees
- `audit_logs` : service_role INSERT + SELECT uniquement (immutable, pas d'acces utilisateur)
- `rate_limits` : service_role ALL uniquement
- `account_deletions` : SELECT own + service_role ALL
- `config_mots_sensibles` : SELECT public (authenticated, actif=true) + service_role ALL

### Edge Functions deployees
- `export-data` : collecte 11 tables RGPD, JSON → Supabase Storage → URL signee 48h, rate limited 1/jour
- `delete-account` : mode planification (user auth) + mode execution (service_role pg_cron), anonymisation
- `cancel-deletion` : annulation via cancel_token UUID

### Fonctions SQL
- `log_audit(user_id, action, resource_type, resource_id, ip, ua, details)` : INSERT audit_logs
- `check_rate_limit(identifier, endpoint, max, window)` : upsert compteur, retourne boolean
- `get_rate_limit_info(identifier, endpoint)` : retourne count/max/reset pour headers HTTP

### Services partages (_shared/)
- `rate-limiter.ts` : checkRateLimit(), rateLimitHeaders(), tooManyRequestsResponse(), RATE_LIMITS config
- `audit.ts` : logAudit(), extractRequestInfo(), AUDIT_ACTIONS constantes
