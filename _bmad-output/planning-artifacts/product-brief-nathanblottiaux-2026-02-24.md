---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - 'brainstorming-session-2026-02-22.md'
  - 'market-jim-plateforme-remplacement-kinesitherapeutes-research-2026-02-22.md'
  - 'domain-jim-remplacement-kinesitherapeutes-france-research-2026-02-23.md'
  - 'domain-kinesitherapie-france-contraintes-app-research-2026-02-23.md'
  - 'technical-databases-storage-hds-jim-research-2026-02-24.md'
  - 'technical-backend-technologies-healthcare-jim-research-2026-02-24.md'
  - 'cybersecurity-healthcare-france-research-2026-02-24.md'
  - 'technical-mobile-crossplatform-flutter-reactnative-research-2026-02-24.md'
  - 'backup-disaster-recovery-hds-france-research-2026-02-24.md'
  - 'cloud-hosting-hds-france-infrastructure-research-2026-02-24.md'
  - 'technical-stack-sauvegarde-securite-jim-research-2026-02-24.md'
date: 2026-02-24
author: NathanBlottiaux
---

# Product Brief: JIM (Job In Med)

## Executive Summary

JIM (Job In Med) est une plateforme tout-en-un destinée aux kinésithérapeutes libéraux en France, conçue pour résoudre un problème chronique : l'incapacité des titulaires à trouver des remplaçants fiables, et des remplaçants — en particulier les jeunes diplômés — à accéder aux opportunités de remplacement.

Sur un marché de 83 000 kinés libéraux dont 52 000 à 60 000 directement concernés par le remplacement, aucune solution existante ne couvre le parcours complet : de la recherche d'un remplacement au paiement sécurisé de la rétrocession, en passant par la génération automatique du contrat et sa transmission à l'Ordre. JIM comble cette lacune en proposant un écosystème intégré combinant mise en relation vérifiée RPPS, paiement sécurisé via Stripe Connect, génération de contrats par IA avec envoi direct au Conseil Départemental de l'Ordre, et un catalogue de formations professionnelles accessibles sans quitter la plateforme.

Le MVP cible les kinésithérapeutes comme marché d'entrée, avec une vision d'extension à l'ensemble des professions de santé libérales — à commencer par les médecins libéraux — représentant un marché 10x plus large.

---

## Core Vision

### Problem Statement

Les kinésithérapeutes libéraux en France font face à une crise structurelle du remplacement. Les titulaires peinent chroniquement à trouver des remplaçants fiables pour leurs congés, formations DPC ou arrêts maladie. Les remplaçants — en particulier les jeunes diplômés qui sortent des 49 IFMK chaque année sans réseau professionnel ni connaissance des outils existants — n'ont aucun moyen centralisé et fiable d'accéder aux opportunités.

Le parcours actuel est fragmenté : les annonces sont dispersées sur des groupes Facebook (35 000+ membres dans le groupe principal), Rempleo (46 000 utilisateurs), App'Ines (28 000 kinés) et Physiorama. Aucun de ces outils ne couvre le parcours complet. Les contrats sont informels ou inexistants, les paiements de rétrocession sont sujets à des retards et impayés, et les profils ne sont pas vérifiés professionnellement.

### Problem Impact

- **34% des kinés libéraux** présentent des signes de burn-out, aggravé par l'impossibilité de prendre des congés sereinement
- Des remplaçants se déplacent à travers la France pour des remplacements trouvés sur Facebook et se retrouvent sans contrat signé au dernier moment
- Les retards et impayés de rétrocession créent des litiges coûteux et longs à résoudre
- Les jeunes diplômés (3 000+/an) entrent dans la profession sans réseau, sans connaissance des outils, et sans accompagnement sur les aspects administratifs et contractuels du remplacement
- Les 33 500 kinés diplômés à l'étranger (30,8% des inscrits) sont particulièrement exclus des réseaux informels français

### Why Existing Solutions Fall Short

| Solution | Lacune principale |
|----------|------------------|
| **Groupes Facebook** | Aucune vérification RPPS, pas de contrat, pas de paiement, algorithme opaque, annulations sans conséquence |
| **Rempleo** (46 000 users) | Pas de paiement intégré, pas de vérification RPPS formelle, messagerie perfectible |
| **App'Ines** (28 000 kinés) | Pas de paiement intégré, limitée à la région parisienne, multi-professions = dilution |
| **Physiorama** | Interface vieillissante, pas responsive mobile, pas de messagerie, pas de contrat, pas de paiement |
| **Tous les concurrents** | Aucun ne propose de génération de contrat par IA, d'envoi automatique à l'Ordre, de catalogue de formations intégré, ni de paiement sécurisé de la rétrocession |

