// ui_kits/mobile/screens.jsx — JIM mobile screens (Welcome, Dashboard titulaire, Recherche)

// ─── Design tokens (mirror of @jim/ui NativeWind) ───
const T = {
  bg: '#fdf6ed',
  surface: '#fbf0e8',
  surfaceAlt: '#f7ede0',
  text: '#3a1f08',
  textBody: '#6b4a32',
  muted: '#a8937e',
  beigeMid: '#edd9c4',
  beigeLight: '#f2e5d5',
  beigeDark: '#c9b59a',
  primary: '#ff7c5c',
  primaryPale: '#fff0ea',
  primarySoft: '#ffc5b3',
  accent: '#e06245',
  accentWarm: '#f5b86a',
  border: '#edd9c4',
  success: '#5a8a5f',
  warning: '#c48a2e',
  danger: '#c44d3a',
};

// ────────────────────────────────────────────────────────
// Shared building blocks
// ────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      padding: 16,
      border: `1px solid ${T.border}`,
      boxShadow: '0 1px 2px rgba(58,31,8,0.04), 0 4px 12px rgba(58,31,8,0.06)',
      ...style,
    }}>{children}</div>
  );
}

function Pill({ children, tone = 'primary', size = 'sm' }) {
  const palette = {
    primary: { bg: T.primaryPale, fg: T.primary },
    warm: { bg: '#fff4e0', fg: T.warning },
    success: { bg: '#e8f0e5', fg: T.success },
    muted: { bg: T.surfaceAlt, fg: T.textBody },
    solid: { bg: T.primary, fg: '#fff' },
    dark: { bg: T.text, fg: '#fff' },
  }[tone];
  const pad = size === 'xs' ? '2px 7px' : '4px 10px';
  const fs = size === 'xs' ? 9 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: palette.bg, color: palette.fg,
      padding: pad, borderRadius: 999,
      fontSize: fs, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: 0.06,
    }}>{children}</span>
  );
}

