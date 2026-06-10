/* ============================================================
   JIM Header — 4 animated variants
   - A: Pill nav (sliding indicator) + glass shell  → reference fidèle
   - B: Underline magnétique + caret morph
   - C: Search command palette (Cmd/Ctrl K)
   - D: Compact "dock" with hover-expand items
   ============================================================ */

const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

/* ---------------------------- Logo (text wordmark) ---------------------------- */
const JimLogo = ({ size = 28 }) => {
  const [bounce, setBounce] = useState(false);
  return (
    <button
      onMouseEnter={() => setBounce(true)}
      onAnimationEnd={() => setBounce(false)}
      aria-label="JIM — Accueil"
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.06em",
        color: "var(--jim-primary)",
        display: "inline-flex",
        alignItems: "center",
        animation: bounce ? "wordmarkBounce .55s var(--jim-ease-spring)" : "none",
      }}
    >
      jim
      <span style={{
        width: 6, height: 6, marginLeft: 4, marginBottom: -4,
        background: "var(--jim-primary)", borderRadius: 999,
      }}/>
    </button>
  );
};

/* ---------------------------- Bell with badge ---------------------------- */
const Bell = ({ count = 0, onClick }) => (
  <button onClick={onClick} aria-label="Notifications" style={{
    position: "relative", width: 40, height: 40, borderRadius: 999,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    color: "var(--jim-text)",
    transition: "background .2s, transform .2s",
  }}
  onMouseEnter={e => e.currentTarget.style.background = "var(--jim-beige-light)"}
  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <JIcon name="bell" size={20} stroke={1.8}/>
    {count > 0 && (
      <>
        <span style={{
          position: "absolute", top: 8, right: 8,
          width: 8, height: 8, borderRadius: 999,
          background: "var(--jim-primary)",
          boxShadow: "0 0 0 2px var(--jim-surface)",
        }}/>
        <span style={{
          position: "absolute", top: 4, right: 4,
          width: 16, height: 16, borderRadius: 999,
          background: "var(--jim-primary)",
          opacity: 0.5,
          animation: "pingRing 2.2s ease-out infinite",
        }}/>
      </>
    )}
  </button>
);

const ChatIcon = ({ count = 0, onClick }) => (
  <button onClick={onClick} aria-label="Messagerie" style={{
    position: "relative", width: 40, height: 40, borderRadius: 999,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    color: "var(--jim-text)", transition: "background .2s",
  }}
  onMouseEnter={e => e.currentTarget.style.background = "var(--jim-beige-light)"}
  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <JIcon name="msg" size={20} stroke={1.8}/>
    {count > 0 && (
      <span style={{
        position: "absolute", top: 9, right: 9,
        width: 9, height: 9, borderRadius: 999,
        background: "var(--jim-primary)",
        boxShadow: "0 0 0 2px var(--jim-surface)",
        animation: "pulseDot 2s ease-in-out infinite",
      }}/>
    )}
  </button>
);

/* ---------------------------- Avatar w/ menu ---------------------------- */
const AvatarMenu = ({ open, setOpen }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, [open, setOpen]);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} aria-label="Mon compte" style={{
        borderRadius: 999, padding: 2,
        transition: "box-shadow .2s, transform .2s",
        boxShadow: open ? "0 0 0 3px var(--jim-primary-soft)" : "0 0 0 0 transparent",
      }}>
        <Avatar size={36}/>
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 10px)",
          width: 264, padding: 8,
          background: "var(--jim-surface)",
          borderRadius: 20, border: "1px solid var(--jim-beige-mid)",
          boxShadow: "var(--jim-shadow-xl)",
          animation: "drop .22s var(--jim-ease-fade)",
          zIndex: 80,
        }}>
          <div style={{ padding: "10px 12px 12px", display: "flex", gap: 10, alignItems: "center" }}>
            <Avatar size={40}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--jim-text)" }}>{(window.USER||USER).name}</div>
              <div style={{ marginTop: 2 }}><RppsChip compact/></div>
            </div>
          </div>
          <div style={{ height: 1, background: "var(--jim-beige-mid)", margin: "4px 4px" }}/>
          {[
            { ic: "user",     t: "Mon profil" },
            { ic: "wallet",   t: "Paiements & facturation" },
            { ic: "settings", t: "Paramètres" },
            { ic: "help",     t: "Aide & contact" },
          ].map((r, i) => (
            <button key={r.t} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 12, textAlign: "left",
              color: "var(--jim-text-body)", fontWeight: 500, fontSize: 14,
              animation: `itemUp .26s var(--jim-ease-fade) both`,
              animationDelay: `${i*30}ms`,
              transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--jim-beige-light)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <JIcon name={r.ic} size={16} stroke={1.8}/>{r.t}
            </button>
          ))}
          <div style={{ height: 1, background: "var(--jim-beige-mid)", margin: "4px 4px" }}/>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 12, textAlign: "left",
            color: "var(--jim-destructive)", fontWeight: 600, fontSize: 14,
            transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--jim-destructive-bg)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <JIcon name="logout" size={16} stroke={1.8}/>Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------------------- Items ---------------------------- */
