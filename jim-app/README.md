# JIM (Job In Med) — App V2

Marketplace B2B mobile-first pour kinesitherapeutes francais (remplacants <-> titulaires).

## Stack

| Layer | Tech |
|-------|------|
| Mobile | Expo SDK 54, NativeWind 4.2, Reanimated 3 |
| Web | Next.js 16.1, Tailwind CSS 3.4.17, Mapbox GL |
| Backend | Supabase (PostgreSQL, Edge Functions Deno, Realtime, Storage) |
| Paiement | Stripe Connect (Destination Charges, Express accounts) |
| State | TanStack Query, Zustand, react-hook-form + Zod |
| Notifications | FCM (HTTP v1) via Edge Functions |

## Structure

```
jim-app/
├── backend/supabase/       # Migrations, Edge Functions, tests RLS
├── frontend/
│   ├── apps/mobile/        # React Native (Expo Router)
│   ├── apps/web/           # Next.js (landing, dashboard, admin)
│   └── packages/
│       ├── shared/          # Hooks, validators, stores, types
│       └── ui/              # Composants NativeWind
└── docs/
    ├── adr/                 # Architecture Decision Records
    ├── history/             # Historique des sprints
    └── routines/            # Routines Claude Code (QA automatisee)
```

## Commandes

```bash
cd frontend/apps/mobile && npx expo start    # Mobile
cd frontend/apps/web && pnpm dev             # Web
pnpm vitest run                              # Tests (286+)
```

## Routines

3 routines Claude Code automatisent la QA :

| Routine | Role | Trigger |
|---------|------|---------|
| Nightly Security Scan | Audit migrations SQL (RLS, GRANT, search_path) | Cron 03:00 UTC |
| PR Review | Review inline securite + conventions | PR opened/synced |
| pg_cron Health Check | Diagnostic + draft PR sur echec cron | API POST |

Details : [docs/routines/README.md](docs/routines/README.md)

## Documentation

- [CLAUDE.md](CLAUDE.md) — Regles du projet (pour Claude Code)
- [docs/adr/](docs/adr/) — Architecture Decision Records
- [docs/routines/](docs/routines/) — Routines QA automatisees
- [docs/history/](docs/history/) — Historique des sprints
