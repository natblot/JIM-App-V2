/* ============================================================
   JIM Header — App shell
   ============================================================ */

const { useState: _us, useEffect: _ue } = React;

const VARIANTS = [
  { id: "A", title: "Pill nav · indicateur glissant", sub: "Le plus proche de la maquette : pill corail qui glisse entre les onglets, halo bleu sur la recherche, badge corail pulsé sur la cloche.", Comp: HeaderA },
  { id: "B", title: "Souligné magnétique + sous-titre", sub: "Trait corail qui suit la souris d'un onglet à l'autre ; un eyebrow chiffre l'onglet survolé en temps réel.", Comp: HeaderB },
  { id: "C", title: "Recherche ⌘K — palette de commandes", sub: "La barre noire à halo bleu ouvre une palette plein écran : tape une mission, un paiement, un contact.", Comp: HeaderC },
  { id: "D", title: "Dock à icônes — labels qui s'ouvrent", sub: "Compact : seul l'onglet actif affiche son label, les autres révèlent le leur au survol avec une transition spring.", Comp: HeaderD },
];

const VariantFrame = ({ v, active, setActive }) => (
  <section data-screen-label={`Header · ${v.id}`} style={{
    padding: "28px 28px 40px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
    borderRadius: 28,
    border: "1px solid var(--jim-beige-mid)",
    marginBottom: 28,
  }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
      <span className="eyebrow" style={{
        padding: "4px 10px", borderRadius: 999,
        background: "var(--jim-primary-pale)", color: "var(--jim-primary)",
      }}>Variant {v.id}</span>
      <h3 style={{ margin: 0, fontSize: 20 }}>{v.title}</h3>
    </div>
    <p style={{ fontSize: 14, color: "var(--jim-muted)", margin: "0 0 22px", maxWidth: 720 }}>{v.sub}</p>
    <v.Comp active={active} setActive={setActive}/>
  </section>
);

const App = () => {
  const [t, setTweak] = useTweaks(window.__TWEAK_DEFAULTS_RAW);
  const [active, setActive] = _us(t.active || "Missions");

  _ue(() => { setActive(t.active); }, [t.active]);

  const visible = t.variant === "all" ? VARIANTS : VARIANTS.filter(v => v.id === t.variant);

  const onSetActive = (it) => {
    setActive(it);
    setTweak("active", it);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 28px 120px", maxWidth: 1480, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                       marginBottom: 32, gap: 24, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow">JIM · Design system</div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", margin: "6px 0 8px", letterSpacing: "-0.04em" }}>
            Header menu, <em>animé.</em>
          </h1>
          <p style={{ maxWidth: 640, color: "var(--jim-text-body)", margin: 0 }}>
            Quatre directions partant de la barre actuelle. Toutes utilisent les tokens Corail v2.1, Manrope,
            et respectent <code>prefers-reduced-motion</code>. Clique un onglet pour voir la transition.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Missions", "Remplaçants", "Messagerie", "Paiements"].map(it => (
            <button key={it} onClick={() => onSetActive(it)} style={{
              padding: "8px 14px", borderRadius: 999,
              fontSize: 13, fontWeight: 700,
              border: "1px solid var(--jim-beige-mid)",
              background: active === it ? "var(--jim-primary)" : "var(--jim-surface)",
              color: active === it ? "#fff" : "var(--jim-text-body)",
              transition: "background .2s, color .2s, transform .15s",
            }}>{it}</button>
          ))}
        </div>
      </header>

      {visible.map(v => <VariantFrame key={v.id} v={v} active={active} setActive={onSetActive}/>)}

      <TweaksPanel>
        <TweakSection label="Affichage"/>
        <TweakSelect label="Variante" value={t.variant}
          options={[
            { value: "all", label: "Toutes (comparaison)" },
            { value: "A",   label: "A — Pill nav" },
            { value: "B",   label: "B — Souligné magnétique" },
            { value: "C",   label: "C — ⌘K Command palette" },
            { value: "D",   label: "D — Dock icônes" },
          ]}
          onChange={(v) => setTweak("variant", v)}/>
        <TweakSelect label="Onglet actif" value={t.active}
          options={["Missions", "Remplaçants", "Messagerie", "Paiements"]}
          onChange={(v) => setTweak("active", v)}/>
      </TweaksPanel>
    </div>
  );
};

setActiveUser("titulaire");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