const NAV = ["Missions", "Remplaçants", "Messagerie", "Paiements"];

/* ============================================================
   VARIANT A — Pill nav (sliding indicator)
   ============================================================ */
const HeaderA = ({ active, setActive }) => {
  const refs = useRef({});
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (!el) return;
    const parent = el.offsetParent;
    setPill({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
  }, [active]);

  return (
    <header style={shell}>
      <div style={inner}>
        <nav style={{ position: "relative", display: "flex", gap: 4, marginLeft: 14 }}>
          <span style={{
            position: "absolute", top: 0, left: 0, height: "100%",
            width: pill.w, transform: `translateX(${pill.x}px)`,
            background: "var(--jim-primary-pale)",
            borderRadius: 999,
            transition: pill.ready ? "transform .42s var(--jim-ease-spring), width .42s var(--jim-ease-spring)" : "none",
            zIndex: 0,
          }}/>
          {NAV.map((it) => {
            const on = it === active;
            return (
              <button key={it} ref={el => refs.current[it] = el}
                onClick={() => setActive(it)}
                style={{
                  position: "relative", zIndex: 1,
                  padding: "10px 18px", borderRadius: 999,
                  fontSize: 15, fontWeight: on ? 700 : 600,
                  color: on ? "var(--jim-primary)" : "var(--jim-text)",
                  transition: "color .25s",
                }}>
                {it}
              </button>
            );
          })}
        </nav>
        <div style={spacer}/>
        <SearchPill/>
        <AvatarMenuWrap/>
      </div>
    </header>
  );
};

/* ============================================================
   VARIANT B — Magnetic underline w/ floating eyebrow caption
   ============================================================ */
