/* ============================================================
   JIM — Headers · 5 directions
   Explorations pour landing + états (anonyme / remplaçant / titulaire / onboarding)
   ============================================================ */

/* ─── Icons ───────────────────────────────────────────────── */
const ico = {
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  msg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  bell: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  chev: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  menu: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  pin: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  qr: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="17"/><line x1="17" y1="14" x2="20" y2="14"/><line x1="17" y1="17" x2="17" y2="20"/><line x1="20" y1="17" x2="20" y2="20"/></svg>,
};

/* Vrai logo JIM — wordmark "jim jobs in med" */
function Wordmark({ size = 32 }) {
  return <img src="../../assets/logo-jim.svg" alt="JIM — Job In Med" style={{height:size,width:"auto",display:"block"}}/>;
}
/* Logo compact — crop sur le "jim" seul (partie haute du SVG) */
function LogoSquare({ size = 36 }) {
  return (
    <div style={{width:size*2.6,height:size,overflow:"hidden",display:"flex",alignItems:"center"}}>
      <img src="../../assets/logo-jim.svg" alt="JIM" style={{height:size*2.4,width:"auto",marginTop:-size*0.15,display:"block",objectFit:"none",objectPosition:"top"}}/>
    </div>
  );
}
function Avatar({ initials = "NB", size = 30 }) {
  return <div style={{width:size,height:size,borderRadius:Math.round(size*.33),background:"linear-gradient(135deg,var(--jim-primary),var(--jim-accent))",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.38,fontWeight:700,letterSpacing:".02em"}}>{initials}</div>;
}

/* ============================================================
   DIRECTION 1 — "Classique Airbnb-like"
   Logo wordmark · nav centrée · deux CTA + avatar · fine
   ============================================================ */
