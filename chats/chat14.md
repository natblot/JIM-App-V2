# Cards Dashboard

_Started 2026-05-29 19:47 UTC_

---

## User

avec le prompt suivant, fait des ui cards correspondants avec une cards contrat, une autre transmissions et une dernière messagerie.

## Assistant

_[tool: list_files]_

_[tool: view_image]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: update_todos]_

This is a well-established design system — the JIM "Corail" kit, and these exact three cards already live in your `mission-dashboard-v2.jsx` (just rendered small inside the dashboard grid). Your screenshot shows them blown up to a comfortable, standalone reading scale.

I'll build a clean **standalone card kit** page that presents the three cards — Contrat, Transmissions, Messagerie — at that larger scale, using the real JIM tokens (Corail palette, Manrope, warm shadows, Lucide icons). No new colors invented.

_[tool: write_file]_

_[tool: write_file]_

_[tool: update_todos]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Voilà — `ui_kits/web/cards-mission.html`, un kit autonome avec les trois cartes côte à côte, recréées à l'échelle de ta capture.

- **Tokens JIM réels** : palette Corail, Manrope, ombres warm-tinted, icônes Lucide — aucune couleur inventée.
- **Contenu fidèle** au screenshot (verdict IA, période/rétrocession, flags, cabinet + patients + accès, résumé de fil + bulles).
- Hover, focus-visible et apparition staggerée intégrés ; responsive (empilement vertical sous 1280 px).

Le CSS est isolé sous le préfixe `.mk-` dans `cards-mission.css`, donc ça ne touche pas le dashboard existant.

Note : la maquette pastée (composant shadcn `CashbackPartnersCard`) sert de format de référence — si tu veux aussi la version **React/TSX prête pour `/components/ui`** (Tailwind + tokens JIM mappés sur `bg-card`, `text-card-foreground`, etc.), dis-le et je te la génère.

