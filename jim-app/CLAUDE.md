# CLAUDE.md — JIM (Job In Med)

## Identite du projet
JIM est une plateforme B2B Adaptive Multi-Breakpoint pour kinesitherapeutes francais.
Marketplace two-sided : remplacants <-> titulaires.
Domaine : healthcare reglemente (RPPS, HDS, RGPD, Ordre MK).
**13 Epics completes** — MVP pret pour beta launch.

## Structure du projet

```
jim-app/
├── backend/
│   ├── supabase/
│   │   ├── migrations/      # 61 migrations SQL (007 -> 067)
│   │   ├── functions/       # 27 Edge Functions (Deno)
│   │   │   └── _shared/     # stripe/, audit.ts, rate-limiter.ts
│   │   ├── tests/           # Rapports RLS par Epic
│   │   └── README.md        # Documentation backend (pg_cron, secrets)
│   └── scripts/             # Scripts batch (import CSV, etc.)
├── frontend/
│   ├── apps/
│   │   ├── mobile/          # React Native / Expo SDK 54
│   │   │   ├── app/                     # Expo Router (30+ ecrans)
│   │   │   │   ├── (app)/               # Ecrans authentifies
│   │   │   │   │   ├── annonce/         # Detail annonce
│   │   │   │   │   ├── calendrier/      # Calendrier disponibilites
│   │   │   │   │   ├── contrats/        # Contrats IA
│   │   │   │   │   ├── conversations/   # Messagerie
│   │   │   │   │   ├── notation/        # Notation post-remplacement
│   │   │   │   │   ├── paiements/       # Versement retrocession
│   │   │   │   │   ├── parametres/      # Settings (paiement, parrainage, rgpd, support)
│   │   │   │   │   ├── propositions/    # Propositions directes
│   │   │   │   │   └── profil-contact/  # Profil contact
│   │   │   │   └── (auth)/              # Ecrans non-authentifies
│   │   │   └── google-services.json     # Firebase config
│   │   └── web/             # Next.js 16.1 (landing + messagerie + admin)
│   │       └── src/
│   │           ├── app/
│   │           │   ├── (auth)/           # Login, Register (Sprint P0)
│   │           │   ├── (marketing)/      # Pages publiques (Header+Footer)
│   │           │   ├── (app)/            # Pages authentifiees (AuthGuard)
│   │           │   └── admin/            # Dashboard admin (E12)
│   │           ├── components/
│   │           │   ├── annonce/          # PostulerButton (Sprint P0)
│   │           │   ├── auth/            # AuthGuard (Sprint P0)
│   │           │   ├── landing/          # Cards, grid, search, pagination
│   │           │   ├── layout/           # Header (auth-aware), Footer
│   │           │   ├── messaging/        # Messagerie (E6)
│   │           │   └── providers/        # AuthProvider, QueryProvider
│   │           └── lib/                  # Supabase SSR/browser clients, SEO
│   └── packages/
│       ├── shared/
│       │   └── src/
│       │       ├── adapters/            # Supabase client, offline store
│       │       ├── constants/           # Notification types, annonce status, blocked domains
│       │       ├── hooks/               # 53 hooks (TanStack Query)
│       │       ├── stores/              # Zustand (auth, ui, offline)
│       │       ├── types/               # Database (auto-gen), contrat, paiement
│       │       ├── utils/               # CSV parser, phishing detector, sensitive keywords
│       │       └── validators/          # 13 schemas Zod
│       └── ui/
│           └── src/                     # 31 composants (NativeWind v4)
└── .env.local.example
```

## Documents de reference
- PRD : `../_bmad-output/planning-artifacts/prd.md`
- Architecture : `../_bmad-output/planning-artifacts/architecture.md`
- UX Design : `../_bmad-output/planning-artifacts/ux-design-specification.md`
- Epics : `../_bmad-output/planning-artifacts/epics.md`
- Images UX : `/Users/nathanblottiaux/Desktop/JIM App V2/Image/`

## Commandes de dev

```bash
# Mobile
cd frontend/apps/mobile && npx expo start

# Web
cd frontend/apps/web && pnpm dev

# Tests (depuis la racine)
pnpm vitest run

# Supabase (depuis la racine, avec --workdir)
supabase db push --workdir backend/supabase
supabase functions deploy <name> --workdir backend/supabase
supabase functions list --workdir backend/supabase
supabase secrets set KEY=VALUE      # Configurer un secret
supabase migration list             # Etat des migrations
```

## Regles absolues

### Langue
- Code : ANGLAIS (variables, fonctions, composants, types)
- Commentaires : FRANCAIS
- Commits : FRANCAIS, Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`)
- Messages utilisateur : FRANCAIS, ton collegue bienveillant
- Logs : ANGLAIS

### TypeScript
- `strict: true` — JAMAIS de `any`, JAMAIS de `@ts-ignore`
- Types generes par Supabase CLI (`supabase gen types`)
- Schemas Zod dans `@jim/shared/validators/` — source unique de validation
- Pas de barrel exports (sauf `@jim/ui`)

### Architecture hexagonale legere
- JAMAIS d'import direct de `@supabase/supabase-js` dans `apps/` — via `@jim/shared/adapters/`
- Les modules metier sont des packages TypeScript purs
- Chaque service externe derriere une interface

### Securite (NON NEGOCIABLE)
- RLS sur CHAQUE table — policies par role (remplacant/titulaire/admin)
- Zod validation cote client ET cote serveur (Edge Functions)
- Rate limiting : 3 comptes/IP/jour, 100 req/h recherche (table `rate_limits`)
- Sanitization de TOUS les champs texte libre
- Push notifications : payload generique UNIQUEMENT, zero donnee personnelle
- Tokens : 15min access / 7j refresh, expo-secure-store sur mobile
- RPPS = gate obligatoire
- Stripe : cles `sk_test_*` UNIQUEMENT avant HDS, verification au runtime
- Webhook Stripe : signature verifiee avec `constructEvent()`, idempotent
- Montants financiers : TOUJOURS en centimes (INT), `Math.round()` pour l'arrondi
- Audit logs : JAMAIS de mots de passe, tokens, IBAN, contenu messages

### Strategie Responsive — Adaptive Multi-Breakpoint
- **Approche** : Adaptive Multi-Breakpoint (PAS "mobile-first") — conception simultanee mobile/tablette/desktop
- **Breakpoints** : default(0) / xs(375) / sm(640) / md(768) / lg(1024) / xl(1280) / 2xl(1536)
- **Layout landing** : Kanban dashboard `h-screen` — sidebar 320px (lg+) + kanban horizontal 3 colonnes (Urgentes/Pres de moi/Nouveau)
- **Images** : `h-28 rounded-xl object-cover`, lazy loading
- **Animations** : staggered card reveal (class `.annonce-card`), `prefers-reduced-motion` respecte
- **Design tokens** : variables CSS custom (`--jim-*`) dans `globals.css` pour couleurs, spacing, motion, shadows
- **Typographie** : Manrope (Google Fonts), `clamp()` pour scaling fluide
- **Conteneur** : `max-w-[1600px] mx-auto`, header flottant `max-w-[1280px]`
- Zones de tap minimum 44x44 points
- Support tailles de police systeme
- Contrastes 4.5:1 minimum
- App < 50 MB, cold start < 3s

### UX Design
- Design tokens dans `tailwind.config.js` racine — JAMAIS de couleurs en dur
- Composants dans `@jim/ui` — NativeWind v4 + Reanimated + Gesture Handler
- Ton : collegue bienveillant qui connait le metier de kine
- Le mot "commission" n'apparait JAMAIS dans l'UI -> "frais de gestion" ou "service de securisation"

### Donnees et API
- Lectures : client Supabase direct (`.from().select()`) — cachees par TanStack Query
- Ecritures metier : Edge Functions (`supabase.functions.invoke()`)
- Temps reel : Supabase Realtime Postgres Changes
- Format API : `{ data: result }` ou `{ error: { code, message } }`
- Dates : ISO 8601 UTC

### Tests
- Tests unitaires co-localises (Vitest)
- Tests RLS par Epic dans `supabase/tests/`
- Tests Zod validation par schema
- 120+ tests passes

### Git
- Conventional Commits en francais
- Format : `feat(epic-N): description`

### Design Tokens JIM — Palette Orange Pastel (v2.0, avril 2026)
```css
/* === Typographie === */
/* Principale : Manrope (Google Fonts) — geometrique moderne, variable */
--font-primary: 'Manrope', system-ui, sans-serif;

/* === Orange principal === */
--jim-primary:        oklch(0.65 0.14 45);   /* #E8844A — CTA, icones actives */
--jim-primary-mid:    oklch(0.73 0.10 45);   /* #F0A07A — hover, variante */
--jim-primary-soft:   oklch(0.82 0.07 45);   /* #F7C5A0 — separateurs, accents */
--jim-primary-pale:   oklch(0.93 0.03 45);   /* #FDEADE — backgrounds chips/badges */

/* === Accents === */
--jim-accent:         oklch(0.57 0.17 38);   /* #D4603A — orange brule, highlights */
--jim-accent-warm:    oklch(0.78 0.12 60);   /* #F5B86A — ambre/miel */

/* === Surfaces & fonds === */
--jim-background:     oklch(0.98 0.008 55);  /* #fdf6ed — fond global beige chaud */
--jim-surface:        oklch(1.00 0.00 0);    /* #FFFFFF — carte, modal */
--jim-surface-alt:    oklch(0.95 0.02 50);   /* #FBF0E8 — surface secondaire */

/* === Sable orange === */
--jim-beige-dark:     oklch(0.83 0.04 52);   /* #DCBFA0 */
--jim-beige-mid:      oklch(0.88 0.03 52);   /* #EDD9C4 — bordure */
--jim-beige-light:    oklch(0.93 0.02 52);   /* #F7EDE0 */

/* === Texte === */
--jim-text:           oklch(0.20 0.04 45);   /* #3A1F08 — titres */
--jim-text-body:      oklch(0.30 0.04 42);   /* #5A3418 — corps */
--jim-muted:          oklch(0.52 0.06 45);   /* #96694A — secondaire */
--jim-border:         oklch(0.88 0.03 52);   /* #EDD9C4 — separateurs */

