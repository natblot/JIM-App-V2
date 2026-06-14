/* ============================================================
   JIM — Cards Annonces · 7 variantes
   Mission-type partagée pour comparer à contenu égal
   ============================================================ */

const MISSION = {
  ville: "Lyon 3ᵉ",
  quartier: "Part-Dieu",
  type: "Libéral",
  specialite: "Musculo-squelettique",
  specialiteShort: "Musculo",
  retro: 68,
  dateStart: "15",
  dateEnd: "22",
  month: "juin",
  year: "2026",
  duration: "8 jours",
  titulaire: "Dr. Martin",
  patients: 24,
  urgent: false,
  verified: true,
};

const cardIconHeart = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const cardIconCheck = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const cardIconPin = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const cardIconCal = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const cardIconBuild = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/>
  </svg>
);
const cardIconArrow = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const cardIconStar = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const cardIconUsers = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ============================================================
   COMMON — badge vérifié, save button, CTA
   ============================================================ */
function BadgeVerified() {
  return (
    <span style={bvStyles.wrap}>
      <span style={bvStyles.check}>{cardIconCheck}</span>
      Vérifié
    </span>
  );
}
const bvStyles = {
  wrap: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "var(--jim-success)", letterSpacing: ".02em" },
  check: { display: "inline-flex", width: 14, height: 14, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "var(--jim-success-bg)" },
};

function SaveBtn({ size = 32 }) {
  const [saved, setSaved] = React.useState(false);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved(s => !s); }}
      style={{
        width: size, height: size, borderRadius: 999, border: 0, cursor: "pointer",
        background: saved ? "var(--jim-primary)" : "rgba(255,255,255,.96)",
        color: saved ? "#fff" : "var(--jim-text)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 3px rgba(58,31,8,.12), 0 4px 10px rgba(58,31,8,.08)",
        transition: "all .18s",
      }}
      aria-label={saved ? "Retirer des favoris" : "Sauvegarder"}
    >
      <span style={{ display: "inline-flex", transform: saved ? "scale(1.05)" : "scale(1)", transition: "transform .18s" }}>
        {React.cloneElement(cardIconHeart, { fill: saved ? "currentColor" : "none" })}
      </span>
    </button>
  );
}

function PostulerBtn({ full = false, tone = "primary" }) {
  const bg = tone === "primary" ? "var(--jim-primary)" : "var(--jim-text)";
  const color = "#fff";
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        width: full ? "100%" : "auto",
        height: 36, padding: "0 16px", borderRadius: 10, border: 0, cursor: "pointer",
        background: bg, color, fontFamily: "inherit", fontSize: 13, fontWeight: 700, letterSpacing: "-.005em",
      }}
    >
      Postuler {cardIconArrow}
    </button>
  );
}

/* ============================================================
   VARIANTE A — Structurée sans image
   ============================================================ */