const HeaderB = ({ active, setActive }) => {
  const refs = useRef({});
  const [bar, setBar] = useState({ x: 0, w: 0, ready: false });
  const [hover, setHover] = useState(null);

  const update = (key) => {
    const el = refs.current[key];
    if (!el) return;
    setBar({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
  };

  useLayoutEffect(() => { update(hover || active); }, [active, hover]);

  const SUBS = {
    "Missions":    "12 nouvelles · 50 km",
    "Remplaçants": "Trouve un kiné vérifié RPPS",
    "Messagerie":  "3 conversations actives",
    "Paiements":   "1 240 € ce mois",
  };

  return (
    <header style={{ ...shell, padding: "10px 18px" }}>
      <div style={inner}>
        <nav style={{ position: "relative", display: "flex", gap: 4, marginLeft: 18 }}
             onMouseLeave={() => setHover(null)}>
          {NAV.map((it) => {
            const on = it === active;
            const isHover = hover === it;
            return (
              <button key={it} ref={el => refs.current[it] = el}
                onMouseEnter={() => setHover(it)}
                onClick={() => setActive(it)}
                style={{
                  position: "relative",
                  padding: "12px 14px 14px", borderRadius: 12,
                  fontSize: 15, fontWeight: on || isHover ? 700 : 600,
                  color: on ? "var(--jim-text)" : isHover ? "var(--jim-text)" : "var(--jim-muted)",
                  transition: "color .2s, font-weight .2s",
                }}>
                <span>{it}</span>
                <span style={{
                  position: "absolute", left: 14, right: 14, bottom: 6,
                  height: 2, borderRadius: 2,
                  background: "var(--jim-primary)",
                  opacity: on ? 1 : 0,
                  transition: "opacity .2s",
                }}/>
              </button>
            );
          })}
          <span aria-hidden style={{
            position: "absolute", left: 0, bottom: -2,
            transform: `translateX(${bar.x}px)`,
            width: bar.w, height: 0,
          }}>
            <span style={{
              display: "block", margin: "0 14px", height: 2,
              borderRadius: 2,
              background: "var(--jim-primary)",
              transform: bar.ready ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left center",
              transition: "transform .35s var(--jim-ease-spring), width .35s var(--jim-ease-spring)",
              opacity: hover ? 1 : 0,
            }}/>
          </span>
        </nav>
        <div style={{
          marginLeft: 14,
          fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--jim-muted)",
          transition: "opacity .2s",
          opacity: hover ? 1 : 0.6,
        }}>
          {SUBS[hover || active]}
        </div>
        <div style={spacer}/>
        <SearchPill compact/>
        <AvatarMenuWrap/>
      </div>
    </header>
  );
};

/* ============================================================
   VARIANT C — Command palette search (⌘K) — expanding pill
   ============================================================ */
const HeaderC = ({ active, setActive }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 80); }, [open]);

  const results = useMemo(() => {
    const all = getAllItems();
    if (!q.trim()) return all.slice(0, 6);
    return all.filter(i => (i.title + " " + (i.sub||"")).toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  }, [q]);

  return (
    <header style={shell}>
      <div style={inner}>
        <nav style={{ display: "flex", gap: 2, marginLeft: 14 }}>
          {NAV.map((it) => {
            const on = it === active;
            return (
              <button key={it} onClick={() => setActive(it)}
                style={{
                  position: "relative",
                  padding: "10px 16px", borderRadius: 999,
                  fontSize: 15, fontWeight: on ? 700 : 600,
                  color: on ? "var(--jim-text)" : "var(--jim-text-body)",
                  transition: "color .2s, background .2s",
                }}
                onMouseEnter={e => !on && (e.currentTarget.style.background = "var(--jim-beige-light)")}
                onMouseLeave={e => !on && (e.currentTarget.style.background = "transparent")}>
                {it}
                {on && <span style={{
                  position: "absolute", left: "50%", bottom: 2,
                  transform: "translateX(-50%)",
                  width: 6, height: 6, borderRadius: 999,
                  background: "var(--jim-primary)",
                }}/>}
              </button>
            );
          })}
        </nav>
        <div style={spacer}/>
        <button onClick={() => setOpen(true)} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "10px 14px", borderRadius: 999,
          background: "var(--jim-text)", color: "#fff",
          fontWeight: 600, fontSize: 14,
          boxShadow: "0 0 0 3px rgba(40,108,255,0.55), var(--jim-shadow-md)",
          transition: "transform .18s, box-shadow .25s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
          <JIcon name="search" size={16} stroke={2}/>
          <span style={{ opacity: 0.9 }}>Rechercher</span>
          <kbd style={{
            background: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 11, fontWeight: 700,
            padding: "2px 6px", borderRadius: 6,
            marginLeft: 4, fontFamily: "var(--font-mono)",
          }}>⌘K</kbd>
        </button>
        <AvatarMenuWrap/>
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: "fixed", inset: 0, background: "rgba(58,31,8,0.45)",
            backdropFilter: "blur(6px)", zIndex: 90,
            animation: "drop .2s ease-out",
          }}/>
          <div role="dialog" style={{
            position: "fixed", top: 80, left: "50%",
            transform: "translateX(-50%)",
            width: "min(640px, 92vw)",
            background: "var(--jim-surface)",
            borderRadius: 22, border: "1px solid var(--jim-beige-mid)",
            boxShadow: "var(--jim-shadow-xl)",
            zIndex: 91, overflow: "hidden",
            animation: "drop .28s var(--jim-ease-spring)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
                          borderBottom: "1px solid var(--jim-beige-mid)" }}>
              <JIcon name="search" size={18} stroke={2} style={{ color: "var(--jim-muted)" }}/>
              <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
                placeholder="Mission, remplaçant, message, paiement…"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontFamily: "inherit", fontSize: 16, color: "var(--jim-text)",
                }}/>
              <kbd style={kbdS}>Esc</kbd>
            </div>
            <div style={{ maxHeight: 340, overflow: "auto", padding: 8 }}>
              {results.length === 0 && (
                <div style={{ padding: 24, textAlign: "center", color: "var(--jim-muted)" }}>
                  Aucun résultat pour « {q} »
                </div>
              )}
              {results.map((r, i) => (
                <button key={r.id+i} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 12, textAlign: "left",
                  animation: `itemUp .22s var(--jim-ease-fade) both`,
                  animationDelay: `${i*22}ms`,
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--jim-beige-light)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: "var(--jim-primary-pale)",
                    color: "var(--jim-primary)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <JIcon name={r.icon} size={16} stroke={2}/>
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--jim-text)", fontSize: 14 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: "var(--jim-muted)" }}>{r.sub}</div>
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--jim-muted)",
                                 textTransform: "uppercase", letterSpacing: ".08em" }}>{r.section}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, padding: "10px 16px",
                          borderTop: "1px solid var(--jim-beige-mid)",
                          fontSize: 12, color: "var(--jim-muted)" }}>
              <span><kbd style={kbdS}>↑↓</kbd> naviguer</span>
              <span><kbd style={kbdS}>↵</kbd> ouvrir</span>
              <span style={{ marginLeft: "auto" }}>Astuce : essaie « paiement »</span>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