/* === Semantique === */
--jim-success:        oklch(0.63 0.07 148);  /* #6B9E72 — vert sauge */
--jim-success-bg:     oklch(0.95 0.03 148);  /* #EAF3EB */
--jim-warning:        oklch(0.65 0.12 70);   /* #C8882A — ambre */
--jim-warning-bg:     oklch(0.96 0.04 70);   /* #FBF0DC */
--jim-destructive:    oklch(0.53 0.14 28);   /* #C45040 — rouge orange */
--jim-destructive-bg: oklch(0.95 0.03 28);   /* #FAEBE8 */

/* === Ombres (warm-tinted orange, jamais bleu-gris) === */
--jim-shadow:         0 2px 16px 0 rgba(58,31,8,0.08);
--jim-shadow-hover:   0 4px 28px 0 rgba(58,31,8,0.15);

/* === Rayons === */
--jim-radius-sm: 8px;
--jim-radius:    16px;
--jim-radius-lg: 24px;
--jim-radius-xl: 36px;
```
> Charte graphique complete : `jim-brand-guide.html` - Logos : `jim-logo-icon.png`, `jim-logo-horizontal.png`

### Landing Page Web (Epic 13) — Kanban Dashboard Conversationnel
- Maquette de reference : maquette HTML "Conversational Search" (kanban + search conversationnelle)
- **Le design retenu est le style Kanban Dashboard** : header flottant, search conversationnelle, sidebar preferences, colonnes kanban
- Police : **Manrope** (pas Inter) — `next/font/google`, variable `--font-manrope`
- Couleurs brand : `#ff7c5c` (corail), `#fdf6ed` (body bg beige chaud)
- Icones : lucide-react + Material Symbols (tune icon)
- Layout : dashboard fixe `h-screen overflow-hidden`, grid `[320px_1fr]` (sidebar + kanban)
- Structure : `frontend/apps/web/src/`
  - `components/layout/header.tsx` — **header flottant** (`fixed top-6`, centered max-w-1280px) : 3 lignes (logo+auth bubble | topic pills | search conversationnelle + CTA "Publier une annonce")
  - `components/layout/footer.tsx` — **fixed bottom** glass morphism (`bg-white/80 backdrop-blur-md`), liens legaux uppercase
  - `components/landing/categories-nav.tsx` — **topic pills** centrees (uppercase, sans icones, `bg-white/60 backdrop-blur`, active = `bg-white text-brand`)
  - `components/landing/sidebar-preferences.tsx` — **NOUVEAU** sidebar gauche : carte Preferences (localisation + toggle prix) + carte Filtrage avance (honoraires, logement, tous filtres)
  - `components/landing/home-grid.tsx` — **kanban board horizontal** 3 colonnes : Urgentes (orange) / Pres de moi (bleu) / Nouveau (vert), scroll vertical par colonne, class `.kanban-column`
  - `components/landing/listing-card.tsx` — **kanban card** : `rounded-[24px] p-4`, image `h-28 rounded-xl`, titre+prix inline, location MapPin, tag pills, class `.annonce-card` (stagger animation)
  - `components/landing/filters-panel.tsx` — panel droit filtres avances (tri, retrocession slider, type cabinet, specialites)
  - `components/landing/search-overlay.tsx` — modal recherche ville autocomplete + dates
  - `components/landing/floating-map-button.tsx` — bouton fixe `bg-slate-800` dark style, `bottom-24 right-8`
  - `components/landing/banners.tsx` — DEPRECIE (logique deplacee dans sidebar-preferences)
  - `components/landing/listings-grid.tsx` — DEPRECIE (remplace par home-grid kanban)
  - `components/landing/pagination.tsx` — DEPRECIE (kanban ne pagine pas, charge 50 annonces)
- Images : `next/image` avec domaines `lh3.googleusercontent.com` + `xfgktshirllqesnwmwpm.supabase.co` dans `next.config.ts`
- Max width layout : `1600px` avec sidebar 320px

### Messagerie Web (Epic 6) — Desktop View
- Route : `/messages` — `force-dynamic`, page authentifiee
- **Route groups Next.js** : `(marketing)/` pour pages publiques (Header+Footer), `(app)/` pour pages authentifiees (plein ecran + QueryProvider)
- Layout plein ecran 4 panneaux : sidebar navigation | liste conversations | chat | panneau contact (toggle)
- Providers : `QueryProvider` (TanStack Query) dans `(app)/layout.tsx`
- Client Supabase browser : `lib/supabase-browser.ts` — lazy init via `@jim/shared/adapters/`
- Hooks integres depuis `@jim/shared` : `useConversations`, `useMessages`, `useSendMessage`, `useMarkAsRead`
- Realtime : Supabase Postgres Changes (INSERT/UPDATE messages + conversations)
- Optimistic updates < 200ms sur envoi de messages
- Icones : lucide-react (coherent avec le reste du web)
- Structure : `frontend/apps/web/src/`
  - `components/messaging/messages-view.tsx` — composant principal client (orchestration)
  - `components/messaging/messaging-sidebar.tsx` — barre laterale navigation (logo + icones)
  - `components/messaging/conversation-list.tsx` — liste conversations + recherche + badge unread
  - `components/messaging/chat-view.tsx` — zone chat (header + messages + input)
  - `components/messaging/message-bubble.tsx` — bulle message (envoyee/recue/systeme)
  - `components/messaging/message-input.tsx` — saisie message (Enter pour envoyer, PJ, micro, emoji)
  - `components/messaging/contact-panel.tsx` — profil contact, missions, fichiers partages
  - `components/messaging/empty-chat.tsx` — etat vide
  - `components/providers/query-provider.tsx` — TanStack Query provider

---

## Audit Codebase — 2026-03-31

### Fichiers analyses

| Categorie | Nombre |
|-----------|--------|
| Fichiers TS/TSX (hors node_modules) | ~296 |
| Migrations SQL | 66 |
| Edge Functions | 24 (+ 4 fichiers _shared) |
| Hooks partages | 53 |
| Schemas Zod | 13 |
| Composants UI | 31 |
| Ecrans mobile | ~30 |
| Pages web | 10 |
| Tests | ~35 fichiers |

### Repertoires vides supprimes (8)

`packages/shared/api-client/`, `packages/shared/tokens/`, `packages/shared/adapters/`, `packages/shared/constants/`, `packages/shared/hooks/`, `packages/shared/stores/`, `packages/shared/types/`, `packages/shared/validators/` — tous vides, code reel dans `src/`.

### Corrections appliquees

| Fichier | Correction |
|---------|-----------|
| `packages/shared/src/hooks/useAlerteSimilaire.ts` | `console.log` supprime (code de debug) |
| `packages/shared/src/hooks/useAvisProfile.ts` | `(a: any)` -> `(a: AvisRow)` (respect strict: true) |
| `packages/shared/src/hooks/useSwitchRole.ts` | `(c: any)` -> type structure explicite (respect strict: true) |
| `packages/shared/src/constants/index.ts` | Ajout export `blocked-domains.ts` (manquant) |
| `.env.local.example` | Ajout FCM_PROJECT_ID, FCM_ACCESS_TOKEN, SUPPORT_EMAIL |

### Problemes restants a traiter manuellement

#### Critique
1. **Migrations non appliquees sur le distant** — Les migrations 024-048 et 055-066 sont marquees "applied" dans le tracking mais n'ont jamais ete executees sur le DB distant. **Appliquer via Dashboard Supabase > SQL Editor** dans l'ordre.
2. **Profil admin a creer** — Aucun profil avec `role = 'admin'` n'existe. Executer : `UPDATE profiles SET role = 'admin' WHERE email = 'votre-email@...';`
3. **Deep links a configurer** — `TEAM_ID` dans `apple-app-site-association` et SHA256 dans `assetlinks.json` sont des placeholders.

