/* ============================================================
   JIM Menu — Extra features (used by Variant A dropdown)
   - DropdownHeaderA     : gradient header with integrated status pill
   - InboxPreview        : 3 messages with sender avatar, time, quick reply
   - LiveMissions        : mini map (rempl) — 3 pings + count
   - OnboardingProgress  : "Complète ton profil — 60%" for anon/new
   - ThemeToggle         : Light · Dark · Auto segmented
   - LanguagePicker      : FR / EN segmented
   - MenuFooter          : compact theme + lang + help row
   ============================================================ */

const STATUS_OPTIONS = [
  { id: "dispo",    label: "Disponible", color: "#3aa86b", dot: "#46c97f" },
  { id: "occupe",   label: "Occupé",     color: "#d8a13e", dot: "#f5b86a" },
  { id: "vacances", label: "Vacances",   color: "#9b8a78", dot: "#bca896" },
];

/* Dropdown header — anon OR logged-in (with status pill integrated) */
const DropdownHeaderA = ({ isAnon, u, status, onStatus }) => {
  const [openStatus, setOpenStatus] = React.useState(false);
  const cur = STATUS_OPTIONS.find(s => s.id === status) || STATUS_OPTIONS[0];

  if (isAnon) {
    return (
      <div style={{
        position: "relative", overflow: "hidden",
        padding: "20px 18px 22px",
        borderRadius: 18,
        background: "linear-gradient(135deg, #ff7c5c 0%, #e06245 70%, #b07824 130%)",
        color: "#fff",
        marginBottom: 10,
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: -40, right: -30,
          width: 140, height: 140, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 65%)",
          animation: "blobFloat 8s ease-in-out infinite",
        }}/>
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".22em", margin: 0, opacity: .85 }}>BIENVENUE</p>
          <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, margin: "6px 0 4px" }}>
            Le cabinet,&nbsp;
            <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500, color: "#fff", opacity: .92 }}>enfin simple</em>.
          </p>
          <p style={{ fontSize: 12, opacity: .85, margin: 0 }}>RPPS · contrat · paiement séquestre.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "relative", overflow: "visible",
      padding: "18px 16px 16px",
      borderRadius: 18,
      background: "linear-gradient(135deg, #ff7c5c 0%, #e06245 70%, #b07824 130%)",
      color: "#fff",
      marginBottom: 10,
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: -40, right: -30,
        width: 140, height: 140, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 65%)",
        animation: "blobFloat 8s ease-in-out infinite",
        pointerEvents: "none",
        borderTopRightRadius: 18, overflow: "hidden",
      }}/>
      {/* eyebrow line */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".22em", margin: 0, opacity: .85 }}>{u.eyebrow}</p>
        {/* Status pill — integrated, glassy */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setOpenStatus(o => !o)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px 4px 9px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.22)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "#fff",
                    fontSize: 10.5, fontWeight: 800,
                    letterSpacing: ".04em",
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: cur.dot,
              boxShadow: `0 0 0 2px rgba(255,255,255,0.4)`,
            }}/>
            {cur.label}
            <JIcon name="chev" size={9} stroke={2.5}/>
          </button>
          {openStatus && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0,
              width: 160,
              background: "var(--jim-surface)",
              border: "1px solid var(--jim-beige-mid)",
              borderRadius: 12, padding: 4,
              boxShadow: "var(--jim-shadow-lg)",
              zIndex: 5,
              animation: "dropdownIn .18s ease-out both",
              color: "var(--jim-text)",
            }}>
              {STATUS_OPTIONS.map(s => (
                <button key={s.id} onClick={() => { onStatus(s.id); setOpenStatus(false); }}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 10px", borderRadius: 8,
                          background: status === s.id ? "var(--jim-surface-alt)" : "transparent",
                          border: 0, cursor: "pointer", textAlign: "left",
                        }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }}/>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: "var(--jim-text)" }}>{s.label}</span>
                  {status === s.id && <JIcon name="check" size={12} stroke={2.5} style={{ color: "var(--jim-primary)" }}/>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Identity */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <Avatar size={44} style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.35)" }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", margin: 0,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</p>
          <p style={{ fontSize: 11, opacity: .9, margin: "3px 0 0", fontWeight: 600 }}>
            Bonjour, <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500 }}>{u.name.split(" ").slice(-1)[0]}</em>.
          </p>
        </div>
        <button title="Voir mon profil"
                style={{
                  width: 30, height: 30, borderRadius: 10,
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.32)",
                  color: "#fff",
                  display: "grid", placeItems: "center", cursor: "pointer",
                  flexShrink: 0,
                }}>
          <JIcon name="chevR" size={13} stroke={2.4}/>
        </button>
      </div>
    </div>
  );
};

