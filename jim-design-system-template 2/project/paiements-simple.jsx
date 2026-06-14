// paiements-simple.jsx
// Version simplifiée Paiements & suivi de factures — 3 variantes.
// Solde inspiré de Trade Republic : un grand chiffre calme, beaucoup d'air.
// Exporte vers window : SP_DATA, getData, Icon, SPHeader, StatusPill, Money,
//   FactureRow, VariantSolde, VariantSplit, VariantLedger.

/* ─────────────────────────────────────────────────────────────
   Données — deux perspectives (remplaçant / titulaire)
   ───────────────────────────────────────────────────────────── */
const SP_DATA = {
  rempla: {
    avatar: "NB",
    name: "Nicolas B.",
    role: "Kiné · Paris 11e",
    balanceLabel: "Disponible",
    balance: 1931,
    balanceSub: "Mis à jour aujourd’hui · 14:12",
    cta: "Retirer",
    ctaIcon: "down",
    seq: 1516,
    seqSub: "Libération le 27 mai · dans 8 j",
    yearLabel: "Reçu en 2026",
    year: 14288,
    yearSub: "12 missions",
    incoming: true,
    months: [
      { label: "Mai 2026", rows: [
        { who: "Cabinet Voltaire", sub: "Dr Lefèvre · Paris 11e", date: "12 mai", amount: 1240, status: "paid",    ref: "FAC-2026-0512" },
        { who: "Cabinet Nation",   sub: "Dr Petit · Paris 12e",   date: "6 mai",  amount: 691,  status: "pending", ref: "FAC-2026-0506" },
        { who: "Cabinet Bastille", sub: "Dr Moreau · Paris 11e",  date: "2 mai",  amount: 820,  status: "paid",    ref: "FAC-2026-0502" },
      ]},
      { label: "Avril 2026", rows: [
        { who: "Cabinet République", sub: "Dr Saïd · Paris 3e",    date: "27 avr", amount: 1516, status: "escrow",  ref: "FAC-2026-0427" },
        { who: "Cabinet Oberkampf",  sub: "Dr Lévy · Paris 11e",   date: "18 avr", amount: 980,  status: "paid",    ref: "FAC-2026-0418" },
        { who: "Cabinet Charonne",   sub: "Dr Roy · Paris 20e",    date: "9 avr",  amount: 1130, status: "paid",    ref: "FAC-2026-0409" },
      ]},
    ],
  },
  titulaire: {
    avatar: "AB",
    name: "Dr Amélie Brun",
    role: "Titulaire · Cabinet Voltaire",
    balanceLabel: "À régler",
    balance: 691,
    balanceSub: "1 facture en attente · échéance 14 mai",
    cta: "Régler",
    ctaIcon: "send",
    seq: 1516,
    seqSub: "Sécurisé pour le remplaçant · libération 27 mai",
    yearLabel: "Versé en 2026",
    year: 18740,
    yearSub: "9 remplaçants",
    incoming: false,
    months: [
      { label: "Mai 2026", rows: [
        { who: "Nicolas B.",   sub: "Remplacement · 6–10 mai", date: "12 mai", amount: 1240, status: "paid",    ref: "FAC-2026-0512" },
        { who: "Julie Martin", sub: "Remplacement · 2–3 mai",  date: "6 mai",  amount: 691,  status: "pending", ref: "FAC-2026-0506" },
        { who: "Karim Daoud",  sub: "Remplacement · 1 mai",    date: "2 mai",  amount: 820,  status: "paid",    ref: "FAC-2026-0502" },
      ]},
      { label: "Avril 2026", rows: [
        { who: "Léa Fontaine", sub: "Remplacement · 24–28 avr", date: "27 avr", amount: 1516, status: "escrow",  ref: "FAC-2026-0427" },
        { who: "Nicolas B.",   sub: "Remplacement · 16–18 avr", date: "18 avr", amount: 980,  status: "paid",    ref: "FAC-2026-0418" },
        { who: "Sofia Mreni",  sub: "Remplacement · 7–9 avr",   date: "9 avr",  amount: 1130, status: "paid",    ref: "FAC-2026-0409" },
      ]},
    ],
  },
};

