import type { Metadata } from 'next';
import { MapPin, Zap, ShieldCheck, FileText, CreditCard } from 'lucide-react';
import { StoreButtons } from '../../../components/landing/store-buttons';
import type { LucideIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fonctionnalites',
  description: 'Decouvrez les 5 piliers de JIM : agregation, fraicheur temps reel, verification RPPS, contrat integre, paiement securise.',
};

interface Pilier {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const PILIERS: Pilier[] = [
  { icon: MapPin, title: 'Toutes les annonces, un seul endroit', desc: 'JIM agrege les annonces de remplacement de toutes les sources avec les annonces publiees directement. Fini les 5 onglets ouverts.' },
  { icon: Zap, title: 'Fraicheur temps reel — Zero annonce morte', desc: 'Relances automatiques a J-7 et J-3. Les annonces expirees disparaissent. Vous ne perdez plus de temps sur des annonces deja pourvues.' },
  { icon: ShieldCheck, title: 'Verification RPPS — Chaque profil verifie', desc: 'Chaque utilisateur est verifie via l\'API Annuaire Sante. Numero RPPS valide = professionnel de sante confirme. Zero faux profil.' },
  { icon: FileText, title: 'Contrat integre — Contrat pre-rempli en 1 clic', desc: 'Le contrat de remplacement est genere automatiquement. Identites, dates, taux de retrocession — tout est pre-rempli. Double confirmation numerique.' },
  { icon: CreditCard, title: 'Paiement securise — Retrocession sans impaye', desc: 'Le versement de la retrocession passe par Stripe Connect. Le titulaire declare, le remplacant recoit. Zero impaye, zero relance.' },
];

export default function FonctionnalitesPage() {
  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-10 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Fonctionnalites</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-4">Les 5 piliers de JIM</h1>
        <p className="text-neutral-500 max-w-xl mx-auto">Chaque fonctionnalite repond a un probleme reel vecu par les kinesitherapeutes.</p>
      </div>

      {/* Piliers */}
      <div className="space-y-12 max-w-4xl mx-auto mb-16">
        {PILIERS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className={`flex flex-col md:flex-row gap-6 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center">
                <Icon size={28} className="text-brand" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-lg font-bold text-neutral-900 mb-2">{p.title}</h2>
                <p className="text-neutral-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">Convaincu ?</h2>
        <p className="text-neutral-500 mb-6">Telechargez JIM et commencez gratuitement.</p>
        <StoreButtons size="lg" className="justify-center" />
      </div>
    </main>
  );
}
