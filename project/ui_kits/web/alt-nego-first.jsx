// Alt C — Négo-first / Deal canvas
// Le deal occupe 70% de l'espace. Gros chiffres typo (Manrope 64px + Fraunces
// italic accent). Messages en sidebar étroite à droite, ancrés au terme dont
// ils parlent. La conversation sert le contrat, pas l'inverse.
function NegoFirstAlt() {
  return (
    <div className="alt-frame">
      <div className="alt-top">
        <div className="alt-brand">jim</div>
        <div className="alt-where">
          <i data-lucide="handshake"></i>
          <span>Deals</span>
        </div>
        <div className="alt-me">SM</div>
      </div>

      <div className="nf-shell">

        {/* ── LEFT — Liste deals ── */}
        <aside className="nf-left">
          <div className="who">
            <span className="lab">Mes deals · 4</span>
          </div>
          <div className="deal-l on">
            <div className="av g3">NB</div>
            <div className="meta">
              <div className="n">Nicolas Bernard</div>
              <div className="v">68 % · 1 516 € · négo</div>
            </div>
          </div>
          <div className="deal-l">
            <div className="av g5">AL</div>
            <div className="meta">
              <div className="n">Amélie Leclerc</div>
              <div className="v">— · candidature</div>
            </div>
          </div>
          <div className="deal-l">
            <div className="av g4">TR</div>
            <div className="meta">
              <div className="n">Théo Rousseau</div>
              <div className="v">— · candidature</div>
            </div>
          </div>
          <div className="deal-l">
            <div className="av g6">CB</div>
            <div className="meta">
              <div className="n">Cabinet Brun</div>
              <div className="v">70 % · signé</div>
            </div>
          </div>

          <div className="who" style={{marginTop:14}}>
            <span className="lab">Archivés · 6</span>
          </div>
          <div className="deal-l" style={{opacity:.55}}>
            <div className="av g2">CD</div>
            <div className="meta">
              <div className="n">Claire Dupuis</div>
              <div className="v">70 % · payé · mars</div>
            </div>
          </div>
          <div className="deal-l" style={{opacity:.55}}>
            <div className="av g1">CT</div>
            <div className="meta">
              <div className="n">Cabinet Tessier</div>
              <div className="v">65 % · payé · févr.</div>
            </div>
          </div>
        </aside>

        {/* ── CENTER — Deal canvas ── */}
        <section className="nf-center">
          <div className="nf-deal-head">
            <h1>Deal avec <em>Nicolas&nbsp;B.</em></h1>
            <div className="meta">
              <div className="st"><span className="pulse"></span>Négociation · tour 2</div>
              <div className="who">
                <div className="av g1" style={{width:18,height:18,fontSize:9}}>SM</div>
                <span>Vous</span>
                <i data-lucide="arrow-left-right" style={{width:12,height:12}}></i>
                <div className="av g3" style={{width:18,height:18,fontSize:9}}>NB</div>
                <span>Nicolas Bernard</span>
              </div>
            </div>
          </div>

          {/* Money */}
          <div className="nf-money">
            <div className="lc">
              <div className="eyebrow">Sa contre-offre · rétrocession</div>
              <div className="big">
                <span className="old">65 %</span>
                <span className="new">68<em>%</em></span>
              </div>
              <div className="diff"><i data-lucide="trending-up" style={{width:13,height:13}}></i>+3 pts vs. votre offre initiale · à valider</div>
              <div className="slider">
                <div className="fill"></div>
                <div className="nub"></div>
                <div className="ticks">
                  <span>50 %</span><span>60 %</span><span>70 %</span><span>80 %</span>
                </div>
              </div>
            </div>
            <div className="rc">
              <div className="stat">
                <div className="eyebrow">Honoraires bruts</div>
                <div className="v">2 229 €</div>
                <div className="s">14 j · est. 95 séances</div>
              </div>
              <div className="stat">
                <div className="eyebrow">Sa part</div>
                <div className="v">1 516 €</div>
                <div className="s" style={{color:'var(--jim-success)'}}>+67 € vs. offre initiale</div>
              </div>
            </div>
          </div>

          {/* Terms strip */}
          <div className="nf-terms">
            <div className="cell">
              <span className="k">Période</span>
              <span className="v">12 → 26 mai</span>
              <span className="s">14 j · 2 sem.</span>
            </div>
            <div className="cell">
              <span className="k">Lieu</span>
              <span className="v">Lyon 6e</span>
              <span className="s">12 rue Saint-Pothin</span>
            </div>
            <div className="cell">
              <span className="k">Patientèle</span>
              <span className="v">Ortho · Maitland</span>
              <span className="s">~95 séances/sem.</span>
            </div>
            <div className="cell">
              <span className="k">Frais JIM</span>
              <span className="v">0 €</span>
              <span className="s">100 % gratuit · lancement</span>
            </div>
          </div>

          {/* Dates ribbon */}
          <div className="nf-dates">
            <div className="lbl">Période</div>
            <div className="axis">
              <div className="range"></div>
              <div className="pt" style={{left:'14%'}}><div className="dot"></div><div className="l">Lun. 12 mai · 08 h 30</div></div>
              <div className="pt" style={{left:'86%'}}><div className="dot"></div><div className="l">Lun. 26 mai · 19 h 00</div></div>
            </div>
            <div className="duration">14 j <em>· 2 sem.</em></div>
          </div>

          {/* CTAs */}
          <div className="nf-cta">
            <button className="prim"><i data-lucide="check"></i>Accepter 68 % · envoyer contrat</button>
            <button className="sec"><i data-lucide="undo-2"></i>Contre-offre</button>
            <button className="sec gho"><i data-lucide="x"></i>Décliner</button>
          </div>
        </section>

        {/* ── RIGHT — Discussion ── */}
        <aside className="nf-disc">
          <div className="nf-disc-h">
            <h3>Discussion</h3>
            <span className="count">8 messages</span>
            <div className="tabs">
              <span className="on">Tout</span>
              <span>Termes</span>
              <span>Logistique</span>
            </div>
          </div>

          <div className="nf-stream">
            <div className="nf-msg">
              <div className="anchor"><i data-lucide="link" style={{width:9,height:9}}></i>Sur · rétrocession</div>
              <div className="who"><b>Nicolas</b><span>hier · 14:40</span></div>
              <div className="b">Vu mon expérience (Maitland + 4 ans) je proposerais plutôt <b>68 %</b>.</div>
            </div>
            <div className="nf-msg me">
              <div className="who"><b>Vous</b><span>hier · 15:12</span></div>
              <div className="b">68 % c'est élevé pour nous, on est plutôt à 65 % standard.</div>
            </div>
            <div className="nf-msg">
              <div className="who"><b>Nicolas</b><span>hier · 16:48</span></div>
              <div className="b">Compris. Délai court aussi : annonce postée à J-21, j'ai bloqué les 2 semaines en urgence.</div>
            </div>
            <div className="nf-msg me">
              <div className="who"><b>Vous</b><span>hier · 17:30</span></div>
              <div className="b">OK pour 68 %. On signe quand ?</div>
            </div>
            <div className="nf-msg">
              <div className="anchor"><i data-lucide="link" style={{width:9,height:9}}></i>Sur · signature</div>
              <div className="who"><b>Nicolas</b><span>hier · 17:48</span></div>
              <div className="b">Jeu. 17 à 14 h. Voici 2 autres créneaux si besoin 👇</div>
            </div>
            <div className="nf-msg">
              <div className="who"><b>Nicolas</b><span>aujourd'hui · 09:12</span></div>
              <div className="b">Petite question : tu prends une demi-journée samedi 17 ?</div>
            </div>
          </div>

          <div className="nf-comp">
            <input placeholder="Une remarque sur ce deal…"/>
            <button className="ic"><i data-lucide="link" style={{width:13,height:13}}></i></button>
            <button className="ic send" style={{width:28,height:28,borderRadius:7}}><i data-lucide="arrow-up" style={{width:13,height:13}}></i></button>
          </div>
        </aside>

      </div>
    </div>
  );
}

window.NegoFirstAlt = NegoFirstAlt;
