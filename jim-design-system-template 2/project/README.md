# JIM (Job In Med) — Design System

> Marketplace B2B mobile-first pour kinésithérapeutes français. Met en relation titulaires et remplaçants kiné vérifiés RPPS. Contrat intégré, paiement séquestré, zero commission au lancement.

---

## Sources

Ce design system a été construit en lisant directement le monorepo **JIM App V2** fourni :

- **Codebase** : dossier local `jim-app/` (monorepo pnpm — Expo mobile + Next.js 16 web + Supabase)
- **Design tokens source** : `jim-app/docs/design-tokens.css` (palette Corail v2.1, avril 2026)
- **Tailwind config source** : `jim-app/tailwind.config.js`
- **Règles projet** : `jim-app/CLAUDE.md`
- **Landing page prototype** : `jim-app/jim-landing-page.html` (HTML statique, 1300+ lignes — version antérieure de la landing, couleur `#E8844A` + Outfit ; remplacée par Next.js + Manrope + `#ff7c5c`)
- **UI kit NativeWind** : `jim-app/frontend/packages/ui/src/*` (31 composants)
- **Logo** : fourni en upload (`jim` wordmark corail sur beige) — `assets/logo-square.png`

Les versions en conflit ont été tranchées en faveur du **codebase en production** (Next.js + tokens `docs/design-tokens.css` v2.1) qui est la source de vérité la plus récente.

---

## Produit

JIM est une **marketplace à deux faces** dans un domaine healthcare réglementé (RPPS, HDS, RGPD, Ordre MK) :

| Rôle | Besoin |
|---|---|
| **Titulaire** | Trouver rapidement un remplaçant (congés, maladie, urgence) sans sortir de l'application |
| **Remplaçant** | Trouver des missions de qualité, géolocalisées, avec des titulaires vérifiés |

**Promesse** : « Le cabinet ne s'arrête pas quand vous partez. »

### Surfaces produit

1. **Web marketing + app** (`frontend/apps/web`, Next.js 16.1) — landing (Kanban Dashboard), dashboard titulaire/remplaçant, admin, carte Mapbox, messagerie desktop, calculateur de rétrocession.
2. **Mobile app** (`frontend/apps/mobile`, Expo SDK 54 / Expo Router) — navigation principale, recherche, candidature, messagerie realtime, contrats, paiements, paramètres.
3. **Composants partagés** (`frontend/packages/ui`, NativeWind 4.2) — 31 composants cross-app (badges, cards, inputs, skeletons, toggles).

### Stack

Expo SDK 54 / NativeWind 4.2 / Reanimated 3 · Next.js 16.1 / Tailwind 3.4.17 / Mapbox GL · Supabase (PostgreSQL, Edge Functions Deno, Realtime, Storage) · Stripe Connect Destination Charges · TanStack Query · Zustand · Zod · FCM via Edge Functions.

---

## Content fundamentals

### Langue & ton

- **Tout le copy UI est en français.** Code / variables / types en anglais, commits en français.
- **Ton** : « collègue bienveillant qui connaît le métier de kiné ». Direct, chaleureux, pas corporate. On parle « remplaçant » / « titulaire » comme des collègues.
- **Tutoiement sélectif** : le produit hésite. Les CTA marketing tutoient parfois (« Active ta localisation », « les missions proches de toi ») ; les emails transactionnels et les confirmations contractuelles vouvoient. Par défaut en UI d'app : **tutoiement**. En pages marketing structurantes / juridiques : **vouvoiement**.
- **Pas d'anglicismes marketing** : on dit « rétrocession », pas « revenue share ». « Frais de gestion », **jamais** « commission » (règle absolue — le mot « commission » n'apparaît jamais dans l'UI → `CLAUDE.md`).
- **Pas d'emoji dans l'UI produit** sauf demande explicite. Les landing actuelles en utilisent quelques-uns (👋, ⚡, 📍, ✨) pour les états vides et l'accueil, mais c'est une exception.

### Casing

