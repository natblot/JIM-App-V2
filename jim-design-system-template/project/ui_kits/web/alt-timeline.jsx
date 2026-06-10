// Alt D — Timeline mission
// Le cycle de vie de la mission (candidature → négo → signature → mission →
// paiement → avis) est la STRUCTURE de l'écran. La timeline en haut est
// persistante ; le corps montre tout ce qui s'est passé pendant l'étape
// courante (messages + cartes structurées). Cliquer une étape passée la
// rejoue.
function TimelineAlt() {
  return (
    <div className="alt-frame">
      <div className="alt-top">
        <div className="alt-brand">jim</div>
        <div className="alt-where">
          <i data-lucide="git-branch"></i>
          <span>Missions actives</span>
        </div>
        <div className="alt-me">SM</div>
      </div>

      <div className="tl-shell">

        {/* ── LEFT — convos ── */}
        <aside className="tl-list">
          <div className="eyebrow" style={{padding:'4px 8px 6px'}}>En cours · 3</div>

          <div className="convo on">
            <div className="av g3">NB</div>
            <div className="col">
              <div className="top"><span className="n">Nicolas Bernard</span><span className="t">18:42</span></div>
              <div className="pr"><span className="stp">Signature</span><span>Étape 3/6</span></div>
            </div>
          </div>
          <div className="convo">
            <div className="av g5">AL</div>
            <div className="col">
              <div className="top"><span className="n">Amélie Leclerc</span><span className="t">17:05</span></div>
              <div className="pr"><span className="stp" style={{background:'#fdf3df',color:'var(--jim-warning)'}}>Négo.</span><span>Étape 2/6</span></div>
            </div>
          </div>
          <div className="convo">
            <div className="av g6">CB</div>
            <div className="col">
              <div className="top"><span className="n">Cabinet Brun</span><span className="t">12:14</span></div>
              <div className="pr"><span className="stp" style={{background:'#eaf3eb',color:'var(--jim-success)'}}>Mission</span><span>Étape 4/6 · j+2</span></div>
            </div>
          </div>

          <div className="eyebrow" style={{padding:'14px 8px 6px'}}>À clôturer · 2</div>
          <div className="convo">
            <div className="av g4">CD</div>
            <div className="col">
              <div className="top"><span className="n">Claire Dupuis</span><span className="t">hier</span></div>
              <div className="pr"><span className="stp" style={{background:'rgba(176,136,217,.15)',color:'#7c59b3'}}>Paiement</span><span>libération 27/05</span></div>
            </div>
          </div>
          <div className="convo">
            <div className="av g2">RG</div>
            <div className="col">
              <div className="top"><span className="n">Raphaël Gomes</span><span className="t">3 j</span></div>
              <div className="pr"><span className="stp" style={{background:'rgba(176,136,217,.15)',color:'#7c59b3'}}>Avis</span><span>à laisser</span></div>
            </div>
          </div>

          <div className="eyebrow" style={{padding:'14px 8px 6px'}}>Archivées · 12</div>
          <div className="convo" style={{opacity:.55}}>
            <div className="av g1">CT</div>
            <div className="col">
              <div className="top"><span className="n">Cabinet Tessier</span><span className="t">févr.</span></div>
              <div className="pr"><span>Mission terminée</span></div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <section className="tl-main">

          <div className="tl-mhead">
            <h2>Remplacement <em>Ortho</em> · Cabinet Moreau-Salva</h2>
            <div className="sub">· avec Nicolas Bernard · 12 → 26 mai · 68 % rétro.</div>
          </div>

          <div className="tl-stripwrap">
            <div className="tl-strip">
              <div className="tl-progressbar"></div>

              <div className="step done">
                <div className="node"><i data-lucide="user-plus"></i></div>
                <div className="lbl">Candidature</div>
                <div className="when">14 avr.</div>
              </div>
              <div className="step done">
                <div className="node"><i data-lucide="scale"></i></div>
                <div className="lbl">Négociation</div>
                <div className="when">15–16 avr.</div>
              </div>
              <div className="step now">
                <div className="node"><i data-lucide="file-signature"></i></div>
                <div className="lbl">Signature</div>
                <div className="when">en cours</div>
              </div>
              <div className="step">
                <div className="node"><i data-lucide="stethoscope"></i></div>
                <div className="lbl">Mission</div>
                <div className="when">12 → 26 mai</div>
              </div>
              <div className="step">
                <div className="node"><i data-lucide="banknote"></i></div>
                <div className="lbl">Paiement</div>
                <div className="when">27 mai</div>
              </div>
              <div className="step">
                <div className="node"><i data-lucide="star"></i></div>
                <div className="lbl">Avis</div>
                <div className="when">après mission</div>
              </div>
            </div>
          </div>

          {/* Focus step card */}
          <div className="tl-stepcard">
            <div className="ic"><i data-lucide="file-signature"></i></div>
            <div className="meta">
              <div className="eyebrow">Étape 3 sur 6</div>
              <h3>Signature du contrat</h3>
              <div className="desc">Contrat eIDAS envoyé hier 18:42 par Dr Moreau. 3 créneaux proposés pour signature en visio.</div>
            </div>
            <div className="badge"><span className="pulse"></span>Vous : à signer</div>
          </div>

          <div className="tl-body">
            <div className="tl-substeps">
              <button className="on"><i data-lucide="message-circle"></i>Messages 4</button>
              <button><i data-lucide="file-text"></i>Pièces 2</button>
              <button><i data-lucide="calendar"></i>Créneaux 3</button>
              <button><i data-lucide="users"></i>Participants 2</button>
            </div>

            <div className="tl-stream">

              <div className="tl-msg">
                <div className="av g1">SM</div>
                <div>
                  <div className="who"><b>Dr Moreau</b> · hier · 18:42</div>
                  <div className="b">Parfait, contrat envoyé. On signe demain ?</div>
                </div>
              </div>

              <div className="tl-eventcard">
                <div className="ic"><i data-lucide="file-signature" style={{width:13,height:13}}></i></div>
                <div className="panel">
                  <div className="t">Contrat partagé · hier · 18:42</div>
                  <div className="grid">
                    <div><div className="k">Période</div><div className="v">12 → 26 mai</div></div>
                    <div><div className="k">Rétrocession</div><div className="v">68 <em>%</em></div></div>
                    <div><div className="k">Votre part</div><div className="v">1 516 €</div></div>
                  </div>
                  <div className="row">
                    <button><i data-lucide="pen-tool" style={{width:11,height:11,marginRight:5}}></i>Signer eIDAS</button>
                    <button className="s">Lire le PDF</button>
                  </div>
                </div>
              </div>

              <div className="tl-msg me">
                <div className="av g3">NB</div>
                <div>
                  <div className="who"><b>Vous</b> · 19:08</div>
                  <div className="b">Bien reçu. Je propose 3 créneaux pour signer en visio 👇</div>
                </div>
              </div>

              <div className="tl-eventcard">
                <div className="ic"><i data-lucide="calendar-check" style={{width:13,height:13}}></i></div>
                <div className="panel">
                  <div className="t">Créneaux signature · 19:08</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    <div style={{background:'var(--jim-primary-pale)',padding:'8px 10px',borderRadius:9,boxShadow:'inset 0 0 0 1.5px var(--jim-primary)'}}>
                      <div style={{fontSize:10,color:'var(--jim-primary)',fontWeight:700,letterSpacing:'.02em'}}>JEU. 17 AVR.</div>
                      <div style={{fontSize:13,fontWeight:800,color:'var(--jim-text)',marginTop:2}}>14 h 00</div>
                    </div>
                    <div style={{background:'var(--jim-surface-alt)',padding:'8px 10px',borderRadius:9}}>
                      <div style={{fontSize:10,color:'var(--jim-muted)',fontWeight:700,letterSpacing:'.02em'}}>VEN. 18 AVR.</div>
                      <div style={{fontSize:13,fontWeight:800,color:'var(--jim-text)',marginTop:2}}>09 h 30</div>
                    </div>
                    <div style={{background:'var(--jim-surface-alt)',padding:'8px 10px',borderRadius:9}}>
                      <div style={{fontSize:10,color:'var(--jim-muted)',fontWeight:700,letterSpacing:'.02em'}}>VEN. 18 AVR.</div>
                      <div style={{fontSize:13,fontWeight:800,color:'var(--jim-text)',marginTop:2}}>17 h 00</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tl-msg">
                <div className="av g1">SM</div>
                <div>
                  <div className="who"><b>Dr Moreau</b> · aujourd'hui · 08:14</div>
                  <div className="b">Jeu. 14 h ça marche. On se voit en visio JIM, je t'envoie le lien.</div>
                </div>
              </div>

            </div>
          </div>

          <div className="tl-comp">
            <div className="tl-comp-bar">
              <input placeholder="Répondre · cette étape · signature"/>
              <button className="ic" style={{width:30,height:30,borderRadius:7,color:'var(--jim-muted)'}}><i data-lucide="paperclip" style={{width:14,height:14}}></i></button>
              <button className="send"><i data-lucide="arrow-up" style={{width:15,height:15}}></i></button>
            </div>
            <div className="hint">
              <i data-lucide="git-commit-horizontal"></i>
              Une fois le contrat signé, la mission passe à l'étape suivante automatiquement.
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}

window.TimelineAlt = TimelineAlt;
