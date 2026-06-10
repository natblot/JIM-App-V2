/* ============================================================
   JIM Menu — Mock page content
   State-aware backdrop (titulaire / remplacant / anon).
   ============================================================ */

const PageBackdrop = ({ children, position = "top" }) => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: position === "left" ? "row" : "column",
  }}>
    {children}
  </div>
);

const MockDashboard = ({ offsetTop = 0, offsetLeft = 0, userState = "titulaire" }) => {
  if (userState === "anon") return <AnonHero offsetTop={offsetTop} offsetLeft={offsetLeft}/>;
  if (userState === "remplacant") return <RemplDashboard offsetTop={offsetTop} offsetLeft={offsetLeft}/>;
  return <TitDashboard offsetTop={offsetTop} offsetLeft={offsetLeft}/>;
};

const dashWrap = (offsetTop, offsetLeft) => ({
  flex: 1,
  padding: "40px clamp(20px, 4vw, 64px) 80px",
  paddingTop: 40 + offsetTop,
  paddingLeft: `calc(clamp(20px, 4vw, 64px) + ${offsetLeft}px)`,
  maxWidth: "100%", overflow: "hidden",
});

const TitDashboard = ({ offsetTop, offsetLeft }) => (
  <main style={dashWrap(offsetTop, offsetLeft)}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, animation: "itemUp .6s cubic-bezier(.16,1,.3,1) both" }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>TABLEAU DE BORD · MARDI 21 AVRIL</p>
        <h1 style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", marginBottom: 8 }}>
          Bonjour, <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", color: "var(--jim-primary)", fontWeight: 500 }}>Camille</em>.
        </h1>
        <p className="lead" style={{ color: "var(--jim-muted)", maxWidth: 560 }}>
          3 candidatures à examiner · 1 contrat prêt à signer · un virement séquestre libéré ce matin.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { k: "Annonces en ligne", v: "3", d: "+1 cette semaine" },
          { k: "Candidatures reçues", v: "14", d: "9 à examiner" },
          { k: "Taux de réponse", v: "96%", d: "médian 12 min" },
          { k: "Rétrocession moyenne", v: "72%", d: "—" },
        ].map((s, i) => (
          <StatCard key={s.k} {...s} delay={0.08 + i * 0.06}/>
        ))}
      </div>

      <AnnoncesCard items={[
        { t: "Remplaçant · cabinet Bastille",   s: "4 – 18 mai · rétrocession 75%",          badge: "URGENT", badgeTone: "primary", cands: 5 },
        { t: "Remplaçant week-end · Charonne",  s: "6 – 7 mai · rétrocession 70%",           badge: "EN COURS", badgeTone: "muted", cands: 2 },
        { t: "Longue durée · avenue Parmentier", s: "1er juin – 31 juillet · rétrocession 72%", badge: "POURVUE", badgeTone: "success", cands: 7 },
      ]}/>
    </div>
  </main>
);

const RemplDashboard = ({ offsetTop, offsetLeft }) => (
  <main style={dashWrap(offsetTop, offsetLeft)}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, animation: "itemUp .6s cubic-bezier(.16,1,.3,1) both" }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>MISSIONS · 50 KM · TEMPS RÉEL</p>
        <h1 style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)", marginBottom: 8 }}>
          Salut, <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", color: "var(--jim-primary)", fontWeight: 500 }}>Léo</em>.
        </h1>
        <p className="lead" style={{ color: "var(--jim-muted)", maxWidth: 560 }}>
          12 missions près de toi cette semaine · 2 conversations actives · 1 contrat à signer.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { k: "Missions proches", v: "12", d: "rayon 50 km" },
          { k: "Mes candidatures", v: "5", d: "2 en attente" },
          { k: "Rétrocession ce mois", v: "1 240 €", d: "+18% vs mars" },
          { k: "Disponibilités", v: "12 j", d: "ce mois" },
        ].map((s, i) => (
          <StatCard key={s.k} {...s} delay={0.08 + i * 0.06}/>
        ))}
      </div>

      <AnnoncesCard title="Missions près de toi" subtitle="Triées par distance"
        items={[
          { t: "Cabinet Bastille — Paris 11ᵉ",  s: "4 – 18 mai · 75% · 1,2 km",        badge: "URGENT",   badgeTone: "primary", cands: "Postuler" },
          { t: "Cabinet Charonne — Paris 20ᵉ",  s: "6 – 7 mai · 70% · 2,8 km",         badge: "WEEK-END", badgeTone: "muted",   cands: "Postuler" },
          { t: "Avenue Parmentier — Paris 11ᵉ", s: "1er juin – 31 juil · 72% · 0,9 km", badge: "LONGUE",   badgeTone: "success", cands: "Postuler" },
        ]}/>
    </div>
  </main>
);