function getData(perspective) {
  return SP_DATA[perspective === "titulaire" ? "titulaire" : "rempla"];
}

const STATUS = {
  paid:    { rempla: "Reçue",      titulaire: "Versée" },
  pending: { rempla: "En attente", titulaire: "À régler" },
  escrow:  { rempla: "Séquestre",  titulaire: "Séquestre" },
};

// Format 1931 -> "1 931" (espace fine insécable)
function fmt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
}

/* ─────────────────────────────────────────────────────────────
   Icônes inline (lucide) — évite le re-render lucide.createIcons
   ───────────────────────────────────────────────────────────── */
const ICON_PATHS = {
  wallet: <React.Fragment><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></React.Fragment>,
  down:   <React.Fragment><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></React.Fragment>,
  send:   <React.Fragment><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></React.Fragment>,
  lock:   <React.Fragment><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></React.Fragment>,
  download: <React.Fragment><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></React.Fragment>,
  shield: <React.Fragment><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></React.Fragment>,
  arrowUp: <React.Fragment><path d="M7 7h10v10"/><path d="M7 17 17 7"/></React.Fragment>,
  chev:   <path d="m9 18 6-6-6-6"/>,
  search: <React.Fragment><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></React.Fragment>,
  fileText: <React.Fragment><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/></React.Fragment>,
  ellipsis: <React.Fragment><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/><circle cx="5" cy="12" r="1.4"/></React.Fragment>,
  plus:   <React.Fragment><path d="M5 12h14"/><path d="M12 5v14"/></React.Fragment>,
  calendar: <React.Fragment><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></React.Fragment>,
  repeat: <React.Fragment><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></React.Fragment>,
  pie:    <React.Fragment><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></React.Fragment>,
};
function Icon({ name, size = 16, stroke = 2, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }}>
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Briques partagées
   ───────────────────────────────────────────────────────────── */
function SPHeader({ d }) {
  return (
    <nav className="sp-nav">
      <img className="sp-nav-logo" src="assets/jim-mark.png" alt="JIM" />
      <button className="sp-nav-pill" type="button">Missions</button>
      <button className="sp-nav-add" type="button" aria-label="Publier une annonce">
        <Icon name="plus" size={22} stroke={2.6} />
      </button>
      <div className="sp-nav-search">
        <span className="sp-nav-search-ico">
          <Icon name="search" size={18} stroke={2.4} />
        </span>
        <input placeholder="Rechercher" readOnly />
      </div>
      <div className="sp-nav-av" title={d.name}>{d.avatar}</div>
    </nav>
  );
}

function StatusPill({ status, perspective }) {
  return <span className={"sp-status " + status}>{STATUS[status][perspective === "titulaire" ? "titulaire" : "rempla"]}</span>;
}

function Money({ amount, incoming }) {
  return (
    <span className={"sp-amt" + (incoming ? " pos" : "")}>
      {incoming ? "+" : ""}{fmt(amount)}<span className="sp-amt-cur"> €</span>
    </span>
  );
}

// Une ligne de facture (liste). variant "list" (défaut) ou "rich".
function FactureRow({ r, d, perspective }) {
  const initials = r.who.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="sp-row">
      <div className="sp-row-ico">{initials}</div>
      <div className="sp-row-body">
        <div className="sp-row-t">{r.who}</div>
        <div className="sp-row-s">
          <span>{r.sub}</span>
        </div>
      </div>
      <div className="sp-row-r">
        <Money amount={r.amount} incoming={d.incoming} />
        <div className="sp-row-meta">
          <StatusPill status={r.status} perspective={perspective} />
          <span className="sp-row-date">· {r.date}</span>
        </div>
      </div>
      <button className="sp-pdf" title={"Télécharger " + r.ref} aria-label="Télécharger le PDF">
        <Icon name="download" size={15} stroke={2} />
      </button>
    </div>
  );
}

