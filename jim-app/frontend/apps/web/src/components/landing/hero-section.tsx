import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from './fade-in';

// Section hero — composition editoriale asymetrique.
// Concept : incarner la marketplace a 2 faces (remplacant <-> titulaire)
// via un split left (promesse) / right (activite live), ancre par une typo
// serif en italique sur le mot pivot.
export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-24">
      {/* Couche 1 — blobs organiques corail */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 w-[720px] h-[720px] rounded-full blur-3xl opacity-70"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,124,92,0.18) 0%, rgba(255,154,128,0.08) 40%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(circle at 60% 40%, rgba(245,184,106,0.20) 0%, rgba(253,246,237,0) 70%)',
        }}
      />

      {/* Couche 2 — grille de points tres subtile (signal "clinique mesure") */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(58,31,8,1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Couche 3 — grain fin (texture papier) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='0.8'/></svg>\")",
        }}
      />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-6 md:px-10">
        {/* Etiquette haut de page — compteur live */}
        <FadeIn>
          <div className="inline-flex items-center gap-3 mb-10 md:mb-14">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-jim-primary opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-jim-primary" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-jim-muted">
              2 847 remplacements <span className="text-jim-text">en cours</span> — mise a jour temps reel
            </span>
          </div>
        </FadeIn>

        {/* Composition asymetrique : 7 colonnes texte / 5 colonnes visuel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Colonne texte */}
          <div className="lg:col-span-7">
            <FadeIn delay={1}>
              <h1 className="font-extrabold leading-[0.95] tracking-[-0.045em] text-jim-text mb-8 text-[clamp(44px,7vw,96px)]">
                Le cabinet
                <br />
                <span className="font-serif italic font-normal text-jim-primary">
                  ne s&apos;arrete
                </span>
                <br />
                pas quand vous partez.
              </h1>
            </FadeIn>

            <FadeIn delay={2}>
              <p className="max-w-[520px] text-[17px] md:text-[19px] leading-[1.55] text-jim-text-body mb-10">
                JIM met en relation <strong className="font-semibold text-jim-text">titulaires</strong> et{' '}
                <strong className="font-semibold text-jim-text">remplacants kine</strong> verifies RPPS.
                Contrat, paiement, suivi — en une conversation.
              </p>
            </FadeIn>

            <FadeIn delay={3}>
              {/* Double CTA — action principale + secondaire */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#kanban"
                  className="group inline-flex items-center gap-2 px-6 py-4 rounded-full bg-jim-text text-white font-bold text-[15px] hover:bg-jim-primary transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/40"
                >
                  Explorer les missions
                  <ArrowUpRight
                    size={17}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </a>
                <a
                  href="/publier"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white border border-jim-border text-jim-text font-bold text-[15px] hover:border-jim-primary hover:text-jim-primary transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/30"
                >
                  Publier une annonce
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={4}>
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-9 text-[13px]">
                <TrustItem>Verifie RPPS</TrustItem>
                <TrustItem>Contrat integre</TrustItem>
                <TrustItem>Paiement sequestre</TrustItem>
                <TrustItem>100% gratuit au lancement</TrustItem>
              </ul>
            </FadeIn>
          </div>

          {/* Colonne visuel — "fiche patient" stylisee (teaser kanban) */}
          <div className="lg:col-span-5 relative">
            <FadeIn delay={3}>
              <PatientCardTeaser />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

// Teaser visuel — carte "activite live" mimant le kanban.
// Rotation subtile pour casser la grille, annotation manuscrite en haut.
function PatientCardTeaser() {
  return (
    <div className="relative lg:-mr-4 xl:mr-0">
      {/* Annotation manuscrite */}
      <div className="absolute -top-6 left-4 md:left-10 lg:left-0 z-10 rotate-[-4deg]">
        <span className="inline-block px-3 py-1 rounded-full bg-jim-text text-white text-[11px] font-medium tracking-wide">
          Hier, 18h42 — Dr Moreau a trouve en 3 messages
        </span>
      </div>

      <div className="relative rounded-[28px] bg-white border border-jim-beige-mid shadow-[0_24px_60px_-20px_rgba(58,31,8,0.25)] overflow-hidden rotate-[1.5deg] lg:rotate-[2deg]">
        {/* Header de carte */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-jim-beige-light">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-jim-primary to-jim-accent flex items-center justify-center text-white font-bold text-sm">
              SM
            </div>
            <div>
              <p className="text-[13px] font-semibold text-jim-text leading-tight">
                Cabinet Moreau-Salva
              </p>
              <p className="text-[11px] text-jim-muted leading-tight">Lyon 6e · 4 kines</p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-jim-primary">
            Urgent
          </span>
        </div>

        {/* Body — timeline 3 messages */}
        <div className="px-6 py-5 space-y-4">
          <TimelineRow
            time="18:32"
            role="titulaire"
            message="2 semaines en ortho, du 12 au 26 mai ?"
          />
          <TimelineRow
            time="18:39"
            role="remplacant"
            message="Dispo, RPPS verifie. On signe ?"
          />
          <TimelineRow
            time="18:42"
            role="titulaire"
            message="Parfait, contrat envoye."
            isLast
          />
        </div>

        {/* Footer — stats */}
        <div className="grid grid-cols-3 divide-x divide-jim-beige-light border-t border-jim-beige-light">
          <Stat number="68%" label="retrocession" />
          <Stat number="3min" label="matching" />
          <Stat number="0€" label="commission" />
        </div>
      </div>

      {/* Ombre fantome — 2e carte en fond */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[28px] bg-jim-primary-pale -z-10 translate-x-4 translate-y-4 rotate-[-2deg]"
      />
    </div>
  );
}

function TimelineRow({
  time,
  role,
  message,
  isLast,
}: {
  time: string;
  role: 'titulaire' | 'remplacant';
  message: string;
  isLast?: boolean;
}) {
  const isTitulaire = role === 'titulaire';
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <span
          className={`h-2 w-2 rounded-full ${
            isTitulaire ? 'bg-jim-primary' : 'bg-jim-accent-warm'
          }`}
        />
        {!isLast && <span className="w-px flex-1 bg-jim-beige-mid mt-1 min-h-[20px]" />}
      </div>
      <div className="flex-1 -mt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-[10px] uppercase tracking-[0.12em] font-bold ${
              isTitulaire ? 'text-jim-primary' : 'text-jim-accent'
            }`}
          >
            {isTitulaire ? 'Titulaire' : 'Remplacant'}
          </span>
          <span className="text-[10px] text-jim-muted">{time}</span>
        </div>
        <p className="text-[13px] text-jim-text leading-snug">{message}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center py-3.5">
      <p className="text-xl font-extrabold text-jim-text tracking-tight">{number}</p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-jim-muted mt-0.5">
        {label}
      </p>
    </div>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-jim-text-body font-medium">
      {/* Tick "coche chirurgicale" — trait fin, pas de pastille */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
        className="text-jim-primary flex-shrink-0"
      >
        <path
          d="M2 7.5L5.5 11L12 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </li>
  );
}
