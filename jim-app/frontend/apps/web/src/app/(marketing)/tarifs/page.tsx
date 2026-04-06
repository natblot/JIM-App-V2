import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { StoreButtons } from '../../../components/landing/store-buttons';

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'JIM est gratuit pendant le lancement. Ensuite : abonnement Pro a 5,90 EUR/mois pour 0% de frais de gestion.',
};

const FREE_FEATURES = [
  'Recherche illimitee',
  'Publication d\'annonces',
  'Verification RPPS',
  'Contrat integre',
  'Messagerie',
];

const PRO_FEATURES = [
  'Tout le plan Gratuit',
  '0% de frais de gestion',
  'Badge Pro visible',
  'Priorite dans les resultats',
  'Support prioritaire',
];

export default function TarifsPage() {
  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-10 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Tarifs</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-4">Simple et transparent</h1>
        <p className="text-neutral-500 max-w-xl mx-auto">Pas de surprises. L&apos;inscription, la recherche et la messagerie sont toujours gratuites.</p>
      </div>

      {/* Cards tarifs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
        {/* Gratuit */}
        <div className="bg-white rounded-2xl border-2 border-brand p-8 relative shadow-sm">
          <div className="absolute -top-3 left-6 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">Lancement</div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Gratuit</h2>
          <p className="text-neutral-500 text-sm mb-6">Pendant la periode de lancement</p>
          <p className="text-4xl font-bold text-neutral-900 mb-1">0€</p>
          <p className="text-neutral-500 text-sm mb-8">Aucun frais de gestion</p>
          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-neutral-800">
                <Check size={16} className="text-green-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <StoreButtons size="md" className="justify-center" />
        </div>

        {/* Pro */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Pro</h2>
          <p className="text-neutral-500 text-sm mb-6">Apres le lancement</p>
          <p className="text-4xl font-bold text-neutral-900 mb-1">5,90€<span className="text-lg font-normal text-neutral-500">/mois</span></p>
          <p className="text-neutral-500 text-sm mb-8">Sans engagement</p>
          <ul className="space-y-3 mb-8">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-neutral-800">
                <Check size={16} className="text-brand flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <p className="text-xs text-neutral-400 text-center">S&apos;amortit des 590€ de versements/mois</p>
        </div>
      </div>

      <p className="text-center text-sm text-neutral-500">
        Post-lancement sans abonnement Pro : 1% de frais de gestion sur les versements.
      </p>
    </main>
  );
}
