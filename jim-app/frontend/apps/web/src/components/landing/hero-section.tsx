import { ShieldCheck, MessageCircle } from 'lucide-react';
import { FadeIn } from './fade-in';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-16 pb-0">
      {/* Blob ambiant corail */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 -right-24 w-[720px] h-[720px] rounded-full blur-[80px] opacity-70"
        style={{ background: 'radial-gradient(circle at 30% 30%,rgba(255,124,92,.18),rgba(255,154,128,.08) 40%,transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-36 -left-40 w-[600px] h-[600px] rounded-full blur-[80px] opacity-60"
        style={{ background: 'radial-gradient(circle at 60% 40%,rgba(245,184,106,.20),rgba(253,246,237,0) 70%)' }}
      />
      {/* Grille de points */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 h-[1100px] opacity-[.06]"
        style={{ backgroundImage: 'radial-gradient(circle,rgba(58,31,8,1) 1px,transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-6 md:px-10">
        {/* Live badge */}
        <FadeIn>
          <div className="inline-flex items-center gap-3 mb-10">
            <span className="relative flex h-2 w-2 motion-safe:flex motion-reduce:hidden">
              <span className="absolute inline-flex h-full w-full rounded-full bg-jim-primary opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-jim-primary" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.20em] text-jim-muted">
              2 847 remplacements <strong className="text-jim-text font-bold">en cours</strong> — mise à jour temps réel
            </span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Colonne texte */}
          <div>
            <FadeIn delay={1}>
              <h1 className="font-extrabold leading-[.95] tracking-[-0.045em] text-jim-text mb-6 text-[clamp(44px,6.2vw,84px)]">
                Votre cabinet
                <br />
                <em className="not-italic font-extrabold text-jim-primary">tourne,</em>
                <br />
                Même sans vous.
              </h1>
            </FadeIn>

            <FadeIn delay={2}>
              <p className="max-w-[520px] text-[18px] leading-[1.55] text-jim-text-body mb-7">
                JIM met en relation les <strong className="font-semibold text-jim-text">professionnels de santé libéraux</strong> vérifiés RPPS. Contrat, paiement, suivi — en une conversation.
              </p>
            </FadeIn>

            <FadeIn delay={3}>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 list-none p-0 m-0">
                <TrustItem>Vérifié RPPS</TrustItem>
                <TrustItem>Contrat intégré</TrustItem>
                <TrustItem>Paiement séquestre</TrustItem>
                <TrustItem>100 % gratuit au lancement</TrustItem>
              </ul>
            </FadeIn>
          </div>

          {/* Colonne visuelle */}
          <FadeIn delay={2}>
            <HeroVisual />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative w-full max-w-[520px] lg:justify-self-end" style={{ aspectRatio: '5/6' }}>
      {/* Blob organique corail */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <svg viewBox="0 0 500 600" preserveAspectRatio="none" className="w-full h-full block overflow-visible">
          <defs>
            <linearGradient id="hvBlobGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff7c5c" stopOpacity=".95" />
              <stop offset="1" stopColor="#f5b86a" stopOpacity=".75" />
            </linearGradient>
          </defs>
          <path
            d="M250,40 C360,30 460,110 470,230 C480,350 430,470 320,530 C210,590 80,540 40,420 C0,300 40,170 130,90 C170,55 215,42 250,40 Z"
            fill="url(#hvBlobGrad)"
          />
        </svg>
      </div>

      {/* Photo placeholder — forme organique */}
      <div
        className="absolute z-[1] overflow-hidden -rotate-2"
        style={{
          inset: '6% 4% 4% 8%',
          borderRadius: '48% 52% 44% 56% / 60% 44% 56% 40%',
          boxShadow: '0 30px 60px -20px rgba(58,31,8,.28), 0 8px 20px -8px rgba(58,31,8,.15)',
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-jim-beige-light via-jim-beige-mid to-jim-beige-dark flex items-center justify-center">
          <div className="text-center opacity-40">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-jim-muted">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p className="text-[11px] font-medium text-jim-muted mt-2 uppercase tracking-wider">Photo kiné</p>
          </div>
        </div>
      </div>

      {/* Carte flottante 1 — RPPS vérifié */}
      <div
        className="animate-hv-1 absolute z-[2] bg-white rounded-2xl p-3 flex items-center gap-2.5 border border-[rgba(58,31,8,0.04)]"
        style={{
          top: '8%', right: '-4%',
          boxShadow: '0 12px 30px -10px rgba(58,31,8,.22), 0 2px 6px rgba(58,31,8,.08)',
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-jim-success-bg text-jim-success flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={18} strokeWidth={2} />
        </div>
        <div className="flex flex-col leading-[1.15]">
          <span className="text-[13px] font-bold text-jim-text whitespace-nowrap">RPPS vérifié</span>
          <span className="text-[10px] font-semibold text-jim-muted uppercase tracking-[0.12em] mt-0.5">en 24 h</span>
        </div>
      </div>

      {/* Carte flottante 2 — Matching */}
      <div
        className="animate-hv-2 absolute z-[2] bg-white rounded-2xl p-3 flex items-center gap-2.5 border border-[rgba(58,31,8,0.04)]"
        style={{
          bottom: '18%', left: '-8%',
          boxShadow: '0 12px 30px -10px rgba(58,31,8,.22), 0 2px 6px rgba(58,31,8,.08)',
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-jim-primary-pale text-jim-primary flex items-center justify-center flex-shrink-0">
          <MessageCircle size={18} strokeWidth={2} />
        </div>
        <div className="flex flex-col leading-[1.15]">
          <span className="text-[13px] font-bold text-jim-text whitespace-nowrap">3 messages → trouvé</span>
          <span className="text-[10px] font-semibold text-jim-muted uppercase tracking-[0.12em] mt-0.5">Mr Moreau · hier 18h42</span>
        </div>
      </div>

      {/* Pill stats en bas */}
      <div
        className="animate-hv-3 absolute z-[2] bg-jim-text rounded-[18px] px-4 py-3.5 flex items-center gap-3"
        style={{
          bottom: '-2%', right: '2%',
          boxShadow: '0 16px 40px -12px rgba(58,31,8,.35)',
        }}
      >
        {/* Avatars empilés */}
        <div className="flex">
          {(['AM', 'JD', 'LR'] as const).map((init, i) => (
            <span
              key={init}
              className="w-[26px] h-[26px] rounded-full border-2 border-jim-text flex items-center justify-center text-[10px] font-bold text-white"
              style={{
                marginLeft: i === 0 ? 0 : -8,
                background: i === 0
                  ? 'linear-gradient(135deg,#f5b86a,#ff7c5c)'
                  : i === 1
                  ? 'linear-gradient(135deg,#ff7c5c,#e06245)'
                  : 'linear-gradient(135deg,#e06245,#a85a35)',
              }}
            >
              {init}
            </span>
          ))}
        </div>
        <div className="text-[11px] leading-[1.2] font-medium text-white/85">
          <strong className="block text-white font-extrabold text-[13px] tracking-[-0.01em]">2 847 kinés</strong>
          actifs cette semaine
        </div>
      </div>
    </div>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-[13px] font-medium text-jim-text-body">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-jim-primary flex-shrink-0">
        <path d="M2 7.5L5.5 11L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </li>
  );
}
