'use client';

// Bouton de contestation d'un versement — cote remplacant
// Visible uniquement si status = 'en_attente_validation' ET < 7 jours depuis la creation
// Flux : clic -> modal (motif + details) -> update paiement + signalement -> refresh

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Flag, X, AlertCircle, Check } from 'lucide-react';
import { useAuthContext } from '../providers/auth-provider';

// Fenetre de contestation en jours
const CONTEST_WINDOW_DAYS = 7;
const MAX_DETAILS_LENGTH = 500;

// Motifs possibles
const MOTIFS = [
  { value: 'montant_incorrect', label: 'Montant incorrect' },
  { value: 'prestation_non_effectuee', label: 'Prestation non effectuee' },
  { value: 'autre', label: 'Autre' },
] as const;

type MotifValue = (typeof MOTIFS)[number]['value'];

interface ContestPaymentButtonProps {
  paiement: {
    id: string;
    status: string;
    created_at: string;
  };
}

export function ContestPaymentButton({ paiement }: ContestPaymentButtonProps) {
  const { supabase } = useAuthContext();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [motif, setMotif] = useState<MotifValue>('montant_incorrect');
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verifier si on est dans la fenetre de contestation (7 jours)
  const canContest = useMemo(() => {
    if (paiement.status !== 'en_attente_validation') return false;
    const createdAt = new Date(paiement.created_at).getTime();
    const now = Date.now();
    const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    return diffDays <= CONTEST_WINDOW_DAYS;
  }, [paiement.status, paiement.created_at]);

  // Ne rien afficher si pas contestable
  if (!canContest) return null;

  // Reset de la modal
  function handleClose() {
    setIsOpen(false);
    setMotif('montant_incorrect');
    setDetails('');
    setError(null);
    setIsSuccess(false);
  }

  // Soumission de la contestation
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (details.trim().length === 0) {
      setError('Precisez les details de votre contestation');
      return;
    }
    if (details.length > MAX_DETAILS_LENGTH) {
      setError(`Les details ne peuvent pas depasser ${MAX_DETAILS_LENGTH} caracteres`);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Mettre a jour le paiement en statut "conteste"
      // Cette UPDATE est autorisee par la RLS pour le remplacant quand status = 'en_attente_validation'
      const { error: updateError } = await supabase
        .from('paiements')
        .update({
          status: 'conteste',
          contested_at: new Date().toISOString(),
        })
        .eq('id', paiement.id);

      if (updateError) throw new Error(updateError.message);

      // 2. Creer un signalement pour la moderation
      const motifLabel = MOTIFS.find((m) => m.value === motif)?.label ?? motif;
      const { error: signalError } = await supabase.functions.invoke('create-signalement', {
        body: {
          contenu_type: 'paiement',
          contenu_id: paiement.id,
          categorie: 'autre',
          description: `${motifLabel}: ${details.trim()}`,
        },
      });

      if (signalError) throw new Error(signalError.message);

      // 3. Invalider les queries pour rafraichir la liste
      await queryClient.invalidateQueries({ queryKey: ['paiements'] });

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Une erreur est survenue. Reessayez.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Bouton de declenchement */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1 transition-colors"
      >
        <Flag size={12} />
        Contester
      </button>

      {/* Modal de contestation */}
      {isOpen && (
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
                {isSuccess ? 'Contestation envoyee' : 'Contester le versement'}
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

            {isSuccess ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Contestation enregistree
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  Notre equipe support va prendre en charge votre dossier et vous contactera sous 48
                  heures.
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
                <p className="text-xs text-gray-500">
                  Votre contestation bloque le versement jusqu&apos;a ce que l&apos;equipe support
                  statue. Expliquez precisement le probleme.
                </p>

                {/* Motif */}
                <div>
                  <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Motif
                  </label>
                  <select
                    id="motif"
                    value={motif}
                    onChange={(e) => setMotif(e.target.value as MotifValue)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c]"
                  >
                    {MOTIFS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Details */}
                <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Details
                  </label>
                  <textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={5}
                    maxLength={MAX_DETAILS_LENGTH}
                    placeholder="Decrivez precisement le probleme rencontre..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c]"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">
                    {details.length}/{MAX_DETAILS_LENGTH}
                  </p>
                </div>

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
                    disabled={isSubmitting || details.trim().length === 0}
                    className="flex-1 bg-red-600 text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Envoi...</span>
                      </>
                    ) : (
                      'Soumettre la contestation'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
