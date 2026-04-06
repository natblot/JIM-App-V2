import { FadeIn } from './fade-in';

const FREE_FEATURES = [
  'Recherche illimitee',
  'Publication d\'annonces',
  'Verification RPPS',
  'Contrat integre',
  'Messagerie',
];

const PRO_FEATURES = [
  'Tout le plan gratuit',
  'Badge Pro visible',
  'Priorite dans les resultats',
  'Alertes instantanees',
  'Support prioritaire',
];

// Section tarifs — apercu Free vs Pro
export function PricingSection() {
  return (
    <section className="py-20 bg-white" id="tarifs">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-jim-primary mb-3">Tarifs</p>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.03em] leading-[1.15] text-jim-text">
              Simple et transparent
            </h2>
            <p className="text-[17px] text-jim-muted max-w-[520px] mx-auto mt-3 font-normal">
              Gratuit pendant le lancement. Sans engagement. Sans frais caches.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {/* Gratuit */}
          <FadeIn delay={1}>
            <div className="bg-white rounded-[24px] p-9 border-[1.5px] border-jim-border shadow-jim hover:-translate-y-1 transition-transform duration-300">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-jim-muted mb-2">Gratuit</p>
              <p className="text-[42px] font-extrabold tracking-[-0.04em] leading-none text-jim-text mb-1">0€</p>
              <p className="text-sm text-jim-muted mb-6">Pendant le lancement</p>
              <ul className="flex flex-col gap-2.5 mb-7">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium text-jim-text">
                    <span className="text-jim-success text-[15px] flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 rounded-xl text-[15px] font-bold text-jim-text bg-jim-beige-light hover:bg-jim-beige-mid transition-colors">
                Commencer gratuitement
              </button>
            </div>
          </FadeIn>

          {/* Pro */}
          <FadeIn delay={2}>
            <div className="relative bg-gradient-to-br from-jim-primary to-jim-accent text-white rounded-[24px] p-9 shadow-jim-lg hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(232,132,74,0.35)] transition-all duration-300 overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-[20px] text-[11px] font-bold bg-white/[0.22]">
                Populaire
              </div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/70 mb-2">JIM Pro</p>
              <p className="text-[42px] font-extrabold tracking-[-0.04em] leading-none mb-1">5,90€</p>
              <p className="text-sm text-white/65 mb-6">/mois · sans engagement</p>
              <ul className="flex flex-col gap-2.5 mb-7">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-white/85 text-[15px] flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white bg-white/20 border-[1.5px] border-white/35 hover:bg-white/30 transition-colors">
                Passer a JIM Pro
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
