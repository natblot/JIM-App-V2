# CLAUDE.md — JIM (Job In Med)

## Identite du projet

JIM est une marketplace B2B mobile-first pour kinesitherapeutes francais (remplacants ↔ titulaires).
Domaine healthcare reglemente (RPPS, HDS, RGPD, Ordre MK).
**13 Epics completes** — MVP pret pour beta launch.
Historique des sprints : `docs/history/sprints.md`

## Structure du projet

```
jim-app/
├── backend/supabase/
│   ├── migrations/         # 79 migrations SQL (007 → 079)
│   ├── functions/          # 27 Edge Functions (Deno)
│   │   └── _shared/        # stripe/, audit.ts, rate-limiter.ts
│   └── tests/
├── frontend/
│   ├── apps/
│   │   ├── mobile/         # React Native / Expo SDK 54 (Expo Router)
│   │   └── web/            # Next.js 16.1 (landing + dashboard + admin)
│   └── packages/
│       ├── shared/src/     # hooks/ (53), validators/ (13 Zod), stores/, types/, adapters/
│       └── ui/src/         # 31 composants NativeWind v4
└── _bmad-output/planning-artifacts/  # prd.md, architecture.md, epics.md, ux-design-specification.md
```

Images UX de reference : `/Users/nathanblottiaux/Desktop/JIM App V2/Image/`

## Commandes

```bash
cd frontend/apps/mobile && npx expo start          # Mobile
cd frontend/apps/web && pnpm dev                   # Web
pnpm vitest run                                    # Tests (racine)
supabase db push --workdir backend/supabase        # Migrations
supabase functions deploy <name> --workdir backend/supabase  # Edge Functions
```

## Regles absolues

### Langue
- Code (variables, fonctions, types) : **ANGLAIS**
- Commentaires, commits, messages UI : **FRANCAIS**
- Commits : Conventional Commits francais (`feat(epic-N):`, `fix:`, `chore:`)
- Ton UI : collegue bienveillant qui connait le metier de kine

### TypeScript
- `strict: true` — ZERO `any`, ZERO `@ts-ignore`
- Types generes par `supabase gen types`
- Schemas Zod dans `@jim/shared/validators/` — source unique de validation
- Pas de barrel exports (sauf `@jim/ui`)

### Architecture hexagonale legere
- JAMAIS d'import direct de `@supabase/supabase-js` dans `apps/` — passer par `@jim/shared/adapters/`
- Chaque service externe derriere une interface

### Securite (NON NEGOCIABLE)

| Regle | Detail |
|-------|--------|
| RLS | Policy par role sur CHAQUE table. Lectures inter-users via `profiles_public` (vue projetee, colonnes publiques uniquement) |
| Zod | Validation client ET serveur (Edge Functions) |
| Rate limiting | 3 comptes/IP/jour, 100 req/h recherche — `table rate_limits` + `_shared/rate-limiter.ts` |
| Sanitization | Echappement HTML (`<>&"'`) de tous les champs texte libre avant INSERT |
| Push notifications | Payload generique UNIQUEMENT, zero donnee personnelle (NFR18) |
| Tokens | 15min access / 7j refresh, `expo-secure-store` sur mobile |
| RPPS | Gate obligatoire — aucun acces metier sans verification RPPS |
| Stripe cles | `sk_test_*` UNIQUEMENT avant HDS. `getStripe()` DOIT rejeter si la cle ne commence pas par `sk_test_` |
| Stripe webhook Deno | `constructEventAsync()` + `Stripe.createSubtleCryptoProvider()` — JAMAIS `constructEvent()` synchrone (incompatible Deno runtime). Ref : `_shared/stripe/stripe.webhook-handler.ts` |
| Stripe HTTP client Deno | `Stripe.createFetchHttpClient()` dans le constructeur — JAMAIS `node:http` |
| Montants financiers | TOUJOURS en centimes (INT), `Math.round()` pour l'arrondi |
| Audit logs | JAMAIS de mots de passe, tokens, IBAN, contenu messages |
| Mot "commission" | N'apparait JAMAIS dans l'UI → "frais de gestion" ou "service de securisation professionnelle" |

