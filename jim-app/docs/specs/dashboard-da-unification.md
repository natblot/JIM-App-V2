# SPEC — Unification DA dashboard + fix navbar /paiement

> Pipeline jim-dev · Agent 1 (Architecte) · 2026-06-11
> Source design : `jim-design-system-template 2/` (SKILL.md + README.md + menu-app variante A)
> Checkpoint humain : auto-approuvé (session autonome — demande explicite de l'utilisateur avec captures)

## Problèmes constatés (captures du 2026-06-11)

1. **`/dashboard` hors direction artistique** : sidebar générique, accents bleus (`bg-blue-50`),
   gris froids (`text-gray-500`, `border-gray-100`), blanc pur — tous interdits par le template
   (« Never bluish », « Never pure white or cold grey », shadows chaudes obligatoires).
   Le shell retenu par le template est la **variante A : navbar flottante glass + dropdown avatar**,
   déjà implémentée sur `/paiement`.
2. **`/paiement` : logo JIM en taille native (697×356)** et CTA « Publier » cassé.
   **Cause racine** : styled-jsx n'ajoute la classe de scope `jsx-*` qu'aux éléments HTML natifs.
   `.brand` et `.publish-cta` sont des `className` posés sur des composants `<Link>` → les règles
   `.brand :global(img) { height: 26px }` et `.publish-cta { … }` compilent en
   `.brand.jsx-X img` / `.publish-cta.jsx-X` qui ne matchent jamais le DOM rendu.
3. **Parcours incohérent** : sidebar sur /dashboard → navbar flottante sur /paiement.

## User story

En tant qu'utilisateur connecté (titulaire ou remplaçant), je veux un shell applicatif unique
fidèle à la DA JIM (navbar flottante glass, papier chaud, corail) sur /dashboard et /paiement,
afin que le parcours soit cohérent et conforme au design system.

## Plan

### 1. Composant partagé `components/app-shell/app-navbar.tsx` (nouveau)
- Navbar flottante glass (port du header de /paiement) : logo (26 px), pills de navigation
  configurables (`href` ou `onClick` + `active`), CTA « Publier une annonce » (titulaire
  uniquement), search-bar visuelle, dropdown profil.
- **Données réelles** : `useAuthContext` + `useCurrentProfile` → initiales, nom, rôle, ville
  (remplace les valeurs codées en dur « NB / Nicolas B. »). Badge messages factice supprimé.
- **Fix styled-jsx** : tous les sélecteurs ciblant un composant React passent par un parent
  natif scopé : `.header :global(.brand)`, `.header :global(.brand img)`,
  `.header-right :global(.publish-cta…)`. Les éléments natifs gardent le scoping standard.

### 2. `paiement/page.tsx`
- Remplace le header embarqué + ~500 lignes de CSS navbar par `<AppNavbar/>`.
- Liens : Tableau de bord → /dashboard, Candidatures/Contrats → /dashboard?tab=…,
  Paiements → /paiement (actif).
- Le reste de la page (split solde/factures) inchangé.

### 3. `dashboard-layout.tsx`
- Supprime `Sidebar` + ancien header sticky → `<AppNavbar/>` avec les onglets en pills
  (overview/annonces/candidatures/contrats pilotés par `?tab=`, Paiements → /paiement).
- Backdrop DA : fond `#fdf6ed`, radial corail + dot-grid (port de /paiement).
- Fil d'ariane pill « Tableau de bord / … » au-dessus du contenu.
- Bottom-nav mobile conservée, bordures/ombres réchauffées.
- `sidebar.tsx` supprimé (seul usage : dashboard-layout).

### 4. `overview.tsx` — passe DA (classes uniquement, zéro logique)
- Accents bleus → palette chaude (corail `#ff7c5c`/pale `#fff0ea`, warning `#b07824`/`#fbf0dc`).
- Gris froids → bruns chauds (`#3a1f08` texte, `#7a5434` muted, `#edd9c4` bordures).
- Cards : radius 20, ombres chaudes `rgba(58,31,8,…)`.
- Titre « Bonjour, {prénom} » → style éditorial template (em corail).

### 5. `web/CLAUDE.md` — section « Dashboard — Design retenu » mise à jour.

### 6. Extension (demande utilisateur 2026-06-11) — navbar sur toutes les pages (app)
- Nouveau wrapper `components/app-shell/app-page.tsx` : AppNavbar + fond papier chaud +
  dot-grid + helper `buildAppNavLinks(activeId)`.
- Applique à `/messages` (container max-w-1400 autour de MessagesView), `/publier`,
  `/contrat/[id]` (pill Contrats active), `/paiement/succes` et `/paiement/annule`
  (cards Stripe réchauffées : bordures beige, vert/ambre chauds).
- Les pages (marketing) gardent leur header propre (déjà conforme — meme famille visuelle).

## Hors périmètre (itérations suivantes)
- Restyle interne de candidatures.tsx, contracts-list.tsx, my-listings.tsx, publier-form.tsx
  (ils héritent du shell chaud ; leurs cards restent à harmoniser).
- Câblage data manquant (badge messages réel, search-bar fonctionnelle).
- Migration des hex vers les tokens Tailwind (précédent accepté dans paiement-page.md).

## Critères d'acceptation
- [ ] `/paiement` : logo 26 px de haut, CTA Publier rond 44 px avec expansion au hover.
- [ ] `/dashboard` : navbar flottante glass identique à /paiement, plus de sidebar,
      fond papier chaud + dot-grid, aucun accent bleu/gris froid sur l'overview.
- [ ] Navigation par onglets (?tab=) toujours fonctionnelle (deep links inclus).
- [ ] Dropdown profil affiche les vraies données utilisateur.
- [ ] `npx tsc --noEmit` propre ; lint propre sur les fichiers touchés.
- [ ] Aucune occurrence du mot « commission » dans l'UI.

## Risques
- Régression navigation onglets (état ?tab=) → QA obligatoire sur deep links.
- styled-jsx scoping : tout className sur un composant React doit passer par `:global()`
  depuis un parent natif — règle à respecter dans AppNavbar.
- RGPD : le dropdown affiche nom/rôle/ville de l'utilisateur courant uniquement (déjà le cas
  dans la sidebar supprimée) — pas de nouvelle exposition de données.

## Changements de schéma Supabase
Aucun.
