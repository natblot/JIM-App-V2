/* ============================================================
   JIM Menu — VARIANT B · "Plein-écran éditorial"
   - Compact navbar with hamburger → X morph
   - Full-screen overlay : huge typographic menu, Fraunces accents,
     coral blob choreography, hover reveals supplementary info card
   - Items numbered 01 / 02 / 03 (editorial magazine vibe)
   - State-aware (anon = "Connexion / Création", logged = full menu)
   ============================================================ */

const VariantB = ({ position = "top", onOpenChange, menuOpen, userState }) => {
  const u = window.USER;
  const isAnon = userState === "anon";
  const sections = getMenuSections();
  const items = sections.flatMap(s => s.items.map(it => ({ ...it, section: s.label })));
  const [hoverId, setHoverId] = React.useState(null);
  const open = !!menuOpen;
  const setOpen = (v) => onOpenChange && onOpenChange(!!v);
  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);
  const isTop = position === "top";

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hovered = items.find(it => it.id === hoverId);

  return (
    <>
      <nav style={{
        position: isTop ? "sticky" : "fixed",
        top: 0, left: 0,
        width: isTop ? "100%" : 76,
        height: isTop ? "auto" : "100vh",
        padding: isTop ? "16px clamp(20px, 4vw, 40px)" : "20px 12px",
        display: "flex",
        flexDirection: isTop ? "row" : "column",
        alignItems: "center",
        justifyContent: isTop ? "space-between" : "flex-start",
        gap: isTop ? 20 : 18,
        background: "rgba(253,246,237,0.85)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        borderBottom: isTop ? "1px solid rgba(58,31,8,0.06)" : "none",
        borderRight: !isTop ? "1px solid rgba(58,31,8,0.06)" : "none",
        zIndex: open ? 100 : 50,
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center" }}>
          <img src="assets/logo-jim.svg" alt="JIM" style={{ height: 26 }}/>
        </a>

        {isTop && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <span className="eyebrow" style={{ fontSize: 10, letterSpacing: ".22em" }}>{u.eyebrow}</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: isTop ? "row" : "column", alignItems: "center", gap: 10, marginTop: isTop ? 0 : "auto" }}>
          {isTop && !isAnon && (
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--jim-primary)", color: "#fff",
              border: 0, padding: "10px 16px", borderRadius: 12,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(255,124,92,0.35)",
            }}>
              <JIcon name="plus" size={15} stroke={2.5}/>
              {userState === "titulaire" ? "Publier" : "Postuler"}
            </button>
          )}

          <button onClick={toggle}
                  aria-expanded={open}
                  aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                  style={{
                    position: "relative",
                    display: "inline-flex", alignItems: "center", gap: 10,
                    background: open ? "var(--jim-text)" : "var(--jim-surface)",
                    color: open ? "#fff" : "var(--jim-text)",
                    border: "1px solid " + (open ? "var(--jim-text)" : "var(--jim-beige-mid)"),
                    padding: isTop ? "9px 14px 9px 12px" : "10px",
                    borderRadius: isTop ? 999 : 14,
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    transition: "background .25s, color .25s, border-color .25s",
                  }}>
            <HamburgerX open={open}/>
            {isTop && <span>{open ? "Fermer" : "Menu"}</span>}
            {isTop && !open && !isAnon && <Avatar size={26}/>}
            {isTop && !open && isAnon && (
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--jim-muted)" }}>Connexion</span>
            )}
            {isTop && !open && !isAnon && u.notifs.total > 0 && (
              <span style={{
                position: "absolute", top: -3, right: -3,
                minWidth: 18, height: 18, padding: "0 5px",
                background: "var(--jim-primary)", color: "#fff",
                border: "2px solid var(--jim-background)",
                borderRadius: 999, fontSize: 10, fontWeight: 800,
                display: "grid", placeItems: "center",
              }}>{u.notifs.total}</span>
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90,
          background: "var(--jim-background)",
          animation: "overlayIn .35s cubic-bezier(.16,1,.3,1) both",
          overflow: "auto",
        }}>
          {/* Coral blobs */}
          <div style={{
            position: "absolute", top: "-15%", right: "-10%",
            width: 720, height: 720, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,124,92,0.28), transparent 65%)",
            filter: "blur(50px)",
            animation: "blobFloat 10s ease-in-out infinite",
            pointerEvents: "none",
          }}/>
          <div style={{
            position: "absolute", bottom: "-15%", left: "-12%",
            width: 560, height: 560, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,184,106,0.22), transparent 65%)",
            filter: "blur(50px)",
            animation: "blobFloat 12s ease-in-out infinite reverse",
            pointerEvents: "none",
          }}/>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(58,31,8,1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.05, pointerEvents: "none",
          }}/>

          <div style={{
            position: "relative",
            maxWidth: 1320, margin: "0 auto",
            padding: "clamp(20px, 4vw, 48px)",
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
          }}>
            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(28px, 5vh, 52px)" }}>
              <img src="assets/logo-jim.svg" alt="JIM" style={{ height: 32 }}/>
              <button onClick={close} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "var(--jim-text)", color: "#fff",
                border: 0, padding: "10px 14px 10px 18px",
                borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>
                Fermer
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center" }}>
                  <JIcon name="x" size={13} stroke={2.5}/>
                </span>
              </button>
            </div>

            {/* Headline */}
            <div style={{
              marginBottom: "clamp(20px, 4vh, 40px)",
              animation: "itemUp .6s cubic-bezier(.16,1,.3,1) .05s both",
            }}>
              <p className="eyebrow" style={{ marginBottom: 14 }}>
                {isAnon ? "BIENVENUE SUR JIM" : "MENU PRINCIPAL"}
              </p>
              <h1 style={{
                fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
                fontWeight: 800, letterSpacing: "-0.04em",
                lineHeight: 0.98, color: "var(--jim-text)",
                margin: 0, maxWidth: 1100, textWrap: "pretty",
              }}>
                {isAnon ? <>Le cabinet,&nbsp;<em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500, color: "var(--jim-primary)" }}>enfin simple</em>.</>
                  : userState === "titulaire" ? <>Bonjour,&nbsp;<em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500, color: "var(--jim-primary)" }}>Camille</em>. Que veux-tu faire&nbsp;?</>
                  : <>Salut,&nbsp;<em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500, color: "var(--jim-primary)" }}>Léo</em>. Direction le terrain&nbsp;?</>}
              </h1>
            </div>

            {/* Two-col : list + sticky preview */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0, 360px)",
              gap: 40,
              flex: 1,
              alignItems: "start",
            }}>
              {/* List */}
              <div>
                {sections.map((sec, si) => (
                  <div key={sec.label} style={{ marginBottom: si === sections.length - 1 ? 0 : 28 }}>
                    <p style={{
                      fontSize: 11, fontWeight: 800, color: "var(--jim-muted)",
                      textTransform: "uppercase", letterSpacing: ".22em",
                      margin: "0 0 8px",
                      animation: `itemUp .4s cubic-bezier(.16,1,.3,1) ${0.1 + si * 0.1}s both`,
                    }}>{sec.label}</p>
                    {sec.items.map((it, i) => {
                      const idx = items.indexOf(items.find(x => x.id === it.id));
                      const num = String(idx + 1).padStart(2, "0");
                      const isHover = hoverId === it.id;
                      return (
                        <a key={it.id}
                           onMouseEnter={() => setHoverId(it.id)}
                           onMouseLeave={() => setHoverId(null)}
                           style={{
                             display: "flex", alignItems: "baseline", gap: 16,
                             padding: "14px 0",
                             borderBottom: "1px solid rgba(58,31,8,0.08)",
                             cursor: "pointer", textDecoration: "none",
                             position: "relative",
                             animation: `itemUp .5s cubic-bezier(.34,1.56,.64,1) ${0.15 + si * 0.08 + i * 0.05}s both`,
                           }}>
                          <span style={{
                            fontSize: 12, fontWeight: 700,
                            color: isHover ? "var(--jim-primary)" : "var(--jim-muted)",
                            fontFamily: "var(--font-mono)",
                            letterSpacing: ".05em",
                            transition: "color .2s",
                            minWidth: 26,
                          }}>{num}</span>
                          <span style={{
                            flex: 1,
                            fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            lineHeight: 1.05,
                            color: isHover ? "var(--jim-primary)" : "var(--jim-text)",
                            transform: isHover ? "translateX(8px)" : "translateX(0)",
                            transition: "color .25s, transform .35s cubic-bezier(.34,1.56,.64,1)",
                          }}>
                            {it.title}
                            {it.cta && <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500, color: "var(--jim-primary)", marginLeft: 12, fontSize: "0.6em" }}>· suggéré</em>}
                          </span>
                          {it.badge && (
                            <span style={{
                              padding: "4px 10px",
                              background: "var(--jim-primary)", color: "#fff",
                              borderRadius: 999, fontSize: 11, fontWeight: 800,
                            }}>{it.badge}</span>
                          )}
                          <span style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: isHover ? "var(--jim-primary)" : "transparent",
                            color: isHover ? "#fff" : "var(--jim-muted)",
                            display: "grid", placeItems: "center", flexShrink: 0,
                            transform: isHover ? "translate(4px, -4px) rotate(-12deg)" : "translate(0,0) rotate(0)",
                            transition: "transform .35s cubic-bezier(.34,1.56,.64,1), background .2s, color .2s",
                          }}>
                            <JIcon name="arrowUp" size={16} stroke={2.5}/>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Sticky preview card */}
              <aside style={{
                position: "sticky", top: 24,
                animation: "itemUp .55s cubic-bezier(.16,1,.3,1) .25s both",
              }}>
                <div style={{
                  background: "var(--jim-surface)",
                  border: "1px solid var(--jim-beige-mid)",
                  borderRadius: 26,
                  padding: 24,
                  boxShadow: "var(--jim-shadow-lg)",
                  position: "relative", overflow: "hidden",
                  minHeight: 380,
                }}>
                  {/* User strip on top */}
                  {!isAnon && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--jim-beige-light)" }}>
                      <Avatar size={44}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: "var(--jim-text)", margin: 0 }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 0 4px", fontWeight: 600 }}>{u.role} · {u.location}</p>
                        <RppsChip compact/>
                      </div>
                    </div>
                  )}

                  {hovered ? (
                    <div key={hovered.id} style={{ animation: "itemUp .3s ease-out both" }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: hovered.cta ? "var(--jim-primary)" : "var(--jim-primary-pale)",
                        color: hovered.cta ? "#fff" : "var(--jim-primary)",
                        display: "grid", placeItems: "center", marginBottom: 16,
                        boxShadow: hovered.cta ? "0 8px 24px rgba(255,124,92,0.4)" : "none",
                      }}>
                        <JIcon name={hovered.icon} size={26} stroke={2}/>
                      </div>
                      <p className="eyebrow" style={{ marginBottom: 8 }}>{hovered.section}</p>
                      <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>{hovered.title}</h3>
                      <p style={{ fontSize: 14, color: "var(--jim-text-body)", margin: 0, lineHeight: 1.5 }}>{hovered.sub}</p>
                      <button style={{
                        marginTop: 18,
                        width: "100%",
                        background: "var(--jim-text)", color: "#fff",
                        border: 0, padding: "12px", borderRadius: 14,
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}>
                        Aller à {hovered.title.toLowerCase()}
                        <JIcon name="arrow" size={14} stroke={2.5}/>
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: "var(--jim-muted)" }}>
                      <p className="eyebrow" style={{ marginBottom: 10 }}>APERÇU</p>
                      <p style={{
                        fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em",
                        color: "var(--jim-text)", lineHeight: 1.15, margin: 0, textWrap: "pretty",
                      }}>
                        Survole un item.<br/>
                        <em style={{ fontFamily: "var(--font-serif-italic)", fontStyle: "italic", fontWeight: 500, color: "var(--jim-primary)" }}>Aperçu</em> contextuel.
                      </p>
                      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                          { ic: "shield", t: "Vérifié RPPS",       s: "Tous les profils contrôlés" },
                          { ic: "wallet", t: "Paiement séquestre", s: "Sécurisé via Stripe Connect" },
                          { ic: "zap",    t: "0 % commission",     s: "Au lancement" },
                        ].map((b, i) => (
                          <div key={i} style={{
                            display: "flex", gap: 10, alignItems: "center",
                            padding: "10px 12px",
                            background: "var(--jim-surface-alt)",
                            borderRadius: 12,
                          }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--jim-primary-pale)", color: "var(--jim-primary)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                              <JIcon name={b.ic} size={14} stroke={2}/>
                            </div>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--jim-text)", margin: 0 }}>{b.t}</p>
                              <p style={{ fontSize: 10.5, color: "var(--jim-muted)", margin: "1px 0 0" }}>{b.s}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid var(--jim-beige-mid)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: 24, flexWrap: "wrap",
              animation: "itemUp .55s cubic-bezier(.16,1,.3,1) .55s both",
            }}>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                <a style={{ fontSize: 12, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".14em", cursor: "pointer" }}>Aide</a>
                <a style={{ fontSize: 12, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".14em", cursor: "pointer" }}>CGU</a>
                <a style={{ fontSize: 12, fontWeight: 700, color: "var(--jim-muted)", textTransform: "uppercase", letterSpacing: ".14em", cursor: "pointer" }}>Confidentialité</a>
                {!isAnon && <a style={{ fontSize: 12, fontWeight: 700, color: "var(--jim-destructive)", textTransform: "uppercase", letterSpacing: ".14em", cursor: "pointer" }}>Se déconnecter</a>}
              </div>
              <span style={{ fontSize: 11, color: "var(--jim-muted)", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)" }}>
                <PulseDot size={6}/> 2 847 remplacements en cours
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const HamburgerX = ({ open, size = 18 }) => {
  const bar = {
    position: "absolute", left: 0, right: 0,
    height: 2, borderRadius: 2, background: "currentColor",
    transition: "transform .3s cubic-bezier(.34,1.56,.64,1), top .25s ease, opacity .2s",
  };
  return (
    <span style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      <span style={{ ...bar, top: open ? size / 2 - 1 : 3, transform: open ? "rotate(45deg)" : "rotate(0)" }}/>
      <span style={{ ...bar, top: size / 2 - 1, opacity: open ? 0 : 1 }}/>
      <span style={{ ...bar, top: open ? size / 2 - 1 : size - 5, transform: open ? "rotate(-45deg)" : "rotate(0)" }}/>
    </span>
  );
};

Object.assign(window, { VariantB });
