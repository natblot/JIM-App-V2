// paiements-revolut.jsx
// 3 variantes mobile « façon Revolut » — coulées dans la palette chaude JIM.
// Carte compte sombre + actions rondes, analytics donut, pockets segmentées.
// Réutilise window.{Icon, fmt, getData, StatusPill, Money, SPHeader}.

const STATUS_R = {
  paid:    { rempla: "Reçue",      titulaire: "Versée",   color: "var(--jim-success)", bg: "var(--jim-success-bg)" },
  pending: { rempla: "En attente", titulaire: "À régler", color: "var(--jim-warning)", bg: "var(--jim-warning-bg)" },
  escrow:  { rempla: "Séquestre",  titulaire: "Séquestre",color: "var(--jim-primary)", bg: "var(--jim-primary-pale)" },
};

function flatRows(d) { return d.months.flatMap((m) => m.rows.map((r) => ({ ...r, month: m.label }))); }
function sumBy(rows, status) { return rows.filter((r) => r.status === status).reduce((a, r) => a + r.amount, 0); }

// Ligne de transaction « Revolut » — pastille ronde colorée + montant gras.
function RevTx({ r, d, perspective }) {
  const initials = r.who.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const st = STATUS_R[r.status];
  return (
    <div className="rv-tx">
      <div className="rv-tx-ico" style={{ background: st.bg, color: st.color }}>{initials}</div>
      <div className="rv-tx-body">
        <div className="rv-tx-t">{r.who}</div>
        <div className="rv-tx-s">{st[perspective === "titulaire" ? "titulaire" : "rempla"]} · {r.date}</div>
      </div>
      <div className="rv-tx-r">
        <Money amount={r.amount} incoming={d.incoming} />
        <button className="rv-tx-pdf" title={"PDF " + r.ref} aria-label="Télécharger le PDF">
          <Icon name="download" size={13} stroke={2} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANTE 4 — « Compte » : carte sombre + actions rondes (Revolut)
   ───────────────────────────────────────────────────────────── */
function VariantRevAccount({ d, perspective }) {
  const actions = [
    { ic: d.ctaIcon, l: d.cta },
    { ic: "fileText", l: "Factures" },
    { ic: "calendar", l: "Relevé" },
    { ic: "ellipsis", l: "Plus" },
  ];
  return (
    <div className="sp-app rv-app">
      <SPHeader d={d} />
      <div className="rv-acc-body">
        <div className="rv-hero">
          <div className="rv-hero-eyebrow">{d.balanceLabel}</div>
          <div className="rv-hero-bal">{fmt(d.balance)}<span className="cur">€</span></div>
          <div className="rv-hero-sub">{d.balanceSub}</div>
          <div className="rv-actions">
            {actions.map((a) => (
              <button key={a.l} className="rv-act">
                <span className="rv-act-btn"><Icon name={a.ic} size={19} stroke={2.1} /></span>
                <span className="rv-act-lbl">{a.l}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rv-seq-pill seq-block">
          <span className="rv-seq-ico"><Icon name="lock" size={14} stroke={2} /></span>
          <span className="rv-seq-txt"><b>{fmt(d.seq)} €</b> en séquestre · {d.seqSub}</span>
        </div>

        <div className="rv-list">
          <div className="rv-list-hd"><span className="sp-h">Activité récente</span><span className="rv-link">Tout voir</span></div>
          {d.months.map((m) => (
            <div key={m.label} className="rv-group">
              <div className="sp-month">{m.label}</div>
              {m.rows.map((r) => <RevTx key={r.ref} r={r} d={d} perspective={perspective} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANTE 5 — « Analyse » : donut par statut + pockets
   ───────────────────────────────────────────────────────────── */
function Donut({ segments, total, centerLabel }) {
  const R = 54, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="rv-donut">
      <svg viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--jim-beige-light)" strokeWidth="16" />
        {segments.map((s, i) => {
          const frac = total ? s.value / total : 0;
          const len = frac * C;
          const el = (
            <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth="16"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset}
              strokeLinecap="butt" transform="rotate(-90 70 70)" />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="rv-donut-c">
        <span className="rv-donut-n">{fmt(total)} €</span>
        <span className="rv-donut-l">{centerLabel}</span>
      </div>
    </div>
  );
}

function VariantRevAnalyse({ d, perspective }) {
  const rows = flatRows(d);
  const seg = [
    { key: "paid",    value: sumBy(rows, "paid"),    color: "var(--jim-success)" },
    { key: "pending", value: sumBy(rows, "pending"), color: "var(--jim-warning)" },
    { key: "escrow",  value: sumBy(rows, "escrow"),  color: "var(--jim-primary)" },
  ];
  const total = seg.reduce((a, s) => a + s.value, 0);
  const pockets = [
    { ic: "wallet", l: d.balanceLabel, n: d.balance, accent: "var(--jim-primary)" },
    { ic: "lock",   l: "Séquestre",    n: d.seq,     accent: "var(--jim-warning)", seq: true },
    { ic: "repeat", l: d.yearLabel,    n: d.year,    accent: "var(--jim-text)" },
  ];
  return (
    <div className="sp-app rv-app">
      <SPHeader d={d} />
      <div className="rv-an-body">
        <div className="rv-an-top">
          <div className="sp-eyebrow">{d.balanceLabel}</div>
          <div className="rv-an-bal">{fmt(d.balance)}<span className="cur">€</span></div>
        </div>

        <div className="sp-card rv-an-card">
          <div className="rv-an-card-hd"><span className="sp-h">Répartition des factures</span><span className="rv-link">2026</span></div>
          <div className="rv-an-grid">
            <Donut segments={seg} total={total} centerLabel="6 factures" />
            <div className="rv-legend">
              {seg.map((s) => (
                <div key={s.key} className="rv-leg">
                  <span className="rv-leg-dot" style={{ background: s.color }}></span>
                  <span className="rv-leg-l">{STATUS_R[s.key][perspective === "titulaire" ? "titulaire" : "rempla"]}</span>
                  <span className="rv-leg-v">{fmt(s.value)} €</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rv-pockets">
          {pockets.map((p) => (
            <div key={p.l} className={"rv-pocket sp-card" + (p.seq ? " seq-block" : "")}>
              <span className="rv-pocket-ico" style={{ color: p.accent }}><Icon name={p.ic} size={16} stroke={2} /></span>
              <span className="rv-pocket-n">{fmt(p.n)} <span className="cur">€</span></span>
              <span className="rv-pocket-l">{p.l}</span>
            </div>
          ))}
        </div>

        <div className="rv-list">
          {d.months.map((m) => (
            <div key={m.label} className="rv-group">
              <div className="sp-month">{m.label}</div>
              {m.rows.map((r) => <RevTx key={r.ref} r={r} d={d} perspective={perspective} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANTE 6 — « Pockets » : sélecteur segmenté + barre statut
   ───────────────────────────────────────────────────────────── */
function VariantRevPockets({ d, perspective }) {
  const rows = flatRows(d);
  const POCKETS = [
    { id: "compte", label: "Compte",    n: d.balance, sub: d.balanceSub, filter: null },
    { id: "seq",    label: "Séquestre", n: d.seq,     sub: d.seqSub,     filter: "escrow", seq: true },
    { id: "year",   label: "2026",      n: d.year,    sub: d.yearSub,    filter: null },
  ];
  const [sel, setSel] = React.useState("compte");
  const pk = POCKETS.find((p) => p.id === sel);
  const shown = pk.filter ? rows.filter((r) => r.status === pk.filter) : rows;

  const seg = [
    { key: "paid",    value: sumBy(rows, "paid"),    color: "var(--jim-success)" },
    { key: "pending", value: sumBy(rows, "pending"), color: "var(--jim-warning)" },
    { key: "escrow",  value: sumBy(rows, "escrow"),  color: "var(--jim-primary)" },
  ];
  const total = seg.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <div className="sp-app rv-app">
      <SPHeader d={d} />
      <div className="rv-pk-body">
        <div className="rv-seg">
          {POCKETS.map((p) => (
            <button key={p.id} className={"rv-seg-btn" + (sel === p.id ? " active" : "") + (p.seq ? " seq-block" : "")}
              onClick={() => setSel(p.id)}>{p.label}</button>
          ))}
        </div>

        <div className="rv-pk-hero">
          <div className="sp-eyebrow">{pk.label === "Compte" ? d.balanceLabel : pk.label}</div>
          <div className="rv-pk-bal">{fmt(pk.n)}<span className="cur">€</span></div>
          <div className="rv-pk-sub">{pk.sub}</div>
          <button className="sp-btn full" style={{ marginTop: 16 }}>
            <Icon name={d.ctaIcon} size={16} stroke={2.2} />{d.cta} {fmt(d.balance)} €
          </button>
        </div>

        <div className="sp-card rv-bar-card">
          <div className="rv-bar-hd"><span className="sp-h">Statut des factures</span><span className="rv-link">{fmt(total)} €</span></div>
          <div className="rv-bar">
            {seg.map((s) => s.value > 0 && (
              <span key={s.key} className="rv-bar-seg" style={{ width: (s.value / total * 100) + "%", background: s.color }}></span>
            ))}
          </div>
          <div className="rv-bar-legend">
            {seg.map((s) => (
              <span key={s.key} className="rv-bar-leg">
                <span className="rv-leg-dot" style={{ background: s.color }}></span>
                {STATUS_R[s.key][perspective === "titulaire" ? "titulaire" : "rempla"]}
              </span>
            ))}
          </div>
        </div>

        <div className="rv-list">
          <div className="rv-list-hd"><span className="sp-h">{pk.filter === "escrow" ? "En séquestre" : "Factures"}</span><span className="rv-link">{shown.length}</span></div>
          {shown.map((r) => <RevTx key={r.ref} r={r} d={d} perspective={perspective} />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VariantRevAccount, VariantRevAnalyse, VariantRevPockets });
