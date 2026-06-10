/* ============================================================
   JIM Menu — VARIANT A · "Navbar + dropdown éditorial"
   - Top nav OR left rail
   - Avatar dropdown : header gradient corail + Fraunces pivot,
     items staggered, hover translateX, sliding underline on links
   - Bell popover with timeline ticks
   - Anon state : "Se connecter" CTA replaces avatar
   ============================================================ */

const VariantA = ({ position = "top", onOpenChange, menuOpen, userState }) => {
  const u = window.USER;
  const sections = getMenuSections();
  const [bellOpen, setBellOpen] = React.useState(false);
  const [active, setActive] = React.useState(sections[0]?.items[1]?.id || sections[0]?.items[0]?.id);
  const [status, setStatus] = React.useState("dispo");
  const [theme, setTheme]   = React.useState("light");
  const [lang, setLang]     = React.useState("fr");
  const userOpen = !!menuOpen;
  const setUserOpen = (v) => onOpenChange && onOpenChange(!!v);

  const isAnon = userState === "anon";
  const isTop = position === "top";
  const isRempl = userState === "remplacant";

  React.useEffect(() => {
    setActive(sections[0]?.items[1]?.id || sections[0]?.items[0]?.id);
  }, [userState]);

  const rootRef = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setBellOpen(false);
        onOpenChange && onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onOpenChange]);

  const topLinks = isAnon
    ? [
        { id: "remplacant", label: "Remplaçant" },
        { id: "titulaire",  label: "Titulaire" },
        { id: "tarifs",     label: "Tarifs" },
        { id: "comment",    label: "Comment ça marche" },
      ]
    : userState === "titulaire"
    ? [
        { id: "annonces",  label: "Mes annonces" },
        { id: "candidats", label: "Candidatures", badge: 9 },
        { id: "messages",  label: "Messagerie", badge: u.notifs.messages },
        { id: "paiements", label: "Paiements" },
      ]
    : [
        { id: "carte",     label: "Carte" },
        { id: "candidats", label: "Candidatures", badge: 2 },
        { id: "messages",  label: "Messagerie", badge: u.notifs.messages },
        { id: "dispos",    label: "Dispos" },
      ];

  return (
    <div ref={rootRef} style={{
      position: isTop ? "sticky" : "fixed",
      top: 0, left: 0,
      width: isTop ? "100%" : 260,
      height: isTop ? "auto" : "100vh",
      zIndex: 50,
    }}>
      <nav style={{
        background: "rgba(253,246,237,0.78)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        borderBottom: isTop ? "1px solid rgba(58,31,8,0.07)" : "none",
        borderRight: !isTop ? "1px solid rgba(58,31,8,0.07)" : "none",
        display: "flex",
        flexDirection: isTop ? "row" : "column",
        alignItems: isTop ? "center" : "stretch",
        gap: isTop ? 8 : 4,
        padding: isTop ? "12px clamp(20px, 4vw, 40px)" : "22px 14px",
        height: "100%",
      }}>
        <a href="#" style={{
          display: "flex", alignItems: "center", gap: 10,
          paddingBottom: isTop ? 0 : 14,
          borderBottom: !isTop ? "1px solid var(--jim-beige-mid)" : "none",
          marginBottom: !isTop ? 8 : 0,
        }}>
          <img src="assets/logo-jim.svg" alt="JIM" style={{ height: 28, display: "block" }}/>
        </a>

        <div style={{
          display: "flex",
          flexDirection: isTop ? "row" : "column",
          alignItems: isTop ? "center" : "stretch",
          gap: 2, flex: isTop ? 0 : 1,
          marginLeft: isTop ? 24 : 0,
        }}>
          {topLinks.map(l => (
            <NavLinkA key={l.id} link={l}
                     active={active === l.id} vertical={!isTop}
                     onClick={() => setActive(l.id)} />
          ))}
        </div>

        {isTop && <div style={{ flex: 1 }}/>}

        <div style={{
          display: "flex",
          flexDirection: isTop ? "row" : "column",
          alignItems: isTop ? "center" : "stretch",
          gap: isTop ? 8 : 8,
          marginTop: !isTop ? "auto" : 0,
        }}>
          {!isAnon && (
            <button style={styleA.cta(isTop)}>
              <JIcon name="plus" size={15} stroke={2.5}/>
              <span>{userState === "titulaire" ? "Publier" : "Postuler"}</span>
            </button>
          )}

          {isTop && !isAnon && (
            <button style={styleA.iconBtn}
                    onClick={() => { setBellOpen(!bellOpen); setUserOpen(false); }}>
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
            <button style={styleA.cta(isTop)} onClick={() => setUserOpen(true)}>
              <span>Se connecter</span>
              <JIcon name="arrow" size={14} stroke={2.5}/>
            </button>
          ) : (
            <button style={styleA.avatarBtn(isTop, userOpen)} onClick={() => { setUserOpen(!userOpen); setBellOpen(false); }}>
              <Avatar size={isTop ? 34 : 36} withRing={userOpen}/>
              {!isTop && (
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--jim-text)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 0 0" }}>{u.role}</p>
                </div>
              )}
              {!isTop && <JIcon name="chev" size={14} style={{ transition: "transform .25s", transform: userOpen ? "rotate(180deg)" : "none", color: "var(--jim-muted)" }}/>}
            </button>
          )}
        </div>
      </nav>

      {bellOpen && !isAnon && (
        <div style={{
          position: "absolute",
          top: isTop ? "calc(100% + 10px)" : 20,
          right: isTop ? 130 : "auto",
          left: isTop ? "auto" : "calc(100% + 10px)",
          width: 380,
          background: "var(--jim-surface)",
          border: "1px solid var(--jim-beige-mid)",
          borderRadius: 22,
          boxShadow: "var(--jim-shadow-xl)",
          padding: 8, zIndex: 60,
          animation: "dropdownIn .22s cubic-bezier(.34,1.56,.64,1) both",
          transformOrigin: "top right",
        }}>
          <div style={{ padding: "12px 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "var(--jim-text)", margin: 0 }}>Notifications</p>
            <a style={{ fontSize: 11, fontWeight: 700, color: "var(--jim-primary)", cursor: "pointer" }}>Tout marquer lu</a>
          </div>
          <div style={{ borderTop: "1px solid var(--jim-beige-light)", marginBottom: 4 }}/>
          {[
            { t: "Nouveau message — Nadia B.", s: "« Je peux le 12-14 mai si ça te va »", tone: "msg", time: "2 min" },
            { t: "Candidature acceptée", s: "Annonce Bastille · contrat prêt", tone: "ok", time: "1 h" },
            { t: "Virement séquestre libéré", s: "820 € · Remplacement Charonne", tone: "pay", time: "3 h" },
          ].map((n, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, padding: "11px 12px",
              borderRadius: 14, cursor: "pointer", position: "relative",
              animation: `itemIn .28s cubic-bezier(.16,1,.3,1) ${0.05 + i * 0.05}s both`,
            }} onMouseEnter={e => e.currentTarget.style.background = "var(--jim-surface-alt)"}
               onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: n.tone === "msg" ? "var(--jim-primary-pale)" : n.tone === "ok" ? "var(--jim-success-bg)" : "var(--jim-warning-bg)",
                color: n.tone === "msg" ? "var(--jim-primary)" : n.tone === "ok" ? "var(--jim-success)" : "var(--jim-warning)",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <JIcon name={n.tone === "msg" ? "msg" : n.tone === "ok" ? "check" : "wallet"} size={16} stroke={2}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--jim-text)", margin: 0 }}>{n.t}</p>
                <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.s}</p>
              </div>
              <span style={{ fontSize: 10, color: "var(--jim-muted)", fontWeight: 600, flexShrink: 0 }}>{n.time}</span>
            </div>
          ))}
        </div>
      )}

      {userOpen && (
        <div style={{
          position: "absolute",
          top: isTop ? "calc(100% + 10px)" : 20,
          right: isTop ? "clamp(20px, 4vw, 40px)" : "auto",
          left: isTop ? "auto" : "calc(100% + 10px)",
          width: 360,
          maxHeight: "calc(100vh - 80px)",
          background: "var(--jim-surface)",
          border: "1px solid var(--jim-beige-mid)",
          borderRadius: 26,
          boxShadow: "var(--jim-shadow-xl)",
          padding: 10, zIndex: 60,
          animation: "dropdownIn .26s cubic-bezier(.34,1.56,.64,1) both",
          transformOrigin: "top right",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Header — gradient corail, identité + statut intégré */}
          <DropdownHeaderA isAnon={isAnon} u={u} status={status} onStatus={setStatus}/>

          {/* Scrollable body */}
          <div style={{ overflowY: "auto", overflowX: "hidden", flex: 1, paddingRight: 2, marginRight: -2 }}>

          {/* ONBOARDING PROGRESS — anon (preview of post-signup) */}
          {isAnon && <OnboardingProgress pct={60}/>}

          {/* LIVE MISSIONS mini-map — remplaçant only */}
          {isRempl && <LiveMissions/>}

          {/* INBOX PREVIEW — logged-in only */}
          {!isAnon && <InboxPreview/>}

          {sections.map((sec, si) => (
            <div key={sec.label} style={{ padding: "4px 0" }}>
              <p style={{
                fontSize: 10, fontWeight: 800, color: "var(--jim-muted)",
                textTransform: "uppercase", letterSpacing: ".18em",
                padding: "6px 12px 4px", margin: 0,
                animation: `itemIn .25s cubic-bezier(.16,1,.3,1) ${0.04 + si * 0.03}s both`,
              }}>{sec.label}</p>
              {sec.items.map((it, i) => (
                <a key={it.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 14,
                  cursor: "pointer", textDecoration: "none",
                  position: "relative",
                  transition: "background .15s, transform .2s, padding .2s",
                  animation: `itemIn .3s cubic-bezier(.16,1,.3,1) ${0.08 + si * 0.08 + i * 0.04}s both`,
                }}
                   onMouseEnter={e => { e.currentTarget.style.background = it.cta ? "var(--jim-primary-pale)" : "var(--jim-surface-alt)"; e.currentTarget.style.paddingLeft = "16px"; }}
                   onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "12px"; }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12,
                    background: it.cta ? "var(--jim-primary)" : "var(--jim-surface-alt)",
                    color: it.cta ? "#fff" : "var(--jim-text-body)",
                    display: "grid", placeItems: "center", flexShrink: 0,
                    boxShadow: it.cta ? "0 4px 14px rgba(255,124,92,0.35)" : "none",
                  }}>
                    <JIcon name={it.icon} size={17} stroke={it.cta ? 2.4 : 1.9}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--jim-text)", margin: 0 }}>{it.title}</p>
                    <p style={{ fontSize: 11, color: "var(--jim-muted)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.sub}</p>
                  </div>
                  {it.badge && <CountBadge value={it.badge} size="sm"/>}
                  {it.urgent && <PulseDot size={6}/>}
                </a>
              ))}
            </div>
          ))}

          {!isAnon && (
            <>
              <div style={{ borderTop: "1px solid var(--jim-beige-light)", margin: "6px 8px" }}/>
              <a style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 14,
                cursor: "pointer", color: "var(--jim-muted)",
                animation: "itemIn .3s cubic-bezier(.16,1,.3,1) .45s both",
              }}
                 onMouseEnter={e => { e.currentTarget.style.background = "var(--jim-destructive-bg)"; e.currentTarget.style.color = "var(--jim-destructive)"; }}
                 onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--jim-muted)"; }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--jim-surface-alt)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <JIcon name="logout" size={16} stroke={1.9}/>
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>Se déconnecter</p>
              </a>
            </>
          )}

          </div>{/* /scroll */}

          {/* FOOTER : theme + lang + help + ⌘K */}
          <MenuFooter theme={theme} onTheme={setTheme} lang={lang} onLang={setLang}/>
        </div>
      )}
    </div>
  );
};

