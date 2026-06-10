# Optimisation animations

_Started 2026-05-30 07:09 UTC_

---

## User

Améliore la fluidité des animations.

## Assistant

_[tool: read_file]_

_[tool: list_files]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

I can see the issue. The profile dropdown animates an expensive `filter: blur()` on top of its own `backdrop-filter`, which causes the fuzzy, juddery mid-animation state visible in your screenshot. The bouncy `cubic-bezier(.34,1.56,.64,1)` overshoot plus long stagger delays add to the lack of polish. Let me smooth all of this.

_[tool: str_replace_edit]_

Now let me add a smooth entrance to the variation switch (currently it snaps instantly) and a reduced-motion guard:

_[tool: done]_

J'ai fluidifié les animations. Les changements clés sur le menu profil (celui de ta capture) :

- **Suppression du `filter: blur()` animé** — c'était la cause principale du rendu flou et saccadé pendant l'ouverture. Il se cumulait avec le `backdrop-filter` du menu, ce qui forçait un double-compositing coûteux.
- **Easing remplacé** — le ressort à rebond (`cubic-bezier(.34,1.56,.64,1)`) devient une courbe ease-out douce (`cubic-bezier(.22,1,.36,1)`), plus posée et premium, sans dépassement.
- **Stagger resserré** — les items glissaient jusqu'à 0,2 s de décalage (le dernier traînait) ; désormais 0,04 → 0,13 s, plus cohérent, avec un léger glissement vertical plutôt qu'horizontal.
- **`will-change`** ajouté sur les éléments animés pour que le navigateur les promeuve sur GPU.

Bonus : la bascule entre onglets (Dashboard / Tableau / Storyboard) avait un changement sec — j'ai ajouté un fondu d'entrée. Et un garde `prefers-reduced-motion` pour les utilisateurs sensibles au mouvement.