/* Inbox preview */
const INBOX = [
  { from: "Nadia B.", initials: "NB", color: "#e0a07e",
    msg: "Je peux le 12-14 mai si ça te va — RPPS validé.", time: "2 min", unread: true },
  { from: "Cabinet Bastille", initials: "CB", color: "#7e9ce0",
    msg: "Contrat prêt à signer, je te l'envoie ce soir.", time: "1 h", unread: true },
  { from: "Léo V.", initials: "LV", color: "#85b074",
    msg: "Merci pour la réco, c'était nickel.", time: "3 h", unread: false },
];

const InboxPreview = () => (
  <div style={{ padding: "2px 0 4px" }}>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 12px 4px",
    }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: "var(--jim-muted)",
                  textTransform: "uppercase", letterSpacing: ".18em", margin: 0 }}>
        Messages <span style={{ color: "var(--jim-primary)" }}>· 2 non lus</span>
      </p>
      <a style={{ fontSize: 10.5, fontWeight: 700, color: "var(--jim-primary)",
                  textTransform: "uppercase", letterSpacing: ".06em", cursor: "pointer" }}>
        Tout voir
      </a>
    </div>
    {INBOX.slice(0, 2).map((m, i) => (
      <a key={i} style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "8px 12px", borderRadius: 12,
        cursor: "pointer", textDecoration: "none",
        position: "relative",
        animation: `itemIn .3s cubic-bezier(.16,1,.3,1) ${0.05 + i * 0.04}s both`,
      }}
         onMouseEnter={e => e.currentTarget.style.background = "var(--jim-surface-alt)"}
         onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: m.color, color: "#fff",
            display: "grid", placeItems: "center",
            fontSize: 11, fontWeight: 800,
          }}>{m.initials}</div>
          {m.unread && (
            <span style={{
              position: "absolute", top: -2, right: -2,
              width: 9, height: 9, borderRadius: "50%",
              background: "var(--jim-primary)",
              border: "2px solid var(--jim-surface)",
            }}/>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <p style={{ fontSize: 12.5, fontWeight: m.unread ? 800 : 600, color: "var(--jim-text)",
                        margin: 0, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {m.from}
            </p>
            <span style={{ fontSize: 10, color: "var(--jim-muted)", fontWeight: 600, flexShrink: 0 }}>{m.time}</span>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--jim-muted)", margin: "1px 0 0",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      fontWeight: m.unread ? 600 : 500, lineHeight: 1.35 }}>{m.msg}</p>
        </div>
      </a>
    ))}
  </div>
);

