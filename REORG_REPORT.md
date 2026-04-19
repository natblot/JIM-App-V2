# Rapport de réorganisation

Branche : `refactor/reorg-20260419`
Date début : 2026-04-19
Mode : **(a) allégé — projet perso**

---

## 0. Calibrage

- Mode retenu : **(a) projet perso / side-project**
- Validations groupées, commits par phase, rapports compacts
- Pas de CODEOWNERS / ADR / freeze (non applicable mode a)

---

## 1. Sanity check target

**Nature du projet :** monorepo pnpm healthcare (B2B marketplace kinés). Stack : Expo RN (mobile) + Next.js (web) + Supabase (backend). 13 epics terminés, beta-ready. Doc canonique = `jim-app/CLAUDE.md`.

**Cible retenue : Option B (conservateur)**

Le schéma générique `backend/` + `frontend/` à la racine du repo n'est **pas adopté** car :
- Le code canonique est déjà dans `jim-app/backend/` + `jim-app/frontend/`, documenté dans CLAUDE.md.
- Aplatir `jim-app/` vers la racine impliquerait `git mv` sur ~2000 fichiers + réécriture CLAUDE.md + risque chemins cassés, pour zéro gain fonctionnel.
- Les vrais problèmes sont internes : doublons vestigiaux + orphelins Firebase (hors scope).

**Arborescence cible (inchangée au plus haut niveau) :**
```
JIM App V2/                    ← racine repo
├── _bmad/ + _bmad-output/     ← INCHANGÉS (hors scope par décision user)
├── dataconnect/ + .firebaserc ← INCHANGÉS (Firebase, hors scope — push notifs futures)
├── Image/                      ← INCHANGÉ (référencé CLAUDE.md)
└── jim-app/                    ← wrapper CONSERVÉ
    ├── backend/                ← canonique (149 fichiers)
    ├── frontend/               ← canonique (343 fichiers)
    ├── docs/, screenshots/, skills/, .claude/
    ├── src/dataconnect-generated/  ← INCHANGÉ (Firebase, hors scope)
    ├── supabase/               ← À SUPPRIMER Phase 5 (vestige, doublon de backend/supabase/)
    └── jim-landing-page.html   ← À DÉCIDER Phase 3 : déplacer vers docs/ ou supprimer ?
```

**Validation utilisateur :** Option B confirmée, Firebase hors scope, BMAD inchangé.

---

## 2. Baseline (branch `refactor/reorg-20260419`)

| Étape | Commande | Statut | Durée |
|---|---|---|---|
| Tests | `pnpm -C jim-app test:run` | ✅ **286/286 pass** | 37.7s |
| Typecheck | `pnpm -C jim-app typecheck` | ❌ **FAIL préexistant** (3 erreurs) | 2.3s |
| Lint | `pnpm -C jim-app lint` | ⚠️ **HANG préexistant** (killé après 13min à 0% CPU) | N/A |

**Snapshot erreurs typecheck préexistantes (Option γ — toute NOUVELLE erreur = régression) :**
1. `frontend/packages/shared/src/hooks/useCandidaturesRecues.ts:64` — `profiles_public` colonne `rpps_number` inexistante
2. `frontend/packages/shared/src/hooks/useConversations.ts:75` — Map type `string|null` vs `string`
3. `frontend/packages/shared/src/hooks/useVilleAutocomplete.ts:38` — AbortSignal type incompat

**Stratégie anti-drift** (mode a) : ignorer, pas de rebase prévu, opération courte.

---

## 3. Cartographie

### Arborescence git-tracked (1444 fichiers total, exclusions `.gitignore` + `node_modules/` + `dist/` + `.next/` appliquées)

**Top-level repo :**

| Dossier | Fichiers trackés | Nature |
|---|---|---|
| `_bmad/` | 865 | Framework BMAD (agents, workflows, config) — hors scope |
| `jim-app/` | 542 | **Projet réel** |
| `_bmad-output/` | 26 | Artefacts de planning (prd.md, architecture.md…) — hors scope |
| `dataconnect/` | 6 | Firebase Data Connect — **hors scope Firebase** |
| `Image/` | 3 | PNG UX de référence — **référencé CLAUDE.md** |
| `.firebaserc`, `.gitignore` | 2 | Configs racine |

**Inside `jim-app/` (542 fichiers) :**

| Sous-dossier | Fichiers | Statut |
|---|---|---|
| `frontend/` | 343 | ✅ Canonique (`apps/mobile`, `apps/web`, `packages/shared`, `packages/ui`) |
| `backend/` | 149 | ✅ Canonique (`supabase/migrations`, `supabase/functions`, `scripts/`) |
| `supabase/` | 9 | ❌ **VESTIGE** (doublon config.toml + `.temp/*` commitées par erreur) |
| `src/dataconnect-generated/` | 9 | ⚪ Firebase — hors scope |
| `docs/` | 8 | ✅ Docs projet |
| `screenshots/` | 4 | ✅ Screenshots E2E |
| `skills/` | 3 | ⚠️ Symlinks versionnés (mode 120000) — NE PAS TOUCHER |
| Root configs | 15+ | ✅ `package.json`, `tsconfig*`, `eslint.config.mjs`, etc. |
| `jim-landing-page.html` | 1 | ❓ **ISOLÉ** — aucune référence trouvée dans le code |

