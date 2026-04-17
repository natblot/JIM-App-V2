# CLAUDE.md — JIM Web (Next.js 16.1)

> Regles specifiques au frontend web. Les regles globales sont dans `jim-app/CLAUDE.md`.

## Stack

- Next.js 16.1.x, React, TypeScript strict
- Tailwind CSS 3.4.17 via `tailwind.config.ts`
- TanStack Query (QueryProvider dans `(app)/layout.tsx`)
- Supabase SSR : `lib/supabase-server.ts` (lectures SSR)
- Supabase browser : `lib/supabase-browser.ts` via `@jim/shared/adapters/`
- Icones : `lucide-react` + Material Symbols (tune icon)
- Carte : `mapbox-gl` + `react-map-gl`

## Route groups

| Groupe | Usage | Auth |
|--------|-------|------|
| `(marketing)/` | Pages publiques (landing, annonce, carte, a-propos, tarifs, fonctionnalites) | Header + Footer |
| `(auth)/` | Login, Register, Reset/Update password | Layout centre + Suspense |
| `(app)/` | Dashboard, Messages, Contrat, Publier, Paiement | AuthGuard client-side |
| `admin/` | Dashboard admin (KPI, signalements, logs, alertes, support, utilisateurs) | Middleware role check |

## Auth

- `AuthProvider` dans root layout : `onAuthStateChange` → context `user/session/supabase`
- `AuthGuard` : redirect `/login?redirect=` si pas de session (client-side)
- `middleware.ts` : protege `/admin/*` (role check `user_metadata.role`)
- `/messages` protege par AuthGuard client-side uniquement (sessions localStorage non visibles par middleware serveur)

## Conventions

- Hooks depuis `@jim/shared` — 34 hooks branches (sur 53 disponibles)
- SSR pour pages publiques (`generateMetadata()`, JSON-LD)
- Client components pour interactivite (hooks, Realtime)
- Embeds PostgREST inter-users : passer par `profiles_public` (vue projetee colonnes publiques). JAMAIS `profiles` direct pour afficher les infos d'un autre utilisateur.
- Images : `next/image` avec domaines `lh3.googleusercontent.com` + `xfgktshirllqesnwmwpm.supabase.co` + `api.mapbox.com`

## Landing — Regles specifiques

- `h-screen overflow-hidden` dans `(marketing)/page.tsx` UNIQUEMENT — PAS dans le layout group
- Les autres pages marketing (detail annonce, carte) ont un flux vertical naturel avec scroll
- Header flottant 3 lignes sur landing, variante compacte 1 ligne sur les autres pages via `usePathname()`
- Footer `fixed bottom-0` sur landing, `static` sur les autres pages
- Kanban colonnes : `flex-col lg:flex-row` — vertical empile <1024px

## Dashboard — Design retenu

- Sidebar : `bg-[#f9f3eb]`, item actif coral (`bg-[#ff7c5c] text-white shadow-lg`)
- Header sticky : search + bell + CTA "Disponibilite" coral, `backdrop-blur-md`
- Overview : hero cards KPI + timeline activite + alertes + paiements recents
- Mobile : bottom nav pill flottante `bottom-6`, `z-[100]`

## Build actuel

27 pages + middleware, 0 erreurs TS, 8 tests web.
