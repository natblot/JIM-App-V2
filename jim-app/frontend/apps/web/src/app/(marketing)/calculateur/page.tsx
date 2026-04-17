import type { Metadata } from 'next';
import { RetrocessionCalculator } from '../../../components/calculateur/retrocession-calculator';

export const metadata: Metadata = {
  title: 'Calculateur de retrocession kine',
  description: 'Calculez votre retrocession nette en tant que kinesitherapeute remplacant. Estimation URSSAF, CARPIMKO, net apres charges.',
  keywords: ['calculateur retrocession kine', 'calcul retrocession kinesitherapeute', 'charges kine remplacant'],
};

export default function CalculateurPage() {
  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-10 py-12">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">Outil gratuit</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-4">
            Calculateur de retrocession
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto">
            Estimez votre retrocession nette apres charges. Sans inscription.
          </p>
        </div>
        <RetrocessionCalculator />
      </div>
    </main>
  );
}