### Proposed Solution

JIM est un écosystème complet pour les kinésithérapeutes libéraux qui intègre dans une seule plateforme :

1. **Mise en relation vérifiée** — Chaque profil est vérifié via l'API Annuaire Santé (RPPS). Seuls de vrais professionnels de santé accèdent à la plateforme.
2. **Paiement sécurisé de la rétrocession** — Via Stripe Connect, éliminant les impayés et retards. Commission de 1,5% supportée par le remplaçant en version gratuite, 0% avec l'abonnement Pro à 5,90€/mois.
3. **Génération de contrats par IA** — Contrat de remplacement conforme aux exigences de l'Ordre, généré automatiquement et transmis directement au Conseil Départemental concerné.
4. **Catalogue de formations intégré** — Formations DPC et continues référencées et accessibles avec inscription sans quitter la plateforme.
5. **Accompagnement des débutants** — Webinaires explicatifs et ressources éducatives pour les jeunes diplômés entrant dans la profession.
6. **Carte interactive géolocalisée** — Recherche visuelle des remplacements disponibles avec filtres (lieu, dates, rétrocession, spécialités, logement).
7. **Messagerie intégrée** — Communication sécurisée entre titulaires et remplaçants sans fuite vers WhatsApp ou Messenger.

### Key Differentiators

| Différenciateur | Détail | Défendabilité |
|----------------|--------|---------------|
| **Paiement sécurisé Stripe Connect** | Unique sur le marché — aucun concurrent ne le propose | Élevée — complexe techniquement et réglementairement à reproduire |
| **Vérification RPPS automatique** | Via API Annuaire Santé — niveau de confiance inégalé | Élevée — intégration technique spécifique |
| **Contrat IA + envoi à l'Ordre** | Génération automatique et transmission directe au Conseil Départemental | Très élevée — combinaison IA + partenariat institutionnel |
| **Catalogue de formations intégré** | Inscription aux formations DPC/continues sans quitter JIM | Élevée — agrégation et partenariats |
| **Écosystème complet** | Seule plateforme couvrant recherche → contrat → paiement → formation | Très élevée — effet réseau + habitudes utilisateur |
| **Vision multi-professions** | Extension aux médecins libéraux puis à toutes les professions de santé | Architecture technique conçue dès le départ pour l'extension |

---

## Target Users

### Primary Users

#### Persona 1 : Léa — La jeune remplaçante (segment décideur d'adoption)

| Attribut | Détail |
|----------|--------|
| **Âge** | 24 ans |
| **Situation** | Diplômée IFMK depuis 6 mois, remplaçante exclusive |
| **Localisation** | Montpellier, mobile dans un rayon de 100km |
| **Revenus** | ~29 800€/an brut (BNC), variable selon les missions |
| **Équipement** | Smartphone (usage principal), rarement sur desktop |
| **Réseau** | Limité — ses anciens de promo et le groupe Facebook de sa ville, ajouté par le BDE |

**Contexte :** Léa vient de sortir d'IFMK. Le BDE l'a ajoutée au groupe Facebook "Remplacements Kiné Montpellier" mais elle ne connaît pas les autres groupes régionaux ni les plateformes comme Rempleo. Elle se renseigne auprès de ses pairs, se compare à eux, et apprend sur le tas les aspects contractuels et fiscaux du remplacement.

