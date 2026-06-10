/* ============================================================
   JIM Menu — VARIANT C · "Command palette ⌘K"
   - Compact navbar, search-shaped trigger
   - Centered palette with type-ahead, keyboard nav
   - 3-pane : results · user/recent · quick actions
   - Anon : palette focuses on "découvrir / connexion"
   ============================================================ */

const VariantC = ({ position = "top", onOpenChange, menuOpen, userState }) => {
  const u = window.USER;
  const isAnon = userState === "anon";
  const allItems = getAllItems();
  const sections = getMenuSections();

  const [q, setQ] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef(null);
  const open = !!menuOpen;
  const isTop = position === "top";

  const toggle = (v) => {
    const n = v !== undefined ? v : !open;
    onOpenChange && onOpenChange(n);
    if (n) setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    else { setQ(""); setCursor(0); }
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); toggle(); }
      if (e.key === "Escape" && open) toggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const ql = q.trim().toLowerCase();
  const filtered = ql
    ? allItems.filter(it => it.title.toLowerCase().includes(ql) || it.sub.toLowerCase().includes(ql) || it.section.toLowerCase().includes(ql))
    : allItems;

  React.useEffect(() => { setCursor(0); }, [q, userState]);

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === "Enter")     { e.preventDefault(); toggle(false); }
  };

  const recents = userState === "remplacant"
    ? [
        { t: "Cabinet Bastille — Paris 11ᵉ", s: "il y a 2 min", ic: "pin" },
        { t: "Acceptée — Charonne",          s: "hier",        ic: "check" },
        { t: "Rétro 820 € créditée",          s: "lundi",       ic: "wallet" },
      ]
    : [
        { t: "Nadia B. — Bastille",  s: "il y a 2 min", ic: "msg" },
        { t: "Paiement libéré 820 €", s: "il y a 3 h",   ic: "wallet" },
        { t: "Candidature acceptée",  s: "hier",         ic: "check" },
      ];

  return (
    <>
      <nav style={{
        position: isTop ? "sticky" : "fixed",
        top: 0, left: 0,
        width: isTop ? "100%" : 280,
        height: isTop ? "auto" : "100vh",
        display: "flex",
        flexDirection: isTop ? "row" : "column",
        alignItems: isTop ? "center" : "stretch",
        gap: isTop ? 14 : 14,
        padding: isTop ? "14px clamp(20px, 4vw, 40px)" : "22px 16px",
        background: "rgba(253,246,237,0.85)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        borderBottom: isTop ? "1px solid rgba(58,31,8,0.07)" : "none",
        borderRight: !isTop ? "1px solid rgba(58,31,8,0.07)" : "none",
        zIndex: 50,
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <img src="assets/logo-jim.svg" alt="JIM" style={{ height: 28 }}/>
        </a>

        <button onClick={() => toggle(true)}
                style={{
                  flex: isTop ? 1 : "none",
                  maxWidth: isTop ? 520 : "none",
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px 10px 14px",
                  background: "var(--jim-surface)",
                  border: "1px solid var(--jim-beige-mid)",
                  borderRadius: 14, cursor: "pointer",
                  boxShadow: "var(--jim-shadow-sm)",
                  transition: "border-color .18s, box-shadow .18s",
                  marginLeft: isTop ? 16 : 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--jim-primary-soft)"; e.currentTarget.style.boxShadow = "var(--jim-shadow)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--jim-beige-mid)"; e.currentTarget.style.boxShadow = "var(--jim-shadow-sm)"; }}>
          <JIcon name="search" size={16} stroke={2} style={{ color: "var(--jim-muted)" }}/>
          <span style={{ flex: 1, textAlign: "left", fontSize: 13, color: "var(--jim-muted)", fontWeight: 500 }}>
            {isAnon ? "Découvrir JIM…" : "Rechercher dans JIM…"}
          </span>
          <kbd style={{
            padding: "2px 7px", borderRadius: 6,
            background: "var(--jim-surface-alt)",
            border: "1px solid var(--jim-beige-mid)",
            fontSize: 10, fontWeight: 700, color: "var(--jim-muted)",
            fontFamily: "var(--font-mono)",
          }}>⌘K</kbd>
        </button>

        {isTop && <div style={{ flex: 1, minWidth: 0 }}/>}

        <div style={{ display: "flex", flexDirection: isTop ? "row" : "column", alignItems: "center", gap: 8, marginTop: !isTop ? "auto" : 0 }}>
          {!isAnon && (
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--jim-primary)", color: "#fff", border: 0,
              padding: "10px 16px", borderRadius: 12,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(255,124,92,0.35)",
            }}>
              <JIcon name="plus" size={15} stroke={2.5}/>
              {userState === "titulaire" ? "Publier" : "Postuler"}
            </button>
          )}

          {!isAnon && (
            <button style={{
              position: "relative", width: 40, height: 40,
              borderRadius: 12, background: "var(--jim-surface)",
              border: "1px solid var(--jim-beige-mid)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "var(--jim-text)", cursor: "pointer",
            }}>
              <JIcon name="bell" size={17} stroke={1.9}/>
              {u.notifs.total > 0 && (
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  minWidth: 16, height: 16, padding: "0 4px",
                  background: "var(--jim-primary)", color: "#fff",
                  borderRadius: 999, fontSize: 9, fontWeight: 800,
                  display: "grid", placeItems: "center",
                  border: "2px solid var(--jim-background)",
                }}>{u.notifs.total}</span>
              )}
            </button>
          )}

          {isAnon ? (
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--jim-text)", color: "#fff", border: 0,
              padding: "10px 16px", borderRadius: 12,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>
              Se connecter <JIcon name="arrow" size={14} stroke={2.5}/>
            </button>
          ) : (
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: 2, borderRadius: 999,
              border: "1px solid var(--jim-beige-mid)",
              background: "var(--jim-surface)", cursor: "pointer",
            }}>
              <Avatar size={32}/>
            </button>
          )}
        </div>
      </nav>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 95,
          background: "rgba(58,31,8,0.30)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          animation: "overlayIn .22s ease-out both",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "clamp(60px, 12vh, 140px) 20px 40px",
          overflow: "auto",
        }} onClick={() => toggle(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: 820,
            background: "var(--jim-surface)",
            border: "1px solid var(--jim-beige-mid)",
            borderRadius: 26,
            boxShadow: "0 28px 96px rgba(58,31,8,0.22)",
            overflow: "hidden",
            animation: "dropdownIn .3s cubic-bezier(.34,1.56,.64,1) both",
          }}>
            {/* Input */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "18px 20px",
              borderBottom: "1px solid var(--jim-beige-light)",
              background: "linear-gradient(180deg, var(--jim-surface), var(--jim-background))",
            }}>
              <JIcon name="search" size={18} stroke={2} style={{ color: "var(--jim-primary)" }}/>
              <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onInputKey}
                placeholder={isAnon ? "Comment ça marche, tarifs, espace remplaçant…" : "Annonce, paiement, contact, contrat…"}
                style={{
                  flex: 1,
                  background: "transparent", border: 0, outline: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: 17, fontWeight: 500,
                  color: "var(--jim-text)",
                }}/>
              {q && (
                <button onClick={() => setQ("")} style={{
                  background: "transparent", border: 0, color: "var(--jim-muted)",
                  cursor: "pointer", padding: 4,
                }}>
                  <JIcon name="x" size={14} stroke={2}/>
                </button>
              )}
              <kbd style={{
                padding: "3px 8px", borderRadius: 6,
                background: "var(--jim-surface)",
                border: "1px solid var(--jim-beige-mid)",
                fontSize: 10, fontWeight: 700, color: "var(--jim-muted)",
                fontFamily: "var(--font-mono)",
              }}>ESC</kbd>
            </div>

            {/* Body — 3 cols */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", minHeight: 360 }}>
              {/* Results */}
              <div style={{ padding: "10px 8px", borderRight: "1px solid var(--jim-beige-light)", maxHeight: 460, overflow: "auto" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: "60px 24px", textAlign: "center" }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: "var(--jim-surface-alt)",
                      color: "var(--jim-muted)",
                      display: "grid", placeItems: "center", margin: "0 auto 14px",
                    }}>
                      <JIcon name="search" size={26} stroke={1.6}/>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "var(--jim-text)", margin: 0 }}>Aucun résultat</p>
                    <p style={{ fontSize: 12, color: "var(--jim-muted)", marginTop: 6 }}>
                      Essaie « <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500, color: "var(--jim-primary)" }}>messagerie</em> », « paiement »…
                    </p>
                  </div>
                ) : (
                  sections.map(sec => {
                    const sectionItems = filtered.filter(it => it.section === sec.label);
                    if (sectionItems.length === 0) return null;
                    return (
                      <div key={sec.label} style={{ padding: "8px 4px 4px" }}>
                        <p style={{
                          padding: "6px 12px", margin: 0,
                          fontSize: 10, fontWeight: 800,
                          color: "var(--jim-muted)",
                          textTransform: "uppercase", letterSpacing: ".18em",
                        }}>{sec.label}</p>
                        {sectionItems.map(it => {
                          const idx = filtered.indexOf(it);
                          const sel = cursor === idx;
                          return (
                            <div key={it.id}
                                 onMouseEnter={() => setCursor(idx)}
                                 style={{
                                   display: "flex", alignItems: "center", gap: 12,
                                   padding: "10px 12px",
                                   borderRadius: 12,
                                   background: sel ? "var(--jim-primary-pale)" : "transparent",
                                   cursor: "pointer",
                                   transition: "background .12s",
                                   animation: `itemIn .2s ease-out ${idx * 0.02}s both`,
                                 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: 10,
                                background: sel ? "#fff" : "var(--jim-surface-alt)",
                                color: sel ? "var(--jim-primary)" : "var(--jim-text-body)",
                                display: "grid", placeItems: "center", flexShrink: 0,
                                boxShadow: sel ? "0 2px 8px rgba(255,124,92,0.2)" : "none",
                              }}>
                                <JIcon name={it.icon} size={15} stroke={2}/>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--jim-text)", margin: 0 }}>
                                  <Highlight text={it.title} q={ql}/>
                                </p>
                                <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.sub}</p>
                              </div>
                              {it.badge && <CountBadge value={it.badge} size="sm"/>}
                              {sel && (
                                <kbd style={{
                                  padding: "2px 7px", borderRadius: 6,
                                  background: "#fff", border: "1px solid var(--jim-beige-mid)",
                                  fontSize: 10, fontWeight: 700, color: "var(--jim-muted)",
                                  fontFamily: "var(--font-mono)",
                                }}>↵</kbd>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right rail */}
              <div style={{ padding: "14px 16px", background: "var(--jim-surface-alt)" }}>
                {!isAnon ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: 12,
                    background: "linear-gradient(135deg, var(--jim-primary-pale) 0%, var(--jim-beige-light) 100%)",
                    borderRadius: 16, marginBottom: 16,
                    position: "relative", overflow: "hidden",
                  }}>
                    <Avatar size={42}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 800, color: "var(--jim-text)", margin: 0 }}>{u.name}</p>
                      <p style={{ fontSize: 10.5, color: "var(--jim-muted)", margin: "3px 0 4px", fontWeight: 600 }}>{u.role} · {u.location}</p>
                      <RppsChip compact/>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: 14,
                    background: "linear-gradient(135deg, var(--jim-primary) 0%, var(--jim-accent) 100%)",
                    color: "#fff",
                    borderRadius: 16, marginBottom: 16,
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".22em", margin: 0, opacity: .85 }}>NOUVEAU SUR JIM</p>
                    <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", margin: "6px 0 4px", lineHeight: 1.15 }}>
                      <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500 }}>Crée ton compte</em> en 3 minutes
                    </p>
                    <p style={{ fontSize: 11, opacity: .9, margin: 0 }}>Vérifié RPPS sous 24h, gratuit au lancement.</p>
                  </div>
                )}

                <p className="eyebrow" style={{ fontSize: 10, letterSpacing: ".18em", marginBottom: 8 }}>
                  {isAnon ? "POPULAIRES" : "RÉCENT"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 }}>
                  {(isAnon
                    ? [
                        { t: "Comment ça marche", s: "5 étapes",   ic: "sparkle" },
                        { t: "Calcul rétrocession", s: "outil",     ic: "wallet" },
                        { t: "Vérification RPPS",  s: "FAQ",        ic: "shield" },
                      ]
                    : recents
                  ).map((r, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 10px", borderRadius: 10,
                      cursor: "pointer",
                      animation: `itemIn .25s ease-out ${0.05 + i * 0.04}s both`,
                    }}
                         onMouseEnter={e => e.currentTarget.style.background = "var(--jim-surface)"}
                         onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--jim-surface)", color: "var(--jim-muted)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <JIcon name={r.ic} size={13} stroke={1.9}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--jim-text)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.t}</p>
                        <p style={{ fontSize: 10, color: "var(--jim-muted)", margin: "1px 0 0" }}>{r.s}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="eyebrow" style={{ fontSize: 10, letterSpacing: ".18em", marginBottom: 8 }}>ACTIONS RAPIDES</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {isAnon ? (
                    <>
                      <QuickAction icon="user" label="Se connecter" accent/>
                      <QuickAction icon="plus" label="Créer un compte"/>
                      <QuickAction icon="help" label="Aide & contact"/>
                    </>
                  ) : userState === "titulaire" ? (
                    <>
                      <QuickAction icon="plus"   label="Nouvelle annonce" accent/>
                      <QuickAction icon="cal"    label="Programmer disponibilité"/>
                      <QuickAction icon="help"   label="Aide & contact"/>
                      <QuickAction icon="logout" label="Se déconnecter"/>
                    </>
                  ) : (
                    <>
                      <QuickAction icon="pin"    label="Carte des missions" accent/>
                      <QuickAction icon="cal"    label="Mes disponibilités"/>
                      <QuickAction icon="help"   label="Aide & contact"/>
                      <QuickAction icon="logout" label="Se déconnecter"/>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 16px",
              borderTop: "1px solid var(--jim-beige-light)",
              background: "var(--jim-surface)",
              fontSize: 11, color: "var(--jim-muted)", fontWeight: 600,
            }}>
              <div style={{ display: "flex", gap: 14 }}>
                <span><Kbd>↑</Kbd><Kbd>↓</Kbd> naviguer</span>
                <span><Kbd>↵</Kbd> ouvrir</span>
                <span><Kbd>esc</Kbd> fermer</span>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <PulseDot size={6}/> {filtered.length} résultats
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Kbd = ({ children }) => (
  <kbd style={{
    padding: "1px 5px", borderRadius: 4,
    background: "var(--jim-surface-alt)",
    border: "1px solid var(--jim-beige-mid)",
    fontSize: 9, fontWeight: 700, color: "var(--jim-muted)",
    fontFamily: "var(--font-mono)",
    margin: "0 1px",
  }}>{children}</kbd>
);

const QuickAction = ({ icon, label, accent }) => (
  <a style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 10px", borderRadius: 10,
    textDecoration: "none", cursor: "pointer",
    color: accent ? "var(--jim-primary)" : "var(--jim-text-body)",
    fontWeight: 700, fontSize: 12.5,
    transition: "background .15s",
  }}
     onMouseEnter={e => e.currentTarget.style.background = "var(--jim-surface)"}
     onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <JIcon name={icon} size={14} stroke={2}/>
    {label}
  </a>
);

const Highlight = ({ text, q }) => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: "var(--jim-primary-soft)", color: "var(--jim-text)", borderRadius: 3, padding: "0 1px" }}>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
};

Object.assign(window, { VariantC });
