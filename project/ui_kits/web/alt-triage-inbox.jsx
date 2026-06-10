// Alt B — Triage inbox titulaire (Superhuman-style)
// Pour titulaire noyé sous 12 candidatures. 4 colonnes : annonces · candidats
// (avec score de fit) · thread · profil candidat. Dense, raccourcis clavier.
function TriageInboxAlt() {
  return (
    <div className="alt-frame">
      <div className="alt-top">
        <div className="alt-brand">jim</div>
        <div className="alt-where">
          <i data-lucide="inbox"></i>
          <span>Triage candidatures</span>
        </div>
        <div className="ti-kbd-bar" style={{marginLeft:'auto',marginRight:10}}>
          <kbd>J</kbd>/<kbd>K</kbd> naviguer · <kbd>S</kbd> shortlist · <kbd>X</kbd> rejeter · <kbd>R</kbd> répondre · <kbd>⌘K</kbd> commandes
        </div>
        <div className="alt-me">SM</div>
      </div>

      <div className="ti-shell">

        {/* ── Rail annonces ── */}
        <aside className="ti-rail">
          <div className="grp">
            <div className="eyebrow">Vues</div>
            <div className="item on"><span>Boîte de réception</span><span className="count">12</span></div>
            <div className="item"><span>Shortlist</span><span className="count">3</span></div>
            <div className="item"><span>En discussion</span><span className="count">2</span></div>
            <div className="item"><span>Rejetés</span><span className="count">5</span></div>
            <div className="item"><span>Archivés</span><span className="count">28</span></div>
          </div>

          <div className="grp">
            <div className="eyebrow">Mes annonces</div>
            <div className="ad on">
              <div className="t">Remplacement Ortho · 2 sem.</div>
              <div className="s">12 → 26 mai · publiée il y a 3 j</div>
              <div className="pct"><i data-lucide="users" style={{width:11,height:11}}></i>12 candidatures · 3 shortlist</div>
            </div>
            <div className="ad">
              <div className="t">Remplacement été · 3 sem.</div>
              <div className="s">15 juil. → 5 août · brouillon</div>
            </div>
          </div>

          <div className="grp">
            <div className="eyebrow">Filtres</div>
            <div className="item"><span><i data-lucide="check-circle" style={{width:11,height:11,display:'inline-block',marginRight:5,color:'var(--jim-success)'}}></i>RPPS vérifié</span><span className="count">12</span></div>
            <div className="item"><span><i data-lucide="map-pin" style={{width:11,height:11,display:'inline-block',marginRight:5}}></i>&lt; 10 km</span><span className="count">7</span></div>
            <div className="item"><span><i data-lucide="star" style={{width:11,height:11,display:'inline-block',marginRight:5}}></i>4★ et +</span><span className="count">9</span></div>
            <div className="item"><span><i data-lucide="stethoscope" style={{width:11,height:11,display:'inline-block',marginRight:5}}></i>Ortho · Maitland</span><span className="count">5</span></div>
          </div>
        </aside>

        {/* ── Liste candidats ── */}
        <section className="ti-list">
          <div className="ti-list-h">
            <h2>Candidats</h2>
            <span className="count">· 12</span>
            <span className="sort"><i data-lucide="arrow-down-wide-narrow"></i>Score de fit</span>
          </div>
          <div className="ti-fts">
            <span className="ti-ft on">Tous <span style={{opacity:.6}}>12</span></span>
            <span className="ti-ft"><span className="dot"></span>Non lu 4</span>
            <span className="ti-ft"><span className="dot w"></span>À répondre 2</span>
            <span className="ti-ft">Shortlist 3</span>
          </div>

          <div className="ti-items">
            <div className="ti-item on unread">
              <div className="av g3">NB</div>
              <div className="col">
                <div className="top">
                  <span className="name">Nicolas Bernard</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">68 % accepté — je propose 3 créneaux signature 👇</div>
              </div>
              <div className="meta"><span className="time">18:42</span><span className="fit hi">97 %</span></div>
            </div>

            <div className="ti-item unread">
              <div className="av g5">AL</div>
              <div className="col">
                <div className="top">
                  <span className="name">Amélie Leclerc</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Bonjour, suis-je toujours retenue pour la mission ?</div>
              </div>
              <div className="meta"><span className="time">17:05</span><span className="fit hi">92 %</span></div>
            </div>

            <div className="ti-item">
              <div className="av g4">TR</div>
              <div className="col">
                <div className="top">
                  <span className="name">Théo Rousseau</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Vous : Pouvez-vous nous dire votre fourchette de rétro. ?</div>
              </div>
              <div className="meta"><span className="time">15:30</span><span className="fit hi">88 %</span></div>
            </div>

            <div className="ti-item unread">
              <div className="av g2">CD</div>
              <div className="col">
                <div className="top">
                  <span className="name">Claire Dupuis</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Disponible. CV joint, j'ai déjà bossé en ortho 3 ans.</div>
              </div>
              <div className="meta"><span className="time">14:12</span><span className="fit md">82 %</span></div>
            </div>

            <div className="ti-item">
              <div className="av g1">JM</div>
              <div className="col">
                <div className="top">
                  <span className="name">Julien Marchand</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Vous : Merci, on revient vers vous d'ici 48h.</div>
              </div>
              <div className="meta"><span className="time">11:08</span><span className="fit md">78 %</span></div>
            </div>

            <div className="ti-item">
              <div className="av g6">CB</div>
              <div className="col">
                <div className="top">
                  <span className="name">Camille Berger</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Je suis dispo, mais uniquement la 2e semaine.</div>
              </div>
              <div className="meta"><span className="time">10:21</span><span className="fit md">74 %</span></div>
            </div>

            <div className="ti-item unread">
              <div className="av g5">PL</div>
              <div className="col">
                <div className="top">
                  <span className="name">Paul Lefèvre</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Bonjour, je serais ravi de candidater à votre annonce…</div>
              </div>
              <div className="meta"><span className="time">09:14</span><span className="fit md">71 %</span></div>
            </div>

            <div className="ti-item">
              <div className="av g4">EH</div>
              <div className="col">
                <div className="top">
                  <span className="name">Émilie Hervé</span>
                </div>
                <div className="snip">Vous : Profil noté, je reviens vers vous.</div>
              </div>
              <div className="meta"><span className="time">hier</span><span className="fit lo">62 %</span></div>
            </div>

            <div className="ti-item">
              <div className="av g2">SK</div>
              <div className="col">
                <div className="top">
                  <span className="name">Samuel Kahn</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Bonjour, candidature spontanée — disponible.</div>
              </div>
              <div className="meta"><span className="time">hier</span><span className="fit lo">58 %</span></div>
            </div>

            <div className="ti-item">
              <div className="av g3">RG</div>
              <div className="col">
                <div className="top">
                  <span className="name">Raphaël Gomes</span>
                  <i data-lucide="shield-check" className="verif"></i>
                </div>
                <div className="snip">Disponible toute la première semaine, partielle 2e.</div>
              </div>
              <div className="meta"><span className="time">mar.</span><span className="fit lo">54 %</span></div>
            </div>
          </div>
        </section>

        {/* ── Thread ── */}
        <section className="ti-thread">
          <div className="ti-thead">
            <div className="av g3" style={{width:34,height:34,fontSize:12}}>NB</div>
            <div>
              <h3>Nicolas Bernard</h3>
              <div className="meta">
                <i data-lucide="shield-check" style={{width:11,height:11,color:'var(--jim-success)'}}></i>
                RPPS · 4 ans · Lyon · 2,8 km
              </div>
            </div>
            <div className="ti-tools">
              <button className="act"><i data-lucide="star"></i>Shortlist <kbd style={{marginLeft:5,fontSize:9,padding:'1px 4px',background:'var(--jim-surface-alt)',borderRadius:3,fontFamily:'var(--font-mono)'}}>S</kbd></button>
              <button className="act"><i data-lucide="archive"></i>Archiver</button>
              <button className="act prim"><i data-lucide="reply"></i>Répondre <kbd style={{marginLeft:5,fontSize:9,padding:'1px 4px',background:'rgba(255,255,255,.25)',borderRadius:3,fontFamily:'var(--font-mono)',color:'#fff'}}>R</kbd></button>
            </div>
          </div>

          <div className="ti-tmsg">
            <div className="ti-day">Hier · 14:08</div>
            <div className="ti-bub me">Bonjour Nicolas, profil intéressant. On propose <b>65 %</b> de rétrocession sur les 2 semaines, ça vous va ?</div>
            <div className="ti-time" style={{alignSelf:'flex-end'}}>14:08 · Lu</div>
            <div className="ti-bub">Merci ! Vu mon expérience (Maitland + 4 ans) je proposerais plutôt <b>68 %</b>. Délai court aussi.</div>
            <div className="ti-time">14:40</div>
            <div className="ti-bub me">D'accord pour 68 %. Quand est-ce qu'on signe ?</div>
            <div className="ti-time" style={{alignSelf:'flex-end'}}>17:30 · Lu</div>
            <div className="ti-bub">Super 🙏 Je propose 3 créneaux pour signature eIDAS :<br/>· <b>Jeu. 17 — 14 h 00</b><br/>· Ven. 18 — 09 h 30<br/>· Ven. 18 — 17 h 00</div>
            <div className="ti-time">17:48</div>
            <div className="ti-bub me">Parfait, jeudi 14h. Je t'envoie le contrat sous 10 min.</div>
            <div className="ti-time" style={{alignSelf:'flex-end'}}>18:42 · Lu</div>
          </div>

          <div className="ti-comp">
            <div className="ti-comp-bar">
              <input placeholder="Répondre à Nicolas… (R)" defaultValue=""/>
              <button className="ic"><i data-lucide="zap" style={{width:14,height:14,color:'var(--jim-primary)'}}></i></button>
              <button className="ic"><i data-lucide="paperclip" style={{width:14,height:14}}></i></button>
              <button className="ic send"><i data-lucide="arrow-up" style={{width:14,height:14}}></i></button>
            </div>
          </div>
        </section>

        {/* ── Profil candidat ── */}
        <aside className="ti-prof">
          <div className="head">
            <div className="av g3">NB</div>
            <h4>Nicolas Bernard <i data-lucide="shield-check" className="verif"></i></h4>
            <div className="sub">Kiné remplaçant · 4 ans · Lyon 3e</div>
          </div>
          <div className="quick">
            <button className="prim"><i data-lucide="star"></i>Shortlist</button>
            <button><i data-lucide="x"></i>Rejeter</button>
          </div>

          <div className="ti-fit-card">
            <div className="eyebrow">Score de fit JIM</div>
            <div className="bigfit">97<em>/100</em></div>
            <div className="bar"><i style={{width:'97%'}}></i></div>
            <div className="crit">
              <div className="c">
                <span className="k"><i data-lucide="stethoscope"></i>Ortho · Maitland</span>
                <span className="v"><i data-lucide="check"></i>4 ans</span>
              </div>
              <div className="c">
                <span className="k"><i data-lucide="calendar"></i>Disponible 12 → 26 mai</span>
                <span className="v"><i data-lucide="check"></i>14 j</span>
              </div>
              <div className="c">
                <span className="k"><i data-lucide="map-pin"></i>Distance cabinet</span>
                <span className="v"><i data-lucide="check"></i>2,8 km</span>
              </div>
              <div className="c">
                <span className="k"><i data-lucide="star"></i>Note moyenne</span>
                <span className="v">4,9 ★ <span className="muted">(12)</span></span>
              </div>
              <div className="c">
                <span className="k"><i data-lucide="clock"></i>Temps de réponse</span>
                <span className="v">~3 min</span>
              </div>
              <div className="c">
                <span className="k"><i data-lucide="trending-up"></i>Taux d'acceptation</span>
                <span className="v warn">8/12 missions</span>
              </div>
            </div>
          </div>

          <div className="other">
            <div className="row"><span className="k">Diplôme</span><span className="v">IFMK Lyon · 2020</span></div>
            <div className="row"><span className="k">N° RPPS</span><span className="v" style={{fontFamily:'var(--font-mono)',fontSize:11}}>10001234567</span></div>
            <div className="row"><span className="k">Missions JIM</span><span className="v">12 · 0 litige</span></div>
            <div className="row"><span className="k">Fourchette rétro.</span><span className="v">65 → 72 %</span></div>
          </div>
        </aside>

      </div>
    </div>
  );
}

window.TriageInboxAlt = TriageInboxAlt;