/* ============================================================
   VARIANT D — Icon dock that expands labels on hover
   ============================================================ */
const HeaderD = ({ active, setActive }) => {
  const ICONS = {
    "Missions": "briefcase",
    "Remplaçants": "stetho",
    "Messagerie": "msg",
    "Paiements": "wallet",
  };
  return (
    <header style={shell}>
      <div style={inner}>
        <nav style={{ display: "flex", gap: 6, marginLeft: 14, padding: 4,
                      background: "var(--jim-surface-alt)",
                      border: "1px solid var(--jim-beige-mid)",
                      borderRadius: 999 }}>
          {NAV.map(it => {
            const on = it === active;
            return (
              <button key={it} onClick={() => setActive(it)}
                className="dockBtn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: on ? "9px 16px" : "9px 12px",
                  borderRadius: 999,
                  background: on ? "var(--jim-primary)" : "transparent",
                  color: on ? "#fff" : "var(--jim-text)",
                  fontWeight: on ? 700 : 600, fontSize: 14,
                  transition: "all .3s var(--jim-ease-spring)",
                }}>
                <JIcon name={ICONS[it]} size={16} stroke={2}/>
                <span style={{
                  maxWidth: on ? 160 : 0,
                  overflow: "hidden", whiteSpace: "nowrap",
                  transition: "max-width .35s var(--jim-ease-spring)",
                }}>{it}</span>
                {!on && (
                  <span className="dockLabel" style={{
                    position: "absolute", marginTop: 42,
                    background: "var(--jim-text)", color: "#fff",
                    fontSize: 11, fontWeight: 600, padding: "4px 8px",
                    borderRadius: 8, opacity: 0, pointerEvents: "none",
                    transform: "translateY(-4px)",
                    transition: "opacity .2s, transform .2s",
                  }}>{it}</span>
                )}
              </button>
            );
          })}
        </nav>
        <style>{`
          .dockBtn:hover .dockLabel { opacity: 1; transform: translateY(0); }
        `}</style>
        <div style={spacer}/>
        <SearchPill/>
        <AvatarMenuWrap/>
      </div>
    </header>
  );
};

