# Affichage défectueux

_Started 2026-05-29 21:09 UTC_

---

## User

Problème d'affichage

## Assistant

_[tool: read_file]_

_[tool: view_image]_

_[tool: list_files]_

_[tool: view_image]_

_[tool: read_file]_

The image filename has an encoding quirk. Let me try viewing it directly and read the CSS.

_[tool: str_replace_edit]_

Found it. The bug is in `transmissions.css`: the two stacked panes (`.tr-pane.list` and `.tr-pane.sheet`) are both `position:absolute; inset:0`, but `.tr-pane` has **no background color**. When you drill into a patient, the sheet slides over the list — but since the sheet is transparent, the list (shifted only -22%) bleeds right through it. That's exactly the overlapping text in your screenshot.

The floating "MB" avatar and the doubled-up text are all the list pane showing through the transparent detail pane.

Fix: give the panes a solid surface background so the sheet occludes the list behind it.Let me verify in the detail (patient-selected) state.

_[tool: show_html]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

List view is clean. Now let me check the patient detail drill-in state, which is where the overlap happened.

_[tool: view_image]_

_[tool: save_screenshot]_

The click isn't registering a selection. Let me drive it more reliably and confirm the `detail` state occludes correctly.

_[tool: view_image]_