#### Non-critique
4. **21 `any` dans les Edge Functions Deno** — Le SDK Supabase Deno n'a pas les memes types que le SDK Node. Garder `any` pour `supabaseAdmin` est acceptable dans ce contexte.
5. **Test file mislabele** — `constants/message-types.test.ts` teste en realite `blocked-domains`. Renommer si souhaite.
6. **Bucket Storage manquant** — `rgpd-exports` (pour l'export RGPD) doit etre cree dans Dashboard > Storage.

### Prochaines etapes recommandees
1. Appliquer les migrations manquantes sur le DB distant via SQL Editor
2. Deployer le site web sur Vercel (`apps/web/`)
3. Configurer les deep links (Apple Team ID + Android SHA256)
4. Creer le bucket Storage `rgpd-exports`
5. Creer le profil admin Nathan
6. Tester le flow complet en sandbox : inscription -> annonce -> candidature -> contrat -> paiement
7. Preparer le beta launch : inviter les premiers kinesitherapeutes testeurs

---

## Audit Landing Page — 2026-04-04 (post Sprint P0)

### Score global : 66 / 82 fonctionnalites operationnelles (80%)

```
Avant Sprint P0     : 32/82 (39%)
Apres Sprint P0     : 49/82 (60%)  +17 fonctionnalites branchees
Apres Sprint P0-Fix : 60/82 (73%)  +11 corrections appliquees
Apres Sprint P1     : 66/82 (80%)  +6 fonctionnalites ajoutees
```

### Synthese par categorie (mise a jour post Sprint P1)

| Categorie | Operationnel | Facade | Absent | Total |
|---|---|---|---|---|
| A. Auth & Session | 9 | 0 | 1 | 10 |
| B. Recherche & Filtrage | 9 | 0 | 0 | 9 |
| C. Grille & Cartes | 7 | 3 | 2 | 12 |
| D. Carte geographique | 0 | 0 | 8 | 8 |
| E. Detail annonce | 8 | 1 | 1 | 10 |
| F. Messagerie | 10 | 1 | 0 | 11 |
| G. Pages marketing & SEO | 9 | 0 | 0 | 9 |
| H. Header/Footer/Nav | 5 | 2 | 0 | 7 |
| I. Admin | 1 | 3 | 2 | 6 |
| **TOTAL** | **58** | **10** | **14** | **82** |

### Constats cles (post Sprint P1)
1. **Recherche complete** — Ville + dates + filtres avances (retrocession min, type cabinet, specialite) + tri (date, retrocession)
2. **Detail annonce enrichi** — Profil titulaire (prenom, RPPS, score, anciennete) + annonces similaires (RPC geo)
3. **Filtres avances** — Panneau lateral avec retrocession slider, type cabinet, specialites, tri
4. **RPPS badge fixe** — Conditionnel sur source native (gate obligatoire = RPPS verifie)
5. **MOCK_LISTINGS supprime** — Fichier orphelin listings-grid.tsx supprime
6. **Score 80%** — Les 14 items restants sont majoritairement carte geo (8) + admin avance (4) + facades cosmetiques (2)

### Inventaire fichiers web (post Sprint P0)

#### Routes & Pages (`app/`)

| Fichier | Hooks @jim/shared | Appels Supabase | Statut |
|---------|-------------------|-----------------|--------|
| `layout.tsx` (root) | Non | Non | OK — QueryProvider + AuthProvider globaux |
| `manifest.ts` | Non | Non | OK |
| `robots.ts` | Non | Non | OK |
| `sitemap.ts` | Non | **Oui** | OK — /calculateur retire |
| `(auth)/layout.tsx` | Non | Non | **NOUVEAU** — layout auth centre + Suspense |
| `(auth)/login/page.tsx` | **Oui** (`useSignIn`) | **Oui** | **NOUVEAU** — Zod validation, redirect param |
| `(auth)/register/page.tsx` | **Oui** (`useSignUp`, `useRppsVerify`) | **Oui** | **NOUVEAU** — 3 etapes role/identite/RPPS |
| `(marketing)/layout.tsx` | Non | Non | MODIFIE — Suspense autour du Header |
| `(marketing)/page.tsx` | Non | **Oui** | MODIFIE — HomeGrid + Pagination + searchParams |
| `(marketing)/a-propos/page.tsx` | Non | Non | OK |
| `(marketing)/fonctionnalites/page.tsx` | Non | Non | OK |
| `(marketing)/tarifs/page.tsx` | Non | Non | OK |
| `(marketing)/messages/page.tsx` | Non | **Oui** | OK |
| `(marketing)/annonce/[id]/page.tsx` | Non | **Oui** | MODIFIE — PostulerButton integre |
| `(marketing)/invite/[code]/page.tsx` | Non | **Oui** | OK |
| `(app)/layout.tsx` | Non | Non | MODIFIE — AuthGuard (plus de QueryProvider) |
| `admin/*` (4 pages) | Non | **Oui** | FACADE — fetch reels mais aucun auth gate |

#### Composants (`components/`) — nouveaux + modifies

| Fichier | Hooks @jim/shared | Statut |
|---------|-------------------|--------|
| `providers/auth-provider.tsx` | **Oui** (onAuthStateChange) | **NOUVEAU** — user/session/supabase context |
| `providers/query-provider.tsx` | Non | OK |
| `auth/auth-guard.tsx` | **Oui** (useAuthContext) | **NOUVEAU** — redirect /login si pas de session |
| `layout/header.tsx` | **Oui** (`useSignOut`, `useCurrentProfile`) | **REECRIT** — auth-aware, menu dropdown, search overlay |
| `landing/home-grid.tsx` | **Oui** (`useSearchAnnonces`) | **NOUVEAU** — grille hybride SSR + recherche client |
| `landing/search-overlay.tsx` | **Oui** (`useVilleAutocomplete`) | **NOUVEAU** — modal autocomplete ville |
| `landing/pagination.tsx` | Non | **NOUVEAU** — pagination SEO-friendly |
| `annonce/postuler-button.tsx` | **Oui** (`useCreateCandidature`, `useIncompatibilityCheck`) | **NOUVEAU** — auth + form + warnings |
| `messaging/*` (8 fichiers) | **Oui** | OK — inchange |

#### Fichiers supprimes (Sprint P0)

| Fichier | Raison |
|---------|--------|
| `app/page.tsx` (racine V1) | Vestige layout marketing classique |
| `app/a-propos/page.tsx` | Doublon de (marketing)/a-propos |
| `app/fonctionnalites/page.tsx` | Doublon |
| `app/tarifs/page.tsx` | Doublon |
| `app/invite/[code]/page.tsx` | Doublon |
| `app/annonce/[id]/page.tsx` | Doublon |
| `app/calculateur/page.tsx` | Directive suppression |
| `app/(marketing)/calculateur/page.tsx` | Directive suppression |
| `components/calculateur/retrocession-calculator.tsx` | Directive suppression |

#### Lib (`lib/`)

| Fichier | Appels Supabase | Description |
|---------|-----------------|-------------|
| `seo.ts` | Non | Helpers metadata + JSON-LD |
| `supabase-browser.ts` | Non (factory) | Client Supabase browser lazy-init via @jim/shared |
| `supabase-server.ts` | **Oui** (3 queries) | MODIFIE — `fetchActiveAnnonces(limit, offset)` retourne `{ annonces, total }` avec count exact |

### Evaluation detaillee par fonctionnalite (post Sprint P0)

#### A. Authentification & Session Web (7/10 operationnel)

| # | Fonctionnalite | Statut | Notes |
|---|---|---|---|
| A1 | Page connexion (login) | **OK** | `useSignIn` + Zod `signInSchema` + redirect param |
| A2 | Page inscription | **OK** | 3 etapes role/identite/RPPS, `useSignUp` |
| A3 | Verification RPPS inscription | **OK** | `useRppsVerify` + Edge Function `verify-rpps` |
| A4 | Middleware routes protegees | **ABSENT** | AuthGuard client-side uniquement, pas de middleware.ts |
| A5 | Session Supabase SSR | **OK** | `lib/supabase-server.ts` + `lib/supabase-browser.ts` |
| A6 | Redirection post-login par role | **OK** | `?redirect=` param lu dans login page |
| A7 | Deconnexion | **OK** | `useSignOut` dans dropdown menu header |
| A8 | Mot de passe oublie | **ABSENT** | Pas de page reset-password |
| A9 | Menu utilisateur (avatar header) | **OK** | Initiales dynamiques, dropdown Messages/Settings/Logout |
| A10 | Etat connecte vs deconnecte header | **OK** | Conditionnel : boutons login/register vs avatar+menu |

#### B. Recherche & Filtrage (4/9 operationnel)

| # | Fonctionnalite | Statut | Notes |
|---|---|---|---|
| B1 | Barre recherche pilule (header) | **OK** | Ouvre SearchOverlay au clic, affiche ville active |
| B2 | Recherche par ville/localisation | **OK** | `useSearchAnnonces` geo + `useVilleAutocomplete` |
| B3 | Recherche par dates | ABSENT | Pas de champs dates dans la recherche |
| B4 | Autocomplete villes | **OK** | api-adresse.data.gouv.fr, debounce 300ms |
| B5 | Filtres avances | ABSENT | Bouton "Filtres" sans handler |
| B6 | Tri | ABSENT | |
| B7 | Sync filtres <> URL query params | **OK** | `?ville=...&lat=...&lng=...&r=...&page=...` |
| B8 | Etat vide "Aucun resultat" | FACADE | HomeGrid affiche un message + bouton "Voir toutes les annonces" |
| B9 | Pagination | **OK** | SSR offset/count + composant Pagination SEO-friendly (20/page) |

#### C. Grille d'Annonces & Cartes (6/12 operationnel)

| # | Fonctionnalite | Statut | Notes |
|---|---|---|---|
| C1 | Grille responsive 1>2>3>4 col | **OK** | `home-grid.tsx` via `listing-card.tsx` |
| C2 | Carte annonce (image, localisation, prix) | **OK** | `annonceToListing()` dans home-grid.tsx |
| C3 | Images reelles Supabase Storage | FACADE | Fallback PLACEHOLDER_IMAGES (URLs Google) |
| C4 | Badge RPPS verifie | FACADE | Affiche sur toutes les cartes, jamais conditionnel |
| C5 | Badge urgent | **OK** | Conditionnel sur `listing.isUrgent` |
| C6 | Badge source (native vs Rempleo) | ABSENT | |
| C7 | Dots carrousel images | FACADE | 5 dots statiques |
| C8 | Hover animation | **OK** | `group-hover:scale-105 transition-transform` |
| C9 | Staggered reveal animation | **OK** | CSS keyframes dans globals.css |
| C10 | Donnees reelles (fetch Supabase) | **OK** | SSR `fetchActiveAnnonces` + search client |
| C11 | Navigation categories | FACADE | Active state fonctionne mais ne filtre rien |
| C12 | Bouton flottant "Voir la carte" | FACADE | Lien vers /messages (pas la carte!) |

#### D. Carte Geographique (0/8 operationnel)

Inchange. Aucun composant carte. Hook `useMapAnnonces` disponible mais non branche.

#### E. Page Detail Annonce (6/10 operationnel)

| # | Fonctionnalite | Statut | Notes |
|---|---|---|---|
| E1 | Route `/annonce/[id]` | **OK** | SSR `fetchAnnonceById` |
| E2 | SSR/SSG pour SEO | **OK** | `generateMetadata()` |
| E3 | Schema.org JobPosting | **OK** | JSON-LD |
| E4 | Galerie images | FACADE | Placeholder images deterministes |
| E5 | Infos completes | **OK** | Donnees reelles, format fr-FR |
| E6 | Bouton "Postuler" | **OK** | `PostulerButton` — auth gate + form + `useCreateCandidature` + warnings incompatibilites |
| E7 | Bouton "Contacter" | ABSENT | Redirige vers stores pour annonces externes |
| E8 | Mini-carte localisation | ABSENT | |
| E9 | Profil titulaire | ABSENT | |
| E10 | Annonces similaires | ABSENT | |

#### F. Messagerie Web (10/11 operationnel) — inchange

#### G. Pages Marketing & SEO (9/9 operationnel) — inchange

#### H. Header, Footer, Navigation (5/7 operationnel)

| # | Fonctionnalite | Statut | Notes |
|---|---|---|---|
| H1 | Header sticky glass | **OK** | |
| H2 | Logo "jim" cliquable | **OK** | |
| H3 | Barre recherche pilule | **OK** | Ouvre SearchOverlay, affiche ville active |
| H4 | Avatar/menu utilisateur | **OK** | Auth-aware, initiales, dropdown |
| H5 | Footer liens legaux | **OK** | |
| H6 | Footer langue/devise/support | FACADE | Selecteurs UI-only |
| H7 | Bannieres | FACADE | Toggle sans effet |

#### I. Admin Web (0/6 operationnel) — inchange

### Plan d'action priorise

#### P0 — Bloquant beta launch — FAIT (Sprint 2026-04-04)

| # | Fonctionnalite | Statut | Fichier cree/modifie |
|---|---|---|---|
| 1 | Page connexion (login) | **FAIT** | `(auth)/login/page.tsx` |
| 2 | Page inscription + RPPS | **FAIT** | `(auth)/register/page.tsx` (3 etapes) |
| 3 | Protection routes auth | **PARTIEL** | `auth-guard.tsx` (client-side), middleware.ts absent |
| 4 | Etat connecte/deconnecte header | **FAIT** | `header.tsx` reecrit + `auth-provider.tsx` |
| 5 | Recherche connectee (ville) | **FAIT** | `search-overlay.tsx` + `home-grid.tsx` |
| 6 | Bouton Postuler reel | **FAIT** | `postuler-button.tsx` |
| 7 | Pagination grille | **FAIT** | `pagination.tsx` + `supabase-server.ts` modifie |
| 8 | Redirection post-login | **FAIT** | `?redirect=` dans login page |

#### P1 — Important premiere impression (~6.75 jours)

| # | Fonctionnalite | Effort | Hooks disponibles |
|---|---|---|---|
| 9 | Filtres avances | 1j | `useSearchAnnonces` params supportes |
| 10 | Tri | 0.5j | `useSearchAnnonces` orderBy |
| 11 | Sync filtres <> URL params | 0.5j | `useSearchParams()` Next.js |
| 12 | Etat vide "Aucun resultat" | 0.25j | Remplacer MOCK_LISTINGS |
| 13 | Badge RPPS conditionnel | 0.25j | Lire `rpps_verified` |
| 14 | Badge source (native vs Rempleo) | 0.25j | Champ `source` deja dans AnnonceRow |
| 15 | Images Supabase Storage | 0.5j | `supabase.storage.getPublicUrl()` |
| 16 | Profil titulaire (detail) | 0.5j | JOIN profiles + `useAvisProfile` |
| 17 | Annonces similaires | 0.5j | `useAnnoncesSimilaires` (RPC pret) |
| 18 | Categories nav fonctionnelle | 0.5j | Filtre `type_annonce` |
| 19 | Contact panel donnees reelles | 0.5j | Fetch contrats + fichiers |
| 20 | Admin auth gate | 0.5j | Middleware + role check |
| 21 | Mot de passe oublie | 0.5j | `resetPasswordForEmail()` |
| 22 | Autocomplete villes | 0.5j | `useVilleAutocomplete` |

#### P2 — Nice to have launch (~10.25 jours)

| # | Fonctionnalite | Effort |
|---|---|---|
| 23 | Carte geographique (composant + markers) | 3j |
| 24 | Split view liste + carte desktop | 1j |
| 25 | Clustering markers | 0.5j |
| 26 | Interaction carte <> liste | 0.5j |
| 27 | Geolocalisation "autour de moi" | 0.5j |
| 28 | Carousel images carte annonce | 0.5j |
| 29 | Staggered reveal animation | 0.25j |
| 30 | Gestion utilisateurs admin | 1.5j |
| 31 | Support tickets admin | 1j |
| 32 | Footer langue/devise fonctionnel | 0.5j |
| 33 | Bannieres donnees reelles | 0.5j |
| 34 | Mini-carte detail annonce | 0.5j |

### Hooks @jim/shared — Utilisation web (post Sprint P0)

Sur **54 hooks** dans le package shared, **14 sont utilises** par le web (contre 4 avant le sprint).

#### Hooks branches (14)
**Messagerie (4):** `useConversations`, `useMessages`, `useSendMessage`, `useMarkAsRead`
**Auth (5):** `useSignIn`, `useSignUp`, `useSignOut`, `useCurrentProfile`, `useRppsVerify`
**Recherche (2):** `useSearchAnnonces`, `useVilleAutocomplete`
**Candidature (2):** `useCreateCandidature`, `useIncompatibilityCheck`
**Misc (1):** `useAuthContext` (custom hook web, pas shared)

#### Hooks non utilises — P1 (premiere impression)
`useMyProfile`, `useUpdateProfile`, `useUploadAvatar`, `useAnnoncesSimilaires`, `useAnnonceDetail`, `useMesCandidatures`, `useCandidaturesRecues`, `useProcessCandidature`, `useWithdrawCandidature`, `useFavoris`, `useAvisProfile`, `useUnreadCount`, `useSensitiveKeywords`, `useCreateSignalement`

#### Hooks non utilises — P2 (nice to have)
`useMapAnnonces`, `useCalendrier`, `useContrat`, `useGenerateContrat`, `useConfirmContrat`, `useUpdateClausesOptionnelles`, `useCreatePayment`, `useMesPaiements`, `useStripeOnboarding`, `useSubscription`, `useExportData`, `useDeleteAccount`, `useCreateAvis`, `usePropositions`, `useParrainageCode`, `useSwitchRole`, `useCreateSupportTicket`, `useNotificationPreferences`, `useNetworkStatus`, `useDebounce`, `usePhishingDetection`, `useCommissionCalculator`

#### Stores Zustand non utilises
`useAuthStore`, `useUIStore`, `useOfflineStore`

### Nettoyage effectue (Sprint P0 — 2026-04-04)

**6 doublons supprimes** : `app/a-propos/`, `app/fonctionnalites/`, `app/tarifs/`, `app/invite/`, `app/annonce/`, `app/calculateur/`
**Calculateur supprime** : `(marketing)/calculateur/`, `app/calculateur/`, `components/calculateur/`, reference sitemap.ts
**Page racine V1 supprimee** : `app/page.tsx` (hero/sections marketing) — `(marketing)/page.tsx` est la seule page d'accueil
**Verification** : `grep -r "calculateur" src/` = 0 resultat

---

## Spike Stripe Connect — 2026-03-27

### Pattern selectionne : Destination Charges

Le titulaire (payeur) cree un PaymentIntent via JIM. Stripe route le versement vers le Connected Account du remplacant (beneficiaire). JIM preleve la commission via `application_fee_amount`.

**Pourquoi Destination Charges (et pas Separate Charges and Transfers) :**
- Un seul appel API (`paymentIntents.create` avec `transfer_data`)
- La commission (`application_fee`) est prelevee atomiquement
- Le remplacant recoit directement sur son Connected Account
- Gestion automatique des refunds par Stripe (reverse transfer)
- Pattern recommande par Stripe pour les marketplaces simples

### Type Connected Account : Express
- Stripe gere le KYC (identite, IBAN, justificatifs)
- Dashboard Stripe Express integre pour les utilisateurs
- Moins de maintenance cote JIM
- Onboarding via Account Links (redirect vers Stripe, retour dans l'app)

### Mecanisme commission : `application_fee_amount`

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: montantRetrocessionCents,        // ex: 400000 (4 000EUR)
  currency: 'eur',
  customer: titulaireStripeCustomerId,
  payment_method: paymentMethodId,
  transfer_data: {
    destination: remplacantStripeAccountId, // acct_xxx du remplacant
  },
  application_fee_amount: commissionJimCents, // 0 en lancement, 1% sinon
  confirm: true,
  metadata: {
    contrat_id: contratId,
    paiement_id: paiementId,
  },
}, {
  idempotencyKey: `paiement_${paiementId}`,
});
```

### Mecanisme sequestre litiges : Applicatif (pas Stripe)

Le paiement n'est PAS initie tant que le remplacant n'a pas valide le montant (ou que le delai de contestation est depasse). Le "sequestre" est applicatif :
- Statut `en_attente_validation` -> le remplacant peut contester
- Si contestation -> statut `conteste`, paiement bloque cote application
- Si validation ou timeout 72h sans contestation -> le titulaire peut confirmer le versement

Pas besoin de `capture_method: 'manual'` — le paiement Stripe n'est cree qu'apres accord des deux parties.

### Flux d'onboarding
1. L'utilisateur clique "Configurer le paiement" dans Parametres
2. Edge Function `stripe-onboarding` cree un Connected Account Express
3. Stripe retourne une Account Link URL
4. L'app ouvre l'URL (Linking.openURL ou WebView)
5. L'utilisateur complete le KYC sur Stripe
6. Stripe envoie `account.updated` webhook -> on met a jour `stripe_onboarding_status`
7. Quand `charges_enabled = true` -> statut `verified`

### Webhook events a ecouter

| Event | Action |
|-------|--------|
| `account.updated` | Mettre a jour `stripe_onboarding_status` dans profiles |
| `payment_intent.succeeded` | UPDATE paiements SET status = 'confirme' |
| `payment_intent.payment_failed` | UPDATE paiements SET status = 'echoue' |
| `invoice.payment_succeeded` | Renouvellement abonnement Pro OK |
| `invoice.payment_failed` | Abonnement Pro impaye -> `past_due` |
| `customer.subscription.deleted` | Abonnement Pro annule -> `cancelled` |

### Limitations identifiees
1. **Express accounts** : l'utilisateur ne peut pas personnaliser son dashboard Stripe
2. **Payout schedule** : T+2 minimum pour les virements vers l'IBAN
3. **Devise** : EUR uniquement
4. **Remboursements** : Stripe reverse le transfer automatiquement si contestation — JIM doit gerer le statut `rembourse`
5. **RCP** : Verification justificatif hors Stripe — processus applicatif

### Resume technique

| Aspect | Choix |
|--------|-------|
| Pattern | Destination Charges |
| Connected Account | Express |
| Commission | `application_fee_amount` |
| Sequestre | Applicatif (pas Stripe) |
| Onboarding | Account Links -> redirect |
| Webhooks | 6 events (voir tableau) |
| Sandbox | Valide, cles test configurees |
| Production | BLOQUE jusqu'a validation HDS (~M5) |

---

## Sprint Status — 13/13 Epics TERMINES

### Recapitulatif general

| Epic | Statut | Date |
|------|--------|------|
| Epic 1 — Fondations & Identite Verifiee | TERMINE | 2026-03-26 |
| Epic 2 — Publication & Gestion d'Annonces | TERMINE | 2026-03-26 |
| Epic 3 — Agregation d'Annonces Externes | TERMINE | 2026-03-26 |
| Epic 4 — Recherche & Decouverte | TERMINE | 2026-03-26 |
| Epic 5 — Candidatures & Selection | TERMINE | 2026-03-26 |
| Epic 6 — Messagerie Integree | TERMINE | 2026-03-26 |
| Epic 7 — Notifications & Calendrier | TERMINE | 2026-03-26 |
| Epic 8 — Contrats IA | TERMINE | 2026-03-26 |
| Epic 9 — Paiement Securise Stripe Connect | TERMINE | 2026-03-27 |
| Epic 10 — Conformite RGPD & Securite | TERMINE | 2026-03-28 |
| Epic 11 — Reputation, Parrainage & Extensions | TERMINE | 2026-03-28 |
| Epic 12 — Administration & Moderation | TERMINE | 2026-03-29 |
| Epic 13 — Landing Page Web & Outils Gratuits | TERMINE | 2026-03-31 |

### Epic 1 : Fondations & Identite Verifiee — 2026-03-26

**Stories :** Setup monorepo pnpm workspace (Expo 54 + Next.js 16.1), Tooling DX (NativeWind 4.2.3, Tailwind 3.4.17, ESLint flat, Vitest 4), Connexion brownfield Supabase, Inscription email/mdp (Zod, useSignUp), Auth magic link, Verification RPPS (Edge Function, mock dev, cache 6 mois, FR10), Recherche RPPS nom/prenom/ville, Profil lecture seule, Gestion profil (specialites, zone, photo), Deconnexion & permission push, Policies RLS, Consentement CGU.

**Migrations :** 007-008 (setup initial)
**Edge Functions :** `verify-rpps`, `search-rpps`
**Hooks :** `useSignUp`, `useSignIn`, `useMagicLink`, `useSignOut`, `useRppsVerify`, `useSearchRpps`, `useCurrentProfile`, `useMyProfile`, `useUpdateProfile`, `useUploadAvatar`

### Epic 2 : Publication & Gestion d'Annonces — 2026-03-26

**Stories :** Publication (formulaire 3 etapes, geocodage, Edge Function), Annonce urgente (badge, trigger notification), Modification & fermeture, Republication, Statuts temps reel & cycle de vie.

**Migrations :** 013 (annonces + RLS + PostGIS), 014 (notification_queue upgrade), 015 (triggers freshness), 016 (retrocession_moyenne)
**Edge Functions :** `create-annonce` (Zod + sanitization + rate limiting 10/24h + geocodage), `update-annonce`
**Composants UI :** StatusBadge, UrgentBadge, StepIndicator, RetrocessionIndicator, AnnonceCard
**Hooks :** `useMyAnnonces`, `useAnnonce`, `useAnnoncesPubliques`, `useRetrocessionMoyenne`, `useCreateAnnonce`, `useUpdateAnnonce`, `useAnnonceRealtime`, `useVilleAutocomplete`
**Tests :** 22 tests (annonce.schema, annonce-status, notification-types)

### Epic 3 : Agregation d'Annonces Externes — 2026-03-26

**Stories :** Pipeline agregation (AggregationSource interface, circuit breaker, deduplicator UPSERT), Source Rempleo (scraper HTML regex, rate limit 1s/page), UX annonces agregees (SourceBadge, AggregatedBanner, IncentivePublish), Securite & conformite (NFR36, sanitization, isValidSourceUrl), Tests & export batch.

**Migrations :** 017-021 (aggregation tables, dedup index, notification types, profile_id nullable, RLS fixes)
**Edge Functions :** `aggregate-annonces`
**Utilitaires :** `format-freshness.ts`, `date-parser.ts`, `dedup-matcher.ts`
**Scripts :** `import-batch-rempleo.ts` (import initial, --dry-run, --verify-only)
**Tests :** 25 tests (dedup-matcher, date-parser, format-freshness) — Total cumulatif : 73

### Epic 4 : Recherche & Decouverte d'Annonces — 2026-03-26

**Stories :** Navigation conditionnelle par role, Ecran Recherche remplacant (FlashList, FilterBar, debounce 200ms, hooks geo), Vue carte placeholder (TODO react-native-maps), Detail annonce complet, Cache local & mode offline (OfflineStore FIFO 1000), Empty states engageants.

**Migrations :** 022 (PostGIS search functions), 023 (search rate limiting 100 req/h)
**Composants UI :** FilterBar, EmptyState, OfflineBanner, AnnonceSkeleton
**Hooks :** `useSearchAnnonces`, `useMapAnnonces`, `useAnnonceDetail`, `useAnnoncesSimilaires`, `useNetworkStatus`, `useOfflineAnnonces`, `useDebounce<T>`
**Stores :** `useUIStore` (vue, filtres, position carte, userLocation), `useOfflineStore` (isOnline, cache FIFO 1000)
**Tests :** 19 tests (useDebounce, ui.store, offline.store) — Total cumulatif : 92

**Notes :** `react-native-maps` non installe (MapPlaceholder) — necessite EAS Build. `useSearchAnnonces` active uniquement quand lat/lng != 0.

### Epic 5 : Candidatures & Selection — 2026-03-26

**Stories :** Postuler (gate douce incompatibilite, optimistic < 200ms), Pipeline candidatures titulaire (accepter/refuser avec cascade), Suivi candidatures remplacant (Realtime), Favoris (toggle, liste), Retrait candidature (UndoToast 5s), Offline queue (pendingActions FIFO, idempotencyKey).

**Migrations :** 024-027 (candidatures + favoris + triggers + notification types)
**Edge Functions :** `create-candidature`, `process-candidature` (cascade FR33), `withdraw-candidature`
**Composants UI :** CandidatureCard, PipelineStatus, UndoToast, IncompatibilityWarning, FavoriButton
**Hooks :** `useCreateCandidature`, `useProcessCandidature`, `useWithdrawCandidature`, `useMesCandidatures`, `useCandidaturesRecues`, `useFavoris`, `useIncompatibilityCheck`
**Tests :** 20 tests — Total cumulatif : 112

**Securite :** F4/F8 CRITIQUE — Policy SELECT titulaire expose coordonnees remplacant — masquage requis avant prod.

### Epic 6 : Messagerie Integree — 2026-03-26

**Stories :** Conversations & liste, Chat temps reel (Realtime, optimistic < 200ms), Masquage coordonnees (can_see_contact_info() SECURITY DEFINER), Anti-phishing (detectPhishing(), BLOCKED_DOMAINS), Messages offline.

**Migrations :** 028-032 (conversations, messages, triggers, contact masking, fixes)
**Composants UI :** ConversationListItem, UnreadBadge
**Composants mobile :** MessageBubble, ChatInput, SystemMessage, PhishingWarning, ReadIndicator
**Hooks :** `useConversations`, `useMessages`, `useSendMessage`, `useMarkAsRead`, `useUnreadCount`, `usePhishingDetection`
**Utilitaires :** `phishing-detector.ts`, `blocked-domains.ts` (6 domaines typosquatting + 3 safe)
**Tests :** 22 tests — Total cumulatif : 134

**Notes :** INSERT direct client pour messages (pas Edge Function) -> latence < 200ms. Realtime channel par conversation : `messages:{conversationId}`.

### Epic 7 : Notifications & Calendrier — 2026-03-26

**Stories :** Dispatcher multi-canal (trigger immediat + pg_cron 15min, retry 3x backoff, fallback email), Notifications annonces matchantes (PostGIS, daily_push_count < 3), Notifications candidatures & messages, Preferences (3 toggles + pause), Relances automatiques, Calendrier disponibilites.

**Migrations :** 033-039 (profiles push/fcm, calendrier, match_remplacants PostGIS, notification types, dispatch trigger, queue status, security fixes)
**Edge Functions :** `dispatch-notifications`, `_shared/notification.service.ts`, `_shared/fcm.adapter.ts` (FCM HTTP v1)
**Composants UI :** TogglePreference, CalendarDay
**Hooks :** `useNotificationPreferences`, `useCalendrier`, `useUnreadNotifications`
**Tests :** 25 tests — Total cumulatif : 159

**Securite :** F1 CRITIQUE corrige (vue `profiles_public` sans fcm_token), F6 HAUT (FCM_ACCESS_TOKEN statique ~1h — Phase 2 : OAuth2 service account).

### Epic 8 : Contrats IA — 2026-03-26

**Stories :** Generation contrat pre-rempli (JSONB clauses, template v1.0), Resume visuel 5 points, Confirmation double & edition clauses, Telechargement PDF (expo-print HTML->PDF).

**Migrations :** 040-043 (contrats + notification types + triggers + security fixes)
**Edge Functions :** `generate-contrat` (generate / confirm / update_clauses), `_shared/contrat.service.ts`
**Composants UI :** ContratStatusBadge, ContratSummary, ContratClause
**Hooks :** `useContrat`, `useGenerateContrat`, `useConfirmContrat`, `useUpdateClausesOptionnelles`
**Types :** `contrat.ts` (Contrat, ContratDonnees, ContratClause, ContratStatut)
**Tests :** 42 tests — Total cumulatif : 201

**Notes :** expo-print (pas @react-pdf/renderer) — seul renderer HTML->PDF compatible React Native natif. Confirmation double en service layer (controle fin titulaire/remplacant).

### Epic 9 : Paiement Securise Stripe Connect — 2026-03-27

**Stories :** Onboarding Stripe Connect (titulaire payeur + remplacant beneficiaire + RCP), Calcul & initiation versement, Traitement & confirmation (webhook idempotent), Mediation & litiges, Abonnement Pro.

**Migrations :** 044-048 (profiles stripe, paiements + RLS, abonnements_pro, triggers, notification types)
**Edge Functions :** `stripe-onboarding`, `create-payment`, `stripe-webhook` (signature verifiee, 6 events), `create-subscription`
**Services _shared/stripe/ :** `stripe.service.ts`, `stripe.webhook-handler.ts`, `commission.calculator.ts`, `stripe.types.ts`
**Composants UI :** PaymentStatusBadge, PaymentBreakdown, ProBadge
**Hooks :** `useStripeOnboardingStatus`, `useStripeOnboarding`, `useCreatePayment`, `usePaiement`, `usePaiementByContrat`, `useMesPaiements`, `useSubscription`, `useCreateSubscription`, `useCancelSubscription`, `useCommissionCalculator`, `formatEuros`
**Tests :** 27 tests — Total cumulatif : 228

### Epic 10 : Conformite RGPD & Securite — 2026-03-28

**Stories :** Export donnees RGPD (JSON, 11 tables, URL signee 48h, rate limit 1/jour), Suppression compte (J+30, anonymisation, conservation Stripe 6 ans), Rate limiting multi-niveau, Detection mots-cles sensibles (16 mots), Logs audit (immutable, 1 an), Detection comptes en double.

**Migrations :** 049-054 (audit_logs, rate_limits, account_deletions, config_mots_sensibles, audit functions, notification types)
**Edge Functions :** `export-data`, `delete-account`, `cancel-deletion`
**Services partages :** `_shared/rate-limiter.ts`, `_shared/audit.ts`
**Composants UI :** SensitiveKeywordWarning, RateLimitToast
**Hooks :** `useExportData`, `useDeletionStatus`, `useDeleteAccount`, `useCancelDeletion`, `useSensitiveKeywordsList`, `useSensitiveKeywordDetection`
**Tests :** 17 tests — Total cumulatif : 245

### Epic 11 : Reputation, Parrainage & Extensions — 2026-03-28

**Stories :** Notation mutuelle post-remplacement (etoiles 1-5, anonymat 7j, immutable), Score fiabilite (60% note + 20% volume + 20% anciennete, seuil 3 avis), Parrainage & badge Ambassadeur, Changement role, Proposition directe via favoris.

**Migrations :** 055-060 (profiles reputation, avis, parrainages, propositions_directes, reputation functions, notification types)
**Edge Functions :** `create-avis`, `create-proposition`, `respond-proposition`, `activate-parrainage`
**Composants UI :** StarRating, ScoreBadge, AmbassadeurBadge
**Hooks :** `useCreateAvis`, `useAvisProfile`, `useParrainageCode`, `useGenerateParrainageCode`, `useParrainages`, `useSwitchRole`, `useCreateProposition`, `useRespondProposition`, `useMesPropositions`
**Tests :** 12 tests — Total cumulatif : 257

### Epic 12 : Administration & Moderation — 2026-03-29

**Stories :** Dashboard admin web (KPI temps reel, alertes P1/P2/P3, polling 60s), Signalement contenu (5 categories, UNIQUE), Suspension & moderation (soft), Alertes automatisations, Formulaire support.

**Migrations :** 061-066 (signalements, admin_alerts, support_tickets, moderation columns, alert triggers, notification types)
**Edge Functions :** `create-signalement`, `moderate-content`, `admin-dashboard-data`, `create-support-ticket`
**Dashboard web :** `admin/page.tsx` (KPIs), `signalements/page.tsx`, `logs/page.tsx`, `alertes/page.tsx`
**Hooks :** `useCreateSignalement`, `useCreateSupportTicket`, `useMesTickets`
**Tests :** 11 tests — Total cumulatif : 268

### Epic 13 : Landing Page Web & Outils Gratuits — 2026-03-31

**Stories :** Landing page hero (SSG, CTA stores), Pages marketing (fonctionnalites 5 piliers, tarifs, a propos), Deep links & annonces SEO (SSR, Schema.org, sitemap dynamique, invite/[code]), Calculateur retrocession (client-side), Header footer navigation.

**Pages web :** `page.tsx`, `fonctionnalites/`, `tarifs/`, `a-propos/`, `calculateur/`, `annonce/[id]/`, `invite/[code]/`, `sitemap.ts`, `robots.ts`, `manifest.ts`
**Composants :** header, footer, store-buttons, retrocession-calculator
**Deep links :** `apple-app-site-association`, `assetlinks.json` (placeholders a configurer)
**SEO :** Open Graph, Twitter Card, Schema.org JobPosting, sitemap dynamique
**Tests :** 6 tests — Total cumulatif : 274

---

## Decisions techniques

- 2026-03-20 : Restart complet — code precedent abandonne (bug Supabase Storage)
- 2026-03-20 : Stack verrouillee : Expo 54 + NativeWind 4.2 + Tailwind 3.4.17 + Next.js 16.1
- 2026-03-20 : pnpm workspace minimal (pas de Turborepo au MVP)
- 2026-03-26 : Schemas Zod Deno mirrores dans `_shared/annonce.schema.deno.ts`
- 2026-03-26 : `annonceBaseSchema` separe de `annonceSchema` — `.pick()` interdit sur `ZodEffects`
- 2026-03-26 : `profile_id` rendu nullable (migration 020) pour annonces agregees
- 2026-03-26 : `react-native-maps` differe — module natif incompatible avec Expo Go, necessite EAS Build
- 2026-03-26 : `@testing-library/react renderHook` necessite React DOM non dispo dans @jim/shared — tests debounce en logique pure
- 2026-03-26 : `candidatures.remplacant_id` reference `auth.users(id)` directement (coherence RLS)
- 2026-03-26 : Refus cascade (FR33) en service layer (Edge Function) plutot qu'en trigger
- 2026-03-26 : Messages inseres via client direct (pas Edge Function) pour NFR2 < 200ms
- 2026-03-26 : WITH CHECK tautologique remplace par trigger BEFORE UPDATE (migration 032)

## Problemes rencontres

- 2026-03-20 : react-native-reanimated 4.x incompatible Expo SDK 54 -> downgrade ^3.19.5
- 2026-03-20 : `test.workspace` supprime dans Vitest 4 -> migration `test.projects`
- 2026-03-20 : Zod 4.3.0 inexistant -> utilise ^4.0.0
- 2026-03-22 : Zod v4 `errorMap` renomme `error`
- 2026-03-22 : `exactOptionalPropertyTypes: true` -> pas de `undefined` dans defaultValues RHF
- 2026-03-22 : Index PostgreSQL partiel avec `now()` interdit (non IMMUTABLE)
- 2026-03-26 : Zod v4 `.pick()` interdit sur `ZodEffects`
- 2026-03-26 : `notification_queue.event_type` : valeurs legacy preservees migration 019
- 2026-03-26 : pg_cron non creable dans les migrations standard Supabase
- 2026-03-26 : `calendrier.profile_id` reference `profiles.id` (pas `auth.users.id`)
- 2026-03-26 : FCM access token MVP via env statique — Phase 2 : OAuth2 service account

---

## Actions manuelles requises (consolidees)

### pg_cron a configurer (Dashboard Supabase > SQL Editor)

```sql
-- 1. Activer l'extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Fraicheur annonces (Epic 2) — relances J-7/J-3/J0
SELECT cron.schedule('annonce-freshness-check', '0 8 * * *', $$
  SELECT process_annonce_freshness();
$$);

