---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-03-13'
inputDocuments:
  - 'prd.md'
  - 'product-brief-nathanblottiaux-2026-02-24.md'
  - 'prd-validation-report.md'
  - 'ux-design-specification.md'
  - 'brainstorming-session-2026-02-22.md'
  - 'software-architecture-patterns-healthcare-microservices-research-2026-02-24.md'
  - 'technical-backend-technologies-healthcare-jim-research-2026-02-24.md'
  - 'technical-databases-storage-hds-jim-research-2026-02-24.md'
  - 'cybersecurity-healthcare-france-research-2026-02-24.md'
  - 'cloud-hosting-hds-france-infrastructure-research-2026-02-24.md'
  - 'technical-mobile-crossplatform-flutter-reactnative-research-2026-02-24.md'
  - 'backup-disaster-recovery-hds-france-research-2026-02-24.md'
  - 'domain-kinesitherapie-france-contraintes-app-research-2026-02-23.md'
  - 'domain-jim-remplacement-kinesitherapeutes-france-research-2026-02-23.md'
  - 'implementation-strategies-healthcare-startup-research-2026-02-25.md'
  - 'technical-external-api-integrations-jim-research-2026-02-24.md'
  - 'technical-stack-sauvegarde-securite-jim-research-2026-02-24.md'
  - 'market-jim-plateforme-remplacement-kinesitherapeutes-research-2026-02-22.md'
workflowType: 'architecture'
project_name: 'nathanblottiaux'
user_name: 'NathanBlottiaux'
date: '2026-03-02'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
70 FRs organisés en 8 aires de capacité architecturalement distinctes :

| Aire | FRs | Implications architecturales |
|---|---|---|
| Gestion Utilisateurs & Identité | FR1-FR10, FR60, FR63 (12) | Auth multi-mode (email/pwd + magic link), intégration API Annuaire Santé FHIR, RLS par rôle, cycle de vie RGPD (export, suppression, anonymisation), switch de rôle sans perte de données |
| Annonces & Publication | FR11-FR20, FR59, FR61 (12) | Pipeline d'agrégation externe (scraping + normalisation + déduplication), machine à états des annonces (6 statuts), propagation temps réel des transitions, fermeture automatique par événements workflow |
| Recherche & Découverte | FR21-FR26 (6) | Carte interactive performante (< 1s p95 avec 200+ marqueurs), recherche géospatiale (PostGIS), 3 filtres combinés, cache local pour mode offline, deep links annonces |
| Candidatures & Matching | FR27-FR34, FR62, FR64-FR65 (10) | Candidature optimiste (UI avant serveur), file d'attente offline, notifications bidirectionnelles, refus automatique en cascade, carnet de favoris titulaire |
| Communication | FR35-FR38 (4) | Messagerie temps réel texte, masquage coordonnées conditionnel (pré/post-acceptation), détection liens malveillants, file d'attente offline messages |
| Contrats & Documents | FR39-FR42 (4) | Génération PDF par IA (template + champs factuels), clauses verrouillées vs éditables, stockage JSON unique + double rendu, disclaimer automatique |
| Notifications, Engagement & Réputation | FR43-FR50, FR57-FR58, FR66 (14) | Push FCM/APNs avec payload générique, fallback email, relances automatisées (cron J+2/J+5/J+7), calendrier disponibilités, parrainage avec code unique, historique factuel (pas de notation subjective au MVP), carnet de favoris |
| Administration & Opérations | FR51-FR56, FR67-FR70 (8) | Agrégation périodique (toutes les 6h), monitoring par source avec alertes, rate limiting multi-niveau (IP/appareil/compte), détection mots-clés sensibles, dashboard admin, logs d'audit 1 an, système de signalement + modération |

**Non-Functional Requirements:**
45 NFRs répartis en 6 catégories qui contraignent directement les choix architecturaux :

| Catégorie | NFRs | Contraintes architecturales clés |
|---|---|---|
| Performance (9) | NFR1-NFR9 | Carte < 1s p95, candidature < 500ms p95, RPPS < 3s, cold start < 3s, TTI < 4s, LCP web < 2s, app < 50MB, push < 10s, statuts temps réel < 2s |
| Sécurité (11) | NFR10-NFR20 | TLS 1.3 transit, AES-256 repos, JWT 15min/7j, secure storage natif, OWASP Top 10, rate limiting (3 comptes/IP/jour, 100 req/h recherche), sanitization HTML/JS, push sans données personnelles, logs audit 1 an |
| Scalabilité (5) | NFR21-NFR25 | 5x charge sans refonte, schéma multi-professions jour 1 (`profession` extensible), agrégation extensible sans modification code cœur, 500 utilisateurs simultanés MVP, cache local 1000+ annonces |
| Fiabilité (7) | NFR26-NFR32 | 99,5% uptime, RPO 24h→1h (post-HDS), RTO 4h→1h (post-HDS), backups 3-2-1, mode dégradé API Annuaire Santé, sync offline automatique, cache agrégation en fallback |
| Conformité (6) | NFR33-NFR38 | Hébergement EU, export RGPD JSON/PDF < 24h, suppression 30 jours + anonymisation, agrégation sans données personnelles, durées conservation différenciées, FCM payload générique |
| Intégration (4) | NFR39-NFR42 | Retry exponentiel API, cache RPPS 6 mois, agrégation 6h avec monitoring, détection changements structure HTML < 24h |
| Accessibilité (3) | NFR43-NFR45 | Dynamic Type, contraste 4.5:1, zones tap 44×44 |

**Scale & Complexity:**

- Domaine principal : Full-stack multi-plateforme — marketplace healthcare réglementée
- Niveau de complexité : **Élevé** — profession réglementée (Ordre MK, RPPS), conformité RGPD santé + plan HDS, marketplace two-sided avec flux de paiement inversé, multi-plateforme (mobile + web), agrégation de données externes, mode offline
- Composants architecturaux estimés : ~12-15 modules distincts (auth, profiles, annonces, candidatures, messagerie, contrats, notifications, agrégation, admin, paiement, recherche géospatiale, cache/offline, monitoring)

### Technical Constraints & Dependencies

**Contraintes du contexte brownfield :**
- Code existant Next.js 14 / React 18 / Supabase / Stripe / Tailwind / Leaflet (~65 pages/composants, 20 migrations Supabase)
- Le MVP mobile React Native/Expo est le nouveau produit principal — le code web existant devient la landing page puis le site web complet (Phase 3)
- Supabase est le backend MVP (Auth + Database + Edge Functions + Realtime + Storage) — migration vers PostgreSQL 18 managé Scaleway HDS planifiée avant Stripe Connect (~M5)

**Contraintes ressources :**
- Développeur solo (Nathan, kiné la journée, fondateur le soir)
- Agent IA (Claude Code) comme backup dev
- Budget urgence : 500-1000€ freelance ponctuel

**Dépendances externes critiques :**
- API Annuaire Santé (FHIR) — vérification RPPS, point unique de confiance identitaire
- Firebase Cloud Messaging / APNs — canal push, payload générique uniquement
- Stripe Connect (Phase 3) — flux de paiement inversé, KYC, compte séquestre
- Sources d'agrégation (Rempleo, Facebook) — scraping, risque TOS, monitoring
- Scaleway HDS (Phase 3) — hébergement certifié pour migration
- Apple App Store + Google Play — publication, compliance, review

**Contraintes réglementaires :**
- RGPD santé applicable dès le MVP (consentement, export, suppression, durées conservation)
- HDS 2.0 requis avant Stripe Connect (données financières liées à des actes de santé = zone grise)
- Ordre des Masseurs-Kinésithérapeutes — validation template contrat pré-lancement
- Zero conseil juridique — disclaimer obligatoire sur chaque contrat généré

**Limites du tier Supabase (seuils de migration) :**
- 500 connexions Realtime simultanées (free tier) — NFR24 exige 500 utilisateurs simultanés, seuil critique
- 500 MB stockage DB — suffisant pour le MVP, monitoring requis dès M3
- 2 GB transfert/mois (free tier) — agrégation + API + Realtime consomment rapidement
- Edge Functions : cold start variable (100-500ms), timeout max 150s (free tier)
- Seuil décisionnel : passage au tier Pro (25$/mois) dès que 1 limite est atteinte, migration HDS planifiée indépendamment (~M5)

**Stratégie de portabilité (migration HDS) :**
- La logique métier (agrégation, contrats, relances, matching) doit être encapsulée dans des modules TypeScript portables, invoqués par les Edge Functions mais non couplés à Supabase
- Architecture hexagonale légère : interfaces ("ports") vers Supabase (DB, Auth, Storage, Realtime) abstraites derrière des adapters remplaçables
- Le jour de la migration HDS, on change les adapters (Supabase → PostgreSQL 18 Scaleway + NestJS), pas la logique métier
- Chaque service externe (Stripe, Firebase FCM, API Annuaire Santé) est également derrière une interface pour permettre le remplacement ou le mock en test

### Cross-Cutting Concerns Identified

