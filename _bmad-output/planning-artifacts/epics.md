---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - 'prd.md'
  - 'architecture.md'
  - 'ux-design-specification.md'
  - 'brainstorming-session-2026-02-22.md'
  - 'product-brief-nathanblottiaux-2026-02-24.md'
---

# nathanblottiaux - Epic Breakdown

## Overview

Ce document fournit le découpage complet en epics et stories pour JIM (Job In Med), décomposant les exigences du PRD, de la spec UX Design, de l'Architecture, du Brainstorming et du Product Brief en stories implémentables.

## Requirements Inventory

### Functional Requirements

**70 FRs organisés en 8 aires de capacité :**

**Gestion des Utilisateurs & Identité (12 FRs)**
- FR1 : Le professionnel de santé peut créer un compte avec son email et un mot de passe
- FR2 : Le professionnel de santé peut s'authentifier via un magic link envoyé par email
- FR3 : Le professionnel de santé peut faire vérifier automatiquement son identité via son numéro RPPS
- FR4 : Le professionnel de santé peut rechercher son RPPS par nom, prénom et ville dans l'Annuaire Santé
- FR5 : Le professionnel de santé dont le RPPS n'est pas encore enregistré peut obtenir un profil en lecture seule avec re-vérification automatique
- FR6 : Le professionnel de santé peut gérer son profil (spécialités, zone de mobilité, photo)
- FR7 : Le professionnel de santé peut déconnecter tous ses appareils depuis les paramètres
- FR8 : Le professionnel de santé peut exporter toutes ses données personnelles (droit d'accès RGPD)
- FR9 : Le professionnel de santé peut demander la suppression de son compte (droit à l'oubli RGPD)
- FR10 : Le système peut bloquer un compte en cas de tentative d'usurpation d'identité (RPPS ne correspondant pas au nom)
- FR60 : Le système peut détecter les comptes en double (même RPPS, emails différents) et bloquer le second avec proposition de récupération
- FR63 : Le professionnel de santé peut changer de rôle (remplaçant vers titulaire ou inversement)

**Annonces & Publication (12 FRs)**
- FR11 : Le titulaire peut publier une annonce de remplacement depuis l'app mobile
- FR12 : Le titulaire peut voir un indicateur de rétrocession moyenne dans sa zone lors de la publication
- FR13 : Le titulaire peut modifier ou fermer manuellement son annonce
- FR14 : Le titulaire peut republier une annonce passée avec les informations pré-remplies
- FR15 : Le système peut agréger les annonces de sources externes et les afficher avec un badge "Source externe"
- FR16 : Le système peut dédupliquer les annonces agrégées par correspondance stricte (même titulaire + mêmes dates + même ville)
- FR17 : Le système peut mettre à jour le statut des annonces en temps réel (Active, En cours, Non confirmée, Source externe, Pourvue, Expirée)
- FR18 : Le système peut fermer automatiquement une annonce quand le remplacement est pourvu
- FR19 : Le système peut archiver les annonces sans réponse après relance (cycle J-7, J-3, J0)
- FR20 : Le système peut fusionner automatiquement une annonce native avec son doublon agrégé quand détecté
- FR59 : Le titulaire peut marquer une annonce comme urgente avec notification prioritaire aux remplaçants disponibles dans la zone
- FR61 : Le système peut re-vérifier les annonces agrégées à chaque scan et les marquer "Expirée" si l'originale a disparu

**Recherche & Découverte (6 FRs)**
- FR21 : Le remplaçant peut rechercher des annonces sur une carte interactive
- FR22 : Le remplaçant peut filtrer les annonces par distance, dates et rétrocession
- FR23 : Le remplaçant peut consulter le détail d'une annonce (dates, lieu, rétrocession, profil titulaire)
- FR24 : Le remplaçant peut voir le statut en temps réel de chaque annonce
- FR25 : Le remplaçant peut consulter les annonces déjà chargées sans connexion internet (cache local)
- FR26 : Le remplaçant peut être redirigé vers l'annonce originale pour les annonces de source externe

**Candidatures & Matching (10 FRs)**
- FR27 : Le remplaçant peut candidater à une annonce en un clic
- FR28 : Le remplaçant peut voir un avertissement si l'annonce demande une spécialité absente de son profil ou un lieu hors zone
- FR29 : Le remplaçant peut suivre le statut de ses candidatures en temps réel (En attente, Acceptée, Refusée, Expirée)
- FR30 : Le remplaçant peut candidater hors connexion avec envoi automatique au retour en ligne
- FR31 : Le titulaire peut consulter les candidatures reçues avec le profil vérifié de chaque candidat
- FR32 : Le titulaire peut accepter ou refuser une candidature
- FR33 : Le titulaire peut refuser toutes les candidatures restantes en un clic après acceptation
- FR34 : Le système peut notifier automatiquement les candidats non retenus après 48h sans action post-acceptation
- FR62 : Le système peut proposer automatiquement des annonces alternatives au remplaçant si son remplacement est annulé par le titulaire
- FR64 : Le remplaçant peut retirer sa candidature tant qu'elle n'a pas été acceptée par le titulaire
- FR65 : Le titulaire peut proposer un remplacement directement à un remplaçant de son carnet de favoris sans publier d'annonce publique

**Communication (4 FRs)**
- FR35 : Le titulaire et le remplaçant peuvent échanger par messagerie texte après acceptation de candidature
- FR36 : Le professionnel de santé peut envoyer un message hors connexion avec envoi automatique au retour en ligne
- FR37 : Le système peut masquer les coordonnées personnelles (email, téléphone) jusqu'à l'acceptation de candidature
- FR38 : Le système peut afficher un avertissement sur les liens externes dans la messagerie (anti-phishing)

**Contrats & Documents (4 FRs)**
- FR39 : Le titulaire et le remplaçant peuvent générer un contrat de remplacement pré-rempli par IA à partir des informations de l'annonce et des profils
- FR40 : Le professionnel de santé peut consulter et télécharger le contrat généré
- FR41 : Le système peut verrouiller les clauses obligatoires du contrat tout en permettant l'édition des clauses optionnelles
- FR42 : Le système peut afficher un disclaimer sur chaque contrat généré ("ne constitue pas un conseil juridique")

**Notifications, Engagement & Réputation (14 FRs)**
- FR43 : Le remplaçant peut recevoir une notification push quand une nouvelle annonce correspond à ses critères
- FR44 : Le titulaire peut recevoir une notification push quand il reçoit une candidature
- FR45 : Le remplaçant peut recevoir une notification push quand sa candidature est acceptée
- FR46 : Le professionnel de santé peut recevoir une notification email en fallback si les push sont désactivés
- FR47 : Le système peut envoyer des relances automatiques (candidature sans réponse J+2/J+5/J+7, annonce J-7, notation post-remplacement J+1)
- FR48 : Le remplaçant peut gérer son calendrier de disponibilités
- FR49 : Le professionnel de santé peut parrainer un confrère via un code unique partagé par SMS, email ou lien. La récompense est déclenchée quand le filleul complète sa première action (candidature ou publication)
- FR50 : Le professionnel de santé parrainé peut recevoir un badge "Ambassadeur JIM" sur son profil
- FR57 : Le titulaire et le remplaçant peuvent noter mutuellement l'autre après un remplacement terminé
- FR58 : Le titulaire peut sauvegarder un remplaçant dans son carnet de favoris pour le recontacter directement
- FR66 : Le professionnel de santé peut consulter les avis et notes reçus par un autre professionnel

**Administration & Opérations (8 FRs)**
- FR51 : Le système peut exécuter l'agrégation des annonces externes de manière automatisée et périodique
- FR52 : Le système peut monitorer chaque source d'agrégation et alerter l'administrateur si 0 résultats sur un scan
- FR53 : Le système peut détecter les tentatives de création de compte en masse (rate limiting par IP/appareil)
- FR54 : Le système peut détecter les mots-clés sensibles (données de santé) dans les champs texte libre et suggérer une reformulation
- FR55 : L'administrateur peut consulter un dashboard opérationnel (annonces agrégées, doublons, inscriptions, alertes)
- FR56 : Le système peut générer des logs d'audit (connexions, publications, candidatures, modifications de profil)
- FR67 : Le professionnel de santé peut signaler un contenu inapproprié ou un comportement abusif d'un autre utilisateur
- FR68 : L'administrateur peut suspendre un compte utilisateur ou masquer un contenu suite à un signalement
- FR69 : Le système peut alerter l'administrateur si une automatisation échoue ou performe anormalement (taux de succès, erreurs, anomalies)
- FR70 : Le professionnel de santé peut contacter le support via un formulaire intégré dans l'application

### Non-Functional Requirements

**45 NFRs répartis en 7 catégories :**

**Performance (9 NFRs)**
- NFR1 : Le chargement de la carte interactive avec les annonces doit se compléter en moins de 1 seconde pour le 95e percentile sous charge normale
- NFR2 : La candidature (du tap à la confirmation) doit se compléter en moins de 500ms pour le 95e percentile
- NFR3 : La vérification RPPS via l'API Annuaire Santé doit se compléter en moins de 3 secondes
- NFR4 : Le cold start de l'app mobile doit être inférieur à 3 secondes
- NFR5 : Le Time to Interactive de l'app mobile doit être inférieur à 4 secondes
- NFR6 : La landing page web doit avoir un LCP (Largest Contentful Paint) inférieur à 2 secondes
- NFR7 : La taille de l'app sur les stores doit être inférieure à 50 MB
- NFR8 : Les notifications push doivent être délivrées en moins de 10 secondes après l'événement déclencheur
- NFR9 : Les mises à jour de statut des annonces doivent se propager en temps réel (< 2 secondes)

**Sécurité (11 NFRs)**
- NFR10 : Toutes les communications doivent être chiffrées en transit via TLS 1.3
- NFR11 : Les données sensibles (messages, coordonnées) doivent être chiffrées au repos en AES-256
- NFR12 : Les tokens d'authentification doivent expirer après 15 minutes (access) et 7 jours (refresh)
- NFR13 : Les tokens mobiles doivent être stockés dans le stockage sécurisé natif du système d'exploitation, jamais dans un stockage non chiffré
- NFR14 : Le système doit être protégé contre les vulnérabilités OWASP Top 10
- NFR15 : Le rate limiting doit limiter la création de compte à 3 tentatives par IP/appareil par jour
- NFR16 : Le rate limiting de recherche doit limiter à 100 requêtes/heure et 500/jour par compte
- NFR17 : Tous les champs texte libre doivent être sanitizés (strip HTML, JavaScript, caractères spéciaux)
- NFR18 : Les notifications push ne doivent contenir aucune donnée personnelle dans le payload (générique uniquement)
- NFR19 : Les logs d'audit doivent être conservés pendant 1 an
- NFR20 : Les logs de debug doivent être conservés pendant 90 jours

**Scalabilité (5 NFRs)**
- NFR21 : L'architecture doit supporter 5x la charge actuelle sans refonte majeure
- NFR22 : Le schéma de base de données doit être multi-professions dès le jour 1 (champ `profession` extensible)
- NFR23 : Le système d'agrégation doit supporter l'ajout de nouvelles sources sans modification du code cœur
- NFR24 : Le système doit supporter au minimum 500 utilisateurs actifs simultanés au MVP
- NFR25 : L'app mobile doit fonctionner correctement avec un cache local de 1000+ annonces

**Fiabilité & Disponibilité (7 NFRs)**
- NFR26 : Le système doit maintenir un uptime de 99,5% (≈ 44h de downtime/an max)
- NFR27 : Le RPO (Recovery Point Objective) doit être de 24h au MVP, 1h post-migration HDS
- NFR28 : Le RTO (Recovery Time Objective) doit être de 4h au MVP, 1h post-migration HDS
- NFR29 : Les backups doivent suivre la règle 3-2-1 (3 copies, 2 supports, 1 hors site)
- NFR30 : En cas de panne de l'API Annuaire Santé, le système doit fonctionner en mode dégradé (navigation autorisée, candidature bloquée)
- NFR31 : En cas de perte de connectivité mobile, les actions en file d'attente doivent se synchroniser automatiquement au retour en ligne sans perte de données
- NFR32 : En cas de source d'agrégation indisponible, les dernières annonces valides doivent rester accessibles via le cache

**Conformité & Vie Privée (6 NFRs)**
- NFR33 : L'infrastructure de base de données doit être hébergée en région EU (eu-west ou eu-central)
- NFR34 : Les données personnelles doivent être exportables en JSON et PDF sous 24h après demande
- NFR35 : La suppression de compte doit être effective sous 30 jours avec anonymisation des avis et conservation Stripe 6 ans
- NFR36 : Les annonces agrégées ne doivent contenir aucune donnée personnelle du titulaire sans son consentement
- NFR37 : Les durées de conservation doivent être respectées : profil = durée du compte, messages = durée du compte, annonces = durée + 1 an (anonymisées), transactions Stripe = 6 ans
- NFR38 : Les transferts de données hors UE via Firebase (FCM) doivent se limiter au payload générique sans données personnelles

**Intégration (4 NFRs)**
- NFR39 : L'intégration API Annuaire Santé doit supporter le retry exponentiel en cas de rate limiting
- NFR40 : Le cache de vérification RPPS doit être valide pendant 6 mois avec re-vérification périodique
- NFR41 : L'agrégation doit s'exécuter automatiquement toutes les 6 heures avec monitoring par source
- NFR42 : Les tests automatisés par source d'agrégation doivent détecter les changements de structure HTML en moins de 24h

**Accessibilité (3 NFRs)**
- NFR43 : L'app doit supporter les tailles de police système (accessibilité native iOS/Android)
- NFR44 : Les contrastes de couleur doivent respecter un ratio minimum de 4.5:1 pour le texte courant
- NFR45 : Les éléments interactifs doivent avoir une zone de tap minimum de 44×44 points (recommandation Apple HIG)

### Additional Requirements

**Exigences techniques issues de l'Architecture :**

- **Starter Template :** Custom monorepo pnpm workspace — `create-expo-app` SDK 54 + `create-next-app` 16.1 + pnpm workspace (pas de starter externe). L'initialisation du projet est une story explicite (Story 0).
- Architecture hexagonale légère : interfaces ("ports") vers Supabase abstraites derrière des adapters remplaçables pour la migration HDS
- Logique métier dans des modules TypeScript portables (dans `supabase/functions/_shared/`), pas dans les Edge Functions handlers
- Edge Functions handlers ≤ 40 lignes — pattern handler → service → response
- Monorepo pnpm workspace : `@jim/mobile`, `@jim/web`, `@jim/shared`, `@jim/ui`
- Validation runtime : Zod 4.3 + RLS combinés. Schémas Zod dans `@jim/shared/validators/`
- Stockage local : react-native-mmkv (remplace AsyncStorage). Dev builds EAS obligatoires
- État serveur : TanStack Query 5 avec query key factory centralisé
- État client : Zustand 5 minimal (auth + UI + offline)
- Formulaires : React Hook Form + Zod resolver
- Listes virtualisées : FlashList (Shopify)
- Images : expo-image
- Hébergement web : Vercel
- Monitoring : Sentry dès jour 1 (mobile + web)
- CI/CD : GitHub Actions + EAS Build + EAS Update (OTA)
- Stockage sécurisé : Hybride expo-secure-store (auth tokens) + MMKV encrypted (cache)
- Pattern API : Hybride lectures directes Supabase + écritures via Edge Functions
- ESLint enforce : `no-restricted-imports` sur `@supabase/supabase-js` dans apps/, `import/no-default-export`
- Naming : snake_case DB, camelCase variables dérivées, kebab-case fichiers, PascalCase composants
- Pas de barrel exports (sauf `@jim/ui`)
- Dates JSON : ISO 8601 UTC
- Messages d'erreur : toujours en français, toujours actionnables
- Format API unique : `{ data: result }` ou `{ error: { code, message } }`
- Registres centralisés : error codes + notification types (string literals interdits)
- Tests : co-locatés, Vitest + React Native Testing Library

**Exigences UX issues de la spec UX Design :**

- NativeWind v4.2+ comme styling foundation (ADR-001)
- Composants custom `@jim/ui` sur NativeWind + Reanimated + Gesture Handler (ADR-002)
- Tokens partagés — source unique `tailwind.config.js` racine (ADR-004)
- Écran d'accueil par rôle : remplaçant = vue liste (défaut) + toggle carte, titulaire = dashboard
- Candidature en 1 tap sans modale de confirmation (candidature rétractable FR64)
- UI optimiste : animation "Envoyé" en 200ms avant confirmation serveur
- Formulaire publication : 3 champs obligatoires (dates + ville autocomplete + rétrocession), infos cabinet héritées du profil
- Contrat IA : résumé visuel in-app (5 points + ✅) → confirmation double → PDF à la demande
- Notifications : 3 toggles simples (Annonces/Candidatures/Messages), max 3 push/jour
- Empty states engageants (message espoir + CTA alerte)
- Annonces agrégées : badge discret (icône), CTA "Voir l'originale" (secondaire) + "Alertes similaires" (primaire)
- Accessibilité : VoiceOver labels, `accessibilityRole`, `prefers-reduced-motion`, contrastes 4.5:1, zones tap 44×44
- Feedback post-publication immédiat : "Visible par X remplaçants dans votre zone"

**Exigences du Brainstorming (stratégies et tactiques d'acquisition/rétention) :**

- Outils gratuits à valeur immédiate sans masse critique : calculateur rétrocession nette (outil viral SEO, 1-2j de dev), générateur contrats IA utilisable sans inscription (le "Doctolib move")
- Stratégie parasite Facebook : commentaires-service sous les annonces FB (5-10/jour, acquisition coût zéro), invitation IA contextuelle avec lien pré-rempli (Plan B agrégation)
- Narratif fondateur "créé PAR un kiné, POUR les kinés" comme levier marketing principal — l'histoire de Nathan EST le marketing
- Reframing tarifaire : jamais "commission" → "service de sécurisation professionnelle". Ancrage sur le coût de NE PAS utiliser JIM ("Combien vous a coûté votre dernier impayé ?")
- Partenariats IFMK : kit premier remplacement distribué dans les 49 écoles (3 000+ diplômés/an captés avant Facebook)
- OPA amicale groupes Facebook : co-administration + outils gratuits en échange du tag partenaire JIM (3-5 groupes cibles)
- Co-fondation émotionnelle avec 5 influenceurs kiné AVANT le lancement (beta-test, feedback, co-création)
- Baromètre du remplacement kiné : rapport data mensuel pour crédibilité institutionnelle (syndicats, Ordre, médias) — la data comme arme stratégique
- Calculateur "Combien vous coûte Facebook en vrai ?" — choc cognitif : 3-5h de recherche × 40€/h = 120-200€ par remplacement vs JIM 20€ en 10 min
- Formation en ligne gratuite "Le remplacement de A à Z" — triple effet : SEO + crédibilité + acquisition
- Lancement ciblé 2-3 départements (Nord-Pas-de-Calais d'abord) avant extension nationale
- La philosophie d'acquisition : le kiné ne "quitte" jamais Facebook — il migre naturellement par accumulation de valeur

**Exigences du Product Brief (complémentaires au PRD) :**

- North Star Metric : nombre de remplacements réussis par mois (contrat signé + mission effectuée + paiement reçu)
- Zone de lancement cible : Nord-Pas-de-Calais (réseau fondateur), puis PACA/Occitanie et Île-de-France
- Kill switch à M6 : < 200 utilisateurs actifs ET rétention M1 < 15% → fermeture. Si rétention > 30% → pivoter acquisition, ne pas fermer
- Suivi comptabilité remplaçant : factures, rétrocessions, historique — cible > 60% des actifs (post-MVP)
- Synchronisation bidirectionnelle Facebook ↔ JIM en temps réel (worker IA) — détection annonces pourvues/éditées sur FB
- Intégration logiciels cabinet (Kiné4000, Topaze, Milo Kiné) prévue V2 (M7-M12) — publication zéro effort depuis le logiciel de facturation
- Plugin navigateur pour titulaires prévu V2 — synchronisation passive
- Webinaires explicatifs et ressources éducatives pour débutants prévus V2
- Abonnement Pro (5,90€/mois, 0% commission) activé après validation usage en gratuit (V1.5, M4-M6)
- Partenariats secondaires : syndicats (FFMKR, SNMKR, Alizé) comme vecteurs de crédibilité, BDE IFMK comme point d'entrée diplômés
- Go/No-Go M6 : 4+ critères sur 7 atteints (500 inscrits RPPS, flux continu annonces, fraîcheur synchro < 4h, 10+ transactions Stripe, 50+ contrats IA, rétention M1 > 30%, NPS > 30) → passage V2

**Précisions du rapport de validation PRD :**

- FR5 : préciser "re-vérification automatique quotidienne"
- FR51 : préciser "toutes les 6 heures" (cohérence avec NFR41)
- FR53 : remplacer "en masse" par seuil spécifique (> 5 comptes/IP/jour)
- FR62 : préciser "jusqu'à 3 annonces alternatives dans la zone de mobilité"

### FR Coverage Map

| FR | Epic | Description |
|---|---|---|
| FR1 | Epic 1 | Création de compte email/mot de passe |
| FR2 | Epic 1 | Authentification magic link |
| FR3 | Epic 1 | Vérification RPPS automatique |
| FR4 | Epic 1 | Recherche RPPS par nom/prénom/ville |
| FR5 | Epic 1 | Profil lecture seule si RPPS non enregistré |
| FR6 | Epic 1 | Gestion profil (spécialités, zone, photo) |
| FR7 | Epic 1 | Déconnexion tous appareils |
| FR8 | Epic 10 | Export données personnelles RGPD |
| FR9 | Epic 10 | Suppression compte RGPD |
| FR10 | Epic 1 | Blocage usurpation identité RPPS |
| FR11 | Epic 2 | Publication annonce mobile |
| FR12 | Epic 2 | Indicateur rétrocession moyenne |
| FR13 | Epic 2 | Modification/fermeture annonce |
| FR14 | Epic 2 | Republication annonce pré-remplie |
| FR15 | Epic 3 | Agrégation annonces externes + badge |
| FR16 | Epic 3 | Déduplication stricte annonces agrégées |
| FR17 | Epic 2 | Statuts annonces temps réel |
| FR18 | Epic 2 | Fermeture automatique annonce pourvue |
| FR19 | Epic 2 | Archivage annonces sans réponse |
| FR20 | Epic 3 | Fusion native/agrégée |
| FR21 | Epic 4 | Recherche carte interactive |
| FR22 | Epic 4 | Filtres distance/dates/rétrocession |
| FR23 | Epic 4 | Détail annonce |
| FR24 | Epic 4 | Statut temps réel annonces |
| FR25 | Epic 4 | Cache local offline |
| FR26 | Epic 4 | Redirection annonce source externe |
| FR27 | Epic 5 | Candidature en 1 clic |
| FR28 | Epic 5 | Avertissement spécialité/zone incompatible |
| FR29 | Epic 5 | Suivi statut candidatures temps réel |
| FR30 | Epic 5 | Candidature offline |
| FR31 | Epic 5 | Consultation candidatures reçues |
| FR32 | Epic 5 | Accepter/refuser candidature |
| FR33 | Epic 5 | Refus en cascade post-acceptation |
| FR34 | Epic 5 | Notification auto candidats non retenus 48h |
| FR35 | Epic 6 | Messagerie texte post-acceptation |
| FR36 | Epic 6 | Message offline + sync |
| FR37 | Epic 6 | Masquage coordonnées avant acceptation |
| FR38 | Epic 6 | Avertissement liens externes anti-phishing |
| FR39 | Epic 8 | Génération contrat pré-rempli IA |
| FR40 | Epic 8 | Consultation/téléchargement contrat |
| FR41 | Epic 8 | Clauses verrouillées + éditables |
| FR42 | Epic 8 | Disclaimer contrat |
| FR43 | Epic 7 | Push nouvelle annonce matchante |
| FR44 | Epic 7 | Push candidature reçue |
| FR45 | Epic 7 | Push candidature acceptée |
| FR46 | Epic 7 | Email fallback si push désactivé |
| FR47 | Epic 7 | Relances automatiques J+2/J+5/J+7 |
| FR48 | Epic 7 | Calendrier disponibilités |
| FR49 | Epic 11 | Parrainage code unique |
| FR50 | Epic 11 | Badge Ambassadeur JIM |
| FR51 | Epic 3 | Agrégation automatisée périodique |
| FR52 | Epic 3 | Monitoring sources + alertes |
| FR53 | Epic 10 | Rate limiting création comptes |
| FR54 | Epic 10 | Détection mots-clés sensibles |
| FR55 | Epic 12 | Dashboard admin opérationnel |
| FR56 | Epic 10 | Logs d'audit |
| FR57 | Epic 11 | Notation mutuelle post-remplacement |
| FR58 | Epic 5 | Carnet de favoris titulaire |
| FR59 | Epic 2 | Annonce urgente + notification prioritaire |
| FR60 | Epic 10 | Détection comptes en double |
| FR61 | Epic 3 | Re-vérification annonces agrégées |
| FR62 | Epic 5 | Annonces alternatives si annulation |
| FR63 | Epic 11 | Changement de rôle |
| FR64 | Epic 5 | Retrait candidature |
| FR65 | Epic 11 | Proposition directe via favoris |
| FR66 | Epic 11 | Consultation avis et notes |
| FR67 | Epic 12 | Signalement contenu/comportement |
| FR68 | Epic 12 | Suspension compte par admin |
| FR69 | Epic 12 | Alertes automatisations admin |
| FR70 | Epic 12 | Formulaire support intégré |

**Couverture : 70/70 FRs mappés.**

## Priorisation & Chemin Critique

### Matrice de Priorisation

| Epic | Valeur | Criticité MVP | Complexité | Risque | **Tier** |
|---|---|---|---|---|---|
| E1 Fondations & Identité | 5 | 5 | 4 | 3 | 🔴 Critique |
| E2 Publication Annonces | 5 | 5 | 2 | 1 | 🔴 Critique |
| E3 Agrégation Externe | 4 | 5 | 5 | 5 | 🔴 Critique + Risque |
| E4 Recherche & Découverte | 5 | 5 | 3 | 2 | 🔴 Critique |
| E5 Candidatures & Sélection | 5 | 5 | 3 | 2 | 🔴 Critique |
| E6 Messagerie | 4 | 4 | 3 | 2 | 🟠 Important |
| E7 Notifications & Calendrier | 4 | 4 | 3 | 2 | 🟠 Important |
| E8 Contrats IA | 3 | 3 | 3 | 3 | 🟠 Important (glissable post-beta) |
| E9 Paiement Stripe | 4 | 3 | 5 | 4 | 🟡 Haut risque (sandbox avant M5) |
| E10 RGPD & Sécurité | 3 | 3 | 2 | 2 | 🟢 Standard (FR8+FR9 minimum au lancement) |
| E11 Réputation & Parrainage | 3 | 2 | 2 | 1 | 🟢 Standard (post-lancement) |
| E12 Admin & Modération | 2 | 2 | 2 | 1 | 🔵 Différable (Sentry + Supabase Dashboard au lancement) |
| E13 Landing Page Web | 3 | 4 | 1 | 1 | 🟢 Parallélisable (déployer AVANT beta) |

### Chemin Critique Recommandé

```
Semaines 1-2:  E1 (Fondations) + E13 (Landing Page) en parallèle
Semaines 3-4:  E2 (Publication) + E3 (Agrégation batch) en parallèle
Semaines 5-6:  E4 (Recherche) + E3 (Agrégation auto)
Semaines 7-8:  E5 (Candidatures)
Semaines 9-10: E6 (Messagerie) + E7 (Notifications)
Semaines 11-12: E8 (Contrats) — BETA LAUNCH
Post-beta:     E9 (Stripe sandbox) → E10 (RGPD) → E11 (Réputation) → E12 (Admin)
```

### Notes de Priorisation

- **E3 (Agrégation)** : risque le plus élevé. Lancer l'import batch en parallèle de E1-E2. Si l'automatisation bloque, l'import manuel suffit pour la beta.
- **E7 (Notifications)** : impact disproportionné sur la rétention. Le "moment Uber" (notification → candidater en 30s) est le facteur de conversion n°1.
- **E8 (Contrats IA)** : différenciateur mais pas bloqueur de lancement. Peut glisser après la beta si nécessaire.
- **E9 (Stripe Connect)** : implémenter en sandbox dès que E8 est terminé. Activer en production après validation HDS (~M5). Les premiers remplacements peuvent se faire avec paiement hors plateforme (virement).
- **E12 (Admin)** : Nathan a accès direct à la DB. Sentry + Supabase Dashboard suffisent au lancement. Dashboard admin = confort post-beta.
- **E13 (Landing Page)** : complexité minimale, à déployer AVANT la beta (vitrine, liens stores, SEO, lien parrainage).

## Top 5 Risques Techniques à Traiter en Premier

| Rang | Risque | Epic | Action immédiate |
|---|---|---|---|
| 1 | **NativeWind v4 + monorepo pnpm casse Metro/EAS Build** | E1 | EAS Build semaine 0, avant tout code métier. `.npmrc` shamefully-hoist + `metro.config.js` watchFolders. Si ça casse, isoler le problème en 1 journée max |
| 2 | **Scraper Rempleo casse silencieusement** (changement structure HTML) | E3 | Tests automatisés par source (NFR42) + monitoring 0 résultats = alerte immédiate + cache fallback (NFR32). Plan B : import batch manuel par Nathan |
| 3 | **Flux inverse Stripe Connect non supporté nativement** | E9 | Spike technique de 2 jours en sandbox AVANT de coder l'epic. Valider le pattern "reverse transfer" ou "Direct Charges". Jamais en production avant validation HDS |
| 4 | **40-60% des utilisateurs iOS refusent les push** = canal mort | E7 | Écran explicatif AVANT la demande système (Story 1.8) + email fallback obligatoire (FR46) + email digest hebdo. Mesurer le taux d'acceptation dès la beta |
| 5 | **Template contrat non validé par l'Ordre MK** = risque juridique | E8 | Contacter l'Ordre MK du Nord AVANT la beta (action pré-lancement PRD). Fallback : modèle inspiré du Code de la Santé Publique avec disclaimer |

### Mitigations Complémentaires par Epic

- **E1** : Vérifier config Supabase Auth `MAGICLINKEXPIRY` pour magic link 4-6h. Mock API Annuaire Santé en dev local
- **E2** : Ne pas afficher l'indicateur rétrocession si < 5 annonces dans la zone. Fallback moyenne nationale (82-85%)
- **E3** : Ne JAMAIS dépendre de Facebook pour le cold start. Import batch Rempleo suffit. Plan B Nathan : saisie manuelle de 50 annonces
- **E4** : Profiler la carte avec 500 marqueurs AVANT la beta. Vérifier extension PostGIS activée
- **E5** : Candidature optimiste avec rollback UI automatique si erreur serveur. Vérifier statut annonce au sync offline
- **E6** : Monitoring connexions Realtime Supabase. Seuil alerte 400/500. Passage tier Pro (25$/mois) dès seuil atteint
- **E9** : Commencer par 1 format import facturation (Kiné4000 CSV). Fallback saisie manuelle si parsing échoue
- **E10** : Test automatisé : créer compte → remplir tout → exporter → vérifier complétude. Cascade SQL `ON DELETE`

## Plan d'Action Pre-mortem — Mesures Préventives

| # | Mesure | Quand | Responsable |
|---|---|---|---|
| 1 | **Tracker ratio natif/agrégé chaque semaine.** Objectif > 20% natif à M3. Incentiver la publication native dans les CTAs des annonces agrégées : "Publiez directement sur JIM pour recevoir des candidatures vérifiées RPPS" | Dès le lancement | Nathan (dashboard) |
| 2 | **Budget tampon 50% sur le chemin critique.** Beta réaliste à M4.5, pas M3. Freelance d'urgence identifié (500-1000€). Claude Code configuré comme backup dev pour stories approuvées | Maintenant | Nathan |
| 3 | **Email transactionnel basique pour candidatures reçues** avant le dispatcher E7. Un email simple via Supabase Auth pour alerter le titulaire d'une nouvelle candidature, même sans le système de notifications complet | Story 5.6 | Dev |
| 4 | **Contacter les IFMK du Nord maintenant** (mars-avril 2026). Fenêtre diplômés juin-juillet = deadline hard pour la beta. Promesse aux BDE : "app disponible en juin pour vos diplômés" | Mars 2026 | Nathan |
| 5 | **Nathan "concierge" les 50 premiers remplacements.** Suivi manuel des titulaires non-responsifs en beta. Contacter personnellement les titulaires sans réponse à J+2. Non-scalable mais valide le product-market fit | Beta | Nathan |
| 6 | **KPI Stripe substitué pour le Go/No-Go M6 :** "remplacements complétés avec paiement confirmé" (Stripe sandbox OU virement hors-plateforme confirmé manuellement). Permet d'évaluer le modèle économique même si Stripe n'est pas en production | Go/No-Go M6 | Nathan |
| 7 | **Contacter l'Ordre MK du Nord CETTE SEMAINE.** Ne pas attendre le produit. Valider le template contrat ou activer le fallback (modèle inspiré du Code de la Santé Publique) | Mars 2026 | Nathan |

### Scénarios d'Échec Identifiés et Mitigations

| Scénario | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Plateforme fantôme inversée (95% agrégé, 5% natif) | Très haute | Fatal | Incentive publication native + tracker ratio hebdo + CTA agressifs sur annonces agrégées |
| Dev solo s'effondre (retard 6+ semaines) | Haute | Fatal | Tampon 50% + freelance urgence + Claude Code backup + scope beta réduit (E1-E5 + E13) |
| Silence mortel titulaire (0 candidature, 0 feedback) | Très haute | Élevé | Feedback post-publication visible (compteur vues) + email basique pré-E7 + Nathan concierge |
| Fenêtre IFMK ratée (diplômés juin-juillet) | Haute | Élevé | Pré-partenariats IFMK mars-avril + beta prête juin |
| Confiance perçue nulle (workflow incomplet) | Moyenne | Élevé | Concierge 50 premiers remplacements + moment de confiance minimum = RPPS + candidature + réponse < 48h |
| Stripe sandbox éternel (HDS en retard) | Moyenne | Moyen | Substituer par paiement hors-plateforme confirmé + KPI adapté |
| Ordre MK bloque les contrats | Moyenne | Moyen | Contacter AVANT la beta + fallback Code Santé Publique + disclaimer |

## Notes Globales d'Implémentation

**Tests :** Chaque story inclut implicitement des tests unitaires co-localisés (Vitest) pour la logique métier, et une vérification manuelle des ACs sur dev build. Les tests E2E sont différés post-MVP (Maestro mobile, Playwright web).

**Migrations SQL :** Chaque story qui crée ou modifie une table inclut implicitement la création d'une migration SQL `NNN_<description>.sql` avec le schéma de la table, les index nécessaires et les RLS policies associées.

**Commission :** 0% pendant la période de lancement (flag `launch_period_active`), puis 1% en version gratuite, 0% avec abonnement Pro (5,90€/mois).

## Epic List

### Epic 1 : Fondations & Identité Vérifiée (12 stories)
Les professionnels de santé peuvent créer un compte, se connecter et vérifier leur identité RPPS.
**FRs :** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR10
**Notes :** Story 0 découpée en 3 (setup monorepo, tooling, brownfield Supabase). Supabase Auth (email/pwd + magic link 4-6h). RPPS via API Annuaire Santé. Profil basique. Écran explicatif + permission push + token FCM. Table professions (NFR22). RLS policies de base. Consentement CGU.

### Epic 2 : Publication & Gestion d'Annonces
Les titulaires peuvent publier, modifier, fermer et republier des annonces en < 2 minutes.
**FRs :** FR11, FR12, FR13, FR14, FR17, FR18, FR19, FR59
**Notes :** Formulaire 3 champs (dates + ville autocomplete + rétrocession), infos cabinet héritées, indicateur rétrocession moyenne, statuts temps réel, fermeture auto, feedback post-publication reformulé intelligemment (jamais "Visible par 0 remplaçant" en zone rurale). Pose les triggers dans notification_queue.

### Epic 3 : Agrégation d'Annonces Externes
La plateforme n'est jamais vide — les annonces externes sont importées avec badge "Source externe".
**FRs :** FR15, FR16, FR20, FR51, FR52, FR61
**Notes :** Import batch initial (script one-shot pour pré-remplir 200+ annonces avant la beta) + pipeline extensible (interface AggregationSource). 1ère source automatisée (Rempleo), 2ème (Facebook) en raffinement progressif. Badge discret, natives priorisées. Déduplication stricte. Monitoring par source.

### Epic 4 : Recherche & Découverte d'Annonces
Les remplaçants peuvent trouver des annonces pertinentes via liste filtrable ou carte interactive, avec accès offline.
**FRs :** FR21, FR22, FR23, FR24, FR25, FR26
**Notes :** Vue liste par dates (défaut) + toggle carte (react-native-maps + PostGIS). Écran d'accueil par rôle. 3 filtres. Cache local MMKV. Empty states engageants. Deep links. Performance < 1s. Indicateur rétrocession moyenne affiché côté remplaçant sur le détail annonce.

### Epic 5 : Candidatures & Sélection
Les remplaçants peuvent candidater en 1 tap avec un message d'accompagnement optionnel, les titulaires évaluent, acceptent ou refusent, et sauvegardent en favoris.
**FRs :** FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR58, FR62, FR64
**Notes :** Candidature optimiste (UI 200ms). Message d'accompagnement optionnel : champ `message` dans la table candidatures (pas un chat). Écran intermédiaire skippable. Pipeline visuel. Refus en cascade. File d'attente offline. Carnet de favoris (FR58). Gate douce profil incomplet. Pose les triggers dans notification_queue.

### Epic 6 : Messagerie Intégrée
Les titulaires et remplaçants peuvent communiquer par messagerie texte après acceptation de candidature.
**FRs :** FR35, FR36, FR37, FR38
**Notes :** Chat Supabase Realtime. S'ouvre automatiquement après acceptation — le message d'accompagnement de l'Epic 5 affiché en tête du thread. Coordonnées masquées jusqu'à acceptation. Anti-phishing. File d'attente offline. Pose les triggers dans notification_queue.

### Epic 7 : Notifications & Calendrier
Les remplaçants reçoivent des alertes push pertinentes, gèrent leur calendrier, et le système relance automatiquement.
**FRs :** FR43, FR44, FR45, FR46, FR47, FR48
**Notes :** Dispatcher multi-canal : consomme les triggers posés par Epics 2, 5, 6, 9. Push FCM/APNs (payload générique). Email fallback obligatoire (FR46). 3 toggles, max 3 push/jour. Relances J+2/J+5/J+7. Calendrier disponibilités remplaçant. pg_cron 15 min.

### Epic 8 : Contrats IA
Les utilisateurs peuvent générer un contrat pré-rempli conforme, le consulter et le télécharger en PDF.
**FRs :** FR39, FR40, FR41, FR42
**Notes :** JSON unique en DB + double rendu (résumé in-app 5 points "Tout est conforme" + @react-pdf PDF). Clauses verrouillées + éditables. Disclaimer. Confirmation double. Rassurance.

### Epic 9 : Paiement Sécurisé (Stripe Connect)
Les remplaçants peuvent payer la rétrocession au titulaire via Stripe Connect. Zéro impayé.
**FRs :** Exigences Product Brief (F4) + PRD (pilier 4, flux paiement inverse).
**Notes :** Flux inverse : remplaçant encaisse → reverse rétrocession au titulaire via Stripe Connect. Onboarding KYC remplaçant. 0% pendant le lancement, puis 1% (gratuit) / 0% (Pro 5,90€/mois). Calcul automatique rétrocession basé sur données de facturation réelles (import fichier / API / saisie manuelle). Médiation litiges (compte séquestre). Justificatif RCP requis. Implémentation complète + tests sandbox MVP, activation production après validation HDS (~M5). Pose triggers dans notification_queue.

### Epic 10 : Conformité RGPD & Sécurité
Les utilisateurs peuvent exporter leurs données et supprimer leur compte. Le système protège contre les abus.
**FRs :** FR8, FR9, FR53, FR54, FR56, FR60
**Notes :** Export JSON/PDF < 24h. Suppression 30j + anonymisation. Rate limiting. Détection mots-clés sensibles. Logs audit 1 an. FR60 (détection doublon). Zéro charge cognitive utilisateur.

### Epic 11 : Réputation, Parrainage & Extensions de Profil
Les utilisateurs peuvent noter mutuellement, consulter les avis, parrainer des confrères, changer de rôle et proposer des remplacements à leurs favoris.
**FRs :** FR49, FR50, FR57, FR63, FR65, FR66
**Notes :** Notation post-remplacement, avis anonymes 7j, badge "Ambassadeur JIM", code parrainage unique. FR63 (switch de rôle). FR65 (proposition directe via favoris). Consultation avis (FR66).

### Epic 12 : Administration & Modération
L'administrateur supervise la plateforme, les utilisateurs peuvent signaler du contenu ou contacter le support.
**FRs :** FR55, FR67, FR68, FR69, FR70
**Notes :** Dashboard admin, signalement, suspension, alertes automatisations, formulaire support.

### Epic 13 : Landing Page Web & Outils Gratuits *(parallélisable avec Epics 1-5)*
Les visiteurs découvrent JIM via le web, téléchargent l'app via liens directs stores, et accèdent à des outils gratuits.
**FRs :** Exigences Architecture + Product Brief + Brainstorming.
**Notes :** Next.js App Router, SSG. Boutons téléchargement App Store / Google Play avec liens directs. Smart App Banner. Pages marketing. Meta tags SEO. Deep links annonces. Calculateur de rétrocession nette (outil viral SEO). À déployer AVANT la beta.

---

## Epic 1 : Fondations & Identité Vérifiée

Les professionnels de santé peuvent créer un compte, se connecter et vérifier leur identité RPPS.

### Story 1.1a : Setup Monorepo & Build

As a développeur,
I want un monorepo pnpm workspace fonctionnel avec les apps mobile et web,
So that je puisse commencer à développer sur une base solide.

**Acceptance Criteria:**

**Given** un nouveau workspace jim-app
**When** le setup est complété
**Then** le monorepo pnpm workspace est configuré avec `@jim/mobile` (Expo SDK 54), `@jim/web` (Next.js 16.1), `@jim/shared`, `@jim/ui`
**And** `.npmrc` avec `shamefully-hoist=true` et `pnpm-workspace.yaml` sont configurés
**And** `metro.config.js` avec `watchFolders` pour le monorepo est en place
**And** EAS Build (dev profile) réussit sans erreur — validation obligatoire AVANT tout code métier
**And** les versions sont verrouillées (pas de `^`) dans la matrice de compatibilité (Expo 54, NativeWind 4.2, Supabase JS 2.98, Zod 4.3, TanStack Query 5.90, Zustand 5.0)
**And** `tsconfig.base.json` + paths `@jim/*` configurés dans chaque app

### Story 1.1b : Tooling & DX

As a développeur,
I want le tooling de qualité (styling, stockage, monitoring, linting, tests) configuré,
So that chaque ligne de code métier soit immédiatement dans les bonnes pratiques.

**Acceptance Criteria:**

**Given** le monorepo fonctionnel (Story 1.1a)
**When** le tooling est configuré
**Then** NativeWind v4.2+ est configuré avec Tailwind CSS 3.4.17 et un `tailwind.config.js` racine unique (preset dans les apps)
**And** MMKV est installé et fonctionnel (dev build EAS obligatoire — Expo Go n'est plus utilisable)
**And** Sentry est initialisé (mobile `_layout.tsx` + web `sentry.client.config.ts` / `sentry.server.config.ts`)
**And** ESLint est configuré en mode error avec `no-restricted-imports` (@supabase/supabase-js interdit dans apps/, barrels interdits sauf @jim/ui) et `no-default-export` (sauf fichiers route)
**And** Vitest est configuré avec workspaces pour les tests unitaires co-localisés
**And** les scripts CI sont en place (`check-edge-function-size.sh`)
**And** un guide de ton/copie est documenté (ton collègue bienveillant, pas plateforme corporate)

### Story 1.1c : Connexion Brownfield Supabase

As a développeur,
I want connecter le monorepo au projet Supabase existant et préparer le schéma,
So that je puisse réutiliser les 20 migrations existantes et le schéma de données.

**Acceptance Criteria:**

**Given** le monorepo avec le tooling configuré (Story 1.1b)
**When** la connexion Supabase est établie
**Then** le projet est connecté au Supabase existant (brownfield, 20 migrations)
**And** `supabase gen types` génère les types dans `@jim/shared/types/database.ts`
**And** l'extension PostGIS est vérifiée/activée (`CREATE EXTENSION IF NOT EXISTS postgis`)
**And** la table `professions` est créée avec config JSONB par profession (kinésithérapie comme première entrée, NFR22 multi-professions jour 1)
**And** les variables d'environnement sont documentées dans `.env.local.example` (mobile : `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` ; web : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SENTRY_DSN`)
**And** la migration SQL `007_add_professions.sql` est créée avec le schéma, les index et les RLS policies

### Story 1.2 : Inscription Email & Mot de Passe

As a professionnel de santé,
I want créer un compte avec mon email et un mot de passe,
So that je puisse accéder à la plateforme JIM.

**Acceptance Criteria:**

**Given** un utilisateur non inscrit sur l'écran d'inscription
**When** il saisit son email, mot de passe et choisit son rôle (remplaçant/titulaire)
**Then** un compte est créé dans Supabase Auth et un profil est créé dans la table `profiles` avec le rôle choisi
**And** la table `professions` est créée/mise à jour avec la config kinésithérapie (NFR22 multi-professions jour 1)
**And** un email de confirmation est envoyé
**And** l'utilisateur est redirigé vers l'écran de vérification RPPS
**And** le rate limiting bloque après 3 tentatives par IP/jour (NFR15)
**And** les champs sont validés via un schéma Zod dans `@jim/shared/validators/profile.schema.ts`

### Story 1.3 : Authentification Magic Link

As a professionnel de santé,
I want me connecter via un magic link envoyé par email,
So that je puisse accéder à mon compte sans retenir un mot de passe.

**Acceptance Criteria:**

**Given** un utilisateur inscrit sur l'écran de connexion
**When** il saisit son email et clique "Recevoir un lien de connexion"
**Then** un magic link est envoyé par email avec une validité de 4 à 6 heures
**And** au clic sur le lien, l'utilisateur est authentifié et redirigé vers l'écran d'accueil
**And** les tokens JWT sont stockés dans expo-secure-store (mobile) avec expiration 15min access / 7j refresh (NFR12-13)
**And** un bouton "Recevoir un nouveau lien" est toujours visible si le lien expire
**And** la connexion email/mot de passe reste disponible comme alternative

### Story 1.4 : Vérification RPPS Automatique

As a professionnel de santé,
I want faire vérifier mon identité via mon numéro RPPS,
So that mon profil soit certifié et inspire confiance aux autres utilisateurs.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur l'écran de vérification RPPS
**When** il saisit son numéro RPPS (11 chiffres)
**Then** l'API Annuaire Santé est appelée et la vérification se complète en < 3 secondes (NFR3)
**And** si le RPPS est valide et correspond au nom, le profil est marqué "vérifié" avec un badge RPPS visible
**And** si le RPPS ne correspond pas au nom fourni, le compte est bloqué (FR10 — usurpation) et une alerte admin est générée
**And** la vérification est cachée pendant 6 mois (NFR40)
**And** le retry exponentiel est implémenté en cas de rate limiting de l'API (NFR39)
**And** en cas de panne API Annuaire Santé, le profil est marqué "Vérification en attente" avec navigation autorisée mais candidature bloquée (NFR30)

### Story 1.5 : Recherche RPPS par Nom/Prénom/Ville

As a professionnel de santé qui ne connaît pas son numéro RPPS,
I want rechercher mon RPPS par nom, prénom et ville,
So that je puisse vérifier mon profil sans avoir à chercher mon numéro.

**Acceptance Criteria:**

**Given** un utilisateur sur l'écran de vérification RPPS
**When** il clique "Je ne connais pas mon numéro" et saisit nom, prénom et ville
**Then** l'API Annuaire Santé est interrogée et les résultats correspondants sont affichés
**And** l'utilisateur peut sélectionner son profil dans la liste pour lancer la vérification
**And** si aucun résultat, un message explicatif est affiché avec des suggestions (vérifier l'orthographe, essayer une ville voisine)

### Story 1.6 : Profil en Lecture Seule (RPPS Non Enregistré)

As a jeune diplômé dont le RPPS n'est pas encore enregistré dans l'Annuaire Santé,
I want obtenir un profil en lecture seule avec re-vérification automatique,
So that je puisse préparer mon profil en attendant l'activation de mon RPPS.

**Acceptance Criteria:**

**Given** un utilisateur dont le RPPS n'est pas trouvé dans l'Annuaire Santé
**When** la vérification échoue avec "RPPS non trouvé"
**Then** le profil est créé en mode "lecture seule" (navigation autorisée, candidature bloquée)
**And** un message engageant est affiché : "Activation en cours — on vérifie chaque jour pour vous"
**And** une re-vérification automatique quotidienne est planifiée via pg_cron (FR5)
**And** quand le RPPS est activé, une notification push est envoyée et le profil bascule en mode complet
**And** l'utilisateur peut compléter son profil (spécialités, zone) pendant l'attente

### Story 1.7 : Gestion de Profil

As a professionnel de santé,
I want gérer mon profil (spécialités, zone de mobilité, photo),
So that les titulaires/remplaçants puissent évaluer ma candidature ou mon annonce.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur l'écran profil
**When** il modifie ses spécialités, zone de mobilité (rayon en km) ou ajoute une photo
**Then** les modifications sont sauvegardées dans la table `profiles`
**And** la photo est uploadée dans Supabase Storage via expo-image (picker caméra/galerie)
**And** la validation est faite via un schéma Zod `profile.schema.ts`
**And** les spécialités sont sélectionnées depuis une liste pré-définie (config JSONB de la table `professions`)
**And** un badge de complétude est affiché ("3x plus de réponses avec profil complet")

### Story 1.8 : Déconnexion & Permission Push

As a professionnel de santé,
I want déconnecter tous mes appareils et gérer mes permissions push,
So that je puisse sécuriser mon compte et contrôler mes notifications.

**Acceptance Criteria:**

**Given** un utilisateur authentifié dans les paramètres
**When** il clique "Déconnecter tous les appareils"
**Then** tous les tokens refresh sont révoqués et toutes les sessions sont fermées (FR7)
**And** à l'onboarding (premier lancement post-inscription), un écran explicatif est affiché AVANT la demande de permission push système iOS/Android
**And** le token FCM est enregistré dans la table `profiles` après acceptation
**And** si l'utilisateur refuse les push, un fallback email est configuré (FR46 préparé pour Epic 7)

### Story 1.9 : Policies RLS de Base

As a développeur,
I want configurer les Row Level Security policies sur les tables existantes,
So that chaque utilisateur ne puisse accéder qu'à ses propres données et aux données publiques.

**Acceptance Criteria:**

**Given** les tables `profiles`, `annonces`, `professions` en base
**When** les RLS policies sont créées
**Then** `profiles` : lecture publique (nom, spécialités, badge RPPS), écriture own uniquement
**And** `annonces` : lecture publique (annonces actives), écriture/modification titulaire own uniquement
**And** `professions` : lecture publique, écriture admin uniquement
**And** la migration `014_rls_policies.sql` est créée avec toutes les policies
**And** les policies sont testées avec 3 comptes (remplaçant A, remplaçant B, titulaire C) : A ne peut pas modifier le profil de B, C ne peut pas modifier les annonces de A, etc.
**And** chaque epic suivant ajoute les RLS policies de ses propres tables dans sa migration dédiée

### Story 1.10 : Consentement CGU & Politique de Confidentialité

As a professionnel de santé,
I want accepter les CGU et la Politique de confidentialité lors de l'inscription,
So that JIM soit conforme aux obligations légales RGPD dès le jour 1.

**Acceptance Criteria:**

**Given** un utilisateur sur l'écran d'inscription
**When** il remplit le formulaire
**Then** une case à cocher obligatoire est affichée : "J'accepte les [CGU] et la [Politique de confidentialité]" avec liens cliquables
**And** l'inscription est bloquée tant que la case n'est pas cochée
**And** le consentement est horodaté et enregistré dans la table `profiles` (champ `cgu_accepted_at`)
**And** les pages CGU et Politique de confidentialité sont accessibles via lien web (hébergées sur la landing page Epic 13 ou dans l'app en attendant)
**And** en cas de mise à jour des CGU, un bandeau invite l'utilisateur à re-accepter à la prochaine connexion

---

## Epic 2 : Publication & Gestion d'Annonces

Les titulaires peuvent publier, modifier, fermer et republier des annonces en < 2 minutes.

### Story 2.1 : Publication d'Annonce de Remplacement

As a titulaire,
I want publier une annonce de remplacement en moins de 2 minutes depuis l'app mobile,
So that je puisse trouver un remplaçant rapidement.

**Acceptance Criteria:**

**Given** un titulaire authentifié et vérifié RPPS sur l'écran "Publier"
**When** il remplit les 3 champs obligatoires (dates début/fin + ville avec autocomplete api-adresse.data.gouv.fr + taux de rétrocession)
**Then** l'annonce est créée dans la table `annonces` avec statut "Active" et les coordonnées GPS géocodées
**And** les infos cabinet (type, adresse, spécialités) sont héritées du profil titulaire et pré-remplies
**And** un indicateur de rétrocession moyenne dans la zone est affiché pour guider le titulaire (FR12)
**And** le formulaire utilise React Hook Form + Zod resolver avec le schéma `annonce.schema.ts`
**And** un feedback post-publication est affiché ("Annonce en ligne" — jamais "Visible par 0 remplaçant" en zone rurale)
**And** un trigger est inséré dans `notification_queue` (événement `ANNONCE_CREEE`) pour le dispatch futur (Epic 7)
**And** la publication se complète en < 2 minutes (mesure UX)

### Story 2.2 : Annonce Urgente

As a titulaire ayant un besoin de remplacement immédiat,
I want marquer mon annonce comme urgente,
So that les remplaçants disponibles soient alertés en priorité.

**Acceptance Criteria:**

**Given** un titulaire sur le formulaire de publication ou la page de gestion de son annonce
**When** il active l'option "Urgent"
**Then** l'annonce affiche un badge "Urgent" visible dans la liste et sur la carte
**And** un trigger prioritaire est inséré dans `notification_queue` (événement `ANNONCE_URGENTE`) ciblant les remplaçants disponibles dans un rayon de 30 km (FR59)
**And** la notification push urgente est délivrée avec une priorité haute

### Story 2.3 : Modification & Fermeture Manuelle d'Annonce

As a titulaire,
I want modifier ou fermer manuellement mon annonce,
So that je puisse mettre à jour les informations ou retirer une annonce pourvue.

**Acceptance Criteria:**

**Given** un titulaire sur la page de détail de son annonce
**When** il clique "Modifier"
**Then** le formulaire de publication s'ouvre pré-rempli avec les données actuelles et il peut modifier tous les champs
**And** les modifications sont sauvegardées et le statut reste inchangé si l'annonce est toujours active

**Given** un titulaire sur la page de détail de son annonce
**When** il clique "Fermer l'annonce" (ou "J'ai trouvé mon remplaçant")
**Then** le statut passe à "Pourvue", l'annonce disparaît de la recherche et passe dans l'historique
**And** tous les candidats en attente sont notifiés automatiquement (trigger `notification_queue`)

### Story 2.4 : Republication d'Annonce Passée

As a titulaire,
I want republier une annonce passée avec les informations pré-remplies,
So that je puisse publier rapidement sans tout ressaisir.

**Acceptance Criteria:**

**Given** un titulaire dans son historique d'annonces
**When** il clique "Republier" sur une annonce passée (Pourvue ou Expirée)
**Then** le formulaire de publication s'ouvre pré-rempli avec toutes les informations de l'annonce originale
**And** seules les dates sont vides (à remplir obligatoirement)
**And** le titulaire peut modifier les champs avant de publier
**And** une nouvelle annonce est créée (pas de modification de l'ancienne)

### Story 2.5 : Statuts Annonces Temps Réel & Cycle de Vie

As a utilisateur de JIM,
I want voir le statut de chaque annonce mis à jour en temps réel,
So that je sache toujours si une annonce est encore disponible.

**Acceptance Criteria:**

**Given** une annonce dans la base de données
**When** son statut change (Active → En cours → Pourvue → Expirée)
**Then** le changement est propagé en temps réel via Supabase Realtime en < 2 secondes (NFR9)
**And** les 6 statuts sont gérés : Active (vert), En cours (orange), Non confirmée (gris), Source externe (bleu), Pourvue (check), Expirée (noir)
**And** quand une candidature est acceptée et confirmée, l'annonce passe automatiquement en "Pourvue" (FR18)
**And** le cycle de relance fraîcheur fonctionne : relance J-7 ("Votre annonce est-elle toujours d'actualité ?"), statut "Non confirmée" à J-3, archivée à J0 sans réponse (FR19)
**And** les annonces archivées/pourvues disparaissent de la recherche mais restent consultables dans l'historique
**And** les triggers de relance sont insérés dans `notification_queue` avec `scheduled_at`

---

## Epic 3 : Agrégation d'Annonces Externes

La plateforme n'est jamais vide — les annonces externes sont importées avec badge "Source externe".

### Story 3.1 : Pipeline d'Agrégation & Interface Source

As a développeur,
I want un pipeline d'agrégation extensible avec une interface standard par source,
So that je puisse ajouter de nouvelles sources sans modifier le code cœur.

**Acceptance Criteria:**

**Given** l'architecture du pipeline d'agrégation
**When** une nouvelle source doit être ajoutée
**Then** l'interface `AggregationSource` est définie dans `supabase/functions/_shared/aggregation/aggregation-source.interface.ts` avec les méthodes `fetch()`, `normalize()`, `getSourceId()`
**And** un orchestrateur est implémenté dans `supabase/functions/aggregate-annonces/index.ts` (≤ 40 lignes) qui appelle `supabase/functions/_shared/aggregation/orchestrator.ts`
**And** l'orchestrateur dispatch les sources en parallèle avec timeout, métriques et circuit breaker par source
**And** l'ajout d'une source = implémentation de l'interface + config, zéro modification du code cœur (NFR23)
**And** pg_cron est configuré pour exécuter l'agrégation toutes les 6 heures (NFR41)

### Story 3.2 : Import Batch Initial (Script One-Shot)

As a fondateur,
I want pré-remplir JIM avec 200+ annonces avant la beta,
So that le premier utilisateur ne voie jamais une plateforme vide.

**Acceptance Criteria:**

**Given** un script d'import batch dans `scripts/`
**When** il est exécuté manuellement avant le lancement
**Then** les annonces de Rempleo sont récupérées, normalisées (dates, localisation, rétrocession, type de cabinet) et insérées dans la table `annonces` avec le statut "Source externe"
**And** chaque annonce agrégée porte un badge "Source externe" et un lien vers l'annonce originale
**And** aucune donnée personnelle du titulaire n'est stockée sans consentement (NFR36)
**And** le script est idempotent — une ré-exécution ne crée pas de doublons
**And** un rapport d'import est généré (nombre d'annonces importées, erreurs, doublons ignorés)
**And** une re-vérification des annonces importées est exécutée 24h avant le lancement beta pour retirer les annonces périmées

### Story 3.3 : Source Automatisée Rempleo

As a système,
I want agréger automatiquement les annonces Rempleo toutes les 6 heures,
So that les annonces externes soient toujours fraîches et à jour.

**Acceptance Criteria:**

**Given** la source Rempleo implémentant l'interface `AggregationSource`
**When** l'orchestrateur exécute le scan programmé
**Then** les nouvelles annonces sont importées et normalisées dans la table `annonces`
**And** les annonces déjà importées sont re-vérifiées — si l'originale a disparu, le statut passe à "Expirée" (FR61)
**And** le monitoring alerte l'administrateur si 0 résultats sur un scan (FR52)
**And** un test automatisé détecte les changements de structure HTML en moins de 24h (NFR42)
**And** en cas de source indisponible, les dernières annonces valides restent accessibles via le cache (NFR32)
**And** les métriques par source sont enregistrées (nombre d'annonces, erreurs, temps d'exécution)

### Story 3.4 : Déduplication Stricte

As a utilisateur,
I want ne jamais voir la même annonce en double (native et agrégée),
So that la plateforme soit fiable et sans doublons.

**Acceptance Criteria:**

**Given** une annonce agrégée dans la base
**When** un titulaire publie une annonce native avec les mêmes critères (même titulaire + mêmes dates + même ville)
**Then** le système détecte le doublon par correspondance stricte (FR16)
**And** l'annonce agrégée est automatiquement fusionnée avec l'annonce native — l'annonce native prend le dessus (FR20)
**And** le lien vers l'annonce originale est conservé dans les métadonnées
**And** les fusions sont loguées pour audit (possibilité de restauration manuelle par l'admin si fausse déduplication)

### Story 3.5 : Affichage & CTA Annonces Agrégées

As a remplaçant,
I want distinguer les annonces natives des annonces agrégées et savoir quoi faire avec chacune,
So that je puisse candidater ou consulter l'originale selon le cas.

**Acceptance Criteria:**

**Given** une liste d'annonces (natives + agrégées)
**When** le remplaçant consulte la liste ou la carte
**Then** les annonces agrégées affichent un badge discret (icône, pas couleur de fond) "Source externe"
**And** les annonces natives sont priorisées visuellement (affichées en premier à pertinence égale)
**And** le CTA d'une annonce native est "Candidater" (bouton primaire)
**And** le CTA d'une annonce agrégée est "Voir l'originale" (bouton secondaire, redirection vers la source) + "Alertes similaires" (bouton primaire) + feedback "On invite ce titulaire sur JIM"
**And** un message d'incentive est affiché aux titulaires dont les annonces sont agrégées : "Publiez directement sur JIM pour recevoir des candidatures vérifiées RPPS — 3x plus de réponses que sur les plateformes externes"
**And** le badge affiche "Vérifié il y a Xh" pour indiquer la fraîcheur du dernier scan

---

## Epic 4 : Recherche & Découverte d'Annonces

Les remplaçants peuvent trouver des annonces pertinentes via liste filtrable ou carte interactive, avec accès offline.

### Story 4.1 : Écran d'Accueil par Rôle

As a professionnel de santé,
I want voir un écran d'accueil adapté à mon rôle (remplaçant ou titulaire),
So that j'accède directement aux actions pertinentes pour moi.

**Acceptance Criteria:**

**Given** un utilisateur authentifié qui ouvre l'app
**When** son rôle est "remplaçant"
**Then** l'écran d'accueil affiche la vue liste d'annonces triée par dates/disponibilités comme vue par défaut
**And** un toggle liste/carte est visible en haut de l'écran

**Given** un utilisateur authentifié qui ouvre l'app
**When** son rôle est "titulaire"
**Then** l'écran d'accueil affiche un dashboard avec ses annonces actives, candidatures reçues et un CTA "Publier" proéminent
**And** le dashboard affiche les compteurs (annonces actives, candidatures en attente, messages non lus)

### Story 4.2 : Liste d'Annonces Filtrable

As a remplaçant,
I want voir une liste d'annonces filtrable par distance, dates et rétrocession,
So that je trouve rapidement les annonces qui correspondent à mes critères.

**Acceptance Criteria:**

**Given** un remplaçant sur l'écran de recherche en vue liste
**When** il consulte la liste
**Then** les annonces sont affichées dans une FlashList (virtualisation Shopify) avec les 4 infos critiques au-dessus du fold : dates, ville + distance, rétrocession %, spécialité compatible
**And** 3 filtres sont disponibles : distance (rayon en km), dates (plage), rétrocession (min %)
**And** les filtres sont combinables et le filtrage est en temps réel (pas de bouton "Appliquer")
**And** les annonces natives sont priorisées par rapport aux agrégées à pertinence égale
**And** le tri par défaut est par dates (les plus proches en premier)
**And** les préférences de filtre sont persistées dans le store Zustand `useUIStore` via MMKV

### Story 4.3 : Carte Interactive

As a remplaçant,
I want rechercher des annonces sur une carte interactive,
So that je visualise les opportunités autour de moi géographiquement.

**Acceptance Criteria:**

**Given** un remplaçant qui active la vue carte (toggle)
**When** la carte s'affiche
**Then** les annonces actives sont affichées comme marqueurs sur la carte (react-native-maps) avec les requêtes PostGIS `ST_DWithin`
**And** le chargement se complète en < 1 seconde avec 200+ marqueurs (NFR1) via pagination serveur + bounding box
**And** les marqueurs sont codés par couleur selon le statut (Active = vert, En cours = orange, Source externe = bleu)
**And** au tap sur un marqueur, un aperçu de l'annonce s'affiche (bottom sheet)
**And** si l'utilisateur refuse la localisation, un fallback "ville du cabinet" ou autocomplete est proposé (jamais de carte vide sans repère)
**And** la dernière position de la carte est persistée dans `useUIStore`

### Story 4.4 : Détail d'Annonce

As a remplaçant,
I want consulter le détail complet d'une annonce,
So that je puisse évaluer si le remplacement me convient avant de candidater.

**Acceptance Criteria:**

**Given** un remplaçant qui tape sur une annonce (liste ou carte)
**When** la page de détail s'ouvre
**Then** toutes les informations sont affichées : dates, lieu, rétrocession, type de cabinet, spécialités, description, profil titulaire (vérifié RPPS)
**And** le statut en temps réel est visible (FR24) mis à jour via Supabase Realtime
**And** un indicateur de rétrocession moyenne dans la zone est affiché ("Dans cette zone, la moyenne est 83%")
**And** pour une annonce native, le CTA "Candidater" est visible (bouton primaire)
**And** pour une annonce agrégée, le CTA "Voir l'originale" (secondaire) + "Alertes similaires" (primaire) sont affichés (FR26)
**And** si l'annonce est pourvue entre la notification et l'ouverture, un message "Pourvue" + 3 annonces similaires sont proposés (jamais de cul-de-sac)

### Story 4.5 : Cache Local & Mode Offline

As a remplaçant avec une connexion dégradée,
I want consulter les annonces déjà chargées sans connexion internet,
So that je puisse continuer à utiliser JIM en zone rurale ou dans le métro.

**Acceptance Criteria:**

**Given** un remplaçant qui a précédemment consulté des annonces
**When** il perd la connexion internet
**Then** les annonces en cache MMKV sont accessibles en lecture seule (FR25)
**And** un bandeau "Hors ligne" est affiché en haut de l'écran (composant `offline-banner.tsx`)
**And** le cache supporte 1000+ annonces sans dégradation de performance (NFR25)
**And** au retour en ligne, les annonces sont rafraîchies automatiquement via TanStack Query (stale-while-revalidate) sans perte de données (NFR31)
**And** les actions en file d'attente (candidatures, messages) sont synchronisées automatiquement avec un indicateur "Envoi en cours"

### Story 4.6 : Empty States Engageants

As a remplaçant en zone rurale,
I want voir un message d'espoir au lieu d'une page vide quand il n'y a pas d'annonces,
So that je ne désinstalle pas l'app en pensant qu'elle est inutile.

**Acceptance Criteria:**

**Given** un remplaçant dont les filtres ou la zone ne retournent aucun résultat
**When** la liste ou la carte est vide
**Then** un composant `empty-state.tsx` est affiché avec un message encourageant ("Pas encore d'annonces ici — on vous prévient dès qu'il y en a")
**And** un CTA "Créer une alerte" permet au remplaçant d'être notifié quand une annonce correspondante apparaît
**And** le message n'affiche JAMAIS un chiffre déprimant ("0 annonce", "0 remplaçant")
**And** le ton est celui d'un collègue bienveillant, pas d'une plateforme froide

---

## Epic 5 : Candidatures & Sélection

Les remplaçants peuvent candidater en 1 tap avec un message d'accompagnement optionnel, les titulaires évaluent, acceptent ou refusent, et sauvegardent en favoris.

### Story 5.1 : Candidature en 1 Tap avec Message Optionnel

As a remplaçant,
I want candidater à une annonce en 1 tap avec la possibilité d'ajouter un message,
So that je puisse postuler rapidement tout en me présenter au titulaire.

**Acceptance Criteria:**

**Given** un remplaçant vérifié RPPS sur la page de détail d'une annonce native
**When** il tape "Candidater"
**Then** un écran intermédiaire optionnel s'affiche : "Un message pour le titulaire ? (optionnel)" avec une zone de texte et un placeholder exemple ("Ex: 3 ans d'expérience en musculo, disponible toute la période")
**And** s'il ajoute un message, la candidature est créée dans la table `candidatures` avec le champ `message`
**And** s'il skip le message (bouton "Envoyer sans message"), la candidature est créée sans message
**And** l'UI est mise à jour de manière optimiste en < 200ms avec animation "Envoyé" AVANT la confirmation serveur (NFR2)
**And** un toast undo enrichi s'affiche pendant 5 secondes : "Candidature envoyée — dates · ville · rétrocession — Annuler"
**And** la candidature est validée via le schéma Zod `candidature.schema.ts` dans l'Edge Function `create-candidature`
**And** un trigger est inséré dans `notification_queue` (événement `CANDIDATURE_RECUE`)

### Story 5.2 : Avertissement Incompatibilité

As a remplaçant,
I want être averti si l'annonce demande une spécialité que je n'ai pas ou un lieu hors de ma zone,
So that je puisse candidater en connaissance de cause.

**Acceptance Criteria:**

**Given** un remplaçant qui tape "Candidater" sur une annonce
**When** l'annonce demande une spécialité absente de son profil OU le lieu est hors de sa zone de mobilité
**Then** un avertissement non-bloquant s'affiche : "Cette annonce demande [spécialité] que vous n'avez pas dans votre profil" ou "Ce cabinet est à X km, hors de votre zone (Y km)"
**And** le remplaçant peut confirmer ou annuler — l'avertissement n'empêche pas la candidature (FR28)
**And** l'avertissement est affiché AVANT l'écran de message optionnel

### Story 5.3 : Suivi des Candidatures en Temps Réel

As a remplaçant,
I want suivre le statut de mes candidatures en temps réel,
So that je sache où en est chaque candidature sans stresser.

**Acceptance Criteria:**

**Given** un remplaçant sur son écran "Mes candidatures"
**When** il consulte la liste
**Then** chaque candidature affiche son statut en temps réel : En attente, Vu, Acceptée, Refusée, Expirée (FR29)
**And** les transitions de statut sont propagées via Supabase Realtime (< 2 secondes)
**And** le pipeline visuel est affiché : En attente → Vu → En discussion → Accepté
**And** une estimation du temps de réponse moyen est affichée ("Réponse moyenne dans cette zone : 4h")
**And** les candidatures expirées (J+7 sans réponse) passent automatiquement en statut "Expirée" et sont déplacées dans l'historique

### Story 5.4 : Candidature Offline

As a remplaçant sans connexion internet,
I want candidater à une annonce en cache et que l'envoi se fasse automatiquement au retour en ligne,
So that je ne rate pas une opportunité à cause de ma connexion.

**Acceptance Criteria:**

**Given** un remplaçant hors ligne qui consulte une annonce en cache
**When** il tape "Candidater"
**Then** la candidature est ajoutée à la file d'attente dans `useOfflineStore` (Zustand + MMKV)
**And** l'UI affiche "En attente d'envoi" avec un indicateur spécifique
**And** au retour en ligne, la candidature est envoyée automatiquement sans intervention (NFR31)
**And** l'UI se met à jour avec le statut réel après synchronisation
**And** si l'annonce a été pourvue entre-temps, un message informe le remplaçant et propose 3 annonces alternatives (FR62)

### Story 5.5 : Consultation & Évaluation des Candidatures (Titulaire)

As a titulaire,
I want consulter les candidatures reçues avec le profil vérifié de chaque candidat et son message,
So that je puisse évaluer et choisir le meilleur remplaçant.

**Acceptance Criteria:**

**Given** un titulaire sur son dashboard ou la page de son annonce
**When** il consulte les candidatures reçues
**Then** chaque candidature affiche : nom, badge RPPS vérifié, spécialités, ancienneté, taux de réactivité, badge complétude profil et le message d'accompagnement s'il existe (FR31)
**And** les candidatures sont triées par date de réception (les plus récentes en haut)
**And** le titulaire peut swiper horizontalement pour comparer les profils
**And** au tap sur un profil, la fiche détaillée du remplaçant s'ouvre

### Story 5.6 : Accepter / Refuser une Candidature

As a titulaire,
I want accepter ou refuser une candidature en 1 tap,
So that je puisse sélectionner mon remplaçant rapidement.

**Acceptance Criteria:**

**Given** un titulaire sur la fiche d'une candidature
**When** il tape "Accepter"
**Then** la candidature passe en statut "Acceptée" et le remplaçant est notifié (trigger `notification_queue` événement `CANDIDATURE_ACCEPTEE`)
**And** un prompt s'affiche : "Refuser toutes les autres candidatures ?" avec un bouton "Refuser tous les autres" pré-sélectionné (FR33)
**And** si confirmé, toutes les candidatures restantes passent en "Refusée" et les candidats sont notifiés
**And** l'annonce passe en statut "En cours" (en attente de confirmation contrat)
**And** la messagerie s'ouvre automatiquement avec le remplaçant accepté (préparation Epic 6)

**Given** un titulaire sur la fiche d'une candidature
**When** il tape "Refuser"
**Then** la candidature passe en statut "Refusée" et le remplaçant est notifié
**And** la notification est envoyée avec un ton bienveillant ("Le titulaire a choisi un autre profil cette fois")
**And** un email transactionnel basique est envoyé au titulaire pour chaque nouvelle candidature reçue (via Supabase Auth emails), même si le dispatcher E7 n'est pas encore en place — prévention du "silence mortel"

### Story 5.7 : Notification Auto des Non-Retenus

As a remplaçant non retenu,
I want être informé automatiquement si le titulaire ne me refuse pas explicitement,
So that je ne reste pas dans l'incertitude.

**Acceptance Criteria:**

**Given** un titulaire qui a accepté un candidat mais n'a pas refusé les autres
**When** 48h se sont écoulées sans action
**Then** les candidats non retenus sont automatiquement notifiés que l'annonce est pourvue (FR34)
**And** un trigger planifié avec `scheduled_at` = acceptation + 48h est inséré dans `notification_queue`
**And** les candidatures passent en statut "Refusée (auto)" dans l'historique

### Story 5.8 : Retrait de Candidature

As a remplaçant,
I want retirer ma candidature tant qu'elle n'a pas été acceptée,
So that je puisse changer d'avis sans conséquence.

**Acceptance Criteria:**

**Given** un remplaçant avec une candidature au statut "En attente"
**When** il tape "Retirer ma candidature"
**Then** la candidature est supprimée et le titulaire est notifié (FR64)
**And** le retrait n'est plus possible une fois la candidature acceptée
**And** le bouton "Retirer" est visible uniquement sur les candidatures "En attente"

### Story 5.9 : Carnet de Favoris Titulaire

As a titulaire,
I want sauvegarder un remplaçant dans mon carnet de favoris,
So that je puisse le recontacter directement la prochaine fois.

**Acceptance Criteria:**

**Given** un titulaire qui consulte le profil d'un remplaçant (après candidature ou remplacement)
**When** il tape l'icône "Sauvegarder en favori"
**Then** le remplaçant est ajouté à son carnet de favoris dans la table `favoris` (FR58)
**And** le carnet est accessible depuis le profil titulaire
**And** chaque favori affiche : nom, badge RPPS, spécialités, dernier remplacement effectué ensemble
**And** le titulaire peut retirer un favori en 1 tap

### Story 5.10 : Annonces Alternatives si Annulation

As a remplaçant dont le remplacement est annulé par le titulaire,
I want recevoir automatiquement des annonces alternatives,
So that je puisse rebondir rapidement.

**Acceptance Criteria:**

**Given** un remplaçant dont la candidature acceptée est annulée par le titulaire
**When** l'annulation est effectuée
**Then** le remplaçant est notifié immédiatement
**And** jusqu'à 3 annonces alternatives dans sa zone de mobilité et ses dates sont proposées automatiquement (FR62)
**And** les annonces alternatives sont triées par pertinence (distance, dates, rétrocession)

---

## Epic 6 : Messagerie Intégrée

Les titulaires et remplaçants peuvent communiquer par messagerie texte après acceptation de candidature.

### Story 6.1 : Conversations & Liste de Messages

As a professionnel de santé,
I want voir la liste de mes conversations actives,
So that je puisse suivre mes échanges avec les titulaires/remplaçants.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur l'onglet "Messages" (bottom tab)
**When** il consulte la liste
**Then** chaque conversation affiche : avatar + nom + dernier message + timestamp + indicateur lu/non-lu
**And** un header contextuel affiche le nom de l'annonce liée à la conversation
**And** les conversations sont triées par dernier message (les plus récentes en haut)
**And** le message d'accompagnement de la candidature (Epic 5) est affiché en tête du thread comme contexte
**And** une conversation est créée automatiquement quand une candidature est acceptée (FR35)
**And** un indicateur "Actif récemment" est affiché si l'autre utilisateur a été vu dans les 24h (pas de tracking temps réel d'un professionnel)

### Story 6.2 : Chat Temps Réel

As a professionnel de santé,
I want échanger des messages texte en temps réel avec l'autre partie,
So that je puisse poser mes questions et organiser le remplacement.

**Acceptance Criteria:**

**Given** un utilisateur dans une conversation
**When** il envoie un message texte
**Then** le message est envoyé via Supabase Realtime et affiché instantanément (UI optimiste en < 200ms)
**And** les bulles sont différenciées visuellement : dégradé pour les messages envoyés, neutre pour les messages reçus (contraste WCAG AA 4.5:1)
**And** un indicateur "Vu" s'affiche quand l'autre utilisateur a lu le message
**And** les messages sont chiffrés au repos en AES-256 (NFR11)
**And** tous les champs texte sont sanitizés (strip HTML, JavaScript, caractères spéciaux — NFR17)
**And** un trigger est inséré dans `notification_queue` (événement `MESSAGE_RECU`) pour le dispatch futur

### Story 6.3 : Masquage des Coordonnées

As a professionnel de santé,
I want que mes coordonnées personnelles soient masquées avant l'acceptation de candidature,
So that ma vie privée soit protégée.

**Acceptance Criteria:**

**Given** un remplaçant et un titulaire avant acceptation de candidature
**When** le remplaçant consulte le profil du titulaire ou vice-versa
**Then** l'email et le téléphone sont masqués ("***@***.com", "06 ** ** ** **") (FR37)
**And** un message explicatif est affiché : "Coordonnées visibles après acceptation de candidature"

**Given** une candidature acceptée
**When** la messagerie s'ouvre
**Then** les coordonnées complètes (email, téléphone) sont visibles dans la fiche profil accessible depuis le chat

### Story 6.4 : Anti-Phishing & Sécurité Messagerie

As a professionnel de santé,
I want être averti si un message contient un lien suspect,
So that je sois protégé contre les tentatives de phishing.

**Acceptance Criteria:**

**Given** un message contenant un lien externe
**When** le message est affiché dans le chat
**Then** un avertissement visuel est affiché à côté du lien : "Lien externe — vérifiez l'adresse avant de cliquer" (FR38)
**And** les liens de typosquatting sont détectés et bloqués (ex: "j1m.app" au lieu de "jim.app")
**And** l'utilisateur peut signaler un message suspect (lien vers le système de signalement Epic 12)

### Story 6.5 : Messages Offline & Synchronisation

As a professionnel de santé avec une connexion instable,
I want envoyer des messages même hors connexion,
So that la conversation ne soit pas interrompue par des problèmes de réseau.

**Acceptance Criteria:**

**Given** un utilisateur hors ligne dans une conversation
**When** il envoie un message
**Then** le message est ajouté à la file d'attente dans `useOfflineStore` (FR36)
**And** l'UI affiche le message avec un indicateur "Envoi en cours" (icône horloge)
**And** au retour en ligne, le message est envoyé automatiquement sans intervention (NFR31)
**And** l'indicateur se met à jour avec le statut réel (envoyé → vu)
**And** si l'envoi échoue après 3 tentatives, un message d'erreur est affiché avec un bouton "Réessayer"

---

## Epic 7 : Notifications & Calendrier

Les remplaçants reçoivent des alertes push pertinentes, gèrent leur calendrier, et le système relance automatiquement.

### Story 7.1 : Dispatcher Multi-Canal (Push + Email)

As a système,
I want dispatcher les notifications via push et email en consommant la file `notification_queue`,
So that chaque utilisateur reçoive ses alertes sur le canal disponible.

**Acceptance Criteria:**

**Given** des triggers dans la table `notification_queue` posés par les Epics 2, 5, 6, 9
**When** le dispatcher s'exécute (pg_cron toutes les 15 minutes pour les planifiées, trigger Postgres pour les immédiates)
**Then** l'Edge Function `dispatch-notifications` consomme les entrées et envoie via le canal approprié
**And** le push FCM/APNs est envoyé avec un payload générique (aucune donnée personnelle — NFR18)
**And** les détails sont accessibles uniquement dans l'app
**And** si l'utilisateur a désactivé les push, un email fallback est envoyé automatiquement (FR46)
**And** les notifications sont délivrées en < 10 secondes après l'événement déclencheur (NFR8)
**And** un audit trail est conservé pour chaque notification envoyée (canal, statut, timestamp)

### Story 7.2 : Notifications Annonces Matchantes

As a remplaçant,
I want recevoir une notification push quand une nouvelle annonce correspond à mes critères,
So that je ne rate aucune opportunité pertinente.

**Acceptance Criteria:**

**Given** un remplaçant avec un profil complet (spécialités, zone de mobilité)
**When** un titulaire publie une annonce qui matche sa zone et ses dates de disponibilité
**Then** une notification push est envoyée : "Nouvelle annonce à [X] km — [ville], [dates], [rétrocession]%" (FR43)
**And** au tap sur la notification, l'app s'ouvre directement sur le détail de l'annonce (deep link Expo Router)
**And** les annonces urgentes (FR59) génèrent une notification avec priorité haute
**And** maximum 3 notifications push par jour — au-delà, les notifications sont groupées dans un résumé (FR43)

### Story 7.3 : Notifications Candidatures & Messages

As a titulaire,
I want recevoir une notification quand je reçois une candidature,
So that je puisse réagir rapidement.

**Acceptance Criteria:**

**Given** un titulaire avec une annonce active
**When** un remplaçant candidate
**Then** une notification push est envoyée : "Vous avez reçu une candidature de [prénom]" (FR44)

**Given** un remplaçant avec une candidature en attente
**When** le titulaire accepte sa candidature
**Then** une notification push est envoyée : "[Prénom] a accepté votre candidature !" avec priorité haute (FR45)

**Given** un utilisateur dans une conversation active
**When** il reçoit un nouveau message
**Then** une notification push est envoyée : "Nouveau message de [prénom]"
**And** au tap, l'app s'ouvre directement dans la conversation

### Story 7.4 : Préférences de Notifications (3 Toggles)

As a professionnel de santé,
I want gérer mes préférences de notifications avec 3 toggles simples,
So that je contrôle les alertes que je reçois sans configuration complexe.

**Acceptance Criteria:**

**Given** un utilisateur dans les paramètres → Notifications
**When** il consulte les préférences
**Then** 3 toggles sont affichés : Annonces / Candidatures / Messages — tous ON par défaut
**And** désactiver un toggle coupe le push pour cette catégorie mais préserve le fallback email
**And** un toggle global "Pause notifications" met tout en pause temporairement
**And** les préférences sont persistées dans la table `profiles` et synchronisées avec le dispatcher
**And** si TOUS les push sont désactivés, un email digest hebdomadaire est activé automatiquement

### Story 7.5 : Relances Automatiques

As a système,
I want envoyer des relances automatiques pour les actions sans réponse,
So that les candidatures et annonces ne restent pas dans le vide.

**Acceptance Criteria:**

**Given** une candidature sans réponse du titulaire
**When** J+2 est atteint
**Then** une relance est envoyée au titulaire : "Vous avez une candidature en attente de [prénom]" (FR47)
**And** à J+5, le remplaçant est notifié : "Pas encore de réponse — votre candidature est toujours active"
**And** à J+7, la candidature expire automatiquement et les deux parties sont notifiées

**Given** une annonce active
**When** J-7 avant la date de début est atteint
**Then** le titulaire reçoit : "Votre annonce est-elle toujours d'actualité ?" avec boutons "Oui" / "Fermer" (FR47)

**Given** un remplacement terminé
**When** J+1 après la date de fin
**Then** les deux parties reçoivent : "Comment s'est passé le remplacement ?" avec lien vers la notation (prépare Epic 11)
**And** un rappel est envoyé à J+7 si la notation n'est pas complétée

**And** toutes les relances sont insérées dans `notification_queue` avec `scheduled_at` au moment de l'événement déclencheur

### Story 7.6 : Calendrier de Disponibilités

As a remplaçant,
I want gérer mon calendrier de disponibilités,
So that les titulaires sachent quand je suis disponible et que les annonces me soient proposées en conséquence.

**Acceptance Criteria:**

**Given** un remplaçant sur l'écran "Calendrier"
**When** il ajoute des périodes de disponibilité (date début + date fin)
**Then** les disponibilités sont sauvegardées dans la table `calendrier`
**And** le calendrier est affiché visuellement avec les périodes disponibles (vert) et indisponibles (gris)
**And** les notifications d'annonces matchantes tiennent compte des disponibilités (FR43 — pas de push pour une annonce sur des dates où il est indisponible)
**And** après acceptation d'une candidature, le calendrier est mis à jour automatiquement (dates occupées)
**And** une notification hebdomadaire est envoyée : "Vos disponibilités sont-elles à jour ?" si pas de mise à jour depuis 7 jours

---

## Epic 8 : Contrats IA

Les utilisateurs peuvent générer un contrat pré-rempli conforme, le consulter et le télécharger en PDF.

### Story 8.1 : Génération de Contrat Pré-Rempli

As a titulaire ou remplaçant après acceptation de candidature,
I want générer un contrat de remplacement pré-rempli automatiquement,
So that je n'aie pas à chercher un modèle ni remplir manuellement les champs.

**Acceptance Criteria:**

**Given** une candidature acceptée avec les profils titulaire et remplaçant complets
**When** l'un des deux clique "Générer le contrat" dans la conversation ou la fiche candidature
**Then** l'Edge Function `generate-contrat` génère un contrat en JSONB dans la table `contrats` avec :
  - Champs factuels pré-remplis : noms, RPPS des deux parties, dates du remplacement, adresse du cabinet, taux de rétrocession (FR39)
  - Clauses obligatoires verrouillées : assurance RCP, durée, obligations légales (FR41)
  - Clauses optionnelles éditables : conditions particulières, horaires, logement (FR41)
**And** le contrat est lié à l'annonce et aux deux profils
**And** la logique métier est dans `supabase/functions/_shared/contrat.service.ts` (portable vers NestJS)
**And** le template est versionné pour permettre des mises à jour futures

### Story 8.2 : Résumé Visuel In-App (5 Points)

As a professionnel de santé,
I want voir un résumé clair du contrat en 5 points avant de confirmer,
So that je sois rassuré sans avoir à lire un document juridique complet.

**Acceptance Criteria:**

**Given** un contrat généré
**When** l'utilisateur ouvre le contrat dans l'app
**Then** un résumé visuel est affiché avec 5 points clés + check vert pour chaque :
  1. Identités vérifiées (noms + RPPS des deux parties)
  2. Dates du remplacement
  3. Adresse du cabinet
  4. Taux de rétrocession convenu
  5. Assurance RCP mentionnée
**And** le ton est rassurant : "Tout est conforme" (pas "Vérifiez les clauses")
**And** un badge "Conforme Ordre MK" est affiché (si le template a été validé)
**And** un disclaimer est visible sur chaque écran : "Ce document ne constitue pas un conseil juridique" (FR42)
**And** le composant `contrat-summary.tsx` utilise le rendu React Native in-app (pas le PDF)

### Story 8.3 : Confirmation Double & Édition Clauses Optionnelles

As a titulaire ou remplaçant,
I want confirmer le contrat et pouvoir modifier les clauses optionnelles,
So that le contrat reflète nos accords spécifiques.

**Acceptance Criteria:**

**Given** un utilisateur sur le résumé du contrat
**When** il clique "Modifier les clauses optionnelles"
**Then** seules les clauses optionnelles sont éditables (conditions particulières, horaires, logement)
**And** les clauses obligatoires sont verrouillées et non-éditables (affichées en gris avec icône cadenas) (FR41)

**Given** un contrat prêt à être confirmé
**When** le titulaire clique "Confirmer"
**Then** le contrat passe en statut "En attente de confirmation remplaçant"
**And** le remplaçant reçoit une notification : "Contrat prêt — confirmez pour finaliser"

**Given** un contrat confirmé par le titulaire
**When** le remplaçant clique "Confirmer"
**Then** le contrat passe en statut "Confirmé par les deux parties"
**And** l'annonce passe automatiquement en statut "Pourvue" (FR18)
**And** un trigger est inséré dans `notification_queue` pour les deux parties

### Story 8.4 : Téléchargement PDF

As a professionnel de santé,
I want télécharger le contrat en PDF,
So that je puisse le conserver, l'imprimer ou le transmettre.

**Acceptance Criteria:**

**Given** un contrat confirmé par les deux parties
**When** l'utilisateur clique "Télécharger le PDF"
**Then** un PDF est généré via `@react-pdf/renderer` à partir des données JSONB du contrat (FR40)
**And** le PDF est téléchargé sur l'appareil et accessible hors ligne
**And** le PDF reprend la mise en page officielle avec toutes les clauses (obligatoires + optionnelles)
**And** le disclaimer "Ne constitue pas un conseil juridique" est présent sur le PDF (FR42)
**And** le contrat est archivé et consultable dans l'historique du profil de chaque partie

---

## Epic 9 : Paiement Sécurisé (Stripe Connect)

Les remplaçants peuvent payer la rétrocession au titulaire via Stripe Connect. Zéro impayé.

### Story 9.1 : Onboarding Stripe Connect (Remplaçant)

As a remplaçant,
I want configurer mon compte Stripe Connect pour effectuer des paiements de rétrocession,
So that je puisse payer les titulaires de manière sécurisée via JIM.

**Acceptance Criteria:**

**Given** un remplaçant vérifié RPPS dans les paramètres → Paiement
**When** il clique "Configurer le paiement"
**Then** le flux d'onboarding Stripe Connect s'ouvre (KYC : identité, IBAN, justificatifs)
**And** un justificatif d'assurance RCP est requis avant activation du compte
**And** le statut d'onboarding est suivi : "En cours", "Vérifié", "Action requise"
**And** une fois vérifié, le remplaçant peut initier des paiements de rétrocession
**And** un message explicatif est affiché : "Service de sécurisation professionnelle — zéro impayé" (jamais "commission")
**And** la logique métier est dans `supabase/functions/_shared/stripe.service.ts` (portable)

### Story 9.2 : Onboarding Stripe Connect (Titulaire)

As a titulaire,
I want configurer mon compte Stripe Connect pour recevoir les rétrocessions,
So that je sois payé automatiquement et en sécurité.

**Acceptance Criteria:**

**Given** un titulaire vérifié RPPS dans les paramètres → Paiement
**When** il clique "Configurer la réception des paiements"
**Then** le flux d'onboarding Stripe Connect s'ouvre (KYC : identité, IBAN)
**And** le statut d'onboarding est suivi et affiché dans le profil
**And** une fois vérifié, le titulaire peut recevoir des rétrocessions
**And** pas de justificatif RCP requis côté titulaire (déjà couvert par le contrat)

### Story 9.3 : Calcul & Initiation du Paiement de Rétrocession

As a remplaçant après un remplacement terminé,
I want que JIM calcule automatiquement la rétrocession et me permette de payer le titulaire,
So that le paiement soit transparent et sans litige.

**Acceptance Criteria:**

**Given** un remplacement terminé (dates de fin dépassées) avec contrat confirmé
**When** le remplaçant ouvre la section "Paiement" du remplacement
**Then** JIM affiche le calcul de rétrocession : montant total encaissé (saisi par le remplaçant) × taux de rétrocession convenu dans le contrat = montant à reverser au titulaire
**And** le montant encaissé peut être renseigné via 3 modes : import fichier CSV/PDF depuis le logiciel de facturation (parsing automatique), intégration API directe (quand disponible), ou saisie manuelle (fallback)
**And** pendant la période de lancement (flag `launch_period_active` = true), la commission est 0% avec le message : "Commission JIM : 0€ — offert pendant le lancement"
**And** après la période de lancement, la commission est affichée : 1% du montant pour la version gratuite, 0% avec abonnement Pro (5,90€/mois)
**And** le remplaçant voit le détail : "Vous avez encaissé X€ → Vous reversez Y€ au titulaire (Z% rétrocession) → Commission JIM : W€"
**And** le titulaire voit le montant attendu de son côté
**And** le remplaçant valide le montant et confirme le paiement en 1 tap
**And** le flux inverse est implémenté via Stripe Connect : le remplaçant (source) paye le titulaire (destination)
**And** un trigger est inséré dans `notification_queue` (événement `PAIEMENT_INITIE`)

### Story 9.4 : Traitement du Paiement & Confirmation

As a titulaire,
I want recevoir la rétrocession sur mon compte bancaire sous 48-72h,
So that je sois payé à temps sans avoir à relancer.

**Acceptance Criteria:**

**Given** un paiement initié par le remplaçant
**When** Stripe traite le paiement
**Then** le titulaire reçoit le montant sur son IBAN sous 48-72h (délai standard Stripe)
**And** les deux parties reçoivent une notification de confirmation : "Paiement de X€ confirmé"
**And** un reçu est généré et téléchargeable pour les deux parties
**And** l'historique des paiements est consultable dans le profil de chaque partie
**And** les données financières transitent par Stripe et ne sont PAS stockées dans la base JIM

### Story 9.5 : Médiation & Litiges

As a professionnel de santé en désaccord sur le montant de rétrocession,
I want contester un paiement via un mécanisme de médiation,
So that le litige soit résolu de manière équitable.

**Acceptance Criteria:**

**Given** un paiement en attente de validation par le remplaçant
**When** le titulaire conteste le montant
**Then** le paiement est bloqué sur un compte séquestre Stripe jusqu'à résolution
**And** les deux parties peuvent échanger via la messagerie pour trouver un accord
**And** si accord, le remplaçant ajuste le montant et confirme
**And** si pas d'accord après 7 jours, une escalade vers le support JIM est proposée (formulaire Epic 12)
**And** un trigger est inséré dans `notification_queue` pour chaque étape du litige

### Story 9.6 : Abonnement Pro

As a remplaçant fréquent,
I want souscrire à l'abonnement Pro à 5,90€/mois,
So that je ne paie aucune commission sur mes rétrocessions.

**Acceptance Criteria:**

**Given** un remplaçant avec un compte Stripe Connect actif et la période de lancement terminée (`launch_period_active` = false)
**When** il clique "Passer à Pro" dans les paramètres
**Then** un abonnement mensuel Stripe Billing est créé à 5,90€/mois
**And** la commission sur les rétrocessions passe de 1% à 0% immédiatement
**And** le profil affiche un badge "Pro"
**And** l'abonnement est annulable à tout moment — la commission repasse à 1% au prochain cycle
**And** un email de confirmation est envoyé avec le récapitulatif
**And** pendant la période de lancement gratuite, l'option Pro n'est PAS proposée (0% déjà offert à tous)
**And** à la fin de la période de lancement, un message incite : "La période de lancement est terminée — passez Pro pour garder 0% de commission"

---

## Epic 10 : Conformité RGPD & Sécurité

Les utilisateurs peuvent exporter leurs données et supprimer leur compte. Le système protège contre les abus.

### Story 10.1 : Export des Données Personnelles (RGPD)

As a professionnel de santé,
I want exporter toutes mes données personnelles en un clic,
So that je puisse exercer mon droit d'accès RGPD.

**Acceptance Criteria:**

**Given** un utilisateur authentifié dans les paramètres → RGPD
**When** il clique "Exporter mes données"
**Then** l'Edge Function `export-data` génère un fichier contenant toutes ses données personnelles (profil, annonces, candidatures, messages, contrats, paiements)
**And** le fichier est disponible en JSON et PDF (NFR34)
**And** la génération se complète en moins de 24h avec un lien de téléchargement unique (expiration 48h)
**And** une notification est envoyée quand l'export est prêt
**And** les données financières Stripe sont incluses sous forme de reçu (pas de données bancaires brutes)

### Story 10.2 : Suppression de Compte (Droit à l'Oubli)

As a professionnel de santé,
I want demander la suppression de mon compte et de mes données,
So that je puisse exercer mon droit à l'oubli RGPD.

**Acceptance Criteria:**

**Given** un utilisateur authentifié dans les paramètres → RGPD
**When** il clique "Supprimer mon compte"
**Then** une confirmation explicite est demandée avec un message clair sur les conséquences
**And** l'Edge Function `delete-account` planifie la suppression effective sous 30 jours (FR9, NFR35)
**And** un email de confirmation est envoyé avec un lien "Annuler la suppression" (valable 30 jours)
**And** à l'exécution : données personnelles supprimées, avis anonymisés ("Un kinésithérapeute vérifié"), historique Stripe conservé 6 ans (obligation fiscale), annonces pourvues anonymisées, analytics agrégées conservées (NFR37)
**And** le compte Supabase Auth est désactivé puis supprimé

### Story 10.3 : Rate Limiting & Protection Contre les Abus

As a système,
I want limiter les tentatives de création de compte et les requêtes abusives,
So that la plateforme soit protégée contre les attaques et le spam.

**Acceptance Criteria:**

**Given** un utilisateur ou une IP
**When** il dépasse les seuils autorisés
**Then** la création de compte est limitée à 3 tentatives par IP/appareil par jour (NFR15, FR53)
**And** la recherche est limitée à 100 requêtes/heure et 500/jour par compte (NFR16)
**And** la détection de patterns massifs (> 5 comptes même IP) bloque l'IP et génère une alerte admin
**And** les limites sont implémentées dans les Edge Functions avec des headers de réponse standard (`X-RateLimit-Remaining`)
**And** un message utilisateur clair est affiché en cas de blocage : "Trop de tentatives — réessayez dans X minutes"

### Story 10.4 : Détection Mots-Clés Sensibles

As a système,
I want détecter les mots-clés sensibles (données de santé) dans les champs texte libre,
So that aucune donnée médicale ne soit stockée accidentellement dans JIM.

**Acceptance Criteria:**

**Given** un utilisateur qui saisit du texte dans un champ libre (description annonce, message, profil)
**When** un mot-clé sensible est détecté (ex: "maladie", "cancer", "burn-out", "arrêt maladie", "grossesse")
**Then** un avertissement non-bloquant est affiché : "Cette information semble contenir des données de santé. Nous vous recommandons de ne mentionner que les dates et les infos pratiques." (FR54)
**And** l'utilisateur peut choisir de reformuler ou de confirmer
**And** la détection se fait côté client (pas de stockage du texte original si reformulé)
**And** les mots-clés sont configurables sans déploiement (table de config)

### Story 10.5 : Logs d'Audit

As a système,
I want générer des logs d'audit pour les actions critiques,
So that les actions soient traçables en cas de litige ou d'incident.

**Acceptance Criteria:**

**Given** une action critique (connexion, publication, candidature, modification profil, suppression)
**When** l'action est exécutée
**Then** un log est enregistré dans la table `audit_logs` avec : user_id, action, timestamp, IP, détails (FR56)
**And** les logs d'audit sont conservés pendant 1 an (NFR19)
**And** les logs de debug sont conservés pendant 90 jours (NFR20)
**And** les logs ne contiennent jamais de données sensibles (mots de passe, tokens, données bancaires)
**And** les logs sont accessibles par l'admin dans le dashboard (Epic 12)

### Story 10.6 : Détection Comptes en Double

As a système,
I want détecter les comptes en double (même RPPS, emails différents),
So that les usurpations d'identité et les doublons soient empêchés.

**Acceptance Criteria:**

**Given** un utilisateur qui s'inscrit avec un RPPS
**When** ce RPPS est déjà associé à un autre compte
**Then** le second compte est bloqué immédiatement (FR60)
**And** un message est affiché : "Ce numéro RPPS est déjà associé à un compte. Récupérer mon compte ?"
**And** un flux de récupération est proposé (envoi d'un magic link à l'email du compte original)
**And** une alerte admin est générée pour investigation

---

## Epic 11 : Réputation, Parrainage & Extensions de Profil

Les utilisateurs peuvent noter mutuellement, consulter les avis, parrainer des confrères, changer de rôle et proposer des remplacements à leurs favoris.

### Story 11.1 : Notation Mutuelle Post-Remplacement

As a professionnel de santé après un remplacement terminé,
I want noter l'autre partie,
So that la communauté bénéficie de retours d'expérience fiables.

**Acceptance Criteria:**

**Given** un remplacement terminé (dates de fin dépassées + contrat confirmé)
**When** l'utilisateur reçoit la notification "Comment s'est passé le remplacement ?" (trigger posé par Epic 7)
**Then** un écran de notation s'affiche avec : étoiles (1-5) + tags sélectionnables (ponctuel, professionnel, recommandé, communication) (FR57)
**And** seuls les utilisateurs ayant un remplacement terminé ensemble peuvent se noter
**And** les avis sont anonymes pendant 7 jours (le nom de l'auteur n'est pas visible)
**And** après 7 jours, l'avis est attribué nommément
**And** la notation se complète en 3 taps maximum (étoiles + 1 tag + confirmer)

### Story 11.2 : Consultation des Avis & Score de Fiabilité

As a professionnel de santé,
I want consulter les avis et notes reçus par un autre professionnel,
So that je puisse évaluer sa fiabilité avant de collaborer.

**Acceptance Criteria:**

**Given** un utilisateur qui consulte le profil d'un autre professionnel
**When** il accède à la section "Avis"
**Then** les notes et avis sont affichés avec : note moyenne, nombre d'avis, tags les plus fréquents, liste des avis (FR66)
**And** les avis de moins de 7 jours sont affichés sans nom d'auteur
**And** un score de fiabilité est calculé à partir des avis + ancienneté + nombre de remplacements
**And** le score est visible sur la fiche candidature (Epic 5) et le profil public

### Story 11.3 : Parrainage & Badge Ambassadeur

As a professionnel de santé,
I want parrainer un confrère via un code unique,
So that je puisse inviter mes collègues et être récompensé.

**Acceptance Criteria:**

**Given** un utilisateur authentifié dans les paramètres → Parrainage
**When** il consulte son code de parrainage
**Then** un code unique est affiché (ex: "LEA-JIM-7412") avec des boutons de partage en 1 tap (SMS, WhatsApp, email, copier le lien) (FR49)
**And** le lien de parrainage pointe vers la landing page (Epic 13) avec le code pré-rempli
**And** la récompense est déclenchée quand le filleul s'inscrit ET complète sa première action (candidature ou publication)
**And** le parrain reçoit un badge "Ambassadeur JIM" visible sur son profil (FR50)
**And** un compteur est affiché : "X confrères parrainés, Y actifs"

### Story 11.4 : Changement de Rôle

As a professionnel de santé,
I want changer de rôle (remplaçant vers titulaire ou inversement),
So that mon profil s'adapte à mon évolution de carrière sans créer un nouveau compte.

**Acceptance Criteria:**

**Given** un utilisateur authentifié dans les paramètres
**When** il clique "Changer de rôle" et sélectionne le nouveau rôle
**Then** le rôle actif est mis à jour dans la table `profiles` (FR63)
**And** l'écran d'accueil s'adapte immédiatement au nouveau rôle (remplaçant = recherche, titulaire = dashboard)
**And** l'historique factuel est conservé (nombre de remplacements, ancienneté, avis)
**And** les données spécifiques au rôle précédent restent accessibles dans l'historique
**And** aucune réinscription n'est nécessaire

### Story 11.5 : Proposition Directe via Favoris

As a titulaire,
I want proposer un remplacement directement à un remplaçant de mon carnet de favoris,
So that je puisse recontacter un bon remplaçant sans publier d'annonce publique.

**Acceptance Criteria:**

**Given** un titulaire dans son carnet de favoris (créé dans Epic 5)
**When** il tape "Proposer un remplacement" sur un favori
**Then** un formulaire simplifié s'ouvre (dates + rétrocession — le reste est hérité du profil cabinet) (FR65)
**And** la proposition est envoyée directement au remplaçant comme une candidature inversée
**And** le remplaçant reçoit une notification : "[Prénom] vous propose un remplacement — [dates], [ville], [rétrocession]%"
**And** le remplaçant peut accepter ou décliner en 1 tap
**And** si accepté, le flux standard continue (messagerie → contrat → paiement)
**And** l'annonce n'est PAS publiée publiquement sauf si le remplaçant décline

---

## Epic 12 : Administration & Modération

L'administrateur supervise la plateforme, les utilisateurs peuvent signaler du contenu ou contacter le support.

### Story 12.1 : Dashboard Admin Opérationnel

As a administrateur (Nathan),
I want consulter un dashboard opérationnel en un coup d'œil,
So that je puisse superviser la santé de la plateforme sans fouiller dans les logs.

**Acceptance Criteria:**

**Given** l'administrateur connecté sur le dashboard admin (web)
**When** il ouvre le dashboard
**Then** les métriques suivantes sont affichées en temps réel (FR55) :
  - Annonces : actives / agrégées / natives / pourvues / expirées
  - Doublons fusionnés (dernière 24h)
  - Inscriptions : total / vérifiées RPPS / en attente / bloquées
  - Candidatures : envoyées / acceptées / taux de conversion
  - Alertes : automatisations en échec, sources d'agrégation en erreur, signalements en attente
**And** les alertes critiques (P1) sont mises en évidence visuellement
**And** les logs d'audit (Epic 10) sont consultables et filtrables depuis le dashboard
**And** le dashboard est accessible uniquement aux comptes avec rôle "admin" (RLS)

### Story 12.2 : Signalement de Contenu ou Comportement

As a professionnel de santé,
I want signaler un contenu inapproprié ou un comportement abusif,
So that la plateforme reste un espace de confiance.

**Acceptance Criteria:**

**Given** un utilisateur qui consulte un profil, une annonce ou un message
**When** il tape l'icône "Signaler" (accessible sur chaque contenu)
**Then** un formulaire de signalement s'ouvre avec des catégories pré-définies : "Faux profil", "Annonce frauduleuse", "Comportement inapproprié", "Contenu offensant", "Autre" (FR67)
**And** un champ texte libre optionnel permet de préciser
**And** le signalement est enregistré dans la table `signalements` avec le contenu signalé, l'auteur, la catégorie et le timestamp
**And** une alerte est générée dans le dashboard admin (Epic 12.1)
**And** un message de confirmation est affiché : "Merci pour votre signalement — on s'en occupe"

### Story 12.3 : Suspension de Compte & Modération

As a administrateur,
I want suspendre un compte ou masquer un contenu suite à un signalement,
So that je puisse agir rapidement contre les abus.

**Acceptance Criteria:**

**Given** un administrateur qui consulte un signalement dans le dashboard
**When** il examine le contenu signalé
**Then** il peut "Suspendre le compte" de l'utilisateur signalé — le compte est désactivé, l'utilisateur ne peut plus se connecter (FR68)
**And** il peut "Masquer le contenu" — l'annonce ou le message est retiré de la vue publique
**And** il peut "Rejeter le signalement" — le contenu est conservé et le signalement fermé
**And** un email est envoyé à l'utilisateur suspendu avec la raison et la procédure de contestation
**And** l'action de modération est loguée dans les audit logs (Epic 10)

### Story 12.4 : Alertes Automatisations

As a administrateur,
I want être alerté si une automatisation échoue ou performe anormalement,
So that je puisse intervenir rapidement avant que ça impacte les utilisateurs.

**Acceptance Criteria:**

**Given** les automatisations du système (agrégation, relances, notifications, re-vérification RPPS)
**When** une automatisation échoue ou ses métriques sont anormales (taux de succès < seuil, erreurs, 0 résultats)
**Then** une alerte est générée dans le dashboard admin avec : nom de l'automatisation, nature du problème, dernière exécution réussie, détails d'erreur (FR69)
**And** les alertes P1 (fraude, bug critique) génèrent une notification push immédiate à Nathan
**And** les alertes P2 (performance dégradée, feature request) sont résumées dans un digest quotidien
**And** les alertes P3 (FAQ, info) sont consultables uniquement dans le dashboard

### Story 12.5 : Formulaire de Support Intégré

As a professionnel de santé,
I want contacter le support via un formulaire intégré dans l'app,
So that je puisse obtenir de l'aide sans quitter JIM.

**Acceptance Criteria:**

**Given** un utilisateur dans les paramètres → Aide & Support
**When** il clique "Contacter le support"
**Then** un formulaire s'ouvre avec : catégorie (Bug, Question, Suggestion, Partenariat), sujet, description, capture d'écran optionnelle (FR70)
**And** le formulaire est pré-rempli avec le contexte : version app, appareil, OS, dernière action
**And** l'envoi génère un email à l'adresse support de Nathan + une entrée dans le dashboard admin
**And** un message de confirmation est affiché avec un délai de réponse estimé : "On vous répond sous 48h"

---

## Epic 13 : Landing Page Web & Outils Gratuits *(parallélisable avec Epics 1-5)*

Les visiteurs découvrent JIM via le web, téléchargent l'app via liens directs stores, et accèdent à des outils gratuits. À déployer AVANT la beta.

### Story 13.1 : Landing Page & Hero Section

As a visiteur qui découvre JIM,
I want comprendre ce qu'est JIM et télécharger l'app en quelques secondes,
So that je puisse commencer à utiliser la plateforme rapidement.

**Acceptance Criteria:**

**Given** un visiteur sur jobinmed.com (ou jim.app)
**When** la page s'affiche
**Then** le LCP est inférieur à 2 secondes (NFR6)
**And** la hero section affiche : titre accrocheur, sous-titre explicatif, et le narratif fondateur ("Créé par un kiné, pour les kinés")
**And** deux boutons de téléchargement sont proéminents : "Télécharger sur l'App Store" (lien direct Apple) et "Télécharger sur Google Play" (lien direct Google)
**And** sur mobile web, un Smart App Banner est affiché automatiquement (détection iOS/Android) proposant d'ouvrir ou télécharger l'app
**And** la page est en SSG (Next.js App Router) pour le SEO
**And** les meta tags Open Graph et Twitter Card sont configurés pour le partage social

### Story 13.2 : Pages Marketing (Fonctionnalités, Tarifs, À Propos)

As a visiteur,
I want comprendre les fonctionnalités, les tarifs et qui est derrière JIM,
So that je puisse me convaincre de télécharger l'app.

**Acceptance Criteria:**

**Given** un visiteur qui navigue sur le site
**When** il accède aux pages secondaires
**Then** la page "Fonctionnalités" présente les 5 piliers différenciateurs (agrégation, fraîcheur, formations, paiement, RPPS)
**And** la page "Tarifs" affiche clairement : gratuit pendant le lancement, puis 1% commission (0% avec Pro à 5,90€/mois). Jamais le mot "commission" — "Service de sécurisation professionnelle"
**And** la page "À propos" raconte l'histoire de Nathan (kiné fondateur) — le narratif fondateur EST le marketing
**And** chaque page a un CTA vers le téléchargement de l'app
**And** les pages sont en SSG avec des meta tags SEO optimisés pour les mots-clés cibles ("remplacement kinésithérapeute", "trouver remplaçant kiné")

### Story 13.3 : Deep Links & Annonces Publiques SEO

As a visiteur qui arrive via un lien partagé ou Google,
I want voir le détail d'une annonce sur le web et être redirigé vers l'app,
So that je puisse candidater directement.

**Acceptance Criteria:**

**Given** un visiteur qui ouvre un lien `jim.app/annonce/[id]`
**When** la page s'affiche
**Then** le détail de l'annonce est affiché en SSR (dates, ville, rétrocession, type de cabinet) pour le SEO
**And** si l'app est installée, un deep link ouvre l'annonce dans l'app (Expo Router + Universal Links iOS + App Links Android)
**And** si l'app n'est pas installée, un CTA "Télécharger JIM pour candidater" est affiché avec les liens stores
**And** les annonces publiques sont indexées par Google (mots-clés : "remplacement kiné [ville]")
**And** le lien de parrainage `jim.app/invite/[code]` est géré avec le code pré-rempli à l'inscription

### Story 13.4 : Calculateur de Rétrocession Connecté

As a kinésithérapeute,
I want calculer ma rétrocession nette à partir de mes données de facturation réelles,
So that je connaisse le montant exact à reverser sans estimation approximative.

**Acceptance Criteria:**

**Given** un kinésithérapeute sur la page calculateur ou dans l'app (section Paiement)
**When** il connecte ses données de facturation
**Then** 3 modes de saisie sont disponibles :
  1. **Import fichier** : upload CSV/PDF exporté depuis son logiciel de facturation (Kiné4000, Topaze, Milo, etc.) — parsing automatique des montants encaissés par période
  2. **Intégration API** (quand disponible) : connexion directe au logiciel de facturation via API/scraping — récupération automatique des honoraires encaissés sur la période du remplacement
  3. **Saisie manuelle** (fallback) : saisie du montant brut encaissé
**And** le calcul affiche le détail réel : montant encaissé × taux de rétrocession = montant à reverser, avec déduction charges (URSSAF, CARPIMKO, estimation impôts) pour le net remplaçant
**And** sur la landing page (sans inscription), seule la saisie manuelle est disponible comme outil SEO d'acquisition
**And** dans l'app (connecté), l'import fichier et l'intégration API sont disponibles
**And** la page landing est optimisée SEO pour "calculateur rétrocession kiné"
**And** un CTA invite à télécharger JIM pour accéder au calcul connecté

### Story 13.5 : Header, Footer & Navigation Web

As a visiteur,
I want naviguer facilement sur le site avec un header et footer cohérents,
So that je trouve rapidement les informations dont j'ai besoin.

**Acceptance Criteria:**

**Given** un visiteur sur n'importe quelle page du site
**When** il consulte le header
**Then** le logo JIM, les liens de navigation (Fonctionnalités, Tarifs, À propos, Calculateur) et les boutons de téléchargement sont affichés
**And** le header est responsive (hamburger menu sur mobile)

**Given** un visiteur sur n'importe quelle page du site
**When** il consulte le footer
**Then** les liens utiles sont affichés : CGU, Politique de confidentialité, Contact, liens stores
**And** le copyright et les mentions légales sont présents
**And** le design utilise la palette terracotta chaud (tokens partagés via `tailwind.config.js` racine)