// Bloc solde « Trade Republic » réutilisé par les variantes.
function BalanceBlock({ d, big = 46 }) {
  return (
    <div>
      <div className="sp-eyebrow">{d.balanceLabel}</div>
      <div className="sp-balance" style={{ fontSize: big }}>
        {fmt(d.balance)}<span className="cur">€</span>
      </div>
      <div className="sp-balance-sub">{d.balanceSub}</div>
    </div>
  );
}

function SeqLine({ d }) {
  return (
    <div className="sp-seq seq-block">
      <div className="sp-seq-ico"><Icon name="lock" size={15} stroke={2} /></div>
      <div className="sp-seq-txt">
        <div className="sp-seq-n">{fmt(d.seq)} €<span className="sp-seq-tag">en séquestre</span></div>
        <div className="sp-seq-s">{d.seqSub}</div>
      </div>
    </div>
  );
}

function CtaButton({ d, full }) {
  return (
    <button className={"sp-btn" + (full ? " full" : "")}>
      <Icon name={d.ctaIcon} size={16} stroke={2.2} />{d.cta} {fmt(d.balance)} €
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANTE 1 — « Solde » (Trade Republic, colonne centrée)
   ───────────────────────────────────────────────────────────── */
function VariantSolde({ d, perspective }) {
  return (
    <div className="sp-app v-solde">
      <SPHeader d={d} />
      <div className="sp-solde-body">
        <div className="sp-solde-hero">
          <BalanceBlock d={d} big={52} />
          <CtaButton d={d} full />
          <SeqLine d={d} />
          <div className="sp-solde-year seq-sibling">
            <span className="sp-stat-l">{d.yearLabel}</span>
            <span className="sp-year-n">{fmt(d.year)} <span className="cur">€</span></span>
          </div>
        </div>

        <div className="sp-list">
          <div className="sp-list-hd">
            <span className="sp-h">Factures</span>
            <span className="sp-list-count">6 documents</span>
          </div>
          {d.months.map((m) => (
            <div key={m.label} className="sp-group">
              <div className="sp-month">{m.label}</div>
              {m.rows.map((r) => <FactureRow key={r.ref} r={r} d={d} perspective={perspective} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANTE 2 — « Deux colonnes »
   ───────────────────────────────────────────────────────────── */
function VariantSplit({ d, perspective }) {
  const FILTERS = [
    { id: "all", label: "Toutes" },
    { id: "pending", label: perspective === "titulaire" ? "À régler" : "En attente" },
    { id: "paid", label: perspective === "titulaire" ? "Versées" : "Reçues" },
  ];
  const [filter, setFilter] = React.useState("all");
  const flat = d.months.flatMap((m) => m.rows.map((r) => ({ ...r, month: m.label })));
  const shown = filter === "all" ? flat : flat.filter((r) => r.status === filter);
  // regroupe par mois en conservant l'ordre
  const groups = [];
  shown.forEach((r) => {
    let g = groups.find((x) => x.label === r.month);
    if (!g) { g = { label: r.month, rows: [] }; groups.push(g); }
    g.rows.push(r);
  });

  return (
    <div className="sp-app v-split">
      <SPHeader d={d} />
      <div className="sp-split-body">
        <aside className="sp-split-side">
          <div className="sp-card sp-pad sp-balance-card">
            <BalanceBlock d={d} big={42} />
            <CtaButton d={d} full />
          </div>
          <SeqLine d={d} />
          <div className="sp-card sp-pad sp-year-card seq-sibling">
            <span className="sp-stat-l">{d.yearLabel}</span>
            <span className="sp-year-n big">{fmt(d.year)} <span className="cur">€</span></span>
            <span className="sp-year-sub">{d.yearSub}</span>
          </div>
        </aside>

        <section className="sp-card sp-split-main">
          <div className="sp-split-main-hd">
            <span className="sp-h">Factures</span>
            <div className="sp-split-tools">
              <div className="sp-search">
                <Icon name="search" size={14} stroke={2} style={{ color: "var(--jim-muted)" }} />
                <input placeholder="Rechercher une facture…" readOnly />
              </div>
              <div className="sp-chips">
                {FILTERS.map((f) => (
                  <button key={f.id} className={"sp-chip" + (filter === f.id ? " active" : "")} onClick={() => setFilter(f.id)}>{f.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="sp-split-list">
            {groups.length === 0 && <div className="sp-empty">Aucune facture dans cette catégorie.</div>}
            {groups.map((m) => (
              <div key={m.label} className="sp-group">
                <div className="sp-month">{m.label}</div>
                {m.rows.map((r) => <FactureRow key={r.ref} r={r} d={d} perspective={perspective} />)}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANTE 3 — « Relevé » (bandeau solde + tableau)
   ───────────────────────────────────────────────────────────── */
function VariantLedger({ d, perspective }) {
  const flat = d.months.flatMap((m) => m.rows);
  return (
    <div className="sp-app v-ledger">
      <SPHeader d={d} />
      <div className="sp-ledger-body">
        <div className="sp-ledger-strip">
          <div className="sp-ledger-bal">
            <BalanceBlock d={d} big={44} />
          </div>
          <div className="sp-ledger-stats">
            <div className="sp-ledger-stat seq-block">
              <span className="sp-stat-l"><Icon name="lock" size={12} stroke={2} style={{ display: "inline-block", verticalAlign: "-1px" }} /> En séquestre</span>
              <span className="sp-stat-n">{fmt(d.seq)} <span className="cur">€</span></span>
              <span className="sp-stat-s">{d.seqSub}</span>
            </div>
            <div className="sp-ledger-stat">
              <span className="sp-stat-l">{d.yearLabel}</span>
              <span className="sp-stat-n">{fmt(d.year)} <span className="cur">€</span></span>
              <span className="sp-stat-s">{d.yearSub}</span>
            </div>
            <CtaButton d={d} />
          </div>
        </div>

        <div className="sp-card sp-ledger-tblwrap">
          <div className="sp-ledger-tbl-hd">
            <span className="sp-h">Factures <span className="sp-h-sub">· 6 documents</span></span>
            <div className="sp-search">
              <Icon name="search" size={14} stroke={2} style={{ color: "var(--jim-muted)" }} />
              <input placeholder="Rechercher une facture…" readOnly />
            </div>
          </div>
          <table className="sp-tbl">
            <thead>
              <tr>
                <th>{perspective === "titulaire" ? "Remplaçant" : "Cabinet"}</th>
                <th>Référence</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {flat.map((r) => {
                const initials = r.who.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
                return (
                  <tr key={r.ref}>
                    <td>
                      <div className="sp-td-who">
                        <div className="sp-row-ico sm">{initials}</div>
                        <div>
                          <div className="sp-row-t">{r.who}</div>
                          <div className="sp-row-s">{r.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="sp-ref">{r.ref}</span></td>
                    <td><span className="sp-td-date">{r.date}</span></td>
                    <td><StatusPill status={r.status} perspective={perspective} /></td>
                    <td><Money amount={r.amount} incoming={d.incoming} /></td>
                    <td>
                      <button className="sp-pdf" title={"Télécharger " + r.ref} aria-label="Télécharger le PDF">
                        <Icon name="download" size={15} stroke={2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SP_DATA, getData, fmt, Icon, SPHeader, StatusPill, Money,
  FactureRow, BalanceBlock, SeqLine, CtaButton,
  VariantSolde, VariantSplit, VariantLedger,
});
