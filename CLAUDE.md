# JIM (Job In Med)

## Contexte

Marketplace B2B mobile-first pour kinésithérapeutes français (remplaçants ↔ titulaires),
domaine healthcare régulé (RPPS, HDS, RGPD, Ordre MK). 13 epics terminés — MVP beta-ready.

> ⚠️ **Doc canonique détaillée : [`jim-app/CLAUDE.md`](jim-app/CLAUDE.md).**
> Ce fichier-ci est l'entrée projet (vue d'ensemble + guidelines comportementales).
> Les règles précises (sécurité, stack verrouillée, Stripe, RLS, design) vivent dans
> les `CLAUDE.md` imbriqués (`jim-app/`, `frontend/apps/web/`, `frontend/apps/mobile/`).

## Stack

- Monorepo **pnpm** sous `jim-app/`.
- Mobile : Expo SDK 54 (React Native / Expo Router) + NativeWind 4.2.
- Web : Next.js 16.1 (landing + dashboard + admin) + Tailwind 3.4.17.
- Backend : Supabase (migrations SQL + Edge Functions Deno).
- Paiement : Stripe Connect (Destination Charges, Express).
- TypeScript strict, Zod 4, TanStack Query 5, Zustand 5, Vitest.

## Commandes essentielles

```bash
cd jim-app/frontend/apps/web && pnpm dev           # Web
cd jim-app/frontend/apps/mobile && npx expo start   # Mobile
pnpm -C jim-app test:run                            # Tests
supabase db push --workdir backend/supabase         # Migrations (depuis jim-app/)
supabase functions deploy <name> --workdir backend/supabase  # Edge Functions
```

## Architecture (résumé — détail dans jim-app/CLAUDE.md)

```
jim-app/
├── backend/supabase/          # migrations + Edge Functions (canonique)
├── frontend/
│   ├── apps/{mobile,web}/      # Expo + Next.js
│   └── packages/{shared,ui}/   # hooks/validators/stores + composants NativeWind
├── docs/                       # specs, ADRs, design-tokens, routines, history
├── skills/                     # symlinks Stripe (mode 120000 — NE PAS TOUCHER)
└── src/dataconnect-generated/  # vestige Firebase
```

- Vestige Firebase conservé (push notifs futures) : `dataconnect/`, `jim-app/src/dataconnect-generated/`, `.firebaserc`.
- `_bmad/` + `_bmad-output/` : framework et artefacts de planning (hors code applicatif).
- Design : **`jim-design-system-template 2/`** = source de vérité (référencée par `jim-app/docs/specs/*`). Voir aussi `PRODUCT.md` (skill `impeccable`).

## Conventions de code

- Code (variables, fonctions, types) en **ANGLAIS** ; commentaires, commits, UI en **FRANÇAIS** (Conventional Commits FR : `feat(epic-N):`, `fix:`, `chore:`).
- `strict: true` — zéro `any`, zéro `@ts-ignore`. Schémas Zod = source unique de validation. Pas de barrel exports (sauf `@jim/ui`).
- Archi hexagonale légère : **jamais** d'import direct de `@supabase/supabase-js` dans `apps/` → passer par `@jim/shared/adapters/`.
- Sécurité NON NÉGOCIABLE : RLS par rôle, lectures inter-users via `profiles_public`, montants en centimes (INT), Stripe `sk_test_*` uniquement avant HDS, webhooks Deno `constructEventAsync`. **Détail complet dans `jim-app/CLAUDE.md`.**
- Le mot « commission » n'apparaît **JAMAIS** dans l'UI → « frais de gestion » ou « service de sécurisation professionnelle ».
- Pas d'emoji dans l'UI sauf demande explicite. Tap zones ≥ 44×44, contraste ≥ 4.5:1.

## Workflow git

Branches dédiées, jamais de commit direct sur `main`. Commits atomiques FR. PR optionnelle (side-project).

## Secrets et config

- Variables locales dans `.env.local` (**non tracké**). Modèle : `jim-app/.env.local.example`.
- Secrets Edge Functions (Stripe, FCM, support) configurés côté Supabase Dashboard.
- **NE JAMAIS écrire de valeurs réelles ici.** Repo destiné au public : aucun document confidentiel (contrats, exports, captures clients) ne doit être tracké.

## Notes pour Claude

- Lire **`jim-app/CLAUDE.md`** avant toute tâche sur le code.
- Tradeoffs > suppositions : surface les doutes, ne supprime jamais un fichier dont tu ignores l'usage sans confirmation.
- Respecter les guidelines comportementales ci-dessous.

---

# Behavioral guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