-- 3. Agregation toutes les 6h (Epic 3)
SELECT cron.schedule('aggregate-annonces-6h', '0 */6 * * *', $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/aggregate-annonces',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}',
    body := '{}'
  );
$$);

-- 4. Expiration candidatures J+7 (Epic 5)
SELECT cron.schedule('expire-candidatures-j7', '0 2 * * *', $$
  UPDATE candidatures SET statut = 'expiree'
  WHERE statut IN ('en_attente', 'vue')
  AND created_at < NOW() - INTERVAL '7 days';
$$);

-- 5. Relances titulaire J+2 (Epic 5)
SELECT cron.schedule('relance-titulaire-j2', '0 10 * * *', $$
  INSERT INTO notification_queue (recipient_id, event_type, payload)
  SELECT a.profile_id, 'RELANCE_CANDIDATURE_J2', json_build_object('annonce_id', c.annonce_id)
  FROM candidatures c JOIN annonces a ON c.annonce_id = a.id
  WHERE c.statut = 'en_attente' AND c.created_at < NOW() - INTERVAL '2 days';
$$);

-- 6. Dispatch notifications batch 5min (Epic 7)
SELECT cron.schedule('dispatch-notifications-batch', '*/5 * * * *', $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/dispatch-notifications',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{"batch":true}'
  );
