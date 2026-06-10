/* ============================================================
   JIM Menu — Shared helpers
   - Lucide icons (inline SVG paths)
   - User states : anon / titulaire / remplacant
   - Menu sections per state
   ============================================================ */

const JIcon = ({ name, size = 18, stroke = 1.8, style = {} }) => {
  const p = JIcon.paths[name];
  if (!p) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0, ...style }}>
      {p}
    </svg>
  );
};
JIcon.paths = {
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  msg: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  wallet: <><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M14 11h8v6h-8a3 3 0 0 1 0-6z"/><circle cx="16" cy="14" r="1.2" fill="currentColor"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  chev: <><polyline points="6 9 12 15 18 9"/></>,
  chevR: <><polyline points="9 6 15 12 9 18"/></>,
  search: <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  check: <><polyline points="20 6 9 17 4 12"/></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  help: <><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  arrowUp: <><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>,
  arrowDown: <><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></>,
  sparkle: <><path d="M12 3l1.9 5.1 5.1 1.9-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></>,
  filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  stetho: <><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></>,
  globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  star: <><polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"/></>,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></>,
};

/* ─── User states ───────────────────────────────── */
const USER_STATES = {
  anon: {
    state: "anon",
    name: "Visiteur",
    role: "Non connecté",
    initials: "?",
    rppsVerified: false,
    notifs: { messages: 0, total: 0 },
    eyebrow: "VISITEUR",
    location: "France",
  },
  titulaire: {
    state: "titulaire",
    name: "Dr Camille Moreau",
    role: "Titulaire",
    initials: "CM",
    rppsVerified: true,
    notifs: { messages: 3, total: 7 },
    eyebrow: "TITULAIRE · PARIS 11ᵉ",
    location: "Paris 11ᵉ",
  },
  remplacant: {
    state: "remplacant",
    name: "Léo Vasseur",
    role: "Remplaçant",
    initials: "LV",
    rppsVerified: true,
    notifs: { messages: 2, total: 4 },
    eyebrow: "REMPLAÇANT · 50 KM PARIS",
    location: "Île-de-France",
  },
};

/* Default current user (overridden by app shell at runtime) */
let USER = USER_STATES.titulaire;

/* Menu sections per state */
const MENU_SECTIONS_BY_STATE = {
  anon: [
    {
      label: "Découvrir",
      items: [
        { id: "comment",    icon: "sparkle",   title: "Comment ça marche", sub: "RPPS, contrat, paiement séquestre" },
        { id: "remplacant", icon: "stetho",    title: "Espace remplaçant", sub: "Trouver des missions près de chez toi" },
        { id: "titulaire",  icon: "briefcase", title: "Espace titulaire",  sub: "Publier une annonce en 3 minutes" },
      ],
    },
    {
      label: "Compte",
      items: [
        { id: "login",  icon: "user",  title: "Se connecter",   sub: "Avec ton numéro RPPS",       cta: true },
        { id: "signup", icon: "plus",  title: "Créer un compte", sub: "Gratuit · vérifié sous 24h" },
        { id: "help",   icon: "help",  title: "Aide & contact",  sub: "FAQ et support" },
      ],
    },
  ],
  titulaire: [
    {
      label: "Activité",
      items: [
        { id: "publier",   icon: "plus",      title: "Publier une annonce", sub: "Trouver un remplaçant en < 48h", cta: true },
        { id: "annonces",  icon: "briefcase", title: "Mes annonces",        sub: "3 en cours · 1 pourvue",         badge: "3" },
        { id: "messages",  icon: "msg",       title: "Messagerie",          sub: "3 nouveaux messages",            badge: "3", urgent: true },
        { id: "candidats", icon: "user",      title: "Candidatures",        sub: "9 à examiner" },
      ],
    },
    {
      label: "Gestion",
      items: [
        { id: "paiements", icon: "wallet",    title: "Paiements & facturation", sub: "2 virements en attente" },
        { id: "contrat",   icon: "doc",       title: "Mes contrats",            sub: "1 prêt à signer" },
        { id: "compte",    icon: "user",      title: "Mon compte",              sub: "Profil, RPPS, cabinet" },
        { id: "params",    icon: "settings",  title: "Paramètres",              sub: "Notifs, langue, sécurité" },
      ],
    },
  ],
  remplacant: [
    {
      label: "Missions",
      items: [
        { id: "carte",     icon: "pin",       title: "Carte des missions", sub: "12 dans un rayon de 50 km",      cta: true },
        { id: "favoris",   icon: "star",      title: "Mes favoris",        sub: "4 annonces sauvegardées",        badge: "4" },
        { id: "candidats", icon: "briefcase", title: "Mes candidatures",   sub: "2 en attente · 1 acceptée",      badge: "2" },
        { id: "messages",  icon: "msg",       title: "Messagerie",         sub: "2 conversations actives",        badge: "2", urgent: true },
      ],
    },
    {
      label: "Profil",
      items: [
        { id: "dispos",    icon: "cal",       title: "Mes disponibilités", sub: "12 jours libres ce mois" },
        { id: "paiements", icon: "wallet",    title: "Mes rétrocessions",  sub: "1 240 € ce mois" },
        { id: "compte",    icon: "user",      title: "Mon profil",         sub: "RPPS, spécialités, CV" },
        { id: "params",    icon: "settings",  title: "Paramètres",         sub: "Rayon, alertes, langue" },
      ],
    },
  ],
};

