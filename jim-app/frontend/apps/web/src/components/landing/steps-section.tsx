import { FadeIn } from './fade-in';

const STEPS = [
  { number: 1, icon: '📱', title: 'Creez votre profil', desc: 'Inscription en 30 secondes. Verification RPPS automatique via l\'Annuaire Sante.' },
  { number: 2, icon: '🔍', title: 'Trouvez une mission', desc: 'Recherchez par ville, dates et specialite. Recevez des alertes personnalisees.' },
  { number: 3, icon: '🤝', title: 'Contractualisez en 1 clic', desc: 'Contrat pre-rempli, signature electronique, paiement securise via Stripe.' },
];

// Section "Comment ca marche" — 3 etapes avec connecteurs
export function StepsSection() {
  return (
    <section className="py-20 bg-white" id="comment-ca-marche">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-jim-primary mb-3">Comment ca marche</p>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.03em] leading-[1.15] text-jim-text">
              3 etapes, c&apos;est tout
            </h2>
            <p className="text-[17px] text-jim-muted max-w-[520px] mx-auto mt-3 font-normal">
              De l&apos;inscription a la mission, tout se fait en quelques minutes.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-14">
          {STEPS.map((step, i) => (
            <FadeIn key={step.number} delay={(i + 1) as 1 | 2 | 3}>
              <div className="text-center relative">
                {/* Numero gradient */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-jim-primary to-jim-accent-warm text-white text-[22px] font-extrabold flex items-center justify-center mx-auto mb-5 shadow-[0_6px_20px_rgba(232,132,74,0.28)]">
                  {step.number}
                </div>
                {/* Icone */}
                <div className="text-[40px] mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-jim-text tracking-[-0.02em] mb-2">{step.title}</h3>
                <p className="text-sm text-jim-muted max-w-[300px] mx-auto leading-relaxed">{step.desc}</p>

                {/* Connecteur fleche (desktop uniquement, sauf dernier) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-7 -right-5 w-10 h-0.5 bg-gradient-to-r from-jim-primary-soft to-jim-beige-mid rounded-sm" />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
