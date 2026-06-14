# SPEC — Page Paiements `/paiement`

> Pipeline jim-dev · Agent 1 (Architecte) · 2026-06-11
> Source design : `jim-design-system-template 2/project/ui_kits/web/paiements-split.html` (handoff Claude Design)

## User story

En tant que kiné remplaçant, je veux une page Paiements dédiée qui regroupe mon solde
disponible, le séquestre en cours, le total reçu sur l'année et l'historique de mes
factures, afin de suivre mes rétrocessions au même endroit et retirer mes fonds.

## Décisions de cadrage (checkpoint humain — 2026-06-11)

| Question | Décision retenue |
|----------|------------------|
| Intégration | **Route autonome `/paiement`** (navbar flottante du design) **+ redirection de l'onglet dashboard `paiements`** vers cette page. |
| Source de données (v1) | **UI statique pixel-perfect** avec contenu de démo. Pas de câblage Supabase dans cette itération. |
| Solde / Retrait / Séquestre | **Conserver toute l'interface** (bloc Disponible + bouton Retirer + carte séquestre + stat annuelle). Le **backend sera adapté ensuite** pour alimenter ces blocs. |

## Périmètre de cette itération (v1 — UI statique)

### Livré
- Nouvelle route `app/(app)/paiement/page.tsx` (client component), protégée par `AuthGuard` via `(app)/layout.tsx`.
- Port fidèle du design : navbar glass flottante (logo, nav Missions, CTA Publier animé, search-bar visuelle, dropdown profil), split 2 colonnes, animations d'entrée, dot-grid de fond, container queries responsive.
- Interactions React fonctionnelles : ouverture/fermeture du dropdown profil (clic extérieur + Échap), switch de période (30 j / 2026 / Tout), filtres factures (Toutes / En attente / Reçues) + recherche texte, état vide.
- Styling via `styled-jsx` scoping (port quasi-verbatim du CSS du design), tokens couleur définis sur `.paiement-root`.
- Asset logo `public/jim-mark.png`.
- Redirection de l'onglet dashboard `paiements` :
  - `sidebar.tsx` : lien `Paiements` → `/paiement` (plus de tab interne).
  - `dashboard-layout.tsx` : `paiements` retiré du type `DashboardTab`, de `MOBILE_TABS`, `VALID_TABS` et du switch `DashboardContent` ; lien `/paiement` ajouté à la bottom-nav mobile.

### Hors périmètre (itérations suivantes)
- Câblage data Supabase (`useMesPaiements` → liste Factures, dérivation des totaux, mapping statuts réels `confirme/en_attente_validation/conteste/...` → `Reçue/En attente/Séquestre`).
- Backend solde **Disponible** + **Retrait** (payout Stripe Connect) + **Séquestre** : champs/RPC à concevoir (aucun solde ni payout n'existe aujourd'hui côté backend).
- Téléchargement PDF de facture, export, search-bar fonctionnelle (popovers loc/dates).
- Le composant `payments-list.tsx` reste en place (réutilisable pour le futur câblage) mais n'est plus monté dans le shell dashboard.

## Critères d'acceptation (v1)

- [x] `/paiement` rend la page fidèlement au design (desktop) et bascule en colonne unique sous 720px (container query).
- [x] L'onglet/lien `Paiements` (sidebar desktop + nav mobile) mène à `/paiement` et non plus à un tab interne.
- [x] Filtres + recherche + switch période fonctionnent ; l'état vide s'affiche quand aucun résultat.
- [x] `tsc --noEmit` ne remonte **aucune** erreur sur les fichiers touchés (`paiement/page.tsx`, `dashboard-layout.tsx`, `sidebar.tsx`).
- [x] Aucune occurrence du mot « commission » dans l'UI (règle CLAUDE.md).
- [ ] (Backend, prochaine itération) Les blocs solde/séquestre/année et la liste sont alimentés par des données réelles.

## Risques / points d'attention

- **RGPD / financier** : v1 sans donnée réelle → aucun risque d'exposition. Le câblage futur devra respecter RLS (`paiements` filtrés par utilisateur), montants en centimes, et la dérivation solde/séquestre devra s'appuyer sur une source backend fiable (pas un calcul client trompeur sur de l'argent).
- **Retrait (payout)** : fonctionnalité backend inexistante. Le bouton « Retirer » est présent visuellement mais devra être branché (ou désactivé explicitement) lors de l'ajout du backend, pour ne pas laisser croire à une action disponible.
- **Couleurs en dur** : la page reprend les valeurs hex du design (cohérent avec les composants dashboard existants qui codent déjà `#ff7c5c` en dur). À harmoniser avec les tokens si une refonte tokens web est menée.

## Changements de schéma DataConnect / Supabase

Aucun dans cette itération (UI statique). Le backend solde/retrait/séquestre fera l'objet d'une spec dédiée.
