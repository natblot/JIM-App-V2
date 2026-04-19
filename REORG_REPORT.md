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

## 5. Exécution reorg (Phase 4 — complétée)

- Commit : `5527a69 refactor: archive legacy landing HTML + ajoute REORG_REPORT.md`
- Déplacement : `jim-app/jim-landing-page.html` → `jim-app/docs/legacy-landing.html` (100% similarité, historique préservé)
- **Pas d'autres changements** (pas de tsconfig/bundler/Docker/CI à modifier — portée minimale Option B).
- **Tests post-reorg : 286/286 ✅** (identique baseline)
- **`git log --follow jim-app/docs/legacy-landing.html`** remonte à `81bcfaa feat: commit initial JIM App V2` ✅

---

## 6. Détection dead-code (Phase 5)

### Scope (validé utilisateur)

- **In scope** : `jim-app/supabase/` (9 fichiers trackés — suspect vestige)
- **Out of scope par décision utilisateur** : Firebase (`dataconnect/`, `src/dataconnect-generated/`, `.firebaserc`), BMAD (`_bmad/`, `_bmad-output/`)

### Inventaire `jim-app/supabase/`

| Fichier / Dossier | Contenu |
|---|---|
| `config.toml` | Config Supabase default (`supabase init`), commentaires de doc inclus |
| `functions/` | **Dossier VIDE** (0 fichier tracké, sous-dirs absents) |
| `snippets/` | **Dossier VIDE** (0 fichier tracké) |
| `.temp/` (8 fichiers) | État CLI Supabase (`cli-latest`, `postgres-version`, `project-ref`, etc.) — **ne devrait pas être versionné** |

### Analyse 3-niveaux

| Chemin | Type | N1 (outil) | N2 (grep) | N3 (entrypoints) | Catégorie | Reco |
|---|---|---|---|---|---|---|
| `jim-app/supabase/config.toml` | Config | N/A (config, pas du code) | Seule réf = lui-même ligne 228 (self-ref `./supabase/templates/invite.html`) | CLAUDE.md + `package.json` utilisent `--workdir backend/supabase` (canonique) — jamais `--workdir supabase` | **CERTAIN** | `git rm` |
| `jim-app/supabase/.temp/*` (8 fichiers) | CLI state | N/A (artefacts CLI locaux) | Aucune réf trouvée | `.gitignore` n'exclut pas `.temp/` (oubli — voir reco gitignore) | **CERTAIN** | `git rm` + ajout `.temp/` dans `.gitignore` |
| `jim-app/supabase/functions/` (dossier vide) | Dossier | N/A | Réf cassée dans `backend/scripts/check-edge-function-size.sh:7,13` — voir note⚠️ | Le script cherche `supabase/functions` relatif au CWD. Lancé via `pnpm check-edge-size` depuis `jim-app/`, il tombe sur ce dossier VIDE et conclut à tort "Aucune Edge Function" | **CERTAIN** | `git rm -r` + fixer script (hors scope — voir points non traités) |
| `jim-app/supabase/snippets/` (dossier vide) | Dossier | N/A | Aucune réf | Aucune | **CERTAIN** | `git rm -r` |

### Note sur le niveau 1 (outil statique)

Tous les éléments ciblés sont des **configs Supabase / artefacts CLI / dossiers vides** — aucun outil statique (ts-prune, knip, depcheck, vulture) n'est applicable ici. Par stricte lecture méthodo → DOUTEUX. Mais les niveaux 2+3 convergent sans ambiguïté avec la documentation CLAUDE.md (canonique = `backend/supabase`). Classement **CERTAIN** assumé et justifié.

### ⚠️ Bug préexistant découvert (hors scope)

`backend/scripts/check-edge-function-size.sh` utilise le chemin relatif `supabase/functions` (lignes 7, 13). Lancé via `pnpm check-edge-size` depuis `jim-app/`, il pointe vers `jim-app/supabase/functions/` (VIDE) au lieu de `jim-app/backend/supabase/functions/`. Le script échoue silencieusement avec "Aucune Edge Function trouvée" → la vérification de taille 2MB n'est **pas effective** aujourd'hui.

**Fix recommandé (hors scope reorg)** : remplacer `supabase/functions` → `backend/supabase/functions` dans le script, OU ajouter `cd "$(dirname "$0")/../supabase"` en début.

### Candidats écartés (conservés)

- Firebase complet (`dataconnect/` racine, `src/dataconnect-generated/`, `.firebaserc`) — décision user (futur push notifs)
- BMAD (`_bmad/`, `_bmad-output/`) — décision user (garder accessible)
- Symlinks `jim-app/skills/*` — jamais touchés (méthodo)

### Recommandation complémentaire

Ajouter dans `jim-app/.gitignore` :
```
# Supabase CLI state (ne pas commiter)
**/supabase/.temp/
```

---

## 7. Validation dead-code

- Token reçu : `Go Phase 7` (variante casse acceptée, intention non ambiguë) + portée **'toutes'**
- Items conservés : aucun (PROBABLE/DOUTEUX absents — toute la liste était CERTAIN)

## 8. Exécution dead-code (Phase 7 — complétée)

