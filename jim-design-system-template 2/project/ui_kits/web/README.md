# JIM Web UI Kit

Recréation HTML pixel-proche du **logged-in landing dashboard** Next.js (`frontend/apps/web/src/app/(marketing)/page.tsx` + `components/landing/*` + `components/layout/header.tsx`).

## Fichiers
- `index.html` — landing complète (header + pills + search row + sidebar + Kanban 3 colonnes)
- `logo-square.png` — copie du logo JIM

## Composants couverts
- **Header** : logo jim · pill "Tableau de bord" · icône chat avec dot notif · menu (burger + avatar "NB")
- **Category pills** : Toutes / Remplacement / Assistanat / Collaboration / Cession / Urgentes
- **Search row** : input rond "Rechercher une mission, une ville…" avec bouton submit coral circulaire + bouton "Publier une annonce" coral
- **Sidebar preferences** :
  - Carte "PREFERENCES" : Missions à proximité (icône pin coral) · toggle "Prix total" coral
  - Carte "FILTRAGE AVANCE" : Honoraires minimum · Logement inclus · bouton "Tous les filtres"
- **Kanban 3 colonnes** :
  - Urgentes (empty state — lightning warm)
  - Près de moi (empty state — map pin coral)
  - Nouveau (listing card avec image, RPPS badge, retro%, tags)
- **Floating "Carte" pill** (bottom-right, marine foncé)

## Dépendances
- `colors_and_type.css` (tokens CSS — import relatif)
- `lucide@latest` (CDN) — icônes

## Écrans non recréés (à ajouter si besoin)
Dashboard connecté (overview, my-listings, contracts-list, payments-list) · Messagerie 4-panneaux · Calculateur rétrocession · Carte Mapbox · Auth (sign-in/up + RPPS gate) · Admin · Publier annonce wizard.

