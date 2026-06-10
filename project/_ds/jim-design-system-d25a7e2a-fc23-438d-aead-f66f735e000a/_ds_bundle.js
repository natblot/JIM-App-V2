/* @ds-bundle: {"format":3,"namespace":"JIMDesignSystem_d25a7e","components":[],"sourceHashes":{"header-app.jsx":"8e1008e278e4","header-variants.jsx":"8d4738504ecd","menu-app.jsx":"d7ec68fba0d7","menu-features.jsx":"3ff3d13d78e8","menu-page.jsx":"75ea90e0e5f9","menu-shared.jsx":"6cb73d8ba33b","menu-variant-a.jsx":"6eeb8ba54152","menu-variant-b.jsx":"a1112458796d","menu-variant-c.jsx":"bbe2aa7c17f5","tweaks-panel.jsx":"a1107c630a56","ui_kits/mobile/ios-frame.jsx":"d67eb3ffe562","ui_kits/mobile/screens.jsx":"54785662d9ea","ui_kits/web/cards-annonces.jsx":"c3baed9eb41e","ui_kits/web/design-canvas.jsx":"5d0e39003628","ui_kits/web/headers.jsx":"db54019604eb","ui_kits/web/tweaks-panel.jsx":"82e4c3ddd5ec"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.JIMDesignSystem_d25a7e = window.JIMDesignSystem_d25a7e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// header-app.jsx
try { (() => {
/* ============================================================
   JIM Header — App shell
   ============================================================ */

const {
  useState: _us,
  useEffect: _ue
} = React;
const VARIANTS = [{
  id: "A",
  title: "Pill nav · indicateur glissant",
  sub: "Le plus proche de la maquette : pill corail qui glisse entre les onglets, halo bleu sur la recherche, badge corail pulsé sur la cloche.",
  Comp: HeaderA
}, {
  id: "B",
  title: "Souligné magnétique + sous-titre",
  sub: "Trait corail qui suit la souris d'un onglet à l'autre ; un eyebrow chiffre l'onglet survolé en temps réel.",
  Comp: HeaderB
}, {
  id: "C",
  title: "Recherche ⌘K — palette de commandes",
  sub: "La barre noire à halo bleu ouvre une palette plein écran : tape une mission, un paiement, un contact.",
  Comp: HeaderC
}, {
  id: "D",
  title: "Dock à icônes — labels qui s'ouvrent",
  sub: "Compact : seul l'onglet actif affiche son label, les autres révèlent le leur au survol avec une transition spring.",
  Comp: HeaderD
}];
const VariantFrame = ({
  v,
  active,
  setActive
}) => /*#__PURE__*/React.createElement("section", {
  "data-screen-label": `Header · ${v.id}`,
  style: {
    padding: "28px 28px 40px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
    borderRadius: 28,
    border: "1px solid var(--jim-beige-mid)",
    marginBottom: 28
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 18
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "eyebrow",
  style: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "var(--jim-primary-pale)",
    color: "var(--jim-primary)"
  }
}, "Variant ", v.id), /*#__PURE__*/React.createElement("h3", {
  style: {
    margin: 0,
    fontSize: 20
  }
}, v.title)), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 14,
    color: "var(--jim-muted)",
    margin: "0 0 22px",
    maxWidth: 720
  }
}, v.sub), /*#__PURE__*/React.createElement(v.Comp, {
  active: active,
  setActive: setActive
}));
const App = () => {
  const [t, setTweak] = useTweaks(window.__TWEAK_DEFAULTS_RAW);
  const [active, setActive] = _us(t.active || "Missions");
  _ue(() => {
    setActive(t.active);
  }, [t.active]);
  const visible = t.variant === "all" ? VARIANTS : VARIANTS.filter(v => v.id === t.variant);
  const onSetActive = it => {
    setActive(it);
    setTweak("active", it);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      padding: "40px 28px 120px",
      maxWidth: 1480,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 32,
      gap: 24,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "JIM \xB7 Design system"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(2rem, 4vw, 3.2rem)",
      margin: "6px 0 8px",
      letterSpacing: "-0.04em"
    }
  }, "Header menu, ", /*#__PURE__*/React.createElement("em", null, "anim\xE9.")), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 640,
      color: "var(--jim-text-body)",
      margin: 0
    }
  }, "Quatre directions partant de la barre actuelle. Toutes utilisent les tokens Corail v2.1, Manrope, et respectent ", /*#__PURE__*/React.createElement("code", null, "prefers-reduced-motion"), ". Clique un onglet pour voir la transition.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, ["Missions", "Remplaçants", "Messagerie", "Paiements"].map(it => /*#__PURE__*/React.createElement("button", {
    key: it,
    onClick: () => onSetActive(it),
    style: {
      padding: "8px 14px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      border: "1px solid var(--jim-beige-mid)",
      background: active === it ? "var(--jim-primary)" : "var(--jim-surface)",
      color: active === it ? "#fff" : "var(--jim-text-body)",
      transition: "background .2s, color .2s, transform .15s"
    }
  }, it)))), visible.map(v => /*#__PURE__*/React.createElement(VariantFrame, {
    key: v.id,
    v: v,
    active: active,
    setActive: onSetActive
  })), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Affichage"
  }), /*#__PURE__*/React.createElement(TweakSelect, {
    label: "Variante",
    value: t.variant,
    options: [{
      value: "all",
      label: "Toutes (comparaison)"
    }, {
      value: "A",
      label: "A — Pill nav"
    }, {
      value: "B",
      label: "B — Souligné magnétique"
    }, {
      value: "C",
      label: "C — ⌘K Command palette"
    }, {
      value: "D",
      label: "D — Dock icônes"
    }],
    onChange: v => setTweak("variant", v)
  }), /*#__PURE__*/React.createElement(TweakSelect, {
    label: "Onglet actif",
    value: t.active,
    options: ["Missions", "Remplaçants", "Messagerie", "Paiements"],
    onChange: v => setTweak("active", v)
  })));
};
setActiveUser("titulaire");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "header-app.jsx", error: String((e && e.message) || e) }); }

// header-variants.jsx
try { (() => {
/* ============================================================
   JIM Header — 4 animated variants
   - A: Pill nav (sliding indicator) + glass shell  → reference fidèle
   - B: Underline magnétique + caret morph
   - C: Search command palette (Cmd/Ctrl K)
   - D: Compact "dock" with hover-expand items
   ============================================================ */

const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect
} = React;

/* ---------------------------- Logo (text wordmark) ---------------------------- */
const JimLogo = ({
  size = 28
}) => {
  const [bounce, setBounce] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setBounce(true),
    onAnimationEnd: () => setBounce(false),
    "aria-label": "JIM \u2014 Accueil",
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: "-0.06em",
      color: "var(--jim-primary)",
      display: "inline-flex",
      alignItems: "center",
      animation: bounce ? "wordmarkBounce .55s var(--jim-ease-spring)" : "none"
    }
  }, "jim", /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      marginLeft: 4,
      marginBottom: -4,
      background: "var(--jim-primary)",
      borderRadius: 999
    }
  }));
};

/* ---------------------------- Bell with badge ---------------------------- */
const Bell = ({
  count = 0,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  "aria-label": "Notifications",
  style: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--jim-text)",
    transition: "background .2s, transform .2s"
  },
  onMouseEnter: e => e.currentTarget.style.background = "var(--jim-beige-light)",
  onMouseLeave: e => e.currentTarget.style.background = "transparent"
}, /*#__PURE__*/React.createElement(JIcon, {
  name: "bell",
  size: 20,
  stroke: 1.8
}), count > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "var(--jim-primary)",
    boxShadow: "0 0 0 2px var(--jim-surface)"
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 999,
    background: "var(--jim-primary)",
    opacity: 0.5,
    animation: "pingRing 2.2s ease-out infinite"
  }
})));
const ChatIcon = ({
  count = 0,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  "aria-label": "Messagerie",
  style: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--jim-text)",
    transition: "background .2s"
  },
  onMouseEnter: e => e.currentTarget.style.background = "var(--jim-beige-light)",
  onMouseLeave: e => e.currentTarget.style.background = "transparent"
}, /*#__PURE__*/React.createElement(JIcon, {
  name: "msg",
  size: 20,
  stroke: 1.8
}), count > 0 && /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 999,
    background: "var(--jim-primary)",
    boxShadow: "0 0 0 2px var(--jim-surface)",
    animation: "pulseDot 2s ease-in-out infinite"
  }
}));

/* ---------------------------- Avatar w/ menu ---------------------------- */
const AvatarMenu = ({
  open,
  setOpen
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const off = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, [open, setOpen]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    "aria-label": "Mon compte",
    style: {
      borderRadius: 999,
      padding: 2,
      transition: "box-shadow .2s, transform .2s",
      boxShadow: open ? "0 0 0 3px var(--jim-primary-soft)" : "0 0 0 0 transparent"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 36
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 0,
      top: "calc(100% + 10px)",
      width: 264,
      padding: 8,
      background: "var(--jim-surface)",
      borderRadius: 20,
      border: "1px solid var(--jim-beige-mid)",
      boxShadow: "var(--jim-shadow-xl)",
      animation: "drop .22s var(--jim-ease-fade)",
      zIndex: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px 12px",
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: "var(--jim-text)"
    }
  }, (window.USER || USER).name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(RppsChip, {
    compact: true
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--jim-beige-mid)",
      margin: "4px 4px"
    }
  }), [{
    ic: "user",
    t: "Mon profil"
  }, {
    ic: "wallet",
    t: "Paiements & facturation"
  }, {
    ic: "settings",
    t: "Paramètres"
  }, {
    ic: "help",
    t: "Aide & contact"
  }].map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.t,
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 12px",
      borderRadius: 12,
      textAlign: "left",
      color: "var(--jim-text-body)",
      fontWeight: 500,
      fontSize: 14,
      animation: `itemUp .26s var(--jim-ease-fade) both`,
      animationDelay: `${i * 30}ms`,
      transition: "background .15s"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--jim-beige-light)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: r.ic,
    size: 16,
    stroke: 1.8
  }), r.t)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--jim-beige-mid)",
      margin: "4px 4px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 12px",
      borderRadius: 12,
      textAlign: "left",
      color: "var(--jim-destructive)",
      fontWeight: 600,
      fontSize: 14,
      transition: "background .15s"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--jim-destructive-bg)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "logout",
    size: 16,
    stroke: 1.8
  }), "Se d\xE9connecter")));
};

/* ---------------------------- Items ---------------------------- */
const NAV = ["Missions", "Remplaçants", "Messagerie", "Paiements"];

/* ============================================================
   VARIANT A — Pill nav (sliding indicator)
   ============================================================ */
const HeaderA = ({
  active,
  setActive
}) => {
  const refs = useRef({});
  const [pill, setPill] = useState({
    x: 0,
    w: 0,
    ready: false
  });
  const [search, setSearch] = useState("");
  useLayoutEffect(() => {
    const el = refs.current[active];
    if (!el) return;
    const parent = el.offsetParent;
    setPill({
      x: el.offsetLeft,
      w: el.offsetWidth,
      ready: true
    });
  }, [active]);
  return /*#__PURE__*/React.createElement("header", {
    style: shell
  }, /*#__PURE__*/React.createElement("div", {
    style: inner
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "relative",
      display: "flex",
      gap: 4,
      marginLeft: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: pill.w,
      transform: `translateX(${pill.x}px)`,
      background: "var(--jim-primary-pale)",
      borderRadius: 999,
      transition: pill.ready ? "transform .42s var(--jim-ease-spring), width .42s var(--jim-ease-spring)" : "none",
      zIndex: 0
    }
  }), NAV.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      ref: el => refs.current[it] = el,
      onClick: () => setActive(it),
      style: {
        position: "relative",
        zIndex: 1,
        padding: "10px 18px",
        borderRadius: 999,
        fontSize: 15,
        fontWeight: on ? 700 : 600,
        color: on ? "var(--jim-primary)" : "var(--jim-text)",
        transition: "color .25s"
      }
    }, it);
  })), /*#__PURE__*/React.createElement("div", {
    style: spacer
  }), /*#__PURE__*/React.createElement(SearchPill, null), /*#__PURE__*/React.createElement(AvatarMenuWrap, null)));
};

/* ============================================================
   VARIANT B — Magnetic underline w/ floating eyebrow caption
   ============================================================ */
const HeaderB = ({
  active,
  setActive
}) => {
  const refs = useRef({});
  const [bar, setBar] = useState({
    x: 0,
    w: 0,
    ready: false
  });
  const [hover, setHover] = useState(null);
  const update = key => {
    const el = refs.current[key];
    if (!el) return;
    setBar({
      x: el.offsetLeft,
      w: el.offsetWidth,
      ready: true
    });
  };
  useLayoutEffect(() => {
    update(hover || active);
  }, [active, hover]);
  const SUBS = {
    "Missions": "12 nouvelles · 50 km",
    "Remplaçants": "Trouve un kiné vérifié RPPS",
    "Messagerie": "3 conversations actives",
    "Paiements": "1 240 € ce mois"
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      ...shell,
      padding: "10px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: inner
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "relative",
      display: "flex",
      gap: 4,
      marginLeft: 18
    },
    onMouseLeave: () => setHover(null)
  }, NAV.map(it => {
    const on = it === active;
    const isHover = hover === it;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      ref: el => refs.current[it] = el,
      onMouseEnter: () => setHover(it),
      onClick: () => setActive(it),
      style: {
        position: "relative",
        padding: "12px 14px 14px",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: on || isHover ? 700 : 600,
        color: on ? "var(--jim-text)" : isHover ? "var(--jim-text)" : "var(--jim-muted)",
        transition: "color .2s, font-weight .2s"
      }
    }, /*#__PURE__*/React.createElement("span", null, it), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 6,
        height: 2,
        borderRadius: 2,
        background: "var(--jim-primary)",
        opacity: on ? 1 : 0,
        transition: "opacity .2s"
      }
    }));
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      left: 0,
      bottom: -2,
      transform: `translateX(${bar.x}px)`,
      width: bar.w,
      height: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      margin: "0 14px",
      height: 2,
      borderRadius: 2,
      background: "var(--jim-primary)",
      transform: bar.ready ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left center",
      transition: "transform .35s var(--jim-ease-spring), width .35s var(--jim-ease-spring)",
      opacity: hover ? 1 : 0
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 14,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--jim-muted)",
      transition: "opacity .2s",
      opacity: hover ? 1 : 0.6
    }
  }, SUBS[hover || active]), /*#__PURE__*/React.createElement("div", {
    style: spacer
  }), /*#__PURE__*/React.createElement(SearchPill, {
    compact: true
  }), /*#__PURE__*/React.createElement(AvatarMenuWrap, null)));
};

/* ============================================================
   VARIANT C — Command palette search (⌘K) — expanding pill
   ============================================================ */
const HeaderC = ({
  active,
  setActive
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);
  const results = useMemo(() => {
    const all = getAllItems();
    if (!q.trim()) return all.slice(0, 6);
    return all.filter(i => (i.title + " " + (i.sub || "")).toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  }, [q]);
  return /*#__PURE__*/React.createElement("header", {
    style: shell
  }, /*#__PURE__*/React.createElement("div", {
    style: inner
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 2,
      marginLeft: 14
    }
  }, NAV.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      onClick: () => setActive(it),
      style: {
        position: "relative",
        padding: "10px 16px",
        borderRadius: 999,
        fontSize: 15,
        fontWeight: on ? 700 : 600,
        color: on ? "var(--jim-text)" : "var(--jim-text-body)",
        transition: "color .2s, background .2s"
      },
      onMouseEnter: e => !on && (e.currentTarget.style.background = "var(--jim-beige-light)"),
      onMouseLeave: e => !on && (e.currentTarget.style.background = "transparent")
    }, it, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: "50%",
        bottom: 2,
        transform: "translateX(-50%)",
        width: 6,
        height: 6,
        borderRadius: 999,
        background: "var(--jim-primary)"
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: spacer
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(true),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      borderRadius: 999,
      background: "var(--jim-text)",
      color: "#fff",
      fontWeight: 600,
      fontSize: 14,
      boxShadow: "0 0 0 3px rgba(40,108,255,0.55), var(--jim-shadow-md)",
      transition: "transform .18s, box-shadow .25s"
    },
    onMouseEnter: e => e.currentTarget.style.transform = "translateY(-1px)",
    onMouseLeave: e => e.currentTarget.style.transform = "translateY(0)"
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "search",
    size: 16,
    stroke: 2
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.9
    }
  }, "Rechercher"), /*#__PURE__*/React.createElement("kbd", {
    style: {
      background: "rgba(255,255,255,0.12)",
      color: "rgba(255,255,255,0.85)",
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 6px",
      borderRadius: 6,
      marginLeft: 4,
      fontFamily: "var(--font-mono)"
    }
  }, "\u2318K")), /*#__PURE__*/React.createElement(AvatarMenuWrap, null)), open && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(false),
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(58,31,8,0.45)",
      backdropFilter: "blur(6px)",
      zIndex: 90,
      animation: "drop .2s ease-out"
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    style: {
      position: "fixed",
      top: 80,
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(640px, 92vw)",
      background: "var(--jim-surface)",
      borderRadius: 22,
      border: "1px solid var(--jim-beige-mid)",
      boxShadow: "var(--jim-shadow-xl)",
      zIndex: 91,
      overflow: "hidden",
      animation: "drop .28s var(--jim-ease-spring)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "16px 18px",
      borderBottom: "1px solid var(--jim-beige-mid)"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "search",
    size: 18,
    stroke: 2,
    style: {
      color: "var(--jim-muted)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Mission, rempla\xE7ant, message, paiement\u2026",
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "inherit",
      fontSize: 16,
      color: "var(--jim-text)"
    }
  }), /*#__PURE__*/React.createElement("kbd", {
    style: kbdS
  }, "Esc")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 340,
      overflow: "auto",
      padding: 8
    }
  }, results.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      textAlign: "center",
      color: "var(--jim-muted)"
    }
  }, "Aucun r\xE9sultat pour \xAB ", q, " \xBB"), results.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.id + i,
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 12,
      textAlign: "left",
      animation: `itemUp .22s var(--jim-ease-fade) both`,
      animationDelay: `${i * 22}ms`,
      transition: "background .15s"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--jim-beige-light)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: "var(--jim-primary-pale)",
      color: "var(--jim-primary)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: r.icon,
    size: 16,
    stroke: 2
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: "var(--jim-text)",
      fontSize: 14
    }
  }, r.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--jim-muted)"
    }
  }, r.sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "var(--jim-muted)",
      textTransform: "uppercase",
      letterSpacing: ".08em"
    }
  }, r.section)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      padding: "10px 16px",
      borderTop: "1px solid var(--jim-beige-mid)",
      fontSize: 12,
      color: "var(--jim-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", {
    style: kbdS
  }, "\u2191\u2193"), " naviguer"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", {
    style: kbdS
  }, "\u21B5"), " ouvrir"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, "Astuce : essaie \xAB paiement \xBB")))));
};

/* ============================================================
   VARIANT D — Icon dock that expands labels on hover
   ============================================================ */
const HeaderD = ({
  active,
  setActive
}) => {
  const ICONS = {
    "Missions": "briefcase",
    "Remplaçants": "stetho",
    "Messagerie": "msg",
    "Paiements": "wallet"
  };
  return /*#__PURE__*/React.createElement("header", {
    style: shell
  }, /*#__PURE__*/React.createElement("div", {
    style: inner
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 6,
      marginLeft: 14,
      padding: 4,
      background: "var(--jim-surface-alt)",
      border: "1px solid var(--jim-beige-mid)",
      borderRadius: 999
    }
  }, NAV.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      onClick: () => setActive(it),
      className: "dockBtn",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: on ? "9px 16px" : "9px 12px",
        borderRadius: 999,
        background: on ? "var(--jim-primary)" : "transparent",
        color: on ? "#fff" : "var(--jim-text)",
        fontWeight: on ? 700 : 600,
        fontSize: 14,
        transition: "all .3s var(--jim-ease-spring)"
      }
    }, /*#__PURE__*/React.createElement(JIcon, {
      name: ICONS[it],
      size: 16,
      stroke: 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        maxWidth: on ? 160 : 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        transition: "max-width .35s var(--jim-ease-spring)"
      }
    }, it), !on && /*#__PURE__*/React.createElement("span", {
      className: "dockLabel",
      style: {
        position: "absolute",
        marginTop: 42,
        background: "var(--jim-text)",
        color: "#fff",
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 8px",
        borderRadius: 8,
        opacity: 0,
        pointerEvents: "none",
        transform: "translateY(-4px)",
        transition: "opacity .2s, transform .2s"
      }
    }, it));
  })), /*#__PURE__*/React.createElement("style", null, `
          .dockBtn:hover .dockLabel { opacity: 1; transform: translateY(0); }
        `), /*#__PURE__*/React.createElement("div", {
    style: spacer
  }), /*#__PURE__*/React.createElement(SearchPill, null), /*#__PURE__*/React.createElement(AvatarMenuWrap, null)));
};

/* ---------------------------- Search pill (two fields) ---------------------------- */
const SearchPill = ({
  compact = false
}) => {
  const [active, setActive] = useState(null); // 'loc' | 'date' | null
  const [loc, setLoc] = useState("");
  const [date, setDate] = useState("");
  const rootRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const off = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setActive(null);
    };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, [active]);
  const pad = compact ? "6px 6px 6px 14px" : "6px 6px 6px 16px";
  const fieldW = compact ? 116 : 140;
  const Field = ({
    id,
    label,
    placeholder,
    value,
    onChange,
    autoFocus
  }) => {
    const on = active === id;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => setActive(id),
      style: {
        position: "relative",
        padding: "6px 14px",
        borderRadius: 999,
        textAlign: "left",
        background: on ? "rgba(255,255,255,0.08)" : "transparent",
        boxShadow: on ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : "none",
        transition: "background .2s, box-shadow .2s",
        minWidth: fieldW
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: on ? "#fff" : "rgba(255,255,255,0.55)",
        marginBottom: 1,
        lineHeight: 1.2
      }
    }, label), on ? /*#__PURE__*/React.createElement("input", {
      autoFocus: autoFocus,
      value: value,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      style: {
        border: "none",
        outline: "none",
        background: "transparent",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 600,
        color: "#fff",
        width: "100%",
        padding: 0,
        lineHeight: 1.3,
        caretColor: "var(--jim-primary)"
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: value ? "#fff" : "rgba(255,255,255,0.55)",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: fieldW - 12
      }
    }, value || placeholder));
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: 4,
      gap: 0,
      borderRadius: 999,
      background: "var(--jim-text)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: active ? "0 0 0 3px rgba(40,108,255,0.55), var(--jim-shadow-md)" : "0 0 0 3px rgba(40,108,255,0.35)",
      transition: "box-shadow .25s",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    id: "loc",
    label: "O\xF9",
    placeholder: "Ville, code postal",
    value: loc,
    onChange: setLoc,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 1,
      height: 22,
      background: active ? "transparent" : "rgba(255,255,255,0.18)",
      transition: "background .15s"
    }
  }), /*#__PURE__*/React.createElement(Field, {
    id: "date",
    label: "Quand",
    placeholder: "Ajouter dates",
    value: date,
    onChange: setDate,
    autoFocus: true
  }), /*#__PURE__*/React.createElement(MotionSearchButton, null));
};

/* ---------------------------- Motion search button ---------------------------- */
/* Pill-shaped CTA: a corail circle on the left expands to full width on hover,
   revealing the "Rechercher" label. Adapted from the MotionButton pattern. */
const MotionSearchButton = () => {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": "Rechercher",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      marginLeft: 4,
      height: 40,
      width: 132,
      borderRadius: 999,
      padding: 4,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.10)",
      overflow: "hidden",
      flexShrink: 0,
      cursor: "pointer",
      transition: "border-color .3s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      top: 4,
      left: 4,
      width: hover ? "calc(100% - 8px)" : 32,
      height: 32,
      background: "var(--jim-primary)",
      borderRadius: 999,
      transition: "width .5s var(--jim-ease-fade)",
      boxShadow: "0 4px 14px rgba(255,124,92,0.45)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      top: "50%",
      left: 12,
      transform: `translateY(-50%) translateX(${hover ? 4 : 0}px)`,
      color: "#fff",
      transition: "transform .5s var(--jim-ease-fade)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "search",
    size: 16,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) translateX(8px)",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
      color: hover ? "#fff" : "rgba(255,255,255,0.85)",
      transition: "color .5s var(--jim-ease-fade)"
    }
  }, "Rechercher"));
};
const AvatarMenuWrap = () => {
  const [o, setO] = useState(false);
  return /*#__PURE__*/React.createElement(AvatarMenu, {
    open: o,
    setOpen: setO
  });
};