1. **Authentification & Autorisation** — Multi-mode auth (email/pwd + magic link) via Supabase Auth + table `profiles` séparée (RPPS status, rôle). RLS Supabase par rôle (remplaçant/titulaire/admin), JWT 15min/7j, switch de rôle fluide (FR63), détection usurpation. PSC = provider OAuth custom futur sans changement d'architecture
2. **Événements temps réel** — Statuts annonces (6 états, propagation < 2s via Supabase Realtime Postgres Changes), notifications candidatures, messagerie texte. Cascades gérées par transactions DB + triggers au MVP, évolution vers bus d'événements en Phase 2
3. **Offline-first mobile** — Cache local (AsyncStorage derrière interface `OfflineStore`, ~100 annonces MVP), file d'attente actions (candidatures + messages), sync automatique au retour réseau, indicateurs visuels d'état. Migration expo-sqlite quand volume le justifie
4. **Pipeline d'agrégation** — Architecture plugin/adapter : interface `AggregationSource` par source (fetch → normalize → return). Orchestrateur pg_cron → Edge Function maître → dispatch parallèle par source. Chaque source isolée (timeout, métriques, circuit breaker). Ajout de source = implémentation interface + config, zéro modification code cœur (NFR23)
5. **Conformité RGPD & chemin HDS** — Registre des traitements, base légale par donnée, export/suppression, anonymisation, durées conservation, plan de migration documenté dès M1. Migration Supabase → Scaleway HDS ~M5 avant Stripe Connect
6. **Sécurité multi-couche** — OWASP Top 10, rate limiting (IP/appareil/compte), sanitization inputs, masquage coordonnées, détection données sensibles, anti-phishing messagerie, logs audit 1 an
7. **Multi-plateforme avec UX adaptée** — React Native/Expo (mobile) + Next.js (web) dans un monorepo pnpm workspace : `@jim/mobile`, `@jim/web`, `@jim/shared` (types TS, constantes, api-client, tokens design). Turborepo ajouté si équipe grandit
8. **Extensibilité multi-professions** — Table `professions` référencée avec config JSONB par profession (spécialités, template contrat, config vérification). FK depuis `profiles`. Ajout profession = INSERT + config, zéro migration schema (NFR22)
9. **Portabilité de la logique métier** — Architecture hexagonale légère avec interfaces vers les services externes (Supabase, Stripe, Firebase, API Annuaire Santé). Les modules métier (agrégation, contrats, relances) sont des packages TypeScript purs, invoqués par les Edge Functions au MVP puis par NestJS post-migration. Critique pour la migration HDS sans réécriture
10. **Évolution architecturale par phases** — L'architecture n'est pas statique : MVP (Supabase maximal) → Phase 2 (bus d'événements, amélioration offline) → Phase 3 (NestJS + PostgreSQL HDS + Stripe Connect). Chaque transition documentée avec ses déclencheurs (volume, conformité, revenue) et son plan de migration
11. **Système de notifications événementiel** — Table `notification_queue` avec scheduling (`scheduled_at`). Deux mécanismes : trigger Postgres pour l'immédiat, pg_cron (15 min) pour les planifiées (relances J+2/J+5/J+7). Dispatcher multi-canal (push FCM/APNs + email fallback). Payload push générique (NFR18), audit trail natif
12. **Génération documentaire** — Contrats stockés en JSONB (clauses verrouillées + éditables + champs factuels). Double rendu : composant React Native (résumé in-app 5 points) + @react-pdf/renderer (PDF téléchargeable). Template versionné. Phase 3 : signature électronique Yousign (eIDAS)
13. **Abstraction des dépendances externes** — Chaque intégration tierce (Supabase Auth, Supabase DB, Supabase Realtime, Stripe Connect, Firebase FCM/APNs, API Annuaire Santé FHIR, sources d'agrégation) est encapsulée derrière une interface TypeScript. Permet le mock en test, le remplacement progressif, et la résilience (mode dégradé par service)

### ADRs Préliminaires Identifiés

10 décisions architecturales structurantes émergent du contexte projet. Elles seront affinées dans les steps suivants :

| # | ADR | Décision préliminaire | Trade-off clé |
|---|---|---|---|
| 1 | Backend MVP | Supabase Auth/DB/Realtime/Storage + logique métier dans des modules TS portables (hexagonal léger) | +2-3j setup initial → migration 10x plus douce |
| 2 | Temps réel | Supabase Realtime (Postgres Changes) au MVP, cascades via transactions DB + triggers. Bus d'événements Phase 2 | Simplicité MVP vs extensibilité future |
| 3 | Offline mobile | AsyncStorage + file d'attente custom derrière interface `OfflineStore`. Migration expo-sqlite quand volume justifie | Cache limité (~100 annonces MVP) vs complexité sync |
| 4 | Recherche géospatiale | PostGIS (extension Supabase) + react-native-maps. Requêtes ST_DWithin + bounding box + pagination serveur | Dépendance PostGIS vs performance < 1s p95 |
| 5 | Monorepo | pnpm workspace minimal : `@jim/mobile`, `@jim/web`, `@jim/shared`. Turborepo si équipe grandit | Zéro overhead vs pas de cache build |
| 6 | Pipeline agrégation | Edge Functions chaînées — orchestrateur + 1 function/source + interface `AggregationSource` | Complexité orchestration vs résilience par source + extensibilité NFR23 |
| 7 | Auth & identité | Supabase Auth + table `profiles` séparée (RPPS status, rôle). PSC = provider OAuth custom futur | Cohérent brownfield existant, lookup DB supplémentaire compensé par index |
| 8 | Notifications | Table `notification_queue` + trigger immédiat + pg_cron planifié + dispatcher multi-canal | Table supplémentaire vs découplage + scheduling + audit trail |
| 9 | Contrats | JSON unique en DB (clauses verrouillées + éditables) + double rendu (React Native in-app + @react-pdf PDF) | Complexité double rendu vs source de vérité unique |
| 10 | Multi-professions | Table `professions` référencée avec config JSONB par profession. FK depuis `profiles` | Join supplémentaire vs ajout profession sans migration schema |

## Starter Template Evaluation

### Primary Technology Domain

**Multi-plateforme full-stack** : React Native/Expo + Next.js (web) + Supabase (backend) — marketplace healthcare réglementée avec monorepo partagé, stratégie Adaptive Multi-Breakpoint.

### Préférences techniques existantes

| Catégorie | Préférence documentée | Source |
|---|---|---|
| Langages | TypeScript strict | PRD, UX spec, brownfield |
| Frontend mobile | React Native + Expo (managed workflow) + Expo Router | PRD, UX spec |
| Frontend web | Next.js App Router | PRD, brownfield existant |
| Styling | NativeWind v4 (Tailwind pour RN) + Tailwind CSS (web) | UX spec ADR-001 |
| Backend | Supabase (Auth + DB + Edge Functions + Realtime + Storage) | PRD |
| Base de données | PostgreSQL (Supabase) → PostgreSQL 18 Scaleway HDS | PRD |
| Monorepo | pnpm workspace minimal | UX spec, ADR préliminaire #5 |
| Design tokens | `tailwind.config.js` source unique + script build-time `extract-tokens.js` | UX spec ADR-004 |
| Composants | Custom `@jim/ui` sur NativeWind + Reanimated + Gesture Handler | UX spec ADR-002 |

### Versions actuelles vérifiées (mars 2026)

| Technologie | Version | Notes |
|---|---|---|
| Expo SDK | **54.x** (stable, recommandé MVP) | NativeWind v4 confirmé compatible |
| Expo SDK | 55.0.4 (25 fév 2026) | React Native 0.83.1, New Architecture obligatoire. Upgrade prévu ~M2 |
| Next.js | **16.1** (déc 2025) | Turbopack stable, App Router |
| NativeWind | **v4.2.0+** | Tailwind CSS v3.4.17 requis (pas v4.x) |
| NativeWind | v5 (preview) | Tailwind CSS v4.1+, pas encore stable |
| @supabase/supabase-js | **2.98.0** | v2 stable, pas de v3 |
| Supabase CLI | 2.76.15 | |
| React Native | 0.81 (SDK 54) | |
| React | 19.x (SDK 54) | |
| Tailwind CSS | **3.4.17** | Version stable pour NativeWind v4 |

### Starter Options Considered

**Option A : create-t3-turbo (fork Supabase)**
- Stack : Expo SDK 54 + Next.js 15 + Supabase + Turborepo + tRPC + Drizzle + better-auth + NativeWind v5
- **Rejeté** — trop opinionné. tRPC, Drizzle, better-auth inutiles (Supabase direct). NativeWind v5 instable. Turborepo au MVP contraire à la spec UX

**Option B : byCedric/expo-monorepo-example**
- Stack : Expo + pnpm + Turborepo
- **Référence utile** pour la config Metro monorepo, mais pas un starter direct (dernière mise à jour jan 2024, pas de Supabase/NativeWind)

**Option C : Custom monorepo pnpm workspace (recommandé)**
- Stack : create-expo-app SDK 54 + create-next-app 16.1 + pnpm workspace
- **Sélectionné** — contrôle total, zéro opinion non souhaitée, aligné avec UX spec

### Selected Starter: Custom monorepo pnpm workspace

**Rationale for Selection:**
Le PRD et la spec UX définissent précisément le stack. Aucun starter existant ne correspond sans modifications massives. Un assemblage intentionnel de briques matures est préférable à un template opinionné à élaguer. Le template initial ne survit pas 2 semaines — choisir le plus minimal possible.

**Initialization Command:**

```bash
# 1. Créer le workspace racine
mkdir jim-app && cd jim-app
pnpm init

# 2. Configurer pnpm workspace
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 3. Configurer pnpm pour React Native (hoisting requis)
cat > .npmrc << 'EOF'
node-linker=hoisted
shamefully-hoist=true
EOF

# 4. App mobile (Expo SDK 54 stable)
npx create-expo-app@latest apps/mobile --template default

# 5. App web (Next.js 16.1)
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir

# 6. Packages partagés
mkdir -p packages/shared/{adapters,types,api-client,tokens,constants}
mkdir -p packages/ui
```

**Post-init : Migration brownfield**

```bash
# Migrer les types DB et le client Supabase du brownfield existant
# Types DB : générés par Supabase CLI (jamais copiés manuellement)
supabase gen types typescript --project-id <id> > packages/shared/types/database.ts

# Client Supabase : adapter depuis src/lib/supabase/ du brownfield
# Migrations Supabase : copier supabase/migrations/ vers la racine
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
TypeScript strict, Node 20.x, pnpm 9.x. ESLint + Prettier configurés par create-expo-app et create-next-app.

**Styling Solution:**
NativeWind v4.2.0+ (mobile, Tailwind CSS v3.4.17) + Tailwind CSS v3.4.17 (web). Config Tailwind racine unique avec `preset` dans les configs apps :
```
jim-app/
├── tailwind.config.js              # Source unique des tokens
├── apps/mobile/tailwind.config.js  # preset: ['../../tailwind.config.js']
├── apps/web/tailwind.config.js     # preset: ['../../tailwind.config.js']
```

**Build Tooling:**
Metro (Expo) + Turbopack (Next.js). Pas de Turborepo/Nx au MVP (ajouté si équipe grandit).

**Code Organization:**
```
jim-app/
├── apps/
│   ├── mobile/          # @jim/mobile — Expo SDK 54 + Expo Router
│   └── web/             # @jim/web — Next.js 16.1 App Router
├── packages/
│   ├── shared/
│   │   ├── adapters/    # Interfaces hexagonales (supabase, notifications, storage)
│   │   ├── types/       # database.ts (généré par Supabase CLI)
│   │   ├── api-client/  # Client Supabase browser + server
│   │   ├── tokens/      # index.ts (généré par extract-tokens.js)
│   │   └── constants/   # Enums, config partagée
│   └── ui/              # @jim/ui — composants NativeWind custom
├── supabase/            # Migrations, seed, config
├── tailwind.config.js   # Source unique tokens
├── pnpm-workspace.yaml
├── .npmrc               # shamefully-hoist=true
└── eas.json             # Config EAS Build avec pnpm
```

**Development Experience:**
Hot reloading via Metro (mobile) et Turbopack (web). TypeScript strict. Expo Go pour le dev mobile rapide.

### Matrice de compatibilité (verrouillée)

Versions exactes (pas de `^`) sur les dépendances critiques :

| Package | Version exacte | Raison |
|---|---|---|
| `expo` | `54.x.x` | Stabilité NativeWind v4 |
| `nativewind` | `4.2.x` | Compatibilité Expo SDK 54 |
| `react-native-reanimated` | `3.x.x` | Requis par NativeWind v4 |
| `tailwindcss` | `3.4.17` | Requis par NativeWind v4 (pas v4.x) |
| `@supabase/supabase-js` | `2.98.x` | Stabilité API |
| `next` | `16.1.x` | Turbopack stable |

Plan d'upgrade SDK 55 : ~M2, après confirmation NativeWind v4 compatible. Upgrade en 1 journée grâce au lockfile et à la matrice de compatibilité.

### Mesures de résilience (Chaos Monkey)

| # | Risque | Durcissement |
|---|---|---|
| 1 | NativeWind casse après expo update | Versions exactes, matrice compatibilité README, script smoke test |
| 2 | pnpm hoisting casse Metro | `.npmrc` shamefully-hoist, `metro.config.js` avec watchFolders racine |
| 3 | Tokens divergent mobile/web | Config Tailwind racine unique avec preset, script sur config racine |
| 4 | Types brownfield incompatibles | Types DB générés par Supabase CLI, jamais copiés manuellement |
| 5 | EAS Build échoue en monorepo | Config pnpm dans `eas.json`, tester EAS Build semaine 0 |
| 6 | Supabase pricing change | Monitoring externe (UptimeRobot), budget alerts, interface adapter portable |
| 7 | Adapter hexagonal ignoré | Règle ESLint `no-restricted-imports` sur `@supabase/supabase-js` dans apps/ dès jour 0 |
| 8 | Sync offline corrompt données | Handler `onSyncError`, enum `SyncStatus` (pending/synced/failed/conflicted) dans `OfflineStore` |

**Note:** L'initialisation du projet avec ces commandes devrait être la première story d'implémentation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (bloquent l'implémentation) :**

| # | Catégorie | Décision | Choix | Version |
|---|---|---|---|---|
| D1 | Data | Validation runtime | Zod + RLS combinés | Zod 4.3.6 |
| D2 | Data | Stockage local performant | react-native-mmkv | 3.x (dev build requis) |
| D3 | Frontend | Gestion d'état serveur | TanStack Query | 5.90.x |
| D4 | Frontend | Gestion d'état client | Zustand minimal (auth + UI + offline) | 5.0.x |
| D5 | Frontend | Gestion de formulaires | React Hook Form + Zod resolver | RHF 7.x + @hookform/resolvers |
| D6 | Infra | Hébergement web | Vercel (free tier → Pro) | — |
| D7 | Infra | Monitoring & error tracking | Sentry | RN SDK 8.3.0 + Next.js SDK |

**Important Decisions (structurent l'architecture) :**

| # | Catégorie | Décision | Choix | Version |
|---|---|---|---|---|
| D8 | API | Pattern API mobile | Hybride : client direct (lectures) + Edge Functions (écritures métier) | — |
| D9 | Frontend | Virtualisation listes | FlashList (Shopify) | 1.x |
| D10 | Frontend | Chargement images | expo-image | SDK 54 intégré |
| D11 | Infra | CI/CD | GitHub Actions + EAS Build | — |
| D12 | Sécurité | Stockage sécurisé tokens | Hybride : expo-secure-store (auth tokens) + MMKV encrypted (cache data) | — |

**Deferred Decisions (post-MVP) :**

| # | Catégorie | Décision | Rationale du report |
|---|---|---|---|
| D13 | Infra | Analytics produit (PostHog / Mixpanel) | Pas critique avant product-market fit |
| D14 | API | Documentation API (OpenAPI) | Dev solo + IA, utile seulement si équipe grandit |
| D15 | Infra | Scaling strategy (Supabase Pro + CDN) | Monitoring seuils en place, décision à ~M3 |

### Data Architecture

#### D1 — Validation runtime : Zod 4.3 + RLS combinés

- **Décision :** Double couche de validation — Zod 4.3.6 côté client/Edge Functions + RLS PostgreSQL côté DB
- **Version :** Zod 4.3.6 (2kb gzip, 71M DL/semaine, TypeScript-first)
- **Rationale :** Les formulaires multi-étapes (publication annonce 5 étapes, onboarding) nécessitent une validation partielle côté client avec des erreurs lisibles. RLS reste le gardien de sécurité final côté DB. Les schémas Zod dans `@jim/shared` sont la source de vérité partagée mobile/web
- **Affects :** `@jim/shared/validators/`, React Hook Form (D5), Edge Functions, pipeline formulaires
- **Pattern :**
  - `packages/shared/validators/` — schémas Zod par domaine (annonce.schema.ts, profile.schema.ts, candidature.schema.ts)
  - Client : `zodResolver(annonceSchema)` dans React Hook Form
  - Edge Functions : `annonceSchema.parse(body)` avant write DB
  - DB : RLS policies comme dernier rempart de sécurité
- **Provided by Starter :** Non

#### D2 — Stockage local performant : react-native-mmkv

- **Décision :** react-native-mmkv remplace AsyncStorage comme implémentation de l'interface `OfflineStore` (ADR-03)
- **Version :** react-native-mmkv 3.x (~30x plus rapide qu'AsyncStorage)
- **Rationale :** Performance synchrone critique pour le cache offline (1000+ annonces, NFR25), chiffrement natif AES pour les données sensibles, persist middleware Zustand intégré. Le dev build Expo est déjà requis (EAS Build semaine 0, Chaos Monkey #5)
- **Affects :** `@jim/shared/adapters/offline-store/`, Zustand persist, cache annonces, file d'attente offline
- **Implication :** Expo Go n'est plus utilisable pour le dev — dev builds EAS uniquement. Acceptable car planifié dès Step 3
- **Pattern :**
  - `packages/shared/adapters/offline-store/mmkv.adapter.ts` — implémentation `OfflineStore` interface
  - Zustand stores avec `persist` middleware pointant vers MMKV
  - Données sensibles (RPPS cache) : instance MMKV séparée avec encryption key
- **Provided by Starter :** Non

#### Caching Strategy

- **Lectures serveur :** TanStack Query gère le cache en mémoire avec stale-while-revalidate (D3)
- **Données persistantes :** MMKV pour le cache offline (annonces, profil, préférences)
- **Tokens auth :** expo-secure-store pour les JWT Supabase (D12)
- **Agrégation :** Cache côté serveur dans une table dédiée, NFR42 (6h TTL)
- **Pas de CDN au MVP :** Vercel Edge + Supabase suffisent. CDN évalué post-MVP si trafic le justifie

### Authentication & Security

#### D12 — Stockage sécurisé : Hybride expo-secure-store + MMKV

- **Décision :** Séparation par niveau de sensibilité
- **Rationale :** Les tokens d'authentification (JWT, refresh) exigent un stockage hardware-backed (Keychain iOS, Keystore Android). Les données de cache (annonces, préférences, filtres) privilégient la performance synchrone
- **Pattern :**
  - **expo-secure-store** : tokens Supabase Auth (géré par le SDK Supabase), données RPPS vérifiées
  - **MMKV encrypted** : cache annonces, préférences UI, file d'attente offline, profil local
  - **MMKV non-encrypted** : données non sensibles (dernière position carte, historique recherche)
- **Affects :** `@jim/shared/adapters/secure-store/`, module auth, `OfflineStore` adapter
- **Provided by Starter :** Non

#### Sécurité complémentaire (déjà décidée, rappel)

- Auth : Supabase Auth, JWT 15min/7j (ADR-07)
- Autorisation : RLS par rôle (remplaçant/titulaire/admin) via Supabase
- Rate limiting : Edge Functions, 3 comptes/IP/jour, 100 req/h recherche (NFR15-16)
- Sanitization : Zod (D1) + RLS + détection mots-clés sensibles (FR55)
- Push : payload générique, zéro donnée personnelle (NFR18)

### API & Communication Patterns

#### D8 — Pattern API mobile : Hybride lectures directes + écritures Edge Functions

- **Décision :** Les lectures utilisent le client Supabase direct (`.from().select()`), les écritures métier passent par des Edge Functions
- **Rationale :** Cohérent avec l'architecture hexagonale légère (ADR-01). Les lectures bénéficient du RLS natif, du temps réel, et de l'auto-complétion TypeScript via types générés. Les écritures métier (candidature, publication annonce, génération contrat) sont encapsulées dans des modules TS portables, invoqués par Edge Functions au MVP puis par NestJS post-migration HDS
- **Pattern :**
  - **Lectures directes** : `supabase.from('annonces').select('*').eq('status', 'active')` — cachées par TanStack Query
  - **Écritures métier** : `supabase.functions.invoke('create-candidature', { body })` — le module TS valide (Zod), orchestre la logique, écrit en DB
  - **Subscriptions temps réel** : `supabase.channel('annonces').on('postgres_changes', ...)` — via Supabase Realtime
- **Affects :** `@jim/shared/api-client/`, `@jim/shared/adapters/supabase/`, Edge Functions, modules métier
- **Migration HDS :** Les lectures passent de Supabase client à un ORM/query builder (Drizzle ou Prisma), les Edge Functions deviennent des routes NestJS — les modules TS métier ne changent pas
- **Provided by Starter :** Non

#### Error Handling Standards

- **Format :** `{ error: { code: string, message: string, details?: unknown } }`
- **Codes :** `AUTH_*`, `VALIDATION_*`, `ANNONCE_*`, `CANDIDATURE_*`, `SYSTEM_*`
- **Client :** TanStack Query `onError` global + toast/snackbar pour les erreurs utilisateur
- **Edge Functions :** Try/catch → réponse structurée, Sentry pour les erreurs inattendues
- **Zod :** `z.prettifyError()` (Zod 4.3) pour les erreurs de validation lisibles

### Frontend Architecture

#### D3 — Gestion d'état serveur : TanStack Query 5

- **Décision :** TanStack Query comme couche de cache et synchronisation serveur
- **Version :** @tanstack/react-query 5.90.x (20M DL/semaine)
- **Rationale :** Cache intelligent avec stale-while-revalidate, invalidation automatique sur mutation, mutations optimistes (candidature "en un clic" UX spec), devtools pour le debug, déduplique les requêtes identiques
- **Pattern :**
  - `QueryClientProvider` à la racine de l'app mobile et web
  - Hooks custom dans `@jim/shared/hooks/` : `useAnnonces()`, `useCandidatures()`, `useProfile()`
  - Invalidation : `queryClient.invalidateQueries({ queryKey: ['annonces'] })` après mutation
  - Optimistic updates : candidature marquée "envoyée" avant confirmation serveur
  - Subscriptions Supabase Realtime : mises à jour en temps réel via `queryClient.setQueryData()`
- **Affects :** Toutes les vues data-driven, hooks partagés `@jim/shared/hooks/`
- **Provided by Starter :** Non

#### D4 — Gestion d'état client : Zustand 5 minimal

- **Décision :** Zustand pour l'état client pur (non-serveur), limité à 2-3 stores
- **Version :** Zustand 5.0.x (20M DL/semaine)
- **Rationale :** API minimale, persist middleware MMKV natif, slices pattern si besoin, pas de boilerplate Redux. L'état client au MVP est limité : auth state, préférences UI, offline queue status
- **Stores MVP :**
  - `useAuthStore` — session Supabase, profil local, rôle actif, RPPS status
  - `useUIStore` — dark mode, filtres actifs, dernière position carte, vue liste/carte
  - `useOfflineStore` — queue d'actions pending, sync status (enum SyncStatus du Chaos Monkey #8)
- **Pattern :**
  - Stores dans `@jim/shared/stores/`
  - Persist via `persist` middleware + MMKV storage adapter
  - Séparation stricte : Zustand = état client, TanStack Query = état serveur. Jamais de données serveur dans Zustand
- **Affects :** `@jim/shared/stores/`, navigation, thème, offline
- **Provided by Starter :** Non

#### D5 — Gestion de formulaires : React Hook Form + Zod resolver

- **Décision :** React Hook Form avec validation Zod intégrée
- **Version :** react-hook-form 7.x + @hookform/resolvers
- **Rationale :** Performance (uncontrolled components, pas de re-render par keystroke), validation native Zod via resolver, schémas partagés `@jim/shared/validators/`. Le formulaire de publication d'annonce en 5 étapes (UX spec) bénéficie de la validation partielle par step
- **Pattern :**
  - Schéma Zod dans `@jim/shared/validators/annonce.schema.ts`
  - Form : `useForm({ resolver: zodResolver(annonceStep1Schema) })`
  - Multi-step : un schéma Zod par étape, validation progressive
  - Soumission : `handleSubmit` → `supabase.functions.invoke()` → invalidation TanStack Query
- **Affects :** Publication annonce, onboarding, édition profil, formulaire candidature
- **Provided by Starter :** Non

#### D9 — Virtualisation listes : FlashList

- **Décision :** FlashList (Shopify) remplace FlatList pour les listes d'annonces
- **Version :** @shopify/flash-list 1.x
- **Rationale :** 5-10x plus performant que FlatList grâce au recyclage natif des cellules. NFR25 exige le cache local de 1000+ annonces — FlashList les rend de manière fluide. Mêmes props que FlatList = migration triviale
- **Affects :** Liste annonces, liste candidatures, liste messages, résultats recherche
- **Provided by Starter :** Non

#### D10 — Chargement images : expo-image

- **Décision :** expo-image pour toutes les images (avatars, photos cabinet)
- **Rationale :** Maintenu par Expo, cache disque automatique, placeholders blur-hash, transitions fluides, support SVG. Intégré dans Expo SDK 54 sans configuration supplémentaire
- **Affects :** Avatars profils, photos cabinets, images agrégées
- **Provided by Starter :** Non (inclus dans Expo SDK)

### Infrastructure & Deployment

#### D6 — Hébergement web : Vercel

- **Décision :** Vercel pour la landing page Next.js (MVP) puis le site web complet (Phase 3)
- **Rationale :** Intégration native Next.js 16.1 (même éditeur), preview deployments par PR, edge functions Vercel pour le SSR, analytics intégrés, free tier généreux (100GB bandwidth). Migration vers Scaleway si requis par HDS (le web ne sert pas de données de santé au MVP)
- **Affects :** `apps/web/`, CI/CD, domaine DNS
- **Provided by Starter :** Non

#### D7 — Monitoring : Sentry

- **Décision :** Sentry pour le crash reporting et performance monitoring dès jour 1
- **Version :** @sentry/react-native 8.3.0 + @sentry/nextjs
- **Rationale :** Capture des crashes natifs (app start errors avec v8), source maps, performance traces, free tier 5K events/mois suffisant au MVP. Visibilité critique pour un dev solo — impossible de débugger des crashes production sans outil
- **Pattern :**
  - Mobile : `Sentry.init()` dans `apps/mobile/app/_layout.tsx`
  - Web : `@sentry/nextjs` avec `sentry.client.config.ts` + `sentry.server.config.ts`
  - Source maps : upload automatique via EAS Build (mobile) et Vercel (web)
  - Alertes : email sur crash rate > 1%, latence p95 > seuil NFR
- **Affects :** `apps/mobile/`, `apps/web/`, EAS Build config, Vercel config
- **Provided by Starter :** Non

#### D11 — CI/CD : GitHub Actions + EAS Build

- **Décision :** GitHub Actions pour le CI (lint, types, tests) + EAS Build pour les builds natifs + EAS Update pour les OTA updates
- **Rationale :** GitHub Actions = 2000 min/mois gratuit, suffisant pour CI. EAS Build = builds managés sans Mac local pour iOS, 30 builds/mois free tier. EAS Update = déploiement JS over-the-air sans re-soumission store
- **Pipeline :**
  - **PR :** lint → typecheck → tests unitaires → preview deploy Vercel
  - **Merge main :** CI + EAS Build (dev) → distribution interne
  - **Release :** EAS Build (production) → soumission stores + deploy Vercel production
  - **Hotfix :** EAS Update (OTA) → patch JS sans build natif
- **Affects :** `.github/workflows/`, `eas.json`, Vercel project config
- **Provided by Starter :** Non

### Decision Impact Analysis

**Implementation Sequence :**

1. **Semaine 0 :** Monorepo + EAS Build + Sentry — fondations (D6, D7, D11)
2. **Semaine 0 :** MMKV + Zustand + expo-secure-store — stockage (D2, D4, D12)
3. **Semaine 1 :** TanStack Query + Supabase client + hooks partagés — data layer (D3, D8)
4. **Semaine 1 :** Zod schemas + React Hook Form — validation (D1, D5)
5. **Semaine 1 :** FlashList + expo-image — composants performance (D9, D10)

**Cross-Component Dependencies :**

```
D1 (Zod) ──────→ D5 (React Hook Form + Zod resolver)
    │                    │
    └──→ D8 (Edge Functions validation)
                         │
D2 (MMKV) ─────→ D4 (Zustand persist)
    │                    │
    └──→ D12 (Hybride secure-store + MMKV)
                         │
D3 (TanStack Query) ──→ D8 (Hybride lectures/écritures)
    │
    └──→ D9 (FlashList consomme les queries)
                         │
D7 (Sentry) ────→ D11 (CI/CD upload source maps)
    │
    └──→ D6 (Vercel intégration Sentry)
```

**Matrice de compatibilité étendue (versions verrouillées) :**

| Package | Version exacte | Raison |
|---|---|---|
| `expo` | `54.x.x` | Stabilité NativeWind v4, FlashList, MMKV |
| `nativewind` | `4.2.x` | Compatibilité Expo SDK 54 |
| `react-native-reanimated` | `3.x.x` | Requis par NativeWind v4 |
| `tailwindcss` | `3.4.17` | Requis par NativeWind v4 |
| `@supabase/supabase-js` | `2.98.x` | Stabilité API |
| `next` | `16.1.x` | Turbopack stable |
| `zod` | `4.3.x` | Validation TS-first |
| `@tanstack/react-query` | `5.90.x` | Cache + mutations |
| `zustand` | `5.0.x` | État client + persist MMKV |
| `react-hook-form` | `7.x.x` | Formulaires + Zod resolver |
| `react-native-mmkv` | `3.x.x` | Stockage synchrone + encryption |
| `@shopify/flash-list` | `1.x.x` | Virtualisation listes |
| `@sentry/react-native` | `8.3.x` | Crash reporting |

## Implementation Patterns & Consistency Rules

### Adoption par phases

Les patterns sont organisés en 3 phases d'adoption pour un dev solo + IA :

- **Phase 0 (jour 1, ~2h setup)** — Automatique, protège immédiatement via ESLint + scripts CI
- **Phase 1 (semaines 1-4, on-demand)** — Ajouté quand le pattern est rencontré pour la première fois dans une story
- **Phase 2+ (quand justifié)** — Différé jusqu'à ce que le problème se manifeste

**Story 0 :** Le setup Phase 0 est une story explicite dans le backlog avec acceptance criteria : CI passe, ESLint configuré, registres créés, adapters en place. Validation finale : **test de l'agent naïf** — ouvrir une nouvelle session Claude, donner une micro-story, vérifier que l'ESLint guide vers les bons patterns sans avoir lu architecture.md.

### Naming Patterns

#### Base de données (PostgreSQL/Supabase)

Convention brownfield confirmée :

| Élément | Convention | Exemple |
|---|---|---|
| Tables | `snake_case`, pluriel | `profiles`, `annonces`, `candidatures` |
| Colonnes | `snake_case` | `date_debut`, `type_annonce`, `rpps_verified` |
| Clés étrangères | `<table_singulier>_id` | `profile_id`, `annonce_id` |
| Index | `idx_<table>_<colonnes>` | `idx_annonces_status_created` |
| Contraintes | `<table>_<colonne>_<type>` | `annonces_type_annonce_check` |
| Enums DB | `snake_case` string literals | `'remplacement'`, `'candidature_recue'` |
| Fonctions SQL | `snake_case` | `search_annonces_geo()` |
| RLS policies | `<action>_<table>_<rule>` | `select_annonces_public`, `insert_candidatures_own` |
| Migrations | `NNN_<description>.sql` | `007_add_notification_queue.sql` |
| Timestamps | `created_at`, `updated_at` | Toujours présents sur chaque table |

#### Code TypeScript

| Élément | Convention | Exemple |
|---|---|---|
| Fichiers composants | `kebab-case.tsx` | `annonce-card.tsx` |
| Fichiers utilitaires | `kebab-case.ts` | `date-utils.ts` |
| Fichiers schémas Zod | `<domaine>.schema.ts` | `annonce.schema.ts` |
| Fichiers stores Zustand | `<domaine>.store.ts` | `auth.store.ts` |
| Fichiers hooks | `use-<nom>.ts` | `use-annonces.ts` |
| Fichiers adapters | `<provider>.adapter.ts` | `mmkv.adapter.ts` |
| Exports composants | `PascalCase` named exports | `export function AnnonceCard()` |
| `export default` | **Interdit** sauf fichiers route framework | `page.tsx`, `layout.tsx`, `[id].tsx` |
| Variables / params | `camelCase` | `const filterResults = ...` |
| DB destructurées | garder `snake_case` | `const { date_debut, type_annonce } = row` |
| Variables dérivées | `camelCase` | `const durationDays = diff(date_fin, date_debut)` |
| Constantes module | `SCREAMING_SNAKE_CASE` | `const MAX_RESULTS = 50` |
| Interfaces / Types | `PascalCase` | `interface Annonce`, `type TypeAnnonce` |
| Types unions (enums) | String literals, jamais `enum` TS | `type Role = "titulaire" \| "remplacant"` |
| Hooks custom | `use<PascalCase>` | `useAnnonces()`, `useAuthStore()` |
| Stores Zustand | `use<Domain>Store` | `useAuthStore`, `useUIStore` |
| TanStack Query keys | Via factory `queryKeys.*` uniquement | `queryKeys.annonces.detail(id)` |

**Règle dérivation snake/camel :** Si ça vient de la DB, snake_case. Si tu le calcules, camelCase. Pas d'exception.

#### API & Edge Functions

| Élément | Convention | Exemple |
|---|---|---|
| Routes API Next.js | `kebab-case` nested | `/api/saved-searches/route.ts` |
| Edge Functions Supabase | `kebab-case` | `create-candidature` |
| JSON body fields | `snake_case` (miroir DB) | `{ type_annonce: "remplacement" }` |
| Headers custom | `X-Jim-<Name>` | `X-Jim-Request-Id` |

**Règle frontière client↔serveur :** Les données traversent en `snake_case` (format DB). Pas de transformation camelCase↔snake_case. Les schémas Zod miroir DB utilisent snake_case pour les noms de champs.

### Structure Patterns

#### Organisation des fichiers (monorepo)

```
jim-app/
├── apps/
│   ├── mobile/                        # @jim/mobile
│   │   ├── app/                       # Expo Router (file-based)
│   │   │   ├── (tabs)/               # Tab navigator group
│   │   │   ├── annonces/
│   │   │   ├── _layout.tsx           # Root layout (providers)
│   │   │   └── +not-found.tsx
│   │   └── components/               # Composants spécifiques mobile
│   │       └── <feature>/
│   │
│   └── web/                           # @jim/web
│       ├── src/app/                   # Next.js App Router
│       │   └── api/                   # API routes (kebab-case)
│       └── src/components/            # Composants spécifiques web
│
├── packages/
│   ├── shared/                        # @jim/shared
│   │   ├── adapters/                  # Interfaces hexagonales
│   │   │   ├── supabase/
│   │   │   ├── offline-store/
│   │   │   ├── notifications/
│   │   │   └── secure-store/
│   │   ├── hooks/                     # Hooks TanStack Query (client-side only)
│   │   │   ├── query-keys.ts          # Factory centralisé — source unique des query keys
│   │   │   ├── use-annonces.ts
│   │   │   └── use-profile.ts
│   │   ├── stores/                    # Zustand stores
│   │   │   ├── auth.store.ts
│   │   │   ├── ui.store.ts
│   │   │   ├── offline.store.ts
│   │   │   └── storage-adapter.ts     # MMKV (mobile) / localStorage (web)
│   │   ├── validators/                # Schémas Zod — schéma maître + .pick()
│   │   │   ├── annonce.schema.ts
│   │   │   └── profile.schema.ts
│   │   ├── types/                     # database.ts généré par Supabase CLI
│   │   ├── api-client/
│   │   │   ├── client.ts              # createClient() — browser + mobile
│   │   │   └── server.ts              # createServerClient() — RSC uniquement
│   │   ├── constants/
│   │   │   ├── error-codes.ts         # Registre centralisé ErrorCode
│   │   │   └── notification-types.ts  # Registre centralisé NotificationType
│   │   ├── tokens/
│   │   └── utils/
│   │       ├── parse-error.ts         # parseApiError() — transition format erreurs
│   │       └── date-utils.ts
│   │
│   └── ui/                            # @jim/ui — composants cross-platform
│       ├── button.tsx
│       ├── card.tsx
│       └── index.ts                   # Seul barrel export autorisé
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   │   ├── create-candidature/
│   │   │   └── index.ts               # ≤ 40 lignes — handler uniquement
│   │   └── _shared/
│   │       ├── candidature.service.ts  # Logique métier portable
│   │       ├── contrat.service.ts
│   │       └── constants/
│   │           ├── error-codes.ts      # Sync avec @jim/shared/constants/
│   │           └── notification-types.ts
│   └── seed.sql
│
├── scripts/
│   ├── check-edge-function-size.sh
│   └── check-schema-sync.ts           # Phase 2
│
├── tailwind.config.js
├── pnpm-workspace.yaml
├── .npmrc
└── eas.json
```

#### Critère cross-platform (placement composants)

| → `packages/ui/` (cross-platform) | → `apps/<app>/components/` (app-specific) |
|---|---|
| NativeWind uniquement | Module natif platform-specific (react-native-maps, camera) |
| NativeWind + Reanimated | API web uniquement (Leaflet, window.xxx) |
| NativeWind + Gesture Handler | Dépend d'une lib non cross-platform |
| Composants layout + design system | Composants feature avec dépendance native spécifique |

**Mnémonique :** Compile sans module natif platform-specific = cross-platform.

#### Tests

| Pattern | Convention |
|---|---|
| Emplacement | Co-locatés : `use-annonces.test.ts` à côté de `use-annonces.ts` |
| Fichiers | `<nom>.test.ts` ou `<nom>.test.tsx` |
| Framework | Vitest (unit/integration) + React Native Testing Library |
| E2E | Différé post-MVP (Maestro mobile, Playwright web) |
| Convention | `describe('<Module>')` → `it('should <comportement attendu>')` |

#### Imports

| Règle | Exemple |
|---|---|
| **Toujours par chemin direct** | `import { useAnnonces } from '@jim/shared/hooks/use-annonces'` |
| **Seul barrel autorisé : @jim/ui** | `import { Button, Card } from '@jim/ui'` |
| **Barrels interdits** | ~~`import { useAnnonces } from '@jim/shared'`~~ |
| **Relatifs cross-package interdits** | ~~`import { ... } from '../../../packages/shared/...'`~~ |
| **@supabase/supabase-js interdit dans apps/** | ESLint `no-restricted-imports` |
| **react-native-mmkv interdit dans shared/** | Sauf `storage-adapter.ts` (ESLint override) |

### Format Patterns

#### Réponses API — Format unique

```typescript
// Succès
{ data: result }                    // Lecture
{ data: created }                   // Création (status 201)
{ success: true }                   // Action sans retour

// Erreur — format unique (Edge Functions + API routes)
{ error: { code: 'CANDIDATURE_ALREADY_EXISTS', message: 'Vous avez déjà candidaté.' } }
```

**Transition brownfield :** Les API routes existantes retournent `{ error: "string" }`. Le client utilise `parseApiError()` qui normalise les deux formats :

```typescript
// packages/shared/utils/parse-error.ts
export function parseApiError(response: unknown): { code: string; message: string } {
  if (typeof response?.error === 'string') {
    return { code: 'SYSTEM_LEGACY_ERROR', message: response.error }
  }
  return response.error
}
```

#### Registres centralisés

**Error codes** (`@jim/shared/constants/error-codes.ts` + `supabase/functions/_shared/constants/error-codes.ts`) :

| Préfixe | Domaine |
|---|---|
| `AUTH_` | `AUTH_UNAUTHORIZED`, `AUTH_SESSION_EXPIRED`, `AUTH_RPPS_REQUIRED` |
| `VALIDATION_` | `VALIDATION_INVALID_DATES`, `VALIDATION_SCHEMA_ERROR` |
| `ANNONCE_` | `ANNONCE_NOT_FOUND`, `ANNONCE_ALREADY_CLOSED`, `ANNONCE_OWNER_ONLY` |
| `CANDIDATURE_` | `CANDIDATURE_ALREADY_EXISTS`, `CANDIDATURE_SELF_APPLY` |
| `CONTRAT_` | `CONTRAT_GENERATION_FAILED` |
| `RATE_LIMIT_` | `RATE_LIMIT_EXCEEDED` |
| `SYSTEM_` | `SYSTEM_INTERNAL_ERROR`, `SYSTEM_EXTERNAL_API_DOWN`, `SYSTEM_LEGACY_ERROR` |

**Notification types** (`notification-types.ts`, même pattern de sync) :

`CANDIDATURE_RECUE`, `CANDIDATURE_ACCEPTEE`, `CANDIDATURE_REFUSEE`, `MESSAGE_RECU`, `ANNONCE_EXPIREE`, `ANNONCE_POURVUE`, `RELANCE_J2`, `RELANCE_J5`, `RELANCE_J7`

**String literals interdits** pour les codes et types — import du registre obligatoire.

#### Formats de données

| Donnée | Format | Exemple |
|---|---|---|
| Dates JSON | ISO 8601 UTC | `"2026-03-13T08:00:00.000Z"` |
| Dates affichées | Locale française | `"13 mars 2026"` |
| Prix | Centimes en DB, formaté en UI | DB: `8300` → UI: `"83%"` |
| Coordonnées GPS | `{ latitude, longitude }` | PostGIS `geography(Point, 4326)` |
| RPPS | String 11 digits | `"10123456789"` |
| Booléens | `true`/`false` (jamais 0/1) | |
| Nulls | `null` explicite (jamais `undefined` en JSON) | |

### Communication Patterns

#### Supabase Realtime + TanStack Query

```typescript
// Pattern standard dans les hooks partagés
useEffect(() => {
  const channel = supabase
    .channel('annonces:updates')
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'annonces' },
      (payload) => {
        queryClient.setQueryData(
          queryKeys.annonces.detail(payload.new.id),
          payload.new
        )
        queryClient.invalidateQueries({ queryKey: queryKeys.annonces.lists() })
      }
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}, [queryClient])
```

#### Query Key Factory

```typescript
// packages/shared/hooks/query-keys.ts — source unique
export const queryKeys = {
  annonces: {
    all: ['annonces'] as const,
    lists: () => [...queryKeys.annonces.all, 'list'] as const,
    list: (filters?: AnnonceFilters) => [...queryKeys.annonces.lists(), filters] as const,
    details: () => [...queryKeys.annonces.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.annonces.details(), id] as const,
  },
  candidatures: {
    all: ['candidatures'] as const,
    byAnnonce: (id: string) => [...queryKeys.candidatures.all, 'annonce', id] as const,
    mine: () => [...queryKeys.candidatures.all, 'mine'] as const,
  },
  messages: {
    all: ['messages'] as const,
    byConversation: (id: string) => [...queryKeys.messages.all, 'conversation', id] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: () => [...queryKeys.profile.all, 'me'] as const,
  },
} as const
```

Tout `queryKey` utilise le factory. Littéraux `['string']` interdits.

#### Zustand Stores

| Règle | Détail |
|---|---|
| Naming | `use<Domain>Store` |
| Mutations | `set<Property>` ou verbes métier (`enqueueAction()`) |
| Persist | `persist` middleware via `createStorageAdapter()` (MMKV mobile, localStorage web) |
| Séparation stricte | Zustand = client pur, TanStack Query = serveur. Jamais de données serveur dans Zustand |
| Stores MVP | `useAuthStore`, `useUIStore`, `useOfflineStore` |

#### Supabase Client

| Contexte | Fonction | Usage |
|---|---|---|
| Browser + Mobile | `createClient()` | Hooks TanStack Query, composants client |
| Server (RSC Next.js) | `createServerClient()` | Server Components uniquement |
| Mobile auth storage | MMKV storage adapter injecté | Zéro AsyncStorage résiduel |

Les hooks `@jim/shared/hooks/` sont **client-side only** (composants React). Les Server Components Next.js utilisent `createServerClient()` directement, pas les hooks.

### Process Patterns

#### Error Handling

| Couche | Pattern |
|---|---|
| Composants UI | `try/catch` → toast sonner |
| TanStack Query | `onError` global → toast + Sentry si inattendu |
| Edge Functions | `try/catch` → `{ error: { code, message } }` + Sentry |
| Zod | `schema.safeParse()` → `z.prettifyError()` |
| Supabase RLS | Message générique client, jamais de détail RLS exposé |

Messages d'erreur utilisateur : toujours en français, toujours actionnable. Jamais de stacktrace.

#### Loading States

| Pattern | Convention |
|---|---|
| Données serveur | Dérivé de TanStack Query (`isLoading`, `isFetching`) — jamais de `useState(loading)` |
| Listes | Skeleton composants NativeWind |
| Boutons | `disabled` + spinner inline pendant soumission |
| Optimistic | Candidature → UI mise à jour immédiatement, rollback si erreur |

#### Edge Functions — Structure imposée

Chaque Edge Function index.ts ≤ 40 lignes. Pattern **handler → service → response** :

```typescript
// supabase/functions/create-candidature/index.ts (≤ 40 lignes)
import { createCandidature } from '../_shared/candidature.service.ts'

serve(async (req) => {
  const body = await req.json()
  const result = await createCandidature(body, supabaseAdmin)
  return new Response(JSON.stringify({ data: result }), { status: 201 })
})
```

Toute logique métier dans `_shared/<domaine>.service.ts` — portable vers NestJS post-migration HDS.

#### Zod — Schéma maître + .pick()

Un seul schéma maître par domaine. Sous-schémas via `.pick()` ou `.extend()` :

```typescript
// packages/shared/validators/annonce.schema.ts
export const annonceSchema = z.object({
  type_annonce: z.enum(['remplacement', 'assistanat', 'collaboration', 'cession']),
  date_debut: z.string().datetime(),
  date_fin: z.string().datetime(),
  retrocession: z.number().min(0).max(100),
})

export const annonceStep1Schema = annonceSchema.pick({
  type_annonce: true, date_debut: true, date_fin: true,
})
```

Jamais de schéma Zod dans `apps/`. Jamais inline. Après chaque migration SQL : 1) `supabase gen types` 2) mettre à jour le schéma Zod correspondant.

#### Offline — Idempotence (Phase 2)

Chaque action offline a un `idempotencyKey` (`${action_type}:${resource_id}:${user_id}`). Déduplication côté client (queue) ET côté serveur (header `Idempotency-Key`).

### Enforcement — Phase 0 (ESLint + CI)

**ESLint (mode `error`, CI bloque) :**

```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [
        { "group": ["@supabase/supabase-js"], "message": "Utiliser @jim/shared/api-client/" },
        { "group": ["@jim/shared"], "message": "Import direct : @jim/shared/hooks/use-annonces" },
        { "group": ["@jim/shared/hooks"], "message": "Import direct du fichier" },
        { "group": ["../../../packages/*"], "message": "Utiliser @jim/* alias" }
      ]
    }],
    "import/no-default-export": ["error"]
  },
  "overrides": [
    { "files": ["**/app/**/page.tsx", "**/app/**/layout.tsx", "**/app/**/*.tsx"],
      "rules": { "import/no-default-export": "off" } },
    { "files": ["**/storage-adapter.ts"],
      "rules": { "no-restricted-imports": "off" } }
  ]
}
```

**MMKV restriction dans packages/shared/ :**

```json
{
  "overrides": [{
    "files": ["packages/shared/**/*.ts"],
    "rules": {
      "no-restricted-imports": ["error", {
        "patterns": [{ "group": ["react-native-mmkv"], "message": "Utiliser createStorageAdapter()" }]
      }]
    }
  }]
}
```

**Scripts CI :**

- `check-edge-function-size.sh` — échoue si un index.ts Edge Function > 40 lignes
- `check-schema-sync.ts` — vérifie DB ↔ Zod (Phase 2, quand première désynchronisation se manifeste)

### Anti-Patterns

```typescript
// ❌ Import Supabase direct dans app
import { createClient } from '@supabase/supabase-js'