const AnonHero = ({ offsetTop, offsetLeft }) => (
  <main style={{ ...dashWrap(offsetTop, offsetLeft), paddingTop: 60 + offsetTop }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "left" }}>
      <div style={{ animation: "itemUp .7s cubic-bezier(.16,1,.3,1) both", maxWidth: 920 }}>
        <p className="eyebrow" style={{ marginBottom: 16 }}>JIM · MARKETPLACE KINÉ · GRATUIT AU LANCEMENT</p>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: 20, textWrap: "pretty" }}>
          Le cabinet&nbsp;<em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", color: "var(--jim-primary)", fontWeight: 500 }}>ne s'arrête pas</em>&nbsp;quand vous partez.
        </h1>
        <p className="lead" style={{ color: "var(--jim-text-body)", maxWidth: 620, marginBottom: 24, fontSize: "1.1rem" }}>
          Marketplace entre kinésithérapeutes vérifiés RPPS. Contrat intégré, paiement séquestre, zéro commission.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <button style={{
            background: "var(--jim-primary)", color: "#fff", border: 0,
            padding: "14px 22px", borderRadius: 14,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 8px 24px rgba(255,124,92,0.35)",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Créer un compte <JIcon name="arrow" size={14} stroke={2.5}/>
          </button>
          <button style={{
            background: "transparent", color: "var(--jim-text)",
            border: "1px solid var(--jim-beige-mid)",
            padding: "14px 22px", borderRadius: 14,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>
            Comment ça marche
          </button>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {["Vérifié RPPS", "Contrat intégré", "Paiement séquestre", "0% commission"].map(t => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".12em" }}>
              <span style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--jim-success-bg)", color: "var(--jim-success)", display: "grid", placeItems: "center" }}>
                <JIcon name="check" size={10} stroke={3}/>
              </span>{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </main>
);

const StatCard = ({ k, v, d, delay = 0 }) => (
  <div style={{
    background: "var(--jim-surface)",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 20, padding: 18,
    boxShadow: "var(--jim-shadow-sm)",
    animation: `itemUp .55s cubic-bezier(.16,1,.3,1) ${delay}s both`,
  }}>
    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".12em", margin: 0 }}>{k}</p>
    <p style={{ fontSize: 36, fontWeight: 800, color: "var(--jim-text)", margin: "8px 0 4px", letterSpacing: "-0.03em" }}>{v}</p>
    <p style={{ fontSize: 12, color: "var(--jim-muted)", margin: 0 }}>{d}</p>
  </div>
);

const AnnoncesCard = ({ items, title = "Tes annonces", subtitle = "Cliquées 284 fois cette semaine" }) => (
  <div style={{
    background: "rgba(255,255,255,0.55)",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 28, padding: 24,
    animation: "itemUp .6s cubic-bezier(.16,1,.3,1) .4s both",
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <h3 style={{ marginBottom: 4 }}>{title}</h3>
        <p style={{ color: "var(--jim-muted)", fontSize: 13 }}>{subtitle}</p>
      </div>
      <button style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "var(--jim-surface-alt)", border: "1px solid var(--jim-beige-mid)",
        color: "var(--jim-text)", padding: "8px 14px", borderRadius: 999,
        fontSize: 12, fontWeight: 700, cursor: "pointer",
      }}>
        <JIcon name="filter" size={13}/> Filtres
      </button>
    </div>

    <div style={{ display: "grid", gap: 12 }}>
      {items.map((a, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "14px 16px",
          background: "var(--jim-surface)",
          border: "1px solid var(--jim-beige-mid)",
          borderRadius: 18,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "var(--jim-primary-pale)",
            display: "grid", placeItems: "center",
            color: "var(--jim-primary)", flexShrink: 0,
          }}>
            <JIcon name="briefcase" size={20}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--jim-text)", marginBottom: 2 }}>{a.t}</p>
            <p style={{ fontSize: 12, color: "var(--jim-muted)" }}>{a.s}</p>
          </div>
          <span style={{
            background: a.badgeTone === "primary" ? "var(--jim-primary)"
                      : a.badgeTone === "success" ? "var(--jim-success)"
                      : "var(--jim-beige-dark)",
            color: "#fff", padding: "4px 10px", borderRadius: 999,
            fontSize: 10, fontWeight: 800, letterSpacing: ".08em",
          }}>{a.badge}</span>
          <span style={{
            background: typeof a.cands === "string" ? "var(--jim-primary)" : "var(--jim-surface-alt)",
            color: typeof a.cands === "string" ? "#fff" : "var(--jim-text)",
            padding: "6px 12px", borderRadius: 999,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>{typeof a.cands === "string" ? a.cands : `${a.cands} candidatures`}</span>
        </div>
      ))}
    </div>
  </div>
);

Object.assign(window, { PageBackdrop, MockDashboard });
