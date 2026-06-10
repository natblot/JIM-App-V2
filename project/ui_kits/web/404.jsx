// JIM — Page 404 · Erreur "page introuvable"
// Câble débranché + étincelles · entrée en fondu
// Expose : window.Page404({ href })

(function () {

  if (typeof document !== 'undefined' && !document.getElementById('page-404-styles')) {
    const s = document.createElement('style');
    s.id = 'page-404-styles';
    s.textContent = `
      .p404-root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: var(--jim-background, #fdf6ed);
        font-family: var(--font-sans, 'Manrope', system-ui, sans-serif);
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
      }
      .p404-root *, .p404-root *::before, .p404-root *::after {
        box-sizing: border-box;
      }

      /* ── Decorative blobs ── */
      .p404-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
        z-index: 0;
      }
      .p404-blob-tl {
        top: -12%;
        left: -10%;
        width: 38%;
        height: 38%;
        background: radial-gradient(circle, rgba(255,124,92,0.18), transparent 70%);
      }
      .p404-blob-br {
        bottom: -15%;
        right: -8%;
        width: 42%;
        height: 42%;
        background: radial-gradient(circle, rgba(245,184,106,0.16), transparent 70%);
      }
      .p404-blob-bl {
        bottom: -10%;
        left: -6%;
        width: 28%;
        height: 28%;
        background: radial-gradient(circle, rgba(255,124,92,0.10), transparent 70%);
      }

      /* ── Dot grid ── */
      .p404-dots {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        opacity: 0.06;
        background-image: radial-gradient(circle, rgba(58,31,8,1) 1px, transparent 1px);
        background-size: 28px 28px;
      }

      /* ── Grain ── */
      .p404-grain {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 5;
        opacity: 0.035;
        mix-blend-mode: multiply;
        width: 100%;
        height: 100%;
      }

      /* ── Central content ── */
      .p404-stage {
        position: relative;
        z-index: 2;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0 24px 10%;
      }

      .p404-code {
        font-weight: 800;
        font-size: clamp(5rem, 18vw, 13.5rem);
        line-height: 0.9;
        letter-spacing: -0.05em;
        color: var(--jim-text, #3a1f08);
        margin: 0;
        font-family: var(--font-sans, 'Manrope', system-ui, sans-serif);
      }
      .p404-code .p404-zero {
        color: var(--jim-primary, #ff7c5c);
      }

      .p404-headline {
        margin-top: 20px;
        font-size: clamp(1.125rem, 2.6vw, 1.875rem);
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--jim-text, #3a1f08);
        font-family: var(--font-sans, 'Manrope', system-ui, sans-serif);
      }
      .p404-headline em {
        font-style: normal;
        font-weight: 800;
        color: var(--jim-primary, #ff7c5c);
      }

      .p404-sub {
        margin-top: 14px;
        max-width: 480px;
        font-size: 1rem;
        line-height: 1.55;
        color: var(--jim-muted, #7a5434);
        font-family: var(--font-sans, 'Manrope', system-ui, sans-serif);
      }

      .p404-cta {
        margin-top: 32px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-height: 48px;
        padding: 0 28px;
        background: var(--jim-primary, #ff7c5c);
        color: #fff;
        font-family: var(--font-sans, 'Manrope', system-ui, sans-serif);
        font-size: 1rem;
        font-weight: 700;
        border: none;
        border-radius: 9999px;
        box-shadow: 0 6px 22px rgba(232,132,74,0.40);
        cursor: pointer;
        text-decoration: none;
        transition:
          background 200ms ease,
          transform 150ms ease,
          box-shadow 200ms ease;
      }
      .p404-cta:hover {
        background: var(--jim-accent, #e06245);
        color: #fff;
        transform: translateY(-1px);
        box-shadow: 0 8px 28px rgba(232,132,74,0.45);
      }
      .p404-cta:active {
        transform: scale(0.98);
      }
      .p404-cta:focus-visible {
        outline: none;
        box-shadow: 0 0 0 4px rgba(255,124,92,0.4);
      }
      .p404-cta svg { flex: none; }

      /* ── Disconnected cable ── */
      .p404-cable {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 4%;
        z-index: 1;
        width: 100%;
        height: auto;
        pointer-events: none;
      }

      /* ── Entrance animations ── */
      @media (prefers-reduced-motion: no-preference) {
        .p404-fade-up {
          animation: p404FadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .p404-d1 { animation-delay: 0.05s; }
        .p404-d2 { animation-delay: 0.15s; }
        .p404-d3 { animation-delay: 0.25s; }
        .p404-d4 { animation-delay: 0.35s; }

        @keyframes p404FadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Cable: plugged → tension → snappy disconnect → settle */
        .p404-half-l { animation: p404UnplugL 2.6s ease-out both; }
        .p404-half-r { animation: p404UnplugR 2.6s ease-out both; }

        @keyframes p404UnplugL {
          0%,  36% { transform: translate(78px, 0); }
          46%      { transform: translate(71px, 0); animation-timing-function: cubic-bezier(0.5,0,0.9,0.4); }
          58%      { transform: translate(-18px, 4px); animation-timing-function: cubic-bezier(0.34,1.56,0.64,1); }
          74%      { transform: translate(7px, -2px); }
          100%     { transform: translate(0, 0); }
        }
        @keyframes p404UnplugR {
          0%,  36% { transform: translate(-79px, 0); }
          46%      { transform: translate(-72px, 0); animation-timing-function: cubic-bezier(0.5,0,0.9,0.4); }
          58%      { transform: translate(18px, -4px); animation-timing-function: cubic-bezier(0.34,1.56,0.64,1); }
          74%      { transform: translate(-7px, 2px); }
          100%     { transform: translate(0, 0); }
        }

        /* Sparks: hidden while plugged, burst at disconnect, then pulse */
        .p404-spark {
          transform-box: fill-box;
          transform-origin: center;
          animation:
            p404SparkIntro 2.6s ease-out both,
            p404SparkPulse 2s ease-in-out 2.6s infinite;
        }
        .p404-spark.s2 {
          animation:
            p404SparkIntro 2.6s ease-out both,
            p404SparkPulse 2s ease-in-out 3.1s infinite;
        }
        .p404-spark.s3 {
          animation:
            p404SparkIntro 2.6s ease-out both,
            p404SparkPulse 2s ease-in-out 3.6s infinite;
        }
        @keyframes p404SparkIntro {
          0%,  54% { opacity: 0; transform: scale(0.2); }
          62%      { opacity: 1; transform: scale(1.45); }
          76%      { transform: scale(0.95); }
          100%     { opacity: 1; transform: scale(1); }
        }
        @keyframes p404SparkPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.25; transform: scale(0.85); }
        }
      }
    `;
    document.head.appendChild(s);
  }

  // ─────────────────────────────────────────────────────────────
  // Component
  // ─────────────────────────────────────────────────────────────
  function Page404({ href = 'index.html' }) {
    return (
      <div className="p404-root">

        {/* Decorative background */}
        <div className="p404-blob p404-blob-tl" />
        <div className="p404-blob p404-blob-br" />
        <div className="p404-blob p404-blob-bl" />
        <div className="p404-dots" />
        <svg className="p404-grain" aria-hidden="true">
          <filter id="p404-n">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#p404-n)" />
        </svg>

        {/* Central content */}
        <main className="p404-stage">
          <h1 className="p404-code p404-fade-up p404-d1" aria-label="Erreur 404">
            4<span className="p404-zero">0</span>4
          </h1>
          <div className="p404-headline p404-fade-up p404-d2">
            Cette page n'est pas encore <em>branchée</em>.
          </div>
          <p className="p404-sub p404-fade-up p404-d3">
            On s'en occupe. En attendant, le cabinet ne s'arrête pas&nbsp;— retournez à l'accueil pour retrouver vos missions.
          </p>
          <a className="p404-cta p404-fade-up p404-d4" href={href}>
            Retour à l'accueil
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
        </main>

        {/* Disconnected cable */}
        <svg className="p404-cable" viewBox="0 0 1440 260" fill="none" aria-hidden="true">

          {/* Left half: wire + male plug */}
          <g className="p404-half-l">
            <path
              d="M -220 150 C 140 100, 260 210, 400 175 C 480 157, 545 140, 598 140"
              stroke="#5a3418" strokeWidth="3" strokeLinecap="round"
            />
            <g transform="translate(598,140)">
              <rect x="0" y="-13" width="34" height="26" rx="9" fill="#ff7c5c" />
              <rect x="30" y="-10" width="10" height="20" rx="4" fill="#e06245" />
              <rect x="40" y="-7" width="13" height="4" rx="2" fill="#5a3418" />
              <rect x="40" y="3"  width="13" height="4" rx="2" fill="#5a3418" />
            </g>
          </g>

          {/* Right half: female socket + wire */}
          <g className="p404-half-r">
            <path
              d="M 1660 190 C 1280 130, 1150 105, 1010 130 C 945 141, 888 140, 838 140"
              stroke="#5a3418" strokeWidth="3" strokeLinecap="round"
            />
            <g transform="translate(838,140)">
              <rect x="-34" y="-14" width="34" height="28" rx="9" fill="#ff7c5c" />
              <rect x="-40" y="-11" width="9"  height="22" rx="4" fill="#e06245" />
              <circle cx="-36" cy="-5" r="1.8" fill="#3a1f08" />
              <circle cx="-36" cy="5"  r="1.8" fill="#3a1f08" />
            </g>
          </g>

          {/* Sparks */}
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path className="p404-spark"    d="M 668 100 l 7 -10 l -3 9 l 8 -2 l -10 11 l 2 -8 z" fill="#ff7c5c" stroke="none" />
            <path className="p404-spark s2" d="M 648 168 l -8 9 l 4 -8 l -9 3 l 11 -12 l -2 8 z" fill="#f5b86a" stroke="none" />
            <path className="p404-spark s3" d="M 782 96 l 8 -9 l -4 8 l 9 -3 l -11 12 l 2 -8 z"  fill="#f5b86a" stroke="none" />
            <path className="p404-spark"    d="M 768 165 l -7 10 l 3 -9 l -8 2 l 10 -11 l -2 8 z" fill="#ff7c5c" stroke="none" />
            <path className="p404-spark s2" d="M 718 128 a 3 3 0 1 1 -0.1 0" fill="#ffc5b3" stroke="none" />
          </g>
        </svg>

      </div>
    );
  }

  window.Page404 = Page404;

})();