- Commit : `65588ef chore: supprime vestige jim-app/supabase + ignore supabase/.temp`
- 10 fichiers modifiés, **-392 lignes** / +3 lignes
- Fichiers supprimés (9) :
  - `jim-app/supabase/config.toml`
  - `jim-app/supabase/.temp/cli-latest`
  - `jim-app/supabase/.temp/gotrue-version`
  - `jim-app/supabase/.temp/pooler-url`
  - `jim-app/supabase/.temp/postgres-version`
  - `jim-app/supabase/.temp/project-ref`
  - `jim-app/supabase/.temp/rest-version`
  - `jim-app/supabase/.temp/storage-migration`
  - `jim-app/supabase/.temp/storage-version`
- Dossiers vides filesystem nettoyés : `jim-app/supabase/{functions,snippets,.temp}` + `jim-app/supabase` lui-même supprimés (rmdir non-git)
- `.gitignore` : ajout `**/supabase/.temp/` pour prévenir re-commit accidentel
- Dépendances : aucune retirée (hors scope)
- Symboles : aucun retiré (hors scope)
- **Tests post-dead-code : 286/286 ✅** (identique baseline)

## 9. Build status : avant / après

| Étape | Baseline (main) | Après reorg Phase 4 | Après dead-code Phase 7 | Delta |
|---|---|---|---|---|
| Tests | 286/286 ✅ | 286/286 ✅ | 286/286 ✅ | 0 régression |
| Typecheck | 3 erreurs préexistantes | 3 erreurs préexistantes | 3 erreurs préexistantes | 0 régression (snapshot Option γ identique) |
| Lint | HANG préexistant | Non relancé | Non relancé | N/A |

## 10. Historique git

- **Branche** : `refactor/reorg-20260419` (2 commits d'avance sur `main`)
- **Vérification `git log --follow`** : `jim-app/docs/legacy-landing.html` remonte à `81bcfaa feat: commit initial JIM App V2` ✅
- **Commits** :
  - `5527a69 refactor: archive legacy landing HTML + ajoute REORG_REPORT.md`
  - `65588ef chore: supprime vestige jim-app/supabase + ignore supabase/.temp`
  - `8ddf9fc docs: finalise REORG_REPORT avec sections 7-12 (phases 7+8)`
  - `163e6e4 fix(scripts): check-edge-function-size pointe vers backend/supabase/functions`
  - `c66c718 fix(scripts): check-edge-function-size portable macOS + Linux`
- **PR** : à créer manuellement si souhaité (mode a → pas obligatoire)

## 11. Points non traités

### Bugs préexistants fixés dans cette session (commits séparés)

- ✅ **`check-edge-function-size.sh` path cassé** — commit `163e6e4` : remplace `supabase/functions` par `backend/supabase/functions` (lignes 7+13). Le script lancé via `pnpm check-edge-size` depuis `jim-app/` pointait vers le vestige `jim-app/supabase/functions/` (maintenant supprimé).
- ✅ **`check-edge-function-size.sh` `du -sb` macOS** — commit `c66c718` : remplace `du -sb` (GNU Linux only) par `du -sk * 1024` (portable macOS BSD + Linux). Precedemment sur macOS, `size` restait vide et la comparaison 2MB plantait silencieusement ligne 17. Les 28 Edge Functions sont maintenant correctement mesurees.

### Baseline cassée préexistante (hors scope reorg)

- **Typecheck** : 3 erreurs dans `@jim/shared` (hooks `useCandidaturesRecues`, `useConversations`, `useVilleAutocomplete`) — à fixer dans une session dédiée typage.
- **Lint** : ESLint hang à 0% CPU. Cause probable : `src/dataconnect-generated/` n'est pas dans `eslint.config.mjs` ignores → exploration infinie ? À investiguer.

### Hors scope par décision user (conservés)

- **Firebase stack** (`dataconnect/`, `src/dataconnect-generated/`, `.firebaserc`, `firebase-debug.log` non-tracké) : conservé pour push notifications futures.
- **BMAD** (`_bmad/` 865 fichiers + `_bmad-output/` 26 fichiers) : conservé à la racine.
- **Symlinks Claude skills** (`jim-app/skills/*`) : non touchés par méthodo.

### Suggestions passes futures

- Audit dead-code TS/JS avec `knip` ou `ts-prune` une fois le lint fixé (hors scope initial).
- Question stratégique : le wrapper `jim-app/` est toujours présent. Si un jour le repo se simplifie (Firebase retiré, BMAD migré ailleurs), une Option A (aplatir `jim-app/` vers racine) deviendra triviale.

## 12. Rollback

- **Branche** : `refactor/reorg-20260419`
- **Base** : `main` à `5622df6 feat(landing): pivot hybride hero editorial + KanbanNav`
- **Commit de départ (avant reorg)** : `9834570 chore(bmad): ajoute session brainstorming 2026-04-17-1747` (dernier commit sur `main` avant création branche)
- **Rollback total** : `git checkout main && git branch -D refactor/reorg-20260419`
- **Rollback partiel (dead-code uniquement)** : `git revert 65588ef` sur la branche
- **Rollback partiel (reorg landing)** : `git revert 5527a69` sur la branche
- **Si PR mergée** : `git revert <merge-commit> -m 1` sur `main`