**Frustrations actuelles :**
- Ne sait pas où trouver toutes les annonces — dépend de ce que le BDE et ses amis lui montrent
- Ne connaît pas les obligations contractuelles (contrat à l'Ordre, rétrocession, URSSAF)
- A peur de se déplacer loin pour un remplacement et de se retrouver sans contrat signé
- Scroll Facebook en permanence de peur de rater une bonne annonce

**Ce que JIM lui apporte :**
- Toutes les annonces centralisées avec notifications push géolocalisées — elle ne rate plus rien
- Webinaires et ressources pour comprendre le remplacement de A à Z
- Contrat généré par IA — elle n'a pas à chercher de modèle ni à comprendre seule les clauses
- Paiement sécurisé — plus de stress sur les retards ou impayés de rétrocession

**Moment "aha!" :** Léa reçoit une notification push pour un remplacement à 20km de chez elle, postule en 2 minutes, le contrat est généré automatiquement et envoyé à l'Ordre, et elle est payée à J+7 via Stripe.

---

#### Persona 2 : Thomas — Le jeune titulaire/assistant

| Attribut | Détail |
|----------|--------|
| **Âge** | 30 ans |
| **Situation** | Assistant depuis 2 ans dans un cabinet de groupe, vient de s'installer |
| **Localisation** | Lyon, cabinet en centre-ville |
| **Revenus** | ~40 700€/an brut (BNC) |
| **Équipement** | Logiciel de facturation Kiné4000, desktop au cabinet, mobile personnel |
| **Réseau** | Moyen — connaît des remplaçants de sa promo mais pas assez pour couvrir ses besoins |

**Contexte :** Thomas vient de s'installer et a tendance à prendre des remplacements fréquents mais courts (1 à 2 semaines par ci par là — formations, week-ends prolongés). Pour ces courtes périodes, il ne trouve pas toujours de remplaçant car les remplaçants préfèrent les longues missions plus rentables.

**Frustrations actuelles :**
- Doit poster sur 2-3 groupes Facebook + Rempleo à chaque fois — perd du temps
- Pour les remplacements courts, peu de candidatures
- Ne veut pas payer un service en plus de ses charges professionnelles déjà lourdes
- Pas de visibilité sur la fiabilité des remplaçants qui le contactent

**Ce que JIM lui apporte :**
- Plugin navigateur qui synchronise ses annonces Facebook vers JIM automatiquement — zéro effort supplémentaire
- Intégration Kiné4000 pour poster un remplacement directement depuis son logiciel de cabinet
- Profils vérifiés RPPS — il sait que chaque candidat est un vrai kiné
- Contrat IA + envoi à l'Ordre — en 2 clics au lieu de 30 minutes de paperasse
- **Gratuit pour lui** — c'est le remplaçant qui paie la commission

**Moment "aha!" :** Thomas ouvre Kiné4000, clique "chercher un remplaçant", l'annonce est diffusée sur JIM et Facebook simultanément, il reçoit 3 candidatures vérifiées RPPS en 24h.

---

#### Persona 3 : Michel — Le titulaire installé

| Attribut | Détail |
|----------|--------|
| **Âge** | 52 ans |
| **Situation** | Titulaire depuis 20 ans, cabinet solo en zone semi-rurale |
| **Localisation** | Dordogne |
| **Revenus** | ~55 000€/an brut (BNC) |
| **Équipement** | Logiciel Topaze, connaissances numériques moyennes |
| **Réseau** | Historique — connaît des remplaçants fidèles pour l'été, mais ils partent en retraite ou s'installent |

**Contexte :** Michel prend des remplacements longs — 3 à 4 semaines l'été, 2 semaines à Noël. Il avait "ses" remplaçants mais ils s'installent progressivement. En zone semi-rurale, le vivier est maigre et Facebook ne l'aide pas (peu de visibilité dans les algorithmes, zone géographique peu attractive pour les remplaçants).

**Frustrations actuelles :**
- Son réseau de remplaçants fidèles se réduit chaque année
- En zone rurale, les annonces Facebook attirent peu de candidatures
- Ne veut pas apprendre une nouvelle app — "encore un truc de plus"
- A déjà vécu un impayé de rétrocession il y a 3 ans

**Ce que JIM lui apporte :**
- Extension navigateur passive — ses annonces Topaze sont synchronisées automatiquement
- Notifications push qui alertent les remplaçants dans un rayon large autour de son cabinet
- Paiement sécurisé — il ne revivra plus l'expérience de l'impayé
- Il n'a rien à payer ni à changer dans ses habitudes

**Moment "aha!" :** Michel publie son remplacement d'été depuis Topaze comme d'habitude. JIM le diffuse automatiquement et il reçoit une candidature d'une remplaçante vérifiée RPPS qu'il n'aurait jamais trouvée sur Facebook.

---

### Secondary Users

#### Formateurs (DPC, FIFPL, financement personnel)

Les organismes de formation kiné peuvent référencer leurs formations sur JIM et bénéficier de la visibilité de la plateforme. Les formations rares et prisées attirent du trafic — JIM devient un point d'entrée pour la formation continue. Modèle : référencement gratuit avec option de mise en avant payante.

#### Admins de groupes Facebook kiné

Partenaires potentiels pour la synchronisation Facebook → JIM. Approche "OPA amicale" : co-administration, outils gratuits pour leurs membres, en échange du tag partenaire JIM.

#### Syndicats (FFMKR, SNMKR, Alizé)

Vecteurs de crédibilité et de diffusion. Communiquent peu sur le remplacement aujourd'hui — JIM peut leur fournir des données (baromètre du remplacement) en échange de recommandations.

#### BDE des IFMK

Point d'entrée critique pour l'acquisition des jeunes diplômés. Partenariat avec les 49 BDE pour présenter JIM en fin de cursus — remplace ou complète le réflexe "ajout au groupe Facebook".

---

### User Journey

#### Parcours Léa (Remplaçante — flux principal)

```
DÉCOUVERTE                    ONBOARDING                   USAGE QUOTIDIEN
Présentation JIM en IFMK     Inscription 2 min            Notifications push géolocalisées
ou recommandation d'un pair   Vérification RPPS auto       Scroll carte interactive
ou pub Facebook ciblée        Profil complété (spécialités,  Postulation en 1 clic
                              zones, disponibilités)
        │                              │                              │
        ▼                              ▼                              ▼
PREMIER REMPLACEMENT          MOMENT "AHA!"                ROUTINE INSTALLÉE
Contrat IA généré             Payée à J+7 via Stripe       JIM = réflexe n°1
Envoi auto à l'Ordre          "C'est exactement ce          Recommande à ses pairs
Mission effectuée             qu'il me fallait"             Inscrite aux formations
```

#### Parcours Thomas (Jeune titulaire — flux secondaire)

```
DÉCOUVERTE                    ONBOARDING                   USAGE
Remplaçante lui parle de JIM  Installe le plugin navigateur  Poste depuis Kiné4000
ou voit l'annonce synchronisée  ou intégration Kiné4000      Annonces synchronisées auto
depuis Facebook               Profil cabinet complété        Reçoit candidatures vérifiées
                                                             Contrat IA en 2 clics
        │                              │                              │
        ▼                              ▼                              ▼
PREMIER REMPLACEMENT          MOMENT "AHA!"                ROUTINE
Candidatures en 24h           "J'ai rien eu à faire de      Publie tous ses remplacements
Profils vérifiés RPPS         plus que d'habitude et         via JIM sans effort
Contrat + envoi Ordre auto    c'est mieux qu'avant"         Ne poste plus manuellement
                                                             sur Facebook
```

---

## Success Metrics

### Métriques de succès utilisateur

#### Pour les remplaçants (Léa)

| Métrique | Indicateur | Cible |
|----------|-----------|-------|
| **Fiabilité des annonces** | % d'annonces actives réellement disponibles (pas d'annonces mortes) | > 95% |
| **Fraîcheur** | Délai moyen de désactivation d'une annonce pourvue (synchro Facebook) | < 4h |
| **Simplicité contractuelle** | Temps moyen de génération d'un contrat IA | < 2 min |
| **Sécurité du paiement** | Délai moyen de réception de la rétrocession via Stripe | ≤ J+7 |
| **Suivi comptable** | Remplaçants utilisant le suivi factures/comptabilité | > 60% des actifs |
| **Rapidité de candidature** | Temps entre notification push et postulation | < 10 min |

