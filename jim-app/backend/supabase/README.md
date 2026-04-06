# Backend Supabase — JIM App V2

## Structure

```
supabase/
├── migrations/         # 66 migrations SQL (007 → 066)
├── functions/          # 24 Edge Functions (Deno)
│   ├── _shared/        # Services partages (stripe, audit, rate-limiter, etc.)
│   └── [function]/     # Chaque Edge Function dans son dossier
├── seed/               # Donnees de seed (dev)
├── tests/              # Rapports de tests RLS (par Epic)
├── config.toml         # Config Supabase locale
└── SCHEMA-LOG.md       # Historique des modifications de schema
```

## Edge Functions deployees (24)

| Fonction | Epic | Description |
|----------|------|-------------|
| verify-rpps | E1 | Verification RPPS via Annuaire Sante |
| search-rpps | E1 | Recherche RPPS par nom/prenom/ville |
| reverify-rpps-batch | E1 | Re-verification batch quotidienne |
| update-profile | E1 | Mise a jour profil |
| create-annonce | E2 | Publication annonce + geocodage |
| update-annonce | E2 | Modification + fermeture annonce |
| aggregate-annonces | E3 | Pipeline agregation sources externes |
| create-candidature | E5 | Candidature en 1 tap |
| process-candidature | E5 | Accepter/refuser candidature |
| withdraw-candidature | E5 | Retrait candidature |
| dispatch-notifications | E7 | Dispatcher push/email |
| generate-contrat | E8 | Generation contrat IA |
| stripe-onboarding | E9 | Onboarding Stripe Connect |
| create-payment | E9 | Creation paiement retrocession |
| stripe-webhook | E9 | Handler webhook Stripe (signature verifiee) |
| create-subscription | E9 | Abonnement Pro |
| export-data | E10 | Export RGPD (11 tables) |
| delete-account | E10 | Suppression compte (J+30) |
| cancel-deletion | E10 | Annulation suppression |
| create-avis | E11 | Notation post-remplacement |
| create-proposition | E11 | Proposition directe via favoris |
| respond-proposition | E11 | Reponse proposition |
| activate-parrainage | E11 | Parrainage + badge ambassadeur |
| create-signalement | E12 | Signalement contenu |
| moderate-content | E12 | Moderation admin |
| admin-dashboard-data | E12 | Metriques dashboard admin |
| create-support-ticket | E12 | Ticket support |

## pg_cron Jobs actifs

```sql
-- Epic 2 : Fraicheur annonces (tous les jours a 8h)
SELECT cron.schedule('annonce-freshness-check', '0 8 * * *',
  $$SELECT process_annonce_freshness()$$);

-- Epic 7 : Reset compteur push quotidien (minuit UTC)
SELECT cron.schedule('reset-daily-push-count', '0 0 * * *',
  $$UPDATE profiles SET daily_push_count = 0$$);

-- Epic 7 : Alerte calendrier obsolete (tous les jours a 8h)
SELECT cron.schedule('calendrier-outdated-alert', '0 8 * * *', ...);

-- Epic 10 : Nettoyage audit logs > 1 an (dimanche 3h)
SELECT cron.schedule('cleanup-audit-logs', '0 3 * * 0',
  $$DELETE FROM audit_logs WHERE created_at < now() - INTERVAL '1 year'$$);

-- Epic 10 : Nettoyage rate_limits expires (toutes les 30min)
SELECT cron.schedule('cleanup-rate-limits', '*/30 * * * *',
  $$DELETE FROM rate_limits WHERE window_start + window_duration < now()$$);

-- Epic 10 : Execution suppressions compte J+30 (tous les jours 4h)
SELECT cron.schedule('execute-account-deletions', '0 4 * * *', ...);
```

## Secrets Edge Functions (Dashboard > Edge Functions > Secrets)

| Secret | Requis par |
|--------|-----------|
| SUPABASE_URL | Auto-injecte |
| SUPABASE_ANON_KEY | Auto-injecte |
| SUPABASE_SERVICE_ROLE_KEY | Auto-injecte |
| ANNUAIRE_SANTE_API_KEY | verify-rpps, search-rpps |
| FCM_PROJECT_ID | dispatch-notifications |
| FCM_ACCESS_TOKEN | dispatch-notifications |
| STRIPE_SECRET_KEY | stripe-*, create-payment, create-subscription |
| STRIPE_WEBHOOK_SECRET | stripe-webhook |
| STRIPE_PRO_PRICE_ID | create-subscription |