### UX & Design

- Design tokens dans `tailwind.config.js` — JAMAIS de couleurs en dur. Ref : `docs/design-tokens.css`
- Composants dans `@jim/ui` — NativeWind v4 + Reanimated + Gesture Handler
- Zones de tap minimum 44x44 points
- Contrastes 4.5:1 minimum
- Support tailles de police systeme
- App < 50 MB, cold start < 3s
- Pas d'emoji dans l'UI sauf demande explicite

### Strategie Responsive — Adaptive Multi-Breakpoint

Conception simultanee mobile/tablette/desktop (PAS "mobile-first").
Breakpoints : default(0) / xs(375) / sm(640) / md(768) / lg(1024) / xl(1280) / 2xl(1536).
Conteneur : `max-w-[1600px] mx-auto`.

### Donnees et API
- Lectures : client Supabase direct (`.from().select()`) — cachees par TanStack Query
- Ecritures metier : Edge Functions (`supabase.functions.invoke()`)
- Temps reel : Supabase Realtime Postgres Changes
- Format API : `{ data: result }` ou `{ error: { code, message } }`
- Dates : ISO 8601 UTC
- Edge Functions : ≤ 40 lignes dans `index.ts`, logique dans `_shared/`

### Tests
- Tests unitaires co-localises (Vitest)
- Tests RLS par Epic dans `supabase/tests/`
- 286+ tests passes

## Stack verrouillee

| Package | Version |
|---------|---------|
| Expo SDK | 54.x |
| NativeWind | 4.2.x |
| Tailwind CSS | 3.4.17 (PAS v4) |
| Next.js | 16.1.x |
| @supabase/supabase-js | 2.98.x |
| Zod | ^4.0.0 |
| TanStack Query | 5.90.x |
| Zustand | 5.0.x |
| Stripe SDK (Deno) | `stripe@14?target=deno` |

## Landing Page Web — Kanban Dashboard Conversationnel

Design retenu : Kanban Dashboard (PAS Airbnb marketplace).
- Police : **Manrope** (`next/font/google`, `--font-manrope`)
- Couleurs : `#ff7c5c` (corail), `#fdf6ed` (body bg beige chaud)
- Layout : dashboard fixe `h-screen overflow-hidden` (lg+), vertical empile (<lg)
- Header flottant : `fixed top-6`, centered `max-w-1280px`, 3 lignes (logo+auth | topic pills | search + CTA)
- Kanban 3 colonnes : Urgentes (orange) / Pres de moi (Haversine 50km) / Nouveau
- Sidebar : 320px (lg+), preferences + filtrage avance
- Footer : `fixed bottom-0`, glass morphism `bg-white/80 backdrop-blur-md`
- Self-exclusion : `profile_id != auth.uid()` silencieux sur le kanban
- Fichiers cles : `home-grid.tsx`, `listing-card.tsx`, `sidebar-preferences.tsx`, `categories-nav.tsx`

## Messagerie Web — Desktop View

- Route : `(app)/messages/page.tsx` — protege AuthGuard client-side
- Layout 4 panneaux : sidebar nav | conversations | chat | contact panel
- Realtime : Postgres Changes (INSERT/UPDATE messages + conversations)
- Optimistic updates < 200ms
- Pills contexte contrat/paiement dans le chat header

## Stripe Connect — Destination Charges

| Aspect | Choix |
|--------|-------|
| Pattern | Destination Charges (`transfer_data.destination`) |
| Connected Account | Express (Stripe gere KYC) |
| Commission | `application_fee_amount` (0 au lancement, 1% ensuite) |
| Sequestre | Applicatif — paiement cree apres accord des 2 parties (pas `capture_method: manual`) |
| Onboarding | Account Links → redirect |
| Webhooks | 6 events : `payment_intent.succeeded/failed`, `account.updated`, `invoice.payment_succeeded/failed`, `customer.subscription.deleted` |

