# PRODUCT.md — JIM (Job In Med)

> Extrait du `jim-app/CLAUDE.md` du 2026-05. Source de référence pour `impeccable`.

## Register

**brand** — la landing `(marketing)/` est un produit identitaire. Le dashboard `(app)/` est en register **product**. Cette doc traite les deux ; sur landing, c'est brand qui prime.

## Product Purpose

JIM est une marketplace B2B mobile-first pour kinésithérapeutes français. Elle met en relation **kinés remplaçants** et **kinés titulaires** sur un domaine ultra-régulé (RPPS, HDS, RGPD, Ordre MK). MVP prêt pour beta. Verticale healthcare, contrats intégrés, paiement sécurisé via Stripe Connect (Destination Charges).

Promesse : « Trouvez ou publiez un remplacement kiné en 30 secondes. Vérifié RPPS. Contrat intégré. Paiement sécurisé. Créé par un kiné, pour les kinés. »

## Users

Audience unique mais bi-rôle :

- **Titulaires** (cabinet ou exercice individuel) : cherchent un remplaçant fiable, vérifié RPPS, sans paperasse. Pain : annulations de dernière minute, doute sur la conformité, perte de patientèle pendant absence.
- **Remplaçants** (jeunes diplômés ou polyvalents) : cherchent missions courtes/longues près d'eux, paiement garanti, contrat clair. Pain : annonces dispersées sur Facebook/forums, contrats artisanaux, retards de paiement.

Tonalité : **collègue bienveillant qui connaît le métier**. Pas vendeur, pas SaaS-corporate, pas startup-tech. Pro mais chaud.

## Brand personality

Mots-clés : *artisan, professionnel, chaleureux, précis, libre.*

- **Artisanal** : créé par un kiné, pour des kinés. Pas un produit générique health-tech.
- **Précis** : les choses graves (RPPS, contrat, paiement) sont nommées et tenues.
- **Chaleureux** : palette beige chaud + corail, italiques éditoriaux. Pas un dashboard B2B froid.
- **Libre** : tonalité directe, pas de jargon corporate, pas de buzzwords IA/disruption.

## Brand strategic principles

1. **Métier d'abord, tech ensuite.** Le langage parle de remplacements, RPPS, cabinet, mutuelles. Jamais « solution », « écosystème », « commission » (utiliser « frais de gestion » ou « service de sécurisation professionnelle »).
2. **Éditorial > marketing.** Italique Fraunces sur les mots pivots du hero, pas de tagline taglinée.
3. **Beige chaud, pas blanc froid.** `#fdf6ed` est le fond par défaut, pas `#fff`.
4. **Coral commit, pas accent décoratif.** Le corail `#ff7c5c` porte les actions et les marques d'identité. Stratégie couleur : **Committed** sur les CTA, accents et marques d'urgence.
5. **Densité maîtrisée.** Dashboard en `h-screen overflow-hidden` côté desktop ; rythme calme côté mobile.

## Anti-references

À ce que JIM N'EST PAS :

- **Pas Doctolib** (aseptisé blanc/bleu, corporate, prise de RDV patient).
- **Pas une marketplace Airbnb-like** (cards photo, ranking, prix dynamiques) — c'est précisément le design qui a été rejeté pour le kanban.
- **Pas un SaaS B2B générique** (purple/violet gradient, hero metric template, big number + gradient text).
- **Pas une healthtech startup loud** (vert mint néon, illustrations Notion-style, copy « disrupt »).
- **Pas Indeed/Jobboard** (densité informationnelle hostile, filtres en chips bleus).
- **Pas de cliché AI workflow tool** (terminal dark mode, glassmorphism par défaut, gradient text).

Si un visuel pourrait illustrer un éditeur SaaS générique, on a raté. Si quelqu'un peut deviner le métier en lisant trois lignes de copy, c'est bon.

## Visual system (extrait — voir composants source pour les détails)

- **Polices** : `Manrope` (corps, UI, titres sans-serif, weights 400/500/600/700) + `Fraunces italic` (accent éditorial, italique uniquement, weights 400/500). Hiérarchie ≥1.25 ratio.
- **Couleurs** :
  - Fond body : `#fdf6ed` (beige chaud)
  - Accent : `#ff7c5c` (corail)
  - Texte : `text-neutral-800` (tinted, jamais `#000`)
  - Sidebar dashboard : `#f9f3eb`
- **Layout** : container `max-w-[1600px] mx-auto`. Header `fixed top-6`. Footer landing `fixed bottom-0` avec `bg-white/80 backdrop-blur-md`.
- **Composants kanban** (3 colonnes) : Urgentes (orange) / Près de moi (Haversine 50km) / Nouveau.
- **Sidebar** : 320px (lg+), préférences + filtrage avancé.
- **Tap zones** : 44×44 min. Contraste 4.5:1 min.
- **Strategie responsive** : Adaptive multi-breakpoint (PAS mobile-first). xs(375) sm(640) md(768) lg(1024) xl(1280) 2xl(1536).

## Copy rules

- Ton : **collègue kiné**, pas vendeur, pas corporate.
- Pas d'em dash (`—`). Virgules, deux-points, points-virgules, parenthèses ok.
- Pas d'emoji dans l'UI (sauf demande explicite).
- Le mot **« commission »** n'apparaît JAMAIS. Utiliser « frais de gestion » ou « service de sécurisation professionnelle ».
- Mots métier OK : *remplacement, titulaire, remplaçant, cabinet, RPPS, mutuelles, conventionné, libéral, week-end de garde*.