/* ---------------------------- Search pill (two fields) ---------------------------- */
const SearchPill = ({ compact = false }) => {
  const [active, setActive] = useState(null); // 'loc' | 'date' | null
  const [loc, setLoc]   = useState("");
  const [date, setDate] = useState("");
  const rootRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const off = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setActive(null); };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, [active]);

  const pad = compact ? "6px 6px 6px 14px" : "6px 6px 6px 16px";
  const fieldW = compact ? 116 : 140;

  const Field = ({ id, label, placeholder, value, onChange, autoFocus }) => {
    const on = active === id;
    return (
      <button
        onClick={() => setActive(id)}
        style={{
          position: "relative",
          padding: "6px 14px",
          borderRadius: 999,
          textAlign: "left",
          background: on ? "rgba(255,255,255,0.08)" : "transparent",
          boxShadow: on ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : "none",
          transition: "background .2s, box-shadow .2s",
          minWidth: fieldW,
        }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: ".06em",
          textTransform: "uppercase",
          color: on ? "#fff" : "rgba(255,255,255,0.55)",
          marginBottom: 1, lineHeight: 1.2,
        }}>{label}</div>
        {on ? (
          <input
            autoFocus={autoFocus}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              border: "none", outline: "none", background: "transparent",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              color: "#fff", width: "100%",
              padding: 0, lineHeight: 1.3,
              caretColor: "var(--jim-primary)",
            }}/>
        ) : (
          <div style={{
            fontSize: 13, fontWeight: 600,
            color: value ? "#fff" : "rgba(255,255,255,0.55)",
            lineHeight: 1.3,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            maxWidth: fieldW - 12,
          }}>{value || placeholder}</div>
        )}
      </button>
    );
  };

  return (
    <div ref={rootRef} style={{
      display: "inline-flex", alignItems: "center",
      padding: 4, gap: 0,
      borderRadius: 999,
      background: "var(--jim-text)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: active
        ? "0 0 0 3px rgba(40,108,255,0.55), var(--jim-shadow-md)"
        : "0 0 0 3px rgba(40,108,255,0.35)",
      transition: "box-shadow .25s",
      position: "relative",
    }}>
      <Field id="loc"  label="Où"    placeholder="Ville, code postal"  value={loc}  onChange={setLoc}  autoFocus/>
      <span aria-hidden style={{
        width: 1, height: 22,
        background: active ? "transparent" : "rgba(255,255,255,0.18)",
        transition: "background .15s",
      }}/>
      <Field id="date" label="Quand" placeholder="Ajouter dates"       value={date} onChange={setDate} autoFocus/>
      <MotionSearchButton/>
    </div>
  );
};

/* ---------------------------- Motion search button ---------------------------- */
/* Pill-shaped CTA: a corail circle on the left expands to full width on hover,
   revealing the "Rechercher" label. Adapted from the MotionButton pattern. */
const MotionSearchButton = () => {
  const [hover, setHover] = useState(false);
  return (
    <button
      aria-label="Rechercher"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        marginLeft: 4,
        height: 40, width: 132,
        borderRadius: 999,
        padding: 4,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        overflow: "hidden",
        flexShrink: 0,
        cursor: "pointer",
        transition: "border-color .3s",
      }}>
      {/* expanding circle */}
      <span aria-hidden style={{
        position: "absolute", top: 4, left: 4,
        width: hover ? "calc(100% - 8px)" : 32, height: 32,
        background: "var(--jim-primary)",
        borderRadius: 999,
        transition: "width .5s var(--jim-ease-fade)",
        boxShadow: "0 4px 14px rgba(255,124,92,0.45)",
      }}/>
      {/* icon */}
      <span aria-hidden style={{
        position: "absolute", top: "50%", left: 12,
        transform: `translateY(-50%) translateX(${hover ? 4 : 0}px)`,
        color: "#fff",
        transition: "transform .5s var(--jim-ease-fade)",
        display: "inline-flex",
      }}>
        <JIcon name="search" size={16} stroke={2.4}/>
      </span>
      {/* label */}
      <span style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%) translateX(8px)",
        fontFamily: "var(--font-sans)",
        fontWeight: 600, fontSize: 14,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        color: hover ? "#fff" : "rgba(255,255,255,0.85)",
        transition: "color .5s var(--jim-ease-fade)",
      }}>Rechercher</span>
    </button>
  );
};

const AvatarMenuWrap = () => {
  const [o, setO] = useState(false);
  return <AvatarMenu open={o} setOpen={setO}/>;
};

/* ---------------------------- Shared styles ---------------------------- */
const shell = {
  position: "relative",
  padding: "12px 18px",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  border: "1px solid var(--jim-beige-mid)",
  borderRadius: 999,
  boxShadow: "var(--jim-shadow-lg)",
};
const inner = {
  display: "flex", alignItems: "center", gap: 10,
};
const spacer = { flex: 1 };
const kbdS = {
  fontFamily: "var(--font-mono)",
  fontSize: 11, fontWeight: 700,
  padding: "2px 6px", borderRadius: 6,
  background: "var(--jim-beige-light)",
  color: "var(--jim-muted)",
  border: "1px solid var(--jim-beige-mid)",
};

Object.assign(window, { HeaderA, HeaderB, HeaderC, HeaderD });
