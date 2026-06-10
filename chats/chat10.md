# Plateforme Missions

_Started 2026-05-14 17:10 UTC_

---

## User

J'aimerais développer la partie mission : un onglet avec la signature de contrat ( aidé par l'ia ) l'envoye automatique à l'ordre . Un autre onglet avec les transmission, les inforamtion relatives au cabinet. Remettre la partie chat également avec une assistance ia

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: update_todos]_

Je vais construire un écran "Détail mission" complet — en partant du squelette de la Timeline (D), avec ta timeline de progression en haut, la liste des missions à gauche, et **3 onglets principaux** dans la zone centrale :

- **Contrat** — relecture par l'IA, signature eIDAS, envoi automatique à l'Ordre
- **Transmissions** — cabinet + patients récurrents + infos pratiques
- **Chat** — messagerie + co-pilot IA

Je commence tout de suite. Quelques choix par défaut que tu pourras toggler via le panneau Tweaks (onglet actif, état signature, etc).

_[tool: write_file]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Voilà — l'écran **Détail mission** est en place : `ui_kits/web/mission-detail.html`.

**3 onglets principaux** dans la zone centrale, sous une timeline de progression toujours visible (Candidature → Négo → **Signature** → Mission → Paiement → Avis) :

- **Contrat** — aperçu du contrat avec termes-clés surlignés par l'IA (hover = explication), panneau de relecture *« Contrat conforme. Tu peux signer. »*, 12 termes extraits, 3 points de vigilance (clause non-concurrence un peu large, etc.), et un **parcours signature** en 4 étapes : audit IA → signature eIDAS → **envoi automatique à l'Ordre** → confirmation. Le toggle Ordre est visible en bas du panneau.
- **Transmissions** — 3 colonnes : Cabinet (carte, codes WiFi/digicode, équipe sur place), Patients récurrents (fiche détail avec **note clinique générée par l'IA** + alertes vasovagales, liste filtrable), Équipement + planning semaine 1 + mot vocal de la titulaire.
- **Chat** — bandeau résumé IA en haut, fil avec termes IA cliquables, **suggestions de réponse** sous le composer, et co-pilot à droite (todo list, infos extraites du fil, mémoire de ton).

**Tweaks exposés** (panneau en bas à droite) : onglet actif, état de signature (à signer / signé / confirmé Ordre — recalcule la timeline et le stepper), toggle envoi auto Ordre.

Quelques prochaines pistes si tu veux pousser :
- la **vue Ordre** détaillée (accusé de réception, statut numéro d'enregistrement)
- une **modale de signature eIDAS** (saisie SMS, geste signature)
- la **transmission vocale** de la titulaire transcrite par l'IA
- un onglet **paiement séquestre** pour préparer l'étape suivante de la timeline

## User

Trop dense. Il faut que cela soit plus aéré. Les cards Avatars Utilisateurs doivent être représenter de la sorte : une photo du cabinet avec leur avatar en rond. Je t'ai donnée un extrait de vrai contrat kiné, cela pourra te servir de modèle. En suite les nom des titulaire ou assistant sont trop grand. Fait moi une animation ( un pue comme l'animation cards ou lorsque l'on clique dessus il y a la carte qui s'affiche, faire ici juste le nom).

## Assistant

_[tool: view_image]_

_[tool: view_image]_

Je regarde la photo de référence et le contrat exemple.

_[tool: list_files]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: get_public_file_url]_

_[tool: run_script]_

_[tool: image_metadata]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: delete_file]_

_[tool: invoke_skill]_

_[tool: run_script]_

_[tool: update_todos]_

J'ai vu la photo de référence (tuile avec photo de cabinet + avatar rond qui dépasse) et lu ton contrat exemple. Je vais :

1. **Aérer** la mise en page (Transmissions surtout — passer de 3 colonnes serrées à 2 zones plus larges)
2. **Reconstruire les cards Équipe** : tuile carrée avec "photo cabinet" + avatar rond qui dépasse, **nom qui n'apparaît qu'au clic** avec une animation d'ouverture (la tuile se déploie vers la droite et révèle le nom)
3. **Réduire les noms** dans les cards
4. **Caler le contrat** sur la structure CNOMK (Article 1, 12, 19, 24, références R.4321-129, etc.)

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

