# Problème d'affichage bouton

_Started 2026-05-14 18:11 UTC_

---

## User

Problème d'affichage.
Bouton vert rogner et les point à vérifier aussi

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Je vois deux problèmes :
1. La barre d'actions du contrat (boutons « Demander une modif », « PDF », « Signer/Contrat signé ») est trop large pour l'espace disponible → le bouton vert est coupé et « 0 alerte bloquante » passe sur 3 lignes
2. La colonne de droite a `overflow:hidden`, donc le bloc « À vérifier » se fait rogner verticalement

Je corrige les deux :

_[tool: done]_

Corrections appliquées :

- **Barre d'actions du contrat** : padding & gaps réduits, `flex-shrink` sur le texte de gauche (« 0 alerte bloquante » tient maintenant sur 1-2 lignes au lieu de 3) et `flex-shrink:0` sur les boutons pour que le bouton vert ne se fasse plus rogner.
- **Colonne « À vérifier »** : passée en `overflow-y:auto` avec une scrollbar fine, plus de troncature verticale.

## User

Idem pour cette partie

## Assistant

_[tool: str_replace_edit]_

Même cause : la colonne droite des Transmissions a `overflow:hidden`. Je l'ouvre verticalement.

_[tool: done]_

Colonnes Transmissions corrigées : la colonne droite (codes, équipement, note vocale) et la colonne patients défilent maintenant verticalement au lieu d'être rognées.

