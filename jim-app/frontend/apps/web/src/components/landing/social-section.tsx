'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FadeIn } from './fade-in';

const COUNTERS = [
  { target: 2847, suffix: '', label: 'Remplacements trouves' },
  { target: 1250, suffix: '+', label: 'Kines inscrits' },
  { target: 26, suffix: 's', label: 'Temps moyen de recherche' },
  { target: 98, suffix: '%', label: 'Satisfaction utilisateurs' },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "J'ai trouve mon premier remplacement en 26 secondes. L'appli est intuitive, tout se fait depuis le telephone. Fini les groupes Facebook.",
    initials: 'LM',
    name: 'Lea M.',
    role: 'Remplacante · Lille',
  },
  {
    stars: 5,
    text: "En tant que titulaire, je trouvais toujours mes remplacants au dernier moment. Avec JIM, j'ai 3 candidatures en moins d'une heure.",
    initials: 'PD',
    name: 'Pierre D.',
    role: 'Titulaire · Lyon 6e',
  },
  {
    stars: 5,
    text: "Le contrat pre-rempli et le paiement securise, ca change tout. Plus de problemes d'impayes ou de paperasse. Enfin un outil pro.",
    initials: 'SC',
    name: 'Sophie C.',
    role: 'Remplacante · Bordeaux',
  },
];

// Section social proof — compteurs animes + temoignages
export function SocialSection() {
  return (
    <section className="py-20" id="temoignages">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-jim-primary mb-3">Ils nous font confiance</p>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.03em] leading-[1.15] text-jim-text">
              La communaute kine grandit chaque jour
            </h2>
          </div>
        </FadeIn>

        {/* Compteurs */}
        <FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-[800px] mx-auto mb-14">
            {COUNTERS.map((c) => (
              <AnimatedCounter key={c.label} target={c.target} suffix={c.suffix} label={c.label} />
            ))}
          </div>
        </FadeIn>

        {/* Temoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={(i + 1) as 1 | 2 | 3}>
              <div className="bg-white rounded-[24px] p-7 shadow-jim border border-jim-border hover:-translate-y-1 hover:shadow-jim-md transition-all duration-300">
                {/* Etoiles */}
                <div className="text-jim-accent-warm text-base tracking-[2px] mb-3.5">
                  {'★'.repeat(t.stars)}
                </div>
                <p className="text-[15px] text-jim-text-body leading-[1.65] mb-[18px]">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-jim-primary-pale flex items-center justify-center font-bold text-sm text-jim-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-jim-text">{t.name}</p>
                    <p className="text-xs text-jim-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Compteur anime avec ease-out cubic
function AnimatedCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const duration = 1800;
    const start = performance.now();

    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-[clamp(28px,4vw,42px)] font-extrabold text-jim-primary tracking-[-0.03em] leading-none mb-1">
        {value.toLocaleString('fr-FR')}{suffix}
      </div>
      <div className="text-[13px] text-jim-muted font-medium">{label}</div>
    </div>
  );
}