L'écran est globalement OK mais le header se chevauche. Je vais le restructurer (titre plus court, statut en pastille, pas de bloc auteur redondant — on l'a déjà dans le team deck).

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: list_files]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: update_todos]_

_[tool: delete_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Voilà, plus aéré et avec le nouveau pattern de cards Équipe que tu voulais :

**Transmissions** — recomposé en 2 zones au lieu de 3 colonnes serrées :
- **Hero Cabinet** plein largeur : carte (placeholder de photo), adresse + stats, et le **team deck** à droite
- **Patients récurrents** (gauche, avec fiche détail aérée et note IA M. Bertrand)
- **Colonne droite** plus respirante : Accès & codes inline (WiFi · Digicode · Parking · Logiciel), Équipement (3 items dont Plateforme Huber en alerte formation), et la **note vocale Sandra** consolidée en bas

**Team deck** — c'est la nouveauté principale :
- 3 tuiles compactes (64×64) avec "photo de cabinet" en fond (3 scènes CSS distinctes : sky / warm / desk) et **avatar rond qui dépasse en bas-droite**, encerclé d'un anneau beige
- **Clic → la tuile se déploie vers la droite** (animation cubic-bezier spring, 360ms) et révèle le nom + le rôle (« Joignable WhatsApp », « En congés », etc.)
- Avatar plus petit (30px), noms en 11.5px au lieu du gros titre précédent
- Cliquer une autre tuile ferme la précédente ; cliquer la même referme tout

**Contrat** — calé sur la structure CNOMK :
- En-tête « Modèle CNOMK · v. 05/2021 · conforme art. R.4321-129 CSP »
- Bloc *ENTRE :* / *ET :* avec mentions « *la titulaire* » / « *le remplaçant* » en italique Fraunces
- Articles numérotés en *Art. 4 —*, *Art. 12 —*, *Art. 19 —*, *Art. 24 —* (numéros en accent corail/Fraunces)
- Article 19 reformulé avec clause pénale 50 000 € (art. 1231-5 CCV), comme dans ton contrat type
- **Article 24 — Communication à l'Ordre** met en lumière l'envoi automatique JIM (« dans le mois suivant sa signature » surligné en vert)

Le header a aussi été restructuré (titre court « Remplacement Ortho · 14 jours » + status pill à droite) pour ne plus se chevaucher avec la timeline.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

_[tool: snip]_

_[tool: snip]_

Le verifier a tout validé : animation team deck fluide (clic Paul → Sandra se referme à 64px et Paul s'ouvre à 215px avec son nom), header sans chevauchement, contrat aligné CNOMK avec articles lisibles. L'écran est prêt.

## User

Crée des animations cards comme les cards d'annonce
Remplace l'avatars par cette ids cards

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

Compris :
1. **Animation d'entrée** style "cards annonce" (fade-up staggered, 60ms stagger, comme dans le DS guide)
2. **Remplacer les avatars ronds** de la liste de conversations par le pattern tuile-photo + avatar en coin

Je m'y mets.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: delete_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

C'est fait :

**Tuiles "photo cabinet" dans la sidebar** — chaque conversation a maintenant une tuile rectangulaire (40×40) avec un fond stylisé distinct par contact (sky / lilac / warm / green) et le petit avatar rond (22 px) qui dépasse en bas-droite, exactement comme la référence. Les tuiles **se soulèvent légèrement au hover** (translateY -1px) et passent en cadre corail quand la convo est active.

**Animation d'entrée style cards d'annonce** — fade-up staggered (translateY 14→0, opacity 0→1, easing `cubic-bezier(.16, 1, .3, 1)`, 500 ms) appliquée à :
- chaque convo de la sidebar (stagger 40 ms)
- les tuiles du team deck dans Transmissions (stagger 70 ms, à partir de 140 ms)
- le hero Cabinet + les cards Codes/Équipement/Note vocale (stagger 60 ms)
- les patients récurrents (stagger 60 ms)
- les blocks du panneau Relecture IA dans Contrat

Le tout respecte `prefers-reduced-motion`. Quand tu changes d'onglet, les cards rejouent leur animation puisqu'elles sont remontées.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Tout est validé par le verifier — tuiles photo + avatar dans la sidebar, animations staggered en place sur les convos, le team deck et les cards de Transmissions.

