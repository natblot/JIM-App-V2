# ADR-012 — Migration Opus 4.7 + restructuration CLAUDE.md

**Date** : 2026-04-17
**Statut** : Accepte
**Decideur** : Nathan Blottiaux

## Contexte

Claude Opus 4.7 est sorti le 16 avril 2026. Par rapport a Opus 4.6 :
- +13% sur le benchmark coding 93 taches
- Adaptive thinking (remplace extended thinking — plus de `budget_tokens` manuel)
- Nouveau effort level `xhigh` (recommande pour coding/agentic)
- Interpretation plus litterale des prompts
- Vision 3x meilleure (images jusqu'a 3.75 megapixels)

Le CLAUDE.md du projet JIM pesait 2033 lignes (~41K tokens), soit ~4% de la fenetre de contexte consomme a chaque conversation. 80% du contenu etait de l'historique de sprints.

## Decisions prises

### 1. Restructuration CLAUDE.md

| Avant | Apres |
|-------|-------|
| 1 fichier, 2033 lignes, 41K tokens | 4 fichiers, 500 lignes total, ~6K tokens |

Fichiers crees :
- `jim-app/CLAUDE.md` (199 lignes) — regles actives uniquement
- `frontend/apps/web/CLAUDE.md` (56 lignes) — regles specifiques Next.js
- `frontend/apps/mobile/CLAUDE.md` (47 lignes) — regles specifiques Expo
- `docs/history/sprints.md` (198 lignes) — historique condense des sprints

### 2. Corrections pour Opus 4.7

| Correction | Raison |
|-----------|--------|
| `constructEvent()` → `constructEventAsync()` dans la doc securite | Erreur factuelle corrigee (bug Deno) |
| Regles formulees comme contraintes binaires testables | Comportement plus litteral d'Opus 4.7 |
| Sanitization precisee : "echappement HTML `<>&\"'`" | Formulation floue rendue explicite |
| Stripe runtime check precise : "rejeter si cle ne commence pas par `sk_test_`" | Instruction actionnable |
| `profiles_public` documentee comme regle | Post-migration 076 |

### 3. Mise a jour sous-agents

| Agent | Changement |
|-------|-----------|
| `prompt-expert` | Modele `opus-4-6` → `opus-4-7` |
| `auditor` | Ajout instruction explicite sur l'usage des outils |
| `prompt-expert` | Ajout instruction explicite sur l'usage des outils |

Motivation : Opus 4.7 a tendance a moins utiliser les outils par defaut — l'instruction explicite contrecarre ce biais.

### 4. Design tokens externalises

Les ~50 lignes de CSS custom properties ont ete deplacees de `CLAUDE.md` vers `docs/design-tokens.css` pour ne pas consommer de tokens de contexte sur des informations rarement utiles.

## Impact mesure

- **Economie de contexte** : ~37K tokens par conversation (-90%)
- **Precision des instructions** : toutes les contraintes critiques JIM sont des regles binaires testables
- **Coherence** : chaque sous-projet a ses propres regles specifiques

## Risques

- Les regles historiques deplacees dans `docs/history/sprints.md` ne seront plus chargees automatiquement en contexte — si un agent a besoin de comprendre pourquoi une decision a ete prise, il devra lire ce fichier explicitement.
- Mitigation : les decisions cles sont resumees dans la section "Decisions techniques" du CLAUDE.md racine.

## Alternatives considerees

- **Garder un seul CLAUDE.md mais avec des sections pliables** : rejete car Claude Code ne supporte pas le folding, tout est charge en contexte
- **Supprimer l'historique completement** : rejete car il contient des decisions importantes (ex: pourquoi Destination Charges et pas Separate Charges)