/* Live missions mini map (remplaçant) */
const LiveMissions = () => {
  const pings = [
    { x: 28, y: 45, label: "Bastille",   urg: true },
    { x: 62, y: 32, label: "Charonne",   urg: false },
    { x: 48, y: 68, label: "Parmentier", urg: false },
  ];
  return (
    <div style={{
      padding: "10px 12px",
      background: "linear-gradient(135deg, #faf2e6 0%, #f5e9d6 100%)",
      borderRadius: 14, marginBottom: 8,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PulseDot size={6}/>
          <p style={{ fontSize: 10, fontWeight: 800, color: "var(--jim-text)",
                      textTransform: "uppercase", letterSpacing: ".14em", margin: 0 }}>
            EN DIRECT · 3 missions
          </p>
        </div>
        <a style={{ fontSize: 10.5, fontWeight: 800, color: "var(--jim-primary)", cursor: "pointer" }}>
          Carte →
        </a>
      </div>
      {/* Mini-map */}
      <div style={{
        position: "relative", height: 92, borderRadius: 10,
        background: "var(--jim-surface)",
        border: "1px solid var(--jim-beige-mid)",
        overflow: "hidden",
      }}>
        {/* Faux roads */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .6 }}>
          <path d="M0 60 Q 40 50 60 65 T 100 55" stroke="var(--jim-beige-mid)" strokeWidth="1.5" fill="none"/>
          <path d="M30 0 L 35 100" stroke="var(--jim-beige-mid)" strokeWidth="1" fill="none"/>
          <path d="M70 0 L 65 100" stroke="var(--jim-beige-mid)" strokeWidth="1" fill="none"/>
          <path d="M0 25 L 100 30" stroke="var(--jim-beige-mid)" strokeWidth="1" fill="none"/>
        </svg>
        {/* You marker */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: "var(--jim-text)",
          border: "3px solid var(--jim-surface)",
          boxShadow: "0 0 0 2px var(--jim-text)",
          zIndex: 2,
        }}/>
        {/* Pings */}
        {pings.map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            transform: "translate(-50%, -50%)",
          }}>
            <span style={{
              position: "absolute", inset: -4,
              borderRadius: "50%",
              background: p.urg ? "rgba(255,124,92,0.3)" : "rgba(143,107,52,0.3)",
              animation: `pingMap 2.5s ease-out infinite ${i * 0.4}s`,
            }}/>
            <span style={{
              position: "relative", display: "block",
              width: 10, height: 10, borderRadius: "50%",
              background: p.urg ? "var(--jim-primary)" : "var(--jim-accent)",
              border: "2px solid var(--jim-surface)",
            }}/>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10.5, color: "var(--jim-muted)",
                  margin: "6px 2px 0", fontWeight: 600 }}>
        Plus proche : <strong style={{ color: "var(--jim-text)" }}>Bastille · 1,2 km</strong>
      </p>
    </div>
  );
};

/* Onboarding progress (anon / nouveau compte) */
const OnboardingProgress = ({ pct = 60 }) => {
  const steps = [
    { label: "Email vérifié", done: true },
    { label: "RPPS validé",   done: true },
    { label: "CV / spécialités", done: true },
    { label: "Photo de profil", done: false },
    { label: "Premier message",  done: false },
  ];
  return (
    <div style={{
      padding: "12px 14px",
      background: "linear-gradient(135deg, var(--jim-primary-pale) 0%, #fdf2e2 100%)",
      borderRadius: 14, marginBottom: 8,
      border: "1px solid rgba(255,124,92,0.18)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--jim-text)", margin: 0 }}>
          Complète ton profil
        </p>
        <span style={{
          fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 600,
          fontSize: 18, color: "var(--jim-primary)",
          letterSpacing: "-0.02em",
        }}>{pct}%</span>
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: "rgba(58,31,8,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg, var(--jim-primary), var(--jim-accent))",
          borderRadius: 3,
          transition: "width .6s cubic-bezier(.16,1,.3,1)",
        }}/>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
        {steps.map((s, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, fontWeight: 700,
            padding: "2px 7px", borderRadius: 999,
            background: s.done ? "rgba(58,142,89,0.15)" : "var(--jim-surface)",
            color: s.done ? "var(--jim-success)" : "var(--jim-muted)",
            border: "1px solid " + (s.done ? "transparent" : "var(--jim-beige-mid)"),
            textDecoration: s.done ? "none" : "none",
          }}>
            {s.done ? <JIcon name="check" size={9} stroke={3}/> : <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--jim-muted)" }}/>}
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* Theme toggle */
const ThemeToggle = ({ value = "light", onChange }) => {
  const opts = [
    { id: "light", icon: "sparkle" },
    { id: "dark",  icon: "shield" },
    { id: "auto",  icon: "globe" },
  ];
  const labels = { light: "Clair", dark: "Sombre", auto: "Auto" };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      padding: 2,
      background: "var(--jim-surface-alt)",
      borderRadius: 999,
      border: "1px solid var(--jim-beige-mid)",
    }}>
      {opts.map(o => {
        const active = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} title={labels[o.id]}
                  style={{
                    border: 0, background: active ? "var(--jim-surface)" : "transparent",
                    color: active ? "var(--jim-text)" : "var(--jim-muted)",
                    padding: "4px 9px", borderRadius: 999,
                    fontSize: 10.5, fontWeight: 700, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 4,
                    boxShadow: active ? "var(--jim-shadow-sm)" : "none",
                    transition: "background .15s, color .15s",
                  }}>
            <JIcon name={o.icon} size={11} stroke={2}/>
            {labels[o.id]}
          </button>
        );
      })}
    </div>
  );
};

