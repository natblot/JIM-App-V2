# Cards Layout Horizontal

_Started 2026-05-14 12:46 UTC_

---

## User

Garde le même design pour les cards mais affiche les en ligne et non pas en colonne

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

Je vais modifier le design des cards pour les afficher en ligne (photo à gauche, contenu à droite) tout en gardant exactement le même style visuel.

_[tool: done]_

Let me verify the result looks good.Les cards sont maintenant affichées en ligne (photo à gauche, contenu à droite) au lieu du format vertical, tout en conservant exactement le même design (skyline, dates, badge vérifié, bouton Postuler). Les sections Urgentes / Près de moi / Nouveau s'empilent verticalement, et chaque card prend toute la largeur disponible.

## User

Ajoute cette animation sur les cards

## Assistant

_[tool: str_replace_edit]_

Je vais adapter cette animation (tilt 3D au hover + carte interactive au clic) pour les cards en vanilla JS, en gardant ton design existant.

_[tool: done]_

L'animation est ajoutée. Tu auras :

- **Tilt 3D au survol** — la card s'incline subtilement selon la position de la souris (lissage avec lerp pour un mouvement organique)
- **Bouton "Carte" en haut à gauche de la photo** — clique pour basculer entre la skyline et une mini-map animée
- **Animation de la map** : les routes se dessinent en cascade (`stroke-dashoffset`), les immeubles pop-in avec un délai progressif, le pin tombe avec un spring overshoot, et les coordonnées GPS apparaissent en bas
- **Hint discret** sous la card au hover

Le warning "empty #root" est une fausse alerte — la page est en HTML/vanilla JS, pas React.

## User

Simule une adresse fictive et ajoute plutôt le bouton carte à coté de postuler

## Assistant

_[tool: str_replace_edit]_

_[tool: done]_

Voilà :

- **Adresse fictive ajoutée** sous le titre : `14 rue de Bonnel · 69003 Lyon` (avec petit pin corail)
- **Bouton "Carte"** déplacé à côté de "Postuler" en bas de la card — style cohérent avec le bouton principal (même hauteur 30px, même radius), avec un point vert pulse → corail quand actif
- Quand actif, le bouton passe en sombre (comme "Postuler" inverse) pour bien signaler l'état
- Les coordonnées GPS dans la map ont été remplacées par l'adresse postale fictive

