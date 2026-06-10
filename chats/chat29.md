# Mission Detail Copy Edit

_Started 2026-06-02 21:09 UTC_

---

## User

Apply 2 direct edits:
1. In ui_kits/web/mission-detail-v2.html: change the text from "ne s'arrête" to "tourne".
<mentioned-element>
dom:      body › section.hero › div.hero-grid › div › h1 › em[2/3]
text:     "ne s'arrête"
children: text
selector: .hero-grid :is(h1,h2,h3,h4,h5,h6) >:is(h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,label,spa…
id:       cc-2
</mentioned-element>
2. In ui_kits/web/mission-detail-v2.html: change the text from "Le cabinet\ntourne\npas quand vous partez." to "Votre cabinet\ntourne,\nMême sans vous.".
<mentioned-element>
dom:      body › section.hero › div.hero-grid › div › h1[1/3]
text:     "Le cabinet tourne pas quand vous partez."
children: text, br, em, br, text
selector: .hero-grid :is(h1,h2,h3,h4,h5,h6)
id:       cc-3
</mentioned-element>

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: list_files]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Both edits applied to `ui_kits/web/index.html` (where that hero headline actually lives — not mission-detail-v2). The h1 now reads:

**Votre cabinet** / ***tourne,*** / **Même sans vous.**

One note: "Même" mid-sentence would normally be lowercase ("même sans vous") — say the word if you'd like me to change it.

## User

Apply 2 direct edits:
1. In ui_kits/web/mission-detail-v2.html: change the text from "remplaçants kiné" to "".
<mentioned-element>
dom:      body › section.hero › div.hero-grid › div › p.lede › strong[2/2]
text:     "remplaçants kiné"
children: text
selector: :is(h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,label,span,a,em,strong,small,td,th,caption) …
id:       cc-6
</mentioned-element>
2. In ui_kits/web/mission-detail-v2.html: change the text from "JIM met en relation titulaires et vérifiés RPPS. Contrat, paiement, suivi — en une conversation." to "JIM met en relation les professionnels de santé libéraux  vérifiés RPPS. Contrat, paiement, suivi — en une conversation.".
<mentioned-element>
dom:      body › section.hero › div.hero-grid › div › p.lede[2/3]
text:     "JIM met en relation titulaires et vérifiés RPPS. Contrat, p…"
children: text, strong, text, strong, text
selector: .lede
id:       cc-7
</mentioned-element>

## Assistant

_[tool: str_replace_edit]_

Done — the lede in `ui_kits/web/index.html` now reads:

"JIM met en relation les **professionnels de santé libéraux** vérifiés RPPS. Contrat, paiement, suivi — en une conversation."

I kept the bold emphasis on "professionnels de santé libéraux" (matching the previous styling) and cleaned up the double space.

