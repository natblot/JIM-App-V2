# Affichage cards contrat

_Started 2026-05-29 20:05 UTC_

---

## User

Change l'affichage des cards contrat / transmissions et messagerie :

## Assistant

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: show_html]_

_[tool: view_image]_

The message seems cut off (ends with a colon) — there may have been a reference image intended. Let me first see the current state of these cards.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: get_webview_logs]_

The content below the top bar isn't rendering. Let me check for errors.

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: save_screenshot]_

The cards have `opacity: 0` (a scroll-reveal initial state) in my inspector. Let me force them visible to see the current design.

_[tool: view_image]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: grep]_

A search overlay is interfering with my inspection. Let me read the card CSS to understand the current styling.

_[tool: questions_v2]_

I've got a clear picture of the three cards (Contrat, Transmissions, Messagerie) and their current dense, content-rich layout. But your message ends with a colon — it looks like a reference image or instruction got cut off, and I don't want to guess at a redesign this significant.

The pasted text shows a clean **ResourceCardsGrid** (icon + title + "last updated" + hover-lift with an arrow). Let me confirm exactly what you want before I touch these cards:

## User

Questions answered:
- intent: Les épurer fortement dans le style du composant collé (icône + titre + date + flèche, survol qui soulève la carte)
- scope: Les 3 (Contrat, Transmissions, Messagerie)
- keep_actions: Non, carte minimale qui ouvre le détail au clic
- hover: Oui, ajouter cet effet

## Assistant

_[tool: grep]_

Got it — minimal cards in the pasted component's style: icon + title + subtitle + an arrow that lifts on hover, the whole card opening the detail panel on click. Let me check the base `.card` and `.ic` styles so the new minimal cards sit correctly in the design system.

_[tool: grep]_

_[tool: str_replace_edit]_

I now have everything I need: the base `.card` (icon `.ic`, hover lift, reveal stagger) and the rich V2 internals. I'll strip the three V2 cards down to the pasted component's pattern — icon + title + a contextual subtitle + an `arrow-up-right` that lifts on hover — opening the detail panel on click. Let me rewrite the three components.

_[tool: write_file]_

Now the CSS — replace the rich V2 card rules with the minimal layout.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

The search modal is open and covering the dashboard. Let me close it and re-screenshot.

_[tool: view_image]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

Scrolled too far. Let me position the grid into view.

_[tool: view_image]_

_[tool: eval_js]_

_[tool: save_screenshot]_

Cards are now 92px tall (minimal ✓). The reveal animation is stuck at opacity 0 in my background iframe (pre-existing entrance animation, throttled here). Let me force it visible to verify the layout.

_[tool: view_image]_

_[tool: done]_

The three cards are now minimal in the pasted component's style — icon tile + title + contextual subtitle + an `arrow-up-right`, with a small state pill (À SIGNER / 2 non lus). Hover lifts the card, fills the icon, and nudges the arrow ↗; clicking still opens the detail panel. Let me hand it off.

_[tool: fork_verifier_agent]_

J'ai épuré les trois cartes (Contrat · Transmissions · Messagerie) dans le style du composant collé :

- **Icône + titre + sous-titre contextuel + flèche ↗** — plus de verdict IA, codes d'accès, fils de discussion, etc.
- **Petite pastille d'état** près du titre quand c'est utile (À signer / Signé · 2 non lus).
- **Survol** : la carte se soulève, l'icône se remplit et la flèche se décale ↗.
- **Clic** : ouvre toujours le panneau de détail correspondant.

Le sous-titre du Contrat s'adapte à l'état de signature (Tweak « État signature »).

