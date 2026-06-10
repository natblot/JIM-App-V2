# Navbar unification

_Started 2026-05-29 17:31 UTC_

---

## User

Dans mission-detail : change la navbar avec celle initiale

## Assistant

_[tool: view_image]_

_[tool: list_files]_

Je vais regarder la navbar actuelle dans mission-detail.html et la navbar originale utilisée ailleurs.

_[tool: grep]_

_[tool: grep]_

Let me look at the current navbar in mission-detail and the navbar used in other pages.

_[tool: read_file]_

The "original" navbar lives in paiements.html (brand mark, sliding pill nav, search bar, NB avatar). Now let me see what mission-detail.html currently has — it's a React/JSX page.The navbar is rendered inside mission-detail.jsx. Let me find it there.

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

Let me read the TopBar component and the overall layout structure.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Now let me read the full header markup and its CSS from paiements.html, plus the search-bar files, to replicate the original navbar.

_[tool: grep]_

Let me check the mission-detail.css for the frame and top-bar layout so the replacement fits.The `.alt-frame` and `.alt-top` styles come from messagerie-alternatives.css. Let me check those.

_[tool: grep]_

_[tool: read_file]_

_[tool: list_files]_

Let me check search-bar.js initialization and confirm the brand asset path.

_[tool: read_file]_

_[tool: read_file]_

Let me read the full `.alt-frame` definition to fit the navbar layout.

_[tool: update_todos]_

_[tool: str_replace_edit]_

This is a React page; the search-bar.js auto-init won't catch DOM that React mounts later. I'll expose its init globally, then build the original navbar as a React component. Let me set up the tasks and make the edits.

_[tool: str_replace_edit]_

Now add the original-navbar CSS to mission-detail.css:Now link search-bar.css and search-bar.js in mission-detail.html:

_[tool: str_replace_edit]_

Now replace the `TopBar` component in mission-detail.jsx with the original navbar:

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: str_replace_edit]_

Just a React attribute warning on the lucide `<i>`. Let me drop the `stroke-width` attr (lucide's default stroke is fine):

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

C'est fait. La barre de navigation de **mission-detail** reprend désormais la navbar originale : logo JIM, pilule coulissante avec **Missions** actif (Remplaçants · Messagerie · Paiements), barre de recherche sombre « Rechercher » et avatar **NB** — identique aux pages index/messagerie/paiements.

