# Historique des Sprints — JIM App V2

> Ce fichier contient l'historique complet des sprints, audits et bug fixes.
> Deplace depuis CLAUDE.md le 2026-04-17 pour reduire la taille du fichier de regles.
> Consulter ce fichier uniquement pour comprendre l'historique des decisions, pas pour les regles actives.

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

### Corrections appliquees

| Fichier | Correction |
|---------|-----------|
| `packages/shared/src/hooks/useAlerteSimilaire.ts` | `console.log` supprime (code de debug) |
| `packages/shared/src/hooks/useAvisProfile.ts` | `(a: any)` -> `(a: AvisRow)` (respect strict: true) |
| `packages/shared/src/hooks/useSwitchRole.ts` | `(c: any)` -> type structure explicite (respect strict: true) |
| `packages/shared/src/constants/index.ts` | Ajout export `blocked-domains.ts` (manquant) |
| `.env.local.example` | Ajout FCM_PROJECT_ID, FCM_ACCESS_TOKEN, SUPPORT_EMAIL |

### Problemes restants traites manuellement

#### Critique
1. Migrations non appliquees sur le distant — RESOLU (appliquees Sprint P4-Fix)
2. Profil admin a creer — RESOLU
3. Deep links a configurer — OUVERT

#### Non-critique
4. 21 `any` dans les Edge Functions Deno — Acceptable (SDK Deno sans types)
5. Test file mislabele — Ouvert
6. Bucket Storage rgpd-exports — OUVERT

---

## Audit Landing Page — 2026-04-04 (post Sprint P0)

### Score global : 66 / 82 fonctionnalites operationnelles (80%)

```
Avant Sprint P0     : 32/82 (39%)
Apres Sprint P0     : 49/82 (60%)  +17 fonctionnalites branchees
Apres Sprint P0-Fix : 60/82 (73%)  +11 corrections appliquees
Apres Sprint P1     : 66/82 (80%)  +6 fonctionnalites ajoutees
```

---

## Sprint Status — 13/13 Epics TERMINES

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

---

## Sprint P0 "Beta Bloquant" — 2026-04-04

FAIT : 14/19 taches (74%), PARTIEL : 3/19 (16%), ABSENT : 2/19 (10%)

Principales realisations : auth web (login/register/RPPS), recherche connectee, bouton postuler, pagination, header auth-aware.

---

## Sprint P0-Fix "Colmater les Breches" — 2026-04-04

FAIT : 16/16 taches (100%). Score landing : ~60/82 (73%).

Principales realisations : middleware.ts, validation redirect, rate limiting login, recherche dates, reset-password, categories nav, badge RPPS conditionnel, badge source.

---

## Sprint P1 "Premiere Impression" — 2026-04-06

FAIT : 6/6 taches (100%). Score landing : 66/82 (80%).

Principales realisations : filtres avances, tri, profil titulaire, annonces similaires, cleanup MOCK_LISTINGS.

---

## Sprint P2 "Redesign Kanban + Fixes" — 2026-04-06

FAIT : 14/14 taches (100%).

Passage Airbnb marketplace → Kanban Dashboard Conversationnel. Police Manrope, header flottant 3 lignes, topic pills, kanban 3 colonnes, sidebar preferences, footer glass morphism.

---

## Sprint P3 "Features Avancees" — 2026-04-06

FAIT : 18/18 taches (100%). Build : 22 pages.

Principales realisations : images reelles (photo_urls), mini-carte Mapbox, carte geographique complete (clustering, split view, geolocalisation), admin support + utilisateurs.

Migrations : 068 (photo_urls), 069 (annonce_coords RPC).

---

## Sprint P4 "Parcours Complet" — 2026-04-08

FAIT : 26/26 taches (100%). Build : 27 pages.

Dashboard utilisateur (overview, annonces, candidatures, contrats, paiements), formulaire publier multi-etapes, page detail contrat (double signature, PDF), paiements Stripe Connect (modal, onboarding, contestation).

---

## Sprint P4-Fix "BUG-1/2/3 + nettoyage" — 2026-04-10

3 bugs critiques resolus, 4 bugs mineurs fixes, 0 console errors.

- BUG-1 : photo_urls migration non appliquee → appliquee
- BUG-2 : FK annonces->profiles (auth.users vs profiles) → migration 070
- BUG-3 : useConversations 3 defauts FK + colonnes → migration 071

Migrations : 070, 071.

---

## Sprint P4-SecHardening "Supabase Security Advisor" — 2026-04-10

36/38 findings resolus (migration 072). 4 views → security_invoker, 31 functions → search_path hardened, 1 table → baseline policy.

Restants acceptes : spatial_ref_sys (faux positif PostGIS), postgis in public schema.

---

## Sprint P4-Parcours "Liaison candidature→contrat→chat→paiement" — 2026-04-11

5 fichiers modifies. CTAs ajoutees : "Generer contrat" (candidatures), "Creer versement" (contrat confirme), pills contexte dans chat, cartes contrats cliquables.

---

## Sprint P4-StripeFix "Webhook Deno async" — 2026-04-11

BUG CRITIQUE : constructEvent() synchrone incompatible Deno → constructEventAsync() + SubtleCryptoProvider. URL webhook corrigee, secret re-synchronise, endpoint recree.

Pattern de reference : voir `_shared/stripe/stripe.webhook-handler.ts`.

---

## Sprint P5 "Redesign Dashboard" — 2026-04-15

Refonte dashboard : sidebar beige + coral, hero cards KPI, timeline activite, mobile bottom nav flottante.

3 fichiers touches : sidebar.tsx, overview.tsx, dashboard-layout.tsx.

---

## Sprint QA-Remediation — 2026-04-16

7 commits atomiques, 5 bugs critiques resolus, 286 tests verts.

- Bug 1.A : FK candidatures → profiles (migration 075)
- Bug 1.B : Faille RGPD RLS profiles trop permissive (migration 076)
- Bug 2 : Snapshot immuable contrats (migration 077)
- Bug 3 : Prix journalier fictif retire
- Bug 4.A : Kanban responsive vertical <lg
- Bug 4.B : Algo kanban RPC PostGIS + dedup + Haversine (migration 078)
- Bug 5 : Trigger conversation casse depuis Epic 6 (migration 079)

### Bugs connexes non traites

| # | Severite | Description |
|---|---|---|
| BC-1 | Critique latent | EF generate-contrat referencait mauvaises colonnes — corrige + redeploy |
| BC-2 | Mineur | Warning React key dans ContractClauses |
| BC-4 | Cleanup | missions-section.tsx et listings-grid.tsx orphelins |
| BC-5 | Cleanup | scripts/ non-tracke git |
| BC-6 | UX | overview.tsx embed profiles a refactor |
| BC-7 | Donnees | Annonce seed sans location PostGIS |
| BC-8 | UX a11y | button sans type dans home-grid.tsx |
| BC-9 | Auth | /admin redirect sans ?redirect= |
| BC-10 | Carte | Mapbox token placeholder |
