# ADR-011 — Advisor Tool (API beta) : decision de ne pas implementer

**Date** : 2026-04-17
**Statut** : Accepte
**Decideur** : Nathan Blottiaux

## Contexte

L'advisor tool est une feature beta de l'API Anthropic (header `advisor-tool-2026-03-01`). Elle permet a un modele "executor" moins cher (Haiku 4.5 ou Sonnet 4.6) de consulter un modele "advisor" plus intelligent (Opus 4.7) pendant une generation, dans un seul appel `/v1/messages`.

L'objectif est de reduire les couts sur les workloads agentiques longs tout en maintenant la qualite des decisions strategiques.

## Workloads evalues

Trois candidats identifies dans le backlog JIM :

### 1. Pipeline RPPS (Epic 1)
- 786 lignes, 3 Edge Functions, 2 modules _shared
- 100% deterministe : appels FHIR API Annuaire Sante, normalisation strings, cache 6 mois
- **Zero composante LLM** — verification de format et correspondance de noms

### 2. Matching remplacant/titulaire (Epic 4/6)
- `match_remplacants_for_annonce()` : SQL RPC PostGIS, filtre geo + calendrier, top 50
- `annonces_similaires()` : distance + delta retrocession
- **Zero composante LLM** — SQL deterministe, latence <100ms
- Potentiel theorique : re-ranking intelligent (reputation, specialites, prediction d'acceptation)
- Mais : ajout de feature (pas optimisation), +2-5s latence vs <100ms actuel

### 3. Relances candidatures (Epic 5/7)
- `notification.service.ts` (404 lignes) + pg_cron scheduling
- J+2/J+5 fixes, dispatch FCM, retry backoff
- **Zero composante LLM** — logique de routing deterministe
- Potentiel theorique : personnalisation messages, timing optimal
- Mais : ajout de feature, non prioritaire pour le beta launch

## Analyse de couts (hypothetique)

Simulation sur un workload LLM single-turn de 6K tokens (le plus proche de ce que JIM pourrait avoir) :

| Configuration | Cout/appel |
|---|---|
| Opus 4.7 solo | $0.07 |
| Haiku 4.5 executor + Opus 4.7 advisor (2 calls) | $0.13 |

**ROI = -86%** — l'advisor tool est plus cher sur des workloads courts car l'advisor relit le transcript complet a chaque invocation.

L'advisor tool est rentable quand :
- La conversation depasse ~50K tokens de contexte accumule
- Il y a des dizaines de tool calls (ou l'executor peut operer seul la plupart du temps)
- L'advisor n'est consulte que ponctuellement pour des decisions strategiques

JIM n'a aucun de ces patterns : ses Edge Functions sont des operations atomiques courtes (≤40 lignes, single-turn).

## Decision

**Ne pas implementer l'advisor tool pour l'instant.**

Aucun des 3 workloads evalues ne montre de ROI > 30% en economie de tokens avec qualite equivalente. Le prerequis fondamental (avoir un workload LLM en production) n'est pas rempli.

## Conditions de reevaluation

Reevaluer cette decision si :
1. JIM ajoute un feature LLM generatif (contrats IA, chatbot support, matching intelligent)
2. Le workload LLM depasse 50K tokens/session avec des tool calls multiples
3. Le pricing advisor change (ex: facturation forfaitaire au lieu de par-token)

## Paires executor/advisor disponibles (reference)

| Executor | Advisor | Input $/MTok | Output $/MTok |
|---|---|---|---|
| Haiku 4.5 | Opus 4.7 | $1 / $5 (exec) + $5 / $25 (adv) | Optimal pour les longs workflows |
| Sonnet 4.6 | Opus 4.7 | $3 / $15 (exec) + $5 / $25 (adv) | Compromis qualite/cout |
| Opus 4.7 | Opus 4.7 | $5 / $25 (exec+adv) | Self-review, peu d'interet cout |

## Alternatives considerees

- **Implementer un PoC sur le matching** : rejete car le matching est du SQL pur, ajouter un LLM degrade la latence de <100ms a ~3-5s pour un gain de qualite non demontre
- **Implementer un PoC sur les relances** : rejete car la personnalisation des messages n'est pas prioritaire pour le beta launch, et le volume de notifications est trop faible pour justifier le cout