/* ---------------------------- Shared styles ---------------------------- */
const shell = {
  position: "relative",
  padding: "12px 18px",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(14px)",
  border: "1px solid var(--jim-beige-mid)",
  borderRadius: 999,
  boxShadow: "var(--jim-shadow-lg)"
};
const inner = {
  display: "flex",
  alignItems: "center",
  gap: 10
};
const spacer = {
  flex: 1
};
const kbdS = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: 6,
  background: "var(--jim-beige-light)",
  color: "var(--jim-muted)",
  border: "1px solid var(--jim-beige-mid)"
};
Object.assign(window, {
  HeaderA,
  HeaderB,
  HeaderC,
  HeaderD
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "header-variants.jsx", error: String((e && e.message) || e) }); }

// menu-app.jsx
try { (() => {
/* ============================================================
   JIM Menu — App shell
   Composes the chosen variant + state-aware page backdrop.
   ============================================================ */

const TWEAK_DEFAULTS = window.__TWEAK_DEFAULTS_RAW || {
  variant: "A",
  position: "top",
  state: "titulaire"
};
const VARIANT_META = {
  A: {
    label: "A · Navbar + dropdown éditorial",
    sub: "Top nav (ou rail), avatar dropdown avec header gradient corail."
  },
  B: {
    label: "B · Plein-écran éditorial",
    sub: "Overlay dramatique. Numéros 01/02, hover preview, Fraunces italic."
  },
  C: {
    label: "C · Command palette ⌘K",
    sub: "Search-first. Type-ahead, keyboard nav, 2 panneaux."
  }
};
const STATE_META = {
  anon: {
    label: "Anonyme",
    sub: "Visiteur non connecté · CTA connexion."
  },
  titulaire: {
    label: "Titulaire",
    sub: "Cherche un remplaçant. Annonces, candidatures, paiements."
  },
  remplacant: {
    label: "Remplaçant",
    sub: "Cherche des missions. Carte, favoris, candidatures."
  }
};
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const variant = t.variant || "A";
  const position = t.position || "top";
  const state = t.state || "titulaire";

  // Sync window.USER on state change
  React.useEffect(() => {
    setActiveUser(state);
  }, [state]);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const onOpenChange = React.useCallback(v => setMenuOpen(!!v), []);
  React.useEffect(() => {
    setMenuOpen(false);
  }, [variant, state]);
  const Variant = variant === "A" ? VariantA : variant === "B" ? VariantB : VariantC;
  const isTop = position === "top";
  const railWidth = !isTop ? variant === "A" ? 260 : variant === "B" ? 76 : 280 : 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageBackdrop, {
    position: position
  }, /*#__PURE__*/React.createElement(Variant, {
    position: position,
    onOpenChange: onOpenChange,
    menuOpen: menuOpen,
    userState: state
  }), /*#__PURE__*/React.createElement(MockDashboard, {
    offsetLeft: railWidth,
    userState: state
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 20,
      left: 20,
      zIndex: 40,
      display: "inline-flex",
      alignItems: "stretch",
      gap: 0,
      background: "var(--jim-text)",
      borderRadius: 999,
      boxShadow: "var(--jim-shadow-lg)",
      overflow: "hidden",
      fontFamily: "var(--jim-font-sans)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px 8px 12px",
      color: "var(--jim-background)",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      borderRight: "1px solid rgba(255,255,255,0.08)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .55
    }
  }, "Variante")), ["A", "B", "C"].map(v => {
    const active = variant === v;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      onClick: () => setTweak("variant", v),
      title: VARIANT_META[v].label,
      style: {
        appearance: "none",
        border: 0,
        cursor: "pointer",
        padding: "8px 12px",
        background: active ? "var(--jim-primary)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.55)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".06em",
        fontFamily: "inherit",
        transition: "background .15s ease, color .15s ease",
        display: "flex",
        alignItems: "center",
        gap: 6,
        minWidth: 36
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = "#fff";
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.55)";
      }
    }, v);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      color: "rgba(255,255,255,0.7)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      borderLeft: "1px solid rgba(255,255,255,0.08)",
      maxWidth: 220
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "var(--jim-primary-mid)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--jim-background)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, VARIANT_META[variant].label.split(" · ")[1]))), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Variante de menu"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Style",
    value: variant,
    options: ["A", "B", "C"],
    onChange: v => setTweak("variant", v)
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      margin: "2px 2px 10px",
      lineHeight: 1.45
    }
  }, VARIANT_META[variant].sub), /*#__PURE__*/React.createElement(TweakSection, {
    label: "\xC9tat utilisateur"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Profil",
    value: state,
    options: ["anon", "titulaire", "remplacant"],
    onChange: v => setTweak("state", v)
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      margin: "2px 2px 10px",
      lineHeight: 1.45
    }
  }, STATE_META[state].sub), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Position"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Ancrage",
    value: position,
    options: ["top", "left"],
    onChange: v => setTweak("position", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "D\xE9mo"
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: menuOpen ? "Fermer le menu" : "Ouvrir le menu",
    onClick: () => setMenuOpen(!menuOpen)
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      margin: "2px 2px 10px",
      lineHeight: 1.45
    }
  }, variant === "C" ? "Astuce : ⌘K / Ctrl+K ouvre la palette, ↑↓ naviguent, Esc ferme." : "Astuce : clique sur l'avatar ou le bouton menu dans la barre.")));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "menu-app.jsx", error: String((e && e.message) || e) }); }

// menu-features.jsx
try { (() => {
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

const STATUS_OPTIONS = [{
  id: "dispo",
  label: "Disponible",
  color: "#3aa86b",
  dot: "#46c97f"
}, {
  id: "occupe",
  label: "Occupé",
  color: "#d8a13e",
  dot: "#f5b86a"
}, {
  id: "vacances",
  label: "Vacances",
  color: "#9b8a78",
  dot: "#bca896"
}];

/* Dropdown header — anon OR logged-in (with status pill integrated) */
const DropdownHeaderA = ({
  isAnon,
  u,
  status,
  onStatus
}) => {
  const [openStatus, setOpenStatus] = React.useState(false);
  const cur = STATUS_OPTIONS.find(s => s.id === status) || STATUS_OPTIONS[0];
  if (isAnon) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        overflow: "hidden",
        padding: "20px 18px 22px",
        borderRadius: 18,
        background: "linear-gradient(135deg, #ff7c5c 0%, #e06245 70%, #b07824 130%)",
        color: "#fff",
        marginBottom: 10,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: -40,
        right: -30,
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 65%)",
        animation: "blobFloat 8s ease-in-out infinite"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: ".22em",
        margin: 0,
        opacity: .85
      }
    }, "BIENVENUE"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        margin: "6px 0 4px"
      }
    }, "Le cabinet,\xA0", /*#__PURE__*/React.createElement("em", {
      style: {
        fontFamily: "var(--font-serif-italic)",
        fontStyle: "italic",
        fontWeight: 500,
        color: "#fff",
        opacity: .92
      }
    }, "enfin simple"), "."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        opacity: .85,
        margin: 0
      }
    }, "RPPS \xB7 contrat \xB7 paiement s\xE9questre.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "visible",
      padding: "18px 16px 16px",
      borderRadius: 18,
      background: "linear-gradient(135deg, #ff7c5c 0%, #e06245 70%, #b07824 130%)",
      color: "#fff",
      marginBottom: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -40,
      right: -30,
      width: 140,
      height: 140,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 65%)",
      animation: "blobFloat 8s ease-in-out infinite",
      pointerEvents: "none",
      borderTopRightRadius: 18,
      overflow: "hidden"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: ".22em",
      margin: 0,
      opacity: .85
    }
  }, u.eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpenStatus(o => !o),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px 4px 9px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.22)",
      border: "1px solid rgba(255,255,255,0.35)",
      color: "#fff",
      fontSize: 10.5,
      fontWeight: 800,
      letterSpacing: ".04em",
      cursor: "pointer",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: cur.dot,
      boxShadow: `0 0 0 2px rgba(255,255,255,0.4)`
    }
  }), cur.label, /*#__PURE__*/React.createElement(JIcon, {
    name: "chev",
    size: 9,
    stroke: 2.5
  })), openStatus && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(100% + 6px)",
      right: 0,
      width: 160,
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      borderRadius: 12,
      padding: 4,
      boxShadow: "var(--jim-shadow-lg)",
      zIndex: 5,
      animation: "dropdownIn .18s ease-out both",
      color: "var(--jim-text)"
    }
  }, STATUS_OPTIONS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => {
      onStatus(s.id);
      setOpenStatus(false);
    },
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 10px",
      borderRadius: 8,
      background: status === s.id ? "var(--jim-surface-alt)" : "transparent",
      border: 0,
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: s.dot,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--jim-text)"
    }
  }, s.label), status === s.id && /*#__PURE__*/React.createElement(JIcon, {
    name: "check",
    size: 12,
    stroke: 2.5,
    style: {
      color: "var(--jim-primary)"
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 44,
    style: {
      boxShadow: "0 0 0 3px rgba(255,255,255,0.35)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      letterSpacing: "-0.01em",
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, u.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      opacity: .9,
      margin: "3px 0 0",
      fontWeight: 600
    }
  }, "Bonjour, ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 500
    }
  }, u.name.split(" ").slice(-1)[0]), ".")), /*#__PURE__*/React.createElement("button", {
    title: "Voir mon profil",
    style: {
      width: 30,
      height: 30,
      borderRadius: 10,
      background: "rgba(255,255,255,0.18)",
      border: "1px solid rgba(255,255,255,0.32)",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "chevR",
    size: 13,
    stroke: 2.4
  }))));
};

/* Inbox preview */
const INBOX = [{
  from: "Nadia B.",
  initials: "NB",
  color: "#e0a07e",
  msg: "Je peux le 12-14 mai si ça te va — RPPS validé.",
  time: "2 min",
  unread: true
}, {
  from: "Cabinet Bastille",
  initials: "CB",
  color: "#7e9ce0",
  msg: "Contrat prêt à signer, je te l'envoie ce soir.",
  time: "1 h",
  unread: true
}, {
  from: "Léo V.",
  initials: "LV",
  color: "#85b074",
  msg: "Merci pour la réco, c'était nickel.",
  time: "3 h",
  unread: false
}];
const InboxPreview = () => /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "2px 0 4px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px 4px"
  }
}, /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 10,
    fontWeight: 800,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".18em",
    margin: 0
  }
}, "Messages ", /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--jim-primary)"
  }
}, "\xB7 2 non lus")), /*#__PURE__*/React.createElement("a", {
  style: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "var(--jim-primary)",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    cursor: "pointer"
  }
}, "Tout voir")), INBOX.slice(0, 2).map((m, i) => /*#__PURE__*/React.createElement("a", {
  key: i,
  style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
    textDecoration: "none",
    position: "relative",
    animation: `itemIn .3s cubic-bezier(.16,1,.3,1) ${0.05 + i * 0.04}s both`
  },
  onMouseEnter: e => e.currentTarget.style.background = "var(--jim-surface-alt)",
  onMouseLeave: e => e.currentTarget.style.background = "transparent"
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: m.color,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 11,
    fontWeight: 800
  }
}, m.initials), m.unread && /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "var(--jim-primary)",
    border: "2px solid var(--jim-surface)"
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "baseline",
    gap: 6
  }
}, /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 12.5,
    fontWeight: m.unread ? 800 : 600,
    color: "var(--jim-text)",
    margin: 0,
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}, m.from), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 10,
    color: "var(--jim-muted)",
    fontWeight: 600,
    flexShrink: 0
  }
}, m.time)), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 11.5,
    color: "var(--jim-muted)",
    margin: "1px 0 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: m.unread ? 600 : 500,
    lineHeight: 1.35
  }
}, m.msg)))));

/* Live missions mini map (remplaçant) */
const LiveMissions = () => {
  const pings = [{
    x: 28,
    y: 45,
    label: "Bastille",
    urg: true
  }, {
    x: 62,
    y: 32,
    label: "Charonne",
    urg: false
  }, {
    x: 48,
    y: 68,
    label: "Parmentier",
    urg: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      background: "linear-gradient(135deg, #faf2e6 0%, #f5e9d6 100%)",
      borderRadius: 14,
      marginBottom: 8,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(PulseDot, {
    size: 6
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: "var(--jim-text)",
      textTransform: "uppercase",
      letterSpacing: ".14em",
      margin: 0
    }
  }, "EN DIRECT \xB7 3 missions")), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: "var(--jim-primary)",
      cursor: "pointer"
    }
  }, "Carte \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 92,
      borderRadius: 10,
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: .6
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 60 Q 40 50 60 65 T 100 55",
    stroke: "var(--jim-beige-mid)",
    strokeWidth: "1.5",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M30 0 L 35 100",
    stroke: "var(--jim-beige-mid)",
    strokeWidth: "1",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 0 L 65 100",
    stroke: "var(--jim-beige-mid)",
    strokeWidth: "1",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 25 L 100 30",
    stroke: "var(--jim-beige-mid)",
    strokeWidth: "1",
    fill: "none"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "var(--jim-text)",
      border: "3px solid var(--jim-surface)",
      boxShadow: "0 0 0 2px var(--jim-text)",
      zIndex: 2
    }
  }), pings.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: `${p.x}%`,
      top: `${p.y}%`,
      transform: "translate(-50%, -50%)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -4,
      borderRadius: "50%",
      background: p.urg ? "rgba(255,124,92,0.3)" : "rgba(143,107,52,0.3)",
      animation: `pingMap 2.5s ease-out infinite ${i * 0.4}s`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: p.urg ? "var(--jim-primary)" : "var(--jim-accent)",
      border: "2px solid var(--jim-surface)"
    }
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10.5,
      color: "var(--jim-muted)",
      margin: "6px 2px 0",
      fontWeight: 600
    }
  }, "Plus proche : ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--jim-text)"
    }
  }, "Bastille \xB7 1,2 km")));
};

/* Onboarding progress (anon / nouveau compte) */
const OnboardingProgress = ({
  pct = 60
}) => {
  const steps = [{
    label: "Email vérifié",
    done: true
  }, {
    label: "RPPS validé",
    done: true
  }, {
    label: "CV / spécialités",
    done: true
  }, {
    label: "Photo de profil",
    done: false
  }, {
    label: "Premier message",
    done: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      background: "linear-gradient(135deg, var(--jim-primary-pale) 0%, #fdf2e2 100%)",
      borderRadius: 14,
      marginBottom: 8,
      border: "1px solid rgba(255,124,92,0.18)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      color: "var(--jim-text)",
      margin: 0
    }
  }, "Compl\xE8te ton profil"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: 18,
      color: "var(--jim-primary)",
      letterSpacing: "-0.02em"
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 3,
      background: "rgba(58,31,8,0.08)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: "linear-gradient(90deg, var(--jim-primary), var(--jim-accent))",
      borderRadius: 3,
      transition: "width .6s cubic-bezier(.16,1,.3,1)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 8
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 10,
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 999,
      background: s.done ? "rgba(58,142,89,0.15)" : "var(--jim-surface)",
      color: s.done ? "var(--jim-success)" : "var(--jim-muted)",
      border: "1px solid " + (s.done ? "transparent" : "var(--jim-beige-mid)"),
      textDecoration: s.done ? "none" : "none"
    }
  }, s.done ? /*#__PURE__*/React.createElement(JIcon, {
    name: "check",
    size: 9,
    stroke: 3
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 4,
      borderRadius: "50%",
      background: "var(--jim-muted)"
    }
  }), s.label))));
};

/* Theme toggle */
const ThemeToggle = ({
  value = "light",
  onChange
}) => {
  const opts = [{
    id: "light",
    icon: "sparkle"
  }, {
    id: "dark",
    icon: "shield"
  }, {
    id: "auto",
    icon: "globe"
  }];
  const labels = {
    light: "Clair",
    dark: "Sombre",
    auto: "Auto"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: 2,
      background: "var(--jim-surface-alt)",
      borderRadius: 999,
      border: "1px solid var(--jim-beige-mid)"
    }
  }, opts.map(o => {
    const active = value === o.id;
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      onClick: () => onChange(o.id),
      title: labels[o.id],
      style: {
        border: 0,
        background: active ? "var(--jim-surface)" : "transparent",
        color: active ? "var(--jim-text)" : "var(--jim-muted)",
        padding: "4px 9px",
        borderRadius: 999,
        fontSize: 10.5,
        fontWeight: 700,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        boxShadow: active ? "var(--jim-shadow-sm)" : "none",
        transition: "background .15s, color .15s"
      }
    }, /*#__PURE__*/React.createElement(JIcon, {
      name: o.icon,
      size: 11,
      stroke: 2
    }), labels[o.id]);
  }));
};
const LanguagePicker = ({
  value = "fr",
  onChange
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    padding: 2,
    background: "var(--jim-surface-alt)",
    borderRadius: 999,
    border: "1px solid var(--jim-beige-mid)"
  }
}, [{
  id: "fr",
  l: "FR"
}, {
  id: "en",
  l: "EN"
}].map(o => {
  const active = value === o.id;
  return /*#__PURE__*/React.createElement("button", {
    key: o.id,
    onClick: () => onChange(o.id),
    style: {
      border: 0,
      background: active ? "var(--jim-surface)" : "transparent",
      color: active ? "var(--jim-text)" : "var(--jim-muted)",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 10.5,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      letterSpacing: ".06em",
      boxShadow: active ? "var(--jim-shadow-sm)" : "none",
      transition: "background .15s, color .15s"
    }
  }, o.l);
}));

/* Footer line — compact, 2 zones, no overflow */
const MenuFooter = ({
  theme,
  onTheme,
  lang,
  onLang
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "10px 8px 4px",
    borderTop: "1px solid var(--jim-beige-light)",
    marginTop: 4
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 6
  }
}, /*#__PURE__*/React.createElement(ThemeToggle, {
  value: theme,
  onChange: onTheme
}), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}), /*#__PURE__*/React.createElement(LanguagePicker, {
  value: lang,
  onChange: onLang
})), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 8
  }
}, /*#__PURE__*/React.createElement("a", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 8px",
    borderRadius: 10,
    color: "var(--jim-muted)",
    fontSize: 11.5,
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background .15s, color .15s"
  },
  onMouseEnter: e => {
    e.currentTarget.style.background = "var(--jim-surface-alt)";
    e.currentTarget.style.color = "var(--jim-text)";
  },
  onMouseLeave: e => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = "var(--jim-muted)";
  }
}, /*#__PURE__*/React.createElement(JIcon, {
  name: "help",
  size: 12,
  stroke: 2
}), "Aide"), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}), /*#__PURE__*/React.createElement("button", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 10,
    background: "var(--jim-surface-alt)",
    border: "1px solid var(--jim-beige-mid)",
    color: "var(--jim-text-body)",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background .15s, border-color .15s"
  },
  onMouseEnter: e => {
    e.currentTarget.style.background = "var(--jim-primary-pale)";
    e.currentTarget.style.borderColor = "var(--jim-primary)";
  },
  onMouseLeave: e => {
    e.currentTarget.style.background = "var(--jim-surface-alt)";
    e.currentTarget.style.borderColor = "var(--jim-beige-mid)";
  }
}, /*#__PURE__*/React.createElement("kbd", {
  style: {
    fontFamily: "var(--font-mono)",
    fontSize: 9.5,
    fontWeight: 700,
    padding: "1px 5px",
    borderRadius: 4,
    background: "var(--jim-surface)",
    border: "1px solid var(--jim-beige-mid)",
    color: "var(--jim-primary)"
  }
}, "\u2318K"), "Rechercher")));
Object.assign(window, {
  STATUS_OPTIONS,
  DropdownHeaderA,
  InboxPreview,
  LiveMissions,
  OnboardingProgress,
  ThemeToggle,
  LanguagePicker,
  MenuFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "menu-features.jsx", error: String((e && e.message) || e) }); }

// menu-page.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   JIM Menu — Mock page content
   State-aware backdrop (titulaire / remplacant / anon).
   ============================================================ */