#### Pour les titulaires (Thomas/Michel)

| Métrique | Indicateur | Cible |
|----------|-----------|-------|
| **Zéro effort** | % d'annonces publiées via intégration logiciel (Dr. Pro, Kiné4000, Topaze) ou plugin navigateur | > 50% à M6 |
| **Publication automatique** | Annonces auto-générées quand le titulaire indique ses vacances dans son logiciel | Fonctionnel à M6 |
| **Candidatures rapides** | Délai moyen pour recevoir la première candidature vérifiée RPPS | < 48h |
| **Confiance** | Taux de satisfaction titulaires (NPS) | > 40 |
| **Coût zéro** | 0€ pour le titulaire — aucune commission, aucun abonnement | 100% |

### Business Objectives

#### Horizon 6 mois — Masse critique Nord-Pas-de-Calais

| Objectif | Cible M6 | Mesure |
|----------|----------|--------|
| **Inscrits vérifiés RPPS** | 500 | Comptes actifs avec RPPS validé |
| **Annonces actives simultanément** | Maximum possible — objectif qualitatif : aucune annonce morte | Annonces avec statut "active" et vérifiée |
| **Confiance perçue** | Les utilisateurs constatent que les annonces périmées sur Facebook sont aussi périmées sur JIM | Enquête qualitative + taux de retour sur la plateforme |
| **Recyclage des annonces** | Synchronisation bidirectionnelle Facebook ↔ JIM en temps réel | % d'annonces FB synchronisées et mises à jour |