## Decisions techniques cles

- 2026-03-20 : Restart complet (bug Supabase Storage bloquant)
- 2026-03-20 : pnpm workspace minimal (pas de Turborepo au MVP)
- 2026-03-26 : Schemas Zod Deno mirrores dans `_shared/*.schema.deno.ts`
- 2026-03-26 : Messages inseres via client direct (pas Edge Function) pour latence < 200ms
- 2026-04-10 : Security hardening (migration 072) : 31 functions search_path, 4 views security_invoker
- 2026-04-11 : Stripe webhook : constructEventAsync obligatoire en Deno
- 2026-04-16 : RLS profiles durcie : lectures inter-users via `profiles_public` uniquement (migration 076)
- 2026-04-16 : Algo kanban via RPC `landing_annonces` + Haversine client (migration 078)

## Actions manuelles requises

### pg_cron (Dashboard Supabase > SQL Editor)

11 jobs a configurer — voir `docs/history/sprints.md` section "pg_cron a configurer" pour le SQL complet.

### Secrets Edge Functions

```
FCM_SERVICE_ACCOUNT_B64=<service account Firebase (JSON encode base64)>
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_test_xxx
SUPPORT_EMAIL=<email support>
```

### Autres actions

1. Configurer deep links : Apple Team ID + Android SHA256
2. Creer bucket Storage `rgpd-exports` + `annonce-photos`
3. Configurer Vercel : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Configurer token Mapbox reel dans `.env.local`
5. Rotater `STRIPE_WEBHOOK_SECRET` avant prod (expose dans conversation Sprint P4-StripeFix)

## Tooling & Automation

### Routines Claude Code (3 routines cloud)

| Routine | Trigger | Frequence | Environnement | Connecteur |
|---------|---------|-----------|---------------|------------|
| **A — Nightly Security Scan** | Scheduled 03:00 UTC | 1/jour | `jim-supabase-readonly` | Slack #jim-dev |
| **B — PR Review** | `pull_request.opened` + `.synchronize` | Par PR | `jim-github-review` | GitHub inline |
| **C — pg_cron Health Check** | API POST | A la demande | `jim-supabase-readonly` | Slack + GitHub draft PR |

Prompts et configuration : `docs/routines/`
Quota : ≤ 15 runs/jour (plan Max)

### Sous-agents Claude Code

| Agent | Modele | Role |
|-------|--------|------|
| `auditor` | Opus 4.7 | Audit objectif (architecture, securite, decisions) |
| `prompt-expert` | Opus 4.7 | Redaction/revue de prompts production |

Fichiers : `~/.claude/agents/`

### ADRs

| ADR | Decision |
|-----|----------|
| [ADR-011](docs/adr/ADR-011-advisor-tool-decision.md) | Advisor tool : skip (aucun workload LLM en production) |
| [ADR-012](docs/adr/ADR-012-opus-4-7-migration.md) | Migration Opus 4.7 : CLAUDE.md restructure, agents mis a jour |

## Bugs connus non bloquants

| # | Severite | Description |
|---|---|---|
| BC-2 | Mineur | Warning React key dans ContractClauses |
| BC-4 | Cleanup | missions-section.tsx et listings-grid.tsx orphelins |
| BC-5 | Resolu | Scripts seed deplaces vers frontend/apps/web/scripts/ (hors src/) + gitignore |
| BC-6 | UX | dashboard/overview.tsx embed profiles a refactor en split query |
| BC-7 | Donnees | Annonce seed sans location PostGIS → "Pres de moi" vide |
| BC-8 | UX a11y | button sans type dans home-grid.tsx |
| BC-9 | Auth | /admin redirect sans ?redirect= |
| BC-10 | Carte | Mapbox token placeholder dans .env.local |