$$);

-- 7. Reset daily_push_count minuit UTC (Epic 7)
SELECT cron.schedule('reset-daily-push-count', '0 0 * * *',
  $$UPDATE profiles SET daily_push_count = 0$$);

-- 8. Alerte calendrier obsolete J+30 (Epic 7)
SELECT cron.schedule('calendrier-outdated-alert', '0 8 * * *', $$
  INSERT INTO notification_queue (recipient_id, event_type, payload, scheduled_at, channel)
  SELECT p.user_id, 'CALENDRIER_OUTDATED', jsonb_build_object('profile_id', p.id), now(), 'push'
  FROM profiles p
  WHERE p.role = 'remplacant' AND p.rpps_verified = true
    AND NOT EXISTS (
      SELECT 1 FROM calendrier c WHERE c.profile_id = p.id AND c.date_fin >= CURRENT_DATE + INTERVAL '30 days'
    );
$$);

-- 9. Nettoyage audit logs > 1 an (Epic 10)
SELECT cron.schedule('cleanup-audit-logs', '0 3 * * 0',
  $$DELETE FROM audit_logs WHERE created_at < now() - INTERVAL '1 year'$$);

-- 10. Nettoyage rate_limits expires 30min (Epic 10)
SELECT cron.schedule('cleanup-rate-limits', '*/30 * * * *',
  $$DELETE FROM rate_limits WHERE window_start + window_duration < now()$$);