#### Horizon 12 mois — Extension et revenus

| Objectif | Cible M12 | Mesure |
|----------|-----------|--------|
| **Inscrits vérifiés RPPS** | 2 000+ | Extension à d'autres départements |
| **Transactions Stripe/mois** | 50+ | Remplacements avec paiement sécurisé |
| **Volume de paiements/mois** | 50 000€+ | Rétrocessions transitant par Stripe |
| **Revenus JIM/mois** | ~750€ (commissions 1,5%) + abonnements Pro | Stripe dashboard |
| **Formations référencées** | 100+ | DPC + FIFPL + financement personnel |

### Key Performance Indicators

#### KPIs d'acquisition (leading indicators)

| KPI | Mesure | Fréquence |
|-----|--------|-----------|
| **Nouveaux inscrits RPPS/semaine** | Nombre de comptes vérifiés créés | Hebdo |
| **Taux de conversion inscription** | Visiteurs → inscrits vérifiés | Hebdo |
| **Source d'acquisition** | % via BDE IFMK, % via pairs, % via Facebook, % via pub | Mensuel |
| **Partenariats BDE actifs** | Nombre de BDE IFMK dans le Nord-Pas-de-Calais partenaires | Mensuel |

#### KPIs d'engagement (core indicators)

| KPI | Mesure | Fréquence |
|-----|--------|-----------|
| **Taux de fraîcheur des annonces** | % d'annonces actives réellement disponibles | Quotidien |
| **Annonces publiées/semaine** | Nouvelles annonces (directes + synchronisées FB) | Hebdo |
| **Candidatures/annonce** | Nombre moyen de postulations par annonce | Hebdo |
| **Contrats IA générés/mois** | Utilisation de la génération de contrats | Mensuel |
| **Rétention M1** | % d'inscrits actifs après 30 jours | Mensuel |

#### KPIs financiers (lagging indicators)

| KPI | Mesure | Fréquence |
|-----|--------|-----------|
| **Transactions Stripe/mois** | Nombre de paiements de rétrocession | Mensuel |
| **Volume transactionnel** | €€€ transitant par Stripe Connect | Mensuel |
| **Revenu commissions (1,5%)** | Revenus sur transactions gratuites | Mensuel |
| **Conversions Pro** | Nombre d'abonnements Pro à 5,90€/mois | Mensuel |
| **Revenu total JIM** | Commissions + abonnements Pro | Mensuel |

#### North Star Metric

> **Nombre de remplacements réussis par mois** (contrat signé + mission effectuée + paiement reçu)
>
> Cette métrique unique capture la valeur créée pour les deux côtés du marché : un remplacement réussi signifie qu'un titulaire a trouvé un remplaçant fiable ET qu'un remplaçant a été payé à temps.

---

## MVP Scope

### Core Features

#### F1 — Inscription et vérification RPPS
- Création de compte avec email/mot de passe
- Vérification automatique RPPS via API Annuaire Santé
- Profil professionnel (spécialités, zones, disponibilités, logement fourni)
- Distinction titulaire/assistant vs remplaçant

#### F2 — Publication et recherche d'annonces géolocalisées
- Publication d'annonce de remplacement (lieu, dates, rétrocession, spécialités, logement)
- Carte interactive Mapbox avec filtres (lieu, dates, taux, spécialités)
- Recherche par zone géographique avec rayon paramétrable
- Statut temps réel des annonces (active, pourvue, expirée)
- Politique "zéro annonce morte" — expiration automatique

#### F3 — Messagerie intégrée
- Chat en temps réel entre titulaire et remplaçant
- Historique des conversations
- Notifications de nouveaux messages

#### F4 — Paiement sécurisé Stripe Connect
- Onboarding Stripe Connect pour les remplaçants (KYC)
- Paiement de la rétrocession sécurisé
- Commission 1,5% côté remplaçant (gratuit) / 0% avec abonnement Pro 5,90€/mois
- Suivi des paiements, factures et historique comptable
- Reçus téléchargeables

#### F5 — Génération de contrats par IA + envoi à l'Ordre
- Contrat de remplacement conforme généré automatiquement à partir des données de l'annonce
- Signature électronique dans l'app
- Transmission automatique au Conseil Départemental de l'Ordre concerné
- Archivage des contrats dans le profil utilisateur