// "SVG icons" — simple inline, all stroke 1.75
const Ico = {
  search: (c='currentColor', s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.75"/><path d="M20 20l-3-3" stroke={c} strokeWidth="1.75" strokeLinecap="round"/></svg>,
  mapPin: (c='currentColor', s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" stroke={c} strokeWidth="1.75"/><circle cx="12" cy="10" r="3" stroke={c} strokeWidth="1.75"/></svg>,
  calendar: (c='currentColor', s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke={c} strokeWidth="1.75"/><path d="M3 10h18M8 3v4M16 3v4" stroke={c} strokeWidth="1.75" strokeLinecap="round"/></svg>,
  filter: (c='currentColor', s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 6h18M6 12h12M10 18h4" stroke={c} strokeWidth="1.75" strokeLinecap="round"/></svg>,
  plus: (c='currentColor', s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  bell: (c='currentColor', s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 1112 0v5l2 3H4l2-3V8z" stroke={c} strokeWidth="1.75" strokeLinejoin="round"/><path d="M10 19a2 2 0 004 0" stroke={c} strokeWidth="1.75"/></svg>,
  home: (c='currentColor', s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z" stroke={c} strokeWidth="1.75" strokeLinejoin="round"/></svg>,
  msg: (c='currentColor', s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4v-15z" stroke={c} strokeWidth="1.75" strokeLinejoin="round"/></svg>,
  profile: (c='currentColor', s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.75"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={c} strokeWidth="1.75" strokeLinecap="round"/></svg>,
  heart: (c='currentColor', s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke={c} strokeWidth="1.75" strokeLinejoin="round"/></svg>,
  check: (c='currentColor', s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  zap: (c='currentColor', s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
  sparkles: (c='currentColor', s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill={c}/></svg>,
};

// ────────────────────────────────────────────────────────
// 1. WELCOME SCREEN — light beige bg, real jim logo
// ────────────────────────────────────────────────────────
function WelcomeScreen() {
  return (
    <div style={{
      flex: 1, background: T.bg, color: T.text,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '110px 24px 40px',
      height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        {/* Real jim logo */}
        <img
          src="../../assets/logo-jim.svg"
          alt="JIM — Job In Med"
          style={{ width: 200, height: 'auto', display: 'block' }}
        />
        <div style={{ textAlign: 'center', maxWidth: 280 }}>
          <div style={{ color: T.textBody, fontSize: 16, lineHeight: 1.55, fontWeight: 500 }}>
            Le réseau des kinésithérapeutes remplaçants et titulaires
          </div>
        </div>
        {/* trust badge */}
        <div style={{
          background: '#fff', border: `1px solid ${T.border}`,
          borderRadius: 999, padding: '8px 16px',
          fontSize: 13, color: T.textBody, fontWeight: 500,
          boxShadow: '0 1px 2px rgba(58,31,8,0.04)',
        }}>Vérifié RPPS · Contrat IA · 0 % commission</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button style={{
          height: 56, background: T.primary, color: '#fff', border: 0,
          borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(255,124,92,0.3)',
        }}>Créer un compte</button>
        <button style={{
          height: 56, background: '#fff',
          border: `1px solid ${T.border}`, color: T.text,
          borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer',
        }}>Se connecter</button>
        <div style={{ textAlign: 'center', color: T.muted, fontSize: 12, marginTop: 4 }}>
          Réservé aux professionnels de santé vérifiés RPPS
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Bottom tab bar — shared
// ────────────────────────────────────────────────────────
function TabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home', label: 'Accueil', ico: Ico.home },
    { id: 'search', label: 'Rechercher', ico: Ico.search },
    { id: 'msg', label: 'Messages', ico: Ico.msg, badge: 3 },
    { id: 'fav', label: 'Favoris', ico: Ico.heart },
    { id: 'me', label: 'Profil', ico: Ico.profile },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(253,246,237,0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `0.5px solid ${T.border}`,
      padding: '8px 4px 34px',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        const c = isActive ? T.primary : T.muted;
        return (
          <div key={t.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, color: c, minWidth: 60, position: 'relative',
          }}>
            {t.ico(c, 24)}
            <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
            {t.badge && (
              <span style={{
                position: 'absolute', top: -2, right: 10,
                background: T.primary, color: '#fff',
                minWidth: 16, height: 16, borderRadius: 8,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>{t.badge}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 2. DASHBOARD TITULAIRE
// ────────────────────────────────────────────────────────
function DashboardScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      {/* Header */}
      <div style={{
        background: T.surface, borderBottom: `1px solid ${T.border}`,
        padding: '62px 24px 18px',
      }}>
        <div style={{ color: T.muted, fontSize: 13 }}>Bonjour 👋</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: -0.03, marginTop: 2 }}>
          Tableau de bord
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.1, fontWeight: 700 }}>Actives</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: -0.03, marginTop: 4 }}>3</div>
            <div style={{ fontSize: 11, color: T.success, marginTop: 2, fontWeight: 600 }}>↑ 2 cette semaine</div>
          </Card>
          <Card style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.1, fontWeight: 700 }}>En cours</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: -0.03, marginTop: 4 }}>1</div>
            <div style={{ fontSize: 11, color: T.textBody, marginTop: 2 }}>Cabinet Moreau</div>
          </Card>
        </div>

        {/* Candidatures reçues */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: -0.02 }}>
              Candidatures reçues
              <span style={{
                marginLeft: 8, background: T.primary, color: '#fff',
                padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              }}>5</span>
            </div>
            <span style={{ fontSize: 12, color: T.primary, fontWeight: 600 }}>Tout voir</span>
          </div>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { name: 'Claire Dubois', city: 'Paris 11e', time: 'Il y a 2h', pill: 'Nouveau' },
              { name: 'Louis Mercier', city: 'Lyon 6e', time: 'Il y a 4h', pill: null },
              { name: 'Sarah Ben Ali', city: 'Marseille', time: 'Hier', pill: null },
            ].map((c, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderBottom: i < arr.length-1 ? `0.5px solid ${T.beigeLight}` : 0,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 20,
                  background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 14,
                }}>{c.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{c.name}</div>
                    {c.pill && <Pill tone="primary" size="xs">{c.pill}</Pill>}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>
                    pour {c.city} · {c.time}
                  </div>
                </div>
                <div style={{ color: T.beigeDark }}>›</div>
              </div>
            ))}
          </Card>
        </div>

        {/* Mes annonces */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: -0.02 }}>Mes annonces</div>
            <span style={{ fontSize: 12, color: T.primary, fontWeight: 600 }}>+ Publier</span>
          </div>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <Pill tone="primary" size="xs"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{Ico.zap('currentColor', 9)}Urgent</span></Pill>
                  <Pill tone="success" size="xs">Active</Pill>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -0.02 }}>
                  Remplacement 2 semaines
                </div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {Ico.mapPin(T.muted, 12)} Paris 11e · 12 – 26 mai · ortho
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: -0.02 }}>72<span style={{ fontSize: 13, color: T.muted }}>%</span></div>
                <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.08, fontWeight: 700 }}>rétro.</div>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${T.beigeLight}`, display: 'flex', gap: 16 }}>
              <div style={{ fontSize: 12, color: T.textBody }}><strong style={{ color: T.text }}>5</strong> candidatures</div>
              <div style={{ fontSize: 12, color: T.textBody }}><strong style={{ color: T.text }}>42</strong> vues</div>
            </div>
          </Card>
        </div>
      </div>

      {/* FAB — publier */}
      <div style={{
        position: 'absolute', right: 20, bottom: 96, zIndex: 5,
        width: 56, height: 56, borderRadius: 28,
        background: T.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(255,124,92,0.45)',
      }}>{Ico.plus('#fff', 26)}</div>

      <TabBar active="home" />
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 3. RECHERCHE — remplaçant listings
// ────────────────────────────────────────────────────────
function RechercheScreen() {
  const listings = [
    { city: 'Paris 11e', retro: 72, cab: 'Cabinet 4 kinés', dates: '12–26 mai', tags: ['ortho','neuro'], urgent: true, grad: 'linear-gradient(135deg,#ffc5b3,#ff9a80)' },
    { city: 'Lyon 6e', retro: 70, cab: 'Cabinet sport', dates: 'Dès lundi', tags: ['sport','respi'], urgent: true, grad: 'linear-gradient(135deg,#f5b86a,#e06245)' },
    { city: 'Marseille', retro: 75, cab: 'Cabinet 2 kinés', dates: 'Juillet', tags: ['ortho'], urgent: false, grad: 'linear-gradient(135deg,#fff0ea,#ffc5b3)' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
      {/* Header + search */}
      <div style={{ padding: '62px 16px 12px', background: T.surface, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: -0.03, marginBottom: 12 }}>
          Rechercher
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', borderRadius: 14, padding: '12px 14px',
          border: `1px solid ${T.border}`,
          boxShadow: '0 1px 2px rgba(58,31,8,0.04)',
        }}>
          {Ico.search(T.muted, 18)}
          <span style={{ flex: 1, color: T.beigeDark, fontSize: 14 }}>Ville, spécialité…</span>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: T.primaryPale,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Ico.filter(T.primary, 16)}</div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto' }}>
          {['Toutes','Urgentes','Près de moi','Nouveau','Favoris'].map((c,i)=>(
            <div key={c} style={{
              padding: '8px 14px', borderRadius: 999,
              background: i===0 ? '#fff' : 'transparent',
              border: i===0 ? `1px solid ${T.border}` : '1px solid transparent',
              color: i===0 ? T.primary : T.muted,
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.06,
              flexShrink: 0,
              boxShadow: i===0 ? '0 1px 2px rgba(58,31,8,0.04)' : 'none',
            }}>{c}</div>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ padding: '14px 20px 6px', fontSize: 13, color: T.textBody }}>
        <strong style={{ color: T.text }}>127 annonces</strong> à moins de 30 km
      </div>

      {/* Listings */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {listings.map((l, i) => (
          <Card key={i} style={{ padding: 12 }}>
            <div style={{
              height: 120, borderRadius: 12, marginBottom: 12,
              background: l.grad, position: 'relative', overflow: 'hidden',
            }}>
              {l.urgent && (
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <Pill tone="solid" size="xs"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{Ico.zap('#fff', 10)}Urgent</span></Pill>
                </div>
              )}
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <div style={{
                  background: 'rgba(255,255,255,0.95)', padding: '3px 10px', borderRadius: 999,
                  fontSize: 11, fontWeight: 600, color: T.text,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}>{Ico.check(T.success, 11)} RPPS</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: -0.02 }}>{l.city}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: -0.02 }}>
                {l.retro}<span style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}>% retro.</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
              {Ico.mapPin(T.muted, 13)} {l.cab} · {l.dates}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {l.tags.map(t => <Pill key={t} tone="primary" size="xs">{t}</Pill>)}
            </div>
          </Card>
        ))}
      </div>

      <TabBar active="search" />
    </div>
  );
}

Object.assign(window, { WelcomeScreen, DashboardScreen, RechercheScreen });
