# Animation barre recherche

_Started 2026-05-14 13:51 UTC_

---

## User

Ajouter ses animation dans la search bar

## Assistant

Je ne peux pas recréer ou étendre l'interface d'Airbnb (logo, palette « Rausch » #ff385c, structure de la barre de recherche distinctive, etc.) — c'est une UI propriétaire et de marque déposée.

Je peux cependant te proposer une **barre de recherche originale** avec des animations soignées, dans un style voyage/réservation générique. Dis-moi ce que tu préfères et je la construis :

**Direction visuelle** (à choisir ou je propose 3 variations) :
- Palette : neutre + un accent (bleu profond, vert sauge, terracotta, violet…) — pas de rouge corail type Airbnb
- Forme : pilule arrondie, carte rectangulaire, ou segments séparés
- Nom de marque fictif à utiliser (ex. *Wanderly*, *Voyago*, *Nomada*…)

**Animations à inclure** (dis-moi lesquelles t'intéressent) :
1. **Segment actif** qui s'agrandit/se surligne au survol avec une transition fluide (cubic-bezier)
2. **Indicateur glissant** (sliding pill) qui se déplace entre les segments
3. **Focus ring animé** qui apparaît sur le segment cliqué
4. **Bouton de recherche** qui s'étend pour révéler le label "Rechercher" au survol
5. **Apparition en cascade** des segments au chargement (stagger)
6. **Effet de "lift"** (ombre + translateY) au survol de la barre entière
7. **Micro-interaction sur l'icône loupe** (rotation, pulse)
8. **Panneau qui se déploie** sous le segment actif (date picker, sélecteur de voyageurs)

Tu veux que je parte sur quelle combinaison ? Ou je te propose 3 variations distinctes côte-à-côte sur un canvas ?

## User

Oui je veux bien une variation avant de l'implémenter.

## Assistant

_[tool: copy_starter_component]_

_[tool: write_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

J'ai préparé **3 variations** d'une barre de recherche originale (marque fictive "Voyago"), chacune avec une approche d'animation distincte :

**01 — Sliding Pill** (clair, chaleureux, bleu profond)
Une pilule glisse entre les segments en cubic-bezier. Le bouton CTA s'étire au survol pour révéler le label "Rechercher". Toute la barre se soulève légèrement.

**02 — Expanding Segment** (beige, accent vert sauge)
Le segment actif s'élargit (`flex-grow` 1→2.4) et déplie son propre panneau avec des chips de suggestions. Plus généreux, plus "app moderne".

**03 — Underline Editorial** (sombre, accent terracotta)
Style magazine/moteur de recherche éditorial. Soulignement "magic-line" qui suit le tab actif, point pulsant statut, flèche du CTA qui glisse à droite.

Tu peux cliquer entre les segments/tabs pour voir les animations, survoler les barres, et passer en plein écran depuis le canvas. Dis-moi laquelle te parle (ou quel mix) et je l'implémente en version finale.Le canvas avec les 3 variations est ouvert dans ton onglet. À toi de me dire laquelle tu préfères !

## User

Je vois plus ce type de menu qui défile en dessous des deux boutons recherche

## Assistant

_[tool: read_file]_

Compris — tu veux les **panneaux qui se déploient sous la barre** quand on clique sur un segment (destinations, calendrier, compteur voyageurs). Le motif (panneau flottant + animation) est générique, je vais l'ajouter à la V1 "Sliding Pill" en gardant un design original (palette Voyago bleu profond, copywriting et iconographie placeholder).

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

J'ai ajouté à la **V1 (Sliding Pill)** les trois panneaux qui se déploient sous le segment actif :

- **Où** → liste de suggestions avec icônes placeholder (apparition en stagger 40ms)
- **Quand** → calendrier double-mois avec sélection de plage + chips de flexibilité (±1, ±2, ±7 jours…)
- **Qui** → compteurs Adultes / Enfants / Bébés / Animaux avec un petit "bump" à chaque ±

**Comportement :**
- Clic sur un segment → la pilule glisse + le panneau correspondant fade-in en `scale(.98→1)` (320ms)
- Re-clic sur le même segment, ou clic en dehors → tout se referme
- L'outline bleu sur la pilule joue le rôle du focus ring

Le panneau "Où" s'aligne à gauche, "Quand" est centré sous la barre, "Qui" s'aligne à droite — comme dans tes captures.

Va cliquer sur chaque segment dans le canvas pour voir l'effet. Dis-moi si tu veux ajuster les animations (vitesse, easing), l'apparence des panneaux, ou si on passe à l'implémentation finale sur une seule variation.

_[tool: fork_verifier_agent]_

Le canvas est prêt — clique sur chacun des trois segments de la V1 pour voir les panneaux se déployer.

