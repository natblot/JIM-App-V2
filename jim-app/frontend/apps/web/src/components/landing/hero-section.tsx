import { Search } from 'lucide-react';
import { FadeIn } from './fade-in';

// Section hero — badge, titre gradient, barre de recherche Airbnb, trust badges
export function HeroSection() {
  return (
    <section className="py-16 md:py-20 pb-20 relative overflow-hidden">
      {/* Cercles decoratifs en arriere-plan */}
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(232,132,74,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[150px] -left-[150px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,184,106,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-8 text-center">
        {/* Badge */}
        <FadeIn>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[20px] bg-jim-primary-pale text-jim-primary text-[13px] font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-jim-primary animate-pulse-dot" />
            2 847 remplacements trouves
          </div>
        </FadeIn>

        {/* Titre */}
        <FadeIn delay={1}>
          <h1 className="text-[clamp(36px,5.5vw,64px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-jim-text mb-5">
            Le remplacement kine,
            <br />
            <span className="bg-gradient-to-br from-jim-primary to-jim-accent-warm bg-clip-text text-transparent">
              enfin simple.
            </span>
          </h1>
        </FadeIn>

        {/* Sous-titre */}
        <FadeIn delay={2}>
          <p className="text-[clamp(16px,2vw,20px)] text-jim-muted max-w-[560px] mx-auto mb-10 font-normal leading-relaxed">
            Trouvez ou publiez un remplacement en quelques minutes. Profils verifies RPPS. Contrat integre. Paiement securise.
          </p>
        </FadeIn>

        {/* Barre de recherche */}
        <FadeIn delay={3}>
          <SearchBar />
        </FadeIn>

        {/* Trust badges */}
        <FadeIn delay={4}>
          <div className="flex flex-wrap items-center justify-center gap-5 mt-7">
            <TrustItem label="Verifie RPPS" />
            <TrustItem label="Contrat integre" />
            <TrustItem label="Paiement securise" />
            <TrustItem label="100% gratuit au lancement" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// Barre de recherche style Airbnb — 3 champs + bouton
function SearchBar() {
  return (
    <div className="flex flex-col md:flex-row md:items-stretch md:rounded-[60px] md:p-1.5 bg-white rounded-[36px] shadow-jim max-w-[760px] mx-auto transition-shadow focus-within:shadow-jim-lg focus-within:ring-2 focus-within:ring-jim-primary-soft">
      <SearchField icon="📍" label="Ville" placeholder="Paris, Lyon, Marseille..." />
      <SearchField icon="📅" label="Dates" placeholder="Quand ?" />
      <SearchField icon="🩺" label="Specialite" placeholder="Ortho, neuro, respi..." isLast />
      <button className="flex items-center justify-center gap-2 mx-3 mb-4 md:m-0 py-4 md:py-3.5 md:px-7 rounded-[16px] md:rounded-[50px] text-base md:text-[15px] font-bold text-white bg-gradient-to-br from-jim-primary to-jim-accent shadow-[0_6px_24px_rgba(232,132,74,0.35)] hover:shadow-[0_8px_32px_rgba(232,132,74,0.45)] hover:-translate-y-0.5 transition-all whitespace-nowrap flex-shrink-0">
        <Search size={20} strokeWidth={2.5} />
        Rechercher
      </button>
    </div>
  );
}

function SearchField({ icon, label, placeholder, isLast }: { icon: string; label: string; placeholder: string; isLast?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 md:py-3 cursor-pointer hover:bg-jim-surface-alt transition-colors md:flex-1 md:rounded-[50px] ${
        isLast ? '' : 'border-b md:border-b-0 md:border-r border-jim-beige-light'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-jim-primary-pale flex items-center justify-center text-lg flex-shrink-0 md:hidden">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-jim-muted mb-0.5">{label}</div>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-[15px] font-medium text-jim-text placeholder:text-jim-beige-dark placeholder:font-normal"
        />
      </div>
    </div>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] text-jim-muted font-medium">
      <span className="w-[18px] h-[18px] rounded-full bg-jim-success-bg text-jim-success flex items-center justify-center text-[11px] font-bold">
        ✓
      </span>
      {label}
    </div>
  );
}
