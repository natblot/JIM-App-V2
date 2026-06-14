// Mission Detail — DASHBOARD layout
// Tout visible d'un coup d'œil · le détail riche s'ouvre au clic (overlay)
// Réutilise les vues détaillées exposées par mission-detail.jsx (window.JimMission)
// Expose : window.MissionDashboard({ sigState, sendToOrdre, density, heroStyle, openPanel, onOpen })

(function () {
  const J = window.JimMission || {};

  // ── status pill (drives header + hero étape) ──────────────
  const STATUS = {
    "to-sign":   { lbl:"Contrat à signer",        bg:"#fbf0dc",                 fg:"var(--jim-warning)", step:"À signer",           seg:2 },
    "signed":    { lbl:"Signé · envoi à l'Ordre", bg:"var(--jim-primary-pale)", fg:"var(--jim-primary)", step:"Envoi à l'Ordre",    seg:3 },
    "confirmed": { lbl:"Inscrit à l'Ordre",       bg:"var(--jim-success-bg)",   fg:"var(--jim-success)", step:"Inscrit à l'Ordre", seg:3 },
  };

  // ─────────────────────────────────────────────────────────
  // HERO STAT CARDS
  // ─────────────────────────────────────────────────────────
  function HeroStats({ sigState }) {
    const st = STATUS[sigState] || STATUS["to-sign"];
    const seg = (n, kind) => <span key={n} className={kind} />;
    return (
      <div className="dash-stats">

        <div className="stat" data-tone="peach">
          <div className="lbl">Durée de mission<span className="ico"><i data-lucide="calendar-days"></i></span></div>
          <div className="big">14<em> jours</em></div>
          <div className="sub">12 → 26 mai · J-13</div>
          <div className="viz">
            <div className="viz-ticks">
              {Array.from({length:14}).map((_,i)=>(
                <span key={i} className={i<2 ? "f" : i<4 ? "h" : ""} />
              ))}
            </div>
          </div>
        </div>

        <div className="stat" data-tone="sage">
          <div className="lbl">Net estimé<span className="ico"><i data-lucide="banknote"></i></span></div>
          <div className="big"><span className="cur">≈</span>1 516<em> €</em></div>
          <div className="sub">après 32 % de rétrocession</div>
          <div className="viz">
            <svg className="viz-spark" viewBox="0 0 120 30" preserveAspectRatio="none" aria-hidden="true">
              <polyline points="0,24 22,20 44,22 66,13 88,15 120,4" fill="none" stroke="var(--jim-success)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="120" cy="4" r="3.2" fill="var(--jim-success)"/>
            </svg>
          </div>
        </div>

        <div className="stat" data-tone="lilac">
          <div className="lbl">Patients suivis<span className="ico"><i data-lucide="users"></i></span></div>
          <div className="big">23<em> récurrents</em></div>
          <div className="sub">5 prioritaires sur la période</div>
          <div className="viz">
            <div className="viz-dots">
              <span className="av g4">MB</span>
              <span className="av g5">NL</span>
              <span className="av g2">YH</span>
              <span className="av g6">GT</span>
              <span className="av g1">LD</span>
              <span className="more">+18</span>
            </div>
          </div>
        </div>

        <div className="stat" data-tone="honey">
          <div className="lbl">Étape du dossier<span className="ico"><i data-lucide="git-commit-horizontal"></i></span></div>
          <div className="big">3<em> / 6</em></div>
          <div className="sub">{st.step}</div>
          <div className="viz">
            <div className="viz-seg">
              {[0,1,2,3,4,5].map(i=>{
                const cls = i < (st.seg-1) ? "f" : (i === (st.seg-1) ? (sigState==="to-sign"?"now":"f") : "");
                return seg(i, cls);
              })}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // PARCOURS band (reuse the timeline strip)
  // ─────────────────────────────────────────────────────────
  function ParcoursBand({ sigState }) {
    const T = J.TimelineStrip;
    return (
      <div className="dash-band">
        <div className="band-h">
          <i data-lucide="route"></i>
          Parcours de la mission
          <span className="right">Signature → mission dans <b style={{color:"var(--jim-primary)"}}>13 jours</b></span>
        </div>
        {T ? <T sigState={sigState} /> : null}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // GRID CARDS
  // ─────────────────────────────────────────────────────────
  function ContratCard({ sigState, open }) {
    const toSign = sigState === "to-sign";
    return (
      <div className="card card-contrat big" onClick={open} role="button" tabIndex={0}>
        <div className="c-h">
          <div className="ic"><i data-lucide="file-signature"></i></div>
          <h3>Contrat de remplacement <span className="n">· MK · v.2</span></h3>
          <span className="tag ai"><i data-lucide="sparkles"></i>Relu par l'IA</span>
        </div>

        <div className="verdict">
          <div className="vic"><i data-lucide="sparkles"></i></div>
          <div>
            <div className="lab">Verdict JIM AI</div>
            <h4>Contrat <em>conforme</em>. Tu peux signer.</h4>
            <p>4 articles · 0 clause abusive · rétrocession en ligne avec ta zone (médiane 32 %).</p>
          </div>
        </div>

        <div className="keys">
          <div className="k"><div className="kl"><i data-lucide="calendar"></i>Période</div><div className="kv">12 → 26 mai <em>· 14 j</em></div></div>
          <div className="k"><div className="kl"><i data-lucide="percent"></i>Rétrocession</div><div className="kv">32 <em>% bruts</em></div></div>
          <div className="k"><div className="kl"><i data-lucide="map-pin"></i>Non-concurrence</div><div className="kv">2 km <em>· 24 mois</em></div></div>
          <div className="k"><div className="kl"><i data-lucide="shield"></i>Assurance RCP</div><div className="kv">à fournir <em>J-3</em></div></div>
        </div>

        <div className="flags">
          <span className="fl ok"><i data-lucide="check-circle-2"></i>RPPS 2/2</span>
          <span className="fl ok"><i data-lucide="check-circle-2"></i>Clauses</span>
          <span className="fl warn"><i data-lucide="alert-circle"></i>1 point d'attention</span>
        </div>

        <div className="foot">
          <span className="open"><i data-lucide="maximize-2"></i>Ouvrir le contrat</span>
          <button
            className={"cta" + (toSign ? "" : " done")}
            onClick={(e)=>{ e.stopPropagation(); open(); }}
          >
            <i data-lucide={toSign ? "pen-tool" : "check"}></i>
            {toSign ? "Signer eIDAS" : "Contrat signé"}
          </button>
        </div>
      </div>
    );
  }

  function CopilotCard({ sigState, openContrat, openChat }) {
    return (
      <div className="card card-copilot tall">
        <div className="c-h">
          <div className="ic"><i data-lucide="sparkles"></i></div>
          <h3>Co-pilot JIM</h3>
          <span className="tag live"><span className="dot"></span>Live</span>
        </div>
        <div className="tasks">
          <div className="tx" onClick={openContrat}>
            <div className="txi"><i data-lucide="upload"></i></div>
            <div><div className="t">Téléverser l'attestation RCP</div><div className="s"><span className="urge">Échéance · 9 mai</span></div></div>
            <i data-lucide="chevron-right"></i>
          </div>
          <div className="tx" onClick={openContrat}>
            <div className="txi"><i data-lucide="pen-tool"></i></div>
            <div><div className="t">Signer le contrat eIDAS</div><div className="s">{sigState==="to-sign" ? "En attente — à faire" : "Signé"}</div></div>
            <i data-lucide="chevron-right"></i>
          </div>
          <div className="tx" onClick={openChat}>
            <div className="txi"><i data-lucide="video"></i></div>
            <div><div className="t">Visio signature · jeu. 14 h</div><div className="s">Whereby JIM · lien envoyé</div></div>
            <i data-lucide="chevron-right"></i>
          </div>
        </div>
        <div className="memo">
          <span className="lab">Souvenir clé</span>
          Sandra préfère les <b>messages courts</b> et te tutoie. Ton ton ici : direct, chaleureux.
        </div>
      </div>
    );
  }

  function CabinetCard({ open }) {
    return (
      <div className="card card-cabinet" onClick={open} role="button" tabIndex={0}>
        <div className="c-h">
          <div className="ic"><i data-lucide="building-2"></i></div>
          <h3>Cabinet</h3>
        </div>
        <div className="map"><div className="pin-lbl"><i data-lucide="map-pin"></i>14 rue des Lilas</div></div>
        <div>
          <div className="nm">Cabinet <em>Moreau-Salva</em></div>
          <div className="addr">75011 Paris · M° Voltaire · 3 min</div>
        </div>
        <div className="team">
          <span className="av g1">SM</span>
          <span className="av g2">PS</span>
          <span className="av g5">SL</span>
          <span className="lbl">3 sur place</span>
        </div>
        <span className="open"><i data-lucide="maximize-2"></i>Voir les transmissions</span>
      </div>
    );
  }

  function PatientsCard({ open }) {
    return (
      <div className="card card-patients" onClick={open} role="button" tabIndex={0}>
        <div className="c-h">
          <div className="ic"><i data-lucide="stethoscope"></i></div>
          <h3>Patients <span className="n">· 23 sur la période</span></h3>
        </div>
        <div className="top">
          <span className="av g4">MB</span>
          <div>
            <div className="nm">M. <em>Bertrand</em> · 67 a.</div>
            <div className="pa">Cervicalgie · post-op C5-C6</div>
          </div>
          <div className="vig">Note<br/>IA</div>
        </div>
        <div className="rows">
          <div className="pr"><span className="av g5">NL</span><span className="n">Mme Lefèvre</span><span className="p">· Coiffe rotateurs</span><span className="f">2×</span></div>
          <div className="pr"><span className="av g2">YH</span><span className="n">M. Hammami</span><span className="p">· LCA opéré</span><span className="f">3×</span></div>
          <div className="pr"><span className="av g6">GT</span><span className="n">Mme Tanguy</span><span className="p">· Parkinson · chute</span><span className="f">2×</span></div>
        </div>
        <span className="open"><i data-lucide="maximize-2"></i>Voir tous les patients</span>
      </div>
    );
  }

  function ChatCard({ open }) {
    return (
      <div className="card card-chat" onClick={open} role="button" tabIndex={0}>
        <div className="c-h">
          <div className="ic"><i data-lucide="messages-square"></i></div>
          <h3>Messagerie</h3>
          <span className="tag unread">2 non lus</span>
        </div>
        <div className="tldr">
          <div className="lab"><i data-lucide="sparkles"></i>Résumé du fil</div>
          Sandra confirme le créneau <em>jeudi 14 h</em>. Reste à confirmer ton assurance RCP.
        </div>
        <div className="last">
          <span className="av g1">SM</span>
          <div>
            <div className="who">Dr Sandra Moreau · 08:14</div>
            <div className="bub">Jeudi 14 h ça marche très bien. Je t'envoie le lien Whereby JIM 🌞</div>
          </div>
        </div>
        <span className="open"><i data-lucide="maximize-2"></i>Ouvrir la conversation</span>
      </div>
    );
  }

  function CodesCard({ open }) {
    return (
      <div className="card card-codes" onClick={open} role="button" tabIndex={0}>
        <div className="c-h">
          <div className="ic"><i data-lucide="key-round"></i></div>
          <h3>Accès &amp; codes</h3>
        </div>
        <div className="grid">
          <div className="c"><div className="k"><i data-lucide="wifi"></i>WiFi</div><div className="v">azerty12!</div></div>
          <div className="c"><div className="k"><i data-lucide="door-open"></i>Digicode</div><div className="v">A4729B</div></div>
          <div className="c"><div className="k"><i data-lucide="car"></i>Parking</div><div className="v">2847</div></div>
        </div>
        <span className="open"><i data-lucide="maximize-2"></i>Détail &amp; logiciel</span>
      </div>
    );
  }

  function EquipCard({ open }) {
    return (
      <div className="card card-equip" onClick={open} role="button" tabIndex={0}>
        <div className="c-h">
          <div className="ic"><i data-lucide="dumbbell"></i></div>
          <h3>Équipement <span className="n">· 3/4 prêt</span></h3>
        </div>
        <div className="rows">
          <div className="e"><div className="ei"><i data-lucide="zap"></i></div><div className="l">Ondes de choc Storz</div><div className="ck"><i data-lucide="check-circle-2"></i>OK</div></div>
          <div className="e"><div className="ei"><i data-lucide="snowflake"></i></div><div className="l">Pressothérapie</div><div className="ck"><i data-lucide="check-circle-2"></i>OK</div></div>
          <div className="e"><div className="ei"><i data-lucide="circle-dot"></i></div><div className="l">Plateforme Huber 360</div><div className="ck miss"><i data-lucide="alert-circle"></i>Formation</div></div>
        </div>
        <span className="open"><i data-lucide="maximize-2"></i>Tout l'équipement</span>
      </div>
    );
  }

  function NoteCard({ open }) {
    return (
      <div className="card card-note" onClick={open} role="button" tabIndex={0}>
        <div className="c-h">
          <div className="ic"><i data-lucide="mic"></i></div>
          <h3>Note vocale · Sandra</h3>
        </div>
        <div className="play">
          <span className="pb"><i data-lucide="play"></i></span>
          <span className="wave">
            {[12,20,9,24,16,28,14,22,10,18,26,13,20,11,24,15,9,21].map((h,i)=>(
              <span key={i} style={{height:h+"px"}} />
            ))}
          </span>
          <span className="dur">2:04</span>
        </div>
        <p>Déroulé d'une journée type. <b>Semaine 1 :</b> 14 / 16 / 18 / 12 séances · férié vendredi.</p>
        <span className="open"><i data-lucide="maximize-2"></i>Contexte cabinet</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // DETAIL OVERLAY (reuses the rich tab views)
  // ─────────────────────────────────────────────────────────
  const PANELS = {
    contrat:       { ic:"file-signature",  title:<React.Fragment>Contrat de <em>remplacement</em></React.Fragment>, sub:"eIDAS QES · DocuSign · v.2 · 17 avr." },
    transmissions: { ic:"clipboard-list",  title:<React.Fragment>Transmissions</React.Fragment>,                     sub:"Cabinet · patients · accès · équipement" },
    chat:          { ic:"messages-square", title:<React.Fragment>Messagerie</React.Fragment>,                        sub:"avec Dr Sandra Moreau · Cabinet Moreau-Salva" },
  };

  function DetailOverlay({ panel, sigState, sendToOrdre, onClose, onSwitch }) {
    const meta = PANELS[panel];
    if (!meta) return null;

    React.useEffect(() => {
      const onKey = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const Body = panel === "contrat" ? J.TabContrat
               : panel === "transmissions" ? J.TabTransmissions
               : J.TabChat;

    return (
      <div className="dash-ov" onMouseDown={(e)=>{ if (e.target === e.currentTarget) onClose(); }}>
        <div className="dash-ov-panel">
          <div className="dash-ov-head">
            <div className="ic"><i data-lucide={meta.ic}></i></div>
            <div className="meta">
              <h3>{meta.title}</h3>
              <div className="s">{meta.sub}</div>
            </div>
            <div className="seg">
              <button className={panel==="contrat"?"on":""} onClick={()=>onSwitch("contrat")}><i data-lucide="file-signature"></i>Contrat</button>
              <button className={panel==="transmissions"?"on":""} onClick={()=>onSwitch("transmissions")}><i data-lucide="clipboard-list"></i>Transmissions</button>
              <button className={panel==="chat"?"on":""} onClick={()=>onSwitch("chat")}><i data-lucide="messages-square"></i>Chat</button>
            </div>
            <button className="close" onClick={onClose} aria-label="Fermer"><i data-lucide="x"></i></button>
          </div>
          <div className="dash-ov-body">
            {Body ? <Body sigState={sigState} sendToOrdre={sendToOrdre} /> : null}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // ROOT
  // ─────────────────────────────────────────────────────────
  function MissionDashboard({
    sigState = "to-sign", sendToOrdre = true,
    density = "comfortable", heroStyle = "gradient",
    openPanel = "none", onOpen
  }) {
    const st = STATUS[sigState] || STATUS["to-sign"];
    const open = (p) => onOpen && onOpen(p);

    const dashCls = "dash"
      + (density === "compact" ? " compact" : "")
      + (heroStyle === "flat" ? " flat-stats" : "");

    const TopBar = J.TopBar;

    return (
      <div className="alt-frame dash-frame" data-screen-label="Détail mission · dashboard">
        {TopBar ? <TopBar /> : null}

        <div className={dashCls}>

          {/* Header */}
          <div className="dash-head">
            <div className="left">
              <div className="crumb">
                <span>Mission</span><i data-lucide="chevron-right"></i><b>Remplacement #M-2026-0247</b>
              </div>
              <h1 className="dash-title">Remplacement <em>Ortho</em> · 14 jours</h1>
              <div className="sub">
                <span>Cabinet Moreau-Salva</span><span className="sep">·</span>
                <span>avec <b>Nicolas Bernard</b></span><span className="sep">·</span>
                <span>tu gardes <b>68 %</b></span>
              </div>
            </div>
            <div className="right">
              <div className="datechip">
                <div className="d"><span className="dd">12</span><span className="mm">Mai</span></div>
                <div className="t">Début mission<b>dans 13 jours</b></div>
              </div>
              <div className="status" style={{background:st.bg, color:st.fg}}>
                <span className="pulse" style={{background:st.fg}}></span>{st.lbl}
              </div>
            </div>
          </div>

          {/* Hero stats */}
          <HeroStats sigState={sigState} />

          {/* Parcours band */}
          <ParcoursBand sigState={sigState} />

          {/* Card grid */}
          <div className="dash-grid">
            <ContratCard  sigState={sigState} open={()=>open("contrat")} />
            <CopilotCard  sigState={sigState} openContrat={()=>open("contrat")} openChat={()=>open("chat")} />
            <CabinetCard  open={()=>open("transmissions")} />
            <PatientsCard open={()=>open("transmissions")} />
            <ChatCard     open={()=>open("chat")} />
            <CodesCard    open={()=>open("transmissions")} />
            <EquipCard    open={()=>open("transmissions")} />
            <NoteCard     open={()=>open("transmissions")} />
          </div>

        </div>

        {openPanel && openPanel !== "none" && (
          <DetailOverlay
            panel={openPanel}
            sigState={sigState}
            sendToOrdre={sendToOrdre}
            onClose={()=>open("none")}
            onSwitch={(p)=>open(p)}
          />
        )}
      </div>
    );
  }

  window.MissionDashboard = MissionDashboard;

  // Expose reusable parts so a simplified V2 can share header / hero / parcours / overlay
  window.MissionDashboardParts = { HeroStats, ParcoursBand, DetailOverlay, STATUS, PANELS };
})();