- **Titres** : casse normale, jamais de Title Case à l'anglaise. « Le cabinet ne s'arrête pas quand vous partez. »
- **Eyebrows / étiquettes** : `TOUT-CAPS` avec `letter-spacing: 0.12em` à `0.22em`.
- **CTA boutons** : casse phrase (« Rechercher », « Publier une annonce »), pas tout-caps.
- **Badges** : mix. Les badges `URGENT` et `RPPS` sont tout-caps. Les badges d'état statut sont casse normale (« En cours », « Pourvue »).

### Exemples réels du codebase

Titres et promesses :

- « Le cabinet *ne s'arrête* pas quand vous partez. » (`ne s'arrête` en Fraunces italic corail — hero)
- « 2 847 remplacements **en cours** — mise à jour temps réel »
- « Hier, 18h42 — Dr Moreau a trouvé en 3 messages »

Microcopy (états vides, guide) :

- « Rien d'urgent — Les annonces signalées "urgentes" apparaîtront ici en premier. »
- « Active ta localisation — Les missions dans un rayon de 50 km autour de toi s'afficheront ici. »
- « Bienvenue sur JIM — Les missions s'organisent en 3 colonnes : urgentes, près de toi, nouvelles. Active la géoloc pour voir les missions proches. »
- « Aucune mission trouvée — Essayez d'élargir votre recherche ou de modifier vos critères. »

Trust signals sous le hero :

- Vérifié RPPS · Contrat intégré · Paiement séquestre · 100% gratuit au lancement

### Ce qu'on évite

- Jargon startup (« onboarding », « funnel », « scalable »)
- Promesses quantifiées non tenues
- Anglicismes marketing (« commission », « booking », « listing »)
- Emoji décoratifs dans l'UI transactionnelle
- Ton corporate hospitalier ou assurance — JIM est chaleureux, pas clinique

---

## Visual foundations

### Vibe générale

**Papier chaud, corail confiant, mesure clinique.** Fond beige (pas blanc), texte brun chaud (jamais noir pur), une couleur primaire corail qui porte toute l'identité, une italic serif éditoriale comme accent. Le tout s'équilibre sur une grille spacieuse avec beaucoup d'air.

### Palette de couleurs

Palette **« Corail »** v2.1 — voir `colors_and_type.css` pour les variables complètes.

| Token | Hex | Usage |
|---|---|---|
| `--jim-primary` | `#ff7c5c` | CTA, icônes actives, logo, accent hero |
| `--jim-primary-mid` | `#ff9a80` | hover |
| `--jim-primary-soft` | `#ffc5b3` | séparateurs doux |
| `--jim-primary-pale` | `#fff0ea` | fond de chips / badges |
| `--jim-accent` | `#e06245` | corail foncé, hover CTA |
| `--jim-accent-warm` | `#f5b86a` | ambre / miel (accents secondaires) |
| `--jim-background` | `#fdf6ed` | **fond global** (papier chaud) |
| `--jim-surface` | `#ffffff` | cartes, modales |
| `--jim-surface-alt` | `#fbf0e8` | surface secondaire |
| `--jim-beige-light/mid/dark` | `#f7ede0` / `#edd9c4` / `#dcbfa0` | tons sable (bordures, placeholders) |
| `--jim-text` | `#3a1f08` | titres (brun foncé) |
| `--jim-text-body` | `#5a3418` | corps |
| `--jim-muted` | `#7a5434` | secondaire (WCAG AA 4.7:1) |
| `--jim-success` | `#5d8f66` | vert sauge (assombri WCAG) |
| `--jim-warning` | `#b07824` | ambre foncé |
| `--jim-destructive` | `#b84030` | rouge orangé (pas rouge pur) |

**Règle** : jamais de couleurs en dur, toujours passer par les tokens. Les couleurs sémantiques sont volontairement **assombries pour atteindre WCAG AA 4.5:1** sur fond beige.

### Typographie

- **Manrope** (Google Fonts) — UI, titres sans-serif, corps, tout le reste.
  Géométrique moderne, variable, lisible en petites tailles. Poids utilisés : 300, 400, 500, 600, 700, 800.