const LanguagePicker = ({ value = "fr", onChange }) => (
  <div style={{
    display: "inline-flex", alignItems: "center",
    padding: 2,
    background: "var(--jim-surface-alt)",
    borderRadius: 999,
    border: "1px solid var(--jim-beige-mid)",
  }}>
    {[{id:"fr",l:"FR"},{id:"en",l:"EN"}].map(o => {
      const active = value === o.id;
      return (
        <button key={o.id} onClick={() => onChange(o.id)}
                style={{
                  border: 0, background: active ? "var(--jim-surface)" : "transparent",
                  color: active ? "var(--jim-text)" : "var(--jim-muted)",
                  padding: "4px 10px", borderRadius: 999,
                  fontSize: 10.5, fontWeight: 800, cursor: "pointer",
                  fontFamily: "var(--font-mono)", letterSpacing: ".06em",
                  boxShadow: active ? "var(--jim-shadow-sm)" : "none",
                  transition: "background .15s, color .15s",
                }}>
          {o.l}
        </button>
      );
    })}
  </div>
);

/* Footer line — compact, 2 zones, no overflow */
const MenuFooter = ({ theme, onTheme, lang, onLang }) => (
  <div style={{
    display: "flex", flexDirection: "column", gap: 6,
    padding: "10px 8px 4px",
    borderTop: "1px solid var(--jim-beige-light)",
    marginTop: 4,
  }}>
    {/* Row 1 — theme (left, takes remaining) + lang (right, fixed) */}
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <ThemeToggle value={theme} onChange={onTheme}/>
      <div style={{ flex: 1 }}/>
      <LanguagePicker value={lang} onChange={onLang}/>
    </div>
    {/* Row 2 — help link + ⌘K shortcut */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <a style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 8px", borderRadius: 10,
        color: "var(--jim-muted)", fontSize: 11.5, fontWeight: 700,
        cursor: "pointer", textDecoration: "none",
        transition: "background .15s, color .15s",
      }}
         onMouseEnter={e => { e.currentTarget.style.background = "var(--jim-surface-alt)"; e.currentTarget.style.color = "var(--jim-text)"; }}
         onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--jim-muted)"; }}>
        <JIcon name="help" size={12} stroke={2}/>
        Aide
      </a>
      <div style={{ flex: 1 }}/>
      <button style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 10px", borderRadius: 10,
        background: "var(--jim-surface-alt)",
        border: "1px solid var(--jim-beige-mid)",
        color: "var(--jim-text-body)", fontSize: 11, fontWeight: 700,
        cursor: "pointer",
        transition: "background .15s, border-color .15s",
      }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--jim-primary-pale)"; e.currentTarget.style.borderColor = "var(--jim-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--jim-surface-alt)"; e.currentTarget.style.borderColor = "var(--jim-beige-mid)"; }}>
        <kbd style={{
          fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 700,
          padding: "1px 5px", borderRadius: 4,
          background: "var(--jim-surface)",
          border: "1px solid var(--jim-beige-mid)",
          color: "var(--jim-primary)",
        }}>⌘K</kbd>
        Rechercher
      </button>
    </div>
  </div>
);

Object.assign(window, {
  STATUS_OPTIONS,
  DropdownHeaderA, InboxPreview, LiveMissions,
  OnboardingProgress, ThemeToggle, LanguagePicker, MenuFooter,
});
