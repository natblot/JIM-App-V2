# Routines Claude Code — JIM App V2

3 routines cloud automatisent la QA, la revue de code et le monitoring pg_cron.

## Vue d'ensemble

| Routine | Trigger | Frequence | Environnement | Connecteurs |
|---------|---------|-----------|---------------|-------------|
| **A — Nightly Security Scan** | Scheduled 03:00 UTC | 1/jour | `jim-supabase-readonly` | Slack #jim-dev |
| **B — PR Review** | `pull_request.opened` + `.synchronize` | Par PR | `jim-github-review` | GitHub |
| **C — pg_cron Health Check** | API POST | A la demande | `jim-supabase-readonly` | Slack + GitHub |

**Quota total** : ≤ 15 runs/jour (plan Max)

## Environnements custom

### jim-supabase-readonly
- **Network** : supabase.co + github.com
- **Env vars** : `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- **JAMAIS** de `SUPABASE_SERVICE_ROLE_KEY`

### jim-github-review
- **Network** : github.com uniquement
- **Env vars** : aucune variable sensible

## Configuration

1. Aller sur [claude.ai/code/routines](https://claude.ai/code/routines)
2. Creer les 2 environnements custom ci-dessus dans Settings > Environments
3. Pour chaque routine, copier-coller le prompt depuis le fichier `.md` correspondant
4. Configurer les triggers et connecteurs selon le tableau ci-dessus
5. Les tokens API generes sont documentes dans `secrets.md` (gitignored)

## Fichiers

| Fichier | Contenu |
|---------|---------|
| [routine-a-nightly-security-scan.md](routine-a-nightly-security-scan.md) | Prompt + config Routine A |
| [routine-b-pr-review.md](routine-b-pr-review.md) | Prompt + config Routine B |
| [routine-c-pgcron-healthcheck.md](routine-c-pgcron-healthcheck.md) | Prompt + config Routine C |
| `secrets.md` | Tokens API (gitignored) |
| `.last-scan-migration` | Marqueur Routine A (auto-gere) |

## Garde-fous communs

Tous les prompts incluent :
- **NFR18** : zero PII dans les logs/commentaires/messages (UUID tronques uniquement)
- **Clause fail-safe** : si comportement non couvert, alerte Slack et arret
- **Conditions d'arret explicites** : succes ET echec definis

## Test

- **Routine A** : force un run manuel dans le dashboard routines
- **Routine B** : cree une PR de test non conforme (ex: `console.log(user.email)` dans une EF)
- **Routine C** : `curl -X POST <routine_url> -H "Authorization: Bearer <token>" -d '{"cron_job_name":"expire-candidatures-j7","failure_count":3}'`