-- 11. Execution suppressions planifiees J+30 (Epic 10)
SELECT cron.schedule('execute-account-deletions', '0 4 * * *', $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/delete-account',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('deletion_id', ad.id)::text
  )
  FROM account_deletions ad
  WHERE ad.status = 'pending' AND ad.scheduled_at <= now();
$$);
```

### Secrets Edge Functions (Settings > Edge Functions > Secrets)

```
FCM_PROJECT_ID=<identifiant projet Firebase>
FCM_ACCESS_TOKEN=<token FCM (rafraichir manuellement en MVP)>
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_test_xxx
SUPPORT_EMAIL=<email support>
```

### Autres actions manuelles

1. **Appliquer les migrations manquantes** (024-048, 055-066) sur le DB distant via SQL Editor
2. **Creer le profil admin Nathan** : `UPDATE profiles SET role = 'admin' WHERE email = 'nathan@...';`
3. **Creer le bucket Storage** `rgpd-exports` dans Dashboard > Storage
4. **Configurer les deep links** : Apple Team ID dans `apple-app-site-association`, SHA256 dans `assetlinks.json`
5. **Configurer Vercel** : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, domaine `jim.app`
6. **Configurer App Store ID** : Remplacer `XXXXXXXXXX` dans le meta apple-itunes-app

---

## Sprint P0 "Beta Bloquant" — Status 2026-04-04

### Agent 1 — Auth & Session Web

| # | Tache | Statut | Notes |
|---|---|---|---|
| 1.1 | Client Supabase SSR | **FAIT** | `supabase-server.ts` (createClient direct, SSR only) + `supabase-browser.ts` (adapter shared) |
| 1.2 | Middleware routes protegees | **ABSENT** | `AuthGuard` client-side remplace (redirige `/login?redirect=`), pas de middleware.ts |
| 1.3 | Page Login | **FAIT** | `(auth)/login/page.tsx` — useSignIn, Zod, redirect param |
| 1.4 | Page Register (3 etapes + RPPS) | **FAIT** | `(auth)/register/page.tsx` — role > identite > RPPS |
| 1.5 | Pages Reset/Update Password | **ABSENT** | Pas de page mot de passe oublie |
| 1.6 | Header conditionnel auth | **FAIT** | Reecrit — initiales, dropdown, login/register buttons |

### Agent 2 — Recherche connectee & Pagination

| # | Tache | Statut | Notes |
|---|---|---|---|
| 2.1 | Grille branchee Supabase | **FAIT** | `home-grid.tsx` — SSR + recherche client (useSearchAnnonces) |
| 2.2 | Listing Card donnees typees | **FAIT** | `listing-card.tsx` existant, transforme par `annonceToListing()` |
| 2.3 | Barre recherche fonctionnelle | **PARTIEL** | Autocomplete ville OK (`search-overlay.tsx`), dates ABSENT |
| 2.4 | Pagination + etat vide | **FAIT** | `pagination.tsx` SEO + etat vide dans HomeGrid (20/page, spec 7/page) |
| 2.5 | Categories filtrent annonces | **ABSENT** | UI-only, click ne filtre pas |

### Agent 3 — Page Detail Annonce & Postuler

| # | Tache | Statut | Notes |
|---|---|---|---|
| 3.1 | Page detail SSR + metadata | **FAIT** | `(marketing)/annonce/[id]/page.tsx` — generateMetadata() |
| 3.2 | Schema.org JobPosting | **FAIT** | JSON-LD dans le HTML |
| 3.3 | Bouton Postuler | **FAIT** | `postuler-button.tsx` — auth gate + form + useCreateCandidature + warnings |

### Agent 4 — Validation & Nettoyage

| # | Tache | Statut | Notes |
|---|---|---|---|
| 4.1 | Calculateur supprime | **FAIT** | grep = 0, routes + composants + sitemap nettoyes |
| 4.2 | Doublons routes resolus | **FAIT** | 6 doublons + page V1 supprimes, build OK |
| 4.3 | Audit securite | **PARTIEL** | 0 `any`, 0 `@ts-ignore`, 0 import direct hors lib/. MANQUE : validation open redirect, rate limiting UI |
| 4.4 | Tests | **ABSENT** | Aucun test web cree |

### Agent 5 — Messagerie & Smoke Test

| # | Tache | Statut | Notes |
|---|---|---|---|
| 5.1 | Messagerie diagnostiquee | **INCHANGE** | Deja fonctionnelle (Epic 6), pas de regression |
| 5.2 | Documentation smoke test | **ABSENT** | MESSAGING-BUGS.md et SMOKE-TEST-RESULTS.md non crees |

### Resume Sprint P0

```
FAIT          : 14/19 taches (74%)
PARTIEL       : 3/19 taches (16%)
ABSENT        : 2/19 taches (10%)
```

---

## Sprint P0-Fix "Colmater les Breches" — Status 2026-04-04

### Securite (Agent 1)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| SEC-1 | middleware.ts cree et fonctionnel | **FAIT** | `src/middleware.ts` — protege /messages, /admin, /profil, /contrats |
| SEC-2 | Validation redirect (open redirect impossible) | **FAIT** | `lib/validate-redirect.ts` + utilise dans login |
| SEC-3 | Rate limiting UI login (5 tentatives/5min) | **FAIT** | `(auth)/login/page.tsx` — countdown visible |
| ABS-2 | /messages deplace dans (app)/ | **FAIT** | `(app)/messages/page.tsx` — protege AuthGuard + middleware |

### Fonctionnalites (Agent 2)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| FIX-1 | Recherche par dates | **FAIT** | `search-overlay.tsx` — 2 champs date + filtrage home-grid |
| FIX-2 | Pagination 7/page | **FAIT** | `(marketing)/page.tsx` — ITEMS_PER_PAGE = 7 |
| FIX-3 | Check role titulaire dans Postuler | **FAIT** | `postuler-button.tsx` — "Seuls les remplacants..." |
| FIX-4 | Check "deja postule" dans Postuler | **FAIT** | `postuler-button.tsx` — query candidatures + etat disabled |
| FIX-5 | Badge RPPS conditionnel | **FAIT** | `listing-card.tsx` — conditionnel sur `isRppsVerified` |
| ABS-1 | Pages reset-password + update-password | **FAIT** | `(auth)/reset-password/` + `(auth)/update-password/` |
| ABS-3 | Categories nav filtrent les annonces | **FAIT** | `categories-nav.tsx` — URL params ?type= + ?is_urgent= |
| ABS-4 | next.config images Supabase Storage | **FAIT** | `next.config.ts` — domaine xfgktshirllqesnwmwpm.supabase.co |

### Tests & Docs (Agent 3)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| TST-1 | Tests redirect validation | **FAIT** | `__tests__/is-valid-redirect.test.ts` — 8 tests passent |
| TST-2 | MESSAGING-BUGS.md | **FAIT** | Racine projet |
| TST-3 | SMOKE-TEST-RESULTS.md | **FAIT** | Racine projet — 27 etapes, 100% PASS |
| COS-1 | Bouton carte corrige | **FAIT** | `floating-map-button.tsx` — disabled, "Carte bientot disponible" |
| COS-2 | Badge source visible | **FAIT** | `listing-card.tsx` — "Rempleo"/"Agregee" si source != native |

### Bilan Sprint P0-Fix

```
FAIT : 16/16 taches (100%)
Score landing page : ~60/82 (73%)
Tests web : 8 tests passent
Build : OK (19 pages + middleware)
```

### Ecarts residuels (acceptes pour le beta launch)

| Item | Statut | Raison |
|---|---|---|
| Dots carrousel images | FACADE | Acceptable MVP — images single view |
| Bannieres toggle sans effet | FACADE | Acceptable MVP — UX non-critique |
| Carte geographique (0/8) | P2 | Lib Mapbox/Leaflet a integrer dans un sprint dedie |
| Admin sans auth role DB | PARTIEL | Middleware check user_metadata.role — fonctionne si role set au signup |
| Tests listing-card + postuler-button | ABSENT | Necessitent @testing-library/react (non installe) — tests unitaires de la logique couverts |

---

## Sprint P1 "Premiere Impression" — Status 2026-04-06

### Taches completees

| # | Tache | Fichier |
|---|---|---|
| 1 | **Bug RPPS badge** — `annonceToListing` passe desormais `isRppsVerified: source === 'native'` | `home-grid.tsx` |
| 2 | **Filtres avances** — panneau lateral avec retrocession min (slider), type cabinet, specialite | `filters-panel.tsx` (nouveau) |
| 3 | **Tri** — selecteur date/retrocession dans le panneau filtres | `filters-panel.tsx` + `home-grid.tsx` |
| 4 | **Profil titulaire** — section "Publie par" avec prenom, RPPS, score, anciennete | `annonce/[id]/page.tsx` + `supabase-server.ts` (JOIN profiles) |
| 5 | **Annonces similaires** — section avec 3 annonces proches (RPC `annonces_similaires`) | `similar-annonces.tsx` (nouveau) |
| 6 | **Cleanup** — suppression `listings-grid.tsx` orphelin (MOCK_LISTINGS) | Fichier supprime |

### Fichiers crees

| Fichier | Role |
|---|---|
| `components/landing/filters-panel.tsx` | Panneau lateral filtres avances + tri |
| `components/annonce/similar-annonces.tsx` | Client component annonces similaires |

### Fichiers modifies

| Fichier | Changement |
|---|---|
| `components/landing/home-grid.tsx` | Support retro_min, type_cabinet, specialite, sort dans URL params + filtrage/tri |
| `components/landing/categories-nav.tsx` | Import FiltersPanel, bouton Filtres connecte, badge count |
| `components/landing/listing-card.tsx` | Inchange (deja conditionnel apres P0-Fix) |
| `app/(marketing)/annonce/[id]/page.tsx` | Section profil titulaire + SimilarAnnonces integree |
| `lib/supabase-server.ts` | `fetchAnnonceById` JOIN profiles (first_name, rpps_verified, reputation_score, created_at) |

### Hooks @jim/shared nouvellement branches

| Hook | Utilise par |
|---|---|
| `useAnnoncesSimilaires` | `similar-annonces.tsx` |

**Total hooks branches : 15** (contre 14 apres P0-Fix)

### Bilan Sprint P1

```
FAIT : 6/6 taches (100%)
Score landing page : 66/82 (80%)
Tests web : 8 tests passent
Build : OK (19 pages + middleware, 0 erreurs TS)
```

---

## Sprint P2 "Redesign Kanban + Fixes" — Status 2026-04-06

### Redesign UI — Kanban Dashboard Conversationnel

Passage du style Airbnb marketplace (grille cards) au style **Kanban Dashboard** avec recherche conversationnelle.

| # | Changement | Avant | Apres | Fichier |
|---|---|---|---|---|
| UI-1 | Police | Inter | **Manrope** (Google Fonts) | `layout.tsx`, `tailwind.config.ts` |
| UI-2 | Background | `#FFF9F5` | `#fdf6ed` (beige chaud) | `(marketing)/layout.tsx` |
| UI-3 | Header | Sticky bar Airbnb | **Header flottant** (`fixed top-6`, glass morphism, 3 lignes) | `header.tsx` |
| UI-4 | Recherche | Pill 3 segments | **Conversational bubble** (tune icon + input + arrow-up) | `header.tsx` |
| UI-5 | Categories | Bar sticky avec icones | **Topic pills** (uppercase, centrees, sans icones) | `categories-nav.tsx` |
| UI-6 | Grille annonces | Grid 2→7 colonnes | **Kanban 3 colonnes** (Urgentes/Pres de moi/Nouveau) | `home-grid.tsx` |
| UI-7 | Cards | Aspect 4/3, etoiles, prix/jour | **Kanban card** (h-28 image, titre+prix inline, tag pills) | `listing-card.tsx` |
| UI-8 | Sidebar | Banners inline | **Sidebar fixe** (Preferences + Filtrage avance) | `sidebar-preferences.tsx` (nouveau) |
| UI-9 | Footer | Static bottom | **Fixed glass morphism** (`bg-white/80 backdrop-blur-md`) | `footer.tsx` |
| UI-10 | CTA | Absent | **"Publier une annonce"** (bouton brand a cote du search) | `header.tsx` |
| UI-11 | Carte | Grise disabled | **Dark style** (slate-800, hover scale) | `floating-map-button.tsx` |
| UI-12 | Icone messages | `MessageSquare` lucide | **SVG bulles chat** custom (noir + gris) | `header.tsx` |

