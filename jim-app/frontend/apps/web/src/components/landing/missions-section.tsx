import { FadeIn } from './fade-in';

// Donnees de demo — seront remplacees par les annonces Supabase en production
const MOCK_MISSIONS = [
  { id: '1', emoji: '🏥', ville: 'Paris 11e', titre: 'Cabinet Saint-Ambroise', dates: '12 mai → 30 mai 2026 · 3 semaines', prix: 320, specs: ['Ortho', 'Neuro'], urgent: false },
  { id: '2', emoji: '🏢', ville: 'Lyon 3e', titre: 'Centre Kine Part-Dieu', dates: '5 mai → 16 mai 2026 · 2 semaines', prix: 290, specs: ['Respi'], urgent: true },
  { id: '3', emoji: '🌊', ville: 'Marseille 8e', titre: 'Cabinet Corniche Kennedy', dates: '1 juin → 30 juin 2026 · 1 mois', prix: 340, specs: ['Sport', 'Ortho'], urgent: false },
  { id: '4', emoji: '🏠', ville: 'Bordeaux centre', titre: 'Cabinet des Chartrons', dates: '20 mai → 7 juin 2026 · 3 semaines', prix: 280, specs: ['Geriatrie'], urgent: false },
  { id: '5', emoji: '⛰️', ville: 'Annecy', titre: 'Kine du Lac', dates: '15 mai → 29 mai 2026 · 2 semaines', prix: 310, specs: ['Sport'], urgent: false },
  { id: '6', emoji: '🌻', ville: 'Toulouse', titre: 'Cabinet Capitole Sante', dates: '8 mai → 22 mai 2026 · 2 semaines', prix: 300, specs: ['Pediatrie', 'Respi'], urgent: true },
];

// Section grille de missions — fidele a la maquette HTML
export function MissionsSection() {
  return (
    <section className="py-20" id="missions">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-jim-primary mb-3">Missions disponibles</p>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold tracking-[-0.03em] leading-[1.15] text-jim-text">
              Des remplacements pres de chez vous
            </h2>
            <p className="text-[17px] text-jim-muted max-w-[520px] mx-auto mt-3 font-normal">
              Annonces fraiches, zero annonce morte. Mises a jour en temps reel.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_MISSIONS.map((m, i) => (
            <FadeIn key={m.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <MissionCard mission={m} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Mission {
  emoji: string;
  ville: string;
  titre: string;
  dates: string;
  prix: number;
  specs: string[];
  urgent: boolean;
}

function MissionCard({ mission }: { mission: Mission }) {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-jim border border-jim-border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-jim-lg">
      {/* Image placeholder */}
      <div className="relative w-full h-[180px] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-jim-primary-pale via-jim-beige-light to-jim-surface-alt flex items-center justify-center text-5xl relative">
          {mission.emoji}
          {/* Gradient overlay bas */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-jim-background/40 to-transparent" />
        </div>
        {/* Badge RPPS */}
        <div className="absolute top-3 left-3 z-[2] inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-[11px] font-bold bg-white/[0.92] backdrop-blur-sm text-jim-success">
          ✓ RPPS
        </div>
        {/* Badge urgent */}
        {mission.urgent && (
          <div className="absolute top-3 right-3 z-[2] px-2.5 py-1 rounded-[20px] text-[11px] font-bold bg-jim-destructive/[0.12] text-jim-destructive">
            Urgent
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="px-5 py-4 pb-5">
        <div className="flex items-center gap-1 text-[13px] text-jim-muted font-medium mb-1.5">
          📍 {mission.ville}
        </div>
        <h3 className="text-[17px] font-bold text-jim-text tracking-[-0.02em] mb-2">{mission.titre}</h3>
        <p className="text-[13px] text-jim-muted mb-3">{mission.dates}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-jim-text">
            {mission.prix}€ <span className="text-[13px] font-normal text-jim-muted">/jour</span>
          </p>
          <div className="flex gap-1.5">
            {mission.specs.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-jim-primary-pale text-jim-primary">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
