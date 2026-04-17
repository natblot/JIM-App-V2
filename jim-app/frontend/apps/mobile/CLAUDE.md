# CLAUDE.md — JIM Mobile (Expo SDK 54)

> Regles specifiques au frontend mobile. Les regles globales sont dans `jim-app/CLAUDE.md`.

## Stack

- Expo SDK 54.x + Expo Router (file-based routing)
- React Native + NativeWind 4.2.x (Tailwind CSS 3.4.17)
- react-native-reanimated ^3.19.5 (PAS v4 — incompatible Expo 54)
- react-native-mmkv 3.x (stockage local)
- react-hook-form 7.x + Zod validation
- expo-secure-store (tokens auth)
- expo-print (generation PDF contrat HTML→PDF)

## Structure ecrans

```
app/
├── (app)/          # Ecrans authentifies
│   ├── annonce/         # Detail annonce
│   ├── calendrier/      # Calendrier disponibilites
│   ├── contrats/        # Contrats IA
│   ├── conversations/   # Messagerie
│   ├── notation/        # Notation post-remplacement
│   ├── paiements/       # Versement retrocession
│   ├── parametres/      # Settings (paiement, parrainage, rgpd, support)
│   ├── propositions/    # Propositions directes
│   └── profil-contact/  # Profil contact
└── (auth)/         # Ecrans non-authentifies
```

## Conventions

- Hooks depuis `@jim/shared` — tous les hooks sont consommables cote mobile
- Certains hooks mobile-specifiques dans `apps/mobile/hooks/` (ex: `useConversations.ts` mocke)
- Composants UI depuis `@jim/ui` (NativeWind v4 + Reanimated + Gesture Handler)
- Stores Zustand : `useAuthStore`, `useUIStore`, `useOfflineStore`
- Offline : `OfflineStore` FIFO 1000 annonces, `pendingActions` queue
- Realtime : Supabase Postgres Changes par conversation

## Contraintes specifiques

- `react-native-maps` NON installe — necessite EAS Build (incompatible Expo Go). MapPlaceholder en attendant.
- Zones de tap minimum 44x44 points
- Taille app < 50 MB, cold start < 3s
- Firebase : `google-services.json` (Android) + `GoogleService-Info.plist` (iOS), projet `jim-app-f807f`
- FCM : notifications push via `_shared/fcm.adapter.ts` (HTTP v1). Token FCM statique en MVP (Phase 2 : OAuth2 service account)