/* Set the active user — called by the app shell on tweak change */
function setActiveUser(stateKey) {
  USER = USER_STATES[stateKey] || USER_STATES.titulaire;
  window.USER = USER;
  return USER;
}

/* Avatar */
const Avatar = ({ size = 36, initials, withRing = false, style = {}, anon = false }) => {
  const u = window.USER || USER;
  const txt = initials || u.initials;
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 9999,
      background: anon
        ? "linear-gradient(135deg, var(--jim-beige-mid) 0%, var(--jim-beige-dark) 100%)"
        : "linear-gradient(135deg, var(--jim-primary) 0%, var(--jim-accent) 100%)",
      color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, lineHeight: 1,
      fontFamily: "var(--font-sans)",
      letterSpacing: "0.02em",
      boxShadow: withRing ? "0 0 0 3px var(--jim-background), 0 0 0 5px var(--jim-primary-soft)" : "none",
      flexShrink: 0,
      transition: "box-shadow .2s, background .25s",
      ...style,
    }}>{txt}</div>
  );
};

const PulseDot = ({ size = 8, color = "var(--jim-primary)" }) => (
  <span style={{
    position: "relative", display: "inline-block",
    width: size, height: size, borderRadius: 999,
    background: color,
    animation: "pulseDot 2s ease-in-out infinite",
  }}/>
);

const CountBadge = ({ value, tone = "primary", size = "md" }) => {
  const bg = tone === "primary" ? "var(--jim-primary)"
           : tone === "success" ? "var(--jim-success)"
           : "var(--jim-muted)";
  const s = size === "sm" ? { h: 16, f: 10, px: 5 } : { h: 20, f: 11, px: 7 };
  return (
    <span style={{
      background: bg, color: "#fff", fontWeight: 800,
      fontSize: s.f, lineHeight: 1,
      height: s.h, minWidth: s.h, padding: `0 ${s.px}px`,
      borderRadius: 999, display: "inline-flex",
      alignItems: "center", justifyContent: "center",
    }}>{value}</span>
  );
};

const RppsChip = ({ compact = false }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: compact ? "2px 7px" : "3px 9px",
    borderRadius: 999,
    background: "var(--jim-success-bg)",
    color: "#2d5e36",
    fontSize: compact ? 10 : 11, fontWeight: 700,
    letterSpacing: ".02em",
  }}>
    <JIcon name="check" size={compact ? 10 : 12} stroke={2.5}/>
    RPPS vérifié
  </span>
);

/* ALL_ITEMS getter — recomputed on user change */
function getMenuSections() {
  const u = window.USER || USER;
  return MENU_SECTIONS_BY_STATE[u.state] || MENU_SECTIONS_BY_STATE.titulaire;
}
function getAllItems() {
  return getMenuSections().flatMap(s => s.items.map(it => ({ ...it, section: s.label })));
}

Object.assign(window, {
  JIcon, USER, USER_STATES, setActiveUser,
  MENU_SECTIONS_BY_STATE, getMenuSections, getAllItems,
  Avatar, PulseDot, CountBadge, RppsChip,
});
