# JIM Mobile UI Kit

Recréation Expo + NativeWind des 3 écrans pivots du monorepo (`jim-app/frontend/apps/mobile`).

## Écrans

| Écran | Fichier source | Rôle |
|---|---|---|
| **Welcome** | `app/(auth)/welcome.tsx` | Fond beige `#fdf6ed` + logo jim officiel. Entrée auth. |
| **Dashboard titulaire** | `app/(app)/index.tsx` | Stats + candidatures reçues + Mes annonces + FAB publier |
| **Recherche** | `app/(app)/recherche.tsx` | Vue remplaçant — search, pills catégories, cards annonces |

## Fichiers
- `index.html` — canvas 3 iPhones côte à côte
- `screens.jsx` — composants React (Welcome, Dashboard, Recherche, TabBar, Card, Pill, Ico)
- `ios-frame.jsx` — device bezel iOS 26

## Notes
- Composants simplifiés / cosmétiques, pas de vraie logique (tanstack-query, expo-router, supabase supprimés)
- TabBar inclut badge messages (3)
- Icônes SVG inline custom (stroke 1.75) — peut être remplacé par Lucide au besoin
- Couleurs alignées sur `colors_and_type.css` → source `@jim/ui` (`packages/ui/src/tailwind-preset.ts`)

## Écrans non couverts
Chat (`messages.tsx`), candidater, propositions, paiements, RPPS verify, Publier annonce (multi-step form), Calendrier, Settings. À ajouter dans une v2.
