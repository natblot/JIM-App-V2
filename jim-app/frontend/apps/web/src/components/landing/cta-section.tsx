import { FadeIn } from './fade-in';

// Section CTA finale — fond gradient, double bouton titulaire/remplacant
export function CtaSection() {
  return (
    <section className="py-[100px] relative overflow-hidden bg-gradient-to-br from-jim-primary-pale via-jim-beige-light to-jim-surface-alt" id="cta">
      {/* Cercle decoratif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(232,132,74,0.10)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-8 text-center">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-jim-primary mb-3">Pret a commencer ?</p>
        </FadeIn>

        <FadeIn delay={1}>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-0.03em] leading-[1.15] text-jim-text mb-4">
            Simplifiez vos remplacements
            <br />
            des aujourd&apos;hui
          </h2>
        </FadeIn>

        <FadeIn delay={2}>
          <p className="text-[17px] text-jim-muted max-w-[480px] mx-auto mb-9">
            Que vous soyez titulaire ou remplacant, JIM est fait pour vous.
          </p>
        </FadeIn>

        <FadeIn delay={3}>
          <div className="flex flex-col min-[480px]:flex-row items-center justify-center gap-3.5">
            <a
              href="https://apps.apple.com/app/jim"
              target="_blank"
              rel="noopener noreferrer"
              className="px-9 py-4 rounded-[14px] text-base font-bold text-white bg-gradient-to-br from-jim-primary to-jim-accent shadow-[0_6px_28px_rgba(232,132,74,0.35)] hover:shadow-[0_8px_36px_rgba(232,132,74,0.45)] hover:-translate-y-0.5 transition-all"
            >
              Je suis titulaire
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.jimapp.mobile"
              target="_blank"
              rel="noopener noreferrer"
              className="px-9 py-4 rounded-[14px] text-base font-bold text-jim-primary bg-white border-[1.5px] border-jim-primary-soft shadow-jim hover:bg-jim-primary-pale hover:border-jim-primary transition-all"
            >
              Je suis remplacant
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={4}>
          <p className="mt-[18px] text-[13px] text-jim-muted">
            Gratuit au lancement · Sans engagement · RPPS verifie
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
