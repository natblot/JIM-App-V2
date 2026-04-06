---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
classification:
  projectType: 'Web App (Next.js) + Mobile App (React Native / Expo) — marketplace two-sided'
  domain: 'Healthcare — kinésithérapie (MVP), extension progressive professions libérales de santé'
  complexity: 'high'
  projectContext: 'brownfield'
  excludedScope: 'Facturation médicale, SESAM-Vitale, ADRi, remboursement CPAM, conventionnement'
  targetStack: 'Next.js (web) + React Native/Expo (mobile) + NestJS (backend) + Supabase/PostgreSQL + Redis + Scaleway HDS'
  securityFramework: 'Zero Trust, PSC/e-CPS, 3-2-1-1-0 ANSSI, OWASP 2025'
  databaseStrategy: 'Supabase (MVP) → PostgreSQL 18 managé Scaleway HDS (pré-production)'
inputDocuments:
  - 'product-brief-nathanblottiaux-2026-02-24.md'
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
  - 'technical-external-api-integrations-jim-research-2026-02-24.md'
  - 'software-architecture-patterns-healthcare-microservices-research-2026-02-24.md'
  - 'implementation-strategies-healthcare-startup-research-2026-02-25.md'
  - 'technical-stack-sauvegarde-securite-jim-research-2026-02-24.md'
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 13
  brainstorming: 1
  projectDocs: 0
  existingCode: true
existingCodePath: '/Users/nathanblottiaux/Desktop/JIM App/jim-app'
existingCodeStack: 'Next.js 14, React 18, TypeScript, Supabase, Stripe, Tailwind, Leaflet'
projectType: 'brownfield'
---

# Product Requirements Document - nathanblottiaux

**Author:** NathanBlottiaux
**Date:** 2026-02-26

## Executive Summary

JIM (Job In Med) est une plateforme Adaptive Multi-Breakpoint de mise en relation entre professionnels de sante liberaux, concue pour couvrir l'integralite du parcours de remplacement : de la recherche a la signature du contrat, jusqu'au paiement securise de la retrocession. Le MVP cible les 60 000 kinesitherapeutes directement concernes par le remplacement en France, sur un marche de 7,6 milliards d'euros ou aucune solution existante ne couvre le parcours complet.

Le probleme est structurel : les titulaires peinent chroniquement a trouver des remplacants fiables, les annonces sont dispersees sur Facebook (35 000+ membres dans le groupe principal), Rempleo (40 000 inscrits) et App'Ines, sans qu'aucune plateforme ne garantisse la fraicheur des annonces, la fiabilite des profils ou la securite du paiement. 34% des kines liberaux presentent des signes de burn-out, aggrave par l'impossibilite de prendre des conges sereinement. Les jeunes diplomes (3 000+/an) entrent dans la profession sans reseau ni connaissance des outils existants.

JIM resout ce probleme par une approche ecosysteme construite par un kinesitherapeute qui connait les echecs des plateformes existantes de l'interieur, et qui exploite l'IA et les nouvelles technologies pour resoudre ce que personne n'a pu resoudre avant.

L'application mobile (React Native/Expo) est le produit principal pour tous les utilisateurs — remplacants ET titulaires. Calendrier de disponibilites, notifications push, carte interactive, candidature en un clic, publication d'annonce en 2 minutes. Une landing page web minimaliste (Next.js) assure le SEO et les deep links au MVP. Le site web complet (dashboard titulaire, SSR annonces) arrive en Phase 3. Tous partagent le meme backend (Supabase + Edge Functions).

La strategie d'acquisition repose sur le pre-remplissage par agregation universelle des annonces existantes (zero plateforme fantome au lancement), les partenariats IFMK (3 000 diplomes/an captes avant qu'ils ne prennent l'habitude de Facebook), et des outils gratuits a valeur immediate (calculateur de retrocession, generateur de contrats IA).

La vision long terme : extension progressive a l'ensemble des professions liberales de sante — medecins, infirmiers, dentistes, sages-femmes — avec une architecture multi-professions prevue des le jour 1.

### Ce qui rend JIM unique

**5 piliers differenciateurs :**

