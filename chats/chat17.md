# Card Animation Design

_Started 2026-05-29 20:35 UTC_

---

## User

Ajoute une animation pour chacune des cards avec le prompt suivant :

## Assistant

_[tool: view_image]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: view_image]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

I have a clear picture now. The four hero stat cards share one `HeroStats` component, each with a `.viz` area: bar-ticks (Durée), spark-line (Net estimé), avatar-dots (Patients), segments (Étape). Card 1 already animates; I'll give the other three matching on-brand entry + idle animations (plus a hover response echoing the reveal feel of the reference card), all in the JIM palette.Now extend the reduced-motion guard to cover the new animations:

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

C'est fait. J'ai ajouté une animation d'entrée à chacune des 4 cartes-stats (elles partagent le composant `HeroStats`, donc ça s'applique aux dashboards V1 et V2) :

- **Durée de mission** — les barres montaient déjà en cascade ; conservé.
- **Net estimé** — la courbe se trace de gauche à droite, puis le point final (dernière estimation) garde un léger halo « live ».
- **Patients suivis** — les avatars apparaissent l'un après l'autre, puis le « +18 » se révèle ; au survol, la pile s'écarte légèrement.
- **Étape du dossier** — les segments se remplissent de gauche à droite, et l'étape « now » (orange) respire avec un halo pulsé.

Le tout respecte la palette JIM et `prefers-reduced-motion` (animations coupées si l'utilisateur préfère moins de mouvement).

## User

Verifier agent check completed

## Assistant

Le vérificateur a confirmé : les quatre animations fonctionnent et aucune régression de mise en page. Tout est en place.

