---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - "/Users/nathanblottiaux/Desktop/JIM/Doc 1 Process bmad.pdf"
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Stack technique complet, sauvegarde et sécurité pour l application JIM (Job in Med)'
research_goals: 'Préparer l architecture technique du MVP, évaluer les solutions d hébergement/backup, et construire une politique de sécurité applicative complète — avec détails d implémentation concrets'
user_name: 'NathanBlottiaux'
date: '2026-02-24'
web_research_enabled: true
source_verification: true
---

# JIM (Job in Med) — Recherche technique complète : Stack, Sauvegarde & Sécurité

**Date :** 2026-02-25
**Auteur :** NathanBlottiaux
**Type de recherche :** Technique — Stack complet, Sauvegarde & Sécurité
**Document de référence :** Kinésithérapie en France : Réglementation, écosystème et contraintes (Doc 1, 2026-02-23)

---

## Executive Summary

Cette recherche technique exhaustive définit l'architecture complète, les stratégies de sauvegarde et la politique de sécurité pour **JIM (Job in Med)** — la future plateforme de mise en relation pour les 109 000 kinésithérapeutes de France. Elle s'appuie sur la recherche de domaine préalable et la complète avec des **détails d'implémentation concrets**, des configurations vérifiées et des recommandations sourcées.

Le stack technique retenu combine **React Native + Expo** (mobile), **NestJS/TypeScript** (backend microservices), **PostgreSQL 18 + MongoDB Atlas HDS + Redis 8.0** (données), hébergé sur **Scaleway** (certifié HDS, 470-550€/mois). L'architecture suit les principes **hexagonal/DDD** avec 8 bounded contexts, **Zero Trust** (NIST SP 1800-35), et une observabilité complète via **OpenTelemetry + Grafana**. La sauvegarde respecte la règle **3-2-1-1-0 ANSSI** avec disaster recovery multi-AZ. La sécurité couvre **OWASP 2025**, **PSC/e-CPS** (flux OpenID Connect complet), chiffrement multi-couches, et un plan de réponse incident **24h** conforme à la Directive Santé Numérique.

**Findings techniques clés :**

- **Stack** : React Native (Expo) + NestJS + PostgreSQL 18 + MongoDB Atlas (HDS) + Redis 8.0 + RabbitMQ + Traefik
- **Hébergement** : Scaleway HDS (470-550€/mois) — meilleur rapport qualité/prix, programme startup 36K€
- **Sauvegarde** : pgBackRest (PITR) + Velero (K8s) + Object Storage 3-AZ + WORM anti-ransomware
- **Sécurité** : PSC/e-CPS + Zero Trust + Wazuh SIEM + Coraza WAF + Linkerd mTLS + plan incident 24h
- **Architecture** : Hexagonale/DDD, 8 bounded contexts, CQRS + Event Sourcing + Saga
- **CI/CD** : GitOps (ArgoCD) + canary deployments + security scanning automatisé
- **Équipe** : 8-10 personnes, ~400-550K€/an, DPO obligatoire
- **Budget total estimé** : ~565-615€/mois infra + ~400-550K€/an équipe

**Recommandations stratégiques :**

1. **Démarrer immédiatement** l'inscription à l'Espace de Confiance PSC (ANS) — délai 2-3 mois
2. **Candidater au programme startup Scaleway** (36K€ crédits) ou OVHcloud (100K€ Healthcare)
3. **Phase MVP en 4 mois** : Auth PSC + profils RPPS + matching géolocalisé + contrats Yousign
4. **Anticiper HDS 2.0** (deadline mai 2026) : cadrage juridique dès le mois 1
5. **Focus géographique initial** : PACA/Occitanie/IDF pour atteindre la masse critique

---

## Table des matières