const PageBackdrop = ({
  children,
  position = "top"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: position === "left" ? "row" : "column"
  }
}, children);
const MockDashboard = ({
  offsetTop = 0,
  offsetLeft = 0,
  userState = "titulaire"
}) => {
  if (userState === "anon") return /*#__PURE__*/React.createElement(AnonHero, {
    offsetTop: offsetTop,
    offsetLeft: offsetLeft
  });
  if (userState === "remplacant") return /*#__PURE__*/React.createElement(RemplDashboard, {
    offsetTop: offsetTop,
    offsetLeft: offsetLeft
  });
  return /*#__PURE__*/React.createElement(TitDashboard, {
    offsetTop: offsetTop,
    offsetLeft: offsetLeft
  });
};
const dashWrap = (offsetTop, offsetLeft) => ({
  flex: 1,
  padding: "40px clamp(20px, 4vw, 64px) 80px",
  paddingTop: 40 + offsetTop,
  paddingLeft: `calc(clamp(20px, 4vw, 64px) + ${offsetLeft}px)`,
  maxWidth: "100%",
  overflow: "hidden"
});
const TitDashboard = ({
  offsetTop,
  offsetLeft
}) => /*#__PURE__*/React.createElement("main", {
  style: dashWrap(offsetTop, offsetLeft)
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1280,
    margin: "0 auto"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    marginBottom: 32,
    animation: "itemUp .6s cubic-bezier(.16,1,.3,1) both"
  }
}, /*#__PURE__*/React.createElement("p", {
  className: "eyebrow",
  style: {
    marginBottom: 12
  }
}, "TABLEAU DE BORD \xB7 MARDI 21 AVRIL"), /*#__PURE__*/React.createElement("h1", {
  style: {
    fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
    marginBottom: 8
  }
}, "Bonjour, ", /*#__PURE__*/React.createElement("em", {
  style: {
    fontFamily: "var(--font-serif-italic)",
    fontStyle: "italic",
    color: "var(--jim-primary)",
    fontWeight: 500
  }
}, "Camille"), "."), /*#__PURE__*/React.createElement("p", {
  className: "lead",
  style: {
    color: "var(--jim-muted)",
    maxWidth: 560
  }
}, "3 candidatures \xE0 examiner \xB7 1 contrat pr\xEAt \xE0 signer \xB7 un virement s\xE9questre lib\xE9r\xE9 ce matin.")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 28
  }
}, [{
  k: "Annonces en ligne",
  v: "3",
  d: "+1 cette semaine"
}, {
  k: "Candidatures reçues",
  v: "14",
  d: "9 à examiner"
}, {
  k: "Taux de réponse",
  v: "96%",
  d: "médian 12 min"
}, {
  k: "Rétrocession moyenne",
  v: "72%",
  d: "—"
}].map((s, i) => /*#__PURE__*/React.createElement(StatCard, _extends({
  key: s.k
}, s, {
  delay: 0.08 + i * 0.06
})))), /*#__PURE__*/React.createElement(AnnoncesCard, {
  items: [{
    t: "Remplaçant · cabinet Bastille",
    s: "4 – 18 mai · rétrocession 75%",
    badge: "URGENT",
    badgeTone: "primary",
    cands: 5
  }, {
    t: "Remplaçant week-end · Charonne",
    s: "6 – 7 mai · rétrocession 70%",
    badge: "EN COURS",
    badgeTone: "muted",
    cands: 2
  }, {
    t: "Longue durée · avenue Parmentier",
    s: "1er juin – 31 juillet · rétrocession 72%",
    badge: "POURVUE",
    badgeTone: "success",
    cands: 7
  }]
})));
const RemplDashboard = ({
  offsetTop,
  offsetLeft
}) => /*#__PURE__*/React.createElement("main", {
  style: dashWrap(offsetTop, offsetLeft)
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1280,
    margin: "0 auto"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    marginBottom: 32,
    animation: "itemUp .6s cubic-bezier(.16,1,.3,1) both"
  }
}, /*#__PURE__*/React.createElement("p", {
  className: "eyebrow",
  style: {
    marginBottom: 12
  }
}, "MISSIONS \xB7 50 KM \xB7 TEMPS R\xC9EL"), /*#__PURE__*/React.createElement("h1", {
  style: {
    fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
    marginBottom: 8
  }
}, "Salut, ", /*#__PURE__*/React.createElement("em", {
  style: {
    fontFamily: "var(--font-serif-italic)",
    fontStyle: "italic",
    color: "var(--jim-primary)",
    fontWeight: 500
  }
}, "L\xE9o"), "."), /*#__PURE__*/React.createElement("p", {
  className: "lead",
  style: {
    color: "var(--jim-muted)",
    maxWidth: 560
  }
}, "12 missions pr\xE8s de toi cette semaine \xB7 2 conversations actives \xB7 1 contrat \xE0 signer.")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 28
  }
}, [{
  k: "Missions proches",
  v: "12",
  d: "rayon 50 km"
}, {
  k: "Mes candidatures",
  v: "5",
  d: "2 en attente"
}, {
  k: "Rétrocession ce mois",
  v: "1 240 €",
  d: "+18% vs mars"
}, {
  k: "Disponibilités",
  v: "12 j",
  d: "ce mois"
}].map((s, i) => /*#__PURE__*/React.createElement(StatCard, _extends({
  key: s.k
}, s, {
  delay: 0.08 + i * 0.06
})))), /*#__PURE__*/React.createElement(AnnoncesCard, {
  title: "Missions pr\xE8s de toi",
  subtitle: "Tri\xE9es par distance",
  items: [{
    t: "Cabinet Bastille — Paris 11ᵉ",
    s: "4 – 18 mai · 75% · 1,2 km",
    badge: "URGENT",
    badgeTone: "primary",
    cands: "Postuler"
  }, {
    t: "Cabinet Charonne — Paris 20ᵉ",
    s: "6 – 7 mai · 70% · 2,8 km",
    badge: "WEEK-END",
    badgeTone: "muted",
    cands: "Postuler"
  }, {
    t: "Avenue Parmentier — Paris 11ᵉ",
    s: "1er juin – 31 juil · 72% · 0,9 km",
    badge: "LONGUE",
    badgeTone: "success",
    cands: "Postuler"
  }]
})));
const AnonHero = ({
  offsetTop,
  offsetLeft
}) => /*#__PURE__*/React.createElement("main", {
  style: {
    ...dashWrap(offsetTop, offsetLeft),
    paddingTop: 60 + offsetTop
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1280,
    margin: "0 auto",
    textAlign: "left"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    animation: "itemUp .7s cubic-bezier(.16,1,.3,1) both",
    maxWidth: 920
  }
}, /*#__PURE__*/React.createElement("p", {
  className: "eyebrow",
  style: {
    marginBottom: 16
  }
}, "JIM \xB7 MARKETPLACE KIN\xC9 \xB7 GRATUIT AU LANCEMENT"), /*#__PURE__*/React.createElement("h1", {
  style: {
    fontSize: "clamp(2.5rem, 6vw, 5rem)",
    marginBottom: 20,
    textWrap: "pretty"
  }
}, "Le cabinet\xA0", /*#__PURE__*/React.createElement("em", {
  style: {
    fontFamily: "var(--font-serif-italic)",
    fontStyle: "italic",
    color: "var(--jim-primary)",
    fontWeight: 500
  }
}, "ne s'arr\xEAte pas"), "\xA0quand vous partez."), /*#__PURE__*/React.createElement("p", {
  className: "lead",
  style: {
    color: "var(--jim-text-body)",
    maxWidth: 620,
    marginBottom: 24,
    fontSize: "1.1rem"
  }
}, "Marketplace entre kin\xE9sith\xE9rapeutes v\xE9rifi\xE9s RPPS. Contrat int\xE9gr\xE9, paiement s\xE9questre, z\xE9ro commission."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 32
  }
}, /*#__PURE__*/React.createElement("button", {
  style: {
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "14px 22px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(255,124,92,0.35)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8
  }
}, "Cr\xE9er un compte ", /*#__PURE__*/React.createElement(JIcon, {
  name: "arrow",
  size: 14,
  stroke: 2.5
})), /*#__PURE__*/React.createElement("button", {
  style: {
    background: "transparent",
    color: "var(--jim-text)",
    border: "1px solid var(--jim-beige-mid)",
    padding: "14px 22px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer"
  }
}, "Comment \xE7a marche")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 18,
    flexWrap: "wrap"
  }
}, ["Vérifié RPPS", "Contrat intégré", "Paiement séquestre", "0% commission"].map(t => /*#__PURE__*/React.createElement("span", {
  key: t,
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".12em"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "var(--jim-success-bg)",
    color: "var(--jim-success)",
    display: "grid",
    placeItems: "center"
  }
}, /*#__PURE__*/React.createElement(JIcon, {
  name: "check",
  size: 10,
  stroke: 3
})), t))))));
const StatCard = ({
  k,
  v,
  d,
  delay = 0
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--jim-surface)",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 20,
    padding: 18,
    boxShadow: "var(--jim-shadow-sm)",
    animation: `itemUp .55s cubic-bezier(.16,1,.3,1) ${delay}s both`
  }
}, /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".12em",
    margin: 0
  }
}, k), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 36,
    fontWeight: 800,
    color: "var(--jim-text)",
    margin: "8px 0 4px",
    letterSpacing: "-0.03em"
  }
}, v), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 12,
    color: "var(--jim-muted)",
    margin: 0
  }
}, d));
const AnnoncesCard = ({
  items,
  title = "Tes annonces",
  subtitle = "Cliquées 284 fois cette semaine"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(255,255,255,0.55)",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 28,
    padding: 24,
    animation: "itemUp .6s cubic-bezier(.16,1,.3,1) .4s both"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
  style: {
    marginBottom: 4
  }
}, title), /*#__PURE__*/React.createElement("p", {
  style: {
    color: "var(--jim-muted)",
    fontSize: 13
  }
}, subtitle)), /*#__PURE__*/React.createElement("button", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "var(--jim-surface-alt)",
    border: "1px solid var(--jim-beige-mid)",
    color: "var(--jim-text)",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement(JIcon, {
  name: "filter",
  size: 13
}), " Filtres")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gap: 12
  }
}, items.map((a, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 16px",
    background: "var(--jim-surface)",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 18
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "var(--jim-primary-pale)",
    display: "grid",
    placeItems: "center",
    color: "var(--jim-primary)",
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement(JIcon, {
  name: "briefcase",
  size: 20
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--jim-text)",
    marginBottom: 2
  }
}, a.t), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 12,
    color: "var(--jim-muted)"
  }
}, a.s)), /*#__PURE__*/React.createElement("span", {
  style: {
    background: a.badgeTone === "primary" ? "var(--jim-primary)" : a.badgeTone === "success" ? "var(--jim-success)" : "var(--jim-beige-dark)",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: ".08em"
  }
}, a.badge), /*#__PURE__*/React.createElement("span", {
  style: {
    background: typeof a.cands === "string" ? "var(--jim-primary)" : "var(--jim-surface-alt)",
    color: typeof a.cands === "string" ? "#fff" : "var(--jim-text)",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer"
  }
}, typeof a.cands === "string" ? a.cands : `${a.cands} candidatures`)))));
Object.assign(window, {
  PageBackdrop,
  MockDashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "menu-page.jsx", error: String((e && e.message) || e) }); }

// menu-shared.jsx
try { (() => {
/* ============================================================
   JIM Menu — Shared helpers
   - Lucide icons (inline SVG paths)
   - User states : anon / titulaire / remplacant
   - Menu sections per state
   ============================================================ */

const JIcon = ({
  name,
  size = 18,
  stroke = 1.8,
  style = {}
}) => {
  const p = JIcon.paths[name];
  if (!p) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      ...style
    }
  }, p);
};
JIcon.paths = {
  briefcase: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "7",
    width: "20",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
  })),
  plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  msg: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
  })),
  bell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.73 21a2 2 0 0 1-3.46 0"
  })),
  wallet: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 11h8v6h-8a3 3 0 0 1 0-6z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "14",
    r: "1.2",
    fill: "currentColor"
  })),
  user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  settings: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  })),
  logout: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16 17 21 12 16 7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12"
  })),
  chev: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })),
  chevR: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "9 6 15 12 9 18"
  })),
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })),
  menu: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  })),
  check: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })),
  pin: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  cal: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "10",
    x2: "21",
    y2: "10"
  })),
  help: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  })),
  shield: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  })),
  zap: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
    points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
  })),
  arrow: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })),
  arrowUp: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "7",
    y1: "17",
    x2: "17",
    y2: "7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 7 17 7 17 17"
  })),
  arrowDown: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "17",
    y1: "7",
    x2: "7",
    y2: "17"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 17 7 17 7 7"
  })),
  sparkle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l1.9 5.1 5.1 1.9-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"
  })),
  filter: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
    points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
  })),
  stetho: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20",
    cy: "10",
    r: "2"
  })),
  globe: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "12",
    x2: "22",
    y2: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
  })),
  star: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
    points: "12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"
  })),
  doc: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "13",
    x2: "15",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "17",
    x2: "13",
    y2: "17"
  }))
};

/* ─── User states ───────────────────────────────── */
const USER_STATES = {
  anon: {
    state: "anon",
    name: "Visiteur",
    role: "Non connecté",
    initials: "?",
    rppsVerified: false,
    notifs: {
      messages: 0,
      total: 0
    },
    eyebrow: "VISITEUR",
    location: "France"
  },
  titulaire: {
    state: "titulaire",
    name: "Dr Camille Moreau",
    role: "Titulaire",
    initials: "CM",
    rppsVerified: true,
    notifs: {
      messages: 3,
      total: 7
    },
    eyebrow: "TITULAIRE · PARIS 11ᵉ",
    location: "Paris 11ᵉ"
  },
  remplacant: {
    state: "remplacant",
    name: "Léo Vasseur",
    role: "Remplaçant",
    initials: "LV",
    rppsVerified: true,
    notifs: {
      messages: 2,
      total: 4
    },
    eyebrow: "REMPLAÇANT · 50 KM PARIS",
    location: "Île-de-France"
  }
};

/* Default current user (overridden by app shell at runtime) */
let USER = USER_STATES.titulaire;

/* Menu sections per state */
const MENU_SECTIONS_BY_STATE = {
  anon: [{
    label: "Découvrir",
    items: [{
      id: "comment",
      icon: "sparkle",
      title: "Comment ça marche",
      sub: "RPPS, contrat, paiement séquestre"
    }, {
      id: "remplacant",
      icon: "stetho",
      title: "Espace remplaçant",
      sub: "Trouver des missions près de chez toi"
    }, {
      id: "titulaire",
      icon: "briefcase",
      title: "Espace titulaire",
      sub: "Publier une annonce en 3 minutes"
    }]
  }, {
    label: "Compte",
    items: [{
      id: "login",
      icon: "user",
      title: "Se connecter",
      sub: "Avec ton numéro RPPS",
      cta: true
    }, {
      id: "signup",
      icon: "plus",
      title: "Créer un compte",
      sub: "Gratuit · vérifié sous 24h"
    }, {
      id: "help",
      icon: "help",
      title: "Aide & contact",
      sub: "FAQ et support"
    }]
  }],
  titulaire: [{
    label: "Activité",
    items: [{
      id: "publier",
      icon: "plus",
      title: "Publier une annonce",
      sub: "Trouver un remplaçant en < 48h",
      cta: true
    }, {
      id: "annonces",
      icon: "briefcase",
      title: "Mes annonces",
      sub: "3 en cours · 1 pourvue",
      badge: "3"
    }, {
      id: "messages",
      icon: "msg",
      title: "Messagerie",
      sub: "3 nouveaux messages",
      badge: "3",
      urgent: true
    }, {
      id: "candidats",
      icon: "user",
      title: "Candidatures",
      sub: "9 à examiner"
    }]
  }, {
    label: "Gestion",
    items: [{
      id: "paiements",
      icon: "wallet",
      title: "Paiements & facturation",
      sub: "2 virements en attente"
    }, {
      id: "contrat",
      icon: "doc",
      title: "Mes contrats",
      sub: "1 prêt à signer"
    }, {
      id: "compte",
      icon: "user",
      title: "Mon compte",
      sub: "Profil, RPPS, cabinet"
    }, {
      id: "params",
      icon: "settings",
      title: "Paramètres",
      sub: "Notifs, langue, sécurité"
    }]
  }],
  remplacant: [{
    label: "Missions",
    items: [{
      id: "carte",
      icon: "pin",
      title: "Carte des missions",
      sub: "12 dans un rayon de 50 km",
      cta: true
    }, {
      id: "favoris",
      icon: "star",
      title: "Mes favoris",
      sub: "4 annonces sauvegardées",
      badge: "4"
    }, {
      id: "candidats",
      icon: "briefcase",
      title: "Mes candidatures",
      sub: "2 en attente · 1 acceptée",
      badge: "2"
    }, {
      id: "messages",
      icon: "msg",
      title: "Messagerie",
      sub: "2 conversations actives",
      badge: "2",
      urgent: true
    }]
  }, {
    label: "Profil",
    items: [{
      id: "dispos",
      icon: "cal",
      title: "Mes disponibilités",
      sub: "12 jours libres ce mois"
    }, {
      id: "paiements",
      icon: "wallet",
      title: "Mes rétrocessions",
      sub: "1 240 € ce mois"
    }, {
      id: "compte",
      icon: "user",
      title: "Mon profil",
      sub: "RPPS, spécialités, CV"
    }, {
      id: "params",
      icon: "settings",
      title: "Paramètres",
      sub: "Rayon, alertes, langue"
    }]
  }]
};

/* Set the active user — called by the app shell on tweak change */
function setActiveUser(stateKey) {
  USER = USER_STATES[stateKey] || USER_STATES.titulaire;
  window.USER = USER;
  return USER;
}

/* Avatar */
const Avatar = ({
  size = 36,
  initials,
  withRing = false,
  style = {},
  anon = false
}) => {
  const u = window.USER || USER;
  const txt = initials || u.initials;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9999,
      background: anon ? "linear-gradient(135deg, var(--jim-beige-mid) 0%, var(--jim-beige-dark) 100%)" : "linear-gradient(135deg, var(--jim-primary) 0%, var(--jim-accent) 100%)",
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.38,
      fontWeight: 700,
      lineHeight: 1,
      fontFamily: "var(--font-sans)",
      letterSpacing: "0.02em",
      boxShadow: withRing ? "0 0 0 3px var(--jim-background), 0 0 0 5px var(--jim-primary-soft)" : "none",
      flexShrink: 0,
      transition: "box-shadow .2s, background .25s",
      ...style
    }
  }, txt);
};
const PulseDot = ({
  size = 8,
  color = "var(--jim-primary)"
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    position: "relative",
    display: "inline-block",
    width: size,
    height: size,
    borderRadius: 999,
    background: color,
    animation: "pulseDot 2s ease-in-out infinite"
  }
});
const CountBadge = ({
  value,
  tone = "primary",
  size = "md"
}) => {
  const bg = tone === "primary" ? "var(--jim-primary)" : tone === "success" ? "var(--jim-success)" : "var(--jim-muted)";
  const s = size === "sm" ? {
    h: 16,
    f: 10,
    px: 5
  } : {
    h: 20,
    f: 11,
    px: 7
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: bg,
      color: "#fff",
      fontWeight: 800,
      fontSize: s.f,
      lineHeight: 1,
      height: s.h,
      minWidth: s.h,
      padding: `0 ${s.px}px`,
      borderRadius: 999,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, value);
};
const RppsChip = ({
  compact = false
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: compact ? "2px 7px" : "3px 9px",
    borderRadius: 999,
    background: "var(--jim-success-bg)",
    color: "#2d5e36",
    fontSize: compact ? 10 : 11,
    fontWeight: 700,
    letterSpacing: ".02em"
  }
}, /*#__PURE__*/React.createElement(JIcon, {
  name: "check",
  size: compact ? 10 : 12,
  stroke: 2.5
}), "RPPS v\xE9rifi\xE9");

/* ALL_ITEMS getter — recomputed on user change */
function getMenuSections() {
  const u = window.USER || USER;
  return MENU_SECTIONS_BY_STATE[u.state] || MENU_SECTIONS_BY_STATE.titulaire;
}
function getAllItems() {
  return getMenuSections().flatMap(s => s.items.map(it => ({
    ...it,
    section: s.label
  })));
}
Object.assign(window, {
  JIcon,
  USER,
  USER_STATES,
  setActiveUser,
  MENU_SECTIONS_BY_STATE,
  getMenuSections,
  getAllItems,
  Avatar,
  PulseDot,
  CountBadge,
  RppsChip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "menu-shared.jsx", error: String((e && e.message) || e) }); }

// menu-variant-a.jsx
try { (() => {
/* ============================================================
   JIM Menu — VARIANT A · "Navbar + dropdown éditorial"
   - Top nav OR left rail
   - Avatar dropdown : header gradient corail + Fraunces pivot,
     items staggered, hover translateX, sliding underline on links
   - Bell popover with timeline ticks
   - Anon state : "Se connecter" CTA replaces avatar
   ============================================================ */

const VariantA = ({
  position = "top",
  onOpenChange,
  menuOpen,
  userState
}) => {
  const u = window.USER;
  const sections = getMenuSections();
  const [bellOpen, setBellOpen] = React.useState(false);
  const [active, setActive] = React.useState(sections[0]?.items[1]?.id || sections[0]?.items[0]?.id);
  const [status, setStatus] = React.useState("dispo");
  const [theme, setTheme] = React.useState("light");
  const [lang, setLang] = React.useState("fr");
  const userOpen = !!menuOpen;
  const setUserOpen = v => onOpenChange && onOpenChange(!!v);
  const isAnon = userState === "anon";
  const isTop = position === "top";
  const isRempl = userState === "remplacant";
  React.useEffect(() => {
    setActive(sections[0]?.items[1]?.id || sections[0]?.items[0]?.id);
  }, [userState]);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    const onDoc = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setBellOpen(false);
        onOpenChange && onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onOpenChange]);
  const topLinks = isAnon ? [{
    id: "remplacant",
    label: "Remplaçant"
  }, {
    id: "titulaire",
    label: "Titulaire"
  }, {
    id: "tarifs",
    label: "Tarifs"
  }, {
    id: "comment",
    label: "Comment ça marche"
  }] : userState === "titulaire" ? [{
    id: "annonces",
    label: "Mes annonces"
  }, {
    id: "candidats",
    label: "Candidatures",
    badge: 9
  }, {
    id: "messages",
    label: "Messagerie",
    badge: u.notifs.messages
  }, {
    id: "paiements",
    label: "Paiements"
  }] : [{
    id: "carte",
    label: "Carte"
  }, {
    id: "candidats",
    label: "Candidatures",
    badge: 2
  }, {
    id: "messages",
    label: "Messagerie",
    badge: u.notifs.messages
  }, {
    id: "dispos",
    label: "Dispos"
  }];
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      position: isTop ? "sticky" : "fixed",
      top: 0,
      left: 0,
      width: isTop ? "100%" : 260,
      height: isTop ? "auto" : "100vh",
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
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
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      paddingBottom: isTop ? 0 : 14,
      borderBottom: !isTop ? "1px solid var(--jim-beige-mid)" : "none",
      marginBottom: !isTop ? 8 : 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-jim.svg",
    alt: "JIM",
    style: {
      height: 28,
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: isTop ? "row" : "column",
      alignItems: isTop ? "center" : "stretch",
      gap: 2,
      flex: isTop ? 0 : 1,
      marginLeft: isTop ? 24 : 0
    }
  }, topLinks.map(l => /*#__PURE__*/React.createElement(NavLinkA, {
    key: l.id,
    link: l,
    active: active === l.id,
    vertical: !isTop,
    onClick: () => setActive(l.id)
  }))), isTop && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: isTop ? "row" : "column",
      alignItems: isTop ? "center" : "stretch",
      gap: isTop ? 8 : 8,
      marginTop: !isTop ? "auto" : 0
    }
  }, !isAnon && /*#__PURE__*/React.createElement("button", {
    style: styleA.cta(isTop)
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "plus",
    size: 15,
    stroke: 2.5
  }), /*#__PURE__*/React.createElement("span", null, userState === "titulaire" ? "Publier" : "Postuler")), isTop && !isAnon && /*#__PURE__*/React.createElement("button", {
    style: styleA.iconBtn,
    onClick: () => {
      setBellOpen(!bellOpen);
      setUserOpen(false);
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "bell",
    size: 17,
    stroke: 1.9
  }), u.notifs.total > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 6,
      right: 6,
      minWidth: 16,
      height: 16,
      padding: "0 4px",
      background: "var(--jim-primary)",
      color: "#fff",
      borderRadius: 999,
      fontSize: 9,
      fontWeight: 800,
      display: "grid",
      placeItems: "center",
      border: "2px solid var(--jim-background)"
    }
  }, u.notifs.total)), isAnon ? /*#__PURE__*/React.createElement("button", {
    style: styleA.cta(isTop),
    onClick: () => setUserOpen(true)
  }, /*#__PURE__*/React.createElement("span", null, "Se connecter"), /*#__PURE__*/React.createElement(JIcon, {
    name: "arrow",
    size: 14,
    stroke: 2.5
  })) : /*#__PURE__*/React.createElement("button", {
    style: styleA.avatarBtn(isTop, userOpen),
    onClick: () => {
      setUserOpen(!userOpen);
      setBellOpen(false);
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: isTop ? 34 : 36,
    withRing: userOpen
  }), !isTop && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "left",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--jim-text)",
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, u.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      margin: "2px 0 0"
    }
  }, u.role)), !isTop && /*#__PURE__*/React.createElement(JIcon, {
    name: "chev",
    size: 14,
    style: {
      transition: "transform .25s",
      transform: userOpen ? "rotate(180deg)" : "none",
      color: "var(--jim-muted)"
    }
  })))), bellOpen && !isAnon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: isTop ? "calc(100% + 10px)" : 20,
      right: isTop ? 130 : "auto",
      left: isTop ? "auto" : "calc(100% + 10px)",
      width: 380,
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      borderRadius: 22,
      boxShadow: "var(--jim-shadow-xl)",
      padding: 8,
      zIndex: 60,
      animation: "dropdownIn .22s cubic-bezier(.34,1.56,.64,1) both",
      transformOrigin: "top right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px 10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: "var(--jim-text)",
      margin: 0
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--jim-primary)",
      cursor: "pointer"
    }
  }, "Tout marquer lu")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--jim-beige-light)",
      marginBottom: 4
    }
  }), [{
    t: "Nouveau message — Nadia B.",
    s: "« Je peux le 12-14 mai si ça te va »",
    tone: "msg",
    time: "2 min"
  }, {
    t: "Candidature acceptée",
    s: "Annonce Bastille · contrat prêt",
    tone: "ok",
    time: "1 h"
  }, {
    t: "Virement séquestre libéré",
    s: "820 € · Remplacement Charonne",
    tone: "pay",
    time: "3 h"
  }].map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      padding: "11px 12px",
      borderRadius: 14,
      cursor: "pointer",
      position: "relative",
      animation: `itemIn .28s cubic-bezier(.16,1,.3,1) ${0.05 + i * 0.05}s both`
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--jim-surface-alt)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: n.tone === "msg" ? "var(--jim-primary-pale)" : n.tone === "ok" ? "var(--jim-success-bg)" : "var(--jim-warning-bg)",
      color: n.tone === "msg" ? "var(--jim-primary)" : n.tone === "ok" ? "var(--jim-success)" : "var(--jim-warning)",
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: n.tone === "msg" ? "msg" : n.tone === "ok" ? "check" : "wallet",
    size: 16,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--jim-text)",
      margin: 0
    }
  }, n.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      margin: "2px 0 0",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, n.s)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--jim-muted)",
      fontWeight: 600,
      flexShrink: 0
    }
  }, n.time)))), userOpen && /*#__PURE__*/React.createElement("div", {
    style: {
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
      padding: 10,
      zIndex: 60,
      animation: "dropdownIn .26s cubic-bezier(.34,1.56,.64,1) both",
      transformOrigin: "top right",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(DropdownHeaderA, {
    isAnon: isAnon,
    u: u,
    status: status,
    onStatus: setStatus
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      overflowX: "hidden",
      flex: 1,
      paddingRight: 2,
      marginRight: -2
    }
  }, isAnon && /*#__PURE__*/React.createElement(OnboardingProgress, {
    pct: 60
  }), isRempl && /*#__PURE__*/React.createElement(LiveMissions, null), !isAnon && /*#__PURE__*/React.createElement(InboxPreview, null), sections.map((sec, si) => /*#__PURE__*/React.createElement("div", {
    key: sec.label,
    style: {
      padding: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: "var(--jim-muted)",
      textTransform: "uppercase",
      letterSpacing: ".18em",
      padding: "6px 12px 4px",
      margin: 0,
      animation: `itemIn .25s cubic-bezier(.16,1,.3,1) ${0.04 + si * 0.03}s both`
    }
  }, sec.label), sec.items.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: it.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 14,
      cursor: "pointer",
      textDecoration: "none",
      position: "relative",
      transition: "background .15s, transform .2s, padding .2s",
      animation: `itemIn .3s cubic-bezier(.16,1,.3,1) ${0.08 + si * 0.08 + i * 0.04}s both`
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = it.cta ? "var(--jim-primary-pale)" : "var(--jim-surface-alt)";
      e.currentTarget.style.paddingLeft = "16px";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.paddingLeft = "12px";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: it.cta ? "var(--jim-primary)" : "var(--jim-surface-alt)",
      color: it.cta ? "#fff" : "var(--jim-text-body)",
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      boxShadow: it.cta ? "0 4px 14px rgba(255,124,92,0.35)" : "none"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: it.icon,
    size: 17,
    stroke: it.cta ? 2.4 : 1.9
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: "var(--jim-text)",
      margin: 0
    }
  }, it.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      margin: "2px 0 0",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, it.sub)), it.badge && /*#__PURE__*/React.createElement(CountBadge, {
    value: it.badge,
    size: "sm"
  }), it.urgent && /*#__PURE__*/React.createElement(PulseDot, {
    size: 6
  }))))), !isAnon && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--jim-beige-light)",
      margin: "6px 8px"
    }
  }), /*#__PURE__*/React.createElement("a", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 14,
      cursor: "pointer",
      color: "var(--jim-muted)",
      animation: "itemIn .3s cubic-bezier(.16,1,.3,1) .45s both"
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = "var(--jim-destructive-bg)";
      e.currentTarget.style.color = "var(--jim-destructive)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "var(--jim-muted)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "var(--jim-surface-alt)",
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "logout",
    size: 16,
    stroke: 1.9
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      margin: 0
    }
  }, "Se d\xE9connecter")))), /*#__PURE__*/React.createElement(MenuFooter, {
    theme: theme,
    onTheme: setTheme,
    lang: lang,
    onLang: setLang
  })));
};
const NavLinkA = ({
  link,
  active,
  onClick,
  vertical
}) => {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: e => {
      e.preventDefault();
      onClick();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: vertical ? "11px 14px" : "10px 14px",
      fontSize: 13.5,
      fontWeight: active ? 700 : 600,
      color: active ? "var(--jim-primary)" : "var(--jim-text-body)",
      background: active ? "var(--jim-primary-pale)" : "transparent",
      borderRadius: 12,
      cursor: "pointer",
      textDecoration: "none",
      transition: "background .2s, color .2s"
    }
  }, /*#__PURE__*/React.createElement("span", null, link.label), link.badge && /*#__PURE__*/React.createElement("span", {
    style: {
      background: active ? "var(--jim-primary)" : "var(--jim-text)",
      color: "#fff",
      fontSize: 10,
      fontWeight: 800,
      minWidth: 16,
      height: 16,
      padding: "0 5px",
      borderRadius: 999,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, link.badge), !vertical && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 14,
      right: 14,
      bottom: 4,
      height: 2,
      borderRadius: 1,
      background: "var(--jim-primary)",
      transform: hover && !active ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left",
      transition: "transform .3s cubic-bezier(.16,1,.3,1)"
    }
  }));
};
const styleA = {
  cta: top => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: top ? "10px 16px" : "12px 16px",
    borderRadius: top ? 12 : 14,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(255,124,92,0.35)",
    transition: "transform .18s, box-shadow .18s"
  }),
  iconBtn: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "var(--jim-surface)",
    border: "1px solid var(--jim-beige-mid)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--jim-text)"
  },
  avatarBtn: (top, open) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: top ? 2 : "8px 10px",
    borderRadius: top ? 999 : 14,
    border: top ? "none" : "1px solid var(--jim-beige-mid)",
    background: top ? "transparent" : open ? "var(--jim-surface-alt)" : "var(--jim-surface)",
    cursor: "pointer"
  })
};
Object.assign(window, {
  VariantA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "menu-variant-a.jsx", error: String((e && e.message) || e) }); }

