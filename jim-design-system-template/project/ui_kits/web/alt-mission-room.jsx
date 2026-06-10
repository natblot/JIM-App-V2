// Alt A — Mission Room
// Chaque mission est un canal. Les cartes structurées (offre, créneaux,
// contrat) sont des messages first-class. Right rail = état mission persistant.
function MissionRoomAlt() {
  return (
    <div className="alt-frame">
      <div className="alt-top">
        <div className="alt-brand">jim</div>
        <div className="alt-where">
          <i data-lucide="hash"></i>
          <span>Mission Rooms</span>
        </div>
        <div className="alt-me">SM</div>
      </div>

      <div className="mr-shell">

        {/* ── LEFT — Liste des mission rooms ── */}
        <aside className="mr-rooms">
          <div className="mr-rgroup">
            <div className="eyebrow">Actives <span>3</span></div>
            <div className="mr-room on unread">
              <span className="hash">#</span>
              <span className="lbl">remp-ortho-mai-12-26</span>
              <span className="dot warn"></span>
            </div>
            <div className="mr-room unread">
              <span className="hash">#</span>
              <span className="lbl">remp-lemaire-juin-02</span>
              <span className="badge">3</span>
            </div>
            <div className="mr-room">
              <span className="hash">#</span>
              <span className="lbl">remp-brun-en-cours</span>
              <span className="dot"></span>
            </div>
          </div>
          <div className="mr-rgroup">
            <div className="eyebrow">En négociation</div>
            <div className="mr-room">
              <span className="hash">#</span>
              <span className="lbl">remp-delcroix-avril</span>
              <span className="dot warn"></span>
            </div>
            <div className="mr-room">
              <span className="hash">#</span>
              <span className="lbl">remp-tessier-juillet</span>
            </div>
          </div>
          <div className="mr-rgroup">
            <div className="eyebrow">Archivées</div>
            <div className="mr-room">
              <span className="hash">#</span>
              <span className="lbl">remp-cabinet-rive-mars</span>
            </div>
            <div className="mr-room">
              <span className="hash">#</span>
              <span className="lbl">remp-cab-villeurb-fev</span>
            </div>
          </div>
        </aside>

        {/* ── CENTER — Mission feed ── */}
        <section className="mr-feed">
          <div className="mr-fhead">
            <span className="mr-fhash">#</span>
            <div className="mr-ftitle">
              <h2>remp-ortho-mai-12-26 <em>· Cabinet Moreau-Salva</em></h2>
              <div className="sub">
                <span>Lyon 6e</span><span>·</span>
                <span>12 → 26 mai</span><span>·</span>
                <span>2 semaines</span><span>·</span>
                <span>68 % rétro.</span>
              </div>
            </div>
            <div className="mr-members">
              <div className="av g1" style={{width:28,height:28,fontSize:10}}>SM</div>
              <div className="av g3" style={{width:28,height:28,fontSize:10}}>NB</div>
              <div className="more">+1</div>
            </div>
          </div>

          <div className="mr-feedbody">
            <div className="mr-daysep">Mercredi 16 avril</div>

            <div className="mr-msg">
              <div className="av g1" style={{width:32,height:32,fontSize:11}}>SM</div>
              <div className="body">
                <div className="who"><b>Dr Sophie Moreau</b><span>Titulaire · 14:08</span></div>
                <p>Bonjour Nicolas, merci pour ta candidature. Profil parfait — Maitland + 4 ans, exactement ce qu'on cherchait. Disponible du 12 au 26 mai ?</p>
              </div>
            </div>

            <div className="mr-msg">
              <div className="av g3" style={{width:32,height:32,fontSize:11}}>NB</div>
              <div className="body">
                <div className="who"><b>Nicolas Bernard</b><span>Remplaçant · 14:22</span></div>
                <p>Hello Dr Moreau ! Oui, libre ces deux semaines. J'ai vu votre annonce hier, le plateau technique me va parfaitement.</p>
              </div>
            </div>

            {/* CARTE OFFRE — first-class */}
            <div className="mr-card">
              <div className="cic"><i data-lucide="scale" style={{width:16,height:16}}></i></div>
              <div className="body">
                <div className="who"><b>Proposition de rétrocession</b><span>par Dr Moreau · hier · 12:05</span></div>
                <div className="block">
                  <div className="title">Contre-proposition <em>· 68 %</em></div>
                  <div className="grid">
                    <div className="cell"><span className="k">Rétrocession</span><span className="v">68 % <em>(+3 pts)</em></span></div>
                    <div className="cell"><span className="k">Votre part</span><span className="v">1 516 € <em>(+67 €)</em></span></div>
                    <div className="cell"><span className="k">Honoraires bruts</span><span className="v">2 229 €</span></div>
                    <div className="cell"><span className="k">Période</span><span className="v">12 → 26 mai</span></div>
                  </div>
                  <div className="actrow">
                    <button className="prim">Accepter 68 %</button>
                    <button className="sec">Contre-offre</button>
                    <button className="sec" style={{background:'transparent'}}>Décliner</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mr-msg">
              <div className="av g3" style={{width:32,height:32,fontSize:11}}>NB</div>
              <div className="body">
                <div className="who"><b>Nicolas Bernard</b><span>17:48</span></div>
                <p>Accepté à 68 %. Je propose qu'on signe demain — voici 3 créneaux 👇</p>
              </div>
            </div>

            {/* CARTE CRÉNEAUX */}
            <div className="mr-card">
              <div className="cic"><i data-lucide="calendar-clock" style={{width:16,height:16}}></i></div>
              <div className="body">
                <div className="who"><b>3 créneaux proposés</b><span>par Nicolas · 17:48</span></div>
                <div className="block" style={{padding:'10px 12px',gap:0}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    <div style={{background:'var(--jim-primary-pale)',padding:'10px 12px',borderRadius:10,boxShadow:'inset 0 0 0 1.5px var(--jim-primary)'}}>
                      <div style={{fontSize:11,color:'var(--jim-primary)',fontWeight:700,letterSpacing:'.02em'}}>JEU. 17 AVR.</div>
                      <div style={{fontSize:15,fontWeight:800,color:'var(--jim-text)',marginTop:2,letterSpacing:'-.01em'}}>14 h 00</div>
                      <div style={{fontSize:10.5,color:'var(--jim-primary)',marginTop:3,fontWeight:700,display:'flex',alignItems:'center',gap:4}}><i data-lucide="check" style={{width:11,height:11}}></i>retenu</div>
                    </div>
                    <div style={{background:'var(--jim-surface-alt)',padding:'10px 12px',borderRadius:10}}>
                      <div style={{fontSize:11,color:'var(--jim-muted)',fontWeight:700,letterSpacing:'.02em'}}>VEN. 18 AVR.</div>
                      <div style={{fontSize:15,fontWeight:800,color:'var(--jim-text)',marginTop:2,letterSpacing:'-.01em'}}>09 h 30</div>
                    </div>
                    <div style={{background:'var(--jim-surface-alt)',padding:'10px 12px',borderRadius:10}}>
                      <div style={{fontSize:11,color:'var(--jim-muted)',fontWeight:700,letterSpacing:'.02em'}}>VEN. 18 AVR.</div>
                      <div style={{fontSize:15,fontWeight:800,color:'var(--jim-text)',marginTop:2,letterSpacing:'-.01em'}}>17 h 00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mr-msg">
              <div className="av g1" style={{width:32,height:32,fontSize:11}}>SM</div>
              <div className="body">
                <div className="who"><b>Dr Sophie Moreau</b><span>18:42</span></div>
                <p>Parfait, je bloque jeudi 14h. Contrat envoyé.</p>
              </div>
            </div>

            {/* CARTE CONTRAT */}
            <div className="mr-card">
              <div className="cic" style={{background:'#eaf3eb',color:'var(--jim-success)'}}><i data-lucide="file-signature" style={{width:16,height:16}}></i></div>
              <div className="body">
                <div className="who"><b>Contrat de remplacement</b><span>partagé par Dr Moreau · 18:42</span></div>
                <div className="block" style={{flexDirection:'row',alignItems:'center',gap:14,padding:'12px 16px'}}>
                  <div style={{width:36,height:44,background:'var(--jim-surface-alt)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--jim-primary)'}}><i data-lucide="file-text" style={{width:18,height:18}}></i></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13.5,fontWeight:800,color:'var(--jim-text)',letterSpacing:'-.01em'}}>Contrat-remplacement-Moreau-Bernard.pdf</div>
                    <div style={{fontSize:11,color:'var(--jim-muted)',fontWeight:600,marginTop:2}}>120 Ko · Modèle Ordre MK · 4 pages · à signer eIDAS</div>
                  </div>
                  <button style={{padding:'9px 16px',background:'var(--jim-primary)',color:'#fff',borderRadius:10,fontSize:12.5,fontWeight:800}}>Signer</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mr-comp">
            <div className="mr-comp-bar">
              <input placeholder="Répondre dans #remp-ortho-mai-12-26…"/>
              <button className="ic"><i data-lucide="paperclip" style={{width:15,height:15}}></i></button>
              <button className="ic"><i data-lucide="calendar-plus" style={{width:15,height:15}}></i></button>
              <button className="ic"><i data-lucide="euro" style={{width:15,height:15}}></i></button>
              <button className="ic send"><i data-lucide="arrow-up" style={{width:15,height:15}}></i></button>
            </div>
            <div className="mr-comp-shortcuts">
              <button><i data-lucide="zap"></i>Cartes rapides : <kbd>/offre</kbd><kbd>/créneau</kbd><kbd>/contrat</kbd></button>
              <button style={{marginLeft:'auto'}}><i data-lucide="info"></i>Médiateur · <kbd>/escalade</kbd></button>
            </div>
          </div>
        </section>

        {/* ── RIGHT — État mission persistant ── */}
        <aside className="mr-rail">
          <div className="mr-status-card">
            <div className="now-label"><span className="pulse"></span>Étape · signature</div>
            <div className="step-bar">
              <i className="done"></i><i className="done"></i><i className="now"></i><i></i><i></i>
            </div>
            <h3>Contrat envoyé, <em>en attente</em> de signature</h3>
          </div>

          <div className="mr-status-card" style={{padding:'14px 16px 16px'}}>
            <div className="eyebrow">Termes du deal</div>
            <div className="mr-bigstat">
              <div className="row"><span className="k">Période</span><span className="v">12 → 26 mai</span></div>
              <div className="row"><span className="k">Durée</span><span className="v">14 jours <em>(2 sem.)</em></span></div>
              <div className="row"><span className="k">Rétrocession</span><span className="v">68 %</span></div>
              <div className="row"><span className="k">Honoraires bruts</span><span className="v">2 229 €</span></div>
              <div className="row"><span className="k">Votre part nette</span><span className="v" style={{color:'var(--jim-primary)',fontSize:14}}>1 516 €</span></div>
              <div className="row"><span className="k">Frais JIM</span><span className="v">0 € <em>· lancement</em></span></div>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{padding:'0 4px 8px'}}>Épinglés <span style={{color:'var(--jim-primary)',marginLeft:4}}>4</span></div>
            <div className="mr-pinned">
              <div className="mr-pin">
                <div className="ic"><i data-lucide="file-text"></i></div>
                <div className="meta"><div className="t">Contrat-remplacement.pdf</div><div className="s">120 Ko · à signer</div></div>
              </div>
              <div className="mr-pin">
                <div className="ic"><i data-lucide="map-pin"></i></div>
                <div className="meta"><div className="t">12 rue Saint-Pothin, Lyon 6e</div><div className="s">cabinet · 4 places kiné</div></div>
              </div>
              <div className="mr-pin">
                <div className="ic"><i data-lucide="key"></i></div>
                <div className="meta"><div className="t">Accès + code alarme</div><div className="s">partagé après signature</div></div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

window.MissionRoomAlt = MissionRoomAlt;