function CardA() {
  return (
    <a href="#" style={aStyles.card} className="jc-hover">
      <div style={aStyles.topRow}>
        <span style={aStyles.chipType}>{MISSION.type}</span>
        <SaveBtn size={30} />
      </div>

      <div style={aStyles.headline}>
        <span style={aStyles.pct}>{MISSION.retro}<span style={aStyles.pctSign}>%</span></span>
        <span style={aStyles.pctLabel}>rétro</span>
      </div>

      <h3 style={aStyles.ville}>{MISSION.ville} · {MISSION.quartier}</h3>
      <p style={aStyles.specialite}>{MISSION.specialite}</p>

      <div style={aStyles.divider}></div>

      <div style={aStyles.metaRow}>
        <span style={aStyles.metaItem}>{cardIconCal}<span>{MISSION.dateStart}–{MISSION.dateEnd} {MISSION.month}</span></span>
        <span style={aStyles.metaDot}>·</span>
        <span style={aStyles.metaItem}>{MISSION.duration}</span>
      </div>

      <div style={aStyles.footer}>
        <BadgeVerified />
        <PostulerBtn />
      </div>
    </a>
  );
}
const aStyles = {
  card: { display: "block", textDecoration: "none", background: "#fff", border: "1px solid rgba(58,31,8,.08)", borderRadius: 20, padding: 20, boxShadow: "var(--jim-shadow-sm)", width: 300, fontFamily: "var(--font-sans)" },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  chipType: { display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, background: "var(--jim-beige-light)", color: "var(--jim-text)", fontSize: 11, fontWeight: 700, letterSpacing: ".02em" },
  headline: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 },
  pct: { fontSize: 52, fontWeight: 800, color: "var(--jim-primary)", letterSpacing: "-.04em", lineHeight: 1 },
  pctSign: { fontSize: 32, fontWeight: 700 },
  pctLabel: { fontSize: 13, fontWeight: 600, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".1em" },
  ville: { fontSize: 18, fontWeight: 800, color: "var(--jim-text)", margin: "14px 0 2px", letterSpacing: "-.015em" },
  specialite: { fontSize: 13, color: "var(--jim-muted)", margin: 0, fontWeight: 500 },
  divider: { height: 1, background: "var(--jim-beige-light)", margin: "16px 0 14px" },
  metaRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--jim-text-body)", fontWeight: 600, marginBottom: 18 },
  metaItem: { display: "inline-flex", alignItems: "center", gap: 5 },
  metaDot: { color: "var(--jim-muted)", opacity: .5 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
};

/* ============================================================
   VARIANTE B — Mini-map géolocalisée
   ============================================================ */
function CardB() {
  return (
    <a href="#" style={bStyles.card} className="jc-hover">
      <div style={bStyles.mapWrap}>
        <MiniMap />
        <div style={bStyles.mapOverlay}>
          <span style={bStyles.chipType}>{MISSION.type}</span>
          <SaveBtn size={32} />
        </div>
        <div style={bStyles.mapAddress}>
          <span style={bStyles.mapPin}>{cardIconPin}</span>
          <span>{MISSION.ville} · {MISSION.quartier}</span>
        </div>
      </div>

      <div style={bStyles.body}>
        <div style={bStyles.titleRow}>
          <h3 style={bStyles.title}>{MISSION.specialite}</h3>
          <div style={bStyles.pctBlock}>
            <span style={bStyles.pct}>{MISSION.retro}%</span>
          </div>
        </div>

        <div style={bStyles.metaRow}>
          <span style={bStyles.metaItem}>{cardIconCal}<span>{MISSION.dateStart}–{MISSION.dateEnd} {MISSION.month}</span></span>
          <span style={bStyles.metaDot}>·</span>
          <span style={bStyles.metaItem}>{MISSION.duration}</span>
        </div>

        <div style={bStyles.footer}>
          <BadgeVerified />
          <PostulerBtn />
        </div>
      </div>
    </a>
  );
}
function MiniMap() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="320" height="160" fill="#f7ede0"/>
      <path d="M-10,90 Q60,60 130,95 T270,80 L330,75" stroke="#d4e7dc" strokeWidth="18" fill="none" opacity=".85"/>
      <path d="M-10,130 Q80,110 160,132 T330,115" stroke="#d4e7dc" strokeWidth="12" fill="none" opacity=".5"/>
      {[...Array(8)].map((_, i) => <line key={"h"+i} x1="0" y1={20 + i * 20} x2="320" y2={20 + i * 20} stroke="#ead9c0" strokeWidth=".6"/>)}
      {[...Array(10)].map((_, i) => <line key={"v"+i} x1={20 + i * 32} y1="0" x2={20 + i * 32} y2="160" stroke="#ead9c0" strokeWidth=".6"/>)}
      <line x1="0" y1="60" x2="320" y2="60" stroke="#dcbfa0" strokeWidth="2" opacity=".7"/>
      <line x1="180" y1="0" x2="180" y2="160" stroke="#dcbfa0" strokeWidth="2" opacity=".7"/>
      <rect x="40" y="105" width="36" height="24" rx="3" fill="#e5e9cb" opacity=".6"/>
      <rect x="220" y="25" width="44" height="28" rx="3" fill="#e5e9cb" opacity=".6"/>
      <circle cx="168" cy="72" r="54" fill="#ff7c5c" opacity=".08"/>
      <circle cx="168" cy="72" r="34" fill="#ff7c5c" opacity=".12"/>
      <g transform="translate(168 72)">
        <circle r="14" fill="#ff7c5c"/>
        <circle r="6" fill="#fff"/>
      </g>
    </svg>
  );
}
const bStyles = {
  card: { display: "block", textDecoration: "none", background: "#fff", border: "1px solid rgba(58,31,8,.08)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--jim-shadow-sm)", width: 320, fontFamily: "var(--font-sans)" },
  mapWrap: { position: "relative", height: 160 },
  mapOverlay: { position: "absolute", top: 12, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between" },
  chipType: { display: "inline-flex", alignItems: "center", padding: "5px 11px", borderRadius: 999, background: "rgba(255,255,255,.96)", color: "var(--jim-text)", fontSize: 11, fontWeight: 700, letterSpacing: ".02em", boxShadow: "0 1px 3px rgba(58,31,8,.12)" },
  mapAddress: { position: "absolute", bottom: 12, left: 12, right: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 10, padding: "7px 11px", fontSize: 12, fontWeight: 700, color: "var(--jim-text)", boxShadow: "0 1px 3px rgba(58,31,8,.12)" },
  mapPin: { color: "var(--jim-primary)", display: "inline-flex" },
  body: { padding: "16px 18px 18px" },
  titleRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 },
  title: { fontSize: 17, fontWeight: 800, color: "var(--jim-text)", margin: 0, letterSpacing: "-.015em", flex: 1 },
  pctBlock: { flexShrink: 0 },
  pct: { fontSize: 22, fontWeight: 800, color: "var(--jim-primary)", letterSpacing: "-.03em" },
  metaRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--jim-text-body)", fontWeight: 600, marginBottom: 14 },
  metaItem: { display: "inline-flex", alignItems: "center", gap: 5 },
  metaDot: { color: "var(--jim-muted)", opacity: .5 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
};

