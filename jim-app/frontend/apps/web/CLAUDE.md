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

## Dashboard — Design retenu (DA template jim-design-system, variante A)

- Navbar UNIFIEE sur tout le site : `components/layout/header.tsx` (celle de la page
  d'accueil — logo, pill "Missions", CTA "Publier" anime, search sombre, dropdown profil).
  Les pages (app) la rendent via `app-shell/app-page.tsx` ou directement (dashboard,
  paiement). `app-navbar.tsx` est supprime — ne pas le recreer.
- Onglets pilotes par `?tab=` (deep links conserves), pills EN PAGE (desktop, sous le
  fil d'ariane) + bottom bar mobile — plus de sidebar ni de pills dans la navbar
- Backdrop papier chaud : fond `#fdf6ed`, radial corail + dot-grid, fil d'ariane pill
- Palette chaude uniquement : texte `#3a1f08`, muted `#7a5434`, bordures `#edd9c4`,
  corail `#ff7c5c` — JAMAIS de bleu ni de gris froid (regle template)
- Overview : hero cards KPI + timeline activite + alertes + paiements recents
- Mobile : bottom nav pill flottante `bottom-6`, `z-[100]`, bordures beige
- Regle styled-jsx : un className pose sur un composant React (<Link>) n'a pas la classe
  de scope jsx-* — le cibler via `:global(...)` depuis un parent HTML natif

## Detail mission — /contrat/[id]

- Design : `mission-detail-v2` (template jim-design-system, "Détail mission · dashboard V2")
- Composant : `components/contrat/mission-detail-v2.tsx` — en-tete mission + 4 hero stats
  (durée / rétrocession / signatures / étape) + parcours 6 étapes + 3 mini-cartes
  (Contrat / Transmissions / Messagerie), detail en overlay (Échap pour fermer)
- Reutilise `contract-clauses.tsx` + `sign-button.tsx` (recolores tokens chauds) ;
  query + mutations identiques a l'ancien `contract-detail.tsx` (supprime)
- PDF : Blob URL + auto-print (jamais `document.write`)

## Build actuel

28 routes + middleware, 0 erreurs TS, 301 tests monorepo verts.
