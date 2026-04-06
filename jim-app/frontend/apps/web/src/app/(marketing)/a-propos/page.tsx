import type { Metadata } from 'next';
import { StoreButtons } from '../../../components/landing/store-buttons';

export const metadata: Metadata = {
  title: 'A propos',
  description: 'JIM est cree par Nathan, kinesitherapeute. Il a vecu les memes frustrations que vous — et a construit la solution.',
};

export default function AProposPage() {
  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-10 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-3">A propos</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Cree par un kine, pour les kines
          </h1>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-8 md:p-10 shadow-sm mb-10">
          <p className="text-lg text-neutral-800 leading-relaxed mb-8">
            Je m&apos;appelle Nathan. Je suis kinesitherapeute. Et j&apos;ai vecu les memes frustrations que vous.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 mb-3">Le probleme</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            Trouver un remplacement, c&apos;est un parcours du combattant. Des annonces eparpillees sur 5 sites differents.
            Des profils non verifies. Des contrats manuscrits griffonnes entre deux patients.
            Et quand vient le moment de la retrocession — les relances, les impayes, les tensions.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-8">
            J&apos;ai vecu tout ca. En tant que remplacant, j&apos;ai postule a des annonces deja pourvues.
            En tant que titulaire, j&apos;ai galere a trouver quelqu&apos;un de confiance pour garder mon cabinet.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 mb-3">La solution</h2>
          <p className="text-neutral-600 leading-relaxed mb-8">
            JIM, c&apos;est ce que j&apos;aurais aime avoir des mon premier remplacement.
            Toutes les annonces au meme endroit. Chaque profil verifie via le numero RPPS.
            Un contrat genere en 1 clic. Et un paiement securise de la retrocession — plus de relances, plus d&apos;impayes.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 mb-3">La mission</h2>
          <p className="text-neutral-600 leading-relaxed mb-8">
            Rendre le remplacement kinesitherapeute aussi simple qu&apos;une reservation.
            Pas de jargon tech, pas d&apos;usine a gaz — juste les outils dont vous avez besoin,
            construits par quelqu&apos;un qui comprend votre metier.
          </p>

          <p className="text-xl font-bold text-neutral-900 text-center">
            JIM, c&apos;est Job In Med.<br />Et c&apos;est fait pour vous.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <StoreButtons size="lg" className="justify-center" />
        </div>
      </div>
    </main>
  );
}