// menu-variant-b.jsx
try { (() => {
/* ============================================================
   JIM Menu — VARIANT B · "Plein-écran éditorial"
   - Compact navbar with hamburger → X morph
   - Full-screen overlay : huge typographic menu, Fraunces accents,
     coral blob choreography, hover reveals supplementary info card
   - Items numbered 01 / 02 / 03 (editorial magazine vibe)
   - State-aware (anon = "Connexion / Création", logged = full menu)
   ============================================================ */

const VariantB = ({
  position = "top",
  onOpenChange,
  menuOpen,
  userState
}) => {
  const u = window.USER;
  const isAnon = userState === "anon";
  const sections = getMenuSections();
  const items = sections.flatMap(s => s.items.map(it => ({
    ...it,
    section: s.label
  })));
  const [hoverId, setHoverId] = React.useState(null);
  const open = !!menuOpen;
  const setOpen = v => onOpenChange && onOpenChange(!!v);
  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);
  const isTop = position === "top";
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const hovered = items.find(it => it.id === hoverId);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    style: {
      position: isTop ? "sticky" : "fixed",
      top: 0,
      left: 0,
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
      zIndex: open ? 100 : 50
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-jim.svg",
    alt: "JIM",
    style: {
      height: 26
    }
  })), isTop && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      fontSize: 10,
      letterSpacing: ".22em"
    }
  }, u.eyebrow)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: isTop ? "row" : "column",
      alignItems: "center",
      gap: 10,
      marginTop: isTop ? 0 : "auto"
    }
  }, isTop && !isAnon && /*#__PURE__*/React.createElement("button", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "var(--jim-primary)",
      color: "#fff",
      border: 0,
      padding: "10px 16px",
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(255,124,92,0.35)"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "plus",
    size: 15,
    stroke: 2.5
  }), userState === "titulaire" ? "Publier" : "Postuler"), /*#__PURE__*/React.createElement("button", {
    onClick: toggle,
    "aria-expanded": open,
    "aria-label": open ? "Fermer le menu" : "Ouvrir le menu",
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: open ? "var(--jim-text)" : "var(--jim-surface)",
      color: open ? "#fff" : "var(--jim-text)",
      border: "1px solid " + (open ? "var(--jim-text)" : "var(--jim-beige-mid)"),
      padding: isTop ? "9px 14px 9px 12px" : "10px",
      borderRadius: isTop ? 999 : 14,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      transition: "background .25s, color .25s, border-color .25s"
    }
  }, /*#__PURE__*/React.createElement(HamburgerX, {
    open: open
  }), isTop && /*#__PURE__*/React.createElement("span", null, open ? "Fermer" : "Menu"), isTop && !open && !isAnon && /*#__PURE__*/React.createElement(Avatar, {
    size: 26
  }), isTop && !open && isAnon && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--jim-muted)"
    }
  }, "Connexion"), isTop && !open && !isAnon && u.notifs.total > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -3,
      right: -3,
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      background: "var(--jim-primary)",
      color: "#fff",
      border: "2px solid var(--jim-background)",
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 800,
      display: "grid",
      placeItems: "center"
    }
  }, u.notifs.total)))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 90,
      background: "var(--jim-background)",
      animation: "overlayIn .35s cubic-bezier(.16,1,.3,1) both",
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "-15%",
      right: "-10%",
      width: 720,
      height: 720,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,124,92,0.28), transparent 65%)",
      filter: "blur(50px)",
      animation: "blobFloat 10s ease-in-out infinite",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "-15%",
      left: "-12%",
      width: 560,
      height: 560,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(245,184,106,0.22), transparent 65%)",
      filter: "blur(50px)",
      animation: "blobFloat 12s ease-in-out infinite reverse",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(58,31,8,1) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
      opacity: 0.05,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: 1320,
      margin: "0 auto",
      padding: "clamp(20px, 4vw, 48px)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "clamp(28px, 5vh, 52px)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-jim.svg",
    alt: "JIM",
    style: {
      height: 32
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: close,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: "var(--jim-text)",
      color: "#fff",
      border: 0,
      padding: "10px 14px 10px 18px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Fermer", /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.15)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "x",
    size: 13,
    stroke: 2.5
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "clamp(20px, 4vh, 40px)",
      animation: "itemUp .6s cubic-bezier(.16,1,.3,1) .05s both"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow",
    style: {
      marginBottom: 14
    }
  }, isAnon ? "BIENVENUE SUR JIM" : "MENU PRINCIPAL"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
      fontWeight: 800,
      letterSpacing: "-0.04em",
      lineHeight: 0.98,
      color: "var(--jim-text)",
      margin: 0,
      maxWidth: 1100,
      textWrap: "pretty"
    }
  }, isAnon ? /*#__PURE__*/React.createElement(React.Fragment, null, "Le cabinet,\xA0", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 500,
      color: "var(--jim-primary)"
    }
  }, "enfin simple"), ".") : userState === "titulaire" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Bonjour,\xA0", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 500,
      color: "var(--jim-primary)"
    }
  }, "Camille"), ". Que veux-tu faire\xA0?") : /*#__PURE__*/React.createElement(React.Fragment, null, "Salut,\xA0", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 500,
      color: "var(--jim-primary)"
    }
  }, "L\xE9o"), ". Direction le terrain\xA0?"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) minmax(0, 360px)",
      gap: 40,
      flex: 1,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, sections.map((sec, si) => /*#__PURE__*/React.createElement("div", {
    key: sec.label,
    style: {
      marginBottom: si === sections.length - 1 ? 0 : 28
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: "var(--jim-muted)",
      textTransform: "uppercase",
      letterSpacing: ".22em",
      margin: "0 0 8px",
      animation: `itemUp .4s cubic-bezier(.16,1,.3,1) ${0.1 + si * 0.1}s both`
    }
  }, sec.label), sec.items.map((it, i) => {
    const idx = items.indexOf(items.find(x => x.id === it.id));
    const num = String(idx + 1).padStart(2, "0");
    const isHover = hoverId === it.id;
    return /*#__PURE__*/React.createElement("a", {
      key: it.id,
      onMouseEnter: () => setHoverId(it.id),
      onMouseLeave: () => setHoverId(null),
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        padding: "14px 0",
        borderBottom: "1px solid rgba(58,31,8,0.08)",
        cursor: "pointer",
        textDecoration: "none",
        position: "relative",
        animation: `itemUp .5s cubic-bezier(.34,1.56,.64,1) ${0.15 + si * 0.08 + i * 0.05}s both`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: isHover ? "var(--jim-primary)" : "var(--jim-muted)",
        fontFamily: "var(--font-mono)",
        letterSpacing: ".05em",
        transition: "color .2s",
        minWidth: 26
      }
    }, num), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        lineHeight: 1.05,
        color: isHover ? "var(--jim-primary)" : "var(--jim-text)",
        transform: isHover ? "translateX(8px)" : "translateX(0)",
        transition: "color .25s, transform .35s cubic-bezier(.34,1.56,.64,1)"
      }
    }, it.title, it.cta && /*#__PURE__*/React.createElement("em", {
      style: {
        fontFamily: "var(--font-serif-italic)",
        fontStyle: "italic",
        fontWeight: 500,
        color: "var(--jim-primary)",
        marginLeft: 12,
        fontSize: "0.6em"
      }
    }, "\xB7 sugg\xE9r\xE9")), it.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        padding: "4px 10px",
        background: "var(--jim-primary)",
        color: "#fff",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800
      }
    }, it.badge), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: isHover ? "var(--jim-primary)" : "transparent",
        color: isHover ? "#fff" : "var(--jim-muted)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        transform: isHover ? "translate(4px, -4px) rotate(-12deg)" : "translate(0,0) rotate(0)",
        transition: "transform .35s cubic-bezier(.34,1.56,.64,1), background .2s, color .2s"
      }
    }, /*#__PURE__*/React.createElement(JIcon, {
      name: "arrowUp",
      size: 16,
      stroke: 2.5
    })));
  })))), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 24,
      animation: "itemUp .55s cubic-bezier(.16,1,.3,1) .25s both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      borderRadius: 26,
      padding: 24,
      boxShadow: "var(--jim-shadow-lg)",
      position: "relative",
      overflow: "hidden",
      minHeight: 380
    }
  }, !isAnon && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 18,
      paddingBottom: 18,
      borderBottom: "1px solid var(--jim-beige-light)"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "var(--jim-text)",
      margin: 0
    }
  }, u.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      margin: "2px 0 4px",
      fontWeight: 600
    }
  }, u.role, " \xB7 ", u.location), /*#__PURE__*/React.createElement(RppsChip, {
    compact: true
  }))), hovered ? /*#__PURE__*/React.createElement("div", {
    key: hovered.id,
    style: {
      animation: "itemUp .3s ease-out both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: hovered.cta ? "var(--jim-primary)" : "var(--jim-primary-pale)",
      color: hovered.cta ? "#fff" : "var(--jim-primary)",
      display: "grid",
      placeItems: "center",
      marginBottom: 16,
      boxShadow: hovered.cta ? "0 8px 24px rgba(255,124,92,0.4)" : "none"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: hovered.icon,
    size: 26,
    stroke: 2
  })), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, hovered.section), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      marginBottom: 8
    }
  }, hovered.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: "var(--jim-text-body)",
      margin: 0,
      lineHeight: 1.5
    }
  }, hovered.sub), /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 18,
      width: "100%",
      background: "var(--jim-text)",
      color: "#fff",
      border: 0,
      padding: "12px",
      borderRadius: 14,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, "Aller \xE0 ", hovered.title.toLowerCase(), /*#__PURE__*/React.createElement(JIcon, {
    name: "arrow",
    size: 14,
    stroke: 2.5
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--jim-muted)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "APER\xC7U"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "var(--jim-text)",
      lineHeight: 1.15,
      margin: 0,
      textWrap: "pretty"
    }
  }, "Survole un item.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 500,
      color: "var(--jim-primary)"
    }
  }, "Aper\xE7u"), " contextuel."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [{
    ic: "shield",
    t: "Vérifié RPPS",
    s: "Tous les profils contrôlés"
  }, {
    ic: "wallet",
    t: "Paiement séquestre",
    s: "Sécurisé via Stripe Connect"
  }, {
    ic: "zap",
    t: "0 % commission",
    s: "Au lancement"
  }].map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: "10px 12px",
      background: "var(--jim-surface-alt)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--jim-primary-pale)",
      color: "var(--jim-primary)",
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: b.ic,
    size: 14,
    stroke: 2
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--jim-text)",
      margin: 0
    }
  }, b.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10.5,
      color: "var(--jim-muted)",
      margin: "1px 0 0"
    }
  }, b.s))))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      paddingTop: 24,
      borderTop: "1px solid var(--jim-beige-mid)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 24,
      flexWrap: "wrap",
      animation: "itemUp .55s cubic-bezier(.16,1,.3,1) .55s both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--jim-muted)",
      textTransform: "uppercase",
      letterSpacing: ".14em",
      cursor: "pointer"
    }
  }, "Aide"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--jim-muted)",
      textTransform: "uppercase",
      letterSpacing: ".14em",
      cursor: "pointer"
    }
  }, "CGU"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--jim-muted)",
      textTransform: "uppercase",
      letterSpacing: ".14em",
      cursor: "pointer"
    }
  }, "Confidentialit\xE9"), !isAnon && /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--jim-destructive)",
      textTransform: "uppercase",
      letterSpacing: ".14em",
      cursor: "pointer"
    }
  }, "Se d\xE9connecter")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--jim-muted)",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement(PulseDot, {
    size: 6
  }), " 2 847 remplacements en cours")))));
};
const HamburgerX = ({
  open,
  size = 18
}) => {
  const bar = {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 2,
    background: "currentColor",
    transition: "transform .3s cubic-bezier(.34,1.56,.64,1), top .25s ease, opacity .2s"
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: size,
      height: size,
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...bar,
      top: open ? size / 2 - 1 : 3,
      transform: open ? "rotate(45deg)" : "rotate(0)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...bar,
      top: size / 2 - 1,
      opacity: open ? 0 : 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...bar,
      top: open ? size / 2 - 1 : size - 5,
      transform: open ? "rotate(-45deg)" : "rotate(0)"
    }
  }));
};
Object.assign(window, {
  VariantB
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "menu-variant-b.jsx", error: String((e && e.message) || e) }); }

// menu-variant-c.jsx
try { (() => {
/* ============================================================
   JIM Menu — VARIANT C · "Command palette ⌘K"
   - Compact navbar, search-shaped trigger
   - Centered palette with type-ahead, keyboard nav
   - 3-pane : results · user/recent · quick actions
   - Anon : palette focuses on "découvrir / connexion"
   ============================================================ */

const VariantC = ({
  position = "top",
  onOpenChange,
  menuOpen,
  userState
}) => {
  const u = window.USER;
  const isAnon = userState === "anon";
  const allItems = getAllItems();
  const sections = getMenuSections();
  const [q, setQ] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef(null);
  const open = !!menuOpen;
  const isTop = position === "top";
  const toggle = v => {
    const n = v !== undefined ? v : !open;
    onOpenChange && onOpenChange(n);
    if (n) setTimeout(() => inputRef.current && inputRef.current.focus(), 50);else {
      setQ("");
      setCursor(0);
    }
  };
  React.useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && open) toggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const ql = q.trim().toLowerCase();
  const filtered = ql ? allItems.filter(it => it.title.toLowerCase().includes(ql) || it.sub.toLowerCase().includes(ql) || it.section.toLowerCase().includes(ql)) : allItems;
  React.useEffect(() => {
    setCursor(0);
  }, [q, userState]);
  const onInputKey = e => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      toggle(false);
    }
  };
  const recents = userState === "remplacant" ? [{
    t: "Cabinet Bastille — Paris 11ᵉ",
    s: "il y a 2 min",
    ic: "pin"
  }, {
    t: "Acceptée — Charonne",
    s: "hier",
    ic: "check"
  }, {
    t: "Rétro 820 € créditée",
    s: "lundi",
    ic: "wallet"
  }] : [{
    t: "Nadia B. — Bastille",
    s: "il y a 2 min",
    ic: "msg"
  }, {
    t: "Paiement libéré 820 €",
    s: "il y a 3 h",
    ic: "wallet"
  }, {
    t: "Candidature acceptée",
    s: "hier",
    ic: "check"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    style: {
      position: isTop ? "sticky" : "fixed",
      top: 0,
      left: 0,
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
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-jim.svg",
    alt: "JIM",
    style: {
      height: 28
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(true),
    style: {
      flex: isTop ? 1 : "none",
      maxWidth: isTop ? 520 : "none",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px 10px 14px",
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      borderRadius: 14,
      cursor: "pointer",
      boxShadow: "var(--jim-shadow-sm)",
      transition: "border-color .18s, box-shadow .18s",
      marginLeft: isTop ? 16 : 0
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = "var(--jim-primary-soft)";
      e.currentTarget.style.boxShadow = "var(--jim-shadow)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = "var(--jim-beige-mid)";
      e.currentTarget.style.boxShadow = "var(--jim-shadow-sm)";
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "search",
    size: 16,
    stroke: 2,
    style: {
      color: "var(--jim-muted)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "left",
      fontSize: 13,
      color: "var(--jim-muted)",
      fontWeight: 500
    }
  }, isAnon ? "Découvrir JIM…" : "Rechercher dans JIM…"), /*#__PURE__*/React.createElement("kbd", {
    style: {
      padding: "2px 7px",
      borderRadius: 6,
      background: "var(--jim-surface-alt)",
      border: "1px solid var(--jim-beige-mid)",
      fontSize: 10,
      fontWeight: 700,
      color: "var(--jim-muted)",
      fontFamily: "var(--font-mono)"
    }
  }, "\u2318K")), isTop && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: isTop ? "row" : "column",
      alignItems: "center",
      gap: 8,
      marginTop: !isTop ? "auto" : 0
    }
  }, !isAnon && /*#__PURE__*/React.createElement("button", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "var(--jim-primary)",
      color: "#fff",
      border: 0,
      padding: "10px 16px",
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(255,124,92,0.35)"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "plus",
    size: 15,
    stroke: 2.5
  }), userState === "titulaire" ? "Publier" : "Postuler"), !isAnon && /*#__PURE__*/React.createElement("button", {
    style: {
      position: "relative",
      width: 40,
      height: 40,
      borderRadius: 12,
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--jim-text)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "bell",
    size: 17,
    stroke: 1.9
  }), u.notifs.total > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 6,
      right: 6,
      minWidth: 16,
      height: 16,
      padding: "0 4px",
      background: "var(--jim-primary)",
      color: "#fff",
      borderRadius: 999,
      fontSize: 9,
      fontWeight: 800,
      display: "grid",
      placeItems: "center",
      border: "2px solid var(--jim-background)"
    }
  }, u.notifs.total)), isAnon ? /*#__PURE__*/React.createElement("button", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "var(--jim-text)",
      color: "#fff",
      border: 0,
      padding: "10px 16px",
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Se connecter ", /*#__PURE__*/React.createElement(JIcon, {
    name: "arrow",
    size: 14,
    stroke: 2.5
  })) : /*#__PURE__*/React.createElement("button", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: 2,
      borderRadius: 999,
      border: "1px solid var(--jim-beige-mid)",
      background: "var(--jim-surface)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 32
  })))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 95,
      background: "rgba(58,31,8,0.30)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      animation: "overlayIn .22s ease-out both",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "clamp(60px, 12vh, 140px) 20px 40px",
      overflow: "auto"
    },
    onClick: () => toggle(false)
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 820,
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      borderRadius: 26,
      boxShadow: "0 28px 96px rgba(58,31,8,0.22)",
      overflow: "hidden",
      animation: "dropdownIn .3s cubic-bezier(.34,1.56,.64,1) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "18px 20px",
      borderBottom: "1px solid var(--jim-beige-light)",
      background: "linear-gradient(180deg, var(--jim-surface), var(--jim-background))"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "search",
    size: 18,
    stroke: 2,
    style: {
      color: "var(--jim-primary)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: onInputKey,
    placeholder: isAnon ? "Comment ça marche, tarifs, espace remplaçant…" : "Annonce, paiement, contact, contrat…",
    style: {
      flex: 1,
      background: "transparent",
      border: 0,
      outline: "none",
      fontFamily: "var(--font-sans)",
      fontSize: 17,
      fontWeight: 500,
      color: "var(--jim-text)"
    }
  }), q && /*#__PURE__*/React.createElement("button", {
    onClick: () => setQ(""),
    style: {
      background: "transparent",
      border: 0,
      color: "var(--jim-muted)",
      cursor: "pointer",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "x",
    size: 14,
    stroke: 2
  })), /*#__PURE__*/React.createElement("kbd", {
    style: {
      padding: "3px 8px",
      borderRadius: 6,
      background: "var(--jim-surface)",
      border: "1px solid var(--jim-beige-mid)",
      fontSize: 10,
      fontWeight: 700,
      color: "var(--jim-muted)",
      fontFamily: "var(--font-mono)"
    }
  }, "ESC")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      minHeight: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 8px",
      borderRight: "1px solid var(--jim-beige-light)",
      maxHeight: 460,
      overflow: "auto"
    }
  }, filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "60px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: "var(--jim-surface-alt)",
      color: "var(--jim-muted)",
      display: "grid",
      placeItems: "center",
      margin: "0 auto 14px"
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: "search",
    size: 26,
    stroke: 1.6
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "var(--jim-text)",
      margin: 0
    }
  }, "Aucun r\xE9sultat"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--jim-muted)",
      marginTop: 6
    }
  }, "Essaie \xAB ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 500,
      color: "var(--jim-primary)"
    }
  }, "messagerie"), " \xBB, \xAB paiement \xBB\u2026")) : sections.map(sec => {
    const sectionItems = filtered.filter(it => it.section === sec.label);
    if (sectionItems.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: sec.label,
      style: {
        padding: "8px 4px 4px"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        padding: "6px 12px",
        margin: 0,
        fontSize: 10,
        fontWeight: 800,
        color: "var(--jim-muted)",
        textTransform: "uppercase",
        letterSpacing: ".18em"
      }
    }, sec.label), sectionItems.map(it => {
      const idx = filtered.indexOf(it);
      const sel = cursor === idx;
      return /*#__PURE__*/React.createElement("div", {
        key: it.id,
        onMouseEnter: () => setCursor(idx),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          borderRadius: 12,
          background: sel ? "var(--jim-primary-pale)" : "transparent",
          cursor: "pointer",
          transition: "background .12s",
          animation: `itemIn .2s ease-out ${idx * 0.02}s both`
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 34,
          height: 34,
          borderRadius: 10,
          background: sel ? "#fff" : "var(--jim-surface-alt)",
          color: sel ? "var(--jim-primary)" : "var(--jim-text-body)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          boxShadow: sel ? "0 2px 8px rgba(255,124,92,0.2)" : "none"
        }
      }, /*#__PURE__*/React.createElement(JIcon, {
        name: it.icon,
        size: 15,
        stroke: 2
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 13.5,
          fontWeight: 700,
          color: "var(--jim-text)",
          margin: 0
        }
      }, /*#__PURE__*/React.createElement(Highlight, {
        text: it.title,
        q: ql
      })), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 11,
          color: "var(--jim-muted)",
          margin: "2px 0 0",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }, it.sub)), it.badge && /*#__PURE__*/React.createElement(CountBadge, {
        value: it.badge,
        size: "sm"
      }), sel && /*#__PURE__*/React.createElement("kbd", {
        style: {
          padding: "2px 7px",
          borderRadius: 6,
          background: "#fff",
          border: "1px solid var(--jim-beige-mid)",
          fontSize: 10,
          fontWeight: 700,
          color: "var(--jim-muted)",
          fontFamily: "var(--font-mono)"
        }
      }, "\u21B5"));
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      background: "var(--jim-surface-alt)"
    }
  }, !isAnon ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 12,
      background: "linear-gradient(135deg, var(--jim-primary-pale) 0%, var(--jim-beige-light) 100%)",
      borderRadius: 16,
      marginBottom: 16,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      color: "var(--jim-text)",
      margin: 0
    }
  }, u.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10.5,
      color: "var(--jim-muted)",
      margin: "3px 0 4px",
      fontWeight: 600
    }
  }, u.role, " \xB7 ", u.location), /*#__PURE__*/React.createElement(RppsChip, {
    compact: true
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      background: "linear-gradient(135deg, var(--jim-primary) 0%, var(--jim-accent) 100%)",
      color: "#fff",
      borderRadius: 16,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: ".22em",
      margin: 0,
      opacity: .85
    }
  }, "NOUVEAU SUR JIM"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      margin: "6px 0 4px",
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: "var(--font-serif-italic)",
      fontStyle: "italic",
      fontWeight: 500
    }
  }, "Cr\xE9e ton compte"), " en 3 minutes"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      opacity: .9,
      margin: 0
    }
  }, "V\xE9rifi\xE9 RPPS sous 24h, gratuit au lancement.")), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow",
    style: {
      fontSize: 10,
      letterSpacing: ".18em",
      marginBottom: 8
    }
  }, isAnon ? "POPULAIRES" : "RÉCENT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      marginBottom: 18
    }
  }, (isAnon ? [{
    t: "Comment ça marche",
    s: "5 étapes",
    ic: "sparkle"
  }, {
    t: "Calcul rétrocession",
    s: "outil",
    ic: "wallet"
  }, {
    t: "Vérification RPPS",
    s: "FAQ",
    ic: "shield"
  }] : recents).map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px",
      borderRadius: 10,
      cursor: "pointer",
      animation: `itemIn .25s ease-out ${0.05 + i * 0.04}s both`
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--jim-surface)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--jim-surface)",
      color: "var(--jim-muted)",
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(JIcon, {
    name: r.ic,
    size: 13,
    stroke: 1.9
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--jim-text)",
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, r.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 10,
      color: "var(--jim-muted)",
      margin: "1px 0 0"
    }
  }, r.s))))), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow",
    style: {
      fontSize: 10,
      letterSpacing: ".18em",
      marginBottom: 8
    }
  }, "ACTIONS RAPIDES"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, isAnon ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(QuickAction, {
    icon: "user",
    label: "Se connecter",
    accent: true
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "plus",
    label: "Cr\xE9er un compte"
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "help",
    label: "Aide & contact"
  })) : userState === "titulaire" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(QuickAction, {
    icon: "plus",
    label: "Nouvelle annonce",
    accent: true
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "cal",
    label: "Programmer disponibilit\xE9"
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "help",
    label: "Aide & contact"
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "logout",
    label: "Se d\xE9connecter"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(QuickAction, {
    icon: "pin",
    label: "Carte des missions",
    accent: true
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "cal",
    label: "Mes disponibilit\xE9s"
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "help",
    label: "Aide & contact"
  }), /*#__PURE__*/React.createElement(QuickAction, {
    icon: "logout",
    label: "Se d\xE9connecter"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 16px",
      borderTop: "1px solid var(--jim-beige-light)",
      background: "var(--jim-surface)",
      fontSize: 11,
      color: "var(--jim-muted)",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Kbd, null, "\u2191"), /*#__PURE__*/React.createElement(Kbd, null, "\u2193"), " naviguer"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Kbd, null, "\u21B5"), " ouvrir"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Kbd, null, "esc"), " fermer")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(PulseDot, {
    size: 6
  }), " ", filtered.length, " r\xE9sultats")))));
};
const Kbd = ({
  children
}) => /*#__PURE__*/React.createElement("kbd", {
  style: {
    padding: "1px 5px",
    borderRadius: 4,
    background: "var(--jim-surface-alt)",
    border: "1px solid var(--jim-beige-mid)",
    fontSize: 9,
    fontWeight: 700,
    color: "var(--jim-muted)",
    fontFamily: "var(--font-mono)",
    margin: "0 1px"
  }
}, children);
const QuickAction = ({
  icon,
  label,
  accent
}) => /*#__PURE__*/React.createElement("a", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 10,
    textDecoration: "none",
    cursor: "pointer",
    color: accent ? "var(--jim-primary)" : "var(--jim-text-body)",
    fontWeight: 700,
    fontSize: 12.5,
    transition: "background .15s"
  },
  onMouseEnter: e => e.currentTarget.style.background = "var(--jim-surface)",
  onMouseLeave: e => e.currentTarget.style.background = "transparent"
}, /*#__PURE__*/React.createElement(JIcon, {
  name: icon,
  size: 14,
  stroke: 2
}), label);
const Highlight = ({
  text,
  q
}) => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text;
  return /*#__PURE__*/React.createElement(React.Fragment, null, text.slice(0, i), /*#__PURE__*/React.createElement("mark", {
    style: {
      background: "var(--jim-primary-soft)",
      color: "var(--jim-text)",
      borderRadius: 3,
      padding: "0 1px"
    }
  }, text.slice(i, i + q.length)), text.slice(i + q.length));
};
Object.assign(window, {
  VariantC
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "menu-variant-c.jsx", error: String((e && e.message) || e) }); }

// tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  noDeckControls = false,
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(() => typeof document !== 'undefined' && !!document.querySelector('deck-stage'), []);
  // Hide the toggle until the host has actually enabled the rail (the
  // __omelette_rail_enabled window message, posted only when the
  // omelette_deck_rail_enabled flag is on for this user). The initial read
  // covers TweaksPanel mounting after the message already arrived; the
  // listener covers the common case of mounting first.
  const [railEnabled, setRailEnabled] = React.useState(() => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled);
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = e => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try {
      return localStorage.getItem('deck-stage.railVisible') !== '0';
    } catch (e) {
      return true;
    }
  });
  const toggleRail = on => {
    setRailVisible(on);
    window.postMessage({
      type: '__deck_rail_visible',
      on
    }, '*');
  };
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children, hasDeckStage && railEnabled && !noDeckControls && /*#__PURE__*/React.createElement(TweakSection, {
    label: "Deck"
  }, /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Thumbnail rail",
    value: railVisible,
    onChange: toggleRail
  })))));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/screens.jsx
try { (() => {
// ui_kits/mobile/screens.jsx — JIM mobile screens (Welcome, Dashboard titulaire, Recherche)

// ─── Design tokens (mirror of @jim/ui NativeWind) ───
const T = {
  bg: '#fdf6ed',
  surface: '#fbf0e8',
  surfaceAlt: '#f7ede0',
  text: '#3a1f08',
  textBody: '#6b4a32',
  muted: '#a8937e',
  beigeMid: '#edd9c4',
  beigeLight: '#f2e5d5',
  beigeDark: '#c9b59a',
  primary: '#ff7c5c',
  primaryPale: '#fff0ea',
  primarySoft: '#ffc5b3',
  accent: '#e06245',
  accentWarm: '#f5b86a',
  border: '#edd9c4',
  success: '#5a8a5f',
  warning: '#c48a2e',
  danger: '#c44d3a'
};

// ────────────────────────────────────────────────────────
// Shared building blocks
// ────────────────────────────────────────────────────────
function Card({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 18,
      padding: 16,
      border: `1px solid ${T.border}`,
      boxShadow: '0 1px 2px rgba(58,31,8,0.04), 0 4px 12px rgba(58,31,8,0.06)',
      ...style
    }
  }, children);
}
function Pill({
  children,
  tone = 'primary',
  size = 'sm'
}) {
  const palette = {
    primary: {
      bg: T.primaryPale,
      fg: T.primary
    },
    warm: {
      bg: '#fff4e0',
      fg: T.warning
    },
    success: {
      bg: '#e8f0e5',
      fg: T.success
    },
    muted: {
      bg: T.surfaceAlt,
      fg: T.textBody
    },
    solid: {
      bg: T.primary,
      fg: '#fff'
    },
    dark: {
      bg: T.text,
      fg: '#fff'
    }
  }[tone];
  const pad = size === 'xs' ? '2px 7px' : '4px 10px';
  const fs = size === 'xs' ? 9 : 11;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: palette.bg,
      color: palette.fg,
      padding: pad,
      borderRadius: 999,
      fontSize: fs,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 0.06
    }
  }, children);
}

// "SVG icons" — simple inline, all stroke 1.75
const Ico = {
  search: (c = 'currentColor', s = 18) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7",
    stroke: c,
    strokeWidth: "1.75"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3-3",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinecap: "round"
  })),
  mapPin: (c = 'currentColor', s = 16) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z",
    stroke: c,
    strokeWidth: "1.75"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3",
    stroke: c,
    strokeWidth: "1.75"
  })),
  calendar: (c = 'currentColor', s = 16) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "16",
    rx: "2",
    stroke: c,
    strokeWidth: "1.75"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 10h18M8 3v4M16 3v4",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinecap: "round"
  })),
  filter: (c = 'currentColor', s = 16) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M6 12h12M10 18h4",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinecap: "round"
  })),
  plus: (c = 'currentColor', s = 22) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  })),
  bell: (c = 'currentColor', s = 20) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8a6 6 0 1112 0v5l2 3H4l2-3V8z",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 19a2 2 0 004 0",
    stroke: c,
    strokeWidth: "1.75"
  })),
  home: (c = 'currentColor', s = 22) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinejoin: "round"
  })),
  msg: (c = 'currentColor', s = 22) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4v-15z",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinejoin: "round"
  })),
  profile: (c = 'currentColor', s = 22) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "4",
    stroke: c,
    strokeWidth: "1.75"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 20c0-4 4-6 8-6s8 2 8 6",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinecap: "round"
  })),
  heart: (c = 'currentColor', s = 22) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z",
    stroke: c,
    strokeWidth: "1.75",
    strokeLinejoin: "round"
  })),
  check: (c = 'currentColor', s = 14) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 7",
    stroke: c,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  zap: (c = 'currentColor', s = 12) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: c
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13 2L4 14h7l-1 8 9-12h-7l1-8z"
  })),
  sparkles: (c = 'currentColor', s = 14) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z",
    fill: c
  }))
};