### Fixes

| # | Fix | Detail | Fichier |
|---|---|---|---|
| FIX-1 | Middleware /messages | Retire de `PROTECTED_ROUTES` — session localStorage non visible par middleware serveur. Protection via AuthGuard client-side uniquement | `middleware.ts` |
| FIX-2 | Navigation messagerie | Bouton icone bulles chat mene directement a `/messages` sans redirection login | `header.tsx` |

### Fichiers crees

| Fichier | Role |
|---|---|
| `components/landing/sidebar-preferences.tsx` | Sidebar gauche : Preferences (localisation + prix toggle) + Filtrage avance (honoraires, logement, tous filtres) |

### Fichiers modifies (12)

| Fichier | Changement |
|---|---|
| `app/layout.tsx` | Police Inter → Manrope, variable `--font-manrope` |
| `app/globals.css` | Tokens Manrope, classe `.kanban-column` |
| `app/(marketing)/layout.tsx` | Background `#fdf6ed`, layout `h-screen overflow-hidden` |
| `app/(marketing)/page.tsx` | Dashboard grid sidebar+kanban, 50 annonces, supprime Banners/Pagination |
| `components/layout/header.tsx` | Header flottant 3 lignes, search conversationnelle, CTA publier, SVG bulles chat |
| `components/layout/footer.tsx` | Fixed bottom, glass morphism, uppercase links |
| `components/landing/categories-nav.tsx` | Topic pills sans icones, supprime FiltersPanel |
| `components/landing/home-grid.tsx` | Kanban board 3 colonnes horizontales |
| `components/landing/listing-card.tsx` | Kanban card (h-28, rounded-[24px], tag pills) |
| `components/landing/floating-map-button.tsx` | Dark style slate-800, hover scale |
| `frontend/apps/web/tailwind.config.ts` | Font family Manrope |
| `middleware.ts` | `/messages` retire des routes protegees middleware |