- **Fraunces italic** (Google Fonts) — accent éditorial **uniquement sur le mot pivot** dans les hero (« *ne s'arrête* », « *enfin simple* »). Poids 400–500, italic only.

Titres en `font-weight: 800` avec `letter-spacing: -0.04em` et `line-height: 0.95` pour les hero. Corps en 400, line-height 1.55.

### Backgrounds

- **Fond global** toujours `#fdf6ed` (beige chaud), jamais blanc.
- **Hero** : fond beige + 2 blobs organiques en `radial-gradient` corail (opacity 0.08–0.20, `blur-3xl`) + grille de points subtile (`radial-gradient(circle, rgba(58,31,8,1) 1px, transparent 1px)`, opacity 0.06, taille 28px) + grain fin (SVG `feTurbulence`, opacity 0.035, mix-blend-multiply).
- **Dashboard kanban** : colonnes en `rgba(255,255,255,0.4)` avec `border-radius: 32px` et bordure blanche translucide.
- **Pas de full-bleed photo** ; les photos de cabinets sont utilisées dans les cartes (h-28, rounded-xl, object-cover).
- **Aucune illustration hand-drawn** ; visuel très UI-driven, composé de cartes + éléments typographiques.

### Animations

- Apparition des cartes : `card-fade-up` — 0.4s ease-out, translateY(24px → 0), stagger 60ms.
- Hero fade-in : 0.7s `cubic-bezier(0.16, 1, 0.3, 1)`, opacity 0→1 + translateY(28px→0).
- Hover cartes : `scale(1.05)` sur l'image intérieure, `duration-300`.
- Pulse : dot live 2s infinite alternant opacity 1 / 0.4.
- Spring : `cubic-bezier(0.34, 1.56, 0.64, 1)` pour micro-interactions.
- **Respect `prefers-reduced-motion: reduce`** — animations désactivées.

### Hover / press states

- **Boutons primaires** : `background: jim-primary → jim-accent`, `shadow: 0 6px 22px rgba(232,132,74,0.40)`, léger `translateY(-1px)`.
- **Cartes** : `hover:shadow-md`, l'image intérieure scale légèrement.
- **Press (mobile)** : `active:opacity-80` ou `active:scale-[0.98]` (jamais le deux).
- **Focus** : `focus-visible:ring-4 ring-jim-primary/40` ou `/50`.

### Borders, shadows, radii

- Bordures : `1px solid var(--jim-beige-mid)` (#edd9c4). Jamais de gris froid.
- **Shadows warm-tinted** — toujours `rgba(58,31,8,X)`, jamais `rgba(0,0,0,X)`. L'échelle (`--jim-shadow-sm/md/lg/xl/hover`) est dans `colors_and_type.css`.
- **Rayons** : `8 / 16 / 24 / 36` px (`--jim-radius-sm/DEFAULT/lg/xl`). Les cartes de produit utilisent `24px`, le search bar et les cartes hero utilisent `28-36px`, les pills utilisent `9999px`.

### Transparence & blur

- **Navbar / footer** : `bg-white/80 backdrop-blur-md` (glass morphism discret).
- **Badges sur images** : `bg-white/90 backdrop-blur-sm` pour le badge RPPS.
- **Overlays** : gradient vertical `from-jim-background via-jim-background/95 to-transparent` pour fondre une CTA sticky dans le contenu.

### Layout rules

- Container : `max-w-[1600px] mx-auto` (codebase) ou `max-w-[1320px]` (hero marketing).
- Padding horizontal : `px-4 md:px-10`.
- **Breakpoints** : `xs 375 / sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. Adaptive multi-breakpoint, **pas** mobile-first.
- Dashboard landing en `h-screen overflow-hidden` sur lg+, vertical empilé scroll normal en dessous.
- Hit targets : `min-h-[44px]`.

### Grain & texture

Une **seule texture récurrente** : le grain SVG noise utilisé dans le hero (opacity 0.035, mix-blend-multiply). Rien d'autre. Pas de pattern répété, pas de dégradé diagonal clinquant.

---

## Iconography

### Sources

- **Lucide React** (`lucide-react`, v0.400+) — **icône system principal**. Stroke 1.5 à 2.5 selon le contexte. Exemples rencontrés : `Search, MapPin, Calendar, Stethoscope, ArrowUpRight, Zap, CheckCircle, Loader2, X, SearchX`.
- **Material Symbols Outlined** (Google Fonts) — utilisé dans la messagerie web via `.material-symbols-outlined` class avec `font-variation-settings: 'FILL' 0, 'wght' 300`.
- **Aucun icon font custom** ni sprite SVG personnalisé.
- **Emoji** : utilisés en décoration très ponctuelle dans les landing (⚡ 📍 ✨ 👋 pour les états vides). Pas dans l'UI produit.

### Règles d'usage

- Stroke weight Lucide : **1.75** pour les icônes décoratives de form (search bar), **2.5** pour les icônes dans les CTA (bouton Rechercher → flèche).
- Taille : `14-18px` dans le texte, `20-24px` dans les cartes, `32px+` pour les empty states.
- Couleur : héritée via `text-jim-primary`, `text-jim-muted`, `text-jim-text`. Jamais de couleur en dur.
- Les badges `Urgent` utilisent `Zap`, les badges `RPPS` utilisent `CheckCircle` (vert), les recherches utilisent `Search`, les localisations `MapPin`, les calendriers `Calendar`, les spécialités `Stethoscope`.

Le design system recommande donc : **lucide-react via CDN** pour les mocks HTML, ou `npm install lucide-react` pour les apps React.

---

## Index

```
├── README.md                   ← vous êtes ici
├── SKILL.md                    ← manifest Agent Skills
├── colors_and_type.css         ← tokens CSS (import dans tout artefact HTML)
├── assets/
│   └── logo-square.png         ← logo "jim" corail, fond beige, 1:1
├── preview/                    ← cards du Design System tab (mini-démos)
│   ├── type-scale.html
│   ├── type-italic-accent.html
│   ├── colors-primary.html
│   ├── colors-surfaces.html
│   ├── colors-semantic.html
│   ├── shadows-radii.html
│   ├── spacing.html
│   ├── buttons.html
│   ├── badges.html
│   ├── listing-card.html
│   ├── search-bar.html
│   └── logo.html
└── ui_kits/
    ├── web/                    ← recréation Next.js landing (Kanban Dashboard)
    │   ├── index.html
    │   └── components/*.jsx
    └── mobile/                 ← recréation Expo (écran home + card + tab bar)
        ├── index.html
        └── components/*.jsx
```

### Autres fichiers utiles dans le codebase source (à consulter si besoin)

- `jim-app/CLAUDE.md` — règles d'architecture, sécurité RLS, UX rules
- `jim-app/frontend/packages/ui/src/badge.tsx` — source unique des badges (variants : solid/soft/outline, tones : primary/success/warning/destructive/neutral/accent)
- `jim-app/frontend/apps/web/src/components/landing/*` — composants landing (home-grid, listing-card, hero-section, categories-nav, …)

---

## ⚠️ Caveats

- **Aucun export SVG du logo** n'a été trouvé dans le codebase — seul un PNG carré (upload) est disponible. Les mentions `jim-logo-icon.png` / `jim-logo-horizontal.png` dans `docs/design-tokens.css` pointent vers des fichiers non présents dans le monorepo. Un **SVG** serait nécessaire pour un usage propre ; il faudrait l'exporter depuis le Figma source (non fourni).
- **Les fonts (Manrope, Fraunces) ne sont pas copiées localement** — le CSS les charge depuis Google Fonts (comportement identique au codebase via `next/font/google`). Si besoin offline, télécharger les `.woff2` et les placer dans `fonts/`.
- **Aucune illustration / motion graphic / mascotte** dans le codebase — la marque est strictement typographique + colorique + compositionnelle. Si le design a besoin d'illustrations, il faudra les commander (aucune ressource héritée).
- **Le kit mobile est partiel** : seul le frame + 2-3 composants clés sont recréés (pas l'intégralité des 31 composants de `@jim/ui`). Les composants natifs (NativeWind) sont transposés en HTML/Tailwind dans le kit.
