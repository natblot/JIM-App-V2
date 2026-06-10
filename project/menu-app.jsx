/* ============================================================
   JIM Menu — App shell
   Composes the chosen variant + state-aware page backdrop.
   ============================================================ */

const TWEAK_DEFAULTS = window.__TWEAK_DEFAULTS_RAW || {
  variant: "A",
  position: "top",
  state: "titulaire",
};

const VARIANT_META = {
  A: { label: "A · Navbar + dropdown éditorial",   sub: "Top nav (ou rail), avatar dropdown avec header gradient corail." },
  B: { label: "B · Plein-écran éditorial",         sub: "Overlay dramatique. Numéros 01/02, hover preview, Fraunces italic." },
  C: { label: "C · Command palette ⌘K",            sub: "Search-first. Type-ahead, keyboard nav, 2 panneaux." },
};

const STATE_META = {
  anon:       { label: "Anonyme",     sub: "Visiteur non connecté · CTA connexion." },
  titulaire:  { label: "Titulaire",   sub: "Cherche un remplaçant. Annonces, candidatures, paiements." },
  remplacant: { label: "Remplaçant",  sub: "Cherche des missions. Carte, favoris, candidatures." },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const variant  = t.variant  || "A";
  const position = t.position || "top";
  const state    = t.state    || "titulaire";

  // Sync window.USER on state change
  React.useEffect(() => { setActiveUser(state); }, [state]);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const onOpenChange = React.useCallback((v) => setMenuOpen(!!v), []);
  React.useEffect(() => { setMenuOpen(false); }, [variant, state]);

  const Variant = variant === "A" ? VariantA : variant === "B" ? VariantB : VariantC;
  const isTop = position === "top";
  const railWidth = !isTop ? (variant === "A" ? 260 : variant === "B" ? 76 : 280) : 0;

  return (
    <>
      <PageBackdrop position={position}>
        <Variant position={position} onOpenChange={onOpenChange} menuOpen={menuOpen} userState={state}/>
        <MockDashboard offsetLeft={railWidth} userState={state}/>
      </PageBackdrop>

      {/* Always-visible variant switcher (primary affordance) */}
      <div style={{
        position: "fixed", bottom: 20, left: 20, zIndex: 40,
        display: "inline-flex", alignItems: "stretch", gap: 0,
        background: "var(--jim-text)",
        borderRadius: 999,
        boxShadow: "var(--jim-shadow-lg)",
        overflow: "hidden",
        fontFamily: "var(--jim-font-sans)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px 8px 12px",
          color: "var(--jim-background)",
          fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
          textTransform: "uppercase",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}>
          <span style={{ opacity: .55 }}>Variante</span>
        </div>
        {["A", "B", "C"].map((v) => {
          const active = variant === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setTweak("variant", v)}
              title={VARIANT_META[v].label}
              style={{
                appearance: "none", border: 0, cursor: "pointer",
                padding: "8px 12px",
                background: active ? "var(--jim-primary)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
                fontSize: 12, fontWeight: 700, letterSpacing: ".06em",
                fontFamily: "inherit",
                transition: "background .15s ease, color .15s ease",
                display: "flex", alignItems: "center", gap: 6,
                minWidth: 36,
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >
              {v}
            </button>
          );
        })}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px",
          color: "rgba(255,255,255,0.7)",
          fontSize: 10, fontWeight: 600, letterSpacing: ".08em",
          textTransform: "uppercase",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          maxWidth: 220,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "var(--jim-primary-mid)", flexShrink: 0,
          }}/>
          <span style={{
            color: "var(--jim-background)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {VARIANT_META[variant].label.split(" · ")[1]}
          </span>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Variante de menu"/>
        <TweakRadio
          label="Style"
          value={variant}
          options={["A", "B", "C"]}
          onChange={(v) => setTweak("variant", v)}
        />
        <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 2px 10px", lineHeight: 1.45 }}>
          {VARIANT_META[variant].sub}
        </p>

        <TweakSection label="État utilisateur"/>
        <TweakRadio
          label="Profil"
          value={state}
          options={["anon", "titulaire", "remplacant"]}
          onChange={(v) => setTweak("state", v)}
        />
        <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 2px 10px", lineHeight: 1.45 }}>
          {STATE_META[state].sub}
        </p>

        <TweakSection label="Position"/>
        <TweakRadio
          label="Ancrage"
          value={position}
          options={["top", "left"]}
          onChange={(v) => setTweak("position", v)}
        />

        <TweakSection label="Démo"/>
        <TweakButton
          label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 2px 10px", lineHeight: 1.45 }}>
          {variant === "C"
            ? "Astuce : ⌘K / Ctrl+K ouvre la palette, ↑↓ naviguent, Esc ferme."
            : "Astuce : clique sur l'avatar ou le bouton menu dans la barre."}
        </p>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
