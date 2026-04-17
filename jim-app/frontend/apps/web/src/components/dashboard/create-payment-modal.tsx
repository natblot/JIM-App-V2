'use client';

// Modal de creation d'un versement — cote titulaire
// Flux : saisie du montant encaisse -> calcul temps reel frais de gestion -> creation paiement
// Le paiement est cree en statut "en_attente_validation" (sequestre applicatif)
// Le mot "commission" ne doit JAMAIS apparaitre dans l'UI — on parle de "frais de gestion"

import { useMemo, useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useCreatePayment, useCommissionCalculator } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';

// Formateur d'euros — centimes -> EUR
const formatEUR = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

// Contrat utilisable pour un versement
export interface ContratForPayment {
  id: string;
  reference: string;
  remplacant_name: string;
  taux_retrocession: number;
}

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contrats: ContratForPayment[];
}

// Borne de saisie (empeche les montants aberrants)
const MAX_MONTANT_EUROS = 100_000;

export function CreatePaymentModal({ isOpen, onClose, contrats }: CreatePaymentModalProps) {
  const { supabase } = useAuthContext();
  const createPayment = useCreatePayment(supabase);

  // Etat du formulaire
  const [contratId, setContratId] = useState<string>('');
  const [montantEurosInput, setMontantEurosInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Contrat selectionne (pour recuperer le taux)
  const selectedContrat = useMemo(
    () => contrats.find((c) => c.id === contratId) ?? null,
    [contrats, contratId]
  );

  // Montant en centimes (arrondi pour eviter les erreurs flottantes)
  const montantEncaisseCents = useMemo(() => {
    const parsed = parseFloat(montantEurosInput.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0) return 0;
    return Math.round(parsed * 100);
  }, [montantEurosInput]);

  // Calcul temps reel — periode de lancement par defaut (pas de frais)
  // Les vrais flags isPro/isLaunchPeriod seraient a recuperer du profil/config
  const breakdown = useCommissionCalculator({
    montantEncaisseCents,
    tauxRetrocession: selectedContrat?.taux_retrocession ?? 0,
    isPro: false,
    isLaunchPeriod: false,
  });

  // Reset lorsqu'on ferme la modal
  function handleClose() {
    setContratId('');
    setMontantEurosInput('');
    setError(null);
    setIsSuccess(false);
    onClose();
  }

  // Validation + submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Contrat obligatoire
    if (!contratId) {
      setError('Selectionnez un contrat');
      return;
    }

    // Montant valide
    if (montantEncaisseCents <= 0) {
      setError('Le montant doit etre superieur a 0');
      return;
    }
    if (montantEncaisseCents >= MAX_MONTANT_EUROS * 100) {
      setError(`Le montant doit etre inferieur a ${formatEUR.format(MAX_MONTANT_EUROS)}`);
      return;
    }

    // Appel Edge Function create-payment
    createPayment.mutate(
      {
        contratId,
        montantEncaisseCents,
        sourceMontant: 'saisie_manuelle',
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (err) => {
          setError(
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue. Reessayez.'
          );
        },
      }
    );
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tete modal */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            {isSuccess ? 'Versement enregistre' : 'Creer un versement'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Ecran de confirmation */}
        {isSuccess ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Versement enregistre avec succes
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Le remplacant a 7 jours pour valider ou contester le montant. Sans reponse, le
              versement sera automatiquement finalise.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-[#ff7c5c] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#e86b4d] transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Aucun contrat dispo */}
            {contrats.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                Aucun contrat eligible a un versement. Un versement est disponible une fois le
                contrat confirme par les deux parties.
              </div>
            ) : (
              <>
                {/* Selection du contrat */}
                <div>
                  <label htmlFor="contrat" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contrat
                  </label>
                  <select
                    id="contrat"
                    value={contratId}
                    onChange={(e) => setContratId(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c]"
                  >
                    <option value="">Selectionnez un contrat...</option>
                    {contrats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.reference} — {c.remplacant_name} ({c.taux_retrocession}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Montant encaisse */}
                <div>
                  <label
                    htmlFor="montant"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Montant encaisse (honoraires totaux)
                  </label>
                  <div className="relative">
                    <input
                      id="montant"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      max={MAX_MONTANT_EUROS}
                      value={montantEurosInput}
                      onChange={(e) => setMontantEurosInput(e.target.value)}
                      placeholder="0,00"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      EUR
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Montant total des honoraires realises par le remplacant
                  </p>
                </div>

                {/* Ventilation temps reel */}
                {selectedContrat && montantEncaisseCents > 0 && (
                  <div className="bg-[#fdf6ed] rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Honoraires totaux</span>
                      <span className="font-semibold text-gray-900">
                        {formatEUR.format(breakdown.montantEncaisseCents / 100)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Retrocession ({breakdown.tauxRetrocession}%)
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatEUR.format(breakdown.montantRetrocessionCents / 100)}
                      </span>
                    </div>
                    {breakdown.commissionJimCents > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Frais de gestion</span>
                        <span className="font-semibold text-gray-900">
                          - {formatEUR.format(breakdown.commissionJimCents / 100)}
                        </span>
                      </div>
                    )}
                    <div className="h-px bg-gray-200 my-1" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Net verse au remplacant
                      </span>
                      <span className="text-base font-bold text-[#ff7c5c]">
                        {formatEUR.format(breakdown.montantNetRemplacantCents / 100)}
                      </span>
                    </div>
                    {breakdown.commissionJimCents === 0 && (
                      <p className="text-[11px] text-gray-500 pt-1">
                        Aucun frais de gestion pendant la periode de lancement
                      </p>
                    )}
                  </div>
                )}

                {/* Erreur */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Boutons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={createPayment.isPending || montantEncaisseCents === 0 || !contratId}
                    className="flex-1 bg-[#ff7c5c] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#e86b4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {createPayment.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      'Enregistrer le versement'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