const NavLinkA = ({ link, active, onClick, vertical }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <a onClick={(e) => { e.preventDefault(); onClick(); }}
       onMouseEnter={() => setHover(true)}
       onMouseLeave={() => setHover(false)}
       style={{
         position: "relative",
         display: "flex", alignItems: "center", gap: 8,
         padding: vertical ? "11px 14px" : "10px 14px",
         fontSize: 13.5, fontWeight: active ? 700 : 600,
         color: active ? "var(--jim-primary)" : "var(--jim-text-body)",
         background: active ? "var(--jim-primary-pale)" : "transparent",
         borderRadius: 12, cursor: "pointer", textDecoration: "none",
         transition: "background .2s, color .2s",
       }}>
      <span>{link.label}</span>
      {link.badge && (
        <span style={{
          background: active ? "var(--jim-primary)" : "var(--jim-text)",
          color: "#fff", fontSize: 10, fontWeight: 800,
          minWidth: 16, height: 16, padding: "0 5px",
          borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>{link.badge}</span>
      )}
      {!vertical && (
        <span style={{
          position: "absolute",
          left: 14, right: 14, bottom: 4,
          height: 2, borderRadius: 1,
          background: "var(--jim-primary)",
          transform: hover && !active ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform .3s cubic-bezier(.16,1,.3,1)",
        }}/>
      )}
    </a>
  );
};

const styleA = {
  cta: (top) => ({
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    background: "var(--jim-primary)", color: "#fff", border: 0,
    padding: top ? "10px 16px" : "12px 16px",
    borderRadius: top ? 12 : 14,
    fontSize: 13, fontWeight: 700, cursor: "pointer",
    boxShadow: "0 6px 20px rgba(255,124,92,0.35)",
    transition: "transform .18s, box-shadow .18s",
  }),
  iconBtn: {
    position: "relative", width: 40, height: 40,
    borderRadius: 12, background: "var(--jim-surface)",
    border: "1px solid var(--jim-beige-mid)",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "var(--jim-text)",
  },
  avatarBtn: (top, open) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: top ? 2 : "8px 10px",
    borderRadius: top ? 999 : 14,
    border: top ? "none" : "1px solid var(--jim-beige-mid)",
    background: top ? "transparent" : (open ? "var(--jim-surface-alt)" : "var(--jim-surface)"),
    cursor: "pointer",
  }),
};

Object.assign(window, { VariantA });