// ────────────────────────────────────────────────────────
// 1. WELCOME SCREEN — light beige bg, real jim logo
// ────────────────────────────────────────────────────────
function WelcomeScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: T.bg,
      color: T.text,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '110px 24px 40px',
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-jim.svg",
    alt: "JIM \u2014 Job In Med",
    style: {
      width: 200,
      height: 'auto',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.textBody,
      fontSize: 16,
      lineHeight: 1.55,
      fontWeight: 500
    }
  }, "Le r\xE9seau des kin\xE9sith\xE9rapeutes rempla\xE7ants et titulaires")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${T.border}`,
      borderRadius: 999,
      padding: '8px 16px',
      fontSize: 13,
      color: T.textBody,
      fontWeight: 500,
      boxShadow: '0 1px 2px rgba(58,31,8,0.04)'
    }
  }, "V\xE9rifi\xE9 RPPS \xB7 Contrat IA \xB7 0 % commission")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      height: 56,
      background: T.primary,
      color: '#fff',
      border: 0,
      borderRadius: 14,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(255,124,92,0.3)'
    }
  }, "Cr\xE9er un compte"), /*#__PURE__*/React.createElement("button", {
    style: {
      height: 56,
      background: '#fff',
      border: `1px solid ${T.border}`,
      color: T.text,
      borderRadius: 14,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Se connecter"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: T.muted,
      fontSize: 12,
      marginTop: 4
    }
  }, "R\xE9serv\xE9 aux professionnels de sant\xE9 v\xE9rifi\xE9s RPPS")));
}

// ────────────────────────────────────────────────────────
// Bottom tab bar — shared
// ────────────────────────────────────────────────────────
function TabBar({
  active = 'home'
}) {
  const tabs = [{
    id: 'home',
    label: 'Accueil',
    ico: Ico.home
  }, {
    id: 'search',
    label: 'Rechercher',
    ico: Ico.search
  }, {
    id: 'msg',
    label: 'Messages',
    ico: Ico.msg,
    badge: 3
  }, {
    id: 'fav',
    label: 'Favoris',
    ico: Ico.heart
  }, {
    id: 'me',
    label: 'Profil',
    ico: Ico.profile
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(253,246,237,0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `0.5px solid ${T.border}`,
      padding: '8px 4px 34px',
      display: 'flex',
      justifyContent: 'space-around'
    }
  }, tabs.map(t => {
    const isActive = t.id === active;
    const c = isActive ? T.primary : T.muted;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        color: c,
        minWidth: 60,
        position: 'relative'
      }
    }, t.ico(c, 24), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 600
      }
    }, t.label), t.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -2,
        right: 10,
        background: T.primary,
        color: '#fff',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        fontSize: 10,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px'
      }
    }, t.badge));
  }));
}

// ────────────────────────────────────────────────────────
// 2. DASHBOARD TITULAIRE
// ────────────────────────────────────────────────────────
function DashboardScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: T.bg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      padding: '62px 24px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.muted,
      fontSize: 13
    }
  }, "Bonjour \uD83D\uDC4B"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: T.text,
      letterSpacing: -0.03,
      marginTop: 2
    }
  }, "Tableau de bord")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '20px 16px 100px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.1,
      fontWeight: 700
    }
  }, "Actives"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      color: T.text,
      letterSpacing: -0.03,
      marginTop: 4
    }
  }, "3"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.success,
      marginTop: 2,
      fontWeight: 600
    }
  }, "\u2191 2 cette semaine")), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.1,
      fontWeight: 700
    }
  }, "En cours"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      color: T.text,
      letterSpacing: -0.03,
      marginTop: 4
    }
  }, "1"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.textBody,
      marginTop: 2
    }
  }, "Cabinet Moreau"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      padding: '0 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: T.text,
      letterSpacing: -0.02
    }
  }, "Candidatures re\xE7ues", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      background: T.primary,
      color: '#fff',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700
    }
  }, "5")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: T.primary,
      fontWeight: 600
    }
  }, "Tout voir")), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, [{
    name: 'Claire Dubois',
    city: 'Paris 11e',
    time: 'Il y a 2h',
    pill: 'Nouveau'
  }, {
    name: 'Louis Mercier',
    city: 'Lyon 6e',
    time: 'Il y a 4h',
    pill: null
  }, {
    name: 'Sarah Ben Ali',
    city: 'Marseille',
    time: 'Hier',
    pill: null
  }].map((c, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      borderBottom: i < arr.length - 1 ? `0.5px solid ${T.beigeLight}` : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 20,
      background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: 14
    }
  }, c.name.split(' ').map(w => w[0]).slice(0, 2).join('')), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: T.text
    }
  }, c.name), c.pill && /*#__PURE__*/React.createElement(Pill, {
    tone: "primary",
    size: "xs"
  }, c.pill)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.muted,
      marginTop: 1
    }
  }, "pour ", c.city, " \xB7 ", c.time)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.beigeDark
    }
  }, "\u203A"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      padding: '0 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: T.text,
      letterSpacing: -0.02
    }
  }, "Mes annonces"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: T.primary,
      fontWeight: 600
    }
  }, "+ Publier")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "primary",
    size: "xs"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3
    }
  }, Ico.zap('currentColor', 9), "Urgent")), /*#__PURE__*/React.createElement(Pill, {
    tone: "success",
    size: "xs"
  }, "Active")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: T.text,
      letterSpacing: -0.02
    }
  }, "Remplacement 2 semaines"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.muted,
      marginTop: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, Ico.mapPin(T.muted, 12), " Paris 11e \xB7 12 \u2013 26 mai \xB7 ortho")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: T.text,
      letterSpacing: -0.02
    }
  }, "72", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: T.muted
    }
  }, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.08,
      fontWeight: 700
    }
  }, "r\xE9tro."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 10,
      borderTop: `0.5px solid ${T.beigeLight}`,
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textBody
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "5"), " candidatures"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.textBody
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "42"), " vues"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 20,
      bottom: 96,
      zIndex: 5,
      width: 56,
      height: 56,
      borderRadius: 28,
      background: T.primary,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(255,124,92,0.45)'
    }
  }, Ico.plus('#fff', 26)), /*#__PURE__*/React.createElement(TabBar, {
    active: "home"
  }));
}

// ────────────────────────────────────────────────────────
// 3. RECHERCHE — remplaçant listings
// ────────────────────────────────────────────────────────
function RechercheScreen() {
  const listings = [{
    city: 'Paris 11e',
    retro: 72,
    cab: 'Cabinet 4 kinés',
    dates: '12–26 mai',
    tags: ['ortho', 'neuro'],
    urgent: true,
    grad: 'linear-gradient(135deg,#ffc5b3,#ff9a80)'
  }, {
    city: 'Lyon 6e',
    retro: 70,
    cab: 'Cabinet sport',
    dates: 'Dès lundi',
    tags: ['sport', 'respi'],
    urgent: true,
    grad: 'linear-gradient(135deg,#f5b86a,#e06245)'
  }, {
    city: 'Marseille',
    retro: 75,
    cab: 'Cabinet 2 kinés',
    dates: 'Juillet',
    tags: ['ortho'],
    urgent: false,
    grad: 'linear-gradient(135deg,#fff0ea,#ffc5b3)'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: T.bg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '62px 16px 12px',
      background: T.surface,
      borderBottom: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: T.text,
      letterSpacing: -0.03,
      marginBottom: 12
    }
  }, "Rechercher"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: '#fff',
      borderRadius: 14,
      padding: '12px 14px',
      border: `1px solid ${T.border}`,
      boxShadow: '0 1px 2px rgba(58,31,8,0.04)'
    }
  }, Ico.search(T.muted, 18), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: T.beigeDark,
      fontSize: 14
    }
  }, "Ville, sp\xE9cialit\xE9\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: T.primaryPale,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, Ico.filter(T.primary, 16))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 12,
      overflowX: 'auto'
    }
  }, ['Toutes', 'Urgentes', 'Près de moi', 'Nouveau', 'Favoris'].map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      padding: '8px 14px',
      borderRadius: 999,
      background: i === 0 ? '#fff' : 'transparent',
      border: i === 0 ? `1px solid ${T.border}` : '1px solid transparent',
      color: i === 0 ? T.primary : T.muted,
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 0.06,
      flexShrink: 0,
      boxShadow: i === 0 ? '0 1px 2px rgba(58,31,8,0.04)' : 'none'
    }
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 20px 6px',
      fontSize: 13,
      color: T.textBody
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: T.text
    }
  }, "127 annonces"), " \xE0 moins de 30 km"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '4px 16px 100px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, listings.map((l, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 120,
      borderRadius: 12,
      marginBottom: 12,
      background: l.grad,
      position: 'relative',
      overflow: 'hidden'
    }
  }, l.urgent && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "solid",
    size: "xs"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3
    }
  }, Ico.zap('#fff', 10), "Urgent"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      right: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.95)',
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      color: T.text,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }
  }, Ico.check(T.success, 11), " RPPS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: T.text,
      letterSpacing: -0.02
    }
  }, l.city), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: T.text,
      letterSpacing: -0.02
    }
  }, l.retro, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: T.muted,
      fontWeight: 400
    }
  }, "% retro."))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.muted,
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, Ico.mapPin(T.muted, 13), " ", l.cab, " \xB7 ", l.dates), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, l.tags.map(t => /*#__PURE__*/React.createElement(Pill, {
    key: t,
    tone: "primary",
    size: "xs"
  }, t)))))), /*#__PURE__*/React.createElement(TabBar, {
    active: "search"
  }));
}
Object.assign(window, {
  WelcomeScreen,
  DashboardScreen,
  RechercheScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/cards-annonces.jsx
try { (() => {
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
  verified: true
};
const cardIconHeart = /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
}));
const cardIconCheck = /*#__PURE__*/React.createElement("svg", {
  width: "11",
  height: "11",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("polyline", {
  points: "20 6 9 17 4 12"
}));
const cardIconPin = /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));
const cardIconCal = /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "4",
  width: "18",
  height: "18",
  rx: "2",
  ry: "2"
}), /*#__PURE__*/React.createElement("line", {
  x1: "16",
  y1: "2",
  x2: "16",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "8",
  y1: "2",
  x2: "8",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "3",
  y1: "10",
  x2: "21",
  y2: "10"
}));
const cardIconBuild = /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("rect", {
  x: "4",
  y: "2",
  width: "16",
  height: "20",
  rx: "2"
}), /*#__PURE__*/React.createElement("line", {
  x1: "9",
  y1: "7",
  x2: "15",
  y2: "7"
}), /*#__PURE__*/React.createElement("line", {
  x1: "9",
  y1: "11",
  x2: "15",
  y2: "11"
}), /*#__PURE__*/React.createElement("line", {
  x1: "9",
  y1: "15",
  x2: "13",
  y2: "15"
}));
const cardIconArrow = /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 5 19 12 12 19"
}));
const cardIconStar = /*#__PURE__*/React.createElement("svg", {
  width: "11",
  height: "11",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  stroke: "none"
}, /*#__PURE__*/React.createElement("polygon", {
  points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
}));
const cardIconUsers = /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "9",
  cy: "7",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M23 21v-2a4 4 0 0 0-3-3.87"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 3.13a4 4 0 0 1 0 7.75"
}));

/* ============================================================
   COMMON — badge vérifié, save button, CTA
   ============================================================ */
function BadgeVerified() {
  return /*#__PURE__*/React.createElement("span", {
    style: bvStyles.wrap
  }, /*#__PURE__*/React.createElement("span", {
    style: bvStyles.check
  }, cardIconCheck), "V\xE9rifi\xE9");
}
const bvStyles = {
  wrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 10,
    fontWeight: 700,
    color: "var(--jim-success)",
    letterSpacing: ".02em"
  },
  check: {
    display: "inline-flex",
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    background: "var(--jim-success-bg)"
  }
};
function SaveBtn({
  size = 32
}) {
  const [saved, setSaved] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
      setSaved(s => !s);
    },
    style: {
      width: size,
      height: size,
      borderRadius: 999,
      border: 0,
      cursor: "pointer",
      background: saved ? "var(--jim-primary)" : "rgba(255,255,255,.96)",
      color: saved ? "#fff" : "var(--jim-text)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 1px 3px rgba(58,31,8,.12), 0 4px 10px rgba(58,31,8,.08)",
      transition: "all .18s"
    },
    "aria-label": saved ? "Retirer des favoris" : "Sauvegarder"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      transform: saved ? "scale(1.05)" : "scale(1)",
      transition: "transform .18s"
    }
  }, React.cloneElement(cardIconHeart, {
    fill: saved ? "currentColor" : "none"
  })));
}
function PostulerBtn({
  full = false,
  tone = "primary"
}) {
  const bg = tone === "primary" ? "var(--jim-primary)" : "var(--jim-text)";
  const color = "#fff";
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
    },
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      width: full ? "100%" : "auto",
      height: 36,
      padding: "0 16px",
      borderRadius: 10,
      border: 0,
      cursor: "pointer",
      background: bg,
      color,
      fontFamily: "inherit",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "-.005em"
    }
  }, "Postuler ", cardIconArrow);
}

/* ============================================================
   VARIANTE A — Structurée sans image
   ============================================================ */
function CardA() {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: aStyles.card,
    className: "jc-hover"
  }, /*#__PURE__*/React.createElement("div", {
    style: aStyles.topRow
  }, /*#__PURE__*/React.createElement("span", {
    style: aStyles.chipType
  }, MISSION.type), /*#__PURE__*/React.createElement(SaveBtn, {
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: aStyles.headline
  }, /*#__PURE__*/React.createElement("span", {
    style: aStyles.pct
  }, MISSION.retro, /*#__PURE__*/React.createElement("span", {
    style: aStyles.pctSign
  }, "%")), /*#__PURE__*/React.createElement("span", {
    style: aStyles.pctLabel
  }, "r\xE9tro")), /*#__PURE__*/React.createElement("h3", {
    style: aStyles.ville
  }, MISSION.ville, " \xB7 ", MISSION.quartier), /*#__PURE__*/React.createElement("p", {
    style: aStyles.specialite
  }, MISSION.specialite), /*#__PURE__*/React.createElement("div", {
    style: aStyles.divider
  }), /*#__PURE__*/React.createElement("div", {
    style: aStyles.metaRow
  }, /*#__PURE__*/React.createElement("span", {
    style: aStyles.metaItem
  }, cardIconCal, /*#__PURE__*/React.createElement("span", null, MISSION.dateStart, "\u2013", MISSION.dateEnd, " ", MISSION.month)), /*#__PURE__*/React.createElement("span", {
    style: aStyles.metaDot
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: aStyles.metaItem
  }, MISSION.duration)), /*#__PURE__*/React.createElement("div", {
    style: aStyles.footer
  }, /*#__PURE__*/React.createElement(BadgeVerified, null), /*#__PURE__*/React.createElement(PostulerBtn, null)));
}
const aStyles = {
  card: {
    display: "block",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid rgba(58,31,8,.08)",
    borderRadius: 20,
    padding: 20,
    boxShadow: "var(--jim-shadow-sm)",
    width: 300,
    fontFamily: "var(--font-sans)"
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  chipType: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 999,
    background: "var(--jim-beige-light)",
    color: "var(--jim-text)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".02em"
  },
  headline: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 2
  },
  pct: {
    fontSize: 52,
    fontWeight: 800,
    color: "var(--jim-primary)",
    letterSpacing: "-.04em",
    lineHeight: 1
  },
  pctSign: {
    fontSize: 32,
    fontWeight: 700
  },
  pctLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".1em"
  },
  ville: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--jim-text)",
    margin: "14px 0 2px",
    letterSpacing: "-.015em"
  },
  specialite: {
    fontSize: 13,
    color: "var(--jim-muted)",
    margin: 0,
    fontWeight: 500
  },
  divider: {
    height: 1,
    background: "var(--jim-beige-light)",
    margin: "16px 0 14px"
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--jim-text-body)",
    fontWeight: 600,
    marginBottom: 18
  },
  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5
  },
  metaDot: {
    color: "var(--jim-muted)",
    opacity: .5
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  }
};

/* ============================================================
   VARIANTE B — Mini-map géolocalisée
   ============================================================ */
function CardB() {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: bStyles.card,
    className: "jc-hover"
  }, /*#__PURE__*/React.createElement("div", {
    style: bStyles.mapWrap
  }, /*#__PURE__*/React.createElement(MiniMap, null), /*#__PURE__*/React.createElement("div", {
    style: bStyles.mapOverlay
  }, /*#__PURE__*/React.createElement("span", {
    style: bStyles.chipType
  }, MISSION.type), /*#__PURE__*/React.createElement(SaveBtn, {
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    style: bStyles.mapAddress
  }, /*#__PURE__*/React.createElement("span", {
    style: bStyles.mapPin
  }, cardIconPin), /*#__PURE__*/React.createElement("span", null, MISSION.ville, " \xB7 ", MISSION.quartier))), /*#__PURE__*/React.createElement("div", {
    style: bStyles.body
  }, /*#__PURE__*/React.createElement("div", {
    style: bStyles.titleRow
  }, /*#__PURE__*/React.createElement("h3", {
    style: bStyles.title
  }, MISSION.specialite), /*#__PURE__*/React.createElement("div", {
    style: bStyles.pctBlock
  }, /*#__PURE__*/React.createElement("span", {
    style: bStyles.pct
  }, MISSION.retro, "%"))), /*#__PURE__*/React.createElement("div", {
    style: bStyles.metaRow
  }, /*#__PURE__*/React.createElement("span", {
    style: bStyles.metaItem
  }, cardIconCal, /*#__PURE__*/React.createElement("span", null, MISSION.dateStart, "\u2013", MISSION.dateEnd, " ", MISSION.month)), /*#__PURE__*/React.createElement("span", {
    style: bStyles.metaDot
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: bStyles.metaItem
  }, MISSION.duration)), /*#__PURE__*/React.createElement("div", {
    style: bStyles.footer
  }, /*#__PURE__*/React.createElement(BadgeVerified, null), /*#__PURE__*/React.createElement(PostulerBtn, null))));
}
function MiniMap() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 320 160",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      width: "100%",
      height: "100%",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    width: "320",
    height: "160",
    fill: "#f7ede0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-10,90 Q60,60 130,95 T270,80 L330,75",
    stroke: "#d4e7dc",
    strokeWidth: "18",
    fill: "none",
    opacity: ".85"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-10,130 Q80,110 160,132 T330,115",
    stroke: "#d4e7dc",
    strokeWidth: "12",
    fill: "none",
    opacity: ".5"
  }), [...Array(8)].map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: "h" + i,
    x1: "0",
    y1: 20 + i * 20,
    x2: "320",
    y2: 20 + i * 20,
    stroke: "#ead9c0",
    strokeWidth: ".6"
  })), [...Array(10)].map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: "v" + i,
    x1: 20 + i * 32,
    y1: "0",
    x2: 20 + i * 32,
    y2: "160",
    stroke: "#ead9c0",
    strokeWidth: ".6"
  })), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "60",
    x2: "320",
    y2: "60",
    stroke: "#dcbfa0",
    strokeWidth: "2",
    opacity: ".7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "180",
    y1: "0",
    x2: "180",
    y2: "160",
    stroke: "#dcbfa0",
    strokeWidth: "2",
    opacity: ".7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "105",
    width: "36",
    height: "24",
    rx: "3",
    fill: "#e5e9cb",
    opacity: ".6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "220",
    y: "25",
    width: "44",
    height: "28",
    rx: "3",
    fill: "#e5e9cb",
    opacity: ".6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "168",
    cy: "72",
    r: "54",
    fill: "#ff7c5c",
    opacity: ".08"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "168",
    cy: "72",
    r: "34",
    fill: "#ff7c5c",
    opacity: ".12"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(168 72)"
  }, /*#__PURE__*/React.createElement("circle", {
    r: "14",
    fill: "#ff7c5c"
  }), /*#__PURE__*/React.createElement("circle", {
    r: "6",
    fill: "#fff"
  })));
}
const bStyles = {
  card: {
    display: "block",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid rgba(58,31,8,.08)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "var(--jim-shadow-sm)",
    width: 320,
    fontFamily: "var(--font-sans)"
  },
  mapWrap: {
    position: "relative",
    height: 160
  },
  mapOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  chipType: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 11px",
    borderRadius: 999,
    background: "rgba(255,255,255,.96)",
    color: "var(--jim-text)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".02em",
    boxShadow: "0 1px 3px rgba(58,31,8,.12)"
  },
  mapAddress: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    borderRadius: 10,
    padding: "7px 11px",
    fontSize: 12,
    fontWeight: 700,
    color: "var(--jim-text)",
    boxShadow: "0 1px 3px rgba(58,31,8,.12)"
  },
  mapPin: {
    color: "var(--jim-primary)",
    display: "inline-flex"
  },
  body: {
    padding: "16px 18px 18px"
  },
  titleRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8
  },
  title: {
    fontSize: 17,
    fontWeight: 800,
    color: "var(--jim-text)",
    margin: 0,
    letterSpacing: "-.015em",
    flex: 1
  },
  pctBlock: {
    flexShrink: 0
  },
  pct: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--jim-primary)",
    letterSpacing: "-.03em"
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--jim-text-body)",
    fontWeight: 600,
    marginBottom: 14
  },
  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5
  },
  metaDot: {
    color: "var(--jim-muted)",
    opacity: .5
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  }
};

/* ============================================================
   VARIANTE C — Illustration géométrique par spécialité
   ============================================================ */
function CardC() {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: cStyles.card,
    className: "jc-hover"
  }, /*#__PURE__*/React.createElement("div", {
    style: cStyles.art
  }, /*#__PURE__*/React.createElement(SpecialiteGlyph, null), /*#__PURE__*/React.createElement("div", {
    style: cStyles.artTop
  }, /*#__PURE__*/React.createElement("span", {
    style: cStyles.specChip
  }, MISSION.specialite), /*#__PURE__*/React.createElement(SaveBtn, {
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    style: cStyles.artFoot
  }, /*#__PURE__*/React.createElement("span", {
    style: cStyles.pctXL
  }, MISSION.retro, "%"))), /*#__PURE__*/React.createElement("div", {
    style: cStyles.body
  }, /*#__PURE__*/React.createElement("div", {
    style: cStyles.titleRow
  }, /*#__PURE__*/React.createElement("h3", {
    style: cStyles.ville
  }, MISSION.ville), /*#__PURE__*/React.createElement("span", {
    style: cStyles.chipType
  }, MISSION.type)), /*#__PURE__*/React.createElement("p", {
    style: cStyles.addr
  }, cardIconPin, /*#__PURE__*/React.createElement("span", null, MISSION.quartier)), /*#__PURE__*/React.createElement("div", {
    style: cStyles.metaRow
  }, /*#__PURE__*/React.createElement("span", {
    style: cStyles.metaItem
  }, cardIconCal, /*#__PURE__*/React.createElement("span", null, MISSION.dateStart, "\u2013", MISSION.dateEnd, " ", MISSION.month)), /*#__PURE__*/React.createElement("span", {
    style: cStyles.metaDot
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: cStyles.metaItem
  }, MISSION.duration)), /*#__PURE__*/React.createElement("div", {
    style: cStyles.footer
  }, /*#__PURE__*/React.createElement(BadgeVerified, null), /*#__PURE__*/React.createElement(PostulerBtn, null))));
}
function SpecialiteGlyph() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 320 160",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "cg1",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#ff9a80"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#ff7c5c"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "320",
    height: "160",
    fill: "url(#cg1)"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(32 28)",
    opacity: ".9"
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("g", {
    key: i,
    transform: `translate(${i * 52} ${i * 8})`
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "40",
    height: "28",
    rx: "14",
    fill: "#fff",
    opacity: ".22"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "28",
    height: "16",
    rx: "8",
    fill: "#fff",
    opacity: ".4"
  })))), /*#__PURE__*/React.createElement("circle", {
    cx: "260",
    cy: "130",
    r: "60",
    fill: "#fff",
    opacity: ".1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "20",
    r: "30",
    fill: "#fff",
    opacity: ".08"
  }));
}
const cStyles = {
  card: {
    display: "block",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid rgba(58,31,8,.08)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "var(--jim-shadow-sm)",
    width: 320,
    fontFamily: "var(--font-sans)"
  },
  art: {
    position: "relative",
    height: 160
  },
  artTop: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  artFoot: {
    position: "absolute",
    bottom: 12,
    left: 16,
    display: "flex",
    alignItems: "baseline",
    gap: 8
  },
  specChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 11px",
    borderRadius: 999,
    background: "rgba(255,255,255,.92)",
    color: "var(--jim-text)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".02em"
  },
  pctXL: {
    fontSize: 44,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-.035em",
    lineHeight: 1,
    textShadow: "0 2px 12px rgba(58,31,8,.2)"
  },
  body: {
    padding: "18px"
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 2
  },
  ville: {
    fontSize: 20,
    fontWeight: 800,
    color: "var(--jim-text)",
    margin: 0,
    letterSpacing: "-.02em"
  },
  chipType: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 999,
    background: "var(--jim-beige-light)",
    color: "var(--jim-text)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".02em"
  },
  addr: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    margin: "4px 0 14px",
    fontSize: 13,
    color: "var(--jim-muted)",
    fontWeight: 500
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--jim-text-body)",
    fontWeight: 600,
    marginBottom: 14
  },
  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5
  },
  metaDot: {
    color: "var(--jim-muted)",
    opacity: .5
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  }
};

/* ============================================================
   VARIANTE D — Liste dense
   ============================================================ */
function CardD() {
  const rows = [{
    ...MISSION,
    urgent: true
  }, {
    ...MISSION,
    ville: "Villeurbanne",
    quartier: "Gratte-Ciel",
    retro: 72,
    dateStart: "18",
    dateEnd: "25",
    type: "Centre",
    specialite: "Neuro & rééducation",
    specialiteShort: "Neuro"
  }, {
    ...MISSION,
    ville: "Lyon 7ᵉ",
    quartier: "Jean-Macé",
    retro: 65,
    dateStart: "22",
    dateEnd: "29",
    type: "Libéral",
    specialite: "Pédiatrie",
    specialiteShort: "Pédiatrie"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: dStyles.wrap
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      ...dStyles.row,
      borderTop: i === 0 ? "0" : "1px solid var(--jim-beige-light)"
    },
    className: "jc-hover-row"
  }, /*#__PURE__*/React.createElement("div", {
    style: dStyles.left
  }, r.urgent ? /*#__PURE__*/React.createElement("span", {
    style: dStyles.urgentDot,
    "aria-label": "Urgent"
  }) : /*#__PURE__*/React.createElement("span", {
    style: dStyles.dotPlain
  }), /*#__PURE__*/React.createElement("div", {
    style: dStyles.dateStack
  }, /*#__PURE__*/React.createElement("span", {
    style: dStyles.dateNum
  }, r.dateStart), /*#__PURE__*/React.createElement("span", {
    style: dStyles.dateMonth
  }, r.month.slice(0, 3), "."))), /*#__PURE__*/React.createElement("div", {
    style: dStyles.mid
  }, /*#__PURE__*/React.createElement("div", {
    style: dStyles.midTop
  }, /*#__PURE__*/React.createElement("h4", {
    style: dStyles.villeD
  }, r.ville, " \xB7 ", r.quartier), r.verified && /*#__PURE__*/React.createElement(BadgeVerified, null)), /*#__PURE__*/React.createElement("div", {
    style: dStyles.midBot
  }, /*#__PURE__*/React.createElement("span", {
    style: dStyles.specD
  }, r.specialite), /*#__PURE__*/React.createElement("span", {
    style: dStyles.metaDot
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: dStyles.typeD
  }, r.type), /*#__PURE__*/React.createElement("span", {
    style: dStyles.metaDot
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: dStyles.durD
  }, r.dateStart, "\u2013", r.dateEnd, " ", r.month))), /*#__PURE__*/React.createElement("div", {
    style: dStyles.right
  }, /*#__PURE__*/React.createElement("div", {
    style: dStyles.pctD
  }, r.retro, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, "%")), /*#__PURE__*/React.createElement(SaveBtn, {
    size: 28
  })))));
}
const dStyles = {
  wrap: {
    width: 620,
    background: "#fff",
    border: "1px solid rgba(58,31,8,.08)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "var(--jim-shadow-sm)",
    fontFamily: "var(--font-sans)"
  },
  row: {
    display: "grid",
    gridTemplateColumns: "64px 1fr auto",
    alignItems: "center",
    gap: 18,
    padding: "18px 20px",
    textDecoration: "none",
    color: "inherit"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  urgentDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "var(--jim-primary)",
    flexShrink: 0,
    boxShadow: "0 0 0 4px rgba(255,124,92,.18)"
  },
  dotPlain: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "var(--jim-beige-mid)",
    flexShrink: 0
  },
  dateStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    lineHeight: 1
  },
  dateNum: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--jim-text)",
    letterSpacing: "-.02em"
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".1em",
    marginTop: 2
  },
  mid: {
    minWidth: 0
  },
  midTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4
  },
  villeD: {
    fontSize: 15,
    fontWeight: 800,
    color: "var(--jim-text)",
    margin: 0,
    letterSpacing: "-.01em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  midBot: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "var(--jim-muted)",
    fontWeight: 500
  },
  specD: {
    color: "var(--jim-text-body)",
    fontWeight: 600
  },
  typeD: {},
  durD: {},
  metaDot: {
    opacity: .5
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 14
  },
  pctD: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--jim-primary)",
    letterSpacing: "-.03em",
    lineHeight: 1
  }
};

/* ============================================================
   VARIANTE E — Confortable avec photo ville (placeholder)
   ============================================================ */
function CardE() {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: eStyles.card,
    className: "jc-hover"
  }, /*#__PURE__*/React.createElement("div", {
    style: eStyles.photoWrap
  }, /*#__PURE__*/React.createElement(PhotoPlaceholder, null), /*#__PURE__*/React.createElement("div", {
    style: eStyles.photoTop
  }, /*#__PURE__*/React.createElement("span", {
    style: eStyles.urgentPill
  }, /*#__PURE__*/React.createElement("span", {
    style: eStyles.urgentDotE
  }), "2 candidats"), /*#__PURE__*/React.createElement(SaveBtn, {
    size: 34
  }))), /*#__PURE__*/React.createElement("div", {
    style: eStyles.body
  }, /*#__PURE__*/React.createElement("div", {
    style: eStyles.hgroup
  }, /*#__PURE__*/React.createElement("h3", {
    style: eStyles.h
  }, MISSION.ville, ", ", MISSION.quartier), /*#__PURE__*/React.createElement("div", {
    style: eStyles.subRow
  }, /*#__PURE__*/React.createElement("span", {
    style: eStyles.type
  }, MISSION.type), /*#__PURE__*/React.createElement("span", {
    style: eStyles.dot
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: eStyles.spec
  }, MISSION.specialite))), /*#__PURE__*/React.createElement("div", {
    style: eStyles.dateCard
  }, /*#__PURE__*/React.createElement("div", {
    style: eStyles.dateBlock
  }, /*#__PURE__*/React.createElement("span", {
    style: eStyles.dLabel
  }, "du"), /*#__PURE__*/React.createElement("span", {
    style: eStyles.dVal
  }, MISSION.dateStart, " ", MISSION.month.slice(0, 3), ".")), /*#__PURE__*/React.createElement("div", {
    style: eStyles.dateSep
  }, "\u2192"), /*#__PURE__*/React.createElement("div", {
    style: eStyles.dateBlock
  }, /*#__PURE__*/React.createElement("span", {
    style: eStyles.dLabel
  }, "au"), /*#__PURE__*/React.createElement("span", {
    style: eStyles.dVal
  }, MISSION.dateEnd, " ", MISSION.month.slice(0, 3), ".")), /*#__PURE__*/React.createElement("div", {
    style: eStyles.pctCorner
  }, /*#__PURE__*/React.createElement("span", {
    style: eStyles.pctCornerVal
  }, MISSION.retro, "%"), /*#__PURE__*/React.createElement("span", {
    style: eStyles.pctCornerLbl
  }, "r\xE9tro"))), /*#__PURE__*/React.createElement("div", {
    style: eStyles.footer
  }, /*#__PURE__*/React.createElement(BadgeVerified, null), /*#__PURE__*/React.createElement(PostulerBtn, null))));
}
function PhotoPlaceholder() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 360 200",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      width: "100%",
      height: "100%",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "eg1",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#ffd9c2"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".6",
    stopColor: "#ffc5b3"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#e8bb9a"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "360",
    height: "200",
    fill: "url(#eg1)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "280",
    cy: "62",
    r: "28",
    fill: "#fff",
    opacity: ".45"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,150 Q90,110 180,140 T360,125 L360,200 L0,200 Z",
    fill: "#3a1f08",
    opacity: ".12"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#3a1f08",
    opacity: ".32"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "130",
    width: "24",
    height: "50"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "64",
    y: "115",
    width: "18",
    height: "65"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "82",
    y: "125",
    width: "20",
    height: "55"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "112",
    y: "100",
    width: "28",
    height: "80"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "126,70 130,100 140,100 140,85"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "150",
    y: "130",
    width: "16",
    height: "50"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "168",
    y: "120",
    width: "22",
    height: "60"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "200",
    y: "140",
    width: "18",
    height: "40"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "222",
    y: "110",
    width: "26",
    height: "70"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "255",
    y: "130",
    width: "20",
    height: "50"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "290",
    y: "120",
    width: "24",
    height: "60"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "320",
    y: "135",
    width: "18",
    height: "45"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "180",
    width: "360",
    height: "20",
    fill: "#3a1f08",
    opacity: ".2"
  }));
}
const eStyles = {
  card: {
    display: "block",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid rgba(58,31,8,.08)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "var(--jim-shadow)",
    width: 360,
    fontFamily: "var(--font-sans)"
  },
  photoWrap: {
    position: "relative",
    height: 200
  },
  photoTop: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  urgentPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 11px",
    borderRadius: 999,
    background: "rgba(255,255,255,.96)",
    color: "var(--jim-text)",
    fontSize: 11,
    fontWeight: 700
  },
  urgentDotE: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background: "var(--jim-primary)"
  },
  body: {
    padding: "20px 22px 22px"
  },
  hgroup: {
    marginBottom: 16
  },
  h: {
    fontSize: 22,
    fontWeight: 800,
    color: "var(--jim-text)",
    margin: 0,
    letterSpacing: "-.02em",
    lineHeight: 1.15
  },
  subRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    fontSize: 13,
    color: "var(--jim-muted)",
    fontWeight: 500
  },
  type: {
    color: "var(--jim-text-body)",
    fontWeight: 600
  },
  dot: {
    opacity: .5
  },
  spec: {},
  dateCard: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr auto",
    alignItems: "center",
    gap: 10,
    background: "var(--jim-surface-alt)",
    borderRadius: 14,
    padding: "12px 16px",
    marginBottom: 16
  },
  dateBlock: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1
  },
  dLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".12em",
    marginBottom: 4
  },
  dVal: {
    fontSize: 16,
    fontWeight: 800,
    color: "var(--jim-text)",
    letterSpacing: "-.01em"
  },
  dateSep: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--jim-primary)"
  },
  pctCorner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1,
    paddingLeft: 12,
    borderLeft: "1px solid var(--jim-beige-mid)"
  },
  pctCornerVal: {
    fontSize: 20,
    fontWeight: 800,
    color: "var(--jim-primary)",
    letterSpacing: "-.02em"
  },
  pctCornerLbl: {
    fontSize: 9,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".12em",
    marginTop: 4
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  }
};

/* ============================================================
   VARIANTE F — Éditoriale
   ============================================================ */
function CardF() {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: fStyles.card,
    className: "jc-hover"
  }, /*#__PURE__*/React.createElement("div", {
    style: fStyles.topBar
  }, /*#__PURE__*/React.createElement("div", {
    style: fStyles.topL
  }, /*#__PURE__*/React.createElement("span", {
    style: fStyles.eyebrow
  }, "Disponible d\xE8s"), /*#__PURE__*/React.createElement("span", {
    style: fStyles.topDate
  }, MISSION.dateStart, " ", MISSION.month)), /*#__PURE__*/React.createElement(SaveBtn, {
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    style: fStyles.pctHero
  }, /*#__PURE__*/React.createElement("span", {
    style: fStyles.pctBig
  }, MISSION.retro), /*#__PURE__*/React.createElement("div", {
    style: fStyles.pctSide
  }, /*#__PURE__*/React.createElement("span", {
    style: fStyles.pctPct
  }, "%"), /*#__PURE__*/React.createElement("span", {
    style: fStyles.pctRetro
  }, "r\xE9tro"))), /*#__PURE__*/React.createElement("div", {
    style: fStyles.meta
  }, /*#__PURE__*/React.createElement("div", {
    style: fStyles.metaLine
  }, /*#__PURE__*/React.createElement("span", {
    style: fStyles.metaIco
  }, cardIconPin), /*#__PURE__*/React.createElement("span", {
    style: fStyles.metaTxt
  }, MISSION.ville, " \xB7 ", MISSION.quartier)), /*#__PURE__*/React.createElement("div", {
    style: fStyles.metaLine
  }, /*#__PURE__*/React.createElement("span", {
    style: fStyles.metaIco
  }, cardIconBuild), /*#__PURE__*/React.createElement("span", {
    style: fStyles.metaTxt
  }, MISSION.type, " \xB7 ", MISSION.specialite)), /*#__PURE__*/React.createElement("div", {
    style: fStyles.metaLine
  }, /*#__PURE__*/React.createElement("span", {
    style: fStyles.metaIco
  }, cardIconCal), /*#__PURE__*/React.createElement("span", {
    style: fStyles.metaTxt
  }, MISSION.duration, " (", MISSION.dateStart, "\u2013", MISSION.dateEnd, " ", MISSION.month, ")"))), /*#__PURE__*/React.createElement("div", {
    style: fStyles.footer
  }, /*#__PURE__*/React.createElement(BadgeVerified, null), /*#__PURE__*/React.createElement(PostulerBtn, {
    tone: "dark"
  })));
}
const fStyles = {
  card: {
    display: "block",
    textDecoration: "none",
    background: "var(--jim-surface-alt)",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 24,
    padding: "20px 22px 22px",
    boxShadow: "var(--jim-shadow-sm)",
    width: 320,
    fontFamily: "var(--font-sans)",
    position: "relative",
    overflow: "hidden"
  },
  topBar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8
  },
  topL: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".15em",
    marginBottom: 4
  },
  topDate: {
    fontSize: 14,
    fontWeight: 800,
    color: "var(--jim-text)",
    letterSpacing: "-.01em"
  },
  pctHero: {
    display: "flex",
    alignItems: "flex-start",
    gap: 4,
    margin: "8px 0 24px",
    lineHeight: .85
  },
  pctBig: {
    fontSize: 128,
    fontWeight: 800,
    color: "var(--jim-primary)",
    letterSpacing: "-.06em"
  },
  pctSide: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 14
  },
  pctPct: {
    fontSize: 44,
    fontWeight: 800,
    color: "var(--jim-primary)",
    letterSpacing: "-.04em",
    lineHeight: 1
  },
  pctRetro: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".14em",
    marginTop: 6
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: 16,
    borderTop: "1px solid var(--jim-beige-mid)",
    marginBottom: 18
  },
  metaLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "var(--jim-text)",
    fontWeight: 600
  },
  metaIco: {
    display: "inline-flex",
    color: "var(--jim-muted)",
    width: 14,
    justifyContent: "center"
  },
  metaTxt: {
    letterSpacing: "-.005em"
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  }
};

/* ============================================================
   VARIANTE G — Timeline / calendrier
   ============================================================ */
function CardG() {
  const days = [{
    n: 13,
    w: "S",
    off: true
  }, {
    n: 14,
    w: "D",
    off: true
  }, {
    n: 15,
    w: "L",
    in: "start"
  }, {
    n: 16,
    w: "M",
    in: "mid"
  }, {
    n: 17,
    w: "M",
    in: "mid"
  }, {
    n: 18,
    w: "J",
    in: "mid"
  }, {
    n: 19,
    w: "V",
    in: "mid"
  }, {
    n: 20,
    w: "S",
    in: "mid"
  }, {
    n: 21,
    w: "D",
    in: "mid"
  }, {
    n: 22,
    w: "L",
    in: "end"
  }, {
    n: 23,
    w: "M",
    off: true
  }, {
    n: 24,
    w: "M",
    off: true
  }];
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: gStyles.card,
    className: "jc-hover"
  }, /*#__PURE__*/React.createElement("div", {
    style: gStyles.topRow
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: gStyles.eyebrow
  }, MISSION.month, " ", MISSION.year), /*#__PURE__*/React.createElement("h3", {
    style: gStyles.title
  }, MISSION.duration, " \xB7 ", MISSION.ville)), /*#__PURE__*/React.createElement(SaveBtn, {
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    style: gStyles.calendar
  }, days.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...gStyles.day,
      ...(d.in === "start" ? gStyles.dayStart : {}),
      ...(d.in === "mid" ? gStyles.dayMid : {}),
      ...(d.in === "end" ? gStyles.dayEnd : {}),
      ...(d.off ? gStyles.dayOff : {})
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: gStyles.dayW
  }, d.w), /*#__PURE__*/React.createElement("span", {
    style: gStyles.dayN
  }, d.n)))), /*#__PURE__*/React.createElement("div", {
    style: gStyles.rowSplit
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: gStyles.eyebrow
  }, "Mission"), /*#__PURE__*/React.createElement("p", {
    style: gStyles.sub
  }, MISSION.type, " \xB7 ", MISSION.specialite)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: gStyles.eyebrow
  }, "R\xE9trocession"), /*#__PURE__*/React.createElement("p", {
    style: gStyles.pctG
  }, MISSION.retro, "%"))), /*#__PURE__*/React.createElement("div", {
    style: gStyles.footer
  }, /*#__PURE__*/React.createElement(BadgeVerified, null), /*#__PURE__*/React.createElement(PostulerBtn, null)));
}
const gStyles = {
  card: {
    display: "block",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid rgba(58,31,8,.08)",
    borderRadius: 20,
    padding: "20px 22px 22px",
    boxShadow: "var(--jim-shadow-sm)",
    width: 360,
    fontFamily: "var(--font-sans)"
  },
  topRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".15em",
    display: "block",
    marginBottom: 4
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--jim-text)",
    margin: 0,
    letterSpacing: "-.015em"
  },
  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 3,
    marginBottom: 18
  },
  day: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    padding: "8px 0",
    background: "var(--jim-surface-alt)",
    color: "var(--jim-text)",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 4
  },
  dayOff: {
    background: "transparent",
    color: "var(--jim-muted)",
    opacity: .5
  },
  dayMid: {
    background: "var(--jim-primary-pale)",
    color: "var(--jim-primary)"
  },
  dayStart: {
    background: "var(--jim-primary)",
    color: "#fff",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  dayEnd: {
    background: "var(--jim-primary)",
    color: "#fff",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  dayW: {
    fontSize: 9,
    fontWeight: 700,
    opacity: .7,
    textTransform: "uppercase",
    letterSpacing: ".1em"
  },
  dayN: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "-.02em"
  },
  rowSplit: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 18,
    paddingBottom: 16,
    borderBottom: "1px solid var(--jim-beige-light)"
  },
  sub: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--jim-text)",
    margin: 0,
    letterSpacing: "-.01em"
  },
  pctG: {
    fontSize: 24,
    fontWeight: 800,
    color: "var(--jim-primary)",
    margin: 0,
    letterSpacing: "-.03em",
    lineHeight: 1
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  }
};

/* ============================================================
   APP
   ============================================================ */
function App() {
  return /*#__PURE__*/React.createElement(DesignCanvas, {
    title: "JIM \xB7 Cards Annonces",
    subtitle: "7 directions explorant structure, densit\xE9, traitement visuel et hi\xE9rarchie \u2014 mission-type commune"
  }, /*#__PURE__*/React.createElement(DCSection, {
    id: "compact",
    title: "Compact \xB7 sans d\xE9coratif",
    subtitle: "Tout en info structur\xE9e. Scan rapide en 3 colonnes kanban."
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "A",
    label: "A \xB7 Structur\xE9e \u2014 r\xE9tro en h\xE9ro",
    width: 340,
    height: 380
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement(CardA, null))), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "F",
    label: "F \xB7 \xC9ditoriale \u2014 affiche",
    width: 360,
    height: 500
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement(CardF, null)))), /*#__PURE__*/React.createElement(DCSection, {
    id: "visual",
    title: "Avec visuel \u2014 map, glyphe, illustration",
    subtitle: "Le visuel apporte de l'info (localisation ou sp\xE9cialit\xE9), pas de la d\xE9coration."
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "B",
    label: "B \xB7 Mini-map g\xE9olocalis\xE9e",
    width: 360,
    height: 480
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement(CardB, null))), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "C",
    label: "C \xB7 Glyphe par sp\xE9cialit\xE9",
    width: 360,
    height: 500
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement(CardC, null))), /*#__PURE__*/React.createElement(DCArtboard, {
    id: "E",
    label: "E \xB7 Photo ville \u2014 confortable",
    width: 400,
    height: 560
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement(CardE, null)))), /*#__PURE__*/React.createElement(DCSection, {
    id: "calendar",
    title: "Date-first \u2014 le temps comme visuel",
    subtitle: "Pour rempla\xE7ants qui filtrent d'abord par disponibilit\xE9."
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "G",
    label: "G \xB7 Timeline mois",
    width: 400,
    height: 440
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement(CardG, null)))), /*#__PURE__*/React.createElement(DCSection, {
    id: "dense",
    title: "Dense \xB7 liste",
    subtitle: "Une ligne par annonce pour les longues sessions de recherche."
  }, /*#__PURE__*/React.createElement(DCArtboard, {
    id: "D",
    label: "D \xB7 Liste dense (3 rangs)",
    width: 660,
    height: 280
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement(CardD, null)))));
}
const pad = {
  padding: 20,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center"
};
Object.assign(window, {
  CardA,
  CardB,
  CardC,
  CardD,
  CardE,
  CardF,
  CardG,
  App
});
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/cards-annonces.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), labels/titles are inline-editable,
// and any artboard can be opened in a fullscreen focus overlay (←/→/Esc).
// State persists to a .design-canvas.state.json sidecar via the host
// bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}', '.dc-card{transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px}', '.dc-grip{cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{cursor:pointer;border-radius:4px;padding:3px 6px;display:flex;align-items:center;transition:background .12s}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-expand{position:absolute;bottom:100%;right:0;margin-bottom:5px;z-index:2;opacity:0;transition:opacity .12s,background .12s;', '  width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center}', '.dc-expand:hover{background:rgba(0,0,0,.06);color:#2a251f}', '[data-dc-slot]:hover .dc-expand{opacity:1}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, focused
// artboard). Order/titles/labels persist to a .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const srcIds = [];
    React.Children.forEach(sec.props.children, ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (!aid) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if (e.ctrlKey) {
        // trackpad pinch (or explicit ctrl+wheel)
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const srcOrder = artboards.map(a => a.props.id ?? a.props.label);
  const sec = ctx && sid && ctx.section(sid) || {};
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 80,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px 56px'
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow",
    style: {
      position: 'absolute',
      bottom: '100%',
      left: -4,
      marginBottom: 4,
      color: DC.label
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    onPointerDown: e => e.stopPropagation(),
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    const ns = sectionOrder[(secIdx + d + sectionOrder.length) % sectionOrder.length];
    const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
    if (first) ctx.setFocus(`${ns}/${first}`);
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/design-canvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/headers.jsx
try { (() => {
/* ============================================================
   JIM — Headers · 5 directions
   Explorations pour landing + états (anonyme / remplaçant / titulaire / onboarding)
   ============================================================ */

/* ─── Icons ───────────────────────────────────────────────── */
const ico = {
  search: /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })),
  msg: /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.85",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
  })),
  bell: /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.85",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.73 21a2 2 0 0 1-3.46 0"
  })),
  chev: /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })),
  plus: /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  menu: /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  })),
  pin: /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  qr: /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "7",
    height: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "14",
    y1: "14",
    x2: "14",
    y2: "17"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17",
    y1: "14",
    x2: "20",
    y2: "14"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17",
    y1: "17",
    x2: "17",
    y2: "20"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "17",
    x2: "20",
    y2: "20"
  }))
};

/* Vrai logo JIM — wordmark "jim jobs in med" */
function Wordmark({
  size = 32
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-jim.svg",
    alt: "JIM \u2014 Job In Med",
    style: {
      height: size,
      width: "auto",
      display: "block"
    }
  });
}
/* Logo compact — crop sur le "jim" seul (partie haute du SVG) */
function LogoSquare({
  size = 36
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size * 2.6,
      height: size,
      overflow: "hidden",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-jim.svg",
    alt: "JIM",
    style: {
      height: size * 2.4,
      width: "auto",
      marginTop: -size * 0.15,
      display: "block",
      objectFit: "none",
      objectPosition: "top"
    }
  }));
}
function Avatar({
  initials = "NB",
  size = 30
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: Math.round(size * .33),
      background: "linear-gradient(135deg,var(--jim-primary),var(--jim-accent))",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * .38,
      fontWeight: 700,
      letterSpacing: ".02em"
    }
  }, initials);
}

/* ============================================================
   DIRECTION 1 — "Classique Airbnb-like"
   Logo wordmark · nav centrée · deux CTA + avatar · fine
   ============================================================ */
function HeaderA({
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: hA.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: hA.left
  }, /*#__PURE__*/React.createElement(Wordmark, null)), /*#__PURE__*/React.createElement("nav", {
    style: hA.nav
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...hA.link,
      ...hA.linkActive
    }
  }, "Missions"), /*#__PURE__*/React.createElement("a", {
    style: hA.link
  }, "Rempla\xE7ants"), /*#__PURE__*/React.createElement("a", {
    style: hA.link
  }, "Comment \xE7a marche"), /*#__PURE__*/React.createElement("a", {
    style: hA.link
  }, "App mobile")), /*#__PURE__*/React.createElement("div", {
    style: hA.right
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hA.btnGhost
  }, "Se connecter"), /*#__PURE__*/React.createElement("button", {
    style: hA.btnPrimary
  }, ico.plus, /*#__PURE__*/React.createElement("span", null, "Publier"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hA.btnPrimary
  }, ico.plus, /*#__PURE__*/React.createElement("span", null, "Publier")), /*#__PURE__*/React.createElement("button", {
    style: hA.iconBtn
  }, ico.bell, /*#__PURE__*/React.createElement("span", {
    style: hA.dot
  })), /*#__PURE__*/React.createElement(Avatar, null))));
}
const hA = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "12px 28px",
    background: "rgba(253,246,237,.88)",
    backdropFilter: "blur(20px) saturate(180%)",
    borderBottom: "1px solid rgba(58,31,8,.06)",
    fontFamily: "var(--font-sans)"
  },
  left: {
    flexShrink: 0
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "center"
  },
  link: {
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--jim-text-body)",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none"
  },
  linkActive: {
    color: "var(--jim-primary)",
    fontWeight: 700,
    background: "var(--jim-primary-pale)"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0
  },
  btnGhost: {
    background: "transparent",
    border: 0,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text)",
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 10
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "9px 16px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  iconBtn: {
    position: "relative",
    width: 36,
    height: 36,
    borderRadius: 12,
    background: "#fff",
    border: "1px solid var(--jim-beige-mid)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--jim-text)"
  },
  dot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "var(--jim-primary)",
    border: "2px solid #fff"
  }
};

/* ============================================================
   DIRECTION 2 — "Pillbox flottante"
   Capsule arrondie, style Vercel/Linear 2025
   ============================================================ */
function HeaderB({
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: hB.outer
  }, /*#__PURE__*/React.createElement("div", {
    style: hB.pill
  }, /*#__PURE__*/React.createElement(LogoSquare, {
    size: 32
  }), /*#__PURE__*/React.createElement("nav", {
    style: hB.nav
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...hB.link,
      ...hB.linkActive
    }
  }, "Missions"), /*#__PURE__*/React.createElement("a", {
    style: hB.link
  }, "Rempla\xE7ants"), /*#__PURE__*/React.createElement("a", {
    style: hB.link
  }, "Comment \xE7a marche"), /*#__PURE__*/React.createElement("a", {
    style: hB.link
  }, "App mobile")), /*#__PURE__*/React.createElement("div", {
    style: hB.actions
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hB.ghost
  }, "Connexion"), /*#__PURE__*/React.createElement("button", {
    style: hB.cta
  }, "Publier", ico.plus)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hB.cta
  }, "Publier", ico.plus), /*#__PURE__*/React.createElement(Avatar, {
    size: 28
  })))));
}
const hB = {
  outer: {
    padding: "16px 28px",
    background: "var(--jim-background)",
    display: "flex",
    justifyContent: "center",
    fontFamily: "var(--font-sans)"
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    background: "#fff",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 999,
    padding: "6px 6px 6px 18px",
    boxShadow: "0 2px 8px rgba(58,31,8,.06),0 12px 32px rgba(58,31,8,.06)"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 2
  },
  link: {
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--jim-text-body)",
    borderRadius: 999,
    cursor: "pointer",
    textDecoration: "none"
  },
  linkActive: {
    color: "var(--jim-text)",
    fontWeight: 700,
    background: "var(--jim-surface-alt)"
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginLeft: 8
  },
  ghost: {
    background: "transparent",
    border: 0,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text)",
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 999
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "var(--jim-text)",
    color: "#fff",
    border: 0,
    padding: "9px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  }
};

/* ============================================================
   DIRECTION 3 — "Split-bar éditoriale"
   Top thin bar (contexte marque) + nav épaisse (produit)
   ============================================================ */
function HeaderC({
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: hC.topBar
  }, /*#__PURE__*/React.createElement("div", {
    style: hC.topInner
  }, /*#__PURE__*/React.createElement("span", {
    style: hC.topBadge
  }, /*#__PURE__*/React.createElement("span", {
    style: hC.pulse
  }), "156 missions publi\xE9es cette semaine"), /*#__PURE__*/React.createElement("div", {
    style: hC.topLinks
  }, /*#__PURE__*/React.createElement("a", {
    style: hC.topLink
  }, "T\xE9l\xE9charger l'app ", ico.qr), /*#__PURE__*/React.createElement("span", {
    style: hC.topSep
  }), /*#__PURE__*/React.createElement("a", {
    style: hC.topLink
  }, "Aide")))), /*#__PURE__*/React.createElement("div", {
    style: hC.main
  }, /*#__PURE__*/React.createElement("div", {
    style: hC.mainInner
  }, /*#__PURE__*/React.createElement("div", {
    style: hC.brandBlock
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: hC.tagline
  }, "Job In Med")), /*#__PURE__*/React.createElement("nav", {
    style: hC.nav
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...hC.link,
      ...hC.linkActive
    }
  }, "Missions"), /*#__PURE__*/React.createElement("a", {
    style: hC.link
  }, "Rempla\xE7ants"), /*#__PURE__*/React.createElement("a", {
    style: hC.link
  }, "Comment \xE7a marche"), /*#__PURE__*/React.createElement("a", {
    style: hC.link
  }, "App mobile")), /*#__PURE__*/React.createElement("div", {
    style: hC.right
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hC.ghost
  }, "Se connecter"), /*#__PURE__*/React.createElement("button", {
    style: hC.cta
  }, "Publier une mission")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hC.cta
  }, "Publier"), /*#__PURE__*/React.createElement(Avatar, null))))));
}
const hC = {
  topBar: {
    background: "var(--jim-text)",
    color: "#fff"
  },
  topInner: {
    maxWidth: 1320,
    margin: "0 auto",
    padding: "8px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: ".02em"
  },
  topBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    opacity: .92
  },
  pulse: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background: "var(--jim-primary)",
    boxShadow: "0 0 0 3px rgba(255,124,92,.3)"
  },
  topLinks: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    opacity: .82
  },
  topLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    color: "#fff",
    textDecoration: "none",
    cursor: "pointer"
  },
  topSep: {
    width: 1,
    height: 12,
    background: "rgba(255,255,255,.2)"
  },
  main: {
    background: "rgba(253,246,237,.95)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid var(--jim-beige-mid)"
  },
  mainInner: {
    maxWidth: 1320,
    margin: "0 auto",
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    gap: 24
  },
  brandBlock: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingRight: 24,
    borderRight: "1px solid var(--jim-beige-mid)"
  },
  tagline: {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".18em"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flex: 1
  },
  link: {
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--jim-text-body)",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none"
  },
  linkActive: {
    color: "var(--jim-text)",
    position: "relative"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  ghost: {
    background: "transparent",
    border: "1px solid var(--jim-beige-mid)",
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--jim-text)",
    cursor: "pointer",
    fontFamily: "inherit",
    borderRadius: 12,
    background: "#fff"
  },
  cta: {
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "10px 18px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  }
};

/* ============================================================
   DIRECTION 4 — "Persona switcher" 
   Toggle Je cherche / Je publie comme axe central
   ============================================================ */
function HeaderD({
  state = "anon",
  persona = "cherche"
}) {
  const [p, setP] = React.useState(persona);
  return /*#__PURE__*/React.createElement("div", {
    style: hD.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: hD.left
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: hD.switcher
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setP("cherche"),
    style: {
      ...hD.sw,
      ...(p === "cherche" ? hD.swOn : {})
    }
  }, "Je cherche"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setP("publie"),
    style: {
      ...hD.sw,
      ...(p === "publie" ? hD.swOn : {})
    }
  }, "Je publie")), /*#__PURE__*/React.createElement("nav", {
    style: hD.nav
  }, p === "cherche" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    style: hD.link
  }, "Missions"), /*#__PURE__*/React.createElement("a", {
    style: hD.link
  }, "Par ville"), /*#__PURE__*/React.createElement("a", {
    style: hD.link
  }, "Par sp\xE9cialit\xE9")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    style: hD.link
  }, "Rempla\xE7ants"), /*#__PURE__*/React.createElement("a", {
    style: hD.link
  }, "Mes annonces"), /*#__PURE__*/React.createElement("a", {
    style: hD.link
  }, "Tarifs"))), /*#__PURE__*/React.createElement("div", {
    style: hD.right
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hD.ghost
  }, "Connexion"), /*#__PURE__*/React.createElement("button", {
    style: hD.cta
  }, p === "publie" ? "Publier" : "Créer un profil")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hD.cta
  }, p === "publie" ? "Publier" : "Postuler"), /*#__PURE__*/React.createElement(Avatar, null))));
}
const hD = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "12px 28px",
    background: "#fff",
    borderBottom: "1px solid var(--jim-beige-mid)",
    fontFamily: "var(--font-sans)"
  },
  left: {
    flexShrink: 0,
    paddingRight: 8
  },
  switcher: {
    display: "inline-flex",
    background: "var(--jim-surface-alt)",
    borderRadius: 999,
    padding: 3,
    flexShrink: 0
  },
  sw: {
    border: 0,
    background: "transparent",
    padding: "7px 16px",
    fontSize: 12,
    fontWeight: 700,
    color: "var(--jim-muted)",
    cursor: "pointer",
    borderRadius: 999,
    fontFamily: "inherit",
    letterSpacing: "-.005em"
  },
  swOn: {
    background: "#fff",
    color: "var(--jim-text)",
    boxShadow: "0 1px 3px rgba(58,31,8,.1)"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flex: 1,
    justifyContent: "center"
  },
  link: {
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--jim-text-body)",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0
  },
  ghost: {
    background: "transparent",
    border: 0,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text)",
    cursor: "pointer",
    fontFamily: "inherit"
  },
  cta: {
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "9px 18px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  }
};

/* ============================================================
   DIRECTION 5 — "Minimal monolithique" (scroll-shrink)
   Full-bleed en top de page, se rétracte en pill au scroll
   ============================================================ */
function HeaderE({
  scrolled = false,
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...hE.wrap,
      ...(scrolled ? hE.wrapScrolled : {})
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...hE.inner,
      ...(scrolled ? hE.innerScrolled : {})
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: hE.brand
  }, scrolled ? /*#__PURE__*/React.createElement(LogoSquare, {
    size: 30
  }) : /*#__PURE__*/React.createElement(Wordmark, {
    size: 30
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      ...hE.nav,
      ...(scrolled ? {
        gap: 2
      } : {})
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...hE.link,
      ...hE.linkActive
    }
  }, "Missions"), /*#__PURE__*/React.createElement("a", {
    style: hE.link
  }, "Rempla\xE7ants"), !scrolled && /*#__PURE__*/React.createElement("a", {
    style: hE.link
  }, "Comment \xE7a marche"), !scrolled && /*#__PURE__*/React.createElement("a", {
    style: hE.link
  }, "App mobile")), /*#__PURE__*/React.createElement("div", {
    style: hE.right
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, !scrolled && /*#__PURE__*/React.createElement("button", {
    style: hE.ghost
  }, "Se connecter"), /*#__PURE__*/React.createElement("button", {
    style: hE.cta
  }, ico.plus, /*#__PURE__*/React.createElement("span", null, "Publier"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hE.cta
  }, ico.plus, /*#__PURE__*/React.createElement("span", null, "Publier")), /*#__PURE__*/React.createElement(Avatar, {
    size: scrolled ? 28 : 32
  })))));
}
const hE = {
  wrap: {
    padding: "18px 28px",
    background: "transparent",
    fontFamily: "var(--font-sans)",
    transition: "all .3s"
  },
  wrapScrolled: {
    padding: "10px 28px",
    background: "rgba(253,246,237,.9)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(58,31,8,.08)"
  },
  inner: {
    display: "flex",
    alignItems: "center",
    gap: 32,
    maxWidth: 1320,
    margin: "0 auto",
    transition: "all .3s"
  },
  innerScrolled: {
    gap: 18,
    background: "#fff",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 999,
    padding: "6px 8px 6px 20px",
    boxShadow: "0 2px 12px rgba(58,31,8,.08)",
    maxWidth: 960
  },
  brand: {
    flexShrink: 0
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center"
  },
  link: {
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text-body)",
    borderRadius: 999,
    cursor: "pointer",
    textDecoration: "none"
  },
  linkActive: {
    color: "var(--jim-primary)"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0
  },
  ghost: {
    background: "transparent",
    border: 0,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text)",
    cursor: "pointer",
    fontFamily: "inherit"
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "9px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  }
};

/* ============================================================
   État "Onboarding" — bannière de progression sous header
   ============================================================ */
function OnboardingStrip() {
  return /*#__PURE__*/React.createElement("div", {
    style: ob.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: ob.inner
  }, /*#__PURE__*/React.createElement("div", {
    style: ob.left
  }, /*#__PURE__*/React.createElement("div", {
    style: ob.ring
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 36 36",
    width: "36",
    height: "36"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "15",
    fill: "none",
    stroke: "var(--jim-beige-mid)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "15",
    fill: "none",
    stroke: "var(--jim-primary)",
    strokeWidth: "3",
    strokeDasharray: "94.2",
    strokeDashoffset: "37.7",
    transform: "rotate(-90 18 18)",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("span", {
    style: ob.ringTxt
  }, "60%")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: ob.t
  }, "Compl\xE8te ton profil"), /*#__PURE__*/React.createElement("p", {
    style: ob.s
  }, "2 \xE9tapes restantes \xB7 RPPS + disponibilit\xE9s"))), /*#__PURE__*/React.createElement("div", {
    style: ob.right
  }, /*#__PURE__*/React.createElement("button", {
    style: ob.skip
  }, "Plus tard"), /*#__PURE__*/React.createElement("button", {
    style: ob.cta
  }, "Continuer"))));
}
const ob = {
  wrap: {
    background: "linear-gradient(90deg,var(--jim-primary-pale),var(--jim-surface-alt))",
    borderBottom: "1px solid var(--jim-beige-mid)"
  },
  inner: {
    maxWidth: 1320,
    margin: "0 auto",
    padding: "10px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    fontFamily: "var(--font-sans)"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 14
  },
  ring: {
    position: "relative",
    width: 36,
    height: 36,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  ringTxt: {
    position: "absolute",
    fontSize: 10,
    fontWeight: 800,
    color: "var(--jim-primary)"
  },
  t: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: "var(--jim-text)",
    letterSpacing: "-.01em"
  },
  s: {
    margin: "2px 0 0",
    fontSize: 11,
    color: "var(--jim-muted)",
    fontWeight: 500
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  skip: {
    background: "transparent",
    border: 0,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--jim-muted)",
    cursor: "pointer",
    fontFamily: "inherit"
  },
  cta: {
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "8px 14px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  }
};

/* ============================================================
   DIRECTION 6 — "Sidebar verticale" (F)
   Rail fixe à gauche, compact. Style dashboard SaaS / Notion.
   Header devient navigation latérale persistente.
   ============================================================ */
function HeaderF({
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: hF.rail
  }, /*#__PURE__*/React.createElement("div", {
    style: hF.top
  }, /*#__PURE__*/React.createElement("div", {
    style: hF.logoSq
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-jim.svg",
    alt: "JIM",
    style: {
      height: 22,
      width: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: hF.divider
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      ...hF.tab,
      ...hF.tabOn
    },
    title: "Missions"
  }, ico.search), /*#__PURE__*/React.createElement("button", {
    style: hF.tab,
    title: "Messagerie"
  }, ico.msg, /*#__PURE__*/React.createElement("span", {
    style: hF.badge
  }, "3")), /*#__PURE__*/React.createElement("button", {
    style: hF.tab,
    title: "Annonces"
  }, ico.pin), /*#__PURE__*/React.createElement("button", {
    style: hF.tab,
    title: "Notifications"
  }, ico.bell)), /*#__PURE__*/React.createElement("div", {
    style: hF.bot
  }, /*#__PURE__*/React.createElement("button", {
    style: hF.cta
  }, ico.plus), state === "anon" ? /*#__PURE__*/React.createElement("button", {
    style: hF.avatarGhost
  }, "?") : /*#__PURE__*/React.createElement(Avatar, {
    size: 34
  })));
}
const hF = {
  rail: {
    width: 64,
    minHeight: 560,
    background: "#fff",
    borderRight: "1px solid var(--jim-beige-mid)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    fontFamily: "var(--font-sans)",
    boxShadow: "var(--jim-shadow-sm)"
  },
  top: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    width: "100%"
  },
  bot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    width: "100%"
  },
  logoSq: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6
  },
  divider: {
    width: 28,
    height: 1,
    background: "var(--jim-beige-mid)",
    margin: "4px 0"
  },
  tab: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 12,
    border: 0,
    background: "transparent",
    color: "var(--jim-muted)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  tabOn: {
    background: "var(--jim-primary-pale)",
    color: "var(--jim-primary)"
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    padding: "0 4px",
    borderRadius: 999,
    background: "var(--jim-primary)",
    color: "#fff",
    fontSize: 9,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  cta: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(255,124,92,.35)"
  },
  avatarGhost: {
    width: 34,
    height: 34,
    borderRadius: 12,
    border: "1px dashed var(--jim-beige-mid)",
    background: "transparent",
    color: "var(--jim-muted)",
    fontWeight: 700,
    cursor: "pointer"
  }
};

/* ============================================================
   DIRECTION 7 — "Search-first" (G)
   Inspirée Stripe / Airbnb — la barre de recherche EST le header.
   Logo + champ de recherche dominant + avatar.
   ============================================================ */
function HeaderG({
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: hG.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: hG.left
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    style: hG.searchWrap
  }, /*#__PURE__*/React.createElement("div", {
    style: hG.searchPill
  }, /*#__PURE__*/React.createElement("div", {
    style: hG.segLeft
  }, /*#__PURE__*/React.createElement("span", {
    style: hG.segLbl
  }, "O\xF9"), /*#__PURE__*/React.createElement("span", {
    style: hG.segVal
  }, "Paris 11\u1D49")), /*#__PURE__*/React.createElement("div", {
    style: hG.segSep
  }), /*#__PURE__*/React.createElement("div", {
    style: hG.seg
  }, /*#__PURE__*/React.createElement("span", {
    style: hG.segLbl
  }, "Quand"), /*#__PURE__*/React.createElement("span", {
    style: hG.segVal
  }, "5 \u2013 19 mai")), /*#__PURE__*/React.createElement("div", {
    style: hG.segSep
  }), /*#__PURE__*/React.createElement("div", {
    style: hG.seg
  }, /*#__PURE__*/React.createElement("span", {
    style: hG.segLbl
  }, "Sp\xE9cialit\xE9"), /*#__PURE__*/React.createElement("span", {
    style: hG.segValMuted
  }, "Toutes")), /*#__PURE__*/React.createElement("button", {
    style: hG.searchBtn
  }, ico.search))), /*#__PURE__*/React.createElement("div", {
    style: hG.right
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hG.linkBtn
  }, "Publier une mission"), /*#__PURE__*/React.createElement("button", {
    style: hG.menuBtn
  }, ico.menu, /*#__PURE__*/React.createElement(Avatar, {
    size: 24,
    initials: "?"
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hG.linkBtn
  }, "Publier"), /*#__PURE__*/React.createElement("button", {
    style: hG.menuBtn
  }, ico.menu, /*#__PURE__*/React.createElement(Avatar, {
    size: 24
  })))));
}
const hG = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 20,
    padding: "14px 28px",
    background: "#fff",
    borderBottom: "1px solid var(--jim-beige-mid)",
    fontFamily: "var(--font-sans)"
  },
  left: {
    flexShrink: 0
  },
  searchWrap: {
    display: "flex",
    justifyContent: "center"
  },
  searchPill: {
    display: "inline-flex",
    alignItems: "center",
    background: "#fff",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 999,
    padding: "4px 4px 4px 8px",
    boxShadow: "var(--jim-shadow-sm)",
    maxWidth: 640,
    width: "100%"
  },
  segLeft: {
    padding: "6px 18px",
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  seg: {
    padding: "6px 18px",
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  segSep: {
    width: 1,
    height: 26,
    background: "var(--jim-beige-mid)"
  },
  segLbl: {
    fontSize: 10,
    fontWeight: 800,
    color: "var(--jim-text)",
    letterSpacing: ".02em"
  },
  segVal: {
    fontSize: 12,
    color: "var(--jim-text-body)",
    fontWeight: 500,
    marginTop: 2
  },
  segValMuted: {
    fontSize: 12,
    color: "var(--jim-muted)",
    fontWeight: 500,
    marginTop: 2
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginLeft: 6
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0
  },
  linkBtn: {
    background: "transparent",
    border: 0,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text)",
    borderRadius: 999,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  menuBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 4px 4px 10px",
    border: "1px solid var(--jim-beige-mid)",
    borderRadius: 999,
    background: "#fff",
    cursor: "pointer",
    color: "var(--jim-text)"
  }
};

/* ============================================================
   DIRECTION 8 — "Brutaliste éditorial" (H)
   Typo massive, séparateurs épais, pas d'ombre.
   Inspiré presse médicale / Le Monde digital.
   ============================================================ */
function HeaderH({
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: hH.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: hH.ruleTop
  }), /*#__PURE__*/React.createElement("div", {
    style: hH.row
  }, /*#__PURE__*/React.createElement("div", {
    style: hH.brand
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 36
  }), /*#__PURE__*/React.createElement("span", {
    style: hH.kicker
  }, "\u2116 2026 \xB7 \xE9d. Printemps")), /*#__PURE__*/React.createElement("nav", {
    style: hH.nav
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...hH.link,
      ...hH.linkActive
    }
  }, "Missions"), /*#__PURE__*/React.createElement("a", {
    style: hH.link
  }, "Rempla\xE7ants"), /*#__PURE__*/React.createElement("a", {
    style: hH.link
  }, "Tribunes"), /*#__PURE__*/React.createElement("a", {
    style: hH.link
  }, "M\xE9thode")), /*#__PURE__*/React.createElement("div", {
    style: hH.right
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hH.linkBtn
  }, "Entrer"), /*#__PURE__*/React.createElement("button", {
    style: hH.cta
  }, "Publier \u2192")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hH.cta
  }, "Publier \u2192"), /*#__PURE__*/React.createElement(Avatar, {
    size: 32
  })))), /*#__PURE__*/React.createElement("div", {
    style: hH.ruleBot
  }));
}
const hH = {
  wrap: {
    background: "var(--jim-background)",
    fontFamily: "var(--font-sans)"
  },
  ruleTop: {
    height: 3,
    background: "var(--jim-text)"
  },
  ruleBot: {
    height: 1,
    background: "var(--jim-text)"
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    padding: "14px 28px",
    maxWidth: 1320,
    margin: "0 auto"
  },
  brand: {
    display: "flex",
    alignItems: "baseline",
    gap: 14
  },
  kicker: {
    fontFamily: "var(--font-serif-italic)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--jim-muted)",
    fontWeight: 400
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 4
  },
  link: {
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--jim-text)",
    textDecoration: "none",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: ".08em"
  },
  linkActive: {
    borderBottom: "2px solid var(--jim-primary)",
    color: "var(--jim-primary)"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  linkBtn: {
    background: "transparent",
    border: 0,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--jim-text)",
    cursor: "pointer",
    fontFamily: "inherit",
    textTransform: "uppercase",
    letterSpacing: ".08em"
  },
  cta: {
    background: "var(--jim-text)",
    color: "var(--jim-background)",
    border: 0,
    padding: "11px 18px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    borderRadius: 0
  }
};

/* ============================================================
   DIRECTION 9 — "Contextuelle live" (I)
   Header qui expose l'état live du système (preuve sociale intégrée).
   Compteur de missions en direct, localisation détectée.
   ============================================================ */
function HeaderI({
  state = "anon"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: hI.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: hI.left
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 26
  }), /*#__PURE__*/React.createElement("div", {
    style: hI.liveGroup
  }, /*#__PURE__*/React.createElement("span", {
    style: hI.pulse
  }), /*#__PURE__*/React.createElement("span", {
    style: hI.liveTxt
  }, /*#__PURE__*/React.createElement("b", null, "156"), " missions \xB7 ", /*#__PURE__*/React.createElement("b", null, "42"), " \xE0 Paris 11\u1D49"))), /*#__PURE__*/React.createElement("nav", {
    style: hI.nav
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...hI.link,
      ...hI.linkActive
    }
  }, "Missions"), /*#__PURE__*/React.createElement("a", {
    style: hI.link
  }, "Rempla\xE7ants"), /*#__PURE__*/React.createElement("a", {
    style: hI.link
  }, "Ma carte")), /*#__PURE__*/React.createElement("div", {
    style: hI.right
  }, /*#__PURE__*/React.createElement("button", {
    style: hI.locPill
  }, ico.pin, /*#__PURE__*/React.createElement("span", null, "Paris 11\u1D49 \xB7 5 km"), ico.chev), state === "anon" ? /*#__PURE__*/React.createElement("button", {
    style: hI.cta
  }, "Rejoindre") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hI.iconBtn
  }, ico.bell, /*#__PURE__*/React.createElement("span", {
    style: hI.dot
  })), /*#__PURE__*/React.createElement(Avatar, {
    size: 30
  }))));
}
const hI = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "12px 28px",
    background: "#fff",
    borderBottom: "1px solid var(--jim-beige-mid)",
    fontFamily: "var(--font-sans)"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    flex: 1
  },
  liveGroup: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 12px",
    borderRadius: 999,
    background: "var(--jim-success-bg)",
    color: "#2d5e36",
    fontSize: 11,
    fontWeight: 600
  },
  pulse: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background: "var(--jim-success)",
    boxShadow: "0 0 0 3px rgba(93,143,102,.3)"
  },
  liveTxt: {
    letterSpacing: ".01em"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 2
  },
  link: {
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text-body)",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none"
  },
  linkActive: {
    color: "var(--jim-primary)",
    background: "var(--jim-primary-pale)"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end"
  },
  locPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid var(--jim-beige-mid)",
    background: "var(--jim-surface-alt)",
    color: "var(--jim-text-body)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  cta: {
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "9px 18px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  iconBtn: {
    position: "relative",
    width: 36,
    height: 36,
    borderRadius: 12,
    background: "var(--jim-surface-alt)",
    border: "1px solid var(--jim-beige-mid)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--jim-text)"
  },
  dot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "var(--jim-primary)",
    border: "2px solid #fff"
  }
};

/* ============================================================
   DIRECTION 10 — "Mega-hover" (J)
   Nav minimale avec un mega-menu ouvert au hover (aperçu visible).
   Inspiré Apple / Framer.
   ============================================================ */
function HeaderJ({
  state = "anon",
  megaOpen = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: hJ.container
  }, /*#__PURE__*/React.createElement("div", {
    style: hJ.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: hJ.left
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 26
  })), /*#__PURE__*/React.createElement("nav", {
    style: hJ.nav
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...hJ.link,
      ...(megaOpen ? hJ.linkActive : {})
    }
  }, "Missions ", ico.chev), /*#__PURE__*/React.createElement("a", {
    style: hJ.link
  }, "Rempla\xE7ants ", ico.chev), /*#__PURE__*/React.createElement("a", {
    style: hJ.link
  }, "Entreprise"), /*#__PURE__*/React.createElement("a", {
    style: hJ.link
  }, "Tarifs")), /*#__PURE__*/React.createElement("div", {
    style: hJ.right
  }, state === "anon" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hJ.ghost
  }, "Connexion"), /*#__PURE__*/React.createElement("button", {
    style: hJ.cta
  }, "Commencer")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    style: hJ.cta
  }, "Publier"), /*#__PURE__*/React.createElement(Avatar, {
    size: 30
  })))), megaOpen && /*#__PURE__*/React.createElement("div", {
    style: hJ.mega
  }, /*#__PURE__*/React.createElement("div", {
    style: hJ.megaInner
  }, /*#__PURE__*/React.createElement("div", {
    style: hJ.col
  }, /*#__PURE__*/React.createElement("p", {
    style: hJ.colTitle
  }, "Explorer"), /*#__PURE__*/React.createElement("a", {
    style: hJ.megaLink
  }, /*#__PURE__*/React.createElement("b", null, "Toutes les missions"), /*#__PURE__*/React.createElement("span", null, "+156 cette semaine")), /*#__PURE__*/React.createElement("a", {
    style: hJ.megaLink
  }, /*#__PURE__*/React.createElement("b", null, "Urgentes"), /*#__PURE__*/React.createElement("span", null, "D\xE9part ", "<", " 48h")), /*#__PURE__*/React.createElement("a", {
    style: hJ.megaLink
  }, /*#__PURE__*/React.createElement("b", null, "Par ville"), /*#__PURE__*/React.createElement("span", null, "Paris, Lyon, Marseille\u2026")), /*#__PURE__*/React.createElement("a", {
    style: hJ.megaLink
  }, /*#__PURE__*/React.createElement("b", null, "Par sp\xE9cialit\xE9"), /*#__PURE__*/React.createElement("span", null, "Neuro, p\xE9dia, sport\u2026"))), /*#__PURE__*/React.createElement("div", {
    style: hJ.col
  }, /*#__PURE__*/React.createElement("p", {
    style: hJ.colTitle
  }, "Outils"), /*#__PURE__*/React.createElement("a", {
    style: hJ.megaLink
  }, /*#__PURE__*/React.createElement("b", null, "Calculateur de r\xE9trocession"), /*#__PURE__*/React.createElement("span", null, "Estime tes revenus nets")), /*#__PURE__*/React.createElement("a", {
    style: hJ.megaLink
  }, /*#__PURE__*/React.createElement("b", null, "Contrat type"), /*#__PURE__*/React.createElement("span", null, "PDF conforme ordre MK")), /*#__PURE__*/React.createElement("a", {
    style: hJ.megaLink
  }, /*#__PURE__*/React.createElement("b", null, "Guide du rempla\xE7ant"), /*#__PURE__*/React.createElement("span", null, "Tout pour commencer"))), /*#__PURE__*/React.createElement("div", {
    style: hJ.colCard
  }, /*#__PURE__*/React.createElement("div", {
    style: hJ.cardImg
  }, /*#__PURE__*/React.createElement("div", {
    style: hJ.cardImgInner
  }, /*#__PURE__*/React.createElement("span", {
    style: hJ.cardBadge
  }, "URGENT"), /*#__PURE__*/React.createElement("span", {
    style: hJ.cardPrice
  }, "92 %"))), /*#__PURE__*/React.createElement("p", {
    style: hJ.cardTitle
  }, "3 missions urgentes pr\xE8s de toi"), /*#__PURE__*/React.createElement("p", {
    style: hJ.cardSub
  }, "D\xE9part demain \xB7 r\xE9trocession 90 %+")))));
}
const hJ = {
  container: {
    position: "relative",
    background: "rgba(253,246,237,.88)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid var(--jim-beige-mid)",
    fontFamily: "var(--font-sans)"
  },
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "14px 28px",
    maxWidth: 1320,
    margin: "0 auto"
  },
  left: {
    flexShrink: 0
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "center"
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text-body)",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none"
  },
  linkActive: {
    color: "var(--jim-primary)",
    background: "var(--jim-primary-pale)"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0
  },
  ghost: {
    background: "transparent",
    border: 0,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--jim-text)",
    cursor: "pointer",
    fontFamily: "inherit"
  },
  cta: {
    background: "var(--jim-primary)",
    color: "#fff",
    border: 0,
    padding: "9px 18px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  mega: {
    background: "#fff",
    borderTop: "1px solid var(--jim-beige-mid)",
    boxShadow: "var(--jim-shadow-lg)"
  },
  megaInner: {
    maxWidth: 1320,
    margin: "0 auto",
    padding: "28px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.2fr",
    gap: 36
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  colTitle: {
    margin: "0 0 6px",
    fontSize: 10,
    fontWeight: 800,
    color: "var(--jim-muted)",
    textTransform: "uppercase",
    letterSpacing: ".18em"
  },
  megaLink: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "8px 10px",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none"
  },
  colCard: {
    background: "var(--jim-surface-alt)",
    borderRadius: 16,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  cardImg: {
    height: 120,
    borderRadius: 12,
    background: "linear-gradient(135deg,var(--jim-primary-pale),var(--jim-beige-light))",
    position: "relative",
    overflow: "hidden"
  },
  cardImgInner: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10
  },
  cardBadge: {
    background: "var(--jim-primary)",
    color: "#fff",
    fontSize: 9,
    fontWeight: 800,
    padding: "3px 7px",
    borderRadius: 6,
    letterSpacing: ".06em"
  },
  cardPrice: {
    background: "#fff",
    color: "var(--jim-text)",
    fontSize: 11,
    fontWeight: 800,
    padding: "3px 7px",
    borderRadius: 6
  },
  cardTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: "var(--jim-text)"
  },
  cardSub: {
    margin: 0,
    fontSize: 11,
    color: "var(--jim-muted)",
    fontWeight: 500
  }
};

/* Helper — choisit la bonne direction */
const HEADERS = {
  A: p => /*#__PURE__*/React.createElement(HeaderA, p),
  B: p => /*#__PURE__*/React.createElement(HeaderB, p),
  C: p => /*#__PURE__*/React.createElement(HeaderC, p),
  D: p => /*#__PURE__*/React.createElement(HeaderD, p),
  E: p => /*#__PURE__*/React.createElement(HeaderE, p),
  F: p => /*#__PURE__*/React.createElement(HeaderF, p),
  G: p => /*#__PURE__*/React.createElement(HeaderG, p),
  H: p => /*#__PURE__*/React.createElement(HeaderH, p),
  I: p => /*#__PURE__*/React.createElement(HeaderI, p),
  J: p => /*#__PURE__*/React.createElement(HeaderJ, p)
};
const HEADER_META = {
  A: {
    title: "A — Classique",
    sub: "Wordmark + nav centrée + deux CTA. Familier, direct."
  },
  B: {
    title: "B — Pillbox flottante",
    sub: "Capsule blanche posée sur le beige. 2025 premium."
  },
  C: {
    title: "C — Split-bar éditoriale",
    sub: "Bandeau contextuel + nav principale."
  },
  D: {
    title: "D — Persona switcher",
    sub: "Toggle Je cherche / Je publie au centre."
  },
  E: {
    title: "E — Scroll-shrink",
    sub: "Full-bleed puis pill compacte."
  },
  F: {
    title: "F — Sidebar verticale",
    sub: "Rail fixe à gauche. Dashboard SaaS."
  },
  G: {
    title: "G — Search-first",
    sub: "Barre de recherche segmentée comme axe central."
  },
  H: {
    title: "H — Brutaliste éditorial",
    sub: "Typo massive, règles épaisses, pas d'ombre."
  },
  I: {
    title: "I — Contextuelle live",
    sub: "État du système (missions live) intégré au header."
  },
  J: {
    title: "J — Mega-hover",
    sub: "Nav minimale + mega-menu avec aperçu visuel."
  }
};

/* ============================================================
   APP — Design canvas
   ============================================================ */
function PreviewFrame({
  children,
  label,
  heightContent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--jim-background)",
      width: "100%",
      height: "100%",
      overflow: "hidden"
    }
  }, children, label && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 28px",
      color: "var(--jim-muted)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      fontFamily: "var(--font-sans)"
    }
  }, label));
}
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Toutes les directions
  const ALL = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const visible = ALL.filter(k => t.visible[k]);

  // État à afficher
  const stateMap = {
    anon: "anon",
    user: "user"
  };
  const curState = stateMap[t.state] || "anon";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DesignCanvas, {
    title: "JIM \xB7 Headers",
    subtitle: `${visible.length} direction${visible.length > 1 ? "s" : ""} visible${visible.length > 1 ? "s" : ""} · ouvre Tweaks (↗) pour comparer, filtrer, choisir l'état`
  }, visible.map(k => {
    const M = HEADER_META[k];
    const H = HEADERS[k];
    const isSidebar = k === "F";
    const isMega = k === "J" && t.megaOpen;
    const wide = 1280;
    const tall = isMega ? 440 : k === "C" ? 180 : k === "F" ? 480 : 140;
    const renderInner = st => /*#__PURE__*/React.createElement(PreviewFrame, null, isSidebar ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        height: "100%"
      }
    }, /*#__PURE__*/React.createElement(H, {
      state: st
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: "18px 24px",
        color: "var(--jim-muted)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".1em",
        textTransform: "uppercase"
      }
    }, "Contenu \xB7\xB7\xB7\xB7\xB7")) : /*#__PURE__*/React.createElement(H, {
      state: st,
      megaOpen: k === "J" && t.megaOpen,
      scrolled: k === "E" && t.scrolled
    }), t.showOnboarding && /*#__PURE__*/React.createElement(OnboardingStrip, null));
    const boards = t.showBoth ? [/*#__PURE__*/React.createElement(DCArtboard, {
      key: "anon",
      id: `${k}-anon`,
      label: `${k} · Anonyme`,
      width: isSidebar ? 420 : wide,
      height: isSidebar ? 480 : tall
    }, renderInner("anon")), /*#__PURE__*/React.createElement(DCArtboard, {
      key: "user",
      id: `${k}-user`,
      label: `${k} · Connecté`,
      width: isSidebar ? 420 : wide,
      height: isSidebar ? 480 : tall
    }, renderInner("user"))] : [/*#__PURE__*/React.createElement(DCArtboard, {
      key: curState,
      id: `${k}-${curState}`,
      label: `${k} · ${curState === "anon" ? "Anonyme" : "Connecté"}`,
      width: isSidebar ? 420 : wide,
      height: isSidebar ? 480 : tall
    }, renderInner(curState))];
    return /*#__PURE__*/React.createElement(DCSection, {
      key: k,
      id: `s-${k}`,
      title: M.title,
      subtitle: M.sub
    }, boards);
  }), visible.length === 0 && /*#__PURE__*/React.createElement(DCSection, {
    id: "empty",
    title: "Aucune direction s\xE9lectionn\xE9e",
    subtitle: "Ouvre le panneau Tweaks pour en afficher."
  }, /*#__PURE__*/React.createElement("div", null))), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Affichage"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Afficher les deux \xE9tats",
    value: t.showBoth,
    onChange: v => setTweak("showBoth", v)
  }), !t.showBoth && /*#__PURE__*/React.createElement(TweakRadio, {
    label: "\xC9tat utilisateur",
    value: t.state,
    options: ["anon", "user"],
    onChange: v => setTweak("state", v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Bandeau onboarding",
    value: t.showOnboarding,
    onChange: v => setTweak("showOnboarding", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "\xC9tats sp\xE9cifiques"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "E \u2014 apr\xE8s scroll",
    value: t.scrolled,
    onChange: v => setTweak("scrolled", v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "J \u2014 mega-menu ouvert",
    value: t.megaOpen,
    onChange: v => setTweak("megaOpen", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Directions visibles"
  }), ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(k => /*#__PURE__*/React.createElement(TweakToggle, {
    key: k,
    label: HEADER_META[k].title,
    value: !!t.visible[k],
    onChange: v => setTweak("visible", {
      ...t.visible,
      [k]: v
    })
  }))));
}

// Defaults pour Tweaks — bloc JSON persisté par le host
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "state": "anon",
  "showBoth": true,
  "showOnboarding": false,
  "scrolled": false,
  "megaOpen": true,
  "visible": {
    "A": true,
    "B": true,
    "C": true,
    "D": true,
    "E": true,
    "F": true,
    "G": true,
    "H": true,
    "I": true,
    "J": true
  }
} /*EDITMODE-END*/;
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/headers.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;height:22px;
    border-radius:6px;cursor:default;padding:0}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((key, val) => {
    setValues(prev => ({
      ...prev,
      [key]: val
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits: {
        [key]: val
      }
    }, '*');
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

})();