/* ============================================================
   VARIANTE C — Illustration géométrique par spécialité
   ============================================================ */
function CardC() {
  return (
    <a href="#" style={cStyles.card} className="jc-hover">
      <div style={cStyles.art}>
        <SpecialiteGlyph />
        <div style={cStyles.artTop}>
          <span style={cStyles.specChip}>{MISSION.specialite}</span>
          <SaveBtn size={32} />
        </div>
        <div style={cStyles.artFoot}>
          <span style={cStyles.pctXL}>{MISSION.retro}%</span>
        </div>
      </div>
      <div style={cStyles.body}>
        <div style={cStyles.titleRow}>
          <h3 style={cStyles.ville}>{MISSION.ville}</h3>
          <span style={cStyles.chipType}>{MISSION.type}</span>
        </div>
        <p style={cStyles.addr}>{cardIconPin}<span>{MISSION.quartier}</span></p>
        <div style={cStyles.metaRow}>
          <span style={cStyles.metaItem}>{cardIconCal}<span>{MISSION.dateStart}–{MISSION.dateEnd} {MISSION.month}</span></span>
          <span style={cStyles.metaDot}>·</span>
          <span style={cStyles.metaItem}>{MISSION.duration}</span>
        </div>
        <div style={cStyles.footer}>
          <BadgeVerified />
          <PostulerBtn />
        </div>
      </div>
    </a>
  );
}
function SpecialiteGlyph() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9a80"/>
          <stop offset="1" stopColor="#ff7c5c"/>
        </linearGradient>
      </defs>
      <rect width="320" height="160" fill="url(#cg1)"/>
      <g transform="translate(32 28)" opacity=".9">
        {[0,1,2,3,4].map(i => (
          <g key={i} transform={`translate(${i * 52} ${i * 8})`}>
            <rect x="0" y="0" width="40" height="28" rx="14" fill="#fff" opacity=".22"/>
            <rect x="6" y="6" width="28" height="16" rx="8" fill="#fff" opacity=".4"/>
          </g>
        ))}
      </g>
      <circle cx="260" cy="130" r="60" fill="#fff" opacity=".1"/>
      <circle cx="40" cy="20" r="30" fill="#fff" opacity=".08"/>
    </svg>
  );
}
const cStyles = {
  card: { display: "block", textDecoration: "none", background: "#fff", border: "1px solid rgba(58,31,8,.08)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--jim-shadow-sm)", width: 320, fontFamily: "var(--font-sans)" },
  art: { position: "relative", height: 160 },
  artTop: { position: "absolute", top: 14, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between" },
  artFoot: { position: "absolute", bottom: 12, left: 16, display: "flex", alignItems: "baseline", gap: 8 },
  specChip: { display: "inline-flex", alignItems: "center", padding: "5px 11px", borderRadius: 999, background: "rgba(255,255,255,.92)", color: "var(--jim-text)", fontSize: 11, fontWeight: 700, letterSpacing: ".02em" },
  pctXL: { fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-.035em", lineHeight: 1, textShadow: "0 2px 12px rgba(58,31,8,.2)" },
  body: { padding: "18px" },
  titleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 2 },
  ville: { fontSize: 20, fontWeight: 800, color: "var(--jim-text)", margin: 0, letterSpacing: "-.02em" },
  chipType: { display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 999, background: "var(--jim-beige-light)", color: "var(--jim-text)", fontSize: 11, fontWeight: 700, letterSpacing: ".02em" },
  addr: { display: "inline-flex", alignItems: "center", gap: 5, margin: "4px 0 14px", fontSize: 13, color: "var(--jim-muted)", fontWeight: 500 },
  metaRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--jim-text-body)", fontWeight: 600, marginBottom: 14 },
  metaItem: { display: "inline-flex", alignItems: "center", gap: 5 },
  metaDot: { color: "var(--jim-muted)", opacity: .5 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
};

/* ============================================================
   VARIANTE D — Liste dense
   ============================================================ */
function CardD() {
  const rows = [
    { ...MISSION, urgent: true },
    { ...MISSION, ville: "Villeurbanne", quartier: "Gratte-Ciel", retro: 72, dateStart: "18", dateEnd: "25", type: "Centre", specialite: "Neuro & rééducation", specialiteShort: "Neuro" },
    { ...MISSION, ville: "Lyon 7ᵉ", quartier: "Jean-Macé", retro: 65, dateStart: "22", dateEnd: "29", type: "Libéral", specialite: "Pédiatrie", specialiteShort: "Pédiatrie" },
  ];
  return (
    <div style={dStyles.wrap}>
      {rows.map((r, i) => (
        <a key={i} href="#" style={{ ...dStyles.row, borderTop: i === 0 ? "0" : "1px solid var(--jim-beige-light)" }} className="jc-hover-row">
          <div style={dStyles.left}>
            {r.urgent ? <span style={dStyles.urgentDot} aria-label="Urgent"/> : <span style={dStyles.dotPlain}/>}
            <div style={dStyles.dateStack}>
              <span style={dStyles.dateNum}>{r.dateStart}</span>
              <span style={dStyles.dateMonth}>{r.month.slice(0,3)}.</span>
            </div>
          </div>
          <div style={dStyles.mid}>
            <div style={dStyles.midTop}>
              <h4 style={dStyles.villeD}>{r.ville} · {r.quartier}</h4>
              {r.verified && <BadgeVerified />}
            </div>
            <div style={dStyles.midBot}>
              <span style={dStyles.specD}>{r.specialite}</span>
              <span style={dStyles.metaDot}>·</span>
              <span style={dStyles.typeD}>{r.type}</span>
              <span style={dStyles.metaDot}>·</span>
              <span style={dStyles.durD}>{r.dateStart}–{r.dateEnd} {r.month}</span>
            </div>
          </div>
          <div style={dStyles.right}>
            <div style={dStyles.pctD}>{r.retro}<span style={{fontSize:14,fontWeight:700}}>%</span></div>
            <SaveBtn size={28} />
          </div>
        </a>
      ))}
    </div>
  );
}
const dStyles = {
  wrap: { width: 620, background: "#fff", border: "1px solid rgba(58,31,8,.08)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--jim-shadow-sm)", fontFamily: "var(--font-sans)" },
  row: { display: "grid", gridTemplateColumns: "64px 1fr auto", alignItems: "center", gap: 18, padding: "18px 20px", textDecoration: "none", color: "inherit" },
  left: { display: "flex", alignItems: "center", gap: 10 },
  urgentDot: { width: 8, height: 8, borderRadius: 999, background: "var(--jim-primary)", flexShrink: 0, boxShadow: "0 0 0 4px rgba(255,124,92,.18)" },
  dotPlain: { width: 8, height: 8, borderRadius: 999, background: "var(--jim-beige-mid)", flexShrink: 0 },
  dateStack: { display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 },
  dateNum: { fontSize: 22, fontWeight: 800, color: "var(--jim-text)", letterSpacing: "-.02em" },
  dateMonth: { fontSize: 10, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 2 },
  mid: { minWidth: 0 },
  midTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  villeD: { fontSize: 15, fontWeight: 800, color: "var(--jim-text)", margin: 0, letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  midBot: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--jim-muted)", fontWeight: 500 },
  specD: { color: "var(--jim-text-body)", fontWeight: 600 },
  typeD: {},
  durD: {},
  metaDot: { opacity: .5 },
  right: { display: "flex", alignItems: "center", gap: 14 },
  pctD: { fontSize: 22, fontWeight: 800, color: "var(--jim-primary)", letterSpacing: "-.03em", lineHeight: 1 },
};

/* ============================================================
   VARIANTE E — Confortable avec photo ville (placeholder)
   ============================================================ */
function CardE() {
  return (
    <a href="#" style={eStyles.card} className="jc-hover">
      <div style={eStyles.photoWrap}>
        <PhotoPlaceholder />
        <div style={eStyles.photoTop}>
          <span style={eStyles.urgentPill}><span style={eStyles.urgentDotE}/>2 candidats</span>
          <SaveBtn size={34} />
        </div>
      </div>

      <div style={eStyles.body}>
        <div style={eStyles.hgroup}>
          <h3 style={eStyles.h}>{MISSION.ville}, {MISSION.quartier}</h3>
          <div style={eStyles.subRow}>
            <span style={eStyles.type}>{MISSION.type}</span>
            <span style={eStyles.dot}>·</span>
            <span style={eStyles.spec}>{MISSION.specialite}</span>
          </div>
        </div>

        <div style={eStyles.dateCard}>
          <div style={eStyles.dateBlock}>
            <span style={eStyles.dLabel}>du</span>
            <span style={eStyles.dVal}>{MISSION.dateStart} {MISSION.month.slice(0,3)}.</span>
          </div>
          <div style={eStyles.dateSep}>→</div>
          <div style={eStyles.dateBlock}>
            <span style={eStyles.dLabel}>au</span>
            <span style={eStyles.dVal}>{MISSION.dateEnd} {MISSION.month.slice(0,3)}.</span>
          </div>
          <div style={eStyles.pctCorner}>
            <span style={eStyles.pctCornerVal}>{MISSION.retro}%</span>
            <span style={eStyles.pctCornerLbl}>rétro</span>
          </div>
        </div>

        <div style={eStyles.footer}>
          <BadgeVerified />
          <PostulerBtn />
        </div>
      </div>
    </a>
  );
}
function PhotoPlaceholder() {
  return (
    <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="eg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9c2"/>
          <stop offset=".6" stopColor="#ffc5b3"/>
          <stop offset="1" stopColor="#e8bb9a"/>
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill="url(#eg1)"/>
      <circle cx="280" cy="62" r="28" fill="#fff" opacity=".45"/>
      <path d="M0,150 Q90,110 180,140 T360,125 L360,200 L0,200 Z" fill="#3a1f08" opacity=".12"/>
      <g fill="#3a1f08" opacity=".32">
        <rect x="40" y="130" width="24" height="50"/>
        <rect x="64" y="115" width="18" height="65"/>
        <rect x="82" y="125" width="20" height="55"/>
        <rect x="112" y="100" width="28" height="80"/>
        <polygon points="126,70 130,100 140,100 140,85"/>
        <rect x="150" y="130" width="16" height="50"/>
        <rect x="168" y="120" width="22" height="60"/>
        <rect x="200" y="140" width="18" height="40"/>
        <rect x="222" y="110" width="26" height="70"/>
        <rect x="255" y="130" width="20" height="50"/>
        <rect x="290" y="120" width="24" height="60"/>
        <rect x="320" y="135" width="18" height="45"/>
      </g>
      <rect x="0" y="180" width="360" height="20" fill="#3a1f08" opacity=".2"/>
    </svg>
  );
}
const eStyles = {
  card: { display: "block", textDecoration: "none", background: "#fff", border: "1px solid rgba(58,31,8,.08)", borderRadius: 24, overflow: "hidden", boxShadow: "var(--jim-shadow)", width: 360, fontFamily: "var(--font-sans)" },
  photoWrap: { position: "relative", height: 200 },
  photoTop: { position: "absolute", top: 14, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between" },
  urgentPill: { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, background: "rgba(255,255,255,.96)", color: "var(--jim-text)", fontSize: 11, fontWeight: 700 },
  urgentDotE: { width: 7, height: 7, borderRadius: 999, background: "var(--jim-primary)" },
  body: { padding: "20px 22px 22px" },
  hgroup: { marginBottom: 16 },
  h: { fontSize: 22, fontWeight: 800, color: "var(--jim-text)", margin: 0, letterSpacing: "-.02em", lineHeight: 1.15 },
  subRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 13, color: "var(--jim-muted)", fontWeight: 500 },
  type: { color: "var(--jim-text-body)", fontWeight: 600 },
  dot: { opacity: .5 },
  spec: {},
  dateCard: { display: "grid", gridTemplateColumns: "1fr auto 1fr auto", alignItems: "center", gap: 10, background: "var(--jim-surface-alt)", borderRadius: 14, padding: "12px 16px", marginBottom: 16 },
  dateBlock: { display: "flex", flexDirection: "column", lineHeight: 1 },
  dLabel: { fontSize: 10, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 },
  dVal: { fontSize: 16, fontWeight: 800, color: "var(--jim-text)", letterSpacing: "-.01em" },
  dateSep: { fontSize: 14, fontWeight: 700, color: "var(--jim-primary)" },
  pctCorner: { display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1, paddingLeft: 12, borderLeft: "1px solid var(--jim-beige-mid)" },
  pctCornerVal: { fontSize: 20, fontWeight: 800, color: "var(--jim-primary)", letterSpacing: "-.02em" },
  pctCornerLbl: { fontSize: 9, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".12em", marginTop: 4 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
};

/* ============================================================
   VARIANTE F — Éditoriale
   ============================================================ */
function CardF() {
  return (
    <a href="#" style={fStyles.card} className="jc-hover">
      <div style={fStyles.topBar}>
        <div style={fStyles.topL}>
          <span style={fStyles.eyebrow}>Disponible dès</span>
          <span style={fStyles.topDate}>{MISSION.dateStart} {MISSION.month}</span>
        </div>
        <SaveBtn size={32} />
      </div>

      <div style={fStyles.pctHero}>
        <span style={fStyles.pctBig}>{MISSION.retro}</span>
        <div style={fStyles.pctSide}>
          <span style={fStyles.pctPct}>%</span>
          <span style={fStyles.pctRetro}>rétro</span>
        </div>
      </div>

      <div style={fStyles.meta}>
        <div style={fStyles.metaLine}>
          <span style={fStyles.metaIco}>{cardIconPin}</span>
          <span style={fStyles.metaTxt}>{MISSION.ville} · {MISSION.quartier}</span>
        </div>
        <div style={fStyles.metaLine}>
          <span style={fStyles.metaIco}>{cardIconBuild}</span>
          <span style={fStyles.metaTxt}>{MISSION.type} · {MISSION.specialite}</span>
        </div>
        <div style={fStyles.metaLine}>
          <span style={fStyles.metaIco}>{cardIconCal}</span>
          <span style={fStyles.metaTxt}>{MISSION.duration} ({MISSION.dateStart}–{MISSION.dateEnd} {MISSION.month})</span>
        </div>
      </div>

      <div style={fStyles.footer}>
        <BadgeVerified />
        <PostulerBtn tone="dark" />
      </div>
    </a>
  );
}
const fStyles = {
  card: { display: "block", textDecoration: "none", background: "var(--jim-surface-alt)", border: "1px solid var(--jim-beige-mid)", borderRadius: 24, padding: "20px 22px 22px", boxShadow: "var(--jim-shadow-sm)", width: 320, fontFamily: "var(--font-sans)", position: "relative", overflow: "hidden" },
  topBar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 },
  topL: { display: "flex", flexDirection: "column", lineHeight: 1 },
  eyebrow: { fontSize: 10, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 },
  topDate: { fontSize: 14, fontWeight: 800, color: "var(--jim-text)", letterSpacing: "-.01em" },
  pctHero: { display: "flex", alignItems: "flex-start", gap: 4, margin: "8px 0 24px", lineHeight: .85 },
  pctBig: { fontSize: 128, fontWeight: 800, color: "var(--jim-primary)", letterSpacing: "-.06em" },
  pctSide: { display: "flex", flexDirection: "column", paddingTop: 14 },
  pctPct: { fontSize: 44, fontWeight: 800, color: "var(--jim-primary)", letterSpacing: "-.04em", lineHeight: 1 },
  pctRetro: { fontSize: 12, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".14em", marginTop: 6 },
  meta: { display: "flex", flexDirection: "column", gap: 8, paddingTop: 16, borderTop: "1px solid var(--jim-beige-mid)", marginBottom: 18 },
  metaLine: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--jim-text)", fontWeight: 600 },
  metaIco: { display: "inline-flex", color: "var(--jim-muted)", width: 14, justifyContent: "center" },
  metaTxt: { letterSpacing: "-.005em" },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
};

