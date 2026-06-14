# Spec — Navbar unifiée + Mission Detail V2

Date : 2026-06-11 · Source design : `jim-design-system-template 2/project/ui_kits/web/mission-detail-v2.html`

## 1. Navbar unifiée (toutes les pages = navbar de la page d'accueil)

**Constat** : deux navbars coexistent — `components/layout/header.tsx` (landing : logo + pill « Missions » + CTA Publier + search sombre + avatar) et `components/app-shell/app-navbar.tsx` (pages app : 4 pills Tableau de bord/Candidatures/Contrats/Paiements + ring bleu permanent sur la search bar, interdit par la DA).

**Décision** : le `Header` de la landing devient l'unique navbar (conforme au TopBar du template design : nav = « Missions » seul, le reste vit dans le dropdown profil).

Changements :
- `app-shell/app-page.tsx` : rend `Header` au lieu d'`AppNavbar` ; suppression de `buildAppNavLinks` et de la prop `activeId`.
- `dashboard/dashboard-layout.tsx` : `Header` + rangée de pills d'onglets **dans la page** (desktop) pour conserver la navigation Tableau de bord / Annonces / Candidatures / Contrats / Paiements. Bottom bar mobile inchangée.
- `paiement/page.tsx` : `Header` au lieu d'`AppNavbar` (+ PAIEMENT_NAV supprimé).
- `layout/header.tsx` : correction des liens du dropdown — Paiements → `/paiement` (au lieu de `?tab=paiements`, onglet supprimé), Paramètres → `/dashboard?tab=profil` (l'onglet valide est `profil`, pas `parametres`).
- `app-shell/app-navbar.tsx` : **supprimé** (le ring bleu disparaît avec).

## 2. Dashboard DA

La migration DA (navbar glass, papier chaud, dot-grid, palette corail) est déjà dans l'arbre de travail (`dashboard-layout.tsx`, `overview.tsx`, sidebar supprimée). Aucune couleur froide détectée dans `overview.tsx`. La capture d'écran fournie datait de l'ancienne version.

## 3. Mission Detail V2 → `/contrat/[id]`

Le design « Détail mission · dashboard V2 » est implémenté sur la page contrat (seule entité réelle correspondante) :

- **dash-head** : crumb `Mission › Contrat #REF`, titre `Remplacement libéral · N jours`, sous-titre (adresse cabinet · avec [autre partie] · rétro X %), datechip (date de début, J-x), pill statut (brouillon/en_attente → warning, confirmé → success).
- **Hero stats** (4 cartes dégradés chauds, données réelles) : Durée (ticks animés), Rétrocession (% + part conservée), Signatures (n/2 + avatars des parties), Étape du dossier (n/6 + segments).
- **Parcours band** : timeline 6 étapes (Candidature → Négociation → Signature → Mission → Paiement → Avis), état dérivé du statut + dates.
- **Grille V2** : 3 mini-cartes — Contrat (overlay), Transmissions (overlay), Messagerie (lien `/messages`).
- **Overlay détail** (fixed, blur, Échap pour fermer, segmented switch) :
  - *Contrat* : papier (préambule parties RPPS, ContractClauses, zone signatures) + rail latéral (termes clés, parcours signature 4 étapes, SignButton, erreurs mutations, avertissement réglementaire, bouton PDF).
  - *Transmissions* : hero cabinet (carte placeholder + adresse) + empty state « disponible à l'approche de la mission » (aucune donnée transmissions en base).
- Logique conservée de `contract-detail.tsx` : query Supabase, mutations confirm/clauses, garde d'accès, génération PDF. `contract-detail.tsx` supprimé ensuite.
- `contract-clauses.tsx` et `sign-button.tsx` : recoloration tokens chauds (gray → beige/brun DA), logique inchangée.

Hors scope (pas de données) : net estimé €, patients, équipe, chat IA, notes vocales.