1. **Agregation universelle + deduplication** — JIM centralise toutes les annonces de toutes les plateformes (Rempleo, App'Ines, Physiorama, Kine France) dans un seul endroit, sans doublons. L'agregation est un echafaudage : indispensable au lancement, obsolete quand JIM devient la source principale.

2. **Fraicheur temps reel** — Chaque annonce affiche un statut valide/invalide en temps reel. Ce n'est pas une feature isolee mais une propriete emergente du workflow integre : candidature acceptee → contrat signe → paiement initie → annonce fermee automatiquement. La fraicheur est gratuite quand le parcours est complet.

3. **Catalogue de formations + lien automatique remplacement** — Toutes les formations kine (DPC, FIFPL, financement personnel) centralisees. La boucle naturelle "je pars en formation → JIM me trouve un remplacant automatiquement" cree un moat strategique et une double monetisation (retrocession + referencement payant pour les organismes).

4. **Paiement securise Stripe Connect** — Zero impaye de retrocession. Commission de 1,5% supportee par le remplacant, 0% avec abonnement Pro a 5,90€/mois. Optionnel au lancement pour ne pas freiner l'adoption — c'est un pilier de retention, pas d'acquisition.

5. **Verification RPPS** — Chaque profil est verifie via l'API Annuaire Sante. Zero faux profil. C'est un hygiene factor : invisible mais fondamental, fondation de la chaine de confiance.

**Insight fondateur :** La confiance n'est pas un pilier isole — c'est une propriete emergente de la chaine complete (RPPS → candidature → contrat → paiement → fermeture auto). Chaque maillon renforce le suivant. C'est l'integration du parcours complet qui est le vrai differenciateur, pas une feature individuelle.

## Project Classification

- **Type de projet :** Web App (Next.js) + Mobile App (React Native/Expo) — marketplace two-sided, Adaptive Multi-Breakpoint
- **Domaine :** Healthcare — kinesitherapie (MVP), extension progressive a toutes les professions liberales de sante
- **Complexite :** Elevee — HDS 2.0, RGPD sante, RPPS, contrats conformes Ordre MK, Stripe Connect, profession reglementee
- **Contexte :** Brownfield — code existant Next.js 14 / Supabase / Stripe / Tailwind / Leaflet, ~65 pages/composants, 20 migrations Supabase, en local
- **Perimetre exclu :** Facturation medicale, SESAM-Vitale, ADRi, remboursement CPAM, conventionnement
- **Stack MVP :** React Native/Expo (mobile) + Next.js landing page (web) + Supabase + Edge Functions
- **Stack cible :** Migration vers NestJS + PostgreSQL 18 + Scaleway HDS apres validation du product-market fit

## Criteres de Succes

### Succes Utilisateur

**Remplacant (Adaptive Multi-Breakpoint) :**
- Trouve un remplacement correspondant a ses criteres (zone, dates, type de cabinet) en moins de 48h dans sa zone
- Candidature en un clic depuis la carte interactive ou la liste d'annonces
- Calendrier de disponibilites toujours a jour, synchronise avec les notifications push geolocalisees
- Profil verifie RPPS en moins de 3 minutes apres inscription — zero friction d'onboarding
- Visibilite en temps reel du statut de chaque annonce (valide/pourvue/expiree) — zero candidature sur annonce fantome

**Titulaire (mobile + web Phase 3) :**
- Publication d'une annonce complete en moins de 2 minutes depuis l'app mobile (type de cabinet, dates, retrocession, localisation)
- Reception de candidatures verifiees RPPS dans les 24h suivant la publication
- Generation automatique d'un contrat pre-rempli par IA (template avec clauses fixes, champs factuels)
- Fermeture automatique de l'annonce quand le remplacement est pourvu — zero gestion manuelle

**Moment "aha!" :** Le titulaire publie une annonce le soir, trouve 3 candidatures verifiees le lendemain matin. Le remplacant ouvre l'app, voit une annonce fraiche a 15 km, candidature en un tap, reponse dans la journee.

### Succes Business

**Metriques primaires (M6) :**

| Metrique | Cible M6 | Ajustement 5 Whys |
|---|---|---|
| Inscrits actifs | 500 | + > 50 annonces actives/zone focus (double KPI volume + visibilite) |
| Taux de retour par besoin | > 50% | Remplace retention M1 classique, adapte au rythme saisonnier marketplace |
| Candidatures internes | Split native > 20% / agregee > 10% | Transition vers > 60% native a M12 |
| North Star MVP | Candidatures acceptees/mois | V1.5+ : remplacements reussis (contrat signe OU paiement effectue) |

**Metriques financieres (M12) :**

| Metrique | Cible M12 |
|---|---|
| Transactions Stripe/mois | 50+ |
| Volume transactionnel/mois | 50 000€+ |
| Revenus JIM/mois | ~750€ (commissions 1,5%) + abonnements Pro |

**Indicateur qualitatif :** Les utilisateurs parlent de JIM sur les reseaux sociaux sans etre sollicites — signal organique de product-market fit.

**Strategie de lancement :** National des le jour 1 avec marketing concentre sur 3 zones focus :
1. **Nord-Pas-de-Calais** — zone du fondateur, reseau existant, terrain de beta
2. **PACA / Occitanie** — forte densite de kines liberaux, besoin de remplacement saisonnier
3. **Ile-de-France** — volume critique, turnover eleve, forte demande de remplacants

**Monetisation :** Valider l'usage avant de monetiser, mais Stripe Connect est le jalon de viabilite economique — activation prioritaire en Phase 3 (M5-M6). Commission 1,5% supportee par le remplacant, 0% avec abonnement Pro a 5,90€/mois. Les commissions sur les retrocessions sont la source de revenus principale de la plateforme.

**Equipe :** Solo annee 1. Recrutement d'un developpeur ou d'un profil marketing si traction confirmee.

### Succes Technique

> Valeurs specifiques consolidees dans les Non-Functional Requirements (NFR1-NFR45).

- Disponibilite : 99,5% uptime (NFR26)
- Performance : carte < 1s (NFR1), candidature < 500ms (NFR2), RPPS < 3s (NFR3)
- Scalabilite : 5x la charge sans refonte (NFR21)
- RGPD : conformite des le jour 1 (NFR33-NFR38)
- Securite : OWASP Top 10, TLS 1.3, AES-256 (NFR10-NFR20)
- Beta fermee avant lancement national (Phase 2)

### Resultats Mesurables

**Tracking operationnel :**
- Retention J1 / J7 / J30 par cohorte et par type d'utilisateur (remplacant vs titulaire)
- Ratio annonces natives vs agregees (objectif : transition progressive vers source principale)
- Taux de candidature par annonce (native vs agregee — mesure la qualite percue)
- Temps moyen entre publication et premier candidat
- NPS trimestriel (cible > 40 a M6)
- Canaux d'acquisition diversifies : IFMK, reseaux sociaux, bouche-a-oreille, partenariats

**Kill switch :**
- < 200 utilisateurs actifs a M6 **ET** retention M1 < 15% → fermeture
- Si < 200 utilisateurs **MAIS** retention > 30% → pivoter strategie d'acquisition, ne pas fermer
- Le volume seul ne suffit pas a condamner — l'engagement est le signal determinant

## Perimetre Produit

> **Note :** Cette section resume le perimetre initial. La version definitive post-cadrage (avec les simplifications Occam) se trouve dans la section "Project Scoping & Developpement Phase" ci-dessous. En cas de divergence, le Scoping fait reference.

### Synthese du perimetre

- **Phase 1 MVP (mois 1-3)** : App mobile (RN/Expo) pour tous + agregation 2 sources + RPPS + annonces natives + candidature 1 clic + messagerie texte + carte 3 filtres + calendrier + contrat IA (template pre-rempli) + notifications push + fraicheur temps reel + landing page web minimaliste
- **Phase 2 Pre-lancement (mois 3-4)** : Invitation IA Facebook + beta fermee + tests RLS + Ordre MK + CGU RGPD + publication stores + parrainage simplifie
- **Phase 3 Croissance (mois 5-8)** : Migration HDS + **Stripe Connect** (jalon de viabilite — commissions = source de revenus) + site web complet + reputation + catalogue formations + score compatibilite + filtres avances
- **Phase 4 Expansion (mois 9-12)** : Partenariats IFMK + matching IA avance + referencement payant + dashboard analytics + integration logiciel facturation + entite cabinet
- **Vision** : Extension multi-professions + Pro Sante Connect + API ouverte + DOM-TOM

**Architecture prevue des le jour 1 :** Multi-professions (champ `profession` extensible), Supabase + Edge Functions, React Native/Expo (mobile)

## Parcours Utilisateurs

### Parcours MVP

#### Parcours 1 — Lea, 26 ans, remplacante

**Scene d'ouverture :**
Lea est en derniere annee a l'IFMK de Lille. Lors d'un atelier "Entree dans la vie professionnelle", l'intervenant projette JIM. Lea scanne le QR code et telecharge l'app dans l'amphi. Fraichement diplomee, elle n'a ni cabinet, ni reseau, ni habitude Facebook. Son compte en banque fond.

**Action montante :**
L'inscription prend 90 secondes : nom, prenom, numero RPPS. En 3 secondes, son profil est verifie automatiquement via l'Annuaire Sante. Si son RPPS n'est pas encore enregistre (delai 2-6 semaines post-DE), elle obtient un profil en lecture seule avec re-verification automatique quotidienne. Elle remplit ses specialites (musculo-squelettique, respiratoire), sa zone de mobilite (30 km autour de Lille), et ouvre son calendrier de disponibilites.

La carte interactive s'ouvre. Les annonces affichent un badge de statut clair : Active (verte), En cours (orange), Source externe (bleue). Zero annonce fantome. Elle filtre par dates correspondant a ses disponibilites — 4 annonces matchent. Elle tape "Candidater" — un clic. Si l'annonce est une source externe, le bouton affiche "Voir l'annonce originale" et redirige vers la plateforme source. L'Automatisation JIM envoie une invitation au titulaire pour rejoindre JIM.

Un warning s'affiche si l'annonce demande une specialite absente de son profil ou si le cabinet est hors de sa zone de mobilite. Elle confirme ou ajuste.

**Climax :**
Le soir meme, notification push : "Thomas a accepte votre candidature !" La messagerie s'ouvre. JIM genere un contrat de remplacement pre-rempli base sur le template officiel de l'Ordre MK — champs factuels pre-remplis (noms, RPPS, dates, adresse, retrocession), clauses obligatoires verrouillees (assurance RCP, duree), clauses optionnelles editables. Mention : "Ce document ne constitue pas un conseil juridique." En une journee, sans connaitre personne, elle a trouve son premier remplacement.

**Resolution :**
Lea fait ses 2 semaines. Apres le remplacement, elle et Thomas se notent mutuellement — seuls les utilisateurs ayant un remplacement termine peuvent se noter. Les avis sont anonymes pendant 7 jours. Son score de fiabilite monte. Entre deux recherches actives, son ecran d'accueil affiche : "3 nouvelles annonces dans votre zone", "Votre profil a ete vu 12 fois cette semaine." L'app a de la valeur meme quand elle ne cherche pas.

En 3 mois, elle a enchaine 6 remplacements. Elle utilise encore Facebook en parallele, mais progressivement, elle constate 100% de reponse sur JIM vs 30% sur Facebook. La transition se fait naturellement.

**Edge cases couverts :**
- **Annulation derniere minute :** Notification immediate + 2 annonces alternatives proposees automatiquement dans sa zone
- **Candidature sans reponse :** Relance titulaire a J+2, notification Lea a J+5, expiration automatique a J+7
- **Candidatures multiples en parallele :** Suivi de 3+ candidatures simultanees avec statuts en temps reel
- **Connectivite degradee :** Cache local des annonces consultees, file d'attente offline pour candidatures, feedback "En attente d'envoi", indicateur reseau
- **Notifications push desactivees (iOS) :** Onboarding explicatif, fallback email + notification in-app, detection et relance si push desactive
- **Calendrier pas a jour :** Mise a jour automatique apres candidature acceptee, notification hebdomadaire "Vos disponibilites sont-elles a jour ?"

**Anti-parcours — Marc, 35 ans, remplacant experimente :**
Marc a un reseau existant. Il s'inscrit, candidate sur 3 annonces. 1 refus, 2 sans reponse. Il desinstalle et retourne sur Facebook. Lecon : l'utilisateur avec un reseau existant n'est pas la cible prioritaire d'acquisition. Lea (sans reseau) et Thomas (qui cherche desesperement) sont les early adopters naturels.

**Timeline 12 mois :**
- M1-M3 : Recherche active, ouvre l'app 3x/jour
- M4-M6 : CDD en clinique, n'ouvre plus JIM. Email de reengagement : "8 nouvelles annonces dans votre zone"
- M7-M12 : Retour en remplacement, profil intact, score conserve
- Annee 2+ : Lea s'installe comme titulaire → son profil bascule → elle accede a l'interface web titulaire. Transition de role integree

**Signaux comportementaux collectes :** Temps de reponse aux messages (affiche aux titulaires), taux de candidatures acceptees (score de pertinence), zones recherchees, frequence d'ouverture, temps de transition Facebook→JIM exclusif

---

#### Parcours 2 — Thomas, 42 ans, titulaire de cabinet (mobile + web Phase 3)

**Scene d'ouverture :**
Thomas a un cabinet a Roubaix. Il veut partir en formation DPC pendant 2 semaines. Ca fait 3 semaines qu'il a poste sur Rempleo (2 vues, zero reponse) et sur Facebook (15 commentaires dont 8 "c'est toujours d'actualite ?"). Il hesite a annuler sa formation.

**Action montante :**
Thomas ouvre l'app JIM sur son telephone au cabinet. L'inscription prend < 60 secondes : RPPS + email, c'est tout. Le profil se complete progressivement — pas d'onboarding superflu. Il clique "Publier une annonce." Le formulaire affiche un indicateur contextuel : "Retrocession moyenne dans votre zone : 82-85%." En 1 minute 45, l'annonce est en ligne.

6 remplacants dont les disponibilites correspondent dans un rayon de 50 km recoivent une notification push immediate.

**Climax :**
Le lendemain matin, Thomas ouvre JIM : 3 candidatures. Chaque profil affiche "Verifie RPPS", specialites et avis [Phase 3 : score de compatibilite et vue comparaison cote a cote]. Il ouvre la messagerie avec Lea et Sophie. Lea repond en 15 minutes, Sophie en 2h. La reactivite fait la difference — JIM enregistre ce signal.

Il accepte Lea. JIM propose immediatement : "Informer les autres candidats que l'annonce est pourvue ?" — bouton "Refuser tous les autres" en un clic. L'annonce passe en statut "Pourvue" et disparait du dashboard actif vers l'historique. Le contrat se genere.

**Resolution :**
Thomas part en formation l'esprit tranquille. A son retour, notification J+1 : "Comment s'est passe le remplacement avec Lea ?" Notation en 3 taps (etoiles + tag : ponctuel, professionnel, recommande). Rappel J+7 si pas note. Thomas sauvegarde Lea dans son **carnet de remplacants** — il pourra la recontacter directement la prochaine fois. Quand il planifie ses prochaines vacances, il clique "Republier une annonce passee" — tout est pre-rempli, il ne change que les dates.

**Variante accessibilite senior (Michel, 58 ans) :**
Meme parcours fonctionnel avec les ajustements suivants (features pour tous, pas un mode separe) :
- **Recherche RPPS par nom/prenom/ville** dans l'Annuaire Sante — pas besoin de connaitre son numero
- **Connexion par magic link** (lien email valable 1h, fonctionne sur n'importe quel appareil) — zero mot de passe
- **Notifications par email** (fallback si push desactive) pour les actions critiques
- **Retrocession pre-remplie** selon la moyenne de la zone
- [Phase 3] **Options contrat :** imprimer + envoyer par email + signature en ligne
- [Phase 3] **Role secretaire/assistant** possible : publie au nom du titulaire sans RPPS propre

**Edge cases couverts :**
- **Remplacement urgent :** Publication marquee "Urgent", notification push prioritaire aux remplacants disponibles dans un rayon de 30 km
- **0 candidature en 2 semaines :** Suggestions Automatisation JIM (ajuster retrocession, elargir dates), notification "Nous cherchons activement pour vous"
- **Annonce simultanee JIM + Facebook :** Detection si annonce agregee correspond a l'annonce native (meme titulaire, memes dates) → fusion automatique
- [Phase 4] **Multi-praticiens dans un cabinet :** Entite "cabinet" — plusieurs titulaires rattaches au meme lieu
- [Phase 2] **Workflow informel :** Si titulaire et candidat echangent 5+ messages sans acceptation formelle, notification proactive : "Fermer l'annonce ?" + bouton "J'ai trouve mon remplacant" toujours visible
- **Oubli de refuser les autres :** Apres 48h sans action post-acceptation, notification automatique aux non-retenus

**Anti-parcours — Thomas, 0 candidature :**
Thomas publie, attend 2 semaines, rien. Il retourne sur Facebook en se disant "encore un site inutile." Lecon : l'Automatisation JIM doit detecter le silence et agir proactivement (suggestions, matching elargi, notification personnalisee) pour eviter cette mort silencieuse.

**Signaux comportementaux collectes :** Temps de reponse aux candidatures (affiche aux remplacants), critere de choix (qui il accepte vs refuse — ameliore le score de compatibilite), taux d'abandon du formulaire de publication, taux de completude des annonces

---

#### Parcours 3 — Automatisations JIM, operations autonomes 24/7

**Scene d'ouverture :**
Nathan est seul. Kine la journee, fondateur le soir. Les Automatisations JIM sont son co-equipier infatigable — pas un agent IA magique, mais un ensemble de cron jobs, regles metier et appels API bien structures sur les Edge Functions Supabase.

**Niveau MVP — Automatisations (mois 1-4) :**

**Agregation & deduplication :**
- Toutes les 6 heures, scan automatique des sources d'annonces (Rempleo, App'Ines, Physiorama, Kine France)
- Normalisation (dates, localisation, retrocession, type de cabinet)
- Deduplication stricte : meme titulaire + memes dates + meme ville = doublon fusionne (MVP)
- [Phase 4] Matching flou pour les cas ambigus : localisation + dates + retrocession ±5% → score de similarite > 80% = proposition de fusion
- Annonces agregees portent un badge "Source externe" + lien vers l'originale
- Monitoring par source : si 0 annonces recuperees sur un scan, alerte Nathan. Tests automatises par source

**Plan B agregation — Invitation par lien automatisee par IA :**
- L'Automatisation surveille les groupes Facebook publics kines
- Quand une annonce de remplacement est detectee, l'IA genere un message personnalise et contextuel : "Bonjour [prenom], votre annonce pour un remplacement a [ville] du [dates] interesse des remplacants verifies. Publiez-la en 1 clic sur JIM :" + lien pre-rempli avec les infos extraites
- Le lien ouvre le formulaire de publication avec les champs deja remplis. Le kine n'a qu'a verifier, completer son RPPS et publier
- Dashboard : X annonces detectees, X invitations envoyees, X clics, X publications effectives
- Nathan configure les groupes a surveiller une seule fois

**Plan C agregation :** Partenariats API avec les plateformes existantes (echange de trafic contre acces API)

**Verification & moderation :**
- Verification RPPS automatique via API Annuaire Sante a chaque inscription — cache des verifications reussies (valide 6 mois)
- Si API echoue ou RPPS invalide : profil en attente + message explicatif + alerte Nathan
- Si nom fourni ne correspond pas au RPPS (usurpation) : profil bloque immediatement + alerte
- Detection de double inscription (meme RPPS, emails differents) : second compte bloque, proposition de recuperation
- File d'attente avec retry exponentiel si API rate limited. Batch nocturne pour re-verification periodique

**Fraicheur des annonces :**
- Annonce native : relance J-7 ("Votre annonce est-elle toujours d'actualite ?"), statut "Non confirmee" a J-3 (visible mais marquee), archivee a J0 sans reponse, supprimee a J+3
- Annonce agregee : re-verifiee a chaque scan — si l'originale a disparu, marquee "Expiree"
- Candidature acceptee → contrat signe → annonce fermee automatiquement (propriete emergente)

**Relances automatiques :**
- Candidature sans reponse : relance titulaire J+2, notification remplacant J+5, expiration J+7
- Post-remplacement : notification notation J+1, rappel J+7
- Annonce sans candidature J+7 : suggestions (ajuster retrocession, elargir zone)
- Detection workflow informel : 5+ messages sans acceptation → proposition de fermeture

**Donnees sensibles :**
- Ne PAS collecter la raison du remplacement ("conge maladie", "burn-out") — juste les dates
- Detection automatique de mots-cles sensibles dans les champs texte libre → alerte + suggestion de reformulation
- Donnees professionnelles (RPPS, nom, adresse, specialites) = hors HDS, Supabase MVP OK
- Donnees financieres (retrocession) = gerees par Stripe, pas stockees dans JIM

**Niveau M6 — Assistant JIM :**
- Chatbot FAQ arbre de decision base sur une seed list de 30 questions extraites des groupes Facebook kines
- Le chatbot ne donne JAMAIS de conseil juridique → redirection vers l'Ordre MK
- Suggestions basiques aux titulaires (retrocession marche, elargir zone)
- Escalade categorisee : P1 (fraude, bug critique) → notification immediate Nathan. P2 (partenariat, feature request) → resume quotidien. P3 (question FAQ) → renvoi chatbot

**Niveau M12+ — Agent IA JIM :**
- Matching proactif base sur historique et preferences
- NLP avance pour la deduplication
- Detection de patterns comportementaux
- Apprentissage des preferences de matching

**Rapport quotidien Nathan :**
Nathan ouvre son dashboard admin le lundi matin : X nouvelles annonces agregees, Y doublons fusionnes, Z inscriptions (dont N verifiees, M en attente), annonces expirees/archivees, conversations support resolues vs escaladees, zero signalement fraude. Nathan n'a qu'une action a faire : traiter les escalades P2.

**Edge cases couverts :**
- **Scraping casse (source change sa structure HTML) :** Monitoring par source + alerte + fallback cache des dernieres annonces valides avec badge "Derniere verification : il y a 24h"
- **Panne API Annuaire Sante :** Mode degrade — inscriptions acceptees en "Verification en attente" (naviguer oui, candidater non). Batch de rattrapage des que l'API revient
- **Fausse deduplication :** Log des fusions pour audit. Si titulaire signale → Nathan restaure manuellement → ajustement des seuils
- **Perte de toutes les sources d'agregation :** Plan B → invitation par lien automatisee par IA. Acceleration de la transition agrege → natif
- **Chatbot donne une mauvaise information :** Interdiction hard-coded de tout conseil juridique. Supervision des reponses les plus frequentes

**KPI qualite Automatisations :** Taux de faux positifs deduplication, taux de resolution chatbot sans escalade, temps moyen entre alerte et action Nathan, taux de conversion invitation→publication

---

#### Parcours croise — Lea × Thomas (transaction bilaterale)

Ce parcours raconte la meme transaction des deux cotes simultanement :

| Etape | Lea (remplacante) | Thomas (titulaire) |
|---|---|---|
| **J0 19h** | — | Thomas publie une annonce depuis son ordinateur au cabinet |
| **J0 19h01** | Notification push : "Nouvelle annonce a 12 km — Roubaix, 2 semaines, 85%" | — |
| **J0 19h05** | Ouvre l'app, lit l'annonce, candidature en 1 tap | — |
| **J0 19h06** | Statut : "En attente" | Notification push : "Vous avez recu une candidature de Lea" |
| **J0 soir** | Attend. Consulte d'autres annonces en parallele | Thomas est avec ses enfants, ne voit pas la notification |
| **J1 8h** | Toujours en attente. Pas de stress — elle sait que la relance est a J+2 | Thomas ouvre JIM au cabinet. 3 candidatures. Consulte les profils |
| **J1 8h30** | — | Consulte les profils de Lea et Sophie. Verifie RPPS, specialites, avis [Phase 3 : score compatibilite + comparaison] |
| **J1 9h** | — | Ouvre la messagerie avec Lea et Sophie : "Bonjour, pouvez-vous me decrire votre experience en musculo ?" |
| **J1 9h15** | Repond en 15 minutes (signal enregistre) | Attend Sophie |
| **J1 11h** | — | Sophie repond apres 2h. Thomas decide : la reactivite de Lea fait la difference |
| **J1 11h05** | Notification : "Thomas a accepte votre candidature !" | Clique "Accepter Lea" → "Refuser tous les autres ?" → oui en 1 clic |
| **J1 11h06** | L'annonce disparait de sa recherche (statut Pourvue) | L'annonce disparait de son dashboard actif → historique |
| **J1 11h10** | Contrat pre-rempli dans la messagerie. Verifie les clauses. Signe | Contrat recu. Verifie. Signe. Clauses obligatoires verrouillees |
| **J1-J14** | Remplacement en cours. Lea encaisse directement les honoraires des patients | Thomas en formation, l'esprit tranquille |
| **J15** | Notification : "Comment s'est passe le remplacement chez Thomas ?" — note 5 etoiles | Notification : "Comment s'est passe le remplacement avec Lea ?" — note 5 etoiles, tag "ponctuelle, professionnelle" |
| **J15** | Score de fiabilite augmente | Sauvegarde Lea dans son carnet de remplacants |

**Flux financier (post-MVP, Stripe Connect) :**
1. Le contrat stipule 85% de retrocession, 10 jours
2. Pendant le remplacement : Lea encaisse les honoraires directement (fonctionnement legal du remplacement liberal)
3. J+3 apres la fin : JIM calcule la retrocession due. Lea a encaisse X€ → elle reverse 15% a Thomas
4. Lea valide le montant dans l'app → paiement via Stripe Connect → Thomas recoit sous 48-72h
5. Si litige sur le montant : mediation dans l'app, paiement bloque sur compte sequestre Stripe jusqu'a resolution

**Point critique :** Le paiement en remplacement liberal est **inverse** par rapport a une marketplace classique. Ce n'est pas le client (titulaire) qui paye le prestataire (remplacant). C'est le remplacant qui encaisse d'abord, puis reverse une part au titulaire. Fondamental pour le design Stripe Connect.

---

#### Terminologie unifiee des statuts

**Statuts annonces :**

| Statut | Icone | Recherche/Carte | Dashboard actif | Historique |
|---|---|---|---|---|
| Active | Vert | Visible | Visible | — |
| En cours | Orange | Visible | Visible | — |
| Non confirmee | Gris | Visible (marquee) | Visible | — |
| Source externe | Bleu | Visible | — | — |
| Pourvue | Check | Disparait | Disparait | Consultable |
| Expiree | Noir | Disparait | Disparait | Consultable |

**Statuts candidatures :**

| Statut | Dashboard actif | Apres transition |
|---|---|---|
| En attente | Visible | — |
| Acceptee | Disparait | → "Mes remplacements" |
| Refusee | Disparait | → Historique |
| Expiree (J+7) | Disparait | → Historique |

**Principe :** Le dashboard actif ne montre que ce qui necessite une action. Tout le reste vit dans l'historique — accessible mais pas intrusif.

---

### Parcours Post-MVP

#### Parcours 4 — Bernard, 62 ans, dirigeant d'un centre de formation DPC (Phase 2, mois 5-8)

**Scene d'ouverture :**
Bernard dirige un organisme de formation DPC specialise en therapie manuelle, base a Lyon. 20% d'annulations de derniere minute — raison numero 1 : "Je n'ai pas trouve de remplacant pour mon cabinet."

**Action montante :**
Bernard cree son compte organisme sur JIM. Il renseigne ses formations : dates, lieu, thematique, places disponibles, type de financement (DPC, FIFPL, personnel). Gestion du cycle de vie : creation, mise a jour, report, annulation, formation complete (liste d'attente), formation recurrente (meme formation 4x/an). Volume moyen : 10-30 formations/an, saisie manuelle suffisante.

Ses formations apparaissent **dans le flux d'annonces** quand pertinent ("Formation musculo-squelettique dans votre zone") — pas dans un onglet isole. Au MVP, le catalogue est une page statique curatee par Nathan (top 20 formations DPC kines) avec lien "formation → publier une annonce" deja actif.

**Climax :**
Thomas cherche une formation en therapie manuelle. Dans son flux, il voit la formation de Bernard du 10 au 14 mars. Il clique "Voir les details et s'inscrire" — lien direct vers le site de Bernard (tracking UTM). JIM affiche : "Vous serez absent du 10 au 14 mars. Publier une annonce de remplacement ?" → 2 clics, annonce pre-remplie. Bernard voit dans son dashboard : "5 inscrits ce mois via JIM, 0 annulation pour cause de remplacement."

**Resolution :**
Bernard paye un referencement premium. Ses formations en tete du catalogue. Taux d'annulation de 20% a 5%. Il recommande JIM a tous les organismes DPC de son reseau. Double monetisation : retrocession + referencement payant.

**Edge cases :** Formation annulee → cascade (annonces liees fermees, notifications). Formation complete → liste d'attente → desistement → notification premier en liste + annonce remplacant auto-ajustee. Formation reportee → dates decalees → annonces liees mises a jour automatiquement. Lien externe indisponible → message "Site temporairement indisponible" + test de disponibilite a chaque scan.

**Signaux comportementaux :** Taux conversion consultation formation → annonce de remplacement publiee, clics vers inscription, top formations consultees

---

### Resume des Capacites par Parcours

| Capacite | Lea | Thomas+Michel | Automatisations | Bernard |
|---|---|---|---|---|
| Inscription + RPPS auto | ✅ | ✅ (+ recherche nom/ville) | Verification auto | ✅ |
| Calendrier disponibilites | ✅ | — | — | — |
| Publication annonce | — | ✅ (< 60s inscription, < 2min annonce) | Agregation auto | — |
| Candidature 1 clic | ✅ | — | — | — |
| Carte interactive + filtrage intelligent | ✅ | — | — | — |
| Messagerie | ✅ | ✅ | Chatbot M6 | — |
| Contrat template Ordre MK | ✅ | ✅ (+ imprimer/email) | Generation auto | — |
| Notifications push | ✅ | ✅ (+ email/SMS senior) | Alertes systeme | — |
| Catalogue formations | — | ✅ (consultation) | — | ✅ (gestion) |
| Lien formation→remplacement | — | ✅ | Automatise | ✅ |
| Dashboard | — | — | ✅ Admin | ✅ Organisme |
| Reputation/avis | ✅ (apres transaction) | ✅ (apres transaction) | Moderation | — |
| Paiement Stripe (post-MVP) | ✅ (reverse) | ✅ (recoit) | Mediation | — |
| Fraicheur temps reel | ✅ | ✅ | Gestion auto | Cascade auto |
| Carnet de remplacants | — | ✅ | — | — |
| Entite cabinet | — | [Phase 4] | — | — |
| Score compatibilite | [Phase 3] | [Phase 3] | [Phase 3] | — |
| Mode offline | ✅ (cache + queue) | — | — | — |
| Invitation IA Facebook | — | — | ✅ | — |

**Acces universel :** L'app mobile est le produit principal pour tout le monde (remplacants ET titulaires). Le web est un complement optimise pour la gestion detaillee. Zero fonctionnalite exclusive a une plateforme.

## Exigences Domaine — Healthcare / Kinesitherapie

### Conformite & Reglementaire

**RGPD (applicable des le MVP) :**
- Consentement explicite a l'inscription (CGU + politique de confidentialite)
- Droit d'acces : export de toutes les donnees personnelles en un clic (JSON/PDF), generation automatique < 24h, lien de telechargement unique (expiration 48h)
- Droit a l'oubli : suppression sous 30 jours. Donnees personnelles supprimees, avis anonymises ("Un kinesitherapeute verifie"), historique Stripe conserve 6 ans (obligation fiscale), annonces pourvues anonymisees, analytics agregees conservees
- Registre des traitements tenu a jour avec matrice base legale par donnee
- Base legale par type de donnee : RPPS/nom = interet legitime, email/password = execution du contrat, specialites/calendrier = consentement, messages = execution du contrat, analytics = interet legitime (anonymise)
- DPO non obligatoire (< 250 salaries, pas de traitement a grande echelle de donnees de sante au MVP)
- Cookies : consentement explicite, pas de tracking sans accord
- Annonces agregees : anonymisees (pas de donnees personnelles du titulaire sans consentement). Redirection vers la source originale
- Durees de conservation : profil = duree du compte, messages = duree du compte, annonces = duree + 1 an (anonymisees), logs audit = 1 an, logs debug = 90 jours, transactions Stripe = 6 ans

**HDS (Hebergement Donnees de Sante) :**
- MVP : non requis — donnees stockees = professionnelles (RPPS, nom, adresse cabinet, specialites, disponibilites)
- Bascule HDS : avant activation Stripe Connect (~M5), car les montants de retrocession lies a des actes de sante creent une zone grise
- Migration prevue : Supabase → PostgreSQL 18 manage Scaleway HDS
- Plan de migration date et documente des M1 pour demontrer la bonne foi en cas de controle CNIL

**Ordre des Masseurs-Kinesitherapeutes :**
- Contrats de remplacement : template officiel Ordre MK a valider avec l'Ordre departemental du Nord avant le lancement (action prioritaire pre-lancement)
- Fallback : modele "inspire" base sur le Code de la Sante Publique (articles publics) avec disclaimer
- Clauses obligatoires verrouillees (assurance RCP, duree, retrocession), clauses optionnelles editables
- JIM ne fournit aucun conseil juridique — mention explicite dans les CGU et sur chaque contrat genere
- Champs pre-remplis factuels uniquement (noms, RPPS, dates, adresse, retrocession) — aucune clause inventee

**Profession reglementee :**
- Seuls les professionnels verifies RPPS peuvent candidater et publier
- Le RPPS est un identifiant professionnel public (pas une donnee de sante)
- Verification RPPS : API Annuaire Sante (gratuite, publique) + verification SMS sur numero cabinet (Annuaire Sante) pour confirmer l'identite
- Rate limiting creation compte : max 3 tentatives par IP/appareil par jour. Detection patterns massifs (5+ comptes meme IP → blocage + alerte)
- Pas de verification d'assurance RCP a l'inscription. Justificatif RCP requis avant activation Stripe Connect (Phase 2)
- Post-MVP : Pro Sante Connect (authentification forte e-CPS) resout definitivement l'usurpation d'identite

### Contraintes Techniques

> Les valeurs specifiques de securite, performance et disponibilite sont consolidees dans la section "Non-Functional Requirements" (NFR10-NFR45). Cette section documente les exigences domaine specifiques au contexte healthcare.

**Securite domaine healthcare :**
- RLS Supabase (Row Level Security) : policies par table et par role (remplacant, titulaire, admin). Tests obligatoires avec 3 comptes avant lancement
- Coordonnees (email, telephone) visibles uniquement apres acceptation de candidature
- Pas de collecte de la raison du remplacement (maladie, conge, formation) — juste les dates
- Detection automatique de donnees sensibles dans les champs texte libre (mots-cles sante → alerte + suggestion de reformulation)
- Donnees financieres (retrocession) gerees par Stripe, pas stockees dans JIM
- Notifications push : payload generique uniquement, jamais de donnees personnelles

**Transferts de donnees hors UE :**
- Supabase : region EU (eu-west ou eu-central)
- Stripe : certifie Data Privacy Framework, clauses contractuelles types
- Firebase (FCM) : payload sans donnees personnelles
- Scaleway HDS (Phase 3) : hebergeur francais, zero transfert hors UE

### Integrations Requises

| Integration | Phase | Usage | Contraintes |
|---|---|---|---|
| **API Annuaire Sante** | MVP | Verification RPPS, recherche par nom/ville, numero telephone cabinet | Publique, gratuite. Rate limiting. Cache 6 mois. Retry exponentiel |
| **Supabase Auth + DB + Edge Functions** | MVP | Authentification, stockage, API, RLS, backups | Region EU. Pas HDS. Migration prevue M5 |
| **Stripe Connect** | Phase 2 | Paiement retrocession, compte sequestre, mediation litiges | KYC Stripe, onboarding vendeur, flux inverse (remplacant → titulaire). Justificatif RCP requis |
| **Firebase Cloud Messaging / APNs** | MVP | Notifications push (Android/iOS) | Payload generique uniquement. Fallback email/SMS si push desactive |
| **Groupes Facebook publics** | MVP | Detection annonces pour invitation IA automatisee | API Graph ou scraping leger. Risque TOS Facebook. Anonymisation. Plan B/C si blocage |
| **Scaleway HDS** | Phase 2 | Hebergement PostgreSQL 18 manage | Certification HDS. Migration Supabase → Scaleway |
| **Pro Sante Connect** | Vision | Authentification forte e-CPS | Post-PMF. Convention avec l'ANS |

### Risques Domaine & Mitigations

| # | Risque | Prob. | Impact | Mitigation |
|---|---|---|---|---|
| 1 | L'Ordre MK refuse l'utilisation du template de contrat | Moyenne | Haut | Contacter l'Ordre AVANT le lancement. Fallback : modele base sur le CSP (public) |
| 2 | La CNIL conteste l'agregation d'annonces | Faible | Haut | Annonces agregees anonymisees. Registre des traitements. Plan HDS documente |
| 3 | Facebook bloque le scraping/l'activite IA | Haute | Moyen | Agregation = echafaudage. Plan B (invitation IA). Plan C (partenariats API) |
| 4 | Remplacant non assure RCP exerce via JIM | Faible | Tres haut | Verification RCP avant paiement. Clause contrat verrouillee. Disclaimer CGU |
| 5 | Contrat genere contient une erreur juridique | Moyenne | Haut | Champs factuels uniquement. Clauses verrouillees. Disclaimer. Zero conseil juridique |
| 6 | Donnee de sante accidentellement stockee | Moyenne | Haut | Detection mots-cles sante. Pas de raison d'absence. Sensibilisation onboarding |
| 7 | API Annuaire Sante indisponible durablement | Faible | Haut | Cache 6 mois. Mode degrade. Batch de rattrapage |
| 8 | Usurpation RPPS massive | Moyenne | Haut | Verification SMS numero cabinet + rate limiting + detection patterns. PSC post-MVP |
| 9 | Scraping de la base JIM par un concurrent | Moyenne | Moyen | Rate limiting recherche + messagerie only + detection comportement + CGU |
| 10 | Phishing via messagerie JIM | Moyenne | Haut | Warning liens externes + blocage typosquatting + signalement + code securite personnel |

### Actions Pre-Lancement Domaine

| # | Action | Priorite | Responsable |
|---|---|---|---|
| 1 | Contacter l'Ordre MK du Nord — valider usage template contrat | **Critique** | Nathan |
| 2 | Rediger CGU + politique de confidentialite conformes RGPD | **Critique** | Nathan (+ relecture juridique recommandee) |
| 3 | Implementer le registre des traitements RGPD avec matrice base legale | Haute | Dev |
| 4 | Verifier conformite TOS Facebook pour l'invitation IA | Haute | Nathan |
| 5 | Configurer RLS Supabase + tester avec 3 comptes (remplacant A, remplacant B, titulaire C) | **Critique** | Dev |
| 6 | Verifier que le projet Supabase est en region EU | **Critique** | Dev |
| 7 | Documenter le plan de migration HDS (Supabase → Scaleway) avec dates | Moyenne | Dev |
| 8 | Implementer export donnees personnelles (JSON/PDF) | Haute | Dev |
| 9 | Preparer disclaimer contrat + CGU "pas de conseil juridique" | Haute | Nathan |

## Innovation & Patterns Originaux

### Zones d'Innovation Detectees

**1. Agregation-echafaudage (Scaffolding Pattern)**
JIM pre-remplit la plateforme avec les annonces de tous les concurrents (Rempleo, App'Ines, Physiorama, Kine France) avant le lancement. L'agregation est indispensable au lancement pour eviter le syndrome de la plateforme fantome, mais elle est concue pour devenir obsolete : a mesure que les titulaires publient nativement sur JIM, le contenu agrege est progressivement remplace par du contenu natif de meilleure qualite. L'echafaudage se retire tout seul quand le batiment tient debout. Ce pattern n'a pas ete observe chez les concurrents du secteur kinesitherapie.

**2. Fraicheur emergente (Emergent Freshness)**
La fraicheur des annonces n'est pas une feature construite — c'est une propriete emergente du workflow integre. Quand le parcours complet fonctionne (candidature → acceptation → contrat → paiement → fermeture auto), la fraicheur est gratuite. Chaque annonce a un statut en temps reel non pas parce qu'un cron job le met a jour, mais parce que le workflow lui-meme ferme l'annonce quand elle est pourvue. C'est un avantage structurel impossible a copier sans copier l'ensemble du workflow.

**3. Catalogue de formations — Decouverte et acces**
Le vrai probleme des kinesitherapeutes n'est pas de trouver un remplacant pour partir en formation (les formations se deroulent souvent le week-end). Le probleme est de **trouver la bonne formation**. Les formations DPC, FIFPL et a financement personnel sont dispersees, les places sont limitees, et les kines s'appuient sur le bouche-a-oreille entre pairs pour decouvrir les formations pertinentes. JIM centralise l'ensemble des formations disponibles dans un seul catalogue avec alertes de disponibilite quand une place se libere. Le lien secondaire formation→remplacement (pour les formations en semaine) genere un flux automatique de publication d'annonces. La double monetisation (retrocession + referencement payant pour les organismes) cree un modele economique auto-renforce.

**4. Invitation IA contextuelle (AI-Powered Outbound)**
Au lieu de demander aux titulaires de venir sur JIM, JIM va les chercher la ou ils sont (Facebook). L'IA detecte les annonces de remplacement sur les groupes publics, genere un message personnalise avec un lien pre-rempli, et invite le titulaire a publier nativement en 2 clics. Chaque invitation convertie cree un compte natif, une annonce native, et alimente la transition agrege→natif. L'acquisition est automatisee et contextuelle — pas du spam, mais une proposition de valeur ciblee.

**5. Flux de paiement inverse (Reverse Payment Flow)**
Dans une marketplace classique, le client paye le prestataire. En remplacement liberal, c'est l'inverse : le remplacant encaisse les honoraires des patients directement, puis reverse une part (retrocession) au titulaire. Ce flux inverse necessite un design Stripe Connect specifique ou le "vendeur" (remplacant) est celui qui initie le paiement vers le "client" (titulaire). C'est un pattern atypique qui n'existe dans aucune documentation standard Stripe Connect et constitue un avantage technique si bien execute.

**6. Ambition ecosysteme indispensable**
JIM ne vise pas a etre un outil supplementaire — l'objectif est de devenir **la plateforme indispensable** que la profession n'a pas encore mais dont elle aura besoin. Aucun concurrent n'a reussi a s'imposer comme reference (Rempleo 40 000 inscrits mais faible usage actif, Facebook dominant mais chaotique, App'Ines institutionnel mais rigide). L'innovation est dans l'approche ecosysteme : reunir annonces + formations + contrats + paiement + reputation dans un seul endroit, construit par un kinesitherapeute qui connait les echecs de l'interieur.

**7. Integration logiciels de facturation — Publication zero effort**
Le titulaire utilise deja un logiciel de facturation au quotidien (Doctolib, Vetolib, Oplus, Kine+, etc.). Quand il marque "conge" ou "absence" dans son agenda facturation, JIM detecte l'evenement et publie automatiquement une annonce de remplacement pre-remplie (dates, adresse cabinet, retrocession par defaut). Le titulaire recoit une notification : "Annonce publiee pour vos conges du 10 au 24 mars. Modifier ?" — il n'a rien fait, tout est automatique. JIM devient une extension invisible du workflow existant, pas un outil supplementaire. Le taux de publication d'annonces explose car l'effort est nul. Une fois integre dans le logiciel de facturation, le cout de changement pour quitter JIM est enorme.

**Approche d'integration logiciels :**

| Phase | Strategie | Effort |
|---|---|---|
| M6-M8 | API/webhook avec 1-2 logiciels partenaires (commencer par le plus utilise chez les kines) | Moyen |
| M9-M12 | Extension/plugin pour les 3-4 logiciels principaux du marche kine | Haut |
| Annee 2+ | Marketplace d'integrations — tout logiciel peut se connecter a JIM via API ouverte | Moyen |

### Contexte Marche & Paysage Concurrentiel

| Concurrent | Forces | Faiblesses | Ce que JIM fait differemment |
|---|---|---|---|
| **Facebook (groupes)** | 35 000+ membres, habitude installee, gratuit | Annonces fantomes, zero verification, pas de contrat, pas de paiement | Fraicheur emergente, RPPS, contrat IA, statuts temps reel |
| **Rempleo** | 40 000 inscrits, interface dediee | Faible taux d'usage actif, pas de paiement, annonces perimees | Agregation + remplacement par annonces natives, freshness |
| **App'Ines** | Institutionnel (Ordre MK), credibilite | Rigide, UX datee, pas responsive, pas de formation | Adaptive Multi-Breakpoint, UX moderne, catalogue formations |
| **DOCNDOC** | Multi-professions, paiement integre | Generaliste (pas specialise kine), pas de formations | Specialise kine d'abord, formations, construit par un kine |

Aucun concurrent ne combine : agregation + fraicheur emergente + formations + contrat IA + paiement inverse + verification RPPS + integration logiciel facturation. C'est l'integration du parcours complet qui est le vrai differenciateur.

### Approche de Validation

| Innovation | Comment valider | Metrique de succes | Fallback si echec |
|---|---|---|---|
| Agregation-echafaudage | Pre-remplir avant beta. Mesurer ratio agrege/natif a M3, M6, M12 | > 60% annonces natives a M12 | Maintenir l'agregation plus longtemps, accelerer invitation IA |
| Fraicheur emergente | Comparer taux annonces fantomes JIM vs Facebook/Rempleo | < 5% annonces non a jour vs ~40% sur Facebook | Relances manuelles en complement du workflow auto |
| Catalogue formations | Beta avec 20 formations curatees. Mesurer consultations et alertes | > 30% utilisateurs consultent le catalogue a M6 | Repositionner comme feature secondaire |
| Invitation IA | A/B tester taux de conversion invitation → publication native | > 10% taux de conversion clic→publication | Revenir a l'agregation pure sans invitation |
| Flux paiement inverse | Prototype Stripe Connect en sandbox. 5 transactions test | Paiement complete sans friction en < 3 etapes | Paiement hors plateforme (virement) avec suivi JIM |
| Ecosysteme indispensable | Signal organique : mentions spontanees reseaux sociaux | Mentions non sollicitees a M6 | Pivoter vers outil specialise au lieu d'ecosysteme |
| Integration facturation | Partenariat avec 1 logiciel. Mesurer adoption | > 40% titulaires actifs utilisent l'integration a M12 post-lancement | Calendrier standalone JIM synchronisable (iCal/Google Calendar) |

### Mitigation des Risques Innovation

| # | Risque | Impact | Mitigation |
|---|---|---|---|
| 1 | Agregation bloquee legalement/techniquement | Pilier 1 tombe | Echafaudage = retirable. Accelerer invitation IA + acquisition native |
| 2 | Fraicheur emergente ne fonctionne pas | Pilier 2 degrade | Relances manuelles + archivage auto J+7 comme filet de securite |
| 3 | Catalogue formations n'interesse personne | Pilier 3 inutile | Formations restent un complement, pas un pilier. Focus annonces + paiement |
| 4 | Stripe Connect ne gere pas le flux inverse nativement | Pilier 4 bloque | Mode "reverse transfer" custom. Alternative : paiement P2P hors JIM |
| 5 | JIM ne devient pas indispensable | Pas de moat | Acceptable si usage reel. Pivoter vers niche si necessaire |
| 6 | Logiciels de facturation refusent le partenariat | Integration bloquee | Commencer par logiciels avec API ouverte. Echange de valeur. Fallback : calendrier iCal |

## Exigences Web App + Mobile App — Marketplace

### Vue d'ensemble

JIM est une marketplace bilaterale Adaptive Multi-Breakpoint avec deux points d'entree :
- **App mobile React Native/Expo** — produit principal pour tous les utilisateurs (remplacants ET titulaires). Publiee sur App Store et Google Play
- **Site web Next.js** — complement optimise pour la gestion detaillee au cabinet. SSR pour le SEO des annonces et formations publiques, CSR pour le dashboard connecte

Les deux partagent le meme backend (Supabase + Edge Functions). L'experience est identique fonctionnellement — seule l'optimisation UX differe.

### Architecture Technique

**Frontend mobile — React Native / Expo :**
- Expo SDK (managed workflow) — une codebase, deux stores
- Expo Router pour la navigation
- Expo ImagePicker (camera/galerie pour photo profil/cabinet)
- Expo Location (localisation ponctuelle a l'ouverture de la carte, pas de tracking continu)
- Expo Notifications (wrapper FCM/APNs)
- Expo SecureStore (stockage tokens JWT)
- Expo Linking (deep links)
- Expo Contacts (parrainage — invitation par SMS)
- Cache local avec AsyncStorage pour le mode offline (annonces consultees)
- File d'attente offline pour les actions (candidatures, messages)

**Frontend web — Next.js (App Router) :**
- Pages publiques en SSR/SSG (annonces, formations, landing page) pour le SEO
- Dashboard connecte en CSR (SPA-like)
- Navigateurs supportes : Chrome, Firefox, Safari 15+, Edge (modernes uniquement)
- Responsive design : desktop + tablette + mobile web (fallback si app non installee)
- Smart App Banner : sur mobile web, proposition d'installer l'app native

**Backend partage — Supabase :**
- Supabase Auth (email/password + magic link)
- Supabase Database (PostgreSQL) avec RLS
- Supabase Edge Functions (API layer, logique metier, automatisations)
- Supabase Realtime (mise a jour statuts annonces en temps reel)
- Supabase Storage (photos profils et cabinets)

### Strategie SEO

| Page | Mots-cles cibles | Rendu |
|---|---|---|
| Landing page | "remplacement kinesitherapeute", "trouver remplacant kine" | SSG |
| Annonces publiques | "remplacement kine [ville]", "remplacant kinesitherapeute [region]" | SSR |
| Catalogue formations | "formation DPC kinesitherapie", "formation [specialite] [ville]" | SSR |
| Pages outils gratuits | "calculateur retrocession kine", "contrat remplacement kine" | SSG |

Les annonces et formations indexees sur Google = canal d'acquisition organique gratuit.

### Permissions Device

| Permission | Usage | Moment de la demande | Obligatoire |
|---|---|---|---|
| **Localisation** | Centrer la carte sur la position de l'utilisateur | Premier acces a la carte, avec explication | Non — fallback saisie manuelle |
| **Notifications push** | Alertes candidatures, messages, annonces matchantes | Apres inscription, avec explication de la valeur | Non — fallback email/SMS |
| **Camera/Galerie** | Photo de profil, photo du cabinet | Quand l'utilisateur clique "Ajouter une photo" | Non — optionnel |
| **Contacts** | Parrainage — invitation de confreres par SMS | Quand l'utilisateur clique "Inviter un confrere" | Non — optionnel |

Principe : chaque permission est demandee au moment ou elle a du sens (pas a l'installation). Toujours avec une explication claire de la valeur. Toujours avec un fallback si refuse.

### Mode Offline (Mobile)

| Fonctionnalite | Offline | Synchronisation |
|---|---|---|
| Consulter les annonces deja chargees | Cache local | Refresh au retour en ligne |
| Consulter son profil | Cache local | — |
| Candidater | File d'attente | Envoi automatique au retour en ligne + feedback |
| Envoyer un message | File d'attente | Envoi automatique + indicateur "envoi en cours" |
| Publier une annonce | Non | Necessite connexion (verification RPPS, geocodage) |
| Recherche carte | Non | Necessite connexion (donnees live) |

### Strategie Push Notifications

| Evenement | Notification | Priorite |
|---|---|---|
| Nouvelle annonce matchant le profil | "Nouvelle annonce a [X] km — [ville], [dates], [retrocession]%" | Normale |
| Candidature recue (titulaire) | "Vous avez recu une candidature de [prenom]" | Haute |
| Candidature acceptee (remplacant) | "[Prenom] a accepte votre candidature !" | Haute |
| Nouveau message | "Nouveau message de [prenom]" | Normale |
| Relance annonce J-7 | "Votre annonce est-elle toujours d'actualite ?" | Basse |
| Notation post-remplacement | "Comment s'est passe le remplacement ?" | Basse |
| Urgent — remplacement demain | "URGENT : remplacement a [ville] des demain !" | Haute |
| Parrainage — confrere inscrit | "Votre confrere [prenom] vient de rejoindre JIM !" | Basse |

Payload generique uniquement (pas de donnees personnelles). Details dans l'app.

### Systeme de Parrainage

- Code unique par utilisateur (ex : "LEA-JIM-7412")
- Partage en 1 tap via SMS, WhatsApp, email, lien copie
- Declencheur recompense : le filleul s'inscrit ET fait sa premiere action (candidature ou publication)
- Recompenses MVP : badge "Ambassadeur JIM" sur le profil
- Recompenses post-MVP : mois gratuit abonnement Pro, acces prioritaire aux nouvelles features
- Dashboard parrainage : "3 confreres parraines, 2 actifs"
- Canal d'acquisition le plus puissant dans une profession basee sur la confiance entre pairs

### Compliance App Stores

**Apple App Store :**
- Compte Apple Developer (99$/an)
- Review guidelines : pas de contenu genere sans moderation, pas de paiement hors IAP pour les biens numeriques (les retrocessions sont des paiements pour un service reel → Stripe Connect autorise)
- Privacy Nutrition Label : declarer toutes les donnees collectees
- App Tracking Transparency (ATT) : requis si tracking publicitaire (pas prevu au MVP)
- Taille app : < 200 MB recommande

**Google Play Store :**
- Compte Google Play Console (25$ one-time)
- Data Safety section : equivalent de la Privacy Label Apple
- Target API level : toujours le dernier (Expo gere)
- Content rating : questionnaire a remplir
- Politique Play Store sur les services financiers : declarer Stripe Connect

### Considerations d'Implementation

**Monorepo recommande :**
- `/apps/mobile` — React Native / Expo
- `/apps/web` — Next.js
- `/packages/shared` — types TypeScript, constantes, utilitaires partages
- `/packages/api-client` — client Supabase partage (queries, mutations)
- Outil : Turborepo ou Nx pour la gestion du monorepo

**Performance cibles :**

| Metrique | Mobile | Web |
|---|---|---|
| Cold start app | < 3s | — |
| Chargement page (LCP) | — | < 2s |
| Time to Interactive | < 4s | < 3s |
| Recherche carte | < 1s | < 1s |
| Candidature (tap → confirmation) | < 500ms | < 500ms |
| Taille app store | < 50 MB | — |

**Deep Links :**
- `jim.app/annonce/[id]` → ouvre l'annonce dans l'app si installee, sinon page web SSR
- `jim.app/invite/[code]` → page d'invitation parrainage
- `jim.app/formation/[id]` → fiche formation
- Configuration : Expo Router + Universal Links (iOS) + App Links (Android)

## Project Scoping & Developpement Phase

### Strategie MVP & Philosophie

**Approche MVP :** MVP Plateforme — poser les fondations des deux cotes de la marketplace avec le minimum fonctionnel de chaque cote. L'app mobile EST le produit. Le web est un complement minimal.

**Philosophie :** Valider que les titulaires publient nativement et que les remplacants candidatent via JIM, avant d'investir dans les features avancees. Le contenu agrege resout le cold start, l'invitation IA accelere la transition vers le natif. Stripe Connect (Phase 3) est le jalon de viabilite economique — les commissions sur les retrocessions sont la source de revenus principale. Activation prioritaire des M5.

**Ressources :** Dev solo annee 1 (Nathan, kine la journee, fondateur le soir). Agent IA (Claude Code) configure comme backup dev. Alerting automatise (Sentry, monitoring scraping, health checks) pour minimiser les interventions manuelles. Plan B : dev freelance identifie pour interventions ponctuelles d'urgence (~500-1000€).

### MVP Feature Set (Phase 1 — Mois 1-3)

**Parcours utilisateurs supportes :** Lea (remplacante mobile), Thomas (titulaire mobile), Automatisations JIM (operations autonomes)

**Capacites Must-Have :**

| # | Capacite | Perimetre MVP (post-Occam) |
|---|---|---|
| 1 | App mobile React Native/Expo | Produit principal, remplacants + titulaires |
| 2 | Agregation universelle | 2 sources prioritaires (Rempleo + Facebook). Deduplication stricte uniquement (meme titulaire + memes dates + meme ville). Pas de matching flou |
| 3 | Verification RPPS | API Annuaire Sante. Recherche par nom/prenom/ville pour tous (pas reserve aux seniors). Cache 6 mois |
| 4 | Annonces natives | Publication mobile < 2 min. Indicateur retrocession moyenne zone |
| 5 | Candidature 1 clic | Candidature en un tap. Warning si specialite/zone incompatible |
| 6 | Carte interactive | 3 filtres essentiels : distance, dates, retrocession. Filtres avances (type cabinet, specialites) en Phase 3 |
| 7 | Messagerie | Texte uniquement. Pas de fichiers, pas de vocal. Pieces jointes en Phase 3 |
| 8 | Calendrier disponibilites | Calendrier remplacant. Pas de matching automatique avec annonces — filtrage manuel par dates |
| 9 | Notifications push | FCM/APNs. Payload generique. Fallback email si push desactive |
| 10 | Fraicheur temps reel | Statuts (Active/En cours/Non confirmee/Source externe/Pourvue/Expiree). Fermeture auto quand pourvu |
| 11 | Profils verifies | RPPS + specialites + zone de mobilite + photo optionnelle |
| 12 | Contrat IA (simple) | Template PDF pre-rempli par IA (noms, RPPS, dates, adresse, retrocession). Clauses fixes dans le template. Disclaimer "pas de conseil juridique" |
| 13 | Authentification | Email/password + magic link (pour tous, pas reserve seniors). JWT 15min/7j. Secure Storage mobile |
| 14 | Landing page web | Page minimaliste : SEO, deep links, telechargement app. Pas de dashboard web |
| 15 | Relances automatiques | Candidature sans reponse : relance J+2, notification J+5, expiration J+7. Annonce J-7 : "Toujours d'actualite ?". Post-remplacement : notation J+1 |
| 16 | Rate limiting basique | Protection brute force + abus API. Pas d'anti-scraping avance |

**Elimine du MVP (post-Occam) :**
- Score de compatibilite (pas de donnees pour calibrer) → Phase 3
- Comparaison profils cote a cote → Phase 3
- Entite cabinet multi-praticiens → Phase 3
- Role secretaire/assistant → Phase 3
- Detection workflow informel (5+ messages) → Phase 2
- Sauvegarde brouillon annonce → eliminee (formulaire mobile court)
- Deduplication par matching flou → Phase 3
- Mode simplifie senior separe → absorbe (magic link + recherche nom pour tous)
- Envoi automatique contrat a l'Ordre MK → Phase 3 (necessite partenariat institutionnel)

### Post-MVP Features

**Phase 2 — Pre-lancement (Mois 3-4) :**

| # | Capacite | Details |
|---|---|---|
| 1 | Invitation IA Facebook | Detection annonces groupes publics + message personnalise IA + lien pre-rempli. Automatisation directe |
| 2 | Beta fermee | 20-50 kines du Nord. Validation stabilite + UX |
| 3 | Tests RLS Supabase | 3 comptes types (remplacant A, remplacant B, titulaire C) |
| 4 | Contact Ordre MK Nord | Validation template contrat |
| 5 | CGU + politique confidentialite | Conformite RGPD |
| 6 | Publication stores | App Store + Google Play |
| 7 | Parrainage (simplifie) | Code unique + badge Ambassadeur. Pas de dashboard parrainage |
| 8 | Detection workflow informel | 5+ messages sans acceptation → proposition fermeture |
| 9 | Notification 0 candidature | Notification basique sans suggestions intelligentes |

**Phase 3 — Croissance (Mois 5-8) :**

| # | Capacite | Details |
|---|---|---|
| 1 | Migration HDS | Supabase → Scaleway PostgreSQL 18 manage. Avant Stripe Connect. **Priorite M5** |
| 2 | **Stripe Connect** | **Jalon de viabilite.** Paiement retrocession, flux inverse, compte sequestre, mediation. Justificatif RCP requis. Commission 1,5% = source de revenus. **Priorite M5-M6** |
| 3 | Site web Next.js complet | Dashboard titulaire, SSR annonces/formations, responsive |
| 4 | Systeme de reputation | Avis post-remplacement, score fiabilite, avis anonymes 7 jours |
| 5 | Catalogue formations | Page curatee top 20 DPC kine + lien formation→remplacement |
| 6 | Score de compatibilite | Algorithme calibre sur donnees reelles d'usage |
| 7 | Filtres carte avances | Type cabinet, specialites |
| 8 | Outils gratuits | Calculateur retrocession (acquisition organique) |
| 9 | Notifications geolocalisees | Push avancees basees sur localisation |
| 10 | Comparaison profils | Vue cote a cote pour titulaires |
| 11 | Messagerie enrichie | Fichiers, pieces jointes |
| 12 | Envoi contrat a l'Ordre MK | Transmission automatique du contrat signe au Conseil Departemental de l'Ordre concerne. Necessite partenariat institutionnel |

**Phase 4 — Expansion (Mois 9-12) :**

| # | Capacite | Details |
|---|---|---|
| 1 | Partenariats IFMK | Integration parcours 3 000+ diplomes/an |
| 2 | Matching IA avance | Recommandation proactive, matching flou deduplication |
| 3 | Referencement payant formations | Monetisation organismes de formation |
| 4 | Dashboard analytics titulaire | Stats remplacement, historique, tendances |
| 5 | Integration logiciel facturation | 1-2 partenaires (API/webhook) |
| 6 | Entite cabinet | Multi-praticiens rattaches au meme lieu |
| 7 | Role secretaire/assistant | Publication au nom du titulaire |
| 8 | Anti-scraping avance | Detection comportement, captcha |
| 9 | Dashboard parrainage complet | Stats detaillees, recompenses avancees |

**Vision (Post annee 1) :**
- Extension multi-professions (medecins, infirmiers, dentistes, sages-femmes)
- Pro Sante Connect (authentification forte e-CPS)
- API ouverte (integration logiciels metier)
- Marketplace integrations facturation
- Couverture DOM-TOM

### Strategie de Mitigation des Risques

**Risques techniques :**
- Agregation = morceau le plus complexe. Mitigation : prioriser 2 sources fiables (Rempleo + Facebook), monitoring par source, cache des dernieres annonces valides, tests automatises par source. Lancer avec 2 sources vaut mieux que 4 fragiles
- Contrat IA = template pre-rempli (pas de generation de clauses). Risque reduit par la simplification Occam
- Mobile + web en parallele → resolu : web minimal au MVP (landing page seulement)

**Risques marche :**
- 95% contenu agrege a M3 = signal d'alerte. Seuil : < 10% annonces natives a M3 → sprint acquisition terrain (IFMK Nord, presence physique, reseau Nathan)
- Metrique hebdomadaire : ratio natif/agrege. Reagir vite, pas attendre M6
- Levier direct : les 10-20 premiers titulaires natifs viendront du reseau personnel de Nathan dans le Nord
- **Viabilite economique :** Stripe Connect = source de revenus unique (commissions retrocession). Si non actif a M6, pas de revenus. Risque : delai HDS + integration Stripe + KYC. Mitigation : commencer l'integration HDS des M4, Stripe Connect en sandbox parallele

**Risques ressource :**
- Solo dev + kine. Mitigation : automatiser au maximum (alerting Sentry, monitoring scraping, health checks). Si indisponible 2 semaines, l'app tourne seule
- Agent IA (Claude Code) configure avec CLAUDE.md pour connaitre l'architecture. Capable de coder, debugger, deployer
- Plan B : dev freelance identifie (pas embauche). Budget urgence : 500-1000€ intervention ponctuelle

**Seuils decisionnels :**

| Moment | Metrique | Seuil | Action |
|---|---|---|---|
| M3 | Ratio annonces natives | < 10% | Sprint acquisition terrain |
| M6 | Utilisateurs actifs | < 200 ET retention < 15% | Kill switch — fermeture |
| M6 | Utilisateurs actifs | < 200 MAIS retention > 30% | Pivoter acquisition, ne pas fermer |
| M5 | Stripe Connect | Actif avec premieres transactions | Non actif = pas de revenus, viabilite en danger |
| M6 | North Star | Candidatures acceptees/mois | Croissance > 10% MoM = PMF signal |

## Functional Requirements

**Contrat de capacites :** Toute capacite absente de cette liste n'existera pas dans le produit final. 70 FRs organises en 8 aires de capacite.

### Gestion des Utilisateurs & Identite

- FR1 : Le professionnel de sante peut creer un compte avec son email et un mot de passe
- FR2 : Le professionnel de sante peut s'authentifier via un magic link envoye par email
- FR3 : Le professionnel de sante peut faire verifier automatiquement son identite via son numero RPPS
- FR4 : Le professionnel de sante peut rechercher son RPPS par nom, prenom et ville dans l'Annuaire Sante
- FR5 : Le professionnel de sante dont le RPPS n'est pas encore enregistre peut obtenir un profil en lecture seule avec re-verification automatique
- FR6 : Le professionnel de sante peut gerer son profil (specialites, zone de mobilite, photo)
- FR7 : Le professionnel de sante peut deconnecter tous ses appareils depuis les parametres
- FR8 : Le professionnel de sante peut exporter toutes ses donnees personnelles (droit d'acces RGPD)
- FR9 : Le professionnel de sante peut demander la suppression de son compte (droit a l'oubli RGPD)
- FR10 : Le systeme peut bloquer un compte en cas de tentative d'usurpation d'identite (RPPS ne correspondant pas au nom)
- FR60 : Le systeme peut detecter les comptes en double (meme RPPS, emails differents) et bloquer le second avec proposition de recuperation
- FR63 : Le professionnel de sante peut changer de role (remplacant vers titulaire ou inversement)

### Annonces & Publication

- FR11 : Le titulaire peut publier une annonce de remplacement depuis l'app mobile
- FR12 : Le titulaire peut voir un indicateur de retrocession moyenne dans sa zone lors de la publication
- FR13 : Le titulaire peut modifier ou fermer manuellement son annonce
- FR14 : Le titulaire peut republier une annonce passee avec les informations pre-remplies
- FR15 : Le systeme peut agreger les annonces de sources externes et les afficher avec un badge "Source externe"
- FR16 : Le systeme peut dedupliquer les annonces agregees par correspondance stricte (meme titulaire + memes dates + meme ville)
- FR17 : Le systeme peut mettre a jour le statut des annonces en temps reel (Active, En cours, Non confirmee, Source externe, Pourvue, Expiree)
- FR18 : Le systeme peut fermer automatiquement une annonce quand le remplacement est pourvu
- FR19 : Le systeme peut archiver les annonces sans reponse apres relance (cycle J-7, J-3, J0)
- FR20 : Le systeme peut fusionner automatiquement une annonce native avec son doublon agrege quand detecte
- FR59 : Le titulaire peut marquer une annonce comme urgente avec notification prioritaire aux remplacants disponibles dans la zone
- FR61 : Le systeme peut re-verifier les annonces agregees a chaque scan et les marquer "Expiree" si l'originale a disparu

### Recherche & Decouverte

- FR21 : Le remplacant peut rechercher des annonces sur une carte interactive
- FR22 : Le remplacant peut filtrer les annonces par distance, dates et retrocession
- FR23 : Le remplacant peut consulter le detail d'une annonce (dates, lieu, retrocession, profil titulaire)
- FR24 : Le remplacant peut voir le statut en temps reel de chaque annonce
- FR25 : Le remplacant peut consulter les annonces deja chargees sans connexion internet (cache local)
- FR26 : Le remplacant peut etre redirige vers l'annonce originale pour les annonces de source externe

### Candidatures & Matching

- FR27 : Le remplacant peut candidater a une annonce en un clic
- FR28 : Le remplacant peut voir un avertissement si l'annonce demande une specialite absente de son profil ou un lieu hors zone
- FR29 : Le remplacant peut suivre le statut de ses candidatures en temps reel (En attente, Acceptee, Refusee, Expiree)
- FR30 : Le remplacant peut candidater hors connexion avec envoi automatique au retour en ligne
- FR31 : Le titulaire peut consulter les candidatures recues avec le profil verifie de chaque candidat
- FR32 : Le titulaire peut accepter ou refuser une candidature
- FR33 : Le titulaire peut refuser toutes les candidatures restantes en un clic apres acceptation
- FR34 : Le systeme peut notifier automatiquement les candidats non retenus apres 48h sans action post-acceptation
- FR62 : Le systeme peut proposer automatiquement des annonces alternatives au remplacant si son remplacement est annule par le titulaire
- FR64 : Le remplacant peut retirer sa candidature tant qu'elle n'a pas ete acceptee par le titulaire
- FR65 : Le titulaire peut proposer un remplacement directement a un remplacant de son carnet de favoris sans publier d'annonce publique

### Communication

- FR35 : Le titulaire et le remplacant peuvent echanger par messagerie texte apres acceptation de candidature
- FR36 : Le professionnel de sante peut envoyer un message hors connexion avec envoi automatique au retour en ligne
- FR37 : Le systeme peut masquer les coordonnees personnelles (email, telephone) jusqu'a l'acceptation de candidature
- FR38 : Le systeme peut afficher un avertissement sur les liens externes dans la messagerie (anti-phishing)

### Contrats & Documents

- FR39 : Le titulaire et le remplacant peuvent generer un contrat de remplacement pre-rempli par IA a partir des informations de l'annonce et des profils
- FR40 : Le professionnel de sante peut consulter et telecharger le contrat genere
- FR41 : Le systeme peut verrouiller les clauses obligatoires du contrat tout en permettant l'edition des clauses optionnelles
- FR42 : Le systeme peut afficher un disclaimer sur chaque contrat genere ("ne constitue pas un conseil juridique")

### Notifications, Engagement & Reputation

- FR43 : Le remplacant peut recevoir une notification push quand une nouvelle annonce correspond a ses criteres
- FR44 : Le titulaire peut recevoir une notification push quand il recoit une candidature
- FR45 : Le remplacant peut recevoir une notification push quand sa candidature est acceptee
- FR46 : Le professionnel de sante peut recevoir une notification email en fallback si les push sont desactives
- FR47 : Le systeme peut envoyer des relances automatiques (candidature sans reponse J+2/J+5/J+7, annonce J-7, notation post-remplacement J+1)
- FR48 : Le remplacant peut gerer son calendrier de disponibilites
- FR49 : Le professionnel de sante peut parrainer un confrere via un code unique partage par SMS, email ou lien. La recompense est declenchee quand le filleul complete sa premiere action (candidature ou publication)
- FR50 : Le professionnel de sante parraine peut recevoir un badge "Ambassadeur JIM" sur son profil
- FR57 : Le titulaire et le remplacant peuvent noter mutuellement l'autre apres un remplacement termine
- FR58 : Le titulaire peut sauvegarder un remplacant dans son carnet de favoris pour le recontacter directement
- FR66 : Le professionnel de sante peut consulter les avis et notes recus par un autre professionnel

### Administration & Operations

- FR51 : Le systeme peut executer l'agregation des annonces externes de maniere automatisee et periodique
- FR52 : Le systeme peut monitorer chaque source d'agregation et alerter l'administrateur si 0 resultats sur un scan
- FR53 : Le systeme peut detecter les tentatives de creation de compte en masse (rate limiting par IP/appareil)
- FR54 : Le systeme peut detecter les mots-cles sensibles (donnees de sante) dans les champs texte libre et suggerer une reformulation
- FR55 : L'administrateur peut consulter un dashboard operationnel (annonces agregees, doublons, inscriptions, alertes)
- FR56 : Le systeme peut generer des logs d'audit (connexions, publications, candidatures, modifications de profil)
- FR67 : Le professionnel de sante peut signaler un contenu inapproprie ou un comportement abusif d'un autre utilisateur
- FR68 : L'administrateur peut suspendre un compte utilisateur ou masquer un contenu suite a un signalement
- FR69 : Le systeme peut alerter l'administrateur si une automatisation echoue ou performe anormalement (taux de succes, erreurs, anomalies)
- FR70 : Le professionnel de sante peut contacter le support via un formulaire integre dans l'application

## Non-Functional Requirements

**Contrat de qualite :** 45 NFRs specifiques et mesurables definissant comment le systeme doit performer.

### Performance

- NFR1 : Le chargement de la carte interactive avec les annonces doit se completer en moins de 1 seconde pour le 95e percentile sous charge normale
- NFR2 : La candidature (du tap a la confirmation) doit se completer en moins de 500ms pour le 95e percentile
- NFR3 : La verification RPPS via l'API Annuaire Sante doit se completer en moins de 3 secondes
- NFR4 : Le cold start de l'app mobile doit etre inferieur a 3 secondes
- NFR5 : Le Time to Interactive de l'app mobile doit etre inferieur a 4 secondes
- NFR6 : La landing page web doit avoir un LCP (Largest Contentful Paint) inferieur a 2 secondes
- NFR7 : La taille de l'app sur les stores doit etre inferieure a 50 MB
- NFR8 : Les notifications push doivent etre delivrees en moins de 10 secondes apres l'evenement declencheur
- NFR9 : Les mises a jour de statut des annonces doivent se propager en temps reel (< 2 secondes)

### Securite

- NFR10 : Toutes les communications doivent etre chiffrees en transit via TLS 1.3
- NFR11 : Les donnees sensibles (messages, coordonnees) doivent etre chiffrees au repos en AES-256
- NFR12 : Les tokens d'authentification doivent expirer apres 15 minutes (access) et 7 jours (refresh)
- NFR13 : Les tokens mobiles doivent etre stockes dans le stockage securise natif du systeme d'exploitation, jamais dans un stockage non chiffre
- NFR14 : Le systeme doit etre protege contre les vulnerabilites OWASP Top 10
- NFR15 : Le rate limiting doit limiter la creation de compte a 3 tentatives par IP/appareil par jour
- NFR16 : Le rate limiting de recherche doit limiter a 100 requetes/heure et 500/jour par compte
- NFR17 : Tous les champs texte libre doivent etre sanitizes (strip HTML, JavaScript, caracteres speciaux)
- NFR18 : Les notifications push ne doivent contenir aucune donnee personnelle dans le payload (generique uniquement)
- NFR19 : Les logs d'audit doivent etre conserves pendant 1 an
- NFR20 : Les logs de debug doivent etre conserves pendant 90 jours

### Scalabilite

- NFR21 : L'architecture doit supporter 5x la charge actuelle sans refonte majeure
- NFR22 : Le schema de base de donnees doit etre multi-professions des le jour 1 (champ `profession` extensible)
- NFR23 : Le systeme d'agregation doit supporter l'ajout de nouvelles sources sans modification du code coeur
- NFR24 : Le systeme doit supporter au minimum 500 utilisateurs actifs simultanes au MVP
- NFR25 : L'app mobile doit fonctionner correctement avec un cache local de 1000+ annonces

### Fiabilite & Disponibilite

- NFR26 : Le systeme doit maintenir un uptime de 99,5% (≈ 44h de downtime/an max)
- NFR27 : Le RPO (Recovery Point Objective) doit etre de 24h au MVP, 1h post-migration HDS
- NFR28 : Le RTO (Recovery Time Objective) doit etre de 4h au MVP, 1h post-migration HDS
- NFR29 : Les backups doivent suivre la regle 3-2-1 (3 copies, 2 supports, 1 hors site)
- NFR30 : En cas de panne de l'API Annuaire Sante, le systeme doit fonctionner en mode degrade (navigation autorisee, candidature bloquee)
- NFR31 : En cas de perte de connectivite mobile, les actions en file d'attente doivent se synchroniser automatiquement au retour en ligne sans perte de donnees
- NFR32 : En cas de source d'agregation indisponible, les dernieres annonces valides doivent rester accessibles via le cache

### Conformite & Vie Privee

- NFR33 : L'infrastructure de base de donnees doit etre hebergee en region EU (eu-west ou eu-central)
- NFR34 : Les donnees personnelles doivent etre exportables en JSON et PDF sous 24h apres demande
- NFR35 : La suppression de compte doit etre effective sous 30 jours avec anonymisation des avis et conservation Stripe 6 ans
- NFR36 : Les annonces agregees ne doivent contenir aucune donnee personnelle du titulaire sans son consentement
- NFR37 : Les durees de conservation doivent etre respectees : profil = duree du compte, messages = duree du compte, annonces = duree + 1 an (anonymisees), transactions Stripe = 6 ans
- NFR38 : Les transferts de donnees hors UE via Firebase (FCM) doivent se limiter au payload generique sans donnees personnelles

### Integration

- NFR39 : L'integration API Annuaire Sante doit supporter le retry exponentiel en cas de rate limiting
- NFR40 : Le cache de verification RPPS doit etre valide pendant 6 mois avec re-verification periodique
- NFR41 : L'agregation doit s'executer automatiquement toutes les 6 heures avec monitoring par source
- NFR42 : Les tests automatises par source d'agregation doivent detecter les changements de structure HTML en moins de 24h

### Accessibilite

- NFR43 : L'app doit supporter les tailles de police systeme (accessibilite native iOS/Android)
- NFR44 : Les contrastes de couleur doivent respecter un ratio minimum de 4.5:1 pour le texte courant
- NFR45 : Les elements interactifs doivent avoir une zone de tap minimum de 44x44 points (recommandation Apple HIG)