/* ============================================================
   VARIANTE G — Timeline / calendrier
   ============================================================ */
function CardG() {
  const days = [
    { n: 13, w: "S", off: true },
    { n: 14, w: "D", off: true },
    { n: 15, w: "L", in: "start" },
    { n: 16, w: "M", in: "mid" },
    { n: 17, w: "M", in: "mid" },
    { n: 18, w: "J", in: "mid" },
    { n: 19, w: "V", in: "mid" },
    { n: 20, w: "S", in: "mid" },
    { n: 21, w: "D", in: "mid" },
    { n: 22, w: "L", in: "end" },
    { n: 23, w: "M", off: true },
    { n: 24, w: "M", off: true },
  ];
  return (
    <a href="#" style={gStyles.card} className="jc-hover">
      <div style={gStyles.topRow}>
        <div>
          <span style={gStyles.eyebrow}>{MISSION.month} {MISSION.year}</span>
          <h3 style={gStyles.title}>{MISSION.duration} · {MISSION.ville}</h3>
        </div>
        <SaveBtn size={32} />
      </div>

      <div style={gStyles.calendar}>
        {days.map((d, i) => (
          <div key={i} style={{
            ...gStyles.day,
            ...(d.in === "start" ? gStyles.dayStart : {}),
            ...(d.in === "mid" ? gStyles.dayMid : {}),
            ...(d.in === "end" ? gStyles.dayEnd : {}),
            ...(d.off ? gStyles.dayOff : {}),
          }}>
            <span style={gStyles.dayW}>{d.w}</span>
            <span style={gStyles.dayN}>{d.n}</span>
          </div>
        ))}
      </div>

      <div style={gStyles.rowSplit}>
        <div>
          <span style={gStyles.eyebrow}>Mission</span>
          <p style={gStyles.sub}>{MISSION.type} · {MISSION.specialite}</p>
        </div>
        <div style={{textAlign:"right"}}>
          <span style={gStyles.eyebrow}>Rétrocession</span>
          <p style={gStyles.pctG}>{MISSION.retro}%</p>
        </div>
      </div>

      <div style={gStyles.footer}>
        <BadgeVerified />
        <PostulerBtn />
      </div>
    </a>
  );
}
const gStyles = {
  card: { display: "block", textDecoration: "none", background: "#fff", border: "1px solid rgba(58,31,8,.08)", borderRadius: 20, padding: "20px 22px 22px", boxShadow: "var(--jim-shadow-sm)", width: 360, fontFamily: "var(--font-sans)" },
  topRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 },
  eyebrow: { fontSize: 10, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".15em", display: "block", marginBottom: 4 },
  title: { fontSize: 18, fontWeight: 800, color: "var(--jim-text)", margin: 0, letterSpacing: "-.015em" },
  calendar: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3, marginBottom: 18 },
  day: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "8px 0", background: "var(--jim-surface-alt)", color: "var(--jim-text)", fontSize: 10, fontWeight: 700, borderRadius: 4 },
  dayOff: { background: "transparent", color: "var(--jim-muted)", opacity: .5 },
  dayMid: { background: "var(--jim-primary-pale)", color: "var(--jim-primary)" },
  dayStart: { background: "var(--jim-primary)", color: "#fff", borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
  dayEnd: { background: "var(--jim-primary)", color: "#fff", borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  dayW: { fontSize: 9, fontWeight: 700, opacity: .7, textTransform: "uppercase", letterSpacing: ".1em" },
  dayN: { fontSize: 13, fontWeight: 800, letterSpacing: "-.02em" },
  rowSplit: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--jim-beige-light)" },
  sub: { fontSize: 14, fontWeight: 700, color: "var(--jim-text)", margin: 0, letterSpacing: "-.01em" },
  pctG: { fontSize: 24, fontWeight: 800, color: "var(--jim-primary)", margin: 0, letterSpacing: "-.03em", lineHeight: 1 },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
};

