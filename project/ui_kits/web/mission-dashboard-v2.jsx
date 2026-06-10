// Mission Detail — DASHBOARD V2 (épuré)
// Même présentation que la V1 (en-tête + cartes-stats + parcours)
// mais la grille est réduite à 3 cartes : Contrat · Transmissions · Messagerie.
// Réutilise window.JimMission (TopBar + vues détail) et window.MissionDashboardParts.
// Expose : window.MissionDashboardV2

(function () {
  const J = window.JimMission || {};
  const P = window.MissionDashboardParts || {};
  const { HeroStats, ParcoursBand, DetailOverlay, STATUS } = P;

  // ── Carte minimale réutilisable (icône + titre + sous-titre + flèche) ──
  function MiniCard({ icon, title, sub, badge, kind, open }) {
    return (
      <div
        className={"card mini card-" + kind}
        onClick={open}
        role="button"
        tabIndex={0}
        onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); open(); } }}
      >
        <div className="mh">
          <div className="ic"><i data-lucide={icon}></i></div>
          <div className="mt">
            <h3>{title}{badge ? <span className={"pill " + badge.tone}>{badge.label}</span> : null}</h3>
            <p className="sub">{sub}</p>
          </div>
          <span className="arr"><i data-lucide="arrow-up-right"></i></span>
        </div>
      </div>
    );
  }

  // ── Carte CONTRAT (minimale) ──────────────────────────────
  function ContratCard({ sigState, open }) {
    const sub = sigState === "signed"
      ? <>Signé eIDAS · <em>envoi à l'Ordre</em></>
      : sigState === "confirmed"
      ? <>Inscrit à l'<em>Ordre</em></>
      : <>Relu par l'IA · <em>conforme, à signer</em></>;
    const badge = sigState === "to-sign"
      ? { label: "À signer", tone: "warn" }
      : { label: "Signé", tone: "ok" };
    return <MiniCard kind="contrat" icon="file-signature" title="Contrat" sub={sub} badge={badge} open={open} />;
  }

  // ── Carte TRANSMISSIONS (minimale) ────────────────────────
  function TransmissionsCard({ open }) {
    return (
      <MiniCard
        kind="tr2"
        icon="clipboard-list"
        title="Transmissions"
        sub={<>Cabinet <em>Moreau-Salva</em> · 23 patients</>}
        open={open}
      />
    );
  }

  // ── Carte MESSAGERIE (minimale) ───────────────────────────
  function ChatCard({ open }) {
    return (
      <MiniCard
        kind="chat"
        icon="messages-square"
        title="Messagerie"
        sub={<>Dr <em>Sandra Moreau</em> · jeudi 14 h</>}
        badge={{ label: "2 non lus", tone: "unread" }}
        open={open}
      />
    );
  }

  // ── ROOT ──────────────────────────────────────────────────
  function MissionDashboardV2({
    sigState = "to-sign", sendToOrdre = true,
    density = "comfortable", heroStyle = "gradient",
    openPanel = "none", onOpen
  }) {
    const st = (STATUS && STATUS[sigState]) || (STATUS && STATUS["to-sign"]) || { bg:"#fbf0dc", fg:"var(--jim-warning)", lbl:"Contrat à signer" };
    const open = (p) => onOpen && onOpen(p);
    const TopBar = J.TopBar;

    const dashCls = "dash"
      + (density === "compact" ? " compact" : "")
      + (heroStyle === "flat" ? " flat-stats" : "");

    return (
      <div className="alt-frame dash-frame" data-screen-label="Détail mission · dashboard V2">
        {TopBar ? <TopBar /> : null}

        <div className={dashCls}>

          {/* Header (identique V1) */}
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

          {/* Hero stats + parcours (mêmes que V1) */}
          {HeroStats ? <HeroStats sigState={sigState} /> : null}
          {ParcoursBand ? <ParcoursBand sigState={sigState} /> : null}

          {/* Grille épurée : 3 cartes */}
          <div className="dash-grid v2">
            <ContratCard       sigState={sigState} open={()=>open("contrat")} />
            <TransmissionsCard open={()=>open("transmissions")} />
            <ChatCard          open={()=>open("chat")} />
          </div>

        </div>

        {openPanel && openPanel !== "none" && DetailOverlay && (
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

  window.MissionDashboardV2 = MissionDashboardV2;
})();