1. [Introduction et méthodologie](#research-overview)
2. [Technology Stack Analysis](#technology-stack-analysis)
   - 2.1 [Framework Mobile Cross-Platform](#1-framework-mobile-cross-platform)
   - 2.2 [Backend — Frameworks et Architecture](#2-backend--frameworks-et-architecture)
   - 2.3 [Bases de données et stockage](#3-bases-de-données-et-stockage)
   - 2.4 [Hébergement HDS & Infrastructure Cloud](#4-hébergement-hds--infrastructure-cloud)
   - 2.5 [Sauvegarde & Disaster Recovery](#5-sauvegarde--disaster-recovery)
   - 2.6 [Sécurité applicative](#6-sécurité-applicative)
   - 2.7 [Conformité ANSSI et cadre réglementaire cyber](#7-conformité-anssi-et-cadre-réglementaire-cyber)
   - 2.8 [Tendances d'adoption et technologies émergentes](#8-tendances-dadoption-et-technologies-émergentes)
3. [Synthèse — Stack technique recommandé](#synthèse--stack-technique-recommandé-pour-jim)
4. [Integration Patterns Analysis](#integration-patterns-analysis)
   - 4.1 [Intégrations externes — APIs spécifiques JIM](#intégrations-externes--apis-spécifiques-jim)
   - 4.2 [Protocoles de communication](#protocoles-de-communication--synthèse)
5. [Architectural Patterns and Design](#architectural-patterns-and-design)
   - 5.1 [Architecture hexagonale avec NestJS](#architecture-hexagonale-avec-nestjs)
   - 5.2 [Domain-Driven Design — Bounded Contexts JIM](#domain-driven-design--bounded-contexts-jim)
   - 5.3 [12-Factor App — Mapping Kubernetes](#12-factor-app--mapping-kubernetes-pour-jim)
   - 5.4 [Zero Trust Architecture](#zero-trust-architecture--modèle-nist-pour-jim)
   - 5.5 [Scalabilité — Auto-scaling sur Kubernetes](#scalabilité--auto-scaling-sur-kubernetes)
   - 5.6 [Service Mesh](#service-mesh--comparatif-pour-jim)
   - 5.7 [GitOps et CI/CD](#gitops-et-cicd--pipeline-hds-conforme)
   - 5.8 [Observabilité — Stack OpenTelemetry](#observabilité--stack-opentelemetry)
6. [Implementation Approaches](#implementation-approaches-and-technology-adoption)
   - 6.1 [Stratégie d'adoption phasée](#stratégie-dadoption--approche-phasée)
   - 6.2 [Stratégie de testing](#stratégie-de-testing--pyramide-santé)
   - 6.3 [Environnement de développement](#environnement-de-développement)
   - 6.4 [Organisation monorepo — Nx](#organisation-monorepo--nx-pour-nestjs)
   - 6.5 [Équipe et compétences](#équipe-et-compétences)
   - 6.6 [Optimisation des coûts — FinOps](#optimisation-des-coûts--finops)
   - 6.7 [Checklist pré-lancement](#checklist-pré-lancement--conformité-santé-france)
   - 6.8 [Évaluation des risques](#évaluation-des-risques--implémentation)
   - 6.9 [Success Metrics et KPIs](#success-metrics-et-kpis)
7. [Feuille de route d'implémentation](#feuille-de-route-dimplémentation-détaillée)
8. [Conclusion et prochaines étapes](#conclusion-de-la-recherche-technique)

---

## Research Overview

Cette recherche technique approfondie vise à définir le stack technique complet, les stratégies de sauvegarde et la politique de sécurité pour l'application JIM (Job in Med) — une plateforme de mise en relation pour kinésithérapeutes en France. Elle s'appuie sur la recherche de domaine préalable (Doc 1 - 2026-02-23) et la complète avec des détails d'implémentation concrets.

### Pourquoi cette recherche technique est critique maintenant

La kinésithérapie française traverse un **moment charnière technologique** : la deadline **HDS 2.0 (16 mai 2026)** impose à tout acteur du numérique en santé de se conformer au nouveau référentiel. Simultanément, **Pro Santé Connect** devient le standard d'authentification obligatoire, et la **Directive Santé Numérique** réduit à 24h le délai de notification en cas d'incident. Pour JIM, chaque choix technique — framework, hébergeur, architecture de sauvegarde, politique de sécurité — doit intégrer ces contraintes dès la conception. Une erreur de cadrage peut entraîner des sanctions jusqu'à **4% du CA mondial** (RGPD) ou l'illégalité pure et simple de l'hébergement (HDS).

Ce document fournit les réponses techniques vérifiées et sourcées pour construire JIM sur des fondations solides, conformes et évolutives.

### Méthodologie de recherche technique

- **Périmètre** : architecture applicative, infrastructure, sauvegarde, sécurité, CI/CD, observabilité pour JIM
- **Sources** : documentation officielle (ANS, ANSSI, CNIL, OWASP, NIST, CNCF), blogs techniques vérifiés, benchmarks récents (2025-2026)
- **Validation** : multi-sources pour chaque recommandation critique, URLs de source documentées
- **Profondeur** : détails d'implémentation concrets (configurations YAML, exemples de code TypeScript, architectures détaillées)
- **Couverture** : 80+ sources uniques vérifiées à travers tous les domaines de recherche

---

## Technical Research Scope Confirmation

**Research Topic:** Stack technique complet, sauvegarde et sécurité pour l'application JIM (Job in Med)
**Research Goals:** Préparer l'architecture technique du MVP, évaluer les solutions d'hébergement/backup, et construire une politique de sécurité applicative complète — avec détails d'implémentation concrets

**Technical Research Scope:**

- Architecture & Stack technique - frameworks cross-platform, backend, BDD, architecture microservices
- Hébergement HDS & Infrastructure - hébergeurs certifiés HDS 2.0, CDN, configuration
- Sauvegarde & Disaster Recovery - stratégies backup (RPO/RTO), réplication, plans de reprise
- Sécurité applicative - chiffrement, authentification PSC/e-CPS, OWASP, WAF, SIEM
- Politique de sécurité santé - conformité ANSSI, plan incident 24h, RBAC, journalisation

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights
- Détails d'implémentation concrets (configurations, patterns, exemples)

**Scope Confirmed:** 2026-02-24

---

## Technology Stack Analysis

### 1. Framework Mobile Cross-Platform

#### Comparatif Flutter vs React Native (2026)

| Critère | Flutter (3.x) | React Native (New Architecture) |
|---------|---------------|--------------------------------|
| **Moteur de rendu** | Skia/Impeller (propre, pixel-perfect) | Fabric + TurboModules (pont natif) |
| **Performance** | 90-95% du natif, animations 60/120fps | Amélioré significativement avec New Architecture, quasi-natif |
| **Langage** | Dart | JavaScript/TypeScript |
| **Code partagé** | ~95% iOS/Android | ~90% iOS/Android |
| **Écosystème** | En forte croissance, packages Flutter santé émergents | Très mature, plus grand écosystème npm |
| **Talent pool France** | Croissant mais plus restreint | Large (développeurs JS/TS abondants) |
| **Adoption santé FR** | Croissante, quelques apps santé FR | **Doctolib** (référence), adoption prouvée en santé |
| **Hot reload** | Oui (sub-seconde) | Oui (Fast Refresh) |
| **Taille binaire** | Plus lourd (~15-20MB minimum) | Plus léger |
| **Intégration native** | Via platform channels | Via Native Modules / TurboModules |

#### React Native New Architecture (2026)

La New Architecture de React Native est désormais stable et activée par défaut :
- **Fabric** : nouveau moteur de rendu avec rendu synchrone et concurrent
- **TurboModules** : chargement paresseux des modules natifs, communication JSI directe (sans bridge JSON)
- **JSI (JavaScript Interface)** : appels directs C++ sans sérialisation, gain de performance majeur
- **Hermes** : moteur JS optimisé pour mobile, bytecode précompilé

#### Expo vs Bare React Native

| Critère | Expo (Managed + Dev Builds) | Bare React Native |
|---------|---------------------------|-------------------|
| **Setup** | Instantané, zero config natif | Configuration manuelle Xcode/Android Studio |
| **OTA Updates** | EAS Update intégré | CodePush (maintenance réduite) |
| **Modules natifs** | Expo Modules API + Config Plugins | Accès direct |
| **CI/CD** | EAS Build (cloud) | Custom (Fastlane, etc.) |
| **Cas JIM** | **Recommandé** — couvre PSC, géoloc, push, signature | Si besoin SDK natif très spécifique |

#### Recommandation pour JIM

**React Native avec Expo** est le choix recommandé pour les raisons suivantes :
1. **Talent pool** : plus large en France (TypeScript), recrutement facilité
2. **Référence santé** : Doctolib utilise React Native — preuve de viabilité en production santé FR
3. **Expo** : simplifie considérablement le cycle de build/déploiement et les mises à jour OTA
4. **Écosystème** : bibliothèques matures pour géolocalisation, push notifications, stockage sécurisé
5. **New Architecture** : les problèmes de performance historiques sont résolus
6. **Partage de code** : possibilité de partager la logique métier avec un éventuel back-office web (TypeScript)

_Sources : Doctolib Engineering Blog, Expo Documentation 2025, React Native New Architecture docs, Laxmi Digital - React Native vs Flutter 2026, Aquilapp - Flutter vs React Native 2025_

---

### 2. Backend — Frameworks et Architecture

#### Comparatif des frameworks backend

| Critère | NestJS (TypeScript) | Go (Golang) | Python/FastAPI |
|---------|-------------------|-------------|----------------|
| **Performance** | Bonne (V8/Node.js) | **Excellente** (7-11x plus rapide que Node) | Bonne (async, uvicorn) |
| **Microservices** | **Natif** (CQRS, Saga, transports multiples) | Excellente architecture, mais manuellement | Support via bibliothèques |
| **Écosystème santé** | Passport (OpenID Connect), TypeORM | Plus limité en santé | **Meilleur** (FHIR `fhir.resources` v8.2.0) |
| **OpenID Connect (PSC)** | Natif via Passport | Bibliothèques disponibles | Bibliothèques disponibles |
| **Talent pool FR** | **Le plus large** (TypeScript/JS) | Croissant mais plus restreint | Large (data science, backend) |
| **Typage** | TypeScript (compile-time) | Natif (compile-time, strict) | Type hints (runtime optionnel) |
| **Architecture modulaire** | **Natif** (modules, providers, DI) | Manuel (clean architecture) | Manuel |
| **Learning curve** | Moyenne (Angular-like patterns) | Moyenne (concurrent, différent) | Faible |

#### Recommandation : NestJS comme framework principal

**NestJS (TypeScript)** est recommandé comme framework backend principal pour JIM :

1. **Microservices natifs** : support intégré CQRS, Saga orchestration, transports multiples (TCP, Redis, RabbitMQ, NATS, gRPC)
2. **PSC/OpenID Connect** : intégration native via Passport
3. **Modules mappés 1:1** avec les microservices JIM (Auth, Profiles, Matching, Contracts, Notifications, Messaging)
4. **Même langage que le frontend** : TypeScript partagé entre React Native et NestJS → réutilisation de types, DTOs, validation schemas
5. **Communauté et docs** : écosystème très mature, documentation exhaustive

**Go en complément** pour les services critiques en performance (matching algorithm, messaging temps réel) si les benchmarks le justifient en Phase 2.

_Sources : NestJS Official Microservices Docs, NestJS Microservices Blueprint (Jan 2026), Practical 2026 NestJS Guide, Go Ecosystem 2025 (JetBrains)_

#### Architecture microservices recommandée

```
[React Native App] → [API Gateway (Traefik)] → [Microservices NestJS]
                                                  ├── Auth Service (PSC/e-CPS + RPPS + sessions)
                                                  ├── Profile Service (CRUD kinés, recherche)
                                                  ├── Matching Service (offres/demandes, géoloc)
                                                  ├── Contract Service (génération + signature Yousign)
                                                  ├── Notification Service (push + email + SMS)
                                                  └── Messaging Service (chat temps réel)

[Communication inter-services]
  ├── Synchrone : gRPC (interne) / REST (externe/PSC)
  ├── Asynchrone : RabbitMQ (events, saga orchestration)
  └── Cache/Sessions : Redis 8.0
```

#### API Gateway — Traefik recommandé

| Critère | Traefik | Kong | AWS API Gateway |
|---------|---------|------|-----------------|
| **Kubernetes natif** | **Oui** (IngressRoute CRD) | Oui (Ingress Controller) | Non (cloud-managed) |
| **Auto-discovery** | **Oui** (labels Docker/K8s) | Via plugins | N/A |
| **HDS compatible** | **Oui** (self-hosted sur infra HDS) | Oui (self-hosted) | **Problématique** (CLOUD Act) |
| **Open source** | Oui | Oui (core) | Non |
| **Rate limiting** | Plugin intégré | Plugin avancé | Intégré |
| **mTLS** | Natif | Natif | Natif |
| **Coût** | Gratuit (open source) | Gratuit (core) / Enterprise payant | Pay-per-request |

**Traefik** est recommandé pour sa compatibilité native Kubernetes, son auto-discovery des services, et sa capacité à s'héberger sur infrastructure HDS française sans dépendance à un cloud US.

_Sources : Kong vs Traefik Comparison (api7.ai), API Gateway 2026 Guide (digitalapi.ai)_

#### Communication inter-services — RabbitMQ + Redis

| Composant | Usage JIM | Justification |
|-----------|-----------|---------------|
| **RabbitMQ** | Events métier, Saga orchestration (contrats), notifications async | Routage sub-milliseconde, Quorum Queues durables, patterns complexes (topic, fanout) |
| **Redis Streams** | Notifications temps réel, messaging léger, cache invalidation | Léger, déjà déployé pour cache/sessions, Pub/Sub pour WebSocket |
| **gRPC** | Communication synchrone inter-services | Performance (protobuf), typage fort, streaming bidirectionnel |

**Kafka** est surdimensionné pour le MVP mais pertinent en Phase 2 pour l'event sourcing des contrats (immutabilité, audit trail HDS).

_Sources : Kafka vs RabbitMQ vs Pulsar 2025 Decision Framework, Redis Streams vs Kafka (dev.to)_

#### GraphQL vs REST — Approche hybride

| Couche | Protocole | Justification |
|--------|-----------|---------------|
| **Mobile App ↔ BFF** | **GraphQL** | Optimisation des requêtes mobiles, réduction over-fetching, 1 endpoint |
| **BFF ↔ Microservices** | **gRPC** | Performance interne, typage fort protobuf |
| **APIs externes (PSC, RPPS, Yousign)** | **REST** | Compatibilité standards santé, FHIR |
| **Inter-services async** | **RabbitMQ/Redis** | Découplage, résilience |

Le pattern **BFF (Backend For Frontend)** avec GraphQL côté mobile permet de réduire de 340%+ les appels réseau sur mobile par rapport à REST pur, tout en gardant REST pour les intégrations santé standardisées.

_Sources : GraphQL vs REST 2025 (api7.ai), REST vs GraphQL for Enterprises 2026 (bizdata360.com)_

#### Patterns microservices pour la santé

| Pattern | Service JIM | Justification |
|---------|-------------|---------------|
| **Saga Orchestration** | Contract Service, Matching Service | Workflows multi-étapes (création contrat → signature → notification Ordre MK) |
| **CQRS** | Profile Service, Matching Service | Séparation lecture/écriture, optimisation des requêtes de recherche géolocalisées |
| **Event Sourcing** | Contract Service | Audit trail complet obligatoire HDS, traçabilité légale des contrats |
| **Outbox Pattern** | Tous les services | Garantie de cohérence entre BDD et message queue (exactly-once semantics) |

_Sources : Saga Pattern Mastery Guide (Temporal), Event Sourcing for Microservices (microservices.io)_

---

### 3. Bases de données et stockage

#### Architecture polyglot persistence recommandée

```
┌─────────────────────────────────────────────────────────────────┐
│                    JIM — Data Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PostgreSQL 18          MongoDB Atlas (HDS)     Redis 8.0       │
│  ┌─────────────────┐   ┌──────────────────┐   ┌─────────────┐ │
│  │ Contrats         │   │ Profils kinés     │   │ Sessions     │ │
│  │ Utilisateurs     │   │ Annonces          │   │ Cache        │ │
│  │ Facturation      │   │ Matching géo      │   │ Rate limit   │ │
│  │ Transactions     │   │ Messages (docs)   │   │ Pub/Sub RT   │ │
│  │ Audit légal      │   │ Préférences       │   │ Géo temp     │ │
│  └─────────────────┘   └──────────────────┘   └─────────────┘ │
│                                                                 │
│  TimescaleDB (ext PG)   Object Storage (S3)                    │
│  ┌─────────────────┐   ┌──────────────────┐                   │
│  │ Audit logs       │   │ Contrats PDF      │                   │
│  │ Métriques        │   │ Documents signés  │                   │
│  │ Events système   │   │ Pièces justif.    │                   │
│  │ Compliance trail │   │ Backups           │                   │
│  └─────────────────┘   └──────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### PostgreSQL 18 — Base transactionnelle principale

PostgreSQL 18 (sorti septembre 2025) apporte des fonctionnalités critiques pour JIM :

| Fonctionnalité | Impact JIM |
|----------------|------------|
| **Async I/O** | Jusqu'à 3x gain de performance |
| **`uuidv7()` natif** | UUIDs ordonnés temporellement — parfait pour audit logs |
| **OAuth authentication** | Alignement avec PSC/OpenID Connect |
| **Colonnes virtuelles générées** | Calculs dérivés sans stockage (ex: score de matching) |
| **Contraintes temporelles** | Modélisation native des périodes de validité des contrats |
| **SQL/JSON (PG17+)** | `JSON_TABLE`, `JSON_EXISTS`, `JSON_QUERY` — requêtes flexibles sur données semi-structurées |
| **Full-text search + GIN** | ~50x accélération, suffisant pour recherche de profils basique (pas besoin d'Elasticsearch au MVP) |

**Chiffrement at rest** : Percona `pg_tde` (open source, PG17+) avec AES-256 et intégration HashiCorp Vault pour la gestion des clés. Conforme HDS 2.0.

_Sources : PostgreSQL 18 Released!, Exploring PostgreSQL 17 (EDB), Crunchy Data - Postgres Full-Text Search, Percona pg_tde_

#### MongoDB Atlas — Profils et matching géolocalisé

MongoDB Atlas est **certifié HDS** (mis à jour mars 2025) et déployable sur des régions HDS dans l'EEE.

**Fonctionnalités clés pour JIM :**
- **Index `2dsphere`** : requêtes géospatiales sur la sphère terrestre
  - `$nearSphere` : tri par proximité (« trouver le remplaçant le plus proche »)
  - `$geoWithin` : recherche dans un périmètre (« kinés dans un rayon de 30km »)
  - Index composé : `{ location: "2dsphere", specialty: 1, availability: 1 }` pour le matching multi-critères
- **Queryable Encryption** : données chiffrées même pendant l'exécution des requêtes (transit + repos + requête)
- **Client-Side Field-Level Encryption** : chaque champ avec sa propre clé de chiffrement
- **Schema flexible** : profils kinés avec spécialités, disponibilités, préférences variables

_Sources : MongoDB HDS Certification, MongoDB Geospatial Queries, MongoDB Queryable Encryption_

#### Redis 8.0 — Cache, sessions et temps réel

Redis 8.0 intègre désormais les modules anciennement séparés directement dans le core :

| Module intégré | Usage JIM |
|---------------|-----------|
| **RediSearch** | Recherche full-text et filtrage sur les données en cache |
| **RedisJSON** | Stockage JSON natif pour les profils en cache |
| **Redis Geo** | Géo-filtrage rapide pour le matching (complémentaire à MongoDB) |
| **RedisTimeSeries** | Métriques temps réel (nombre de connexions, latence) |
| **Pub/Sub** | Notifications push temps réel via WebSocket |

**Sessions santé** : TTL natif pour expiration automatique conforme aux exigences de timeout de session santé.

Redis est repassé open source en 2025 (tri-licencié AGPLv3).

_Sources : Redis for Healthcare, Redis Session Management, Redis 8.0 Release Notes_

#### TimescaleDB — Audit logs et compliance

Extension PostgreSQL optimisée pour les données temporelles :
- **61% plus rapide** pour les agrégations temporelles vs PostgreSQL pur
- **450x à 14 000x plus rapide** pour les requêtes ordonnées temporellement
- **90% de réduction de stockage** via compression native
- Intégration `pgAudit` pour l'audit logging détaillé
- Rétention configurable (6+ ans pour conformité HDS)
- **20x plus rapide** en insertion à grande échelle (111K vs 30K rows/sec)

Idéal pour les audit trails obligatoires HDS et la journalisation de conformité.

_Sources : TimescaleDB vs PostgreSQL for Time-Series, TimescaleDB GitHub_

---

### 4. Hébergement HDS & Infrastructure Cloud

#### Deadline critique : 16 mai 2026

Le référentiel HDS 2.0 impose :
- **Hébergement physique obligatoire dans l'EEE**
- Alignement ISO 27001:2022 (80% des exigences HDS 2.0)
- Transparence sur les accès depuis des pays tiers
- Chaîne de sous-traitance conforme
- Après le 16 mai 2026 : **illégal** d'héberger des données de santé sans certification HDS 2.0

#### Comparatif détaillé des hébergeurs HDS 2.0

| Critère | Scaleway | OVHcloud | Azure France | AWS eu-west-3 | Google Cloud | Outscale |
|---------|----------|----------|--------------|---------------|--------------|----------|
| **HDS 2.0** | Certifié (juil. 2024) | Certifié (2019, migration 2.0) | Certifié | Certifié (jan. 2025, 24 régions) | **Premier HDS v2.0** (juil. 2025) | Certifié + **SecNumCloud 3.2** |
| **K8s managé** | Kapsule (gratuit mutualisé) | MKS (control plane gratuit) | AKS (free tier dispo) | EKS (~73€/mois control) | GKE | OKS (mars 2025) |
| **PostgreSQL managé** | Oui (dès 16,78€/mois) | Oui | Oui | Oui | Oui | Oui |
| **Data centers FR** | Paris | Gravelines, Strasbourg, Roubaix | Paris (3 AZ), Marseille | Paris (eu-west-3) | Paris (europe-west9) | Paris |
| **CLOUD Act** | **Non** (FR) | **Non** (FR) | **Oui** (US) | **Oui** (US) | **Oui** (US) — S3NS (Thales) = SecNumCloud | **Non** (FR, Dassault) |
| **Programme startup** | **Jusqu'à 36 000€** crédits | Sur demande | Jusqu'à 150k$ | Jusqu'à 100k$ | Jusqu'à 200k$ | PariSante Campus |
| **Coût mensuel estimé** | **470-550€** | **600-650€** | 700-900€ | 900-1 100€ | 800-1 000€ | 1 200-2 000€ |

_Estimation basée sur : 3 nœuds K8s 4vCPU/16GB + PostgreSQL managé + Object Storage + Load Balancer_

#### Recommandation hébergement

**Phase MVP : Scaleway** (meilleur rapport qualité/prix)
- HDS certifié, infrastructure 100% française
- Kubernetes Kapsule gratuit (control plane mutualisé)
- PostgreSQL managé abordable
- Programme startup jusqu'à 36 000€ de crédits
- SecNumCloud en cours de qualification

**Phase Scale : OVHcloud** (alternative solide)
- Infrastructure HDS mature, Object Storage 3-AZ Paris (fév. 2025)
- Support Business obligatoire (~300€/mois minimum) pour HDS
- Control plane Kubernetes gratuit

**À éviter pour le MVP** : les hyperscalers US (AWS, Azure, Google) à cause du CLOUD Act, des coûts plus élevés, et de la complexité de conformité HDS. Envisageables en Phase 3 si besoin de services avancés (IA/ML).

#### CDN pour les DOM-TOM

| Territoire | PoP Cloudflare le plus proche | Latence estimée |
|------------|------------------------------|-----------------|
| **Réunion** | **Saint-Denis (RUN)** — PoP direct | ~5-15ms |
| **Martinique** | Barbados (BGI) ou Puerto Rico (SJU) | ~30-60ms |
| **Guadeloupe** | Barbados (BGI) ou Puerto Rico (SJU) | ~30-60ms |
| **Guyane** | Miami (MIA) ou Fortaleza (FOR) | ~50-80ms |
| **Mayotte** | Mombasa (MBA) ou Nairobi (NBO) | ~40-70ms |

**Stratégie CDN :**
- Cloudflare pour les assets statiques uniquement (JS, CSS, images)
- Les données de santé transitent **directement** vers l'origine HDS à Paris (obligation légale)
- Mode offline / Progressive Web App pour les zones à connectivité variable
- Cache agressif des données non-sensibles (référentiels, listes, etc.)

_Sources : ANS - Liste hébergeurs certifiés HDS, OVHcloud Healthcare, Scaleway HDS, Google Cloud HDS v2.0, AWS HDS 24 Regions, Cloudflare Global Network, HDS Framework Evolution (Wavestone)_

---

### 5. Sauvegarde & Disaster Recovery

#### Règle 3-2-1-1-0 (standard ANSSI 2025)

```
3 copies des données
2 supports de stockage différents
1 copie hors site (offsite)
1 copie immuable ou offline (anti-ransomware)
0 erreur après test de restauration
```

#### Classification RPO/RTO pour JIM

| Tier | Données JIM | RPO | RTO | Stratégie |
|------|-------------|-----|-----|-----------|
| **Tier 1 — Critique** | Auth/sessions, contrats en cours de signature | < 1 min | < 15 min | Réplication synchrone multi-AZ |
| **Tier 2 — Essentiel** | Profils, matching, messagerie | < 15 min | < 1 heure | WAL streaming + PITR |
| **Tier 3 — Important** | Audit logs, métriques, analytics | < 1 heure | < 4 heures | Backup incrémental + Object Storage |
| **Tier 4 — Standard** | Documents archivés, contrats anciens | < 24 heures | < 24 heures | Backup quotidien chiffré |

#### Stratégie de backup par composant

**PostgreSQL — pgBackRest (recommandé)**

```yaml
# Configuration pgBackRest pour JIM
[global]
repo1-type=s3
repo1-s3-endpoint=s3.fr-par.scw.cloud  # Scaleway S3 HDS
repo1-s3-bucket=jim-backups-primary
repo1-s3-region=fr-par
repo1-cipher-type=aes-256-cbc           # Chiffrement AES-256
repo1-cipher-pass=[VAULT_MANAGED_KEY]
repo1-retention-full=4                   # 4 backups full conservés
repo1-retention-diff=7                   # 7 différentiels

[jim-db]
pg1-path=/var/lib/postgresql/18/main
# WAL archiving continu pour PITR
archive-push=y
archive-get=y

# Planning de backup
# Full : dimanche 02:00
# Différentiel : lundi-samedi 02:00
# WAL : continu (streaming)
```

- **WAL continuous archiving** : point-in-time recovery à la seconde près
- **PITR** : restauration à n'importe quel instant dans la fenêtre de rétention
- **Chiffrement AES-256-CBC** : obligatoire HDS
- **Stockage** : Scaleway S3 HDS ou OVHcloud Object Storage 3-AZ

**MongoDB — Percona Operator pour Kubernetes**

```yaml
# Backup MongoDB via Percona Operator
backup:
  enabled: true
  storages:
    s3-hds:
      type: s3
      s3:
        bucket: jim-mongodb-backups
        region: fr-par
        endpointUrl: https://s3.fr-par.scw.cloud
        credentialsSecret: mongodb-backup-s3
  pitr:
    enabled: true
    oplogSpanMin: 10        # Chunks oplog toutes les 10 min
  tasks:
    - name: daily-full
      schedule: "0 2 * * *"  # Tous les jours à 02:00
      keep: 7
      storageName: s3-hds
    - name: weekly-full
      schedule: "0 3 * * 0"  # Dimanche 03:00
      keep: 4
      storageName: s3-hds
```

**Kubernetes — Velero v1.18**

```yaml
# Velero avec Kopia (chiffrement par défaut AES-256)
schedules:
  critical-hourly:
    schedule: "0 * * * *"       # Toutes les heures
    template:
      includedNamespaces: [jim-auth, jim-contracts]
      ttl: 24h
      hooks:
        pre:
          - exec:
              container: postgres
              command: ["/bin/bash", "-c", "pg_dump -Fc > /backup/pre-snapshot.dump"]
  production-daily:
    schedule: "0 3 * * *"       # Tous les jours à 03:00
    template:
      includedNamespaces: [jim-*]
      ttl: 168h                 # 7 jours
  compliance-monthly:
    schedule: "0 4 1 * *"       # 1er du mois à 04:00
    template:
      includedNamespaces: [jim-*]
      ttl: 8760h                # 1 an
```

#### Architecture Disaster Recovery

```
┌──────────────────────────────────────────────────────────────────┐
│                    JIM — Disaster Recovery Architecture           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ZONE PRIMAIRE (Paris AZ-1)         ZONE SECONDAIRE (Paris AZ-2)│
│  ┌──────────────────────┐          ┌──────────────────────┐     │
│  │ K8s Cluster (actif)  │ ←sync→  │ K8s Cluster (standby)│     │
│  │ PostgreSQL primaire  │ ←WAL→   │ PostgreSQL réplica   │     │
│  │ MongoDB primaire     │ ←sync→  │ MongoDB réplica      │     │
│  │ Redis primaire       │ ←sync→  │ Redis réplica        │     │
│  └──────────────────────┘          └──────────────────────┘     │
│           │                                                      │
│           │ async (< 15 min RPO)                                │
│           ▼                                                      │
│  SITE DR (Gravelines/Strasbourg)                                │
│  ┌──────────────────────┐                                       │
│  │ Backups chiffrés     │                                       │
│  │ Object Storage 3-AZ  │                                       │
│  │ Velero snapshots     │                                       │
│  │ WAL archives PG      │                                       │
│  └──────────────────────┘                                       │
│           │                                                      │
│           │ quotidien                                            │
│           ▼                                                      │
│  COLD BACKUP (Object Lock WORM)                                 │
│  ┌──────────────────────┐                                       │
│  │ Backup immuable      │  ← Anti-ransomware                   │
│  │ Rétention 6+ ans     │  ← Conformité HDS                    │
│  │ Accès restreint      │  ← Séparation admin                  │
│  └──────────────────────┘                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Plan de test des sauvegardes

| Fréquence | Test | Objectif |
|-----------|------|----------|
| **Quotidien** | Vérification automatique intégrité backups | 0 erreur (règle 3-2-1-1-**0**) |
| **Mensuel** | Restauration PITR complète en environnement de test | Valider RPO/RTO Tier 1-2 |
| **Semestriel** | Simulation de failover DR complet | Valider basculement AZ-1 → AZ-2 |
| **Annuel** | Exercice BCP (Business Continuity Plan) complet | Valider PCA/PRA avec équipe |

#### PCA/PRA — Conformité française santé

Trois plans imbriqués obligatoires :
1. **PCA** (Plan de Continuité d'Activité) : niveau business, procédures dégradées
2. **PCI** (Plan de Continuité Informatique) : niveau IT, conforme PGSSI-S
3. **PRA** (Plan de Reprise d'Activité) : niveau technique, restauration infra

Le **référentiel HDS v2 (Chapitre 6)** impose :
- SLAs contractuels avec pénalités
- Contacts incidents définis
- Clauses de réversibilité
- Sauvegarde des sous-traitants de la chaîne

_Sources : OVHcloud 3-AZ Paris Launch, Scaleway Healthcare Solutions, HDS v2 Evolution (Wavestone), ANSSI Strategic Plan 2025-2027, PGSSI-S Official, Velero.io, pgBackRest Configuration, Percona MongoDB Operator PITR, 3-2-1-1-0 Backup Rule (ORSYS), ANSSI Cloud Threats 2025_

---

### 6. Sécurité applicative

#### OWASP Top 10:2025 — Risques pour JIM

| Rang | Risque OWASP 2025 | Impact JIM | Mitigation |
|------|-------------------|------------|------------|
| **A01** | Broken Access Control | Accès non autorisé aux profils/contrats d'autres kinés | RBAC + ABAC, vérification systématique des permissions |
| **A02** | Security Misconfiguration | Headers manquants, ports ouverts, debug en prod | Hardening automatisé, scans de config, IaC |
| **A03** | **Software Supply Chain** (nouveau) | Dépendances npm/pip compromises | `npm audit`, Dependabot, SBOM, lock files |
| **A04** | Cryptographic Failures | Données de santé exposées en clair | TLS 1.3, AES-256, chiffrement E2E messaging |
| **A05** | Injection | SQL/NoSQL injection via formulaires | Prepared statements, validation DTO NestJS, sanitization |
| **A10** | **Mishandling Exceptions** (nouveau) | Fuite d'info dans les messages d'erreur | Error handling centralisé, messages génériques en prod |

**OWASP Mobile Top 10 (2024, en vigueur) :**
- **M1** : Improper Credential Usage → sécuriser le stockage PSC tokens
- **M3** : Insecure Authentication → valider côté serveur, pas juste côté app
- **M5** : Insecure Communication → certificate pinning obligatoire
- **M6** : Inadequate Privacy Controls → minimisation données, consentement RGPD
- **M9** : Insecure Data Storage → Keychain (iOS) / Keystore (Android)

_Sources : OWASP Top 10:2025 Official, OWASP Mobile Top 10, GitLab OWASP 2025 Changes_

#### Authentification PSC/e-CPS — Implémentation technique

**Protocole :** OpenID Connect (OIDC) basé sur OAuth 2.0

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ App JIM  │     │ Auth     │     │ PSC      │     │ RPPS     │
│ (mobile) │     │ Service  │     │ (ANS)    │     │ Annuaire │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. Login       │                │                │
     ├───────────────→│                │                │
     │                │ 2. Auth Request│                │
     │                ├───────────────→│                │
     │                │                │ 3. e-CPS Auth  │
     │ ←──────────────┤←──────────────┤ (redirect)     │
     │ 4. User auth   │                │                │
     │    via e-CPS   │                │                │
     ├───────────────→├───────────────→│                │
     │                │ 5. Auth Code   │                │
     │                │←──────────────┤                │
     │                │ 6. Token Req   │                │
     │                ├───────────────→│                │
     │                │ 7. ID Token    │                │
     │                │    + Access    │                │
     │                │←──────────────┤                │
     │                │ 8. Verify RPPS │                │
     │                ├───────────────────────────────→│
     │                │ 9. Professional│verified        │
     │                │←──────────────────────────────┤
     │ 10. Session    │                │                │
     │←──────────────┤                │                │
```

**Points techniques clés :**
- Tokens signés RSA 2048 bits, algorithme SHA-256
- **Changement 2026** : le champ `sub` devient un identifiant technique non-métier ; nouveau champ `PSISubjectNameID` (UUID) pour Pro Santé Identité (PSI)
- Prérequis : inscription à l'Espace de Confiance PSC (portail ouvert depuis mai 2025)
- Validation obligatoire en pré-production avant mise en production
- Support CPS (carte physique) et e-CPS (app mobile)
- Identifiant professionnel : `idNat_PS` (8 chiffres + numéro RPPS : 11 caractères avec contrôle Luhn)

**Configuration NestJS (Passport OpenID Connect) :**

```typescript
// auth.module.ts — Intégration PSC via Passport
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'openidconnect' }),
  ],
  providers: [
    {
      provide: 'PSC_STRATEGY',
      useFactory: () => {
        return new OpenIDConnectStrategy({
          issuer: 'https://auth.esante.gouv.fr/auth/realms/esante-wallet',
          authorizationURL: 'https://wallet.esante.gouv.fr/auth',
          tokenURL: 'https://auth.esante.gouv.fr/auth/realms/esante-wallet/protocol/openid-connect/token',
          userInfoURL: 'https://auth.esante.gouv.fr/auth/realms/esante-wallet/protocol/openid-connect/userinfo',
          clientID: process.env.PSC_CLIENT_ID,
          clientSecret: process.env.PSC_CLIENT_SECRET,
          callbackURL: process.env.PSC_CALLBACK_URL,
          scope: ['openid', 'scope_all'],
          // PKCE obligatoire
          pkce: true,
        });
      },
    },
  ],
})
```

_Sources : ANS - Documentation technique PSC, Doctrine Numérique Santé 2025, API Pro Santé Connect (api.gouv.fr), LemonLDAP PSC Documentation_

#### Chiffrement — Standards pour JIM

| Couche | Standard | Implémentation |
|--------|----------|----------------|
| **Transit** | TLS 1.3 obligatoire | mTLS entre microservices, PFS requis |
| **Repos (PostgreSQL)** | AES-256 (pg_tde Percona) | Clés gérées via HashiCorp Vault |
| **Repos (MongoDB)** | AES-256 + Queryable Encryption | Chiffrement même pendant les requêtes |
| **Repos (Redis)** | AES-256 (Redis Enterprise) | Ou chiffrement disque niveau OS |
| **Repos (Backups)** | AES-256-CBC (pgBackRest) | Clés séparées du stockage |
| **Repos (Object Storage)** | SSE-S3 ou SSE-KMS | Chiffrement côté serveur automatique |
| **Mobile** | Keychain (iOS) / Keystore (Android) | Tokens PSC, données sensibles locales |
| **Messaging** | E2E (Signal Protocol ou similaire) | Phase 2 si messages entre kinés contiennent données sensibles |
| **Clés** | RSA-2048+ pour échanges | FIPS 140-2 Level 2 minimum, rotation 90 jours |

_Sources : Censinet - HIPAA Encryption Protocols 2025, Healthcare Data Privacy 2026 Advancements_

#### WAF et protection API

**ModSecurity est en fin de vie (EOL juillet 2024)** → Migration vers :
- **Coraza** (remplacement Go, open source) pour self-hosted sur HDS
- **Cloudflare WAF** pour la couche CDN/assets statiques

**Règles WAF spécifiques santé :**
- Rate limiting sur endpoints d'authentification PSC
- Inspection du body des requêtes API
- Validation de schéma API (OpenAPI 3.x)
- Restrictions géographiques (EEE uniquement pour les données santé)
- Détection de bots
- Blocage des patterns d'injection SQL/NoSQL

**Tendance 2026 :** évolution vers WAAP (Web Application and API Protection) avec monitoring API contextuel.

_Sources : OWASP ModSecurity Project, Best WAF Solutions 2024-2025, WAAP vs WAF 2026 (glesec.com)_

#### SIEM et monitoring

**Stack recommandé : Wazuh + ELK + Suricata**

| Composant | Rôle | Fonctionnalités clés |
|-----------|------|---------------------|
| **Wazuh** | SIEM/XDR open source | Intrusion detection, file integrity, vulnerability assessment, **dashboards compliance RGPD/HIPAA** |
| **ELK Stack** | Logs centralisés | Elasticsearch + Logstash + Kibana pour visualisation et analyse |
| **Suricata** | IDS réseau | Détection d'intrusions réseau, analyse du trafic |

**Règles de monitoring critiques pour JIM :**
- Accès non autorisé aux profils d'autres kinés
- Patterns d'export de données inhabituels
- Accès hors horaires habituels
- Échecs d'authentification PSC répétés
- Abus d'API (rate limiting dépassé)
- Modifications de contrats suspectes
- Tentatives d'accès admin non autorisées

_Sources : Wazuh SIEM Platform, CyberProof - SIEM for Healthcare CISO 2025, Elastic - Wazuh and IDS Integration_

#### RBAC + ABAC — Contrôle d'accès hybride

**Rôles RBAC (coarse-grained) :**

| Rôle | Permissions de base |
|------|-------------------|
| **Remplaçant** | Voir annonces, postuler, voir son profil, signer contrats |
| **Titulaire** | Publier annonces, voir candidatures, gérer son cabinet, signer contrats |
| **Collaborateur** | Profil, annonces, postuler |
| **Admin plateforme** | Gestion utilisateurs, modération, rapports |
| **Support** | Lecture seule sur les tickets, pas d'accès données sensibles |

**Attributs ABAC (fine-grained) :**
- **Temporel** : accès du remplaçant limité à la durée du contrat
- **Géographique** : visibilité des annonces selon zone d'exercice
- **Relationnel** : accès aux détails de contact seulement après matching accepté
- **Device** : vérification de l'intégrité du device (jailbreak/root detection)
- **Break the glass** : accès d'urgence avec audit trail complet

_Sources : MDPI - Unified RBAC and ABAC, Cabot Solutions - RBAC for Healthcare SaaS, Censinet - Role-Based Controls_

#### Plan de réponse incident 24h

**Directive Santé Numérique (DSN) — transposée mars 2025 :**
- Notification aux personnes concernées réduite à **24 heures** (vs 72h RGPD standard)
- Charge de la preuve sur le responsable du traitement

**Multi-autorités à notifier :**

| Autorité | Délai | Canal |
|----------|-------|-------|
| **CNIL** | 72h | Téléservice en ligne |
| **ARS** | Immédiat | Signalement incidents sécurité santé |
| **ANSSI/CERT-FR** | Si entité NIS2 | Via portail CERT-FR |
| **Personnes concernées** | **24h** (DSN) | Email + notification in-app |

**Procédure de réponse incident JIM :**

```
T+0      : Détection (SIEM Wazuh alerte)
T+15min  : Qualification (gravité, périmètre, données impactées)
T+30min  : Confinement (isolation service, révocation tokens)
T+1h     : Notification équipe de crise
T+4h     : Analyse forensique initiale
T+24h    : Notification personnes concernées (obligation DSN)
T+72h    : Notification CNIL (obligation RGPD)
T+7j     : Rapport complet post-incident
T+30j    : Plan d'action corrective finalisé
```

_Sources : CNIL - Notifications d'incidents, MedTech France - CNIL Feuille de route 2025-2028, Baker McKenzie - France Breach Notification_

#### Sécurité mobile

| Mesure | iOS | Android | Priorité |
|--------|-----|---------|----------|
| **Certificate pinning** | Pin SPKI (pas le cert complet) | Pin SPKI | Critique |
| **Jailbreak/root detection** | IOSSecuritySuite | Play Integrity API | Critique |
| **Secure storage** | Keychain + NSFileProtectionComplete | Keystore + EncryptedSharedPreferences | Critique |
| **Code obfuscation** | Natif (compilation) | ProGuard/R8 + Hermes bytecode | Haute |
| **App attestation** | DeviceCheck / App Attest | Play Integrity | Haute |
| **SSL pinning bypass detection** | Runtime checks | Runtime checks | Haute |
| **Screen capture prevention** | FLAG_SECURE équivalent | FLAG_SECURE | Moyenne |
| **Debug detection** | ptrace checks | isDebuggable checks | Moyenne |

**Statistique alarmante** : une étude 2025 a trouvé 22 apps santé qui acceptaient tous les certificats TLS et 42 qui autorisaient le trafic HTTP non chiffré → JIM doit être exemplaire.

_Sources : Approov - Secure Mobile Health App 2026, Help Net Security - Mobile Healthcare Apps Privacy Problems 2025, Webshark - Mobile App Security 2026_

#### JWT vs Sessions — Approche hybride

| Couche | Mécanisme | Justification |
|--------|-----------|---------------|
| **PSC → Auth Service** | JWT (ID Token OIDC) | Standard PSC, validé contre JWKS ANS |
| **Auth Service → App** | Session serveur (Redis) | Révocation instantanée, état côté serveur |
| **Cookie** | HTTP-only, Secure, SameSite=Strict | Protection XSS/CSRF |
| **Inter-services** | JWT court (5 min max) | EdDSA ou ES256 (préféré à RS256) |
| **Mobile** | Refresh token en Keychain/Keystore | Rotation à chaque utilisation |

**Les JWT ne doivent PAS remplacer les sessions en santé** — ils sont conçus pour la délégation d'autorisation, pas la gestion de session. L'approche hybride combine le meilleur des deux mondes.

_Sources : Curity - JWT Security Best Practices, WellAlly - Securing HealthTech APIs, JWT.app - Best Practices 2025_

#### RGPD — Implémentation technique

| Obligation | Implémentation JIM |
|------------|-------------------|
| **Consentement** | Consentement granulaire par type de traitement, popup conforme CNIL apps mobiles (sept. 2024, MAJ avril 2025) |
| **Minimisation** | Collecter uniquement : identité pro (RPPS), disponibilités, localisation, spécialités |
| **Pseudonymisation** | Salage + chiffrement asymétrique + contrôle d'accès (Guidelines EDPB 01/2025) |
| **Droit à l'effacement** | Mécanisme clair, propagation à tous les sous-traitants, exception rétention légale (20 ans pour données médicales FR) |
| **Portabilité** | Export JSON/CSV des données personnelles, délai 1 mois |
| **AIPD** | Obligatoire avant mise en production si données de santé à grande échelle |
| **DPO** | Recommandé (obligatoire si traitement données santé à grande échelle) |
| **Registre des traitements** | Maintenu et mis à jour, accessible sur demande CNIL |
| **Privacy by Design** | Chiffrement, minimisation, pseudonymisation dès la conception |

**Campagne d'application CNIL apps mobiles** lancée printemps 2025 → JIM doit être conforme dès le lancement.

_Sources : CNIL - Applications mobiles en santé, CNIL - RGPD appliqué au secteur de la santé, EDPB Guidelines 01/2025 on Pseudonymisation_

---

### 7. Conformité ANSSI et cadre réglementaire cyber

#### ANSSI — Recommandations clés pour JIM

| Recommandation ANSSI | Application JIM |
|---------------------|-----------------|
| **Mesure 37** : politique de sauvegarde formelle | Liste des données vitales, types de backup, fréquence, procédures |
| **Hygiène informatique** | 42 mesures de base à respecter |
| **Cloud 2025** | Infrastructure backup indépendante, immuabilité WORM, isolation admin |
| **Plan stratégique 2025-2027** | Cyber-résilience avec backups offline et restauration testée |
| **PGSSI-S** | Authentification 2FA (PSC/e-CPS), chiffrement, contrôle d'accès, audit trail |

#### NIS2 — Impact sur JIM

La transposition française de NIS2 est en cours (entrée en vigueur prévue mi-2026) :
- Les entités de santé (hôpitaux, prestataires, pharma, medtech) sont couvertes
- Pénalités : jusqu'à **10M€ ou 2% du CA mondial**
- Si JIM travaille avec des établissements de santé → potentiellement soumis comme sous-traitant

#### SecNumCloud vs HDS

| Critère | HDS 2.0 | SecNumCloud 3.2 |
|---------|---------|-----------------|
| **Émetteur** | ANS (santé) | ANSSI (tous secteurs) |
| **Périmètre** | Données de santé | Données sensibles (toutes) |
| **Stockage** | EEE | **France uniquement** |
| **Entité** | Toute | **Droit européen uniquement** |
| **Pour JIM MVP** | **Suffisant** | Non nécessaire sauf marchés publics |

_Sources : Doctrine Numérique Santé 2025 - Sécurité, CERT-FR - Secteur santé, ANSSI Plan Stratégique 2025-2027, NIS2 France Implementation, PGSSI-S Official, CaRE Program_

#### Audits de sécurité

| Type | Fréquence | Prestataire |
|------|-----------|-------------|
| **PASSI** (audit qualifié ANSSI) | Avant lancement + annuel | Prestataire qualifié ANSSI |
| **Pentest black box** | Avant lancement | Ziwit, YesWeHack, ou similaire |
| **Pentest gray box** | Semestriel | Prestataire qualifié |
| **Bug bounty** | Continu post-lancement | YesWeHack (FR/EU) ou Hackgate (FR) |
| **Scan de vulnérabilités** | Continu (CI/CD) | Snyk, SonarQube, npm audit |
| **Audit HDS** | Surveillance annuelle + renouvellement 3 ans | Organisme certificateur accrédité |

_Sources : Schellman - HDS v2 Key Considerations, RiskInsight - Evolution of HDS Framework, Ziwit - PASSI Certified Audit_

---

### 8. Tendances d'adoption et technologies émergentes

#### Court terme (2026-2027)

- **PSC/e-CPS généralisé** comme standard d'authentification santé
- **Deadline HDS 2.0** (mai 2026) = accélérateur de conformité massif
- **FHIR FR Core stabilisé**, premiers déploiements à grande échelle, Projectathon ANS mars 2026
- **NIS2 transposition française** effective mi-2026
- **CNIL enforcement apps mobiles** en cours depuis printemps 2025

#### Moyen terme (2027-2029)

- **EEDS** (Espace Européen des Données de Santé) opérationnel
- **eIDAS 2.0** : portefeuille d'identité numérique européen, convergence possible avec e-CPS
- **IA générative** intégrée aux outils santé (rédaction annonces, matching prédictif)
- **Post-quantum cryptography** : début des considérations pour le chiffrement

#### Long terme (2030+)

- Interopérabilité totale via FHIR
- Convergence identité numérique professionnelle EU
- Chiffrement homomorphe pour analyse de données santé chiffrées
- Automatisation administrative complète

---

## Synthèse — Stack technique recommandé pour JIM

### Architecture MVP complète

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JIM — Architecture MVP                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FRONTEND                          INFRASTRUCTURE                   │
│  ┌─────────────────────┐          ┌─────────────────────────┐      │
│  │ React Native (Expo) │          │ Scaleway (HDS certifié) │      │
│  │ TypeScript           │          │ Kubernetes Kapsule      │      │
│  │ Expo Router          │          │ PostgreSQL 18 managé    │      │
│  │ React Query          │          │ Object Storage S3      │      │
│  └────────┬────────────┘          │ Cloudflare CDN (assets)│      │
│           │                        └─────────────────────────┘      │
│           │ HTTPS/GraphQL                                           │
│           ▼                                                         │
│  API GATEWAY                                                        │
│  ┌─────────────────────┐                                           │
│  │ Traefik (K8s native)│                                           │
│  │ TLS 1.3 + mTLS      │                                           │
│  │ Rate limiting        │                                           │
│  │ WAF (Coraza)         │                                           │
│  └────────┬────────────┘                                           │
│           │ gRPC / REST                                             │
│           ▼                                                         │
│  MICROSERVICES (NestJS/TypeScript)                                  │
│  ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌──────┐ ┌─────────┐   │
│  │ Auth │ │Profil│ │Matching│ │Contract│ │Notif │ │Messaging│   │
│  │ PSC  │ │CRUD  │ │Géoloc  │ │Yousign │ │Push  │ │Chat RT  │   │
│  └──┬───┘ └──┬───┘ └───┬────┘ └───┬────┘ └──┬───┘ └────┬────┘   │
│     │        │         │          │          │          │          │
│     ▼        ▼         ▼          ▼          ▼          ▼          │
│  DONNÉES                                                            │
│  ┌────────────┐ ┌──────────┐ ┌───────┐ ┌────────────┐             │
│  │PostgreSQL18│ │MongoDB   │ │Redis  │ │TimescaleDB │             │
│  │Transactions│ │Profils   │ │8.0    │ │Audit logs  │             │
│  │Contrats    │ │Géospatial│ │Cache  │ │Compliance  │             │
│  │Audit légal │ │Matching  │ │Session│ │Métriques   │             │
│  └────────────┘ └──────────┘ │PubSub │ └────────────┘             │
│                               └───────┘                             │
│  COMMUNICATION ASYNC                                                │
│  ┌─────────────────────┐                                           │
│  │ RabbitMQ            │  Events, Sagas, Notifications async       │
│  └─────────────────────┘                                           │
│                                                                     │
│  SÉCURITÉ & MONITORING                                              │
│  ┌──────┐ ┌──────┐ ┌────────┐ ┌───────────┐ ┌─────────┐          │
│  │Wazuh │ │ELK   │ │Suricata│ │Vault (clés│ │Yousign  │          │
│  │SIEM  │ │Logs  │ │IDS     │ │chiffrement│ │Signature│          │
│  └──────┘ └──────┘ └────────┘ └───────────┘ └─────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Récapitulatif des choix technologiques

| Composant | Technologie choisie | Justification principale |
|-----------|-------------------|------------------------|
| **Mobile** | React Native + Expo | Talent pool FR, Doctolib référence, TypeScript partagé |
| **Backend** | NestJS (TypeScript) | Microservices natifs, PSC Passport, même langage que frontend |
| **API Gateway** | Traefik | K8s natif, self-hosted HDS, auto-discovery |
| **BDD transactionnelle** | PostgreSQL 18 | PITR, uuidv7, OAuth natif, contraintes temporelles |
| **BDD profils/géo** | MongoDB Atlas (HDS) | Géospatial 2dsphere, Queryable Encryption |
| **Cache/Sessions** | Redis 8.0 | Modules intégrés, Pub/Sub, sessions santé TTL |
| **Audit logs** | TimescaleDB | Compression 90%, requêtes temporelles 450x+ rapides |
| **Message queue** | RabbitMQ | Saga orchestration, Quorum Queues, routage sub-ms |
| **Hébergement** | Scaleway (HDS) | Meilleur rapport qualité/prix, FR, startup credits 36K€ |
| **Backup** | pgBackRest + Velero + S3 | PITR, K8s-native, AES-256, règle 3-2-1-1-0 |
| **Signature** | Yousign API | FR, eIDAS, conforme contrats kiné |
| **CDN** | Cloudflare | PoP Réunion, assets statiques uniquement |
| **SIEM** | Wazuh + ELK | Open source, dashboards compliance RGPD |
| **WAF** | Coraza (+ Cloudflare) | Remplacement ModSecurity, self-hosted HDS |
| **Secrets** | HashiCorp Vault | Gestion clés chiffrement, rotation 90j |
| **CI/CD** | GitHub Actions + EAS Build | Standard, Expo intégré |
| **IaC** | Terraform + Helm | Reproductibilité infrastructure HDS |

### Estimation budgétaire infrastructure mensuelle

| Poste | Coût estimé/mois |
|-------|-----------------|
| Scaleway K8s (3 nœuds 4vCPU/16GB) | ~320€ |
| PostgreSQL managé | ~50€ |
| MongoDB Atlas (HDS) | ~60€ |
| Redis managé | ~30€ |
| Object Storage (backups + docs) | ~20€ |
| Load Balancer | ~15€ |
| Cloudflare Pro | ~20€ |
| Yousign API | ~50-100€ (volume) |
| Monitoring (Wazuh self-hosted) | Inclus dans K8s |
| **Total MVP estimé** | **~565-615€/mois** |

_Note : avant crédits startup Scaleway (jusqu'à 36 000€). Avec crédits, le coût infrastructure peut être nul pendant ~5 ans pour les services Scaleway._

---

## Integration Patterns Analysis

### Intégrations externes — APIs spécifiques JIM

#### 1. Yousign API v3 — Signature électronique des contrats

| Paramètre | Détail |
|-----------|--------|
| **Version** | v3 (v2 deprecated) |
| **URL Production** | `https://api.yousign.app/v3` |
| **URL Sandbox** | `https://api-sandbox.yousign.app/v3` |
| **Authentification** | Bearer token (`Authorization: Bearer {apiKey}`) |
| **Rate limits (sandbox)** | 30 requêtes/min, 200/heure |
| **Pricing** | Pay-as-you-go, ~8-12€/user pour 30 signatures/mois |

**Niveaux de signature eIDAS :**

| Niveau | Usage JIM | Vérification |
|--------|-----------|-------------|
| **SES** (Simple) | CGU, échanges courants | Email seul |
| **AES** (Avancée) — **Recommandé** | Contrats de remplacement | Pièce d'identité + SMS OTP |
| **QES** (Qualifiée) | Contrats haute valeur légale | Face-to-face ou RAD vidéo |

**Intégration recommandée :** Signature AES avec iFrame intégré dans l'app (disponible pour SES et AES) pour une expérience de signature in-app fluide.

**Flux de signature d'un contrat JIM :**
```
1. Contract Service génère le PDF du contrat (template Ordre MK)
2. Upload PDF via POST /signature_requests
3. Ajout des signataires (titulaire + remplaçant) via POST /signature_requests/{id}/signers
4. Activation de la demande via POST /signature_requests/{id}/activate
5. Chaque signataire reçoit un lien → vérifie identité → signe
6. Webhook Yousign notifie JIM → Contract Service met à jour le statut
7. PDF signé téléchargé et archivé (Object Storage HDS)
```

_Sources : Yousign Developers, Yousign Signature Levels, Yousign Pricing API_

#### 2. RPPS API (Annuaire Santé) — Vérification des professionnels

| Paramètre | Détail |
|-----------|--------|
| **API Gateway** | `https://gateway.api.esante.gouv.fr/fhir/v2/` |
| **Standard** | HL7 FHIR (JSON RESTful) |
| **Authentification** | Données publiques : aucune auth / Données restreintes : CPS + Formulaire F420 |
| **Rafraîchissement** | Hebdomadaire (recommandé ANS) |

**Ressources FHIR disponibles :**

| Ressource | Données | Accès |
|-----------|---------|-------|
| **Practitioner** | Numéro RPPS, nom, diplômes, qualifications, profession, spécialité | Public |
| **PractitionerRole** | Rôle, lieu d'exercice, coordonnées cabinet | Public |
| **Organization** | Structures d'exercice | Public |
| **HealthcareService** | Services proposés | Public |

**Données publiques accessibles sans authentification :**
- Numéro RPPS (11 caractères, contrôle Luhn via `idNat_PS`)
- Nom et prénom
- Diplômes et qualifications
- Profession et spécialité
- Coordonnées géographiques du lieu d'exercice

**Vérification d'un kiné lors de l'inscription JIM :**
```
GET https://gateway.api.esante.gouv.fr/fhir/v2/Practitioner?identifier=8{RPPS_NUMBER}
→ Vérifie que le numéro RPPS existe et correspond à un kinésithérapeute
→ Récupère nom, spécialité, lieu d'exercice
→ Compare avec les données saisies par l'utilisateur
→ Si match → inscription validée + enrichissement profil automatique
```

_Sources : ANS Annuaire Santé, FHIR API Documentation (ansforge.github.io), API Portal (portal.api.esante.gouv.fr)_

#### 3. FHIR FR Core — Interopérabilité future

| Paramètre | Détail |
|-----------|--------|
| **Version** | v2.2.0-ballot-2 (build du 23/02/2026) |
| **FHIR version** | R4 |
| **50+ extensions** françaises définies |
| **Alignement européen** | Héritage futur des profils HL7 Base Europe (EEDS) |

**Profils FR Core pertinents pour JIM :**

| Profil FHIR | Mapping JIM |
|-------------|-------------|
| **FR Core Practitioner** | Profil kinésithérapeute |
| **FR Core PractitionerRole** | Rôle (titulaire, remplaçant, collaborateur) |
| **FR Core Organization** | Cabinet de kinésithérapie |
| **FR Core Location** | Lieu d'exercice (géolocalisation) |
| **FR Core Appointment** | Rendez-vous de remplacement (futur) |
| **FR Core Schedule** | Disponibilités (futur) |
| **FR Core Slot** | Créneaux disponibles (futur) |

**Recommandation :** même si le MVP n'implémente pas FHIR, **concevoir les modèles de données JIM alignés avec les profils FR Core** dès maintenant facilite l'interopérabilité future (DMP, logiciels de gestion, établissements).

_Sources : FR Core v2.2.0-ballot-2 (build.fhir.org), French FHIR IG Registry (interop.esante.gouv.fr), GitHub hl7.fhir.fr.core_

#### 4. Push Notifications — Architecture santé

**Règle critique :** NE JAMAIS inclure de données de santé sensibles dans le payload de notification.

**Architecture recommandée :**
```
1. Événement métier (nouveau matching, contrat à signer, message)
2. Notification Service → payload générique :
   { title: "Nouveau remplacement disponible", body: "Ouvrez JIM pour plus de détails" }
3. FCM/APNs → push notification → device
4. User ouvre l'app → appel API authentifié → récupère le contenu réel
5. Logging : toutes les notifications envoyées sont auditées
```

**FCM et RGPD :** Google est processeur de données, DPA requis, ISO 27001/SOC certifié, chiffrement E2E supporté. Messages stockés jusqu'à 28 jours pour les devices offline.

_Sources : HIPAA Compliant Push Notifications 2026 (indigitall.com), Firebase Privacy, FCM E2E Encryption_

#### 5. WebSocket / Socket.io — Messagerie temps réel

**Recommandation : Socket.io** (plutôt que WebSocket natif)

| Avantage Socket.io | Détail |
|---------------------|--------|
| Auto-reconnexion | Gestion native des pertes de connexion (DOM-TOM !) |
| Rooms | Conversations 1:1 et groupes nativement |
| Redis Adapter | Scaling horizontal sur Kubernetes |
| Clients multiplateformes | React Native, Flutter, web |
| Fallback HTTP long-polling | Si WebSocket bloqué (certains réseaux hospitaliers) |

**Scaling sur Kubernetes :**
```yaml
# Service K8s avec sticky sessions pour WebSocket
apiVersion: v1
kind: Service
metadata:
  name: jim-messaging
spec:
  sessionAffinity: ClientIP  # Sticky sessions
  ports:
    - port: 3000
---
# Ingress NGINX avec support WebSocket
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    nginx.ingress.kubernetes.io/affinity: "cookie"
```

**Mémoire :** ~16 KB par connexion TCP → 100K connexions ≈ 1,6 GB

**Sécurité santé :** chiffrement applicatif des messages, validation JWT sur handshake, persistance des messages pour audit, rate limiting par utilisateur.

_Sources : Socket.IO vs WebSocket (Ably), Scaling WebSockets with Redis + K8s, WebSocket Complete Guide 2026_

#### 6. Cartographie — Mapbox + BAN API

**Recommandation : Mapbox** (plutôt que Google Maps)

| Critère | Mapbox | Google Maps |
|---------|--------|-------------|
| **RGPD** | **Mapbox Atlas** = self-hosted, données dans votre infra | Données chez Google (US) |
| **Offline** | **Oui** (critique DOM-TOM) | Limité |
| **Free tier** | 50K loads web/mois, 25K MAU mobile | 10K appels/mois/API (depuis mars 2025) |
| **Prix après free tier** | Compétitif | Plus cher |
| **HIPAA/SOC 2** | Conforme | Conforme |

**BAN API (Base Adresse Nationale)** — gratuite, souveraine :
- `https://api-adresse.data.gouv.fr/search/` — géocodage
- `https://api-adresse.data.gouv.fr/reverse/` — géocodage inverse
- Couverture France entière + DOM-TOM
- Aucune authentification requise
- Données ouvertes (Licence Ouverte 2.0)

**Stratégie géolocalisation JIM :**
1. **BAN API** pour le géocodage d'adresses (gratuit, souverain)
2. **Mapbox** pour la cartographie interactive et les cartes offline (DOM-TOM)
3. **MongoDB 2dsphere** pour les requêtes géospatiales côté serveur (matching)

_Sources : Mapbox vs Google Maps 2026 (Radar), Mapbox Atlas, Mapbox DPA, Google Maps March 2025 Changes_

---

### Protocoles de communication — Synthèse

| Couche | Protocole | Format | Usage |
|--------|-----------|--------|-------|
| **App → API Gateway** | HTTPS (TLS 1.3) | GraphQL (JSON) | Requêtes mobile |
| **API Gateway → Services** | gRPC | Protobuf | Communication interne synchrone |
| **Services → Services (async)** | AMQP (RabbitMQ) | JSON | Events, sagas, notifications |
| **App ↔ Messaging** | WebSocket (Socket.io) | JSON (chiffré app-level) | Chat temps réel |
| **Services → PSC** | HTTPS | OpenID Connect (JWT) | Authentification |
| **Services → RPPS** | HTTPS | FHIR JSON (REST) | Vérification professionnelle |
| **Services → Yousign** | HTTPS (REST) | JSON | Signature électronique |
| **Services → BAN** | HTTPS (REST) | GeoJSON | Géocodage |
| **Services → FCM/APNs** | HTTPS | JSON | Push notifications |

### Sécurité des intégrations

| Intégration | Authentification | Chiffrement | Vérification |
|-------------|-----------------|-------------|--------------|
| **PSC** | OpenID Connect + PKCE | RSA 2048 + SHA-256 | JWKS validation |
| **RPPS** | Public (données ouvertes) | TLS 1.3 | Contrôle Luhn RPPS |
| **Yousign** | API Key (Bearer) | TLS 1.3 | Webhook signature HMAC |
| **FCM** | Service Account (JSON) | TLS 1.3 + E2E optionnel | Message ID tracking |
| **BAN** | Aucune | TLS 1.3 | Validation résultat (score) |
| **Mapbox** | Token public + secret | TLS 1.3 | Token rotation |
| **Inter-services** | JWT court (5 min, EdDSA) | mTLS | JWKS interne |

---

## Architectural Patterns and Design

### Architecture hexagonale avec NestJS

NestJS est particulièrement adapté à l'architecture hexagonale grâce à son système de modules natif et son injection de dépendances.

**Structure recommandée par bounded context :**

```
src/
├── modules/
│   ├── identity/                    # Bounded Context: Identity & Access
│   │   ├── domain/
│   │   │   ├── entities/            # Aggregate roots, entités
│   │   │   │   ├── professional.entity.ts
│   │   │   │   └── session.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── rpps-number.vo.ts    # Validation Luhn intégrée
│   │   │   │   └── email.vo.ts
│   │   │   ├── ports/               # Interfaces (contrats)
│   │   │   │   ├── professional.repository.port.ts
│   │   │   │   └── psc-auth.port.ts
│   │   │   └── events/
│   │   │       └── professional-registered.event.ts
│   │   ├── application/
│   │   │   ├── commands/            # Write operations
│   │   │   │   └── register-professional.command.ts
│   │   │   ├── queries/             # Read operations (CQRS)
│   │   │   │   └── get-professional.query.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── infrastructure/          # Adapters (implémentations)
│   │   │   ├── adapters/
│   │   │   │   ├── psc-auth.adapter.ts      # OpenID Connect PSC
│   │   │   │   ├── rpps-verification.adapter.ts
│   │   │   │   └── postgres-professional.repository.ts
│   │   │   └── mappers/
│   │   │       └── professional.mapper.ts
│   │   └── presentation/           # Controllers, DTOs
│   │       ├── controllers/
│   │       │   └── auth.controller.ts
│   │       └── dtos/
│   │           └── register.dto.ts
│   │
│   ├── matching/                    # Bounded Context: Matching
│   ├── contracts/                   # Bounded Context: Contracts
│   ├── messaging/                   # Bounded Context: Messaging
│   └── notifications/               # Bounded Context: Notifications
│
├── shared/                          # Shared kernel
│   ├── domain/
│   │   ├── base.entity.ts
│   │   └── domain-event.ts
│   └── infrastructure/
│       ├── database/
│       └── messaging/
```

**Principes clés :**
- Les **ports** sont des interfaces TypeScript (ex: `ProfessionalRepositoryPort`)
- Les **adapters** sont des implémentations concrètes injectées via `@Inject()` token
- Changer d'implémentation (ex: in-memory → PostgreSQL) = changer le binding du provider dans le module
- Le domaine ne dépend **jamais** de l'infrastructure (inversion de dépendance)

_Sources : Domain-Driven Hexagon (GitHub/Sairyss), Leapcell - Hexagonal Architecture with NestJS_

### Domain-Driven Design — Bounded Contexts JIM

| Bounded Context | Responsabilité | Aggregate Root | Events principaux |
|-----------------|----------------|----------------|-------------------|
| **Identity & Access** | Auth PSC, profils pro, RPPS | `Professional` | `ProfessionalRegistered`, `ProfessionalVerified` |
| **Mission Management** | Annonces, matching, candidatures | `Mission` | `MissionPublished`, `MissionAssigned`, `MissionCompleted` |
| **Contract Management** | Génération, signature, archivage | `Contract` | `ContractCreated`, `ContractSigned`, `ContractArchived` |
| **Messaging** | Chat temps réel, conversations | `Conversation` | `MessageSent`, `ConversationCreated` |
| **Notifications** | Push, email, SMS, in-app | `NotificationPreference` | `NotificationSent`, `NotificationRead` |
| **Reviews** | Évaluations post-mission | `Review` | `ReviewSubmitted`, `ReviewModerated` |
| **Compliance** | Audit trail, conformité HDS/RGPD | `AuditEntry` | `DataAccessLogged`, `ConsentRecorded` |
| **Analytics** | Métriques, dashboard, reporting | (read-only) | Consomme les events des autres BC |

**Context Map :**
```
Identity ←→ Mission Management    (Shared Kernel: Professional identity)
Mission Management → Contract     (Customer-Supplier: mission assigned → contract created)
Contract → Notifications          (Customer-Supplier: contract events → notifications)
Mission Management → Messaging    (Customer-Supplier: match accepted → conversation)
Tous → Compliance                 (Published Language: tous les domain events → audit)
Tous → Analytics                  (Published Language: events → métriques)
```

**Exemple Aggregate Root — Mission :**
```typescript
// domain/entities/mission.entity.ts
export class Mission extends AggregateRoot {
  private readonly id: MissionId;
  private status: MissionStatus;
  private location: Location;          // Value Object (lat/lng + rayon)
  private compensation: Compensation;   // Value Object (honoraires + conditions)
  private period: DateRange;            // Value Object (début + fin)
  private publisherId: ProfessionalId;  // Référence au titulaire
  private assigneeId?: ProfessionalId;  // Référence au remplaçant

  publish(): void {
    this.guardAgainstInvalidState();
    this.status = MissionStatus.PUBLISHED;
    this.apply(new MissionPublishedEvent(this.id, this.location, this.period));
  }

  assign(replacementId: ProfessionalId): void {
    if (this.status !== MissionStatus.PUBLISHED) throw new MissionNotAvailableError();
    this.assigneeId = replacementId;
    this.status = MissionStatus.ASSIGNED;
    this.apply(new MissionAssignedEvent(this.id, this.publisherId, replacementId));
    // → Déclenche la Saga de création de contrat
  }
}
```

_Sources : QCon London 2025 - DDD at Scale (InfoQ), Nirmitee - DDD in Healthcare_

### 12-Factor App — Mapping Kubernetes pour JIM

| Factor | Principe | Implémentation JIM (K8s) |
|--------|----------|-------------------------|
| **I. Codebase** | 1 repo par service | Monorepo NestJS avec Nx ou Turborepo |
| **II. Dependencies** | Déclaration explicite | `package.json` + lockfile, Docker multi-stage |
| **III. Config** | Config dans l'environnement | ConfigMaps (non-sensible) + Secrets (Vault) |
| **IV. Backing Services** | Ressources attachées | PostgreSQL, MongoDB, Redis, RabbitMQ via K8s Services |
| **V. Build, Release, Run** | Étapes séparées | GitHub Actions (build) → Container Registry → ArgoCD (run) |
| **VI. Processes** | Stateless | Pods stateless, état dans PostgreSQL/Redis/MongoDB |
| **VII. Port Binding** | Service auto-contenu | Container expose le port, K8s Service route |
| **VIII. Concurrency** | Scale out via processes | HPA (pods), KEDA (event-driven) |
| **IX. Disposability** | Démarrage rapide, arrêt gracieux | `readinessProbe`, `livenessProbe`, `preStop` hooks |
| **X. Dev/Prod Parity** | Environnements similaires | Docker Compose (dev) ≈ K8s (prod), même images |
| **XI. Logs** | Flux d'événements | stdout/stderr → Fluent Bit → Loki/ELK |
| **XII. Admin Processes** | Tâches ponctuelles | K8s Jobs/CronJobs (migrations, cleanups) |

**Extension santé :**
- Audit logging PHI (accès aux données professionnelles) sur chaque requête
- Tous les services en mTLS strict
- Rétention des logs 6+ ans (conformité HDS)

_Sources : Red Hat - 12-Factor App meets Kubernetes, 12factor.net_

### Zero Trust Architecture — Modèle NIST pour JIM

Le NIST a publié **SP 1800-35** en juin 2025 : guide d'implémentation ZTA complet.

**7 piliers NIST/CISA appliqués à JIM :**

| Pilier | Implémentation JIM |
|--------|-------------------|
| **1. Identity** | PSC/e-CPS (identité forte), MFA obligatoire, session courte (Redis TTL) |
| **2. Devices** | App attestation (Play Integrity / App Attest), jailbreak detection |
| **3. Networks** | NetworkPolicies Calico/Cilium, micro-segmentation par namespace |
| **4. Applications** | mTLS inter-services (Istio/Linkerd), RBAC+ABAC par endpoint |
| **5. Data** | Chiffrement E2E, Queryable Encryption (MongoDB), classification données |
| **6. Visibility** | OpenTelemetry, Wazuh SIEM, audit trail complet |
| **7. Automation** | Policy-as-Code (OPA/Gatekeeper), automated response (Falco) |

**Micro-segmentation Kubernetes :**
```yaml
# NetworkPolicy — isoler le Contract Service
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: contract-service-policy
  namespace: jim-contracts
spec:
  podSelector:
    matchLabels:
      app: contract-service
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: jim-gateway    # Seul le gateway peut appeler
        - namespaceSelector:
            matchLabels:
              name: jim-matching   # Et le matching service
      ports:
        - port: 50051             # gRPC uniquement
          protocol: TCP
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: jim-data       # Accès aux bases de données
      ports:
        - port: 5432              # PostgreSQL
        - port: 6379              # Redis
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0       # Yousign API (externe)
      ports:
        - port: 443
```

_Sources : NIST SP 1800-35 (June 2025), Zero Trust Blueprint for Healthcare IT 2025 (capminds.com)_

### Scalabilité — Auto-scaling sur Kubernetes

#### Matrice de scaling par service JIM

| Service | Scaling | Mécanisme | Métriques |
|---------|---------|-----------|-----------|
| **Auth** | Horizontal | HPA | CPU > 70%, requêtes/sec |
| **Profile** | Horizontal | HPA | CPU > 70%, mémoire |
| **Matching** | Event-driven | **KEDA** | Messages RabbitMQ en queue |
| **Contract** | Event-driven | **KEDA** | Contrats en attente de signature |
| **Notification** | Event-driven | **KEDA** | Notifications en queue |
| **Messaging** | Horizontal | HPA | Connexions WebSocket actives |

**KEDA (Kubernetes Event-Driven Autoscaling)** — diplômé CNCF, supporte 74 sources d'événements dont RabbitMQ :

```yaml
# KEDA ScaledObject pour le Matching Service
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: matching-service-scaler
  namespace: jim-matching
spec:
  scaleTargetRef:
    name: matching-service
  minReplicaCount: 1
  maxReplicaCount: 10
  triggers:
    - type: rabbitmq
      metadata:
        queueName: matching-requests
        host: amqp://rabbitmq.jim-infra.svc:5672
        queueLength: "5"     # Scale up si > 5 messages en queue
```

**HPA pour l'Auth Service :**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
  namespace: jim-auth
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 2              # Minimum 2 pour haute disponibilité
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "100"   # Scale si > 100 req/s par pod
```

**Règle critique :** ne JAMAIS utiliser HPA et VPA sur la même dimension de ressource (CPU ou mémoire) pour le même déploiement.

_Sources : HPA vs VPA 2025 (ScaleOps), KEDA.sh, Kubernetes Autoscaling Patterns (Spectro Cloud)_

### Service Mesh — Comparatif pour JIM

| Critère | Cilium (eBPF) | Linkerd | Istio |
|---------|---------------|---------|-------|
| **Latence P99** | **0.5-1ms** | 1-2ms | 3-5ms |
| **Mémoire/proxy** | **10-15MB** | 20-30MB | 50-100MB |
| **Auto-mTLS** | Oui | **Oui (natif)** | Oui |
| **Complexité** | Moyenne (eBPF) | **Faible** | Haute |
| **Features** | Networking + security + observability | mTLS + metrics + retry | Complet (traffic mgmt, policies) |
| **CNCF** | Graduated | Graduated | **Graduated (2025)** |

**Recommandation pour JIM MVP : Linkerd**
- Plus simple à opérer que Istio
- Auto-mTLS sans configuration
- Overhead minimal (~20MB/proxy)
- Suffisant pour les besoins JIM (mTLS, retry, circuit breaker, metrics)

**Phase 2 : évaluer Cilium** si besoin de network policies avancées (eBPF offre des performances supérieures et une visibilité réseau profonde).

**Tendance 2025-2026 :** évolution vers le **mode ambient** (mTLS partagé par nœud via ztunnel, élimine les sidecars per-pod) pour réduire l'overhead.

_Sources : Service Mesh Comparison 2026 (reintech.io), Service Mesh Evolution - Ambient Mode (cloudnativenow.com)_

### GitOps et CI/CD — Pipeline HDS-conforme

**Architecture CI/CD recommandée :**

```
┌──────────────────────────────────────────────────────────────────┐
│                    JIM — CI/CD Pipeline                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DÉVELOPPEUR           CI (GitHub Actions)        CD (ArgoCD)    │
│  ┌──────┐             ┌─────────────────┐       ┌─────────────┐│
│  │ Code │──push──→    │ 1. Lint + Test  │       │ ArgoCD      ││
│  │ PR   │             │ 2. SAST (CodeQL)│       │ (GitOps)    ││
│  └──────┘             │ 3. Dep scan     │       │             ││
│                       │    (npm audit)  │       │ Sync auto   ││
│                       │ 4. Build Docker │       │ depuis Git  ││
│                       │ 5. Trivy scan   │       │             ││
│                       │ 6. Sign (Cosign)│       │ Canary      ││
│                       │ 7. Push registry│       │ rollout     ││
│                       │ 8. Update GitOps│       │             ││
│                       └────────┬────────┘       └──────┬──────┘│
│                                │                        │       │
│                                └────── git commit ──────┘       │
│                                  (manifests K8s)                 │
│                                                                  │
│  DÉPLOIEMENT CANARY (Argo Rollouts)                             │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 5% trafic → analyse (success rate ≥99%, P99 <500ms) │       │
│  │ 25% trafic → analyse                                 │       │
│  │ 75% trafic → analyse                                 │       │
│  │ 100% trafic → promotion complète                     │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Conformité HDS via GitOps :**
- Tout est dans Git → audit trail natif (qui a changé quoi, quand, pourquoi)
- PR reviews obligatoires → workflow d'approbation
- Commits signés → preuve d'authorship
- ArgoCD synchronise automatiquement l'état désiré (Git) avec l'état réel (cluster)
- Rollback instantané = `git revert`

**Canary deployment (Argo Rollouts) :**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: auth-service
spec:
  strategy:
    canary:
      steps:
        - setWeight: 5
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: success-rate
            args:
              - name: service-name
                value: auth-service
        - setWeight: 25
        - pause: { duration: 10m }
        - setWeight: 75
        - pause: { duration: 10m }
        - setWeight: 100
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
spec:
  metrics:
    - name: success-rate
      interval: 60s
      successCondition: result[0] >= 0.99   # ≥99% success rate
      provider:
        prometheus:
          address: http://prometheus.jim-monitoring:9090
          query: |
            sum(rate(http_requests_total{service="{{args.service-name}}",status=~"2.."}[5m]))
            /
            sum(rate(http_requests_total{service="{{args.service-name}}"}[5m]))
```

_Sources : GitOps in 2025 (CNCF), Argo Rollouts Blue-Green & Canary (Akuity)_

### Observabilité — Stack OpenTelemetry

**OpenTelemetry** est le standard global en 2025-2026 (4 signaux : traces, métriques, logs + profiling).

**Stack observabilité JIM :**

```
┌──────────────────────────────────────────────────────────────┐
│                    JIM — Observability Stack                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Services NestJS                    OTel Collector            │
│  ┌──────────────────┐              ┌────────────────────┐   │
│  │ OTel SDK (auto)  │──traces──→   │ Receive            │   │
│  │ - HTTP spans     │──metrics──→  │ Process:           │   │
│  │ - DB spans       │──logs────→   │  - PHI redaction   │   │
│  │ - gRPC spans     │              │  - sampling        │   │
│  └──────────────────┘              │  - enrichment      │   │
│                                    │ Export to:         │   │
│                                    └───┬───┬───┬───────┘   │
│                                        │   │   │            │
│                        ┌───────────────┘   │   └──────┐    │
│                        ▼                   ▼          ▼    │
│                   ┌─────────┐       ┌─────────┐ ┌───────┐ │
│                   │ Tempo   │       │Prometheus│ │ Loki  │ │
│                   │ (traces)│       │(metrics) │ │(logs) │ │
│                   └────┬────┘       └────┬────┘ └───┬───┘ │
│                        │                  │          │      │
│                        └──────────┬───────┘──────────┘      │
│                                   ▼                          │
│                            ┌────────────┐                   │
│                            │  Grafana   │                   │
│                            │ Dashboards │                   │
│                            │ Alerting   │                   │
│                            │ SLOs       │                   │
│                            └────────────┘                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Redaction PHI dans l'OTel Collector :**
```yaml
# OTel Collector config - redaction des données sensibles
processors:
  transform:
    trace_statements:
      - context: span
        statements:
          # Supprimer les numéros RPPS des attributs de span
          - replace_pattern(attributes["http.url"], "rpps=\\d+", "rpps=REDACTED")
          # Supprimer les noms de patients si présents
          - delete_key(attributes, "patient.name")
          - delete_key(attributes, "patient.id")
```

**SLOs santé pour JIM :**

| Service | Disponibilité | Latence P99 | Error Budget (30j) |
|---------|--------------|-------------|-------------------|
| **API Gateway** | 99.95% | < 200ms | 21.6 min/mois |
| **Auth Service** | 99.99% | < 300ms | 4.3 min/mois |
| **Matching Service** | 99.9% | < 500ms | 43.2 min/mois |
| **Contract Service** | 99.95% | < 1s | 21.6 min/mois |
| **Messaging** | 99.9% | < 100ms | 43.2 min/mois |
| **Notifications** | 99.5% | < 2s | 3.6 h/mois |

_Sources : OpenTelemetry in 2026 (The New Stack), Grafana Observability Survey 2025, OpenTelemetry with Prometheus (Grafana)_

### Data Architecture — Stratégie de migration

**Migrations PostgreSQL :**
- Outil recommandé : **Prisma** (ORM TypeScript) ou **TypeORM** avec migration système intégré
- Migrations versionnées dans Git (audit trail HDS)
- Exécution via K8s Jobs (Factor XII, 12-Factor)
- Rollback automatique si échec

**Stratégie de données multi-BDD :**

```
Écriture (Command)                    Lecture (Query)
      │                                     │
      ▼                                     ▼
  PostgreSQL                           MongoDB (read replicas)
  (source de vérité)                   (optimisé pour recherche)
      │                                     ▲
      └──── Domain Events ──── RabbitMQ ────┘
             (Outbox Pattern)
```

Le **Outbox Pattern** garantit la cohérence : les domain events sont écrits dans une table `outbox` PostgreSQL dans la même transaction que les données métier, puis un worker les publie sur RabbitMQ. Cela évite le double-write problem et assure exactly-once semantics.

---

## Implementation Approaches and Technology Adoption

### Stratégie d'adoption — Approche phasée

| Phase | Durée | Objectif | Livrables |
|-------|-------|----------|-----------|
| **Phase 0 — Setup** | 2-3 semaines | Infrastructure & tooling | Monorepo Nx, CI/CD, K8s dev, Docker Compose |
| **Phase 1 — MVP Core** | 3-4 mois | Mise en relation fonctionnelle | Auth PSC, profils, matching géo, contrats Yousign |
| **Phase 2 — Enrichissement** | 2-3 mois | Messagerie, notifications, reviews | Chat Socket.io, push FCM, évaluations |
| **Phase 3 — Conformité HDS** | 1-2 mois | Données santé (si applicable) | Migration hébergeur HDS 2.0, AIPD, DPO |
| **Phase 4 — Scale** | 3+ mois | IA matching, gestion cabinet | Algorithme ML, facturation, Ségur |

### Stratégie de testing — Pyramide santé

```
                    ┌─────────┐
                    │  E2E    │  5-10% — Maestro (mobile)
                    │ Maestro │  15 tests max (flux critiques)
                   ┌┴─────────┴┐
                   │Integration │  20% — Supertest + Testcontainers
                   │  + Contract│  Pact (consumer-driven contracts)
                  ┌┴────────────┴┐
                  │  Unit Tests   │  70% — Jest + RNTL
                  │  (Jest)       │  Couverture ≥80%
                 ┌┴──────────────┴┐
                 │ Compliance Layer │  Continu — SAST, DAST, FHIR validation
                 │ (Security/RGPD)  │  SonarQube, Trivy, OWASP ZAP, k6
                 └──────────────────┘
```

**Par couche de test :**

| Couche | Outil | Scope JIM | Fréquence |
|--------|-------|-----------|-----------|
| **Unit** | Jest 30 + React Native Testing Library | Logique métier, composants, services NestJS | Chaque commit |
| **Integration** | Supertest + Testcontainers | APIs NestJS avec vrais PostgreSQL/MongoDB/Redis en Docker | Chaque PR |
| **Contract** | Pact (consumer-driven) | App mobile ↔ BFF GraphQL ↔ microservices gRPC | Chaque PR |
| **E2E mobile** | **Maestro** (recommandé vs Detox) | Inscription PSC, publication annonce, signature contrat, chat | Nightly + pre-release |
| **Load** | Grafana k6 1.0 (mai 2025) | API Gateway, Matching Service, Auth Service | Hebdomadaire |
| **SAST** | SonarQube + Semgrep | Code source (vulnérabilités, code smells) | Chaque commit (CI) |
| **DAST** | OWASP ZAP | APIs en staging (injections, XSS, auth bypass) | Hebdomadaire |
| **SCA** | Trivy + Snyk | Dépendances npm (CVEs), images Docker | Chaque build (CI) |
| **FHIR** | HAPI FHIR Validator | Validation des profils FR Core (si applicable) | Chaque PR impactant les modèles |

**Maestro vs Detox pour React Native :**

| Critère | Maestro | Detox |
|---------|---------|-------|
| **Setup** | Zero dépendances projet | Config complexe dans le projet |
| **Langage de test** | **YAML** (simple) | JavaScript |
| **Cross-platform** | iOS + Android cohérent | iOS + Android (config séparée) |
| **Expo** | **Intégration native EAS Workflows** | Nécessite config spéciale |
| **Stabilité** | Bonne (caveats mineurs : z-index, keyboard) | Bonne (mais flaky sur Android) |
| **Recommandation** | **Choix JIM** | Alternative viable |

**Exemple de test Maestro pour JIM :**
```yaml
# tests/e2e/flows/publish-mission.yaml
appId: com.jim.app
---
- launchApp
- tapOn: "Connexion PSC"
- waitForAnimationToEnd
# ... auth flow ...
- tapOn: "Publier une annonce"
- tapOn: "Type de mission"
- tapOn: "Remplacement"
- inputText:
    id: "mission-title"
    text: "Remplacement cabinet centre-ville Marseille"
- tapOn: "Localisation"
- inputText:
    id: "address-search"
    text: "13001 Marseille"
- tapOn:
    text: "Marseille 13001"
- tapOn: "Publier"
- assertVisible: "Annonce publiée avec succès"
```

_Sources : Maestro (mobile.dev), Pact Contract Testing, Grafana k6 1.0, OWASP ZAP, Testcontainers, HAPI FHIR Validator_

### Environnement de développement

**Docker Compose pour le développement local :**

```yaml
# docker-compose.dev.yml — miroir de la production K8s
version: "3.9"
services:
  postgres:
    image: postgres:18-alpine
    environment:
      POSTGRES_DB: jim_dev
      POSTGRES_USER: jim
      POSTGRES_PASSWORD: dev_password
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: ["mongodata:/data/db"]

  redis:
    image: redis:8-alpine
    ports: ["6379:6379"]

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports: ["5672:5672", "15672:15672"]

  # Microservices avec hot-reload
  auth-service:
    build:
      context: .
      dockerfile: apps/auth-service/Dockerfile.dev
    volumes:
      - ./apps/auth-service/src:/app/apps/auth-service/src
      - ./libs:/app/libs    # Shared libraries
    depends_on: [postgres, redis]
    environment:
      - NODE_ENV=development
      - PSC_CLIENT_ID=sandbox_client
      - PSC_CLIENT_SECRET=sandbox_secret

  # ... autres services similaires ...

volumes:
  pgdata:
  mongodata:
```

**Dev Containers** (`.devcontainer/devcontainer.json`) pour un environnement reproductible entre tous les développeurs, compatible VS Code, GitHub Codespaces et DevPod.

**Transition vers K8s** : utiliser **Tilt** (web UI riche) pour le développement local sur K8s quand la complexité augmente en Phase 2+.

_Sources : Docker Compose Documentation, Dev Containers Specification, Tilt.dev_

### Organisation monorepo — Nx pour NestJS

**Nx est recommandé sur Turborepo** pour JIM grâce à :
- Plugin `@nx/nest` natif avec générateurs de code
- Analyse de dépendances fine (fichier par fichier, 7x plus rapide sur gros monorepos)
- Organisation DDD-friendly des bibliothèques
- Cache distribué (Nx Cloud)

**Structure monorepo recommandée :**

```
jim/
├── apps/
│   ├── mobile/                  # React Native + Expo
│   ├── auth-service/            # NestJS microservice
│   ├── profile-service/
│   ├── matching-service/
│   ├── contract-service/
│   ├── notification-service/
│   └── messaging-service/
├── libs/
│   ├── shared/
│   │   ├── domain/              # Entités, VO, events partagés
│   │   ├── utils/               # Helpers communs
│   │   └── constants/           # Constantes partagées
│   ├── api-contracts/
│   │   ├── graphql-schema/      # Schéma GraphQL (BFF)
│   │   └── proto/               # Fichiers .proto (gRPC)
│   ├── infrastructure/
│   │   ├── database/            # Config DB, migrations partagées
│   │   ├── messaging/           # Config RabbitMQ, Redis
│   │   └── auth/                # Config PSC commune
│   └── testing/
│       ├── factories/           # Test data factories
│       └── mocks/               # Mocks partagés (PSC, RPPS, Yousign)
├── tools/
│   ├── scripts/                 # Scripts utilitaires
│   └── generators/              # Nx generators custom
├── nx.json
├── tsconfig.base.json
└── docker-compose.dev.yml
```

_Sources : Nx Documentation, Nx vs Turborepo Comparison 2025_

### Équipe et compétences

**Composition MVP (8-10 personnes) :**

| Rôle | Nb | Compétences clés | Priorité |
|------|----|-----------------|----------|
| **Product Owner / PM** | 1 | Santé, UX, roadmap, conformité | Critique |
| **UX/UI Designer** | 1 | Mobile-first, accessibilité, design system | Critique |
| **Backend NestJS** | 2 | TypeScript, microservices, PostgreSQL, gRPC | Critique |
| **Mobile React Native** | 1-2 | TypeScript, Expo, React Query, GraphQL | Critique |
| **DevOps / SRE** | 1 | Kubernetes, Terraform, CI/CD, monitoring | Critique |
| **QA Engineer** | 1 | Maestro, Pact, k6, automatisation | Haute |
| **DPO / Compliance** | 0.5-1 | RGPD, HDS, CNIL, droit santé numérique | **Obligatoire** (RGPD Art.37) |
| **Développeur Full-stack (backup)** | 0-1 | NestJS + React Native, polyvalent | Moyenne |

**Budget estimé équipe (France) :**
- Développeurs : 45-65K€/an (junior-senior)
- DevOps/SRE : 55-75K€/an
- Product Owner : 50-70K€/an
- DPO externalisé : ~500-1500€/mois
- **Total masse salariale MVP :** ~400-550K€/an

**Compétences T-shaped** recommandées : chaque développeur maîtrise un domaine (backend OU mobile) mais peut contribuer dans l'autre en cas de besoin.

_Sources : Healthcare Startup Team Composition 2025, Glassdoor France salaires tech_

### Optimisation des coûts — FinOps

| Levier | Économie potentielle | Implémentation |
|--------|---------------------|----------------|
| **Right-sizing pods** | 30-60% cluster | Kubecost (open source) pour analyser l'utilisation réelle vs réservée |
| **Spot instances (staging/dev)** | 70-90% sur non-prod | Scaleway spot, OVH spot (si dispo) |
| **Crédits startup** | Jusqu'à 36K€ (Scaleway) ou 100K€ (OVH Healthcare) | Candidater aux programmes |
| **Open source vs payant** | ~5-15K€/an économisés | Prometheus+Grafana, k6, ZAP, Pact, Kubecost = gratuit |
| **Auto-scaling (KEDA)** | 20-40% en scale-to-zero | Services non critiques à 0 replica hors heures de pointe |
| **Image Docker optimisées** | Réduction stockage et démarrage | Multi-stage builds, Alpine, distroless |

**Programmes startup spécifiques santé :**

| Programme | Montant | Spécificité |
|-----------|---------|-------------|
| **Scaleway Startup Program** | Jusqu'à 36 000€ crédits | HDS certifié, infrastructure FR |
| **OVHcloud Startup Program** | Jusqu'à 100 000€ crédits | Support Healthcare & MedTech explicite |
| **AWS Activate** | Jusqu'à 100 000$ crédits | CLOUD Act, mais services avancés (ML) |
| **Azure for Startups** | Jusqu'à 150 000$ crédits | CLOUD Act, mais services avancés |
| **Google for Startups** | Jusqu'à 200 000$ crédits | Premier HDS v2.0 hyperscaler |
| **PariSante Campus** | Variable | Écosystème santé numérique FR |

_Sources : Scaleway Startup Program, OVHcloud Startup Program, Kubecost Open Source_

### Checklist pré-lancement — Conformité santé France

#### Obligations légales

- [ ] **CNIL** : Déclaration de conformité ou autorisation préalable
- [ ] **CNIL** : Nomination d'un DPO (obligatoire si données santé à grande échelle)
- [ ] **CNIL** : AIPD (Analyse d'Impact) réalisée et documentée
- [ ] **CNIL** : Registre des traitements à jour
- [ ] **CNIL** : Politique de confidentialité conforme (app + web)
- [ ] **CNIL** : Gestion des consentements granulaire implémentée
- [ ] **HDS** : Hébergeur certifié HDS 2.0 sélectionné et contractualisé
- [ ] **HDS** : Données stockées exclusivement dans l'EEE
- [ ] **PSC** : Inscription à l'Espace de Confiance ANS
- [ ] **PSC** : Intégration PSC/e-CPS testée en pré-production
- [ ] **PSC** : Validation ANS obtenue pour mise en production
- [ ] **Ordre MK** : Modèles de contrats validés juridiquement
- [ ] **Ordre MK** : Processus de communication des contrats à l'Ordre intégré

#### Sécurité technique

- [ ] **Chiffrement** : TLS 1.3 en transit, AES-256 au repos, clés dans Vault
- [ ] **Auth** : PSC/e-CPS + sessions serveur Redis + PKCE
- [ ] **WAF** : Coraza configuré avec règles OWASP
- [ ] **SIEM** : Wazuh + ELK opérationnels, alertes configurées
- [ ] **Backup** : Règle 3-2-1-1-0 implémentée et testée
- [ ] **DR** : Plan de reprise testé (failover AZ simulé)
- [ ] **Incident** : Plan de réponse 24h documenté et testé
- [ ] **Pentest** : Audit PASSI ou pentest réalisé, vulnérabilités corrigées
- [ ] **Mobile** : Certificate pinning, jailbreak detection, secure storage
- [ ] **RBAC** : Rôles et permissions configurés et testés
- [ ] **Audit trail** : Journalisation complète opérationnelle

#### App Stores

- [ ] **Apple** : Guidelines santé respectées (section 27.x Health)
- [ ] **Google** : Health Connect API policies respectées
- [ ] **Les deux** : Politique de confidentialité accessible dans l'app
- [ ] **Les deux** : Fonctionnalités déclarées (géolocalisation, notifications)

_Sources : CNIL - Applications mobiles en santé, ANS - Pro Santé Connect, HDS 2.0 Référentiel, Apple Health App Guidelines_

### Évaluation des risques — Implémentation

| Risque | Probabilité | Impact | Mitigation | Responsable |
|--------|------------|--------|------------|-------------|
| **Retard intégration PSC** | Moyenne | Fort | Démarrer inscription Espace de Confiance dès J1, prévoir 2-3 mois | DevOps + PM |
| **Rejet App Store (santé)** | Faible-Moyenne | Fort | Respecter guidelines dès le design, soumettre early beta | Mobile dev + PM |
| **Dépassement budget infra** | Moyenne | Moyen | Kubecost monitoring, alertes budget, crédits startup | DevOps |
| **Difficulté recrutement** | Moyenne | Fort | TypeScript (large talent pool), remote possible, freelance backup | PM |
| **Évolution réglementaire** | Certaine | Moyen | Architecture modulaire, veille juridique, DPO actif | DPO |
| **Effet réseau insuffisant** | Haute (early stage) | Critique | Focus géographique (PACA/Occitanie/IDF), partenariats IFMK | PM + Marketing |
| **Concurrence Rempleo** | Haute | Fort | Différenciation PSC + contrats conformes + UX supérieure | Produit |
| **Incident sécurité** | Faible-Moyenne | Critique | SIEM, pentest, plan incident 24h, assurance cyber | DevOps + DPO |

### Success Metrics et KPIs

| Catégorie | KPI | Cible MVP (6 mois) | Cible Scale (12 mois) |
|-----------|-----|--------------------|-----------------------|
| **Adoption** | Kinés inscrits | 1 000 | 5 000 |
| **Activation** | Profils complétés (>80%) | 60% des inscrits | 75% |
| **Matching** | Annonces publiées/mois | 200 | 1 500 |
| **Matching** | Taux de mise en relation réussie | 30% | 50% |
| **Contrats** | Contrats signés/mois | 100 | 800 |
| **Technique** | Uptime (API Gateway) | 99.9% | 99.95% |
| **Technique** | Latence P99 (API) | < 500ms | < 300ms |
| **Technique** | Temps de déploiement | < 30 min | < 15 min |
| **Sécurité** | Incidents sécurité critiques | 0 | 0 |
| **Sécurité** | Temps moyen de détection (MTTD) | < 1h | < 30 min |
| **Compliance** | Score RGPD (audit interne) | ≥ 85% | ≥ 95% |
| **NPS** | Net Promoter Score | ≥ 30 | ≥ 50 |

---

## Technical Research Recommendations

### Feuille de route d'implémentation détaillée

```
PHASE 0 — SETUP (Semaines 1-3)
├── S1: Monorepo Nx + CI GitHub Actions + Docker Compose dev
├── S2: Infrastructure Scaleway (K8s, PostgreSQL, Redis, Object Storage)
├── S3: ArgoCD + Traefik + monitoring (Prometheus/Grafana)
└── Livrable: environnement dev + staging opérationnels

PHASE 1 — MVP CORE (Mois 1-4)
├── M1: Auth Service (PSC/e-CPS + RPPS) + Profile Service
├── M2: Matching Service (annonces, candidatures, géolocalisation)
├── M3: Contract Service (Yousign) + Notification Service (FCM)
├── M4: Tests E2E, pentest, corrections, polish UX
└── Livrable: app fonctionnelle (inscription, matching, contrats)

PHASE 2 — ENRICHISSEMENT (Mois 5-7)
├── M5: Messaging Service (Socket.io) + Reviews
├── M6: Dashboard analytics + admin panel
├── M7: Optimisation performance + beta ouverte
└── Livrable: app complète, beta publique

PHASE 3 — CONFORMITÉ HDS (Mois 7-8, si données santé)
├── M7: Audit juridique périmètre données
├── M8: Migration HDS 2.0 + AIPD + DPO
└── Livrable: conformité HDS complète (avant deadline mai 2026)

PHASE 4 — SCALE (Mois 9+)
├── IA matching géolocalisé
├── Gestion cabinet simplifiée
├── Extension DOM-TOM
├── Conformité Ségur (si gestion cabinet)
└── Multi-professions santé
```

### Prochaines étapes immédiates (semaine 1)

1. **Juridique** : contacter un avocat santé numérique pour cadrage HDS/RGPD
2. **ANS** : s'inscrire à l'Espace de Confiance PSC
3. **Scaleway** : candidater au programme startup (36K€ crédits)
4. **Setup** : initialiser le monorepo Nx avec les apps et libs de base
5. **Recrutement** : identifier les profils backend NestJS et mobile React Native
6. **Ordre MK** : initier le contact pour validation des modèles de contrats

---

## Conclusion de la recherche technique

### Synthèse des findings clés

Cette recherche technique exhaustive sur le stack, la sauvegarde et la sécurité de JIM a produit les conclusions suivantes :

1. **Le stack technique est clair et mature** : React Native (Expo) + NestJS + PostgreSQL 18 + MongoDB Atlas (HDS) + Redis 8.0 + RabbitMQ + Traefik. Chaque brique a été sélectionnée sur des critères vérifiés : performance, adoption en santé FR, compatibilité HDS, talent pool, et coût.

2. **L'hébergement HDS est accessible et abordable** : Scaleway offre le meilleur rapport qualité/prix (470-550€/mois) avec certification HDS, Kubernetes gratuit, et un programme startup de 36K€. La deadline HDS 2.0 (mai 2026) impose d'anticiper mais ne bloque pas un MVP sans données patients.

3. **La sauvegarde suit les standards ANSSI** : la règle 3-2-1-1-0 avec pgBackRest (PITR), Velero (K8s), Object Storage 3-AZ, et backup WORM anti-ransomware. Les RPO/RTO sont calibrés par tier de criticité (< 1 min pour l'auth, < 24h pour les archives).

4. **La sécurité est complète et conforme** : PSC/e-CPS (OpenID Connect), Zero Trust (NIST), chiffrement multi-couches (TLS 1.3, AES-256, Queryable Encryption), Wazuh SIEM, Coraza WAF, Linkerd mTLS, plan incident 24h, et RBAC+ABAC. La conformité OWASP 2025, ANSSI, CNIL, et HDS 2.0 est intégrée dès la conception.

5. **L'architecture est modulaire et évolutive** : hexagonale/DDD avec 8 bounded contexts, CQRS + Event Sourcing + Saga, monorepo Nx, GitOps (ArgoCD), canary deployments, et observabilité OpenTelemetry. Le tout conçu pour évoluer de 1 000 à 100 000+ utilisateurs sans refonte.

6. **L'implémentation est planifiable** : équipe MVP de 8-10 personnes, budget ~400-550K€/an + ~600€/mois infra, feuille de route en 4 phases avec livrables concrets, checklist de conformité pré-lancement, et KPIs définis.

### Impact stratégique

Ce document de recherche technique fournit à JIM une **base technique complète, vérifiée et actionnable** pour passer de la phase de recherche à la phase de conception et développement. Les choix technologiques sont alignés avec :
- Les contraintes réglementaires françaises (HDS 2.0, RGPD, PSC, ANSSI)
- Le positionnement concurrentiel de JIM (conformité comme différenciateur)
- La réalité économique d'une startup (FinOps, crédits, open source)
- L'évolution prévisible du secteur (FHIR, EEDS, eIDAS 2.0, IA)

### Prochaines étapes recommandées

| Priorité | Action | Délai | Responsable |
|----------|--------|-------|-------------|
| **1** | Inscription Espace de Confiance PSC (ANS) | Semaine 1 | PM/Tech Lead |
| **2** | Candidature programme startup Scaleway/OVH | Semaine 1 | PM |
| **3** | Consultation avocat santé numérique (HDS/RGPD) | Semaine 1-2 | PM/DPO |
| **4** | Contact Ordre MK pour validation contrats | Semaine 2 | PM |
| **5** | Setup monorepo Nx + CI/CD + Docker Compose | Semaine 2-3 | Tech Lead |
| **6** | Recrutement équipe MVP (backend + mobile) | Semaine 1-4 | PM/RH |
| **7** | Architecture détaillée + ADRs (Architecture Decision Records) | Semaine 3-4 | Tech Lead |
| **8** | Début développement Phase 1 (Auth PSC + Profils) | Mois 2 | Équipe dev |

---

## Sources et méthodologie de vérification

### Sources principales (sélection)

**Institutionnelles :**
- ANS - Pro Santé Connect : industriels.esante.gouv.fr
- ANS - Doctrine Numérique en Santé 2025 : esante.gouv.fr/doctrine
- ANS - HDS Référentiel : esante.gouv.fr/offres-services/hds
- ANSSI - Plan stratégique 2025-2027
- CNIL - RGPD appliqué à la santé : cnil.fr
- NIST SP 1800-35 - Zero Trust Architecture (juin 2025)
- OWASP Top 10:2025 : owasp.org/Top10/2025

**Techniques :**
- NestJS Official Documentation : docs.nestjs.com
- PostgreSQL 18 Release Notes : postgresql.org
- MongoDB Atlas HDS Certification : mongodb.com/products/platform/trust/hds
- Redis 8.0 Release Notes : redis.io
- Kubernetes Documentation : kubernetes.io
- FHIR FR Core v2.2.0 : build.fhir.org/ig/Interop-Sante
- Yousign API v3 : developers.yousign.com
- RPPS API : portal.api.esante.gouv.fr

**Infrastructure :**
- Scaleway HDS : scaleway.com
- OVHcloud Healthcare : ovhcloud.com/fr/healthcare
- Cloudflare Network : cloudflare.com/network
- Velero : velero.io
- pgBackRest : pgbackrest.org
- ArgoCD : argoproj.github.io

**Sécurité :**
- Wazuh SIEM : wazuh.com
- KEDA : keda.sh
- Grafana k6 : k6.io
- OpenTelemetry : opentelemetry.io
- Pact Contract Testing : pact.io

### Niveau de confiance

| Domaine | Confiance | Justification |
|---------|-----------|---------------|
| Stack technique (frameworks, BDD) | **Élevée** | Documentation officielle + benchmarks vérifiés |
| Hébergement HDS | **Élevée** | Sites officiels des providers + référentiel ANS |
| Sauvegarde/DR | **Élevée** | Standards ANSSI + documentation outils |
| Sécurité/Conformité | **Élevée** | Sources ANSSI, CNIL, NIST, OWASP officielles |
| Pricing | **Moyenne-Haute** | Tarifs publics, mais sujets à évolution |
| Projections d'adoption | **Moyenne** | Basées sur tendances marché, incertitude inhérente |

---

**Date de finalisation :** 2026-02-25
**Période de recherche :** Analyse technique complète basée sur des données 2024-2026
**Vérification des sources :** 80+ sources uniques vérifiées, validation multi-sources pour les points critiques
**Niveau de confiance global :** Élevé — basé sur des sources institutionnelles et techniques autoritatives

_Ce document de recherche technique constitue une référence complète et actionnable pour la conception et le développement de l'application JIM (Job in Med). Il fournit les détails d'implémentation nécessaires pour démarrer le développement du MVP avec confiance._
