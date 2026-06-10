// Mission Detail — single self-contained React tree
// Onglets : Contrat (signature IA + envoi Ordre) · Transmissions (cabinet + patients) · Chat (IA)
// Expose un seul composant : window.MissionDetail({ tab, sigState, sendToOrdre })

(function () {

  // ─────────────────────────────────────────────────────────────
  // CONTENT — toutes les données de démo en un seul endroit
  // ─────────────────────────────────────────────────────────────
  const CONVOS = [
    { id:"nb", on:true,  av:"NB", g:"g3", scene:"sky",   name:"Nicolas Bernard", time:"18:42", step:"Signature",  meta:"Étape 3/6" },
    { id:"al", on:false, av:"AL", g:"g5", scene:"lilac", name:"Amélie Leclerc",   time:"17:05", step:"Négo.",      stepColor:{bg:"#fdf3df",fg:"var(--jim-warning)"}, meta:"Étape 2/6" },
    { id:"cb", on:false, av:"CB", g:"g6", scene:"warm",  name:"Cabinet Brun",     time:"12:14", step:"Mission",    stepColor:{bg:"#eaf3eb",fg:"var(--jim-success)"}, meta:"Étape 4/6 · j+2" },
    { id:"cd", on:false, av:"CD", g:"g4", scene:"green", name:"Claire Dupuis",    time:"hier",  step:"Paiement",   stepColor:{bg:"rgba(176,136,217,.15)",fg:"#7c59b3"}, meta:"libération 27/05" },
  ];

  const PATIENTS = [
    { id:"bertrand", av:"MB", g:"g4", name:"M. Bertrand", age:"67 a.", path:"Cervicalgie chronique", tag:"Post-op C5-C6", freq:"3", on:true,  alerts:["AINS"], note:true },
    { id:"lefevre",  av:"NL", g:"g5", name:"Mme Lefèvre", age:"54 a.", path:"Coiffe des rotateurs",  tag:"Post-op J+22", freq:"2", on:false, alerts:[], note:false },
    { id:"hammami",  av:"YH", g:"g2", name:"M. Hammami",  age:"32 a.", path:"LCA opéré",             tag:"J+45",         freq:"3", on:false, alerts:[], note:true },
    { id:"tanguy",   av:"GT", g:"g6", name:"Mme Tanguy",  age:"78 a.", path:"Parkinson stade 2",     tag:"Autonomie",    freq:"2", on:false, alerts:["Chute 02/24"], note:false },
    { id:"leo",      av:"LD", g:"g1", name:"Léo D.",      age:"14 a.", path:"Scoliose idiopathique", tag:"Suivi annuel", freq:"1", on:false, alerts:[], note:false },
  ];

  // ─────────────────────────────────────────────────────────────
  // SHARED — top bar + sidebar + header + timeline
  // ─────────────────────────────────────────────────────────────
  function TopBar() {
    const navRef = React.useRef(null);
    const [meOpen, setMeOpen] = React.useState(false);

    React.useEffect(() => {
      if (!meOpen) return;
      const close = () => setMeOpen(false);
      const onKey = (e) => { if (e.key === 'Escape') setMeOpen(false); };
      document.addEventListener('click', close);
      document.addEventListener('keydown', onKey);
      return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', onKey); };
    }, [meOpen]);

    React.useEffect(() => {
      const nav = navRef.current;
      if (!nav) return;
      const pill = nav.querySelector('.nav-pill');
      const items = [...nav.querySelectorAll('a')];
      const moveTo = (el) => {
        if (!el || !pill) return;
        pill.style.width = el.offsetWidth + 'px';
        pill.style.transform = 'translateX(' + el.offsetLeft + 'px)';
        pill.classList.add('ready');
      };
      const reset = () => moveTo(nav.querySelector('a.active'));
      const enter = items.map(a => {
        const fn = () => moveTo(a);
        a.addEventListener('mouseenter', fn);
        a.addEventListener('focus', fn);
        return fn;
      });
      nav.addEventListener('mouseleave', reset);
      const raf = requestAnimationFrame(reset);
      window.addEventListener('resize', reset);
      // mount the shared search-bar behaviour onto our (late-rendered) shell
      if (window.initJimSearch) window.initJimSearch();
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', reset);
        nav.removeEventListener('mouseleave', reset);
        items.forEach((a, i) => {
          a.removeEventListener('mouseenter', enter[i]);
          a.removeEventListener('focus', enter[i]);
        });
      };
    }, []);

    return (
      <div className="md-topnav">
        <header className="header">
          <a href="index.html" className="brand" aria-label="JIM — Job. In. Med.">
            <img src="../../assets/jim-wordmark.svg" alt="JIM" />
          </a>
          <nav className="nav" ref={navRef}>
            <span className="nav-pill" aria-hidden="true"></span>
            <a href="index.html" className="active">Missions</a>
          </nav>
          <div className="header-right">
            <a href="#" className="publish-cta" aria-label="Publier une annonce">
              <span className="pc-circle" aria-hidden="true"></span>
              <span className="pc-ico" aria-hidden="true"><i data-lucide="plus" width="18" height="18" strokeWidth="2.6"></i></span>
              <span className="pc-lbl">Publier une annonce</span>
            </a>
            <div className="search-shell">
              <div className="search-bar">
                <button type="button" className="sb-field" data-pop="loc" aria-label="Où">
                  <span className="sb-l">Où</span>
                  <input type="text" placeholder="Ville, code postal" readOnly />
                </button>
                <span className="sb-divider" aria-hidden="true"></span>
                <button type="button" className="sb-field" data-pop="dates" aria-label="Quand">
                  <span className="sb-l">Quand</span>
                  <input type="text" placeholder="Ajouter dates" readOnly />
                </button>
                <button type="button" className="sb-cta" aria-label="Rechercher">
                  <span className="circle" aria-hidden="true"></span>
                  <span className="ico" aria-hidden="true"><i data-lucide="search" width="16" height="16"></i></span>
                  <span className="lbl">Rechercher</span>
                </button>
              </div>
            </div>
            <div className="me-wrap" onClick={(e) => e.stopPropagation()}>
              <div
                className={"nav-me" + (meOpen ? " open" : "")}
                role="button" tabIndex={0} aria-haspopup="true" aria-expanded={meOpen} aria-label="Mon compte"
                onClick={() => setMeOpen(o => !o)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMeOpen(o => !o); } }}
              >NB</div>
              <div className={"me-menu" + (meOpen ? " open" : "")} role="menu" aria-label="Mon compte">
                <div className="me-head">
                  <div className="me-av">NB</div>
                  <div className="me-head-txt">
                    <p className="me-name">Nicolas B.</p>
                    <p className="me-role">Kiné · Paris 11e</p>
                  </div>
                </div>
                <a href="index.html" className="me-item" role="menuitem">
                  <span className="me-ico"><i data-lucide="briefcase" width="17" height="17" strokeWidth="1.9"></i></span>
                  <span className="me-tt"><span className="me-t">Missions</span><span className="me-s">Mes remplacements en cours</span></span>
                  <i className="me-chev" data-lucide="chevron-right" width="16" height="16" strokeWidth="2"></i>
                </a>
                <a href="paiements.html" className="me-item" role="menuitem">
                  <span className="me-ico"><i data-lucide="euro" width="17" height="17" strokeWidth="1.9"></i></span>
                  <span className="me-tt"><span className="me-t">Paiements</span><span className="me-s">Rétrocessions & factures</span></span>
                  <i className="me-chev" data-lucide="chevron-right" width="16" height="16" strokeWidth="2"></i>
                </a>
                <a href="messagerie.html" className="me-item" role="menuitem">
                  <span className="me-ico"><i data-lucide="message-circle" width="17" height="17" strokeWidth="1.9"></i></span>
                  <span className="me-tt"><span className="me-t">Messages</span><span className="me-s">Conversations & contrats</span></span>
                  <span className="me-badge">3</span>
                </a>
                <a href="#" className="me-item" role="menuitem">
                  <span className="me-ico"><i data-lucide="settings" width="17" height="17" strokeWidth="1.9"></i></span>
                  <span className="me-tt"><span className="me-t">Paramètres</span><span className="me-s">Compte & préférences</span></span>
                  <i className="me-chev" data-lucide="chevron-right" width="16" height="16" strokeWidth="2"></i>
                </a>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }

  function ConvoList() {
    const TileAv = (c) => (
      <span className="tile" data-scene={c.scene}>
        <span className="photo"></span>
        <span className={"av " + c.g}>{c.av}</span>
      </span>
    );
    return (
      <aside className="md-list">
        <div className="eyebrow"><span style={{background:"transparent",color:"var(--jim-muted)",padding:0}}>En cours</span><span>3</span></div>
        {CONVOS.slice(0,3).map(c => (
          <div key={c.id} className={"convo" + (c.on ? " on" : "")}>
            {TileAv(c)}
            <div className="col">
              <div className="top"><span className="n">{c.name}</span><span className="t">{c.time}</span></div>
              <div className="pr">
                <span className="stp" style={c.stepColor ? {background:c.stepColor.bg, color:c.stepColor.fg} : undefined}>{c.step}</span>
                <span>{c.meta}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="eyebrow" style={{paddingTop:14}}><span style={{background:"transparent",color:"var(--jim-muted)",padding:0}}>À clôturer</span><span>1</span></div>
        {CONVOS.slice(3).map(c => (
          <div key={c.id} className="convo">
            {TileAv(c)}
            <div className="col">
              <div className="top"><span className="n">{c.name}</span><span className="t">{c.time}</span></div>
              <div className="pr">
                <span className="stp" style={c.stepColor ? {background:c.stepColor.bg, color:c.stepColor.fg} : undefined}>{c.step}</span>
                <span>{c.meta}</span>
              </div>
            </div>
          </div>
        ))}
      </aside>
    );
  }

  function MissionHeader({ sigState }) {
    const statusMap = {
      "to-sign":   { lbl:"Contrat à signer",        bg:"#fbf0dc",                color:"var(--jim-warning)" },
      "signed":    { lbl:"Signé · envoi à l'Ordre", bg:"var(--jim-primary-pale)", color:"var(--jim-primary)" },
      "confirmed": { lbl:"Inscrit à l'Ordre",       bg:"#eaf3eb",                color:"var(--jim-success)" },
    };
    const st = statusMap[sigState] || statusMap["to-sign"];
    return (
      <div className="md-mhead">
        <div className="left">
          <div className="crumb">
            <span>Mission</span>
            <i data-lucide="chevron-right"></i>
            <b>Remplacement #M-2026-0247</b>
          </div>
          <h2>Remplacement <em>Ortho</em> · 14 jours</h2>
          <div className="sub">
            <span>Cabinet Moreau-Salva</span>
            <span className="sep">·</span>
            <span>avec <b>Nicolas Bernard</b></span>
            <span className="sep">·</span>
            <span>12 → 26 mai</span>
            <span className="sep">·</span>
            <span>68 % rétro.</span>
          </div>
        </div>
        <div className="status" style={{background:st.bg, color:st.color}}>
          <span className="pulse" style={{background:st.color}}></span>
          {st.lbl}
        </div>
      </div>
    );
  }

  function TimelineStrip({ sigState }) {
    // Progress bar width depending on signature state
    const pbWidth = sigState === "confirmed" ? "55%" : sigState === "signed" ? "50%" : "38%";
    const sigClass = sigState === "to-sign" ? "now" : "done";
    return (
      <div className="md-stripwrap">
        <div className="md-strip">
          <div className="pb" style={{width: pbWidth}}></div>
          <div className="step done"><div className="node"><i data-lucide="user-plus"></i></div><div className="lbl">Candidature</div><div className="when">14 avr.</div></div>
          <div className="step done"><div className="node"><i data-lucide="scale"></i></div><div className="lbl">Négociation</div><div className="when">15–16 avr.</div></div>
          <div className={"step " + sigClass}><div className="node"><i data-lucide="file-signature"></i></div><div className="lbl">Signature</div><div className="when">{sigState === "to-sign" ? "en cours" : "17 avr."}</div></div>
          <div className="step"><div className="node"><i data-lucide="stethoscope"></i></div><div className="lbl">Mission</div><div className="when">12 → 26 mai</div></div>
          <div className="step"><div className="node"><i data-lucide="banknote"></i></div><div className="lbl">Paiement</div><div className="when">27 mai</div></div>
          <div className="step"><div className="node"><i data-lucide="star"></i></div><div className="lbl">Avis</div><div className="when">post-mission</div></div>
        </div>
      </div>
    );
  }

  function TabBar({ tab, onChange }) {
    const T = (id, ic, lbl, ext) => (
      <button className={"md-tab" + (tab === id ? " on" : "")} onClick={() => onChange(id)}>
        <i data-lucide={ic}></i>
        {lbl}
        {ext}
      </button>
    );
    return (
      <div className="md-tabs">
        {T("contrat",       "file-signature", "Contrat",        <span className="ai"><i data-lucide="sparkles"></i>IA</span>)}
        {T("transmissions", "clipboard-list", "Transmissions",  <span className="pill">5 patients</span>)}
        {T("chat",          "messages-square","Chat",           <span className="pill">2 non lus</span>)}
        <div className="spacer"></div>
        <div className="right-meta">
          <i data-lucide="lock"></i>
          <span>Données chiffrées · HDS</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // TAB A — CONTRAT
  // ─────────────────────────────────────────────────────────────
  function TabContrat({ sigState, sendToOrdre }) {
    // Map state to flow stepper
    const stepStates = (() => {
      switch (sigState) {
        case "confirmed": return ["done","done","done","done"];
        case "signed":    return ["done","done","now","none"];
        case "to-sign":
        default:          return ["done","now","none","none"];
      }
    })();
    const cls = i => stepStates[i] === "done" ? "step done" : stepStates[i] === "now" ? "step now" : "step";
    const nodeIcon = i => stepStates[i] === "done" ? "check" : (i===0?"sparkles":i===1?"pen-tool":i===2?"send":"shield-check");

    return (
      <div className="md-co">
        {/* ─── Document preview ─── */}
        <div className="md-co-doc">
          <div className="head">
            <div className="ic"><i data-lucide="file-signature"></i></div>
            <div className="meta">
              <h3>Contrat de remplacement libéral · MK</h3>
              <div className="sub">
                <i data-lucide="shield-check"></i>
                <span>eIDAS QES · DocuSign</span>
                <span style={{opacity:.4}}>·</span>
                <span>v.2 · 17 avr. 09:14</span>
              </div>
            </div>
            <div className="pager">
              <button><i data-lucide="chevron-left"></i></button>
              <span>2 / 4</span>
              <button><i data-lucide="chevron-right"></i></button>
              <button style={{marginLeft:6}}><i data-lucide="maximize-2"></i></button>
            </div>
          </div>

          <div className="paper">
            <div className="ptitle">Contrat-type de remplacement</div>
            <div className="psub">Modèle CNOMK · v. 05/2021 · conforme art. R.4321-129 CSP</div>

            <div className="preamble">
              <span className="lbl">Entre :</span>
              <p style={{margin:0}}>Madame <b>Sandra MOREAU</b>, masseur-kinésithérapeute, inscrite au Conseil départemental de l'Ordre de Paris sous le n° <span className="hl ok" title="RPPS vérifié auprès de l'annuaire santé · 0 conflit">10003415028</span>, exerçant au cabinet sis 14 rue des Lilas, 75011 Paris — ci-après <i>« la titulaire »</i>.</p>
              <span className="lbl" style={{marginTop:4}}>Et :</span>
              <p style={{margin:0}}>Monsieur <b>Nicolas BERNARD</b>, masseur-kinésithérapeute, inscrit à l'Ordre sous le n° <span className="hl ok" title="RPPS vérifié · diplômé 2019">10004128871</span>, demeurant 22 rue Oberkampf, 75011 Paris — ci-après <i>« le remplaçant »</i>.</p>
            </div>

            <h4><span className="num">Art. 4 —</span>Date d'effet &amp; durée</h4>
            <p>Le remplaçant exercera au cabinet susmentionné du <span className="hl">12 mai 2026 à 8 h 00</span> au <span className="hl">26 mai 2026 à 19 h 30</span> inclus, soit <span className="hl">14 jours calendaires</span>, en remplacement total de la titulaire absente pour congés.</p>

            <h4><span className="num">Art. 12 —</span>Honoraires &amp; rétrocession</h4>
            <p>Le remplaçant verse à la titulaire une rétrocession égale à <span className="hl warn" title="Légèrement au-dessus de la médiane parisienne (30 %) — acceptable pour un remplacement court">32 % des honoraires bruts</span> qu'il a personnellement encaissés au titre du présent contrat. Le versement intervient via le séquestre JIM, à l'expiration du remplacement. Le remplaçant conserve l'intégralité des indemnités de déplacement.</p>

            <h4><span className="num">Art. 19 —</span>Non-concurrence post-contractuelle</h4>
            <p>Le remplaçant s'interdit, pendant <span className="hl">24 mois</span> à compter de la fin du remplacement, d'exercer sa profession dans un rayon de <span className="hl">2 km à vol d'oiseau</span> du cabinet. Clause pénale : <span className="hl">50 000 €</span> (art. 1231-5 CCV).</p>

            <h4><span className="num">Art. 24 —</span>Communication à l'Ordre</h4>
            <p>Conformément aux art. L.4113-9 et R.4321-134 CSP, le présent contrat sera communiqué au CDOMK 75 <span className="hl ok" title="Envoi automatique JIM le jour de la signature">dans le mois suivant sa signature</span> par voie dématérialisée.</p>

            <div className="sig-area">
              <div className="sig-box">
                <div className="lab">Titulaire</div>
                <div className="nm">S. Moreau</div>
                <div className="ss">Signé le 17/04 · 09:14</div>
                <div className="stamp">Sandra Moreau</div>
              </div>
              {sigState === "to-sign" ? (
                <div className="sig-box empty">
                  <div className="lab">Remplaçant</div>
                  <div className="nm">N. Bernard</div>
                  <div className="ss">En attente · à signer ↓</div>
                  <div className="stamp">— signature —</div>
                </div>
              ) : (
                <div className="sig-box">
                  <div className="lab">Remplaçant</div>
                  <div className="nm">N. Bernard</div>
                  <div className="ss">Signé le 17/04 · 16:42</div>
                  <div className="stamp">Nicolas Bernard</div>
                </div>
              )}
            </div>
          </div>

          <div className="actbar">
            <div className="left">
              <i data-lucide="shield-check"></i>
              <span>Vérifié JIM · 0 alerte bloquante</span>
            </div>
            <div className="spacer"></div>
            <button className="sec"><i data-lucide="message-circle"></i>Demander une modif</button>
            <button className="sec"><i data-lucide="download"></i>PDF</button>
            {sigState === "to-sign"
              ? <button className="prim"><i data-lucide="pen-tool"></i>Signer eIDAS</button>
              : <button className="prim" style={{background:"var(--jim-success)",boxShadow:"0 4px 14px -4px rgba(93,143,102,.45)"}}><i data-lucide="check"></i>Contrat signé</button>}
          </div>
        </div>

        {/* ─── Right side — AI audit + flow ─── */}
        <div className="md-co-side">
          {/* AI verdict */}
          <div className="md-co-ai">
            <div className="top">
              <div className="ic"><i data-lucide="sparkles"></i></div>
              <div className="meta">
                <div className="lab">Relecture JIM AI</div>
                <h4>Contrat <em>conforme</em>. Tu peux signer.</h4>
              </div>
            </div>
            <p>4 articles, 0 clause abusive, taux de rétrocession en ligne avec ta zone (médiane 32 %). Vérifié contre le modèle de l'Ordre des MK et tes 2 derniers remplacements.</p>
            <div className="verdict">
              <div className="b ok"><i data-lucide="check-circle-2"></i>RPPS · 2/2</div>
              <div className="b ok"><i data-lucide="check-circle-2"></i>Clauses</div>
              <div className="b warn"><i data-lucide="alert-circle"></i>1 point d'attention</div>
            </div>
          </div>

          {/* Key terms */}
          <div className="md-co-block">
            <h5><i data-lucide="key-round"></i>Termes clés extraits<span className="count">12</span></h5>
            <div className="md-co-key">
              <div className="row"><span className="k"><i data-lucide="calendar"></i>Période</span><span className="v">12 → 26 mai <em>14 j</em></span></div>
              <div className="row"><span className="k"><i data-lucide="percent"></i>Rétrocession</span><span className="v">32 <em>% bruts</em></span></div>
              <div className="row"><span className="k"><i data-lucide="banknote"></i>Estimation nette</span><span className="v">≈ 1 516 €</span></div>
              <div className="row"><span className="k"><i data-lucide="map-pin"></i>Non-concurrence</span><span className="v">2 km · 24 mois</span></div>
              <div className="row"><span className="k"><i data-lucide="shield"></i>Assurance RCP</span><span className="v">à fournir J-3</span></div>
            </div>
          </div>

          {/* Flags */}
          <div className="md-co-block">
            <h5><i data-lucide="alert-triangle"></i>À vérifier</h5>
            <div className="md-co-flag">
              <div className="f warn">
                <i data-lucide="alert-circle"></i>
                <div><b>Clause non-concurrence un peu large</b><div className="meta">2 km × 24 mois → la médiane parisienne est 1 km × 12 mois. Négociable si tu prévois t'installer dans le 11<sup>e</sup>.</div></div>
              </div>
              <div className="f info">
                <i data-lucide="info"></i>
                <div><b>RCP à transmettre J-3</b><div className="meta">Mémo automatique le 9 mai. Tu peux l'uploader maintenant.</div></div>
              </div>
              <div className="f ok">
                <i data-lucide="check-circle-2"></i>
                <div><b>Rétrocession dans la norme</b><div className="meta">Tes 2 derniers contrats : 30 % et 33 %. Médiane Paris ortho : 32 %.</div></div>
              </div>
            </div>
          </div>

          {/* Signature flow */}
          <div className="md-co-flow">
            <h5><i data-lucide="git-commit-horizontal"></i>Parcours signature</h5>

            <div className={cls(0)}>
              <div className="node"><i data-lucide={nodeIcon(0)}></i></div>
              <div className="col"><div className="t">Relecture par l'IA</div><div className="s">12 termes extraits · 1 alerte</div></div>
              <div className="when">11:02</div>
            </div>

            <div className={cls(1)}>
              <div className="node"><i data-lucide={nodeIcon(1)}></i></div>
              <div className="col"><div className="t">Signature eIDAS QES</div><div className="s">{sigState === "to-sign" ? "À toi de jouer · code SMS" : "Signé électroniquement"}</div></div>
              <div className="when">{sigState === "to-sign" ? "À FAIRE" : "16:42"}</div>
            </div>

            <div className={cls(2)}>
              <div className="node"><i data-lucide={nodeIcon(2)}></i></div>
              <div className="col"><div className="t">Envoi automatique à l'Ordre</div><div className="s">{sigState === "signed" ? "Transmission en cours…" : sigState === "confirmed" ? "Reçu le 18/04 — 11h08" : "Sera transmis dès signature"}</div></div>
              <div className="when">{sigState === "to-sign" ? "AUTO" : sigState === "signed" ? "EN COURS" : "11:08"}</div>
            </div>

            <div className={cls(3)}>
              <div className="node"><i data-lucide={nodeIcon(3)}></i></div>
              <div className="col"><div className="t">Inscription Ordre confirmée</div><div className="s">{sigState === "confirmed" ? "Conseil départemental 75 — OK" : "En attente de l'accusé"}</div></div>
              <div className="when">{sigState === "confirmed" ? "11:08" : "48 H"}</div>
            </div>
          </div>

          {/* Ordre toggle */}
          <div className="md-co-ordre">
            <div className="ic"><i data-lucide="landmark"></i></div>
            <div className="meta">
              <div className="t">Envoi auto à l'Ordre des MK</div>
              <div className="s">Conseil départemental 75 · délai légal J+8</div>
            </div>
            <div className="toggle" style={{background: sendToOrdre ? "var(--jim-primary)" : "var(--jim-beige-mid)"}}>
              <span style={{position:"absolute",left: sendToOrdre ? "auto" : "2px", right: sendToOrdre ? "2px" : "auto", top:2, width:14, height:14, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(58,31,8,.2)"}}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // TAB B — TRANSMISSIONS
  // ─────────────────────────────────────────────────────────────
  const TEAM = [
    { id:"sandra", scene:"sky",  av:"SM", g:"g1", first:"Sandra",  last:"Moreau",  role:"Titulaire principale", presence:"on",  presenceLbl:"Joignable WhatsApp" },
    { id:"paul",   scene:"warm", av:"PS", g:"g2", first:"Paul",    last:"Salva",   role:"Titulaire associé",    presence:"off", presenceLbl:"En congés période" },
    { id:"sophie", scene:"desk", av:"SL", g:"g5", first:"Sophie",  last:"Lemaire", role:"Assistante (ARM)",     presence:"on",  presenceLbl:"Mar-Jeu · 9 → 13 h" },
  ];

  function TabTransmissions() {
    const selectedPatient = PATIENTS.find(p => p.on) || PATIENTS[0];
    const [openMember, setOpenMember] = React.useState("sandra");
    const [query, setQuery] = React.useState("");
    const patSearchRef = React.useRef(null);
    const wigglePatSearch = () => {
      const el = patSearchRef.current;
      if (!el) return;
      el.classList.remove("searching");
      void el.offsetWidth;
      el.classList.add("searching");
    };
    const q = query.trim().toLowerCase();
    const patientRows = PATIENTS.slice(1).filter(
      p => !q || p.name.toLowerCase().includes(q) || p.path.toLowerCase().includes(q)
    );

    return (
      <div className="md-tr">
        {/* ── CABINET HERO (top, full-width) ── */}
        <div className="md-tr-cabhero">
          {/* Map preview */}
          <div className="map">
            <div className="lpill"><i data-lucide="map-pin"></i>14 rue des Lilas</div>
          </div>

          {/* Identity + stats */}
          <div className="info">
            <div className="nm">Cabinet <em>Moreau-Salva</em></div>
            <div className="addr">14 rue des Lilas, <b>75011 Paris</b><br/>M° Voltaire · 3 min à pied</div>
            <div className="ms">
              <div className="m"><div className="v">3</div><div className="k">Boxes</div></div>
              <div className="m"><div className="v">~140<em>/sem</em></div><div className="k">Séances</div></div>
              <div className="m"><div className="v">8 → 19 h</div><div className="k">Horaires</div></div>
            </div>
          </div>

          {/* Team deck */}
          <div className="right">
            <div className="lbl"><i data-lucide="users"></i>Équipe sur place · clique pour révéler</div>
            <div className="md-team-deck" role="tablist">
              {TEAM.map(p => (
                <button
                  key={p.id}
                  className={"md-team-tile" + (openMember === p.id ? " on" : "")}
                  data-scene={p.scene}
                  aria-pressed={openMember === p.id}
                  onClick={() => setOpenMember(openMember === p.id ? null : p.id)}
                >
                  <span className="photo"></span>
                  <span className={"av " + p.g}>{p.av}</span>
                  <span className="nm">
                    <span className="n1">{p.first} {p.last}</span>
                    <span className="n2"><span className={"dot" + (p.presence === "off" ? " off" : "")}></span>{p.presenceLbl}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM LEFT — Patients ── */}
        <div className="md-tr-pat">
          <div className="ch">
            <div className="ch-lead">
              <div className="ic" style={{width:30,height:30,borderRadius:9,background:"var(--jim-primary-pale)",color:"var(--jim-primary)",display:"flex",alignItems:"center",justifyContent:"center"}}><i data-lucide="stethoscope"></i></div>
              <h4>Patients récurrents <span className="sub">· 23 sur la période</span></h4>
              <button style={{fontSize:10,color:"var(--jim-primary)",fontWeight:800,letterSpacing:".04em",textTransform:"uppercase",padding:"5px 10px",borderRadius:7,background:"var(--jim-primary-pale)"}}>Voir tout</button>
            </div>
            <label className="pat-search" ref={patSearchRef}>
              <i data-lucide="search" width="15" height="15"></i>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") wigglePatSearch(); }}
                placeholder="Rechercher un patient"
                aria-label="Rechercher un patient"
              />
              {query && (
                <button type="button" className="clear" aria-label="Effacer la recherche" onClick={() => setQuery("")}>
                  <i data-lucide="x" width="14" height="14"></i>
                </button>
              )}
            </label>
          </div>

          {/* Selected patient detail */}
          <div className="md-tr-pdet">
            <div className="head">
              <div className={"av " + selectedPatient.g}>{selectedPatient.av}</div>
              <div>
                <div className="nm">M. <em>Bertrand</em> · 67 ans</div>
                <div className="sub">Cervicalgie chronique · post-arthrodèse C5-C6</div>
              </div>
              <div className="next">
                <span>Prochaine séance</span>
                <b>Mar. 13 mai · 9 h 30</b>
              </div>
            </div>
            <div className="notes">
              <b>Routine actuelle.</b> Mobilisations cervicales passives uniquement, pas d'auto-grandissement actif sur les 4 premières min. Pressions glissées trapèze sup + diagonale Kabat MS. Travail respiratoire en fin de séance.
            </div>
            <div className="ai-note">
              <i data-lucide="sparkles"></i>
              <div>
                <b>Note JIM AI · à savoir</b>
                Antécédent vasovagal en juin 2024 — ne jamais le mettre en décubitus dorsal en début de séance. Sandra alterne pressions glissées profondes et exercices de mobilité scapulaire.
              </div>
            </div>
          </div>

          {/* Filter pills */}
          <div className="filter">
            <button className="on">Tous · 5</button>
            <button>Post-op · 2</button>
            <button>Vigilance · 1</button>
            <button>Pédiatrie · 1</button>
          </div>

          <div className="list">
            <table className="md-tr-tbl">
              <thead>
                <tr>
                  <th>Nom Prénom</th>
                  <th>Motifs</th>
                  <th className="r">Rééducation</th>
                </tr>
              </thead>
              <tbody>
                {patientRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="md-tr-empty">Aucun patient ne correspond à « {query} »</td>
                  </tr>
                ) : patientRows.map(p => (
                  <tr key={p.id} className="md-tr-trow">
                    <td className="c-name">
                      <span className={"av " + p.g}>{p.av}</span>
                      <span className="nm">{p.name} <span className="age">· {p.age}</span></span>
                    </td>
                    <td className="c-motif">
                      <span className="path">{p.path}</span>
                      <span className="tag">{p.tag}</span>
                    </td>
                    <td className="c-reed">
                      <span className="n">{p.freq}<em>×/sem</em></span>
                      <span className="l">{p.note ? "Note IA" : p.alerts.length > 0 ? "Vigilance" : "Routine"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── BOTTOM RIGHT — Codes + Équipement + Planning ── */}
        <div className="md-tr-col">

          {/* Codes inline grid */}
          <div className="md-tr-card">
            <div className="ch">
              <div className="ic"><i data-lucide="key-round"></i></div>
              <h4>Accès &amp; codes</h4>
            </div>
            <div className="md-tr-codes">
              <div className="r"><div className="k"><i data-lucide="wifi"></i>WiFi</div><div className="v code">azerty12!</div></div>
              <div className="r"><div className="k"><i data-lucide="door-open"></i>Digicode</div><div className="v code">A4729B</div></div>
              <div className="r"><div className="k"><i data-lucide="car"></i>Parking</div><div className="v code">2847</div></div>
              <div className="r"><div className="k"><i data-lucide="monitor"></i>Logiciel</div><div className="v">Vega Kiné</div></div>
            </div>
          </div>

          {/* Equipment list */}
          <div className="md-tr-card">
            <div className="ch">
              <div className="ic"><i data-lucide="dumbbell"></i></div>
              <h4>Équipement</h4>
              <div className="right">3 / 4 OK</div>
            </div>
            <div className="md-tr-eq">
              <div className="e"><div className="ic"><i data-lucide="zap"></i></div><div><div className="lbl">Ondes de choc Storz</div><div className="sub">Programmes pré-réglés</div></div><div className="ck"><i data-lucide="check-circle-2"></i>OK</div></div>
              <div className="e"><div className="ic"><i data-lucide="snowflake"></i></div><div><div className="lbl">Pressothérapie Game Ready</div><div className="sub">Box 2 · cryo + compression</div></div><div className="ck"><i data-lucide="check-circle-2"></i>OK</div></div>
              <div className="e"><div className="ic"><i data-lucide="circle-dot"></i></div><div><div className="lbl">Plateforme Huber 360</div><div className="sub">Box 3 · formation requise</div></div><div className="ck miss"><i data-lucide="alert-circle"></i>FORMATION</div></div>
            </div>
          </div>

          {/* Voice note + week summary in compact card */}
          <div className="md-tr-note">
            <div className="ic"><i data-lucide="mic"></i></div>
            <div className="meta">
              <div className="lab">Note vocale · Sandra · 2 min</div>
              <p>Déroulé d'une journée type. <b>Semaine 1 :</b> 14 / 16 / 18 / 12 / férié · 60 séances sur 4 jours.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // TAB C — CHAT
  // ─────────────────────────────────────────────────────────────
  function TabChat() {
    return (
      <div className="md-ch">
        <div className="md-ch-thread">

          {/* AI TLDR banner */}
          <div className="md-ch-tldr">
            <div className="ic"><i data-lucide="sparkles"></i></div>
            <div className="meta">
              <div className="lab">JIM AI · résumé du fil</div>
              <p>Sandra confirme le créneau <em>jeudi 14 h en visio</em> pour la signature. Elle te transmet le mot de passe Vega et la clé de secours est chez Sophie (ARM). Reste à confirmer ton <em>assurance RCP</em>.</p>
            </div>
            <button><i data-lucide="play"></i>Écouter</button>
          </div>

          <div className="md-ch-msgs">
            <div className="md-ch-day">Hier · jeudi 16 avril</div>

            <div className="md-ch-msg">
              <div className="av g1">SM</div>
              <div className="body">
                <div className="who"><b>Dr Sandra Moreau</b><span>· 18:42</span></div>
                <div className="b">Parfait Nicolas, le contrat est prêt côté JIM. Tu peux le relire et signer quand tu veux — l'IA me dit que tout est en ordre. <span className="term">Petit point</span> : ton attestation RCP doit nous parvenir 3 jours avant le 12.</div>
              </div>
            </div>

            <div className="md-ch-msg me">
              <div className="av g3">NB</div>
              <div className="body">
                <div className="who"><span>· 19:08</span><b>Vous</b></div>
                <div className="b">Bien reçu. Pour la signature, je propose 3 créneaux en visio JIM 👇</div>
              </div>
            </div>

            <div className="md-ch-hint"><i data-lucide="sparkles"></i>3 créneaux extraits — visibles dans <b>Contrat</b></div>

            <div className="md-ch-day">Aujourd'hui</div>

            <div className="md-ch-msg">
              <div className="av g1">SM</div>
              <div className="body">
                <div className="who"><b>Dr Sandra Moreau</b><span>· 08:14</span></div>
                <div className="b">Jeudi 14 h ça marche très bien. Je t'envoie le lien Whereby JIM. Pour les <span className="term">codes du cabinet</span>, tout est dans l'onglet Transmissions, et j'ai noté un point de vigilance sur M. Bertrand (vasovagal).</div>
              </div>
            </div>

            <div className="md-ch-msg">
              <div className="av g1">SM</div>
              <div className="body">
                <div className="b">À ton tour quand tu veux 🌞</div>
              </div>
            </div>

            <div className="md-ch-hint"><i data-lucide="check-circle-2"></i>JIM AI a mis à jour la fiche Transmissions de M. Bertrand</div>
          </div>

          {/* AI suggestions */}
          <div className="md-ch-sugs">
            <div className="lab"><i data-lucide="sparkles"></i>Suggestions de réponse</div>
            <div className="row">
              <button className="sg"><i data-lucide="reply"></i>Confirmer le créneau de jeudi 14 h</button>
              <button className="sg"><i data-lucide="paperclip"></i>Joindre mon attestation RCP maintenant</button>
              <button className="sg"><i data-lucide="message-circle-question"></i>Demander des précisions sur Mme Tanguy</button>
            </div>
          </div>

          <div className="md-ch-comp">
            <div className="md-ch-comp-bar">
              <input placeholder="Écris à Sandra · ↑ pour reformuler avec l'IA"/>
              <button className="ic ai" title="Reformuler avec l'IA"><i data-lucide="sparkles"></i></button>
              <button className="ic"><i data-lucide="paperclip"></i></button>
              <button className="send"><i data-lucide="arrow-up"></i></button>
            </div>
          </div>
        </div>

        {/* Right AI rail */}
        <aside className="md-ch-rail">
          <div className="md-ch-rail-h">
            <div className="ic"><i data-lucide="sparkles"></i></div>
            <h4>Co-pilot <em>JIM</em></h4>
            <div className="stat"><span className="dot"></span>Live</div>
          </div>

          <div className="md-ch-block">
            <h5><i data-lucide="list-checks"></i>Ce qui te reste à faire</h5>
            <div className="md-ch-act">
              <div className="ax">
                <div className="ic"><i data-lucide="upload"></i></div>
                <div><div className="t">Téléverser l'attestation RCP<span className="s">Échéance · 9 mai</span></div></div>
                <i data-lucide="chevron-right"></i>
              </div>
              <div className="ax">
                <div className="ic"><i data-lucide="pen-tool"></i></div>
                <div><div className="t">Signer le contrat eIDAS<span className="s">En attente — onglet Contrat</span></div></div>
                <i data-lucide="chevron-right"></i>
              </div>
              <div className="ax">
                <div className="ic"><i data-lucide="video"></i></div>
                <div><div className="t">Visio signature jeu. 14 h<span className="s">Whereby JIM · lien envoyé</span></div></div>
                <i data-lucide="chevron-right"></i>
              </div>
            </div>
          </div>

          <div className="md-ch-block">
            <h5><i data-lucide="filter"></i>Infos extraites du fil</h5>
            <div className="md-ch-extr">
              <div className="row"><span className="k">Créneau retenu</span><span className="v">Jeu 14 h</span></div>
              <div className="row"><span className="k">Outil visio</span><span className="v">Whereby JIM</span></div>
              <div className="row"><span className="k">RCP attendue</span><span className="v">9 mai</span></div>
              <div className="row"><span className="k">Logiciel cabinet</span><span className="v">Vega Kiné</span></div>
              <div className="row"><span className="k">Point vigilance</span><span className="v" style={{color:"var(--jim-warning)"}}>M. Bertrand</span></div>
            </div>
          </div>

          <div className="md-ch-block" style={{background:"linear-gradient(135deg,rgba(176,136,217,.10),rgba(255,124,92,.06))",border:"1px dashed rgba(124,89,179,.25)"}}>
            <h5><i data-lucide="bookmark"></i>Souvenir clé</h5>
            <p style={{fontSize:11.5,lineHeight:1.5,color:"var(--jim-text-body)",margin:0,fontWeight:500}}>Sandra préfère les <b>messages courts</b> et te tutoie. Ton ton dans ce fil : direct, chaleureux, ton OK.</p>
          </div>
        </aside>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ROOT
  // ─────────────────────────────────────────────────────────────
  function MissionDetail({ tab = "contrat", sigState = "to-sign", sendToOrdre = true, onTabChange }) {
    return (
      <div className="alt-frame" data-screen-label="Détail mission">
        <TopBar />
        <div className="md-shell">
          <ConvoList />
          <section className="md-main">
            <MissionHeader sigState={sigState} />
            <TimelineStrip sigState={sigState} />
            <TabBar tab={tab} onChange={onTabChange || (()=>{})} />
            <div className="md-body">
              {tab === "contrat" && <TabContrat sigState={sigState} sendToOrdre={sendToOrdre} />}
              {tab === "transmissions" && <TabTransmissions />}
              {tab === "chat" && <TabChat />}
            </div>
          </section>
        </div>
      </div>
    );
  }

  window.MissionDetail = MissionDetail;

  // Expose building blocks so the dashboard can reuse the rich detail views
  window.JimMission = {
    TopBar, TimelineStrip, MissionHeader,
    TabContrat, TabTransmissions, TabChat,
    CONVOS, PATIENTS, TEAM
  };
})();