function HeaderA({ state = "anon" }) {
  return (
    <div style={hA.wrap}>
      <div style={hA.left}>
        <Wordmark />
      </div>
      <nav style={hA.nav}>
        <a style={{...hA.link, ...hA.linkActive}}>Missions</a>
        <a style={hA.link}>Remplaçants</a>
        <a style={hA.link}>Comment ça marche</a>
        <a style={hA.link}>App mobile</a>
      </nav>
      <div style={hA.right}>
        {state === "anon" ? (
          <>
            <button style={hA.btnGhost}>Se connecter</button>
            <button style={hA.btnPrimary}>{ico.plus}<span>Publier</span></button>
          </>
        ) : (
          <>
            <button style={hA.btnPrimary}>{ico.plus}<span>Publier</span></button>
            <button style={hA.iconBtn}>{ico.bell}<span style={hA.dot}/></button>
            <Avatar/>
          </>
        )}
      </div>
    </div>
  );
}
const hA = {
  wrap: {display:"flex",alignItems:"center",gap:24,padding:"12px 28px",background:"rgba(253,246,237,.88)",backdropFilter:"blur(20px) saturate(180%)",borderBottom:"1px solid rgba(58,31,8,.06)",fontFamily:"var(--font-sans)"},
  left: {flexShrink:0},
  nav: {display:"flex",alignItems:"center",gap:4,flex:1,justifyContent:"center"},
  link: {padding:"8px 14px",fontSize:13,fontWeight:500,color:"var(--jim-text-body)",borderRadius:10,cursor:"pointer",textDecoration:"none"},
  linkActive: {color:"var(--jim-primary)",fontWeight:700,background:"var(--jim-primary-pale)"},
  right: {display:"flex",alignItems:"center",gap:8,flexShrink:0},
  btnGhost: {background:"transparent",border:0,padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text)",cursor:"pointer",fontFamily:"inherit",borderRadius:10},
  btnPrimary: {display:"inline-flex",alignItems:"center",gap:6,background:"var(--jim-primary)",color:"#fff",border:0,padding:"9px 16px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  iconBtn: {position:"relative",width:36,height:36,borderRadius:12,background:"#fff",border:"1px solid var(--jim-beige-mid)",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--jim-text)"},
  dot: {position:"absolute",top:7,right:7,width:8,height:8,borderRadius:999,background:"var(--jim-primary)",border:"2px solid #fff"},
};

/* ============================================================
   DIRECTION 2 — "Pillbox flottante"
   Capsule arrondie, style Vercel/Linear 2025
   ============================================================ */
function HeaderB({ state = "anon" }) {
  return (
    <div style={hB.outer}>
      <div style={hB.pill}>
        <LogoSquare size={32}/>
        <nav style={hB.nav}>
          <a style={{...hB.link, ...hB.linkActive}}>Missions</a>
          <a style={hB.link}>Remplaçants</a>
          <a style={hB.link}>Comment ça marche</a>
          <a style={hB.link}>App mobile</a>
        </nav>
        <div style={hB.actions}>
          {state === "anon" ? (
            <>
              <button style={hB.ghost}>Connexion</button>
              <button style={hB.cta}>Publier{ico.plus}</button>
            </>
          ) : (
            <>
              <button style={hB.cta}>Publier{ico.plus}</button>
              <Avatar size={28}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
const hB = {
  outer: {padding:"16px 28px",background:"var(--jim-background)",display:"flex",justifyContent:"center",fontFamily:"var(--font-sans)"},
  pill: {display:"flex",alignItems:"center",gap:18,background:"#fff",border:"1px solid var(--jim-beige-mid)",borderRadius:999,padding:"6px 6px 6px 18px",boxShadow:"0 2px 8px rgba(58,31,8,.06),0 12px 32px rgba(58,31,8,.06)"},
  nav: {display:"flex",alignItems:"center",gap:2},
  link: {padding:"8px 14px",fontSize:13,fontWeight:500,color:"var(--jim-text-body)",borderRadius:999,cursor:"pointer",textDecoration:"none"},
  linkActive: {color:"var(--jim-text)",fontWeight:700,background:"var(--jim-surface-alt)"},
  actions: {display:"flex",alignItems:"center",gap:6,marginLeft:8},
  ghost: {background:"transparent",border:0,padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text)",cursor:"pointer",fontFamily:"inherit",borderRadius:999},
  cta: {display:"inline-flex",alignItems:"center",gap:6,background:"var(--jim-text)",color:"#fff",border:0,padding:"9px 16px",borderRadius:999,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
};

/* ============================================================
   DIRECTION 3 — "Split-bar éditoriale"
   Top thin bar (contexte marque) + nav épaisse (produit)
   ============================================================ */
function HeaderC({ state = "anon" }) {
  return (
    <div style={{fontFamily:"var(--font-sans)"}}>
      <div style={hC.topBar}>
        <div style={hC.topInner}>
          <span style={hC.topBadge}><span style={hC.pulse}/>156 missions publiées cette semaine</span>
          <div style={hC.topLinks}>
            <a style={hC.topLink}>Télécharger l'app {ico.qr}</a>
            <span style={hC.topSep}/>
            <a style={hC.topLink}>Aide</a>
          </div>
        </div>
      </div>
      <div style={hC.main}>
        <div style={hC.mainInner}>
          <div style={hC.brandBlock}>
            <Wordmark size={26}/>
            <span style={hC.tagline}>Job In Med</span>
          </div>
          <nav style={hC.nav}>
            <a style={{...hC.link, ...hC.linkActive}}>Missions</a>
            <a style={hC.link}>Remplaçants</a>
            <a style={hC.link}>Comment ça marche</a>
            <a style={hC.link}>App mobile</a>
          </nav>
          <div style={hC.right}>
            {state === "anon" ? (
              <>
                <button style={hC.ghost}>Se connecter</button>
                <button style={hC.cta}>Publier une mission</button>
              </>
            ) : (
              <>
                <button style={hC.cta}>Publier</button>
                <Avatar/>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
const hC = {
  topBar: {background:"var(--jim-text)",color:"#fff"},
  topInner: {maxWidth:1320,margin:"0 auto",padding:"8px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11,fontWeight:600,letterSpacing:".02em"},
  topBadge: {display:"inline-flex",alignItems:"center",gap:8,opacity:.92},
  pulse: {width:7,height:7,borderRadius:999,background:"var(--jim-primary)",boxShadow:"0 0 0 3px rgba(255,124,92,.3)"},
  topLinks: {display:"flex",alignItems:"center",gap:14,opacity:.82},
  topLink: {display:"inline-flex",alignItems:"center",gap:5,color:"#fff",textDecoration:"none",cursor:"pointer"},
  topSep: {width:1,height:12,background:"rgba(255,255,255,.2)"},
  main: {background:"rgba(253,246,237,.95)",backdropFilter:"blur(18px)",borderBottom:"1px solid var(--jim-beige-mid)"},
  mainInner: {maxWidth:1320,margin:"0 auto",padding:"14px 28px",display:"flex",alignItems:"center",gap:24},
  brandBlock: {display:"flex",alignItems:"center",gap:10,paddingRight:24,borderRight:"1px solid var(--jim-beige-mid)"},
  tagline: {fontSize:10,fontWeight:700,color:"var(--jim-muted)",textTransform:"uppercase",letterSpacing:".18em"},
  nav: {display:"flex",alignItems:"center",gap:2,flex:1},
  link: {padding:"10px 14px",fontSize:14,fontWeight:600,color:"var(--jim-text-body)",borderRadius:10,cursor:"pointer",textDecoration:"none"},
  linkActive: {color:"var(--jim-text)",position:"relative"},
  right: {display:"flex",alignItems:"center",gap:10},
  ghost: {background:"transparent",border:"1px solid var(--jim-beige-mid)",padding:"9px 16px",fontSize:13,fontWeight:700,color:"var(--jim-text)",cursor:"pointer",fontFamily:"inherit",borderRadius:12,background:"#fff"},
  cta: {background:"var(--jim-primary)",color:"#fff",border:0,padding:"10px 18px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
};

/* ============================================================
   DIRECTION 4 — "Persona switcher" 
   Toggle Je cherche / Je publie comme axe central
   ============================================================ */
function HeaderD({ state = "anon", persona = "cherche" }) {
  const [p, setP] = React.useState(persona);
  return (
    <div style={hD.wrap}>
      <div style={hD.left}>
        <Wordmark size={24}/>
      </div>
      <div style={hD.switcher}>
        <button onClick={()=>setP("cherche")} style={{...hD.sw, ...(p==="cherche"?hD.swOn:{})}}>Je cherche</button>
        <button onClick={()=>setP("publie")} style={{...hD.sw, ...(p==="publie"?hD.swOn:{})}}>Je publie</button>
      </div>
      <nav style={hD.nav}>
        {p === "cherche" ? (
          <>
            <a style={hD.link}>Missions</a>
            <a style={hD.link}>Par ville</a>
            <a style={hD.link}>Par spécialité</a>
          </>
        ) : (
          <>
            <a style={hD.link}>Remplaçants</a>
            <a style={hD.link}>Mes annonces</a>
            <a style={hD.link}>Tarifs</a>
          </>
        )}
      </nav>
      <div style={hD.right}>
        {state === "anon" ? (
          <>
            <button style={hD.ghost}>Connexion</button>
            <button style={hD.cta}>{p==="publie"?"Publier":"Créer un profil"}</button>
          </>
        ) : (
          <>
            <button style={hD.cta}>{p==="publie"?"Publier":"Postuler"}</button>
            <Avatar/>
          </>
        )}
      </div>
    </div>
  );
}
const hD = {
  wrap: {display:"flex",alignItems:"center",gap:20,padding:"12px 28px",background:"#fff",borderBottom:"1px solid var(--jim-beige-mid)",fontFamily:"var(--font-sans)"},
  left: {flexShrink:0,paddingRight:8},
  switcher: {display:"inline-flex",background:"var(--jim-surface-alt)",borderRadius:999,padding:3,flexShrink:0},
  sw: {border:0,background:"transparent",padding:"7px 16px",fontSize:12,fontWeight:700,color:"var(--jim-muted)",cursor:"pointer",borderRadius:999,fontFamily:"inherit",letterSpacing:"-.005em"},
  swOn: {background:"#fff",color:"var(--jim-text)",boxShadow:"0 1px 3px rgba(58,31,8,.1)"},
  nav: {display:"flex",alignItems:"center",gap:2,flex:1,justifyContent:"center"},
  link: {padding:"8px 14px",fontSize:13,fontWeight:500,color:"var(--jim-text-body)",borderRadius:10,cursor:"pointer",textDecoration:"none"},
  right: {display:"flex",alignItems:"center",gap:8,flexShrink:0},
  ghost: {background:"transparent",border:0,padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text)",cursor:"pointer",fontFamily:"inherit"},
  cta: {background:"var(--jim-primary)",color:"#fff",border:0,padding:"9px 18px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
};

/* ============================================================
   DIRECTION 5 — "Minimal monolithique" (scroll-shrink)
   Full-bleed en top de page, se rétracte en pill au scroll
   ============================================================ */
function HeaderE({ scrolled = false, state = "anon" }) {
  return (
    <div style={{...hE.wrap, ...(scrolled?hE.wrapScrolled:{})}}>
      <div style={{...hE.inner, ...(scrolled?hE.innerScrolled:{})}}>
        <div style={hE.brand}>
          {scrolled ? <LogoSquare size={30}/> : <Wordmark size={30}/>}
        </div>
        <nav style={{...hE.nav, ...(scrolled?{gap:2}:{})}}>
          <a style={{...hE.link, ...hE.linkActive}}>Missions</a>
          <a style={hE.link}>Remplaçants</a>
          {!scrolled && <a style={hE.link}>Comment ça marche</a>}
          {!scrolled && <a style={hE.link}>App mobile</a>}
        </nav>
        <div style={hE.right}>
          {state === "anon" ? (
            <>
              {!scrolled && <button style={hE.ghost}>Se connecter</button>}
              <button style={hE.cta}>{ico.plus}<span>Publier</span></button>
            </>
          ) : (
            <>
              <button style={hE.cta}>{ico.plus}<span>Publier</span></button>
              <Avatar size={scrolled?28:32}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
const hE = {
  wrap: {padding:"18px 28px",background:"transparent",fontFamily:"var(--font-sans)",transition:"all .3s"},
  wrapScrolled: {padding:"10px 28px",background:"rgba(253,246,237,.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(58,31,8,.08)"},
  inner: {display:"flex",alignItems:"center",gap:32,maxWidth:1320,margin:"0 auto",transition:"all .3s"},
  innerScrolled: {gap:18,background:"#fff",border:"1px solid var(--jim-beige-mid)",borderRadius:999,padding:"6px 8px 6px 20px",boxShadow:"0 2px 12px rgba(58,31,8,.08)",maxWidth:960},
  brand: {flexShrink:0},
  nav: {display:"flex",alignItems:"center",gap:6,flex:1,justifyContent:"center"},
  link: {padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text-body)",borderRadius:999,cursor:"pointer",textDecoration:"none"},
  linkActive: {color:"var(--jim-primary)"},
  right: {display:"flex",alignItems:"center",gap:8,flexShrink:0},
  ghost: {background:"transparent",border:0,padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text)",cursor:"pointer",fontFamily:"inherit"},
  cta: {display:"inline-flex",alignItems:"center",gap:6,background:"var(--jim-primary)",color:"#fff",border:0,padding:"9px 16px",borderRadius:999,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
};

/* ============================================================
   État "Onboarding" — bannière de progression sous header
   ============================================================ */
function OnboardingStrip() {
  return (
    <div style={ob.wrap}>
      <div style={ob.inner}>
        <div style={ob.left}>
          <div style={ob.ring}>
            <svg viewBox="0 0 36 36" width="36" height="36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--jim-beige-mid)" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--jim-primary)" strokeWidth="3" strokeDasharray="94.2" strokeDashoffset="37.7" transform="rotate(-90 18 18)" strokeLinecap="round"/>
            </svg>
            <span style={ob.ringTxt}>60%</span>
          </div>
          <div>
            <p style={ob.t}>Complète ton profil</p>
            <p style={ob.s}>2 étapes restantes · RPPS + disponibilités</p>
          </div>
        </div>
        <div style={ob.right}>
          <button style={ob.skip}>Plus tard</button>
          <button style={ob.cta}>Continuer</button>
        </div>
      </div>
    </div>
  );
}
const ob = {
  wrap: {background:"linear-gradient(90deg,var(--jim-primary-pale),var(--jim-surface-alt))",borderBottom:"1px solid var(--jim-beige-mid)"},
  inner: {maxWidth:1320,margin:"0 auto",padding:"10px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,fontFamily:"var(--font-sans)"},
  left: {display:"flex",alignItems:"center",gap:14},
  ring: {position:"relative",width:36,height:36,display:"inline-flex",alignItems:"center",justifyContent:"center"},
  ringTxt: {position:"absolute",fontSize:10,fontWeight:800,color:"var(--jim-primary)"},
  t: {margin:0,fontSize:13,fontWeight:700,color:"var(--jim-text)",letterSpacing:"-.01em"},
  s: {margin:"2px 0 0",fontSize:11,color:"var(--jim-muted)",fontWeight:500},
  right: {display:"flex",alignItems:"center",gap:8},
  skip: {background:"transparent",border:0,padding:"7px 12px",fontSize:12,fontWeight:600,color:"var(--jim-muted)",cursor:"pointer",fontFamily:"inherit"},
  cta: {background:"var(--jim-primary)",color:"#fff",border:0,padding:"8px 14px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
};

/* ============================================================
   DIRECTION 6 — "Sidebar verticale" (F)
   Rail fixe à gauche, compact. Style dashboard SaaS / Notion.
   Header devient navigation latérale persistente.
   ============================================================ */
function HeaderF({ state = "anon" }) {
  return (
    <div style={hF.rail}>
      <div style={hF.top}>
        <div style={hF.logoSq}><img src="../../assets/logo-jim.svg" alt="JIM" style={{height:22,width:"auto"}}/></div>
        <div style={hF.divider}/>
        <button style={{...hF.tab, ...hF.tabOn}} title="Missions">{ico.search}</button>
        <button style={hF.tab} title="Messagerie">{ico.msg}<span style={hF.badge}>3</span></button>
        <button style={hF.tab} title="Annonces">{ico.pin}</button>
        <button style={hF.tab} title="Notifications">{ico.bell}</button>
      </div>
      <div style={hF.bot}>
        <button style={hF.cta}>{ico.plus}</button>
        {state === "anon" ? (
          <button style={hF.avatarGhost}>?</button>
        ) : (
          <Avatar size={34}/>
        )}
      </div>
    </div>
  );
}
const hF = {
  rail: {width:64,minHeight:560,background:"#fff",borderRight:"1px solid var(--jim-beige-mid)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"14px 0",fontFamily:"var(--font-sans)",boxShadow:"var(--jim-shadow-sm)"},
  top: {display:"flex",flexDirection:"column",alignItems:"center",gap:6,width:"100%"},
  bot: {display:"flex",flexDirection:"column",alignItems:"center",gap:10,width:"100%"},
  logoSq: {width:38,height:38,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6},
  divider: {width:28,height:1,background:"var(--jim-beige-mid)",margin:"4px 0"},
  tab: {position:"relative",width:40,height:40,borderRadius:12,border:0,background:"transparent",color:"var(--jim-muted)",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"},
  tabOn: {background:"var(--jim-primary-pale)",color:"var(--jim-primary)"},
  badge: {position:"absolute",top:4,right:4,minWidth:16,height:16,padding:"0 4px",borderRadius:999,background:"var(--jim-primary)",color:"#fff",fontSize:9,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center"},
  cta: {width:44,height:44,borderRadius:14,background:"var(--jim-primary)",color:"#fff",border:0,display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 14px rgba(255,124,92,.35)"},
  avatarGhost: {width:34,height:34,borderRadius:12,border:"1px dashed var(--jim-beige-mid)",background:"transparent",color:"var(--jim-muted)",fontWeight:700,cursor:"pointer"},
};

/* ============================================================
   DIRECTION 7 — "Search-first" (G)
   Inspirée Stripe / Airbnb — la barre de recherche EST le header.
   Logo + champ de recherche dominant + avatar.
   ============================================================ */
function HeaderG({ state = "anon" }) {
  return (
    <div style={hG.wrap}>
      <div style={hG.left}><Wordmark size={28}/></div>
      <div style={hG.searchWrap}>
        <div style={hG.searchPill}>
          <div style={hG.segLeft}>
            <span style={hG.segLbl}>Où</span>
            <span style={hG.segVal}>Paris 11ᵉ</span>
          </div>
          <div style={hG.segSep}/>
          <div style={hG.seg}>
            <span style={hG.segLbl}>Quand</span>
            <span style={hG.segVal}>5 – 19 mai</span>
          </div>
          <div style={hG.segSep}/>
          <div style={hG.seg}>
            <span style={hG.segLbl}>Spécialité</span>
            <span style={hG.segValMuted}>Toutes</span>
          </div>
          <button style={hG.searchBtn}>{ico.search}</button>
        </div>
      </div>
      <div style={hG.right}>
        {state === "anon" ? (
          <>
            <button style={hG.linkBtn}>Publier une mission</button>
            <button style={hG.menuBtn}>{ico.menu}<Avatar size={24} initials="?"/></button>
          </>
        ) : (
          <>
            <button style={hG.linkBtn}>Publier</button>
            <button style={hG.menuBtn}>{ico.menu}<Avatar size={24}/></button>
          </>
        )}
      </div>
    </div>
  );
}
const hG = {
  wrap: {display:"grid",gridTemplateColumns:"auto 1fr auto",alignItems:"center",gap:20,padding:"14px 28px",background:"#fff",borderBottom:"1px solid var(--jim-beige-mid)",fontFamily:"var(--font-sans)"},
  left: {flexShrink:0},
  searchWrap: {display:"flex",justifyContent:"center"},
  searchPill: {display:"inline-flex",alignItems:"center",background:"#fff",border:"1px solid var(--jim-beige-mid)",borderRadius:999,padding:"4px 4px 4px 8px",boxShadow:"var(--jim-shadow-sm)",maxWidth:640,width:"100%"},
  segLeft: {padding:"6px 18px",display:"flex",flexDirection:"column",flex:1},
  seg: {padding:"6px 18px",display:"flex",flexDirection:"column",flex:1},
  segSep: {width:1,height:26,background:"var(--jim-beige-mid)"},
  segLbl: {fontSize:10,fontWeight:800,color:"var(--jim-text)",letterSpacing:".02em"},
  segVal: {fontSize:12,color:"var(--jim-text-body)",fontWeight:500,marginTop:2},
  segValMuted: {fontSize:12,color:"var(--jim-muted)",fontWeight:500,marginTop:2},
  searchBtn: {width:38,height:38,borderRadius:999,background:"var(--jim-primary)",color:"#fff",border:0,display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginLeft:6},
  right: {display:"flex",alignItems:"center",gap:8,flexShrink:0},
  linkBtn: {background:"transparent",border:0,padding:"10px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text)",borderRadius:999,cursor:"pointer",fontFamily:"inherit"},
  menuBtn: {display:"inline-flex",alignItems:"center",gap:8,padding:"4px 4px 4px 10px",border:"1px solid var(--jim-beige-mid)",borderRadius:999,background:"#fff",cursor:"pointer",color:"var(--jim-text)"},
};

/* ============================================================
   DIRECTION 8 — "Brutaliste éditorial" (H)
   Typo massive, séparateurs épais, pas d'ombre.
   Inspiré presse médicale / Le Monde digital.
   ============================================================ */
function HeaderH({ state = "anon" }) {
  return (
    <div style={hH.wrap}>
      <div style={hH.ruleTop}/>
      <div style={hH.row}>
        <div style={hH.brand}>
          <Wordmark size={36}/>
          <span style={hH.kicker}>№ 2026 · éd. Printemps</span>
        </div>
        <nav style={hH.nav}>
          <a style={{...hH.link, ...hH.linkActive}}>Missions</a>
          <a style={hH.link}>Remplaçants</a>
          <a style={hH.link}>Tribunes</a>
          <a style={hH.link}>Méthode</a>
        </nav>
        <div style={hH.right}>
          {state === "anon" ? (
            <>
              <button style={hH.linkBtn}>Entrer</button>
              <button style={hH.cta}>Publier →</button>
            </>
          ) : (
            <>
              <button style={hH.cta}>Publier →</button>
              <Avatar size={32}/>
            </>
          )}
        </div>
      </div>
      <div style={hH.ruleBot}/>
    </div>
  );
}
const hH = {
  wrap: {background:"var(--jim-background)",fontFamily:"var(--font-sans)"},
  ruleTop: {height:3,background:"var(--jim-text)"},
  ruleBot: {height:1,background:"var(--jim-text)"},
  row: {display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,padding:"14px 28px",maxWidth:1320,margin:"0 auto"},
  brand: {display:"flex",alignItems:"baseline",gap:14},
  kicker: {fontFamily:"var(--font-serif-italic)",fontStyle:"italic",fontSize:13,color:"var(--jim-muted)",fontWeight:400},
  nav: {display:"flex",alignItems:"center",gap:4},
  link: {padding:"10px 16px",fontSize:13,fontWeight:700,color:"var(--jim-text)",textDecoration:"none",cursor:"pointer",textTransform:"uppercase",letterSpacing:".08em"},
  linkActive: {borderBottom:"2px solid var(--jim-primary)",color:"var(--jim-primary)"},
  right: {display:"flex",alignItems:"center",gap:10},
  linkBtn: {background:"transparent",border:0,padding:"10px 14px",fontSize:13,fontWeight:700,color:"var(--jim-text)",cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",letterSpacing:".08em"},
  cta: {background:"var(--jim-text)",color:"var(--jim-background)",border:0,padding:"11px 18px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",letterSpacing:".06em",borderRadius:0},
};

/* ============================================================
   DIRECTION 9 — "Contextuelle live" (I)
   Header qui expose l'état live du système (preuve sociale intégrée).
   Compteur de missions en direct, localisation détectée.
   ============================================================ */
function HeaderI({ state = "anon" }) {
  return (
    <div style={hI.wrap}>
      <div style={hI.left}>
        <Wordmark size={26}/>
        <div style={hI.liveGroup}>
          <span style={hI.pulse}/>
          <span style={hI.liveTxt}><b>156</b> missions · <b>42</b> à Paris 11ᵉ</span>
        </div>
      </div>
      <nav style={hI.nav}>
        <a style={{...hI.link, ...hI.linkActive}}>Missions</a>
        <a style={hI.link}>Remplaçants</a>
        <a style={hI.link}>Ma carte</a>
      </nav>
      <div style={hI.right}>
        <button style={hI.locPill}>{ico.pin}<span>Paris 11ᵉ · 5 km</span>{ico.chev}</button>
        {state === "anon" ? (
          <button style={hI.cta}>Rejoindre</button>
        ) : (
          <>
            <button style={hI.iconBtn}>{ico.bell}<span style={hI.dot}/></button>
            <Avatar size={30}/>
          </>
        )}
      </div>
    </div>
  );
}
const hI = {
  wrap: {display:"flex",alignItems:"center",gap:20,padding:"12px 28px",background:"#fff",borderBottom:"1px solid var(--jim-beige-mid)",fontFamily:"var(--font-sans)"},
  left: {display:"flex",alignItems:"center",gap:18,flex:1},
  liveGroup: {display:"inline-flex",alignItems:"center",gap:8,padding:"5px 12px",borderRadius:999,background:"var(--jim-success-bg)",color:"#2d5e36",fontSize:11,fontWeight:600},
  pulse: {width:7,height:7,borderRadius:999,background:"var(--jim-success)",boxShadow:"0 0 0 3px rgba(93,143,102,.3)"},
  liveTxt: {letterSpacing:".01em"},
  nav: {display:"flex",alignItems:"center",gap:2},
  link: {padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text-body)",borderRadius:10,cursor:"pointer",textDecoration:"none"},
  linkActive: {color:"var(--jim-primary)",background:"var(--jim-primary-pale)"},
  right: {display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end"},
  locPill: {display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:999,border:"1px solid var(--jim-beige-mid)",background:"var(--jim-surface-alt)",color:"var(--jim-text-body)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"},
  cta: {background:"var(--jim-primary)",color:"#fff",border:0,padding:"9px 18px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  iconBtn: {position:"relative",width:36,height:36,borderRadius:12,background:"var(--jim-surface-alt)",border:"1px solid var(--jim-beige-mid)",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--jim-text)"},
  dot: {position:"absolute",top:7,right:7,width:8,height:8,borderRadius:999,background:"var(--jim-primary)",border:"2px solid #fff"},
};

/* ============================================================
   DIRECTION 10 — "Mega-hover" (J)
   Nav minimale avec un mega-menu ouvert au hover (aperçu visible).
   Inspiré Apple / Framer.
   ============================================================ */
function HeaderJ({ state = "anon", megaOpen = false }) {
  return (
    <div style={hJ.container}>
      <div style={hJ.wrap}>
        <div style={hJ.left}><Wordmark size={26}/></div>
        <nav style={hJ.nav}>
          <a style={{...hJ.link, ...(megaOpen?hJ.linkActive:{})}}>Missions {ico.chev}</a>
          <a style={hJ.link}>Remplaçants {ico.chev}</a>
          <a style={hJ.link}>Entreprise</a>
          <a style={hJ.link}>Tarifs</a>
        </nav>
        <div style={hJ.right}>
          {state === "anon" ? (
            <>
              <button style={hJ.ghost}>Connexion</button>
              <button style={hJ.cta}>Commencer</button>
            </>
          ) : (
            <>
              <button style={hJ.cta}>Publier</button>
              <Avatar size={30}/>
            </>
          )}
        </div>
      </div>
      {megaOpen && (
        <div style={hJ.mega}>
          <div style={hJ.megaInner}>
            <div style={hJ.col}>
              <p style={hJ.colTitle}>Explorer</p>
              <a style={hJ.megaLink}><b>Toutes les missions</b><span>+156 cette semaine</span></a>
              <a style={hJ.megaLink}><b>Urgentes</b><span>Départ {"<"} 48h</span></a>
              <a style={hJ.megaLink}><b>Par ville</b><span>Paris, Lyon, Marseille…</span></a>
              <a style={hJ.megaLink}><b>Par spécialité</b><span>Neuro, pédia, sport…</span></a>
            </div>
            <div style={hJ.col}>
              <p style={hJ.colTitle}>Outils</p>
              <a style={hJ.megaLink}><b>Calculateur de rétrocession</b><span>Estime tes revenus nets</span></a>
              <a style={hJ.megaLink}><b>Contrat type</b><span>PDF conforme ordre MK</span></a>
              <a style={hJ.megaLink}><b>Guide du remplaçant</b><span>Tout pour commencer</span></a>
            </div>
            <div style={hJ.colCard}>
              <div style={hJ.cardImg}>
                <div style={hJ.cardImgInner}>
                  <span style={hJ.cardBadge}>URGENT</span>
                  <span style={hJ.cardPrice}>92 %</span>
                </div>
              </div>
              <p style={hJ.cardTitle}>3 missions urgentes près de toi</p>
              <p style={hJ.cardSub}>Départ demain · rétrocession 90 %+</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const hJ = {
  container: {position:"relative",background:"rgba(253,246,237,.88)",backdropFilter:"blur(18px)",borderBottom:"1px solid var(--jim-beige-mid)",fontFamily:"var(--font-sans)"},
  wrap: {display:"flex",alignItems:"center",gap:24,padding:"14px 28px",maxWidth:1320,margin:"0 auto"},
  left: {flexShrink:0},
  nav: {display:"flex",alignItems:"center",gap:4,flex:1,justifyContent:"center"},
  link: {display:"inline-flex",alignItems:"center",gap:4,padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text-body)",borderRadius:10,cursor:"pointer",textDecoration:"none"},
  linkActive: {color:"var(--jim-primary)",background:"var(--jim-primary-pale)"},
  right: {display:"flex",alignItems:"center",gap:8,flexShrink:0},
  ghost: {background:"transparent",border:0,padding:"8px 14px",fontSize:13,fontWeight:600,color:"var(--jim-text)",cursor:"pointer",fontFamily:"inherit"},
  cta: {background:"var(--jim-primary)",color:"#fff",border:0,padding:"9px 18px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  mega: {background:"#fff",borderTop:"1px solid var(--jim-beige-mid)",boxShadow:"var(--jim-shadow-lg)"},
  megaInner: {maxWidth:1320,margin:"0 auto",padding:"28px",display:"grid",gridTemplateColumns:"1fr 1fr 1.2fr",gap:36},
  col: {display:"flex",flexDirection:"column",gap:10},
  colTitle: {margin:"0 0 6px",fontSize:10,fontWeight:800,color:"var(--jim-muted)",textTransform:"uppercase",letterSpacing:".18em"},
  megaLink: {display:"flex",flexDirection:"column",gap:2,padding:"8px 10px",borderRadius:10,cursor:"pointer",textDecoration:"none"},
  colCard: {background:"var(--jim-surface-alt)",borderRadius:16,padding:14,display:"flex",flexDirection:"column",gap:10},
  cardImg: {height:120,borderRadius:12,background:"linear-gradient(135deg,var(--jim-primary-pale),var(--jim-beige-light))",position:"relative",overflow:"hidden"},
  cardImgInner: {position:"absolute",inset:0,display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:10},
  cardBadge: {background:"var(--jim-primary)",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 7px",borderRadius:6,letterSpacing:".06em"},
  cardPrice: {background:"#fff",color:"var(--jim-text)",fontSize:11,fontWeight:800,padding:"3px 7px",borderRadius:6},
  cardTitle: {margin:0,fontSize:13,fontWeight:700,color:"var(--jim-text)"},
  cardSub: {margin:0,fontSize:11,color:"var(--jim-muted)",fontWeight:500},
};

/* Helper — choisit la bonne direction */
const HEADERS = {
  A: (p) => <HeaderA {...p}/>,
  B: (p) => <HeaderB {...p}/>,
  C: (p) => <HeaderC {...p}/>,
  D: (p) => <HeaderD {...p}/>,
  E: (p) => <HeaderE {...p}/>,
  F: (p) => <HeaderF {...p}/>,
  G: (p) => <HeaderG {...p}/>,
  H: (p) => <HeaderH {...p}/>,
  I: (p) => <HeaderI {...p}/>,
  J: (p) => <HeaderJ {...p}/>,
};
const HEADER_META = {
  A: {title:"A — Classique", sub:"Wordmark + nav centrée + deux CTA. Familier, direct."},
  B: {title:"B — Pillbox flottante", sub:"Capsule blanche posée sur le beige. 2025 premium."},
  C: {title:"C — Split-bar éditoriale", sub:"Bandeau contextuel + nav principale."},
  D: {title:"D — Persona switcher", sub:"Toggle Je cherche / Je publie au centre."},
  E: {title:"E — Scroll-shrink", sub:"Full-bleed puis pill compacte."},
  F: {title:"F — Sidebar verticale", sub:"Rail fixe à gauche. Dashboard SaaS."},
  G: {title:"G — Search-first", sub:"Barre de recherche segmentée comme axe central."},
  H: {title:"H — Brutaliste éditorial", sub:"Typo massive, règles épaisses, pas d'ombre."},
  I: {title:"I — Contextuelle live", sub:"État du système (missions live) intégré au header."},
  J: {title:"J — Mega-hover", sub:"Nav minimale + mega-menu avec aperçu visuel."},
};

/* ============================================================
   APP — Design canvas
   ============================================================ */
function PreviewFrame({ children, label, heightContent }) {
  return (
    <div style={{background:"var(--jim-background)",width:"100%",height:"100%",overflow:"hidden"}}>
      {children}
      {label && <div style={{padding:"18px 28px",color:"var(--jim-muted)",fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",fontFamily:"var(--font-sans)"}}>{label}</div>}
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Toutes les directions
  const ALL = ["A","B","C","D","E","F","G","H","I","J"];
  const visible = ALL.filter(k => t.visible[k]);

  // État à afficher
  const stateMap = {anon:"anon", user:"user"};
  const curState = stateMap[t.state] || "anon";

  return (
    <>
      <DesignCanvas
        title="JIM · Headers"
        subtitle={`${visible.length} direction${visible.length>1?"s":""} visible${visible.length>1?"s":""} · ouvre Tweaks (↗) pour comparer, filtrer, choisir l'état`}
      >
        {visible.map(k => {
          const M = HEADER_META[k];
          const H = HEADERS[k];
          const isSidebar = k === "F";
          const isMega = k === "J" && t.megaOpen;
          const wide = 1280;
          const tall = isMega ? 440 : (k==="C" ? 180 : (k==="F" ? 480 : 140));
          const renderInner = (st) => (
            <PreviewFrame>
              {isSidebar ? (
                <div style={{display:"flex",height:"100%"}}>
                  <H state={st}/>
                  <div style={{flex:1,padding:"18px 24px",color:"var(--jim-muted)",fontSize:11,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase"}}>Contenu ·····</div>
                </div>
              ) : (
                <H state={st} megaOpen={k==="J" && t.megaOpen} scrolled={k==="E" && t.scrolled}/>
              )}
              {t.showOnboarding && <OnboardingStrip/>}
            </PreviewFrame>
          );
          const boards = t.showBoth
            ? [
                <DCArtboard key="anon" id={`${k}-anon`} label={`${k} · Anonyme`} width={isSidebar?420:wide} height={isSidebar?480:tall}>
                  {renderInner("anon")}
                </DCArtboard>,
                <DCArtboard key="user" id={`${k}-user`} label={`${k} · Connecté`} width={isSidebar?420:wide} height={isSidebar?480:tall}>
                  {renderInner("user")}
                </DCArtboard>,
              ]
            : [
                <DCArtboard key={curState} id={`${k}-${curState}`} label={`${k} · ${curState==="anon"?"Anonyme":"Connecté"}`} width={isSidebar?420:wide} height={isSidebar?480:tall}>
                  {renderInner(curState)}
                </DCArtboard>,
              ];
          return (
            <DCSection key={k} id={`s-${k}`} title={M.title} subtitle={M.sub}>
              {boards}
            </DCSection>
          );
        })}

        {visible.length === 0 && (
          <DCSection id="empty" title="Aucune direction sélectionnée" subtitle="Ouvre le panneau Tweaks pour en afficher.">
            <div/>
          </DCSection>
        )}
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Affichage" />
        <TweakToggle label="Afficher les deux états" value={t.showBoth}
                     onChange={(v)=>setTweak("showBoth", v)} />
        {!t.showBoth && (
          <TweakRadio label="État utilisateur" value={t.state}
                      options={["anon","user"]}
                      onChange={(v)=>setTweak("state", v)} />
        )}
        <TweakToggle label="Bandeau onboarding" value={t.showOnboarding}
                     onChange={(v)=>setTweak("showOnboarding", v)} />

        <TweakSection label="États spécifiques" />
        <TweakToggle label="E — après scroll" value={t.scrolled}
                     onChange={(v)=>setTweak("scrolled", v)} />
        <TweakToggle label="J — mega-menu ouvert" value={t.megaOpen}
                     onChange={(v)=>setTweak("megaOpen", v)} />

        <TweakSection label="Directions visibles" />
        {["A","B","C","D","E","F","G","H","I","J"].map(k => (
          <TweakToggle key={k}
            label={HEADER_META[k].title}
            value={!!t.visible[k]}
            onChange={(v)=>setTweak("visible", {...t.visible, [k]: v})} />
        ))}
      </TweaksPanel>
    </>
  );
}

// Defaults pour Tweaks — bloc JSON persisté par le host
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "state": "anon",
  "showBoth": true,
  "showOnboarding": false,
  "scrolled": false,
  "megaOpen": true,
  "visible": {
    "A": true, "B": true, "C": true, "D": true, "E": true,
    "F": true, "G": true, "H": true, "I": true, "J": true
  }
}/*EDITMODE-END*/;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