#### F6 — Synchronisation Facebook (Worker IA)
- Worker IA qui aspire les annonces des groupes Facebook kiné du Nord-Pas-de-Calais
- Détection automatique des annonces pourvues ou éditées sur Facebook
- Mise à jour du statut sur JIM en temps réel (annonce pourvue sur FB → désactivée sur JIM)
- Pré-remplissage de JIM avec des annonces actives dès le jour du lancement

#### F7 — Notifications push géolocalisées
- Alertes push lorsqu'une nouvelle annonce correspond à la zone et aux critères du remplaçant
- Mode "alerte" paramétrable (zone, rayon, spécialités, dates)
- Notifications de candidature pour les titulaires

#### Plateforme technique
- **React Native (Expo)** — iOS + Android + Web depuis une codebase TypeScript unique
- **Zone de lancement** — Nord-Pas-de-Calais

### Out of Scope for MVP

| Feature reportée | Raison | Horizon |
|-----------------|--------|---------|
| **Intégrations logiciels de cabinet** (Dr. Pro, Kiné4000, Topaze, Milo) | Nécessite des partenariats B2B et des API tierces — complexité élevée | V2 (M7-M12) |
| **Plugin navigateur** pour titulaires | Dépend de la validation du flux titulaire en MVP | V2 (M7-M12) |
| **Catalogue de formations** (DPC, FIFPL, financement personnel) | Nécessite agrégation et partenariats avec les organismes | V2 (M7-M12) |
| **Webinaires explicatifs** pour débutants | Contenu à produire — peut démarrer avec des guides statiques en MVP | V2 (M7-M9) |
| **Système d'évaluation** post-remplacement | Nécessite un volume critique de remplacements effectués | V2 (M9-M12) |
| **Extension multi-professions** (médecins libéraux) | Architecture prévue dès le MVP mais activation après validation kiné | V3 (M12+) |
| **Abonnement Pro** (5,90€/mois, 0% commission) | Lancer d'abord en gratuit + 1,5% pour maximiser l'adoption | V1.5 (M4-M6) |
| **Baromètre du remplacement kiné** (data/rapports) | Nécessite un volume de données suffisant | V2 (M9-M12) |

### MVP Success Criteria

| Critère | Seuil de validation | Décision |
|---------|-------------------|----------|
| **Inscrits vérifiés RPPS** | 500 à M6 dans le Nord-Pas-de-Calais | Si atteint → extension géographique |
| **Annonces actives** | Flux continu sans annonce morte visible | Si atteint → confiance validée |
| **Fraîcheur synchro Facebook** | Annonces périmées sur FB désactivées sur JIM en < 4h | Si atteint → worker IA validé |
| **Premiers paiements Stripe** | 10+ transactions dans les 3 premiers mois d'activité | Si atteint → modèle économique validé |
| **Contrats IA générés** | 50+ contrats générés et envoyés à l'Ordre | Si atteint → valeur différenciante confirmée |
| **Rétention M1** | > 30% d'inscrits actifs après 30 jours | Si atteint → product-market fit en cours |
| **NPS** | > 30 sur les premiers utilisateurs | Si atteint → satisfaction suffisante pour le bouche-à-oreille |

**Go/No-Go à M6 :** Si 4+ critères sur 7 sont atteints → passage en V2 (intégrations logiciels, formations, extension géographique). Sinon → pivot ou ajustement du positionnement.

### Future Vision

#### V2 (M7-M12) — Écosystème complet
- Intégrations logiciels de cabinet (Dr. Pro, Kiné4000, Topaze, Milo)
- Plugin navigateur pour synchronisation passive des titulaires
- Catalogue de formations (DPC, FIFPL, financement personnel) avec inscription intégrée
- Webinaires et contenus éducatifs pour les débutants
- Système d'évaluation et de réputation post-remplacement
- Abonnement Pro (5,90€/mois — 0% commission + fonctionnalités avancées)
- Extension géographique progressive (Île-de-France, Rhône-Alpes)

#### V3 (M12-M24) — Multi-professions et data
- Extension aux médecins libéraux
- Baromètre du remplacement kiné (rapports data pour syndicats, Ordre, médias)
- IA de matching prédictif (algorithme qui propose le meilleur remplaçant automatiquement)
- Extension aux autres professions de santé libérales (infirmiers, dentistes, sages-femmes)

#### Vision long terme (M24+)
- JIM = plateforme de référence pour le remplacement et la carrière des professions de santé libérales en France
- Partenariats institutionnels (Ordre, syndicats, CPAM)
- Assurance remplacement (partenariat assureur — garantie en cas d'annulation)
- Expansion européenne potentielle