/* ============================================================
   APP
   ============================================================ */
function App() {
  return (
    <DesignCanvas
      title="JIM · Cards Annonces"
      subtitle="7 directions explorant structure, densité, traitement visuel et hiérarchie — mission-type commune"
    >
      <DCSection id="compact" title="Compact · sans décoratif" subtitle="Tout en info structurée. Scan rapide en 3 colonnes kanban.">
        <DCArtboard id="A" label="A · Structurée — rétro en héro" width={340} height={380}>
          <div style={pad}><CardA /></div>
        </DCArtboard>
        <DCArtboard id="F" label="F · Éditoriale — affiche" width={360} height={500}>
          <div style={pad}><CardF /></div>
        </DCArtboard>
      </DCSection>

      <DCSection id="visual" title="Avec visuel — map, glyphe, illustration" subtitle="Le visuel apporte de l'info (localisation ou spécialité), pas de la décoration.">
        <DCArtboard id="B" label="B · Mini-map géolocalisée" width={360} height={480}>
          <div style={pad}><CardB /></div>
        </DCArtboard>
        <DCArtboard id="C" label="C · Glyphe par spécialité" width={360} height={500}>
          <div style={pad}><CardC /></div>
        </DCArtboard>
        <DCArtboard id="E" label="E · Photo ville — confortable" width={400} height={560}>
          <div style={pad}><CardE /></div>
        </DCArtboard>
      </DCSection>

      <DCSection id="calendar" title="Date-first — le temps comme visuel" subtitle="Pour remplaçants qui filtrent d'abord par disponibilité.">
        <DCArtboard id="G" label="G · Timeline mois" width={400} height={440}>
          <div style={pad}><CardG /></div>
        </DCArtboard>
      </DCSection>

      <DCSection id="dense" title="Dense · liste" subtitle="Une ligne par annonce pour les longues sessions de recherche.">
        <DCArtboard id="D" label="D · Liste dense (3 rangs)" width={660} height={280}>
          <div style={pad}><CardD /></div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const pad = { padding: 20, display: "flex", alignItems: "flex-start", justifyContent: "center" };

Object.assign(window, { CardA, CardB, CardC, CardD, CardE, CardF, CardG, App });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
