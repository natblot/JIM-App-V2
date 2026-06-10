---
name: jim-design
description: Use this skill to generate well-branded interfaces and assets for JIM (Job In Med) — the French-first marketplace connecting titulaire and remplaçant kinésithérapeutes. Works for production code (Next.js web, Expo mobile) OR throwaway prototypes, mocks, slides, and marketing artifacts. Contains tokens, fonts, logo, UI kits (web + mobile), and the brand voice guide.
user-invocable: true
---

# JIM — Design skill

Read `README.md` first — it contains the full product context, content fundamentals (tone, casing, voice examples), visual foundations, and iconography guide.

## Files in this skill

- `README.md` — product context, copy voice, visual foundations, iconography, index
- `colors_and_type.css` — all design tokens as CSS custom properties (`--jim-*`). Import into any HTML.
- `fonts/` — webfonts (Manrope variable, Fraunces variable — currently loaded via Google Fonts CDN)
- `assets/logo-square.png` — primary "jim" wordmark on beige (use this everywhere — it IS the logo)
- `preview/*.html` — 12 small design-system cards (type, colors, spacing, components, brand)
- `ui_kits/web/` — Next.js-style landing recreation (hero + Kanban). Entry: `index.html`
- `ui_kits/mobile/` — Expo mobile recreation (Welcome + Dashboard titulaire + Recherche). Entry: `index.html`

## How to use this skill

**When creating visual artifacts** (slides, mocks, throwaway prototypes, landing pages):
1. Copy `colors_and_type.css` and `assets/logo-square.png` into your output folder
2. Reference tokens via `var(--jim-primary)`, `var(--jim-text)`, etc.
3. Copy patterns from `ui_kits/web/index.html` or `ui_kits/mobile/screens.jsx` as starting points
4. Write copy in French by default — use "vous" formal, no emoji, no jargon. See README § Content Fundamentals.

**When working on production code** (the real `jim-app` monorepo):
- Tokens live in `frontend/packages/ui/src/tailwind-preset.ts` and `frontend/apps/*/global.css`
- Use Tailwind classes `bg-jim-background`, `text-jim-primary`, etc. — NOT raw hex
- Web = Next.js 16 + Tailwind, Mobile = Expo + NativeWind
- Icons = `lucide-react` (web) / `lucide-react-native` (mobile), stroke width 1.75
- Every component lives in `@jim/ui` shared package if it's cross-platform

## Non-negotiables

- **Primary color is `#ff7c5c` (corail)** — used for CTAs, logo, accents. Never bluish-purple gradients.
- **Backgrounds are warm**: `#fdf6ed` base, `#fbf0e8` surface. Never pure white or cold grey.
- **Type**: Manrope 800 for display (hero, titles), Manrope 500-600 for body. Fraunces italic 400 ONLY for single-word pivots in hero H1s (e.g. *"ne s'arrête"*). Never use Fraunces for body.
- **Letter-spacing**: `-0.04em` on big display type. Never positive tracking on headings.
- **Corners**: 12/14 for buttons, 18-24 for cards, 28-32 for containers. Never sharp corners.
- **Shadows**: warm-tinted (`rgba(58,31,8, ...)`), never pure black.
- **Copy voice**: French formal "vous", direct, benefit-first, zero buzzwords. Pride in "vérifié RPPS" and "0 % commission".

## If the user invokes this skill without a clear brief

Ask first: *"Tu veux que je construise quoi — une page marketing, un écran d'app, un deck, une maquette d'une feature en particulier ? Et plutôt côté web (titulaire/remplaçant) ou mobile ?"* Then ask 3-4 follow-up questions (audience, surface, variations), then build.