// ❌ useState pour données serveur
const [annonces, setAnnonces] = useState([])

// ❌ Transformation camelCase
const dateDebut = row.date_debut    // renommage inutile

// ❌ export default (sauf fichiers route)
export default function AnnonceCard() {}

// ❌ Fichier PascalCase
AnnonceCard.tsx

// ❌ Données serveur dans Zustand
useAuthStore.setState({ annonces: data })

// ❌ Enum TypeScript
enum TypeAnnonce { Remplacement = 'remplacement' }

// ❌ Query key littérale
useQuery({ queryKey: ['annonces', id] })

// ❌ Barrel import
import { useAnnonces } from '@jim/shared'

// ❌ MMKV direct dans un store
import { MMKV } from 'react-native-mmkv'

// ❌ Logique métier dans Edge Function index.ts (> 40 lignes)

// ❌ String literal pour error code ou notification type
{ code: 'ANNONCE_NOT_FOUND' }  // → import ERROR_CODES
```

---

## Project Structure & Boundaries

> *Enrichi par : Reverse Engineering (8 fixes structurels), Failure Mode Analysis (13 préventions), Comparative Analysis Matrix (4 enrichissements).*

### Requirements → Architecture Mapping

#### FR Categories → Modules

| Aire de capacité | FRs | Module mobile | Module serveur | Shared |
|---|---|---|---|---|
| Gestion Utilisateurs & Identité | FR1-10, FR60, FR63 | `app/(auth)/`, `app/(tabs)/profil/` | `functions/verify-rpps/`, `functions/manage-profile/` | `hooks/use-profile.ts`, `validators/profile.schema.ts`, `stores/auth.store.ts` |
| Annonces & Publication | FR11-20, FR59, FR61 | `app/(tabs)/index.tsx`, `app/annonces/` | `functions/create-annonce/`, `functions/aggregate-annonces/` | `hooks/use-annonces.ts`, `validators/annonce.schema.ts` |
| Recherche & Découverte | FR21-26 | `app/(tabs)/recherche.tsx`, `components/recherche/` | PostGIS queries via Supabase direct | `hooks/use-search.ts` |
| Candidatures & Matching | FR27-34, FR62, FR64-65 | `app/candidatures/`, `components/candidatures/` | `functions/create-candidature/`, `functions/process-candidature/` | `hooks/use-candidatures.ts`, `validators/candidature.schema.ts` |
| Communication | FR35-38 | `app/(tabs)/messages.tsx`, `components/chat/` | Supabase Realtime direct | `hooks/use-messages.ts` |
| Contrats & Documents | FR39-42 | `app/contrats/`, `components/contrats/` | `functions/generate-contrat/` | `validators/contrat.schema.ts` |
| Notifications & Engagement | FR43-50, FR57-58, FR66 | `components/notifications/`, `components/calendrier/` | `functions/dispatch-notifications/`, pg_cron | `hooks/use-notifications.ts`, `stores/ui.store.ts` |
| Administration & Opérations | FR51-56, FR67-70 | — (web admin Phase 2) | `functions/aggregate-annonces/`, `functions/moderate/` | `constants/` |

#### Cross-Cutting Concerns → Locations

| Concern | Packages/shared | Supabase | Apps |
|---|---|---|---|
| Auth & autorisation | `api-client/`, `stores/auth.store.ts` | RLS policies, `functions/verify-rpps/` | `_layout.tsx` guards |
| Temps réel | `hooks/` (subscriptions dans les hooks) | Realtime Postgres Changes | — |
| Offline-first | `stores/offline.store.ts`, `adapters/offline-store/` | — | `_layout.tsx` (sync manager) |
| Agrégation | — | `functions/aggregate-annonces/`, `functions/_shared/aggregation/` | — |
| RGPD | — | `functions/export-data/`, `functions/delete-account/` | Paramètres profil |
| Sécurité | `constants/error-codes.ts` | Rate limiting Edge Functions, RLS | ESLint rules |
| Multi-plateforme | `ui/`, `tokens/`, `hooks/`, `stores/` | — | Platform-specific components |
| Multi-professions | `constants/` (professions config) | Table `professions`, JSONB config | — |
| Portabilité hexagonale | `adapters/` | `functions/_shared/` services | — |
| Notifications | `constants/notification-types.ts` | `functions/dispatch-notifications/`, `notification_queue` table | Push handler |
| Génération docs | — | `functions/generate-contrat/`, `functions/_shared/contrat.service.ts` | Rendu React Native + @react-pdf |
| Abstraction dépendances | `adapters/` | `functions/_shared/` | — |

### Complete Project Directory Structure

```
jim-app/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                          # PR: lint → typecheck → test → preview Vercel
│       ├── build-mobile.yml                # Merge main: EAS Build (dev)
│       └── release.yml                     # Release: EAS Build (prod) + Vercel prod
│
├── apps/
│   ├── mobile/                             # @jim/mobile — Expo SDK 54
│   │   ├── app/                            # Expo Router (file-based routing)
│   │   │   ├── _layout.tsx                 # Root: providers + splash screen hydration gate
│   │   │   ├── +not-found.tsx
│   │   │   ├── (auth)/                     # Groupe auth (non-authentifié)
│   │   │   │   ├── _layout.tsx             # Layout auth (redirect si connecté)
│   │   │   │   ├── login.tsx               # Email/pwd + magic link
│   │   │   │   ├── register.tsx            # Inscription + choix rôle
│   │   │   │   └── rpps-verification.tsx   # Vérification RPPS post-OAuth
│   │   │   ├── (tabs)/                     # Tab navigator (authentifié)
│   │   │   │   ├── _layout.tsx             # Tab bar (4 onglets)
│   │   │   │   ├── index.tsx               # Accueil — liste annonces (FlashList)
│   │   │   │   ├── recherche.tsx           # Carte interactive (react-native-maps)
│   │   │   │   ├── messages.tsx            # Liste conversations
│   │   │   │   └── profil.tsx              # Profil + paramètres
│   │   │   ├── annonces/
│   │   │   │   ├── [id].tsx                # Détail annonce
│   │   │   │   └── nouveau/
│   │   │   │       ├── _layout.tsx         # Layout multi-step
│   │   │   │       ├── step1.tsx           # Type + dates
│   │   │   │       ├── step2.tsx           # Localisation + cabinet
│   │   │   │       ├── step3.tsx           # Rétrocession + conditions
│   │   │   │       ├── step4.tsx           # Description
│   │   │   │       └── step5.tsx           # Récapitulatif + publication
│   │   │   ├── candidatures/
│   │   │   │   ├── [id].tsx               # Détail candidature
│   │   │   │   └── index.tsx              # Mes candidatures (remplaçant) / Reçues (titulaire)
│   │   │   ├── contrats/
│   │   │   │   └── [id].tsx               # Résumé contrat + téléchargement PDF
│   │   │   ├── conversations/
│   │   │   │   └── [id].tsx               # Chat conversation
│   │   │   ├── calendrier/
│   │   │   │   └── index.tsx              # Calendrier disponibilités
│   │   │   └── parametres/
│   │   │       ├── index.tsx              # Menu paramètres
│   │   │       ├── notifications.tsx      # Préférences notifications
│   │   │       ├── rgpd.tsx               # Export données, suppression compte
│   │   │       └── parrainage.tsx         # Code parrainage
│   │   │
│   │   ├── assets/                         # Assets obligatoires stores (RE-Fix #1)
│   │   │   ├── icon.png                   # 1024×1024 (App Store + Play Store)
│   │   │   ├── splash.png                 # Splash screen
│   │   │   ├── adaptive-icon.png          # Android adaptive icon
│   │   │   └── favicon.png                # Web favicon (Expo web)
│   │   │
│   │   ├── components/                     # Composants spécifiques mobile
│   │   │   ├── recherche/
│   │   │   │   ├── map-view.tsx           # react-native-maps (app-specific)
│   │   │   │   ├── map-marker.tsx
│   │   │   │   └── filter-sheet.tsx       # Bottom sheet filtres
│   │   │   ├── annonces/
│   │   │   │   ├── annonce-list-item.tsx
│   │   │   │   └── source-badge.tsx       # Badge natif/agrégé
│   │   │   ├── candidatures/
│   │   │   │   └── candidature-action-sheet.tsx
│   │   │   ├── chat/
│   │   │   │   ├── message-bubble.tsx
│   │   │   │   └── chat-input.tsx
│   │   │   ├── contrats/
│   │   │   │   └── contrat-summary.tsx    # Résumé 5 points in-app
│   │   │   └── common/
│   │   │       ├── offline-banner.tsx     # Indicateur offline
│   │   │       └── rpps-badge.tsx         # Badge vérifié RPPS
│   │   │
│   │   ├── app.json                        # Expo config (nom, slug, version, splash, icons, permissions)
│   │   ├── eas.json                        # EAS Build config (profils dev/preview/production + pnpm)
│   │   ├── metro.config.js                 # watchFolders pour monorepo (config complète ci-dessous)
│   │   ├── tailwind.config.js              # preset: root config
│   │   ├── babel.config.js                 # NativeWind + Reanimated
│   │   ├── tsconfig.json                   # paths @jim/* + references packages
│   │   ├── sentry.config.ts
│   │   ├── .env.local.example              # EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY (RE-Fix #8)
│   │   └── package.json
│   │
│   └── web/                                # @jim/web — Next.js 16.1
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx              # Root layout
│       │   │   ├── page.tsx                # Landing page
│       │   │   ├── globals.css             # Tailwind imports
│       │   │   ├── (marketing)/            # Pages SEO
│       │   │   │   ├── fonctionnalites/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── tarifs/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── a-propos/
│       │   │   │       └── page.tsx
│       │   │   ├── annonces/               # SSR annonces (Phase 3)
│       │   │   │   ├── page.tsx
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx
│       │   │   └── api/                    # API routes (brownfield + nouvelles)
│       │   │       ├── rpps/
│       │   │       │   ├── lookup/
│       │   │       │   │   └── route.ts
│       │   │       │   └── verify/
│       │   │       │       └── route.ts
│       │   │       ├── account/
│       │   │       │   ├── export/
│       │   │       │   │   └── route.ts
│       │   │       │   └── delete/
│       │   │       │       └── route.ts
│       │   │       ├── contact/
│       │   │       │   └── route.ts
│       │   │       └── stripe/             # Phase 3
│       │   │           └── webhook/
│       │   │               └── route.ts
│       │   ├── components/                 # Composants spécifiques web (Tailwind CSS classique)
│       │   │   ├── home/
│       │   │   │   ├── hero-section.tsx
│       │   │   │   ├── features-section.tsx
│       │   │   │   └── cta-section.tsx
│       │   │   └── layout/
│       │   │       ├── header.tsx
│       │   │       └── footer.tsx
│       │   └── middleware.ts               # Auth guard (brownfield)
│       │
│       ├── public/
│       │   ├── images/
│       │   ├── fonts/
│       │   └── og/                         # Open Graph images
│       ├── next.config.js                  # transpilePackages: ['@jim/shared', '@jim/ui'] (RE-Fix #4)
│       ├── vercel.json                     # installCommand monorepo pnpm (RE-Fix #3)
│       ├── tailwind.config.js              # preset: root config
│       ├── sentry.client.config.ts
│       ├── sentry.server.config.ts
│       ├── tsconfig.json                   # paths @jim/* + references packages
│       ├── .env.local.example              # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SENTRY_DSN (RE-Fix #8)
│       └── package.json
│
├── packages/
│   ├── shared/                             # @jim/shared — Hiérarchie stricte (FM-Fix 1.1)
│   │   ├── adapters/
│   │   │   ├── supabase/
│   │   │   │   ├── supabase.interface.ts   # Port: DatabaseAdapter
│   │   │   │   └── supabase.adapter.ts     # Implémentation Supabase
│   │   │   ├── offline-store/
│   │   │   │   ├── offline-store.interface.ts  # Port: OfflineStore
│   │   │   │   └── mmkv.adapter.ts         # Implémentation MMKV
│   │   │   ├── notifications/
│   │   │   │   ├── notification.interface.ts   # Port: NotificationService
│   │   │   │   └── fcm.adapter.ts          # Implémentation FCM
│   │   │   └── secure-store/
│   │   │       ├── secure-store.interface.ts
│   │   │       └── expo-secure-store.adapter.ts
│   │   │
│   │   ├── hooks/                          # TanStack Query hooks (client-side only) — SOMMET de la chaîne
│   │   │   ├── query-keys.ts              # Factory centralisé (FM-Fix 1.3 : checklist header)
│   │   │   ├── use-annonces.ts
│   │   │   ├── use-candidatures.ts
│   │   │   ├── use-messages.ts
│   │   │   ├── use-notifications.ts
│   │   │   ├── use-profile.ts
│   │   │   └── use-search.ts
│   │   │
│   │   ├── stores/                         # Zustand (client state only)
│   │   │   ├── auth.store.ts              # Session, rôle actif, RPPS status, pendingDeepLink (FM-Fix 4.2)
│   │   │   ├── ui.store.ts               # Dark mode, filtres, vue liste/carte, draftAnnonce (FM-Fix 4.3)
│   │   │   ├── offline.store.ts           # Queue actions, SyncStatus
│   │   │   └── storage-adapter.ts         # 3 cas : server/mobile/web (FM-Fix 1.2)
│   │   │
│   │   ├── validators/                     # Schémas Zod (maître + .pick())
│   │   │   ├── annonce.schema.ts
│   │   │   ├── profile.schema.ts
│   │   │   ├── candidature.schema.ts
│   │   │   ├── contrat.schema.ts
│   │   │   └── message.schema.ts
│   │   │
│   │   ├── types/
│   │   │   └── database.ts               # Généré par supabase gen types (jamais édité)
│   │   │
│   │   ├── api-client/
│   │   │   ├── client.ts                  # createClient() — browser + mobile
│   │   │   └── server.ts                  # createServerClient() — RSC Next.js
│   │   │
│   │   ├── constants/
│   │   │   ├── error-codes.ts             # Registre ErrorCode
│   │   │   ├── notification-types.ts      # Registre NotificationType
│   │   │   ├── professions.ts             # Config professions
│   │   │   └── index.ts                   # Enums partagés (roles, statuts, etc.)
│   │   │
│   │   ├── tokens/
│   │   │   └── index.ts                   # Généré par extract-tokens.js
│   │   │
│   │   ├── utils/
│   │   │   ├── parse-error.ts             # parseApiError() — transition format erreurs
│   │   │   ├── date-utils.ts
│   │   │   └── format-price.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ui/                                 # @jim/ui — composants mobile only au MVP (FM-Fix 2.1)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── toast.tsx                       # Wrapper sonner cross-platform
│       ├── skeleton.tsx
│       ├── spinner.tsx
│       ├── empty-state.tsx
│       ├── avatar.tsx
│       ├── status-badge.tsx               # Statut annonce (Active/Pourvue/Expirée)
│       ├── index.ts                       # Seul barrel export autorisé (seuil 20 composants → imports directs, FM-Fix 2.2)
│       ├── tsconfig.json
│       └── package.json
│
├── supabase/
│   ├── config.toml                         # Supabase local config
│   ├── seed.sql                            # Données de test
│   ├── migrations/
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_remplacements.sql
│   │   ├── ...                            # Migrations brownfield existantes
│   │   ├── 006_update_annonces.sql
│   │   ├── 007_add_notification_queue.sql
│   │   ├── 008_add_professions.sql
│   │   ├── 009_add_candidatures.sql
│   │   ├── 010_add_contrats.sql
│   │   ├── 011_add_conversations_messages.sql
│   │   ├── 012_add_calendrier.sql
│   │   ├── 013_add_favoris_parrainages.sql
│   │   └── 014_rls_policies.sql
│   │
│   └── functions/                          # Edge Functions (Deno)
│       ├── create-annonce/
│       │   └── index.ts                   # ≤ 40 lignes
│       ├── create-candidature/
│       │   └── index.ts
│       ├── process-candidature/
│       │   └── index.ts                   # Accepter/refuser + cascade
│       ├── generate-contrat/
│       │   └── index.ts
│       ├── verify-rpps/
│       │   └── index.ts
│       ├── aggregate-annonces/
│       │   └── index.ts                   # Orchestrateur agrégation
│       ├── dispatch-notifications/
│       │   └── index.ts                   # Dispatcher multi-canal
│       ├── export-data/
│       │   └── index.ts                   # RGPD export JSON/PDF
│       ├── delete-account/
│       │   └── index.ts                   # RGPD suppression + anonymisation
│       └── _shared/                       # Modules métier portables (Deno-compatible)
│           ├── annonce.service.ts
│           ├── candidature.service.ts
│           ├── contrat.service.ts
│           ├── notification.service.ts
│           ├── rpps.service.ts
│           ├── aggregation/
│           │   ├── aggregation-source.interface.ts  # Interface AggregationSource
│           │   ├── orchestrator.ts
│           │   ├── sources/
│           │   │   ├── rempleo.source.ts
│           │   │   └── facebook.source.ts
│           │   └── deduplicator.ts
│           ├── contrat/
│           │   ├── template.ts            # Template contrat JSONB
│           │   └── renderer.ts            # Clauses → structure
│           ├── interfaces/                # DTOs d'interface, PAS miroir DB (FM-Fix 3.2)
│           │   └── index.ts              # CreateCandidatureInput, CreateCandidatureResult, etc.
│           └── constants/
│               ├── error-codes.ts         # Sync avec @jim/shared/constants/
│               └── notification-types.ts
│
├── scripts/
│   ├── check-edge-function-size.sh        # CI: Edge Function ≤ 40 lignes
│   ├── extract-tokens.js                  # Build: tailwind → packages/shared/tokens/
│   └── sync-constants.sh                  # Vérifie sync _shared ↔ @jim/shared constants
│
├── .eslintrc.json                          # Config ESLint monorepo (error mode)
├── .prettierrc                             # Prettier config
├── .env.example                            # Variables requises documentées (global)
├── .gitignore
├── tailwind.config.js                      # Source unique tokens design
├── tsconfig.base.json                      # Config TS partagée
├── pnpm-workspace.yaml                     # packages: ['apps/*', 'packages/*']
├── .npmrc                                  # shamefully-hoist=true
├── package.json                            # Scripts monorepo root (détail ci-dessous)
└── vitest.config.ts                        # Config Vitest workspaces
```

### Key Configuration Details

#### Root `package.json` (RE-Fix #7 + FM-Fix 5.1 + CA-Fix #1-2)

```json
{
  "name": "jim-app",
  "private": true,
  "packageManager": "pnpm@9.x.x",
  "scripts": {
    "dev:mobile": "pnpm --filter @jim/mobile start",
    "dev:web": "pnpm --filter @jim/web dev",
    "dev:supabase": "supabase start",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "test": "vitest",
    "build": "pnpm -r build",
    "gen:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > packages/shared/types/database.ts",
    "gen:tokens": "node scripts/extract-tokens.js",
    "check:edge-size": "bash scripts/check-edge-function-size.sh",
    "check:constants": "bash scripts/sync-constants.sh",
    "add:shared": "pnpm --filter @jim/shared add",
    "add:mobile": "pnpm --filter @jim/mobile add",
    "add:web": "pnpm --filter @jim/web add",
    "add:ui": "pnpm --filter @jim/ui add"
  },
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-native": "$react-native"
    }
  }
}
```

> **Turborepo threshold** : ajouté quand le build monorepo dépasse 2 minutes. Au MVP avec 4 workspaces, le build est < 30s — le cache n'apporte rien. Les scripts par package (`build`, `lint`, `typecheck`) sont uniformes et Turborepo-ready.

#### EAS Build Config — `apps/mobile/eas.json` (RE-Fix #2)

```json
{
  "cli": { "appVersionSource": "remote" },
  "build": {
    "base": {
      "node": "20.x.x",
      "pnpm": "9.x.x"
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

#### Vercel Config — `apps/web/vercel.json` (RE-Fix #3)

```json
{
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

#### Next.js Config — `apps/web/next.config.js` (RE-Fix #4)

```javascript
const nextConfig = {
  transpilePackages: ['@jim/shared', '@jim/ui'],
}
module.exports = nextConfig
```

#### Metro Config — `apps/mobile/metro.config.js` (FM-Fix 5.3)

```javascript
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

module.exports = config
```

#### TypeScript Config — `apps/mobile/tsconfig.json` (FM-Fix 5.2)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@jim/shared/*": ["../../packages/shared/*"],
      "@jim/ui/*": ["../../packages/ui/*"],
      "@jim/ui": ["../../packages/ui/index.ts"]
    }
  },
  "references": [
    { "path": "../../packages/shared" },
    { "path": "../../packages/ui" }
  ]
}
```

> **OTA vs Build natif** (RE-Fix #5) : OTA = JS uniquement. Tout changement dans `app.json` plugins, ajout de module natif, ou bump de version native → nécessite un EAS Build, pas un OTA update.

### Architectural Boundaries

#### API Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  @jim/mobile  │              │   @jim/web    │            │
│  │  Expo Router  │              │  Next.js App  │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                              │                     │
│  ┌──────┴──────────────────────────────┴───────┐           │
│  │              @jim/shared                      │           │
│  │  hooks/ ─── TanStack Query ──→ createClient() │           │
│  │  stores/ ── Zustand ──→ storageAdapter        │           │
│  │  validators/ ── Zod schemas                    │           │
│  └──────┬──────────────────────────────┬───────┘           │
│         │ Lectures directes            │ Écritures métier   │
│         │ (RLS + Realtime)             │ (invoke)           │
└─────────┼──────────────────────────────┼───────────────────┘
          │                              │
┌─────────┼──────────────────────────────┼───────────────────┐
│         ▼          SUPABASE LAYER      ▼                   │
│  ┌──────────────┐              ┌──────────────┐           │
│  │   PostgreSQL  │              │Edge Functions │           │
│  │   + PostGIS   │              │  index.ts     │           │
│  │   + RLS       │              │  (≤ 40 lines) │           │
│  │   + Realtime  │              └──────┬───────┘           │
│  └──────────────┘                      │                    │
│                                ┌───────┴───────┐           │
│                                │   _shared/     │           │
│                                │  *.service.ts  │← Portables│
│                                │  (logique      │  vers     │
│                                │   métier)      │  NestJS   │
│                                └───────────────┘           │
└─────────────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  API Annuaire Santé │ FCM/APNs │ Stripe Connect │ Sources  │
│  (RPPS FHIR)        │ (push)   │ (Phase 3)      │ agrég.   │
└─────────────────────────────────────────────────────────────┘
```

#### Component Boundaries

| Frontière | Règle | Communication |
|---|---|---|
| `@jim/mobile` ↔ `@jim/shared` | Import `@jim/shared/hooks/`, `@jim/shared/stores/`, `@jim/ui` | Imports directs (pas de barrel) |
| `@jim/web` ↔ `@jim/shared` | Import `@jim/shared/api-client/server.ts` pour RSC, hooks pour client | `createServerClient()` en RSC |
| `@jim/shared/hooks/` ↔ Supabase | Via `createClient()` uniquement | Lectures `.from().select()`, mutations `.functions.invoke()` |
| `@jim/shared/stores/` ↔ stockage | Via `createStorageAdapter()` | MMKV (mobile) / localStorage (web) / noop (server) |
| Edge Functions ↔ `_shared/` | Import des services, jamais de logique dans index.ts | `import { createCandidature } from '../_shared/...'` |
| `_shared/` services ↔ DB | Reçoivent le client Supabase admin en paramètre (injection) | `service(payload, supabaseAdmin)` |
| Apps ↔ `@supabase/supabase-js` | **Interdit** (ESLint). Passer par `@jim/shared/api-client/` | — |
| `@jim/ui` ↔ `@jim/web` | **Pas d'import au MVP**. `@jim/ui` = mobile only | Phase 3 : tokens partagés + composants web séparés |

#### Data Boundaries

| Couche | Données | Accès |
|---|---|---|
| **PostgreSQL (Supabase)** | Tables, RLS, triggers, pg_cron | Lectures client direct (RLS), écritures via Edge Functions |
| **MMKV (mobile)** | Cache annonces, préférences UI, offline queue, drafts formulaires | Via `createStorageAdapter()` dans Zustand persist |
| **expo-secure-store (mobile)** | Tokens auth Supabase (via MMKV adapter injecté dans SDK) | SDK Supabase Auth automatique |
| **TanStack Query cache** | Données serveur en mémoire (stale-while-revalidate) | `queryClient`, invalidation sur mutation + Realtime |
| **localStorage (web)** | Zustand persist web | Via `createStorageAdapter()` |

### Dependency Hierarchy — `packages/shared/` (FM-Fix 1.1)

Sens unique du bas vers le haut. Les imports dans le sens inverse sont **interdits**.

```
constants/  ← ne dépend de rien
    ↑
types/      ← dépend de constants/
    ↑
validators/ ← dépend de types/, constants/
    ↑
utils/      ← dépend de types/, constants/
    ↑
api-client/ ← dépend de types/
    ↑
stores/     ← dépend de constants/, types/, api-client/
    ↑
hooks/      ← dépend de tout le reste (sommet de la chaîne)
```

**Règle absolue :** Les hooks peuvent importer les stores. Les stores ne peuvent **jamais** importer les hooks. Les utils ne peuvent pas importer les stores ni les hooks.

### Storage Adapter — 3 cas (FM-Fix 1.2)

```typescript
export function createStorageAdapter(): StateStorage {
  // 1. Server-side (SSR) — no storage
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
  }
  // 2. React Native — MMKV
  if (Platform.OS !== 'web') {
    const { MMKV } = require('react-native-mmkv')
    const mmkv = new MMKV({ id: 'zustand' })
    return { /* mmkv adapter */ }
  }
  // 3. Web browser — localStorage
  return { /* localStorage adapter */ }
}
```

Utiliser `Platform.OS` (de `react-native`) au lieu de `navigator.product` — plus fiable en monorepo.

### Splash Screen + Auth Hydration Gate (FM-Fix 4.1)

```typescript
// apps/mobile/app/_layout.tsx
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { isHydrated } = useAuthStore()

  useEffect(() => {
    if (isHydrated) SplashScreen.hideAsync()
  }, [isHydrated])

  if (!isHydrated) return null  // Splash screen native visible

  return <Stack />
}
```

Le `_layout.tsx` root **bloque le rendu** jusqu'à hydratation auth via `expo-splash-screen`. Élimine le flash login→tabs.

### Mobile-Specific Patterns

**Deep link pending** (FM-Fix 4.2) — `auth.store.ts` contient `pendingDeepLink: string | null`. Après login, vérifier et naviguer si présent.

**Draft formulaire multi-step** (FM-Fix 4.3) — `ui.store.ts` contient `draftAnnonce: Partial<AnnonceFormData> | null`, persisté MMKV. Le brouillon survit même à un kill de l'app.

### Edge Functions `_shared/` — Règles Deno (RE-Fix #6 + FM-Fix 3.1)

Les services `_shared/` sont **autonomes** (Deno-compatible) :

- **Web APIs uniquement** : `fetch`, `crypto.subtle`, `URL`, `Response`
- **Pas de `node:` imports**, pas de `require()`
- **N'importent jamais** depuis `@jim/shared` (pas de résolution pnpm dans Deno)
- Types dans `_shared/interfaces/` = DTOs d'interface de service, **pas** un miroir de `database.ts`
- Tester avec `supabase functions serve` avant deploy

### Phase 3 UI Strategy (CA-Fix #3)

Au MVP, `@jim/ui` = mobile only. `apps/web/` utilise Tailwind CSS classique.

**Stratégie Phase 3 :** Tokens design partagés (`@jim/shared/tokens/` — couleurs, spacing, typography) + composants web séparés. Les composants sont dupliqués (mobile vs web) mais visuellement identiques grâce aux tokens partagés. C'est le pattern le plus pragmatique pour un dev solo.

### Data Flow — Candidature (exemple complet)

```
1. Utilisateur tap "Candidater" (mobile)
   └→ Optimistic update: TanStack Query cache → UI "Envoyée"

2. Hook useCreateCandidature() → mutation
   └→ supabase.functions.invoke('create-candidature', { body })

3. Edge Function create-candidature/index.ts (≤ 40 lignes)
   └→ import { createCandidature } from '_shared/candidature.service.ts'
   └→ createCandidature(body, supabaseAdmin)

4. candidature.service.ts (portable)
   └→ Zod validation (candidature.schema.ts)
   └→ INSERT candidatures
   └→ INSERT notification_queue (type: CANDIDATURE_RECUE)
   └→ Return result

5. Postgres trigger → notification_queue
   └→ dispatch-notifications Edge Function
   └→ Push FCM (payload générique) + email fallback

6. Supabase Realtime → Postgres Changes (candidatures table)
   └→ Hook titulaire: queryClient.invalidateQueries(queryKeys.candidatures)
   └→ UI titulaire mise à jour en temps réel
```

### Integration Points — External Services

| Service | Interface | Adapter | Fallback |
|---|---|---|---|
| API Annuaire Santé (FHIR) | `rpps.service.ts` | Fetch HTTPS + cache 6 mois | Cache local, mode dégradé (NFR40) |
| Firebase FCM / APNs | `notification.interface.ts` | `fcm.adapter.ts` | Email via fallback |
| Stripe Connect (Phase 3) | Future `payment.interface.ts` | Future `stripe.adapter.ts` | — |
| Sources agrégation | `aggregation-source.interface.ts` | `rempleo.source.ts`, `facebook.source.ts` | Cache agrégation en fallback (NFR42) |
| Scaleway HDS (Phase 3) | `supabase.interface.ts` | Future `scaleway.adapter.ts` | — |
| api-adresse.data.gouv.fr | Appel direct (composant address-autocomplete) | — | Input texte libre |

### Development Workflow

| Action | Commande | Effet |
|---|---|---|
| Dev mobile | `pnpm dev:mobile` | Expo dev server + hot reload |
| Dev web | `pnpm dev:web` | Next.js Turbopack dev server |
| Dev Supabase local | `pnpm dev:supabase` | PostgreSQL + Edge Functions local |
| Gen types | `pnpm gen:types` | Types DB à jour |
| Gen tokens | `pnpm gen:tokens` | Design tokens → packages/shared/tokens/ |
| Lint | `pnpm lint` | ESLint monorepo (error mode) |
| Typecheck | `pnpm typecheck` | TypeScript strict sur tous les packages |
| Test | `pnpm test` | Vitest workspaces |
| Build mobile | `eas build --platform all --profile dev` | Dev build via EAS |
| Build web | `pnpm --filter @jim/web build` | Next.js production build |
| Deploy web | Push main → Vercel auto-deploy | Preview sur PR, prod sur main |
| OTA update | `eas update --branch production` | Patch JS sans build natif |
| Add dep shared | `pnpm add:shared <pkg>` | Install dans @jim/shared |
| Check edge size | `pnpm check:edge-size` | Vérifie ≤ 40 lignes par Edge Function |
| Check sync | `pnpm check:constants` | Vérifie sync _shared ↔ @jim/shared |

### Enrichments Applied Summary

| Source | Fixes | Key additions |
|---|---|---|
| Reverse Engineering | 8 | assets/, eas.json, vercel.json, transpilePackages, OTA criteria, _shared Deno autonomy, root scripts, .env.local.example |
| Failure Mode Analysis | 13 | Dependency hierarchy, storage adapter 3 cases, @jim/ui mobile-only, barrel threshold, Deno rules, _shared interfaces, splash screen gate, pendingDeepLink, draft formulaire, pnpm scripts, tsconfig paths, metro.config.js |
| Comparative Analysis | 4 | pnpm.overrides, uniform scripts (Turborepo-ready), Phase 3 UI strategy, Turborepo threshold |

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
15 décisions (D1-D15) croisées systématiquement — 0 contradiction détectée. Les versions verrouillées sont mutuellement compatibles : Expo SDK 54 ↔ NativeWind v4.2 ↔ Tailwind 3.4.17 ↔ Reanimated 3.x, Next.js 16.1 ↔ Vercel ↔ Sentry, Zod 4.3 ↔ RHF 7.x ↔ @hookform/resolvers, MMKV 3.x ↔ Zustand 5.0 persist ↔ expo-secure-store, TanStack Query 5.90 ↔ Supabase client 2.98 ↔ FlashList 1.x. pnpm workspace ↔ EAS Build ↔ Metro ↔ Vercel tous documentés avec configs explicites.

**Pattern Consistency:**
Naming (DB snake → API snake → code camelCase → fichiers kebab → exports PascalCase) vérifié cohérent à chaque frontière. Query Key Factory enforced par ESLint. Edge Function ≤ 40 lignes enforced par CI. Zod master + .pick() élimine la duplication. Import rules + 2 overrides légitimes sans contradiction.

**Structure Alignment:**
La hiérarchie de dépendance `packages/shared/` (constants→types→validators→utils→api-client→stores→hooks) supporte toutes les décisions sans cycle. Les services `_shared/` (Deno) sont autonomes, alignés avec la portabilité hexagonale. Les configs (eas.json, vercel.json, metro.config.js, tsconfig.json) documentées dans la structure supportent le monorepo pnpm workspace.

### Requirements Coverage ✅

**Functional Requirements : 70/70 couverts**

| Aire | FRs | Couverture |
|---|---|---|
| Gestion Utilisateurs & Identité | FR1-10, FR60, FR63 (12) | ✅ auth.store, use-profile, verify-rpps, RLS, professions |
| Annonces & Publication | FR11-20, FR59, FR61 (12) | ✅ use-annonces, create-annonce, aggregate-annonces, Realtime |
| Recherche & Découverte | FR21-26 (6) | ✅ use-search, react-native-maps, PostGIS, MMKV cache |
| Candidatures & Matching | FR27-34, FR62, FR64-65 (10) | ✅ use-candidatures, create/process-candidature, offline queue |
| Communication | FR35-38 (4) | ✅ use-messages, Realtime, masquage conditionnel |
| Contrats & Documents | FR39-42 (4) | ✅ generate-contrat, contrat.schema, JSONB + double rendu |
| Notifications & Engagement | FR43-50, FR57-58, FR66 (14) | ✅ dispatch-notifications, pg_cron, use-calendrier, use-favoris, use-parrainages |
| Administration & Opérations | FR51-56, FR67-70 (8) | ✅ aggregate-annonces, moderate, rate limiting, logs audit |

**Non-Functional Requirements : 45/45 couverts**

| Catégorie | NFRs | Support architectural |
|---|---|---|
| Performance (9) | NFR1-9 | FlashList, TQ cache, MMKV, expo-image, Edge Functions, Realtime < 2s |
| Sécurité (11) | NFR10-20 | TLS 1.3, AES-256 MMKV, JWT 15/7, expo-secure-store, RLS, rate limiting, sanitization Zod, push générique, logs audit 1 an |
| Scalabilité (5) | NFR21-25 | Hexagonal (5x), professions JSONB, adapter pattern agrégation, monitoring tiers, MMKV 1000+ |
| Fiabilité (7) | NFR26-32 | Sentry monitoring, RPO/RTO Supabase, offline queue + sync, cache fallback |
| Conformité (6) | NFR33-38 | EU hosting, export-data/, delete-account/, anonymisation, conservation, FCM générique |
| Intégration (4) | NFR39-42 | Retry exponentiel, cache RPPS 6 mois, agrégation 6h monitoring, détection HTML |
| Accessibilité (3) | NFR43-45 | NativeWind responsive, tokens contraste 4.5:1, zones tap 44×44 |

### Implementation Readiness ✅

**Decision Completeness:**
- 13 packages verrouillés dans la matrice de compatibilité
- 7 code examples complets (Query Key Factory, Storage Adapter, Realtime+TQ, Edge Function, Zod master+.pick(), Splash Screen, Error format)
- 11 anti-patterns documentés avec code ❌
- ESLint error mode + 2 scripts CI en Phase 0

**Structure Completeness:**
- ~150 fichiers/dossiers listés explicitement dans l'arbre
- ASCII diagram 3 couches (Client → Supabase → External)
- FR→Structure mapping pour 8 aires × 3 colonnes
- Data flow candidature en 6 étapes
- 14 commandes development workflow

**Pattern Completeness:**
- 5 catégories de naming avec règle dérivation snake/camel
- Hiérarchie de dépendance packages/shared/ en 7 niveaux
- 4 communication patterns avec code
- 5 process patterns avec code
- Phased adoption (Phase 0 → Phase 1 → Phase 2+)

### Gap Analysis

**Gaps critiques : 0** — Aucun gap bloquant l'implémentation.

**Gaps importants résolus (2) :**

1. **Query keys manquants** — `calendrier`, `favoris`, `parrainages` ajoutés au factory :

```typescript
// Ajout au queryKeys factory (packages/shared/hooks/query-keys.ts)
calendrier: {
  all: ['calendrier'] as const,
  mine: () => [...queryKeys.calendrier.all, 'mine'] as const,
},
favoris: {
  all: ['favoris'] as const,
  mine: () => [...queryKeys.favoris.all, 'mine'] as const,
},
parrainages: {
  all: ['parrainages'] as const,
  mine: () => [...queryKeys.parrainages.all, 'mine'] as const,
  code: (code: string) => [...queryKeys.parrainages.all, 'code', code] as const,
},
```

2. **Hooks manquants** — `use-calendrier.ts`, `use-favoris.ts`, `use-parrainages.ts` ajoutés à `packages/shared/hooks/`.

**Gaps nice-to-have (non bloquants) :**
- Guide migration brownfield step-by-step → couvert par Story 0 + init commands
- NFR7 (app < 50MB) → monitoring post-build, pas pré-validable architecturalement
- Dashboard monitoring Sentry → opérationnel, pas architectural

### Architecture Completeness Checklist

**✅ Requirements Analysis (Step 1)**

- [x] 70 FRs analysés en 8 aires architecturales
- [x] 45 NFRs analysés en 7 catégories
- [x] Scale & complexité évaluées (élevé — healthcare réglementé)
- [x] 13 cross-cutting concerns identifiés
- [x] 10 ADRs préliminaires documentés
- [x] Contraintes brownfield, ressources, réglementaires, Supabase tiers

**✅ Starter Template (Step 2)**

- [x] 3 options évaluées (t3-turbo, byCedric, custom)
- [x] Custom monorepo pnpm workspace sélectionné avec rationale
- [x] Commandes d'initialisation documentées
- [x] Matrice de compatibilité verrouillée (13 packages)
- [x] 8 mesures de résilience Chaos Monkey

**✅ Core Architectural Decisions (Steps 3-4)**

- [x] 15 décisions (D1-D15) avec versions, rationale, patterns
- [x] Séquence d'implémentation en 5 phases
- [x] Cross-component dependencies diagram
- [x] 3 décisions différées avec rationale du report

**✅ Implementation Patterns (Step 5)**

- [x] Naming patterns : DB, code TS, API, fichiers
- [x] Structure patterns : monorepo, cross-platform criteria, tests, imports
- [x] Format patterns : error format, registres, data formats
- [x] Communication patterns : Realtime+TQ, Query Keys, Zustand, Client
- [x] Process patterns : errors, loading, Edge Functions, Zod, offline
- [x] Enforcement : ESLint error mode + 2 scripts CI
- [x] Anti-patterns : 11 exemples ❌
- [x] Adoption par phases (Phase 0/1/2+)

**✅ Project Structure (Step 6)**

- [x] FR→Structure mapping complet (8 aires × 3 colonnes)
- [x] Cross-cutting concerns → locations (12 concerns)
- [x] Arbre complet (~150 fichiers/dossiers)
- [x] Architectural boundaries ASCII diagram
- [x] Component, data boundaries tables
- [x] Data flow exemple complet (candidature)
- [x] Integration points (6 services)
- [x] Development workflow (14 commandes)
- [x] Key configurations documentées (6 fichiers)

**✅ Validation (Step 7)**

- [x] Coherence : 0 contradiction
- [x] Coverage : 70/70 FRs, 45/45 NFRs
- [x] Readiness : exemples code, enforcement, anti-patterns
- [x] Gap analysis : 0 critique, 2 importants résolus

### Architecture Readiness Assessment

**Overall Status: READY FOR IMPLEMENTATION**

**Confidence Level: High**

**Key Strengths:**
1. **Portabilité hexagonale** — unique parmi les starters/références comparés. Migration HDS sans réécriture métier
2. **Enforcement IA-ready** — ESLint error mode + scripts CI guident les agents sans lecture préalable de architecture.md
3. **Validation exhaustive** — 7 steps, 10 rounds d'élicitation (Red Team, Self-Consistency, Chaos Monkey, War Room, Reverse Engineering, Failure Mode, Comparative Analysis), 25+ enrichissements appliqués
4. **Couverture réglementaire** — RGPD, RPPS, Ordre MK, HDS plan intégrés dans chaque décision
5. **Phased adoption** — pas de big-bang, patterns ajoutés quand rencontrés

**Areas for Future Enhancement:**
- Turborepo quand build > 2 min (~5+ packages)
- check-schema-sync.ts automatisé (Phase 2, quand première désync Zod↔DB)
- E2E testing (Maestro mobile, Playwright web) post-MVP
- Analytics produit (PostHog/Mixpanel) post-product-market fit
- Phase 3 UI strategy (tokens partagés + composants web séparés)

### Implementation Handoff

**AI Agent Guidelines:**

1. **Lire ce document en entier** avant la première story d'implémentation
2. **Suivre les patterns exactement** — les ESLint rules en error mode bloquent les écarts
3. **Respecter la hiérarchie de dépendance** `packages/shared/` — constants → types → validators → utils → api-client → stores → hooks
4. **Utiliser le Query Key Factory** — jamais de littéraux `['string']`
5. **Edge Functions ≤ 40 lignes** — logique métier dans `_shared/*.service.ts`
6. **Tester les Edge Functions** avec `supabase functions serve` avant deploy
7. **snake_case** pour tout ce qui vient de la DB, camelCase pour le reste

**First Implementation Priority:**
Story 0 — Setup Phase 0 (~2h) : init monorepo pnpm workspace, configurer ESLint error mode, créer registres vides (error-codes.ts, notification-types.ts), configurer EAS Build, vérifier CI pipeline. Acceptance criteria : CI passe, ESLint configuré, test de l'agent naïf réussi.