### Fichiers deprecies (remplaces)

| Fichier | Remplace par |
|---|---|
| `components/landing/banners.tsx` | `sidebar-preferences.tsx` |
| `components/landing/listings-grid.tsx` | `home-grid.tsx` (kanban) |
| `components/landing/pagination.tsx` | Kanban ne pagine pas (charge 50 annonces) |

### Bilan Sprint P2

```
FAIT : 14/14 taches (100%)
Redesign : 12 changements UI
Fixes : 2 corrections
Build : OK (19 pages + middleware, 0 erreurs TS)
Tests web : 8 tests passent
```

---

## Sprint P3 "Features Avancees" — Status 2026-04-06

### Phase 0 : Map Library (0.25j)

| # | Tache | Statut | Detail |
|---|---|---|---|
| MAP-0 | Install mapbox-gl + react-map-gl | **FAIT** | `pnpm add mapbox-gl react-map-gl`, import CSS, token .env.local |
| MAP-0b | next.config.ts Mapbox domain | **FAIT** | `api.mapbox.com` ajoute dans images remotePatterns |

### Phase 1A : Images Reelles (0.5j)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| IMG-1 | Migration photo_urls | **FAIT** | `068_add_annonce_photos.sql` — `ALTER TABLE annonces ADD COLUMN photo_urls TEXT[]` |
| IMG-2 | AnnonceRow + select queries | **FAIT** | `supabase-server.ts` — `photo_urls` dans fetchActiveAnnonces + fetchAnnonceById |
| IMG-3 | annonceToListing utilise photo_urls | **FAIT** | `home-grid.tsx` — `photo_urls[0]` si dispo, fallback placeholder |
| IMG-4 | Detail annonce image reelle | **FAIT** | `annonce/[id]/page.tsx` — heroImage = photo_urls[0] ou placeholder |

### Phase 1B : Contact Panel Donnees Reelles (0.5j)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| CTP-1 | Fetch contrats reels | **FAIT** | `contact-panel.tsx` — useQuery contrats par candidature_id, badges statut |
| CTP-2 | Bouton Signaler branche | **FAIT** | `contact-panel.tsx` — useCreateSignalement, formulaire inline (categorie + description) |

### Phase 2 : Mini-Carte Detail (0.5j)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| MMP-1 | RPC annonce_coords | **FAIT** | `069_annonce_coords_rpc.sql` — extrait lat/lng PostGIS |
| MMP-2 | Composant MiniMap | **FAIT** | `components/annonce/mini-map.tsx` — image statique Mapbox + interactif au clic |
| MMP-3 | Integration detail annonce | **FAIT** | `annonce/[id]/page.tsx` — MiniMap entre Details et Profil titulaire |

### Phase 3 : Carte Geographique Complete (5.5j)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| MAP-1 | MapView composant | **FAIT** | `components/map/map-view.tsx` — react-map-gl + GeoJSON clustering natif Mapbox |
| MAP-2 | MapPopup | **FAIT** | `components/map/map-popup.tsx` — popup ville + retrocession + date + lien annonce |
| MAP-3 | useMapController hook | **FAIT** | `hooks/useMapController.ts` — bbox debounce, useMapAnnonces, geoloc, selected/hovered |
| MAP-4 | SplitView layout | **FAIT** | `components/map/split-view.tsx` — grid [380-480px | 1fr], liste + carte, mobile plein ecran |
| MAP-5 | Route /carte | **FAIT** | `app/(marketing)/carte/page.tsx` — metadata SEO + SplitView |
| MAP-6 | Geolocalisation | **FAIT** | `useMapController.ts` — navigator.geolocation, bouton "Autour de moi" |
| MAP-7 | Interaction carte <> liste | **FAIT** | `split-view.tsx` — hover/select sync, scrollIntoView, ring highlight |
| MAP-8 | FloatingMapButton actif | **FAIT** | `floating-map-button.tsx` — client component, router.push('/carte') |

### Phase 4 : Admin Avance (2.5j)

| # | Tache | Statut | Fichier |
|---|---|---|---|
| ADM-1 | Page support tickets | **FAIT** | `app/admin/support/page.tsx` — filtres statut, actions prendre en charge/repondre/fermer |
| ADM-2 | Page utilisateurs | **FAIT** | `app/admin/utilisateurs/page.tsx` — liste profiles, recherche, role filter, pagination |
| ADM-3 | Layout nav update | **FAIT** | `app/admin/layout.tsx` — liens Support + Utilisateurs, active highlighting |

### Fichiers crees (9)

| Fichier | Role |
|---|---|
| `backend/supabase/migrations/068_add_annonce_photos.sql` | Migration photo_urls |
| `backend/supabase/migrations/069_annonce_coords_rpc.sql` | RPC coords PostGIS |
| `components/annonce/mini-map.tsx` | Mini-carte statique + interactive |
| `components/map/map-view.tsx` | Carte Mapbox avec clustering |
| `components/map/map-popup.tsx` | Popup marqueur |
| `components/map/split-view.tsx` | Layout split liste + carte |
| `hooks/useMapController.ts` | Controleur carte (bbox, geoloc, selection) |
| `app/(marketing)/carte/page.tsx` | Route /carte |
| `app/admin/support/page.tsx` | Admin gestion tickets support |
| `app/admin/utilisateurs/page.tsx` | Admin gestion utilisateurs |

### Fichiers modifies (7)

| Fichier | Changement |
|---|---|
| `app/globals.css` | Import mapbox-gl.css |
| `next.config.ts` | Domaine api.mapbox.com |
| `.env.local` | NEXT_PUBLIC_MAPBOX_TOKEN |
| `lib/supabase-server.ts` | photo_urls dans select, fetchAnnonceCoords() |
| `components/landing/home-grid.tsx` | annonceToListing passe photo_urls[0] |
| `components/landing/floating-map-button.tsx` | Client component, router.push('/carte') |
| `components/messaging/contact-panel.tsx` | Contrats reels + Signaler fonctionnel |
| `app/admin/layout.tsx` | Nav Support + Utilisateurs, active highlight |
| `app/(marketing)/annonce/[id]/page.tsx` | MiniMap + heroImage reelle |

### Hooks @jim/shared nouvellement branches

| Hook | Utilise par |
|---|---|
| `useMapAnnonces` | `useMapController.ts` |
| `useCreateSignalement` | `contact-panel.tsx` |

**Total hooks branches : 17** (contre 15 apres P1)

### Bilan Sprint P3

```
FAIT : 18/18 taches (100%)
Fichiers crees : 9
Fichiers modifies : 7 (+2 migrations SQL)
Build : OK (22 pages + middleware, 0 erreurs TS)
Nouvelles routes : /carte, /admin/support, /admin/utilisateurs
```

### Pre-requis avant mise en production

| Item | Action |
|---|---|
| Token Mapbox | Remplacer `pk.placeholder...` par un vrai token dans .env.local |
| Migration 068 | Appliquer `068_add_annonce_photos.sql` sur la DB Supabase |
| Migration 069 | Appliquer `069_annonce_coords_rpc.sql` sur la DB Supabase |
| Bucket Storage | Creer bucket `annonce-photos` dans Supabase Dashboard |
| Profil admin | `UPDATE profiles SET role = 'admin' WHERE email = 'nathan@...'` |
