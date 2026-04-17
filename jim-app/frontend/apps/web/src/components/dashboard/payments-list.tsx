'use client';

// Historique des paiements — vue differenciee titulaire/remplacant
// Montants TOUJOURS en euros (centimes / 100)
// Le mot "commission" ne doit JAMAIS apparaitre dans l'UI — on parle de "frais de gestion"

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useMesPaiements } from '@jim/shared';
import type { SupabaseClient } from '@jim/shared';
import type { Paiement, PaiementStatus } from '@jim/shared/types/paiement';
import type { Contrat } from '@jim/shared/types/contrat';
import { CreatePaymentModal, type ContratForPayment } from './create-payment-modal';
import { StripeOnboardingBanner } from './stripe-onboarding-banner';
import { ContestPaymentButton } from './contest-payment-button';

// Formateur d'euros — centimes -> EUR
const formatEUR = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

interface PaymentsListProps {
  role: 'titulaire' | 'remplacant';
  userId: string;
  supabase: SupabaseClient;
}

// Badge statut paiement
function PaiementStatusBadge({ status }: { status: PaiementStatus }) {
  const config: Record<PaiementStatus, { bg: string; text: string; label: string }> = {
    brouillon: { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Brouillon' },
    en_attente_validation: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
    conteste: { bg: 'bg-red-50', text: 'text-red-600', label: 'Conteste' },
    en_cours: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'En cours' },
    confirme: { bg: 'bg-green-50', text: 'text-green-700', label: 'Confirme' },
    echoue: { bg: 'bg-red-50', text: 'text-red-700', label: 'Echoue' },
    rembourse: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Rembourse' },
  };
  const c = config[status] ?? { bg: 'bg-gray-50', text: 'text-gray-600', label: status };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// Ligne de paiement
function PaymentRow({
  paiement,
  isTitulaire,
}: {
  paiement: Paiement;
  isTitulaire: boolean;
}) {
  // Le montant pertinent selon le role
  const montant = isTitulaire
    ? paiement.montant_retrocession_cents
    : paiement.montant_net_remplacant_cents;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px_90px] gap-2 md:gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
      {/* Montant + detail */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {isTitulaire ? '- ' : '+ '}
          {formatEUR.format(montant / 100)}
        </p>
        <p className="text-xs text-gray-500">
          {paiement.taux_retrocession}% retrocession
          {paiement.commission_jim_cents > 0 && (
            <span className="ml-1">
              &middot; Frais de gestion : {formatEUR.format(paiement.commission_jim_cents / 100)}
            </span>
          )}
        </p>
      </div>

      {/* Date */}
      <div className="text-xs text-gray-500 self-center">
        {new Date(paiement.created_at).toLocaleDateString('fr-FR')}
      </div>

      {/* Source */}
      <div className="text-xs text-gray-500 self-center capitalize">
        {paiement.source_montant.replace(/_/g, ' ')}
      </div>

      {/* Statut */}
      <div className="self-center">
        <PaiementStatusBadge status={paiement.status} />
      </div>

      {/* Action (contester — visible uniquement cote remplacant, si contestable) */}
      <div className="self-center justify-self-end">
        {!isTitulaire && (
          <ContestPaymentButton
            paiement={{
              id: paiement.id,
              status: paiement.status,
              created_at: paiement.created_at,
            }}
          />
        )}
      </div>
    </div>
  );
}

// Type pour le contrat confirme joint a son paiement existant eventuel
// On utilise `donnees.remplacant` (snapshot au moment de la generation) pour le nom
// afin d'eviter toute dependance a une clef etrangere nommee
type ContratWithPaiement = Contrat & {
  annonces: { ville: string } | null;
  paiements: Array<{ id: string }>;
};

export function PaymentsList({ role, userId, supabase }: PaymentsListProps) {
  const { data: paiements, isLoading } = useMesPaiements(supabase, userId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isTitulaire = role === 'titulaire';

  // Fetch des contrats eligibles a un versement — titulaire uniquement
  // Un contrat est eligible si : statut = 'confirme' ET aucun paiement existant (contrainte UNIQUE)
  const { data: contratsEligibles } = useQuery<ContratWithPaiement[]>({
    queryKey: ['dashboard', 'contrats-eligibles-paiement', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contrats')
        .select(
          `
          *,
          annonces(ville),
          paiements(id)
        `
        )
        .eq('titulaire_id', userId)
        .eq('statut', 'confirme')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as ContratWithPaiement[];
    },
    enabled: isTitulaire && !!userId,
    staleTime: 30_000,
  });

  // Transformer en ContratForPayment — filtrer ceux qui ont deja un paiement
  const contratsForPayment = useMemo<ContratForPayment[]>(() => {
    if (!contratsEligibles) return [];
    return contratsEligibles
      .filter((c) => !c.paiements || c.paiements.length === 0)
      .map((c) => {
        // Le nom provient du snapshot `donnees.remplacant` (fige au moment de la generation)
        const prenom = c.donnees?.remplacant?.first_name ?? '';
        const nom = c.donnees?.remplacant?.last_name ?? '';
        const fullName = `${prenom} ${nom}`.trim() || 'Remplacant';
        const reference = `#${c.id.slice(0, 6).toUpperCase()}`;
        return {
          id: c.id,
          reference,
          remplacant_name: fullName,
          taux_retrocession: c.donnees?.taux_retrocession ?? 0,
        };
      });
  }, [contratsEligibles]);

  const liste = isTitulaire ? (paiements?.versements ?? []) : (paiements?.receptions ?? []);

  // Calcul du total
  const total = liste.reduce(
    (sum, p) =>
      sum +
      (isTitulaire ? p.montant_retrocession_cents : p.montant_net_remplacant_cents),
    0
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff7c5c] border-t-transparent" />
          <span className="text-sm">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Banniere onboarding Stripe — remplacant uniquement */}
      {!isTitulaire && <StripeOnboardingBanner userId={userId} />}

      {/* En-tete */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-lg font-bold text-gray-900">
          {isTitulaire ? 'Paiements effectues' : 'Paiements recus'}
        </h2>

        <div className="flex items-center gap-4">
          {liste.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">
                {formatEUR.format(total / 100)}
              </p>
            </div>
          )}

          {/* Bouton "Creer un versement" — titulaire uniquement */}
          {isTitulaire && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#ff7c5c] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#e86b4d] transition-colors inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Creer un versement
            </button>
          )}
        </div>
      </div>

      {liste.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">Aucun paiement pour le moment</p>
          {isTitulaire && contratsForPayment.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Vous avez {contratsForPayment.length} contrat
              {contratsForPayment.length > 1 ? 's' : ''} en attente d&apos;un versement
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* En-tete */}
          <div className="hidden md:grid grid-cols-[1fr_100px_100px_100px_90px] gap-4 px-5 py-3 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Montant
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Date
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Source
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Statut
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </span>
          </div>

          {/* Lignes */}
          {liste.map((paiement) => (
            <PaymentRow
              key={paiement.id}
              paiement={paiement}
              isTitulaire={isTitulaire}
            />
          ))}
        </div>
      )}

      {/* Modal creation paiement — titulaire uniquement */}
      {isTitulaire && (
        <CreatePaymentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          contrats={contratsForPayment}
        />
      )}
    </div>
  );
}
