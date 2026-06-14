/* ═══════════════════════════════════════════════════════════════
   JIM — Shared search bar (dropdowns + bottom-sheet)
   Auto-initialises every .search-shell on DOMContentLoaded.
   The shell needs a .search-bar with at least the "Où" + "Quand"
   buttons; if "Spécialité" is missing, this script adds it.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const DOW = ['L','M','M','J','V','S','D'];

  const LOC_RECENT = [
    { value:'Paris 11ᵉ', sub:'15–22 juin · Musculo-squelettique' }
  ];
  const LOC_SUGGESTIONS = [
    { value:'Autour de moi', sub:'Dans un rayon de 50 km', icon:'navigation', tone:'coral' },
    { value:'Paris, Île-de-France', sub:'1 247 kinés actifs', icon:'building-2', tone:'coral' },
    { value:'Lyon, Auvergne-Rhône-Alpes', sub:'412 kinés actifs · 1 mission urgente', icon:'building-2', tone:'beige' },
    { value:'Marseille, Provence-Alpes-Côte d\'Azur', sub:'328 kinés actifs', icon:'building-2', tone:'coral' },
    { value:'Bordeaux, Nouvelle-Aquitaine', sub:'194 kinés actifs', icon:'building-2', tone:'beige' },
  ];
  const SPECIALTIES = [
    { value:'Musculo-squelettique', t:'Musculo', s:'Squelettique',     icon:'bone' },
    { value:'Neurologie',           t:'Neurologie', s:'AVC, Parkinson', icon:'brain' },
    { value:'Pédiatrie',            t:'Pédiatrie', s:'Enfants 0–16 ans', icon:'baby' },
    { value:'Sport',                t:'Sport', s:'Performance, post-op',  icon:'dumbbell' },
    { value:'Respiratoire',         t:'Respiratoire', s:'Bronchiolite, BPCO', icon:'wind' },
    { value:'Gériatrie',            t:'Gériatrie', s:'EHPAD, domicile',  icon:'heart-pulse' },
    { value:'Pelvi-périnéale',      t:'Pelvi-périnéale', s:'Pré / post-partum', icon:'flower-2' },
    { value:'Lymphologie',          t:'Lymphologie', s:'Drainage, oedèmes', icon:'droplets' },
  ];
  const FLEX_PILLS = ['Dates exactes','± 1 jour','± 2 jours','± 3 jours','± 7 jours','± 14 jours'];

  /* ── Templates ── */
  function locListHTML(items, klass=''){
    return items.map(it => `
      <button type="button" class="loc-item" data-loc="${it.value}">
        <span class="loc-ico ${klass || it.tone || ''}"><i data-lucide="${it.icon || 'clock'}" width="18" height="18" stroke-width="1.75"></i></span>
        <span class="loc-txt">
          <p class="loc-t">${it.value}</p>
          <p class="loc-s">${it.sub}</p>
        </span>
      </button>`).join('');
  }
  function specGridHTML(){
    return SPECIALTIES.map(s => `
      <button type="button" class="spec-card" data-spec="${s.value}">
        <span class="spec-ico"><i data-lucide="${s.icon}" width="16" height="16" stroke-width="2"></i></span>
        <span><p class="spec-t">${s.t}</p><p class="spec-s">${s.s}</p></span>
      </button>`).join('');
  }
  function popLocHTML(){
    return `
      <p class="sb-pop-h">Recherche récente</p>
      <div class="loc-list" data-list="recent">${locListHTML(LOC_RECENT,'history')}</div>
      <div class="loc-sep"></div>
      <p class="sb-pop-h">Suggestions</p>
      <div class="loc-list" data-list="suggest">${locListHTML(LOC_SUGGESTIONS)}</div>`;
  }
  function popDatesHTML(){
    return `
      <div class="cal-tabs">
        <button type="button" class="cal-tab on" data-mode="exact">Dates</button>
        <button type="button" class="cal-tab" data-mode="flex">Flexible</button>
      </div>
      <div class="cal-grid" data-cal-grid></div>
      <div class="cal-pills">
        ${FLEX_PILLS.map((p,i)=>`<button type="button" class="cal-pill${i===0?' on':''}">${p}</button>`).join('')}
      </div>`;
  }
  function popSpecHTML(){
    return `
      <p class="sb-pop-h">Thématiques</p>
      <div class="spec-grid">${specGridHTML()}</div>
      <div class="spec-footer">
        <span class="spec-count"><strong data-spec-count>0</strong> sélectionnée(s)</span>
        <button type="button" class="spec-clear">Effacer</button>
      </div>`;
  }

  /* ── Bottom-sheet shell ── */
  function sheetTabHTML(section, label, valKey, placeholder, active){
    return `
      <button type="button" class="sb-tab${active ? ' on' : ''}" data-section="${section}">
        <span class="sb-tab-lbl">${label}</span>
        <span class="sb-tab-val placeholder" data-val="${valKey}">${placeholder}</span>
      </button>`;
  }
  function sheetHTML(){
    return `
      <div class="sb-sheet-bd" data-sheet-close></div>
      <div class="sb-sheet-panel" role="dialog" aria-label="Rechercher">
        <div class="sb-sheet-grab"></div>
        <div class="sb-sheet-head">
          <h3 class="sb-sheet-title">Rechercher une mission</h3>
          <button type="button" class="sb-sheet-close" data-sheet-close aria-label="Fermer">
            <i data-lucide="x" width="18" height="18" stroke-width="2"></i>
          </button>
        </div>
        <div class="sb-sheet-tabs" role="tablist">
          ${sheetTabHTML('loc',   'Où',         'loc',   'Ville, code postal', true)}
          ${sheetTabHTML('dates', 'Quand',      'dates', 'Ajouter dates',      false)}
          ${sheetTabHTML('spec',  'Spécialité', 'spec',  'Toutes',             false)}
        </div>
        <div class="sb-sheet-body">
          <div class="sb-pane on" data-pane="loc"><div data-body="loc">${popLocHTML()}</div></div>
          <div class="sb-pane"    data-pane="dates"><div data-body="dates">${popDatesHTML()}</div></div>
          <div class="sb-pane"    data-pane="spec"><div data-body="spec">${popSpecHTML()}</div></div>
        </div>
        <div class="sb-sheet-foot">
          <button type="button" class="sb-sheet-clear">Tout effacer</button>
          <button type="button" class="sb-sheet-cta" data-sheet-submit>
            <i data-lucide="search" width="16" height="16" stroke-width="2.5"></i>
            <span>Rechercher</span>
          </button>
        </div>
      </div>`;
  }

  /* ── Ensure markup ── */
  function ensureFields(shell){
    const bar = shell.querySelector('.search-bar');
    if(!bar) return null;

    // Tag existing buttons with data-pop
    const buttons = [...bar.querySelectorAll('.sb-field')];
    buttons.forEach(b => {
      if(b.dataset.pop) return;
      const lbl = (b.querySelector('.sb-l')?.textContent || '').trim().toLowerCase();
      if(lbl === 'où' || lbl === 'ou') b.dataset.pop = 'loc';
      else if(lbl === 'quand') b.dataset.pop = 'dates';
      else if(lbl.startsWith('spécial') || lbl.startsWith('special')) b.dataset.pop = 'spec';
    });

    // Add Spécialité field if missing
    if(!bar.querySelector('.sb-field[data-pop="spec"]')){
      const cta = bar.querySelector('.sb-cta');
      const divider = document.createElement('span');
      divider.className = 'sb-divider';
      divider.setAttribute('aria-hidden','true');
      const fld = document.createElement('button');
      fld.type = 'button';
      fld.className = 'sb-field';
      fld.dataset.pop = 'spec';
      fld.setAttribute('aria-label','Spécialité');
      fld.innerHTML = `<span class="sb-l">Spécialité</span><input type="text" placeholder="Toutes" readonly>`;
      if(cta){ bar.insertBefore(divider, cta); bar.insertBefore(fld, cta); }
      else { bar.appendChild(divider); bar.appendChild(fld); }
    }

    // Make all inputs non-typable (we route via dropdowns + sheet)
    bar.querySelectorAll('.sb-field input').forEach(i => i.setAttribute('readonly','readonly'));

    // Inject inline dropdowns + backdrop if not present
    if(!shell.querySelector('.sb-pop.loc')){
      const popLoc = document.createElement('div');
      popLoc.className = 'sb-pop loc'; popLoc.setAttribute('role','dialog');
      popLoc.innerHTML = popLocHTML();
      shell.appendChild(popLoc);
      const popDates = document.createElement('div');
      popDates.className = 'sb-pop dates'; popDates.setAttribute('role','dialog');
      popDates.innerHTML = popDatesHTML();
      shell.appendChild(popDates);
      const popSpec = document.createElement('div');
      popSpec.className = 'sb-pop spec'; popSpec.setAttribute('role','dialog');
      popSpec.innerHTML = popSpecHTML();
      shell.appendChild(popSpec);
      const bd = document.createElement('div');
      bd.className = 'sb-backdrop';
      shell.appendChild(bd);
    }

    return bar;
  }

  function ensureSheet(){
    let sheet = document.querySelector('.sb-sheet');
    if(sheet) return sheet;
    sheet = document.createElement('div');
    sheet.className = 'sb-sheet';
    sheet.innerHTML = sheetHTML();
    document.body.appendChild(sheet);
    return sheet;
  }

  /* ── Shared state (synced between all UIs) ── */
  const state = {
    loc:'',
    rangeStart: new Date(2026,5,15), // 15 June 2026
    rangeEnd:   new Date(2026,5,22),
    spec: new Set(['Musculo-squelettique']),
    flex: 'Dates exactes',
    listeners: []
  };
  state.subscribe = fn => state.listeners.push(fn);
  state.notify = () => state.listeners.forEach(fn => fn(state));

  const fmtDate = d => d ? d.getDate() + ' ' + MONTH_NAMES[d.getMonth()].toLowerCase().slice(0,4) : '';
  const fmtRange = () => {
    if(!state.rangeStart) return '';
    if(state.rangeEnd && state.rangeEnd.getTime() !== state.rangeStart.getTime()) return fmtDate(state.rangeStart) + ' – ' + fmtDate(state.rangeEnd);
    return fmtDate(state.rangeStart);
  };
  const fmtSpec = () => {
    const arr = [...state.spec];
    if(arr.length === 0) return '';
    if(arr.length === 1) return arr[0];
    return arr[0].split(/[ -]/)[0] + ' +' + (arr.length - 1);
  };

  /* ── Calendar builder (reused in inline + sheet) ── */
  function buildCalendar(host, opts={}){
    let viewYear = state.rangeStart ? state.rangeStart.getFullYear() : new Date().getFullYear();
    let viewMonth = state.rangeStart ? state.rangeStart.getMonth() : new Date().getMonth();
    const months = opts.months || 2;
    const today = new Date(); today.setHours(0,0,0,0);

    function buildMonth(y, m, isFirst, isLast){
      const wrap = document.createElement('div');
      wrap.className = 'cal-mo';
      const h = document.createElement('h4'); h.className = 'cal-mo-h';
      h.textContent = MONTH_NAMES[m] + ' ' + y;
      wrap.appendChild(h);
      if(isFirst){
        const prev = document.createElement('button'); prev.type='button'; prev.className='cal-nav prev'; prev.setAttribute('aria-label','Mois précédent');
        prev.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
        prev.addEventListener('click', () => { viewMonth -= 1; if(viewMonth < 0){ viewMonth = 11; viewYear -= 1; } render(); });
        wrap.appendChild(prev);
      }
      if(isLast){
        const next = document.createElement('button'); next.type='button'; next.className='cal-nav next'; next.setAttribute('aria-label','Mois suivant');
        next.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
        next.addEventListener('click', () => { viewMonth += 1; if(viewMonth > 11){ viewMonth = 0; viewYear += 1; } render(); });
        wrap.appendChild(next);
      }
      const dow = document.createElement('div'); dow.className='cal-dow';
      DOW.forEach(d => { const el=document.createElement('span'); el.textContent=d; dow.appendChild(el); });
      wrap.appendChild(dow);
      const days = document.createElement('div'); days.className='cal-days';
      const firstOfMonth = new Date(y, m, 1);
      const offset = (firstOfMonth.getDay() + 6) % 7;
      const daysInMonth = new Date(y, m+1, 0).getDate();
      for(let i=0;i<offset;i++){ days.appendChild(document.createElement('span')); }
      for(let d=1; d<=daysInMonth; d++){
        const date = new Date(y, m, d);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cal-d';
        b.textContent = d;
        if(date < today) b.classList.add('muted');
        const s = state.rangeStart, e = state.rangeEnd;
        if(s && e){
          if(date.getTime() === s.getTime()) b.classList.add('start');
          if(date.getTime() === e.getTime()) b.classList.add('end');
          if(date > s && date < e) b.classList.add('in-range');
        } else if(s && date.getTime() === s.getTime()){
          b.classList.add('start','end');
        }
        b.addEventListener('click', () => {
          if(!state.rangeStart || (state.rangeStart && state.rangeEnd)){
            state.rangeStart = date; state.rangeEnd = null;
          } else if(date < state.rangeStart){
            state.rangeStart = date;
          } else {
            state.rangeEnd = date;
          }
          state.notify();
        });
        days.appendChild(b);
      }
      wrap.appendChild(days);
      return wrap;
    }
    function render(){
      host.innerHTML = '';
      for(let i=0;i<months;i++){
        let m = (viewMonth + i) % 12;
        let y = viewYear + Math.floor((viewMonth + i) / 12);
        host.appendChild(buildMonth(y, m, i===0, i===months-1));
      }
    }
    render();
    state.subscribe(() => render());
  }

  /* ── Init a single shell ── */
  function initShell(shell){
    const bar = ensureFields(shell);
    if(!bar) return;
    const sheet = ensureSheet();
    if(window.lucide) lucide.createIcons();

    const fields  = [...shell.querySelectorAll('.sb-field[data-pop]')];
    const pops    = { loc: shell.querySelector('.sb-pop.loc'), dates: shell.querySelector('.sb-pop.dates'), spec: shell.querySelector('.sb-pop.spec') };
    const backdrop = shell.querySelector('.sb-backdrop');
    const isCompact = () => window.matchMedia('(max-width: 1280px)').matches;

    function closeInline(){
      fields.forEach(f => f.classList.remove('open'));
      Object.values(pops).forEach(p => p && p.classList.remove('open'));
      shell.classList.remove('any-open');
    }
    function openInline(name, fld){
      closeInline();
      fld.classList.add('open');
      if(pops[name]) pops[name].classList.add('open');
      shell.classList.add('any-open');
    }

    function openSheet(focusSection){
      sheet.classList.add('open');
      document.body.classList.add('sb-sheet-open');
      // Activate the requested tab
      if(typeof sheet.__activateTab === 'function'){
        sheet.__activateTab(focusSection);
      }
    }
    function closeSheet(){
      sheet.classList.remove('open');
      document.body.classList.remove('sb-sheet-open');
    }

    fields.forEach(f => {
      f.addEventListener('click', (e) => {
        e.stopPropagation();
        if(isCompact()){
          openSheet(f.dataset.pop);
        } else {
          if(f.classList.contains('open')) closeInline();
          else openInline(f.dataset.pop, f);
        }
      });
    });
    // CTA → open sheet (compact) or just trigger search (desktop)
    const cta = bar.querySelector('.sb-cta');
    if(cta){
      cta.addEventListener('click', e => {
        e.stopPropagation();
        if(isCompact()) openSheet('loc');
        else closeInline();
      });
    }

    if(backdrop) backdrop.addEventListener('click', closeInline);
    document.addEventListener('keydown', e => { if(e.key === 'Escape'){ closeInline(); closeSheet(); } });
    window.addEventListener('resize', () => {
      if(isCompact()) closeInline();
      else closeSheet();
    });

    // ── Inline dropdown content wiring ──
    // Loc: click item → set + close
    shell.querySelectorAll('.sb-pop.loc .loc-item').forEach(b => {
      b.addEventListener('click', () => {
        state.loc = b.dataset.loc; state.notify();
        closeInline();
      });
    });
    // Dates pills
    const inlinePills = [...shell.querySelectorAll('.sb-pop.dates .cal-pill')];
    inlinePills.forEach(p => p.addEventListener('click', () => {
      state.flex = p.textContent.trim(); state.notify();
    }));
    // Tabs
    shell.querySelectorAll('.sb-pop.dates .cal-tab').forEach(t => {
      t.addEventListener('click', () => {
        shell.querySelectorAll('.sb-pop.dates .cal-tab').forEach(x => x.classList.remove('on'));
        t.classList.add('on');
      });
    });
    // Spec
    shell.querySelectorAll('.sb-pop.spec .spec-card').forEach(c => {
      c.addEventListener('click', () => {
        const v = c.dataset.spec;
        if(state.spec.has(v)) state.spec.delete(v); else state.spec.add(v);
        state.notify();
      });
    });
    shell.querySelector('.sb-pop.spec .spec-clear')?.addEventListener('click', () => {
      state.spec.clear(); state.notify();
    });

    // Build inline calendar
    const inlineCalGrid = shell.querySelector('.sb-pop.dates [data-cal-grid]');
    if(inlineCalGrid) buildCalendar(inlineCalGrid, { months: 2 });

    // ── Sync inline UI to state ──
    function syncShell(){
      const inputs = {
        loc:   bar.querySelector('.sb-field[data-pop="loc"] input'),
        dates: bar.querySelector('.sb-field[data-pop="dates"] input'),
        spec:  bar.querySelector('.sb-field[data-pop="spec"] input')
      };
      if(inputs.loc)   inputs.loc.value   = state.loc;
      if(inputs.dates) inputs.dates.value = fmtRange();
      if(inputs.spec)  inputs.spec.value  = fmtSpec();
      // Inline spec cards
      shell.querySelectorAll('.sb-pop.spec .spec-card').forEach(c => c.classList.toggle('on', state.spec.has(c.dataset.spec)));
      const c = shell.querySelector('.sb-pop.spec [data-spec-count]'); if(c) c.textContent = state.spec.size;
      // Inline pills
      shell.querySelectorAll('.sb-pop.dates .cal-pill').forEach(p => p.classList.toggle('on', p.textContent.trim() === state.flex));
    }
    state.subscribe(syncShell);
    syncShell();
  }

  /* ── Wire bottom-sheet (only once globally) ── */
  let sheetWired = false;
  function wireSheet(){
    if(sheetWired) return;
    const sheet = ensureSheet();
    if(!sheet) return;
    sheetWired = true;

    // Tab switching → activates matching pane
    function activateTab(name){
      sheet.querySelectorAll('.sb-tab').forEach(t => t.classList.toggle('on', t.dataset.section === name));
      sheet.querySelectorAll('.sb-pane').forEach(p => p.classList.toggle('on', p.dataset.pane === name));
    }
    sheet.querySelectorAll('.sb-tab').forEach(t => {
      t.addEventListener('click', () => activateTab(t.dataset.section));
    });
    // Expose for openSheet to focus a tab
    sheet.__activateTab = activateTab;

    // Close handlers
    sheet.querySelectorAll('[data-sheet-close]').forEach(el => el.addEventListener('click', () => {
      sheet.classList.remove('open');
      document.body.classList.remove('sb-sheet-open');
    }));

    // Loc items → set + advance to "dates" tab
    sheet.querySelectorAll('.sb-pane[data-pane="loc"] .loc-item').forEach(b => {
      b.addEventListener('click', () => {
        state.loc = b.dataset.loc; state.notify();
        activateTab('dates');
      });
    });
    // Spec cards
    sheet.querySelectorAll('.sb-pane[data-pane="spec"] .spec-card').forEach(c => {
      c.addEventListener('click', () => {
        const v = c.dataset.spec;
        if(state.spec.has(v)) state.spec.delete(v); else state.spec.add(v);
        state.notify();
      });
    });
    sheet.querySelector('.sb-pane[data-pane="spec"] .spec-clear')?.addEventListener('click', () => { state.spec.clear(); state.notify(); });
    // Date pills
    sheet.querySelectorAll('.sb-pane[data-pane="dates"] .cal-pill').forEach(p => p.addEventListener('click', () => {
      state.flex = p.textContent.trim(); state.notify();
    }));
    // Date tabs
    sheet.querySelectorAll('.sb-pane[data-pane="dates"] .cal-tab').forEach(t => {
      t.addEventListener('click', () => {
        sheet.querySelectorAll('.sb-pane[data-pane="dates"] .cal-tab').forEach(x => x.classList.remove('on'));
        t.classList.add('on');
      });
    });
    // Calendar
    const sheetCalGrid = sheet.querySelector('.sb-pane[data-pane="dates"] [data-cal-grid]');
    if(sheetCalGrid) buildCalendar(sheetCalGrid, { months: 2 });

    // Clear all
    sheet.querySelector('.sb-sheet-clear')?.addEventListener('click', () => {
      state.loc = '';
      state.rangeStart = null; state.rangeEnd = null;
      state.spec.clear();
      state.flex = 'Dates exactes';
      state.notify();
    });
    // Submit → close
    sheet.querySelector('[data-sheet-submit]')?.addEventListener('click', () => {
      sheet.classList.remove('open');
      document.body.classList.remove('sb-sheet-open');
    });

    // Sync sheet UI to state
    function syncSheet(){
      const lv = sheet.querySelector('[data-val="loc"]');
      const dv = sheet.querySelector('[data-val="dates"]');
      const sv = sheet.querySelector('[data-val="spec"]');
      if(lv){ lv.textContent = state.loc || 'Ville, code postal'; lv.classList.toggle('placeholder', !state.loc); }
      if(dv){ const v = fmtRange(); dv.textContent = v || 'Ajouter dates'; dv.classList.toggle('placeholder', !v); }
      if(sv){ const v = fmtSpec(); sv.textContent = v || 'Toutes'; sv.classList.toggle('placeholder', !v); }
      sheet.querySelectorAll('.sb-pane[data-pane="spec"] .spec-card').forEach(c => c.classList.toggle('on', state.spec.has(c.dataset.spec)));
      const c = sheet.querySelector('.sb-pane[data-pane="spec"] [data-spec-count]'); if(c) c.textContent = state.spec.size;
      sheet.querySelectorAll('.sb-pane[data-pane="dates"] .cal-pill').forEach(p => p.classList.toggle('on', p.textContent.trim() === state.flex));
    }
    state.subscribe(syncSheet);
    syncSheet();
  }

  /* ── Auto-init ── */
  function init(){
    document.querySelectorAll('.search-shell').forEach(initShell);
    // Also handle bare .search-bar without a .search-shell wrapper
    document.querySelectorAll('.search-bar').forEach(bar => {
      if(bar.closest('.search-shell')) return;
      const shell = document.createElement('div');
      shell.className = 'search-shell';
      bar.parentNode.insertBefore(shell, bar);
      shell.appendChild(bar);
      initShell(shell);
    });
    wireSheet();
  }
  // Expose for frameworks that mount .search-shell after DOMContentLoaded (e.g. React)
  window.initJimSearch = init;
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