**Non-trackés filesystem :**
- `jim-app/apps/` (node_modules/.bin/ uniquement, 0 fichier git)
- `jim-app/packages/` (idem, 0 fichier git)
- `.DS_Store`, `firebase-debug.log` (non versionnés)

### Points d'entrée

- **Mobile** : `jim-app/frontend/apps/mobile` — Expo Router (`npx expo start`)
- **Web** : `jim-app/frontend/apps/web` — Next.js (`pnpm dev`)
- **Backend** : `jim-app/backend/supabase` — Edge Functions + migrations (`supabase db push --workdir backend/supabase`)
- **Script** : `jim-app/backend/scripts/check-edge-function-size.sh`

### Stack détectée

| Composant | Version |
|---|---|
| Node | v24.13.1 |
| pnpm | 10.32.1 |
| Expo SDK | 54.x |
| Next.js | 16.1.x |
| NativeWind | 4.2.x |
| Tailwind CSS | 3.4.17 |
| TypeScript | strict |
| Supabase JS | 2.98.x |
| Vitest | 4.1.0 |

### Configs structurantes (paths à valider post-reorg)

- `jim-app/pnpm-workspace.yaml` → `frontend/apps/*` + `frontend/packages/*` (n'inclut PAS `apps/` ni `packages/` à jim-app root — preuve supplémentaire qu'ils sont vestigiaux)
- `jim-app/package.json` → dep `@dataconnect/generated: link:src/dataconnect-generated` (Firebase, hors scope)
- `jim-app/tsconfig.base.json` → paths alias `@jim/shared` + `@jim/ui` (vers `frontend/packages/`)
- `jim-app/eslint.config.mjs` → ignore `node_modules`, `dist`, `.next`, `.expo`. **N'ignore PAS `src/dataconnect-generated/`** (probable cause du hang lint)
- `jim-app/CLAUDE.md` → documente `backend/supabase` et `frontend/apps/*` comme canoniques

### Submodules / symlinks

- **Pas de submodule** (aucun `.gitmodules`)
- **Symlinks trackés** (mode 120000) dans `jim-app/skills/` : `stripe-projects`, `stripe-best-practices`, `upgrade-stripe`. **NE SERONT JAMAIS DÉPLACÉS NI SUPPRIMÉS AUTOMATIQUEMENT**.
- Symlinks non-trackés dans `node_modules/.bin/` et `node_modules/@jim/shared` (workspace pnpm) : ignorés.

### Ambigus

- `jim-landing-page.html` : prototype HTML statique (40kB), commit initial, aucune référence trouvée. Candidat dead-code OU à archiver dans `docs/`.

---

## 4. Plan reorg (Phase 4)

### 4.1 Arbre cible

**Inchangé** par rapport à l'arbre actuel (voir section 1). Option B = pas de restructuration lourde.

### 4.2 Déplacements proposés

| Source | Destination | Motif | Impacts |
|---|---|---|---|
| `jim-app/jim-landing-page.html` | `jim-app/docs/legacy-landing.html` | Sort un prototype HTML isolé du top-level app | Aucun code ne le référence → aucun impact technique. Juste rangement. |

**C'est tout** pour Phase 4. Le reste (`jim-app/supabase/` vestige) relève de suppression Phase 5 (dead-code), pas de déplacement.

**Alternative à valider en Phase 3 :** si l'utilisateur juge que `jim-landing-page.html` est complètement obsolète, on le traite directement en Phase 5 comme suppression. Sinon on le déplace Phase 4 pour archive.

### 4.3 Risques spécifiques repérés

- **Très faibles** vu la portée minimale d'Option B.
- `jim-landing-page.html` : aucun impact technique (fichier isolé, 0 référence code/config).
- Aucun changement à `tsconfig`, `pnpm-workspace.yaml`, `package.json`, `eslint.config.mjs`, Dockerfile, CI (non applicable — pas de CI).

### 4.4 Anticipation Phase 5 (dead-code — détaillée plus tard)

Candidats principaux à analyser avec preuves 3-niveaux :
1. `jim-app/supabase/` (9 fichiers — `config.toml` + `.temp/*`) — **vestige doublon**
2. (éventuellement) `jim-app/jim-landing-page.html` si traité en suppression directe

**Hors scope Phase 5 par décision utilisateur :** tout Firebase (`dataconnect/`, `src/dataconnect-generated/`, `.firebaserc`), BMAD (`_bmad/`, `_bmad-output/`).

---

## VALIDATION BLOQUANTE PHASE 3

Valides-tu :

1. **L'arborescence cible** (inchangée hors déplacement optionnel de `jim-landing-page.html`) — **oui / ajustements** ?
2. **La liste des déplacements** (juste `jim-landing-page.html` → `docs/legacy-landing.html`) — **oui / ajustements** ?
   - Sous-question : `jim-landing-page.html` doit-il être **déplacé** (archivé dans docs/) ou **supprimé** (traité Phase 5 comme dead-code) ?

Pour déclencher l'exécution, réponds avec le token exact : **`GO PHASE 4`** accompagné de tes validations.
