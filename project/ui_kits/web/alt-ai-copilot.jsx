// Alt E — JIM AI co-pilot
// Thread classique enrichi d'un bandeau TL;DR + un rail droit "JIM AI" qui :
// résume la convo, extrait les termes du deal, détecte les risques, propose
// 3 réponses contextuelles. La liste de gauche affiche aussi un résumé IA
// par conversation, plus utile qu'un snippet du dernier message.
function AICopilotAlt() {
  return (
    <div className="alt-frame">
      <div className="alt-top">
        <div className="alt-brand">jim</div>
        <div className="alt-where">
          <i data-lucide="sparkles"></i>
          <span>Messagerie · avec JIM AI</span>
        </div>
        <div className="alt-me">SM</div>
      </div>

      <div className="ai-shell">

        {/* ── LEFT — convos avec résumé IA ── */}
        <aside className="ai-list">
          <h3>Messages</h3>

          <div className="convo on">
            <div className="av g1">CM</div>
            <div className="col">
              <div className="n">
                <span>Cabinet Moreau-Salva</span>
                <span className="t">18:42</span>
              </div>
              <div className="summary"><span className="lab">RÉSUMÉ</span>Négo terminée à 68 %, contrat signé eIDAS, attente confirmation créneau.</div>
              <div className="tags">
                <span className="neg">à signer</span>
                <span className="ai">3 actions</span>
              </div>
            </div>
          </div>

          <div className="convo">
            <div className="av g5">NL</div>
            <div className="col">
              <div className="n">
                <span>Dr Lemaire</span>
                <span className="t">lun.</span>
              </div>
              <div className="summary"><span className="lab">RÉSUMÉ</span>Demande couverture sem. 02/06, dispo confirmée, attend la rétro.</div>
              <div className="tags">
                <span className="neg">négo en cours</span>
              </div>
            </div>
          </div>

          <div className="convo">
            <div className="av g3">AB</div>
            <div className="col">
              <div className="n">
                <span>Dr Amélie Brun</span>
                <span className="t">14:12</span>
              </div>
              <div className="summary"><span className="lab">RÉSUMÉ</span>Mission terminée, retour positif des deux côtés, paiement libéré.</div>
              <div className="tags">
                <span className="ok">terminée</span>
              </div>
            </div>
          </div>

          <div className="convo">
            <div className="av g4">CD</div>
            <div className="col">
              <div className="n">
                <span>Cabinet Delcroix</span>
                <span className="t">hier</span>
              </div>
              <div className="summary"><span className="lab">RÉSUMÉ</span>Désaccord sur les dates ; ton tendu détecté dans les 3 derniers messages.</div>
              <div className="tags">
                <span className="urg">tension</span>
                <span className="ai">médiateur ?</span>
              </div>
            </div>
          </div>

          <div className="convo">
            <div className="av g2">SJ</div>
            <div className="col">
              <div className="n">
                <span>Support JIM</span>
                <span className="t">12 avr</span>
              </div>
              <div className="summary"><span className="lab">RÉSUMÉ</span>Vérification RPPS confirmée, profil validé, aucune action requise.</div>
              <div className="tags">
                <span className="ok">classé</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── CENTER — thread ── */}
        <section className="ai-thread">
          <div className="ai-thead">
            <div className="av g1">SM</div>
            <div className="meta">
              <h3>Dr Sophie Moreau <i data-lucide="shield-check" className="verif"></i></h3>
              <div className="sub">
                <span className="live"></span>En ligne · Cabinet Moreau-Salva · Lyon 6e
              </div>
            </div>
            <button style={{padding:'6px 12px',background:'#fff',borderRadius:9,fontSize:11.5,fontWeight:700,display:'inline-flex',alignItems:'center',gap:5,color:'var(--jim-text-body)',border:'1px solid rgba(58,31,8,.08)'}}><i data-lucide="info" style={{width:11,height:11}}></i>Détails</button>
          </div>

          {/* TL;DR bandeau */}
          <div className="ai-tldr">
            <div className="ic"><i data-lucide="sparkles" style={{width:14,height:14}}></i></div>
            <div className="meta">
              <div className="lab"><span className="sparkle">✦</span>JIM AI · résumé de la conversation</div>
              <h4>Dr Moreau propose <em>68 % de rétrocession</em> sur 12 → 26 mai. Vous avez accepté. Contrat envoyé hier soir, <em>attend votre signature</em> sur l'un des 3 créneaux proposés.</h4>
              <div className="signals">
                <span className="sig ok"><i data-lucide="check-circle"></i>Cabinet vérifié RPPS · 4,9 ★ (8 missions)</span>
                <span className="sig ok"><i data-lucide="trending-up"></i>Rétro. dans la fourchette haute (Lyon ortho : 62–68 %)</span>
                <span className="sig warn"><i data-lucide="clock"></i>Mission dans 26 j — délai serré</span>
              </div>
            </div>
          </div>

          <div className="ai-msgs">
            <div className="ai-day">Hier</div>

            <div className="ai-msg">
              <div className="who">Dr Moreau · 14:08</div>
              <div className="b">Bonjour Nicolas, votre profil colle parfaitement. Standard du cabinet : <b>65 %</b> de <span className="term">rétrocession</span>. Dispo du 12 au 26 mai ?</div>
            </div>

            <div className="ai-msg me">
              <div className="b">Hello Dr Moreau, oui parfaitement libre ces deux semaines. 65 % sur 2 semaines avec mon expérience c'est un peu juste — je proposerais <b>68 %</b>.</div>
            </div>

            <div className="ai-hint"><i data-lucide="sparkles"></i>JIM AI a détecté une contre-offre · taux de signature à 68 % : 81 %</div>

            <div className="ai-msg">
              <div className="who">Dr Moreau · hier · 12:05</div>
              <div className="b">Vu votre profil Maitland + 4 ans, je peux monter à <b>68 %</b>. Ça vous convient ?</div>
            </div>

            <div className="ai-msg me">
              <div className="b">Accepté à 68 % 🤝. Quand est-ce qu'on signe ?</div>
            </div>

            <div className="ai-msg">
              <div className="who">Dr Moreau · 18:42</div>
              <div className="b">Parfait, contrat envoyé. <span className="term">Signature eIDAS</span> sur l'un des 3 créneaux ci-dessus. À demain.</div>
            </div>
          </div>

          {/* Suggested replies */}
          <div className="ai-sugs">
            <div className="lab"><i data-lucide="sparkles"></i>Réponses suggérées par JIM AI</div>
            <div className="row">
              <button className="sg"><i data-lucide="check"></i>Parfait, je signe sur le créneau de jeudi 14 h.</button>
              <button className="sg"><i data-lucide="calendar-plus"></i>Aucun des 3 créneaux ne va — proposer mes dispos ?</button>
              <button className="sg"><i data-lucide="file-question"></i>Une question sur l'article 4 du contrat avant signature.</button>
            </div>
          </div>

          <div className="ai-comp">
            <div className="ai-comp-bar">
              <input placeholder="Écrire un message à Dr Moreau…"/>
              <button className="ic"><i data-lucide="paperclip" style={{width:14,height:14}}></i></button>
              <button className="ic" style={{color:'#7c59b3'}}><i data-lucide="sparkles" style={{width:14,height:14}}></i></button>
              <button className="ic send"><i data-lucide="arrow-up" style={{width:14,height:14}}></i></button>
            </div>
          </div>
        </section>

        {/* ── RIGHT — JIM AI panel ── */}
        <aside className="ai-rail">
          <div className="ai-rail-h">
            <div className="ic"><i data-lucide="sparkles" style={{width:13,height:13}}></i></div>
            <h4>JIM <em>AI</em></h4>
            <span className="stat"><span className="dot"></span>actif</span>
          </div>

          {/* Termes extraits */}
          <div className="ai-block">
            <div className="eyebrow">Termes extraits du fil</div>
            <h5>Deal en cours</h5>
            <div className="ai-extracted">
              <div className="row"><span className="k"><i data-lucide="percent"></i>Rétrocession</span><span className="v">68 %</span></div>
              <div className="row"><span className="k"><i data-lucide="calendar"></i>Période</span><span className="v">12 → 26 mai</span></div>
              <div className="row"><span className="k"><i data-lucide="banknote"></i>Honoraires bruts est.</span><span className="v">2 229 €</span></div>
              <div className="row"><span className="k"><i data-lucide="wallet"></i>Votre part</span><span className="v" style={{color:'var(--jim-primary)'}}>1 516 €</span></div>
              <div className="row"><span className="k"><i data-lucide="file-signature"></i>Statut</span><span className="v">attente signature</span></div>
            </div>
          </div>

          {/* Signaux */}
          <div className="ai-block">
            <div className="eyebrow">Signaux détectés</div>
            <h5>3 vérifs · 1 alerte douce</h5>
            <div className="ai-risk">
              <div className="r ok">
                <i data-lucide="check-circle"></i>
                <div><b>RPPS + assurance pro</b><span className="meta">Tous les documents requis du titulaire sont à jour.</span></div>
              </div>
              <div className="r ok">
                <i data-lucide="trending-up"></i>
                <div><b>Rétro. dans la norme</b><span className="meta">68 % = fourchette haute Lyon ortho 2 sem. (méd. 65 %).</span></div>
              </div>
              <div className="r warn">
                <i data-lucide="clock"></i>
                <div><b>Délai signature serré</b><span className="meta">Contrat envoyé il y a 14 h. La mission démarre dans 26 j — signez avant J-21.</span></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="ai-block">
            <div className="eyebrow">Prochaines actions</div>
            <div className="ai-actions">
              <div className="ax">
                <div className="ic"><i data-lucide="pen-tool"></i></div>
                <div className="t">Signer le contrat<span>en visio jeu. 14 h · eIDAS</span></div>
              </div>
              <div className="ax">
                <div className="ic"><i data-lucide="key-round"></i></div>
                <div className="t">Demander les accès cabinet<span>après signature · suggéré</span></div>
              </div>
              <div className="ax">
                <div className="ic"><i data-lucide="map-pin"></i></div>
                <div className="t">Pré-visite cabinet<span>conseillé · 12 rue St-Pothin</span></div>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

window.AICopilotAlt = AICopilotAlt;
