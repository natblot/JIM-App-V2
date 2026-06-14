'use client';

// Bouton de signature contextuel — adapte selon le statut du contrat et le role de l'utilisateur
// Brouillon + titulaire : finaliser et envoyer
// En attente + remplacant : checkbox + signer
// Confirme : badge signe (aucune action)

import { useState, useCallback } from 'react';
import type { Contrat } from '@jim/shared';

interface SignButtonProps {
  /** Le contrat complet */
  contrat: Contrat;
  /** ID de l'utilisateur connecte */
  currentUserId: string;
  /** Callback de signature (confirmation) */
  onSign: () => void;
  /** Indique si la mutation est en cours */
  isLoading: boolean;
}

export function SignButton({ contrat, currentUserId, onSign, isLoading }: SignButtonProps) {
  const [accepted, setAccepted] = useState(false);

  const isTitulaire = currentUserId === contrat.titulaire_id;
  const isRemplacant = currentUserId === contrat.remplacant_id;

  const handleSign = useCallback(() => {
    onSign();
  }, [onSign]);

  // Brouillon — seul le titulaire peut finaliser
  if (contrat.statut === 'brouillon' && isTitulaire) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-jim-muted">
          En finalisant, le contrat sera envoye au remplacant pour signature.
        </p>
        <button
          type="button"
          onClick={handleSign}
          disabled={isLoading}
          className="w-full bg-[#ff7c5c] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#e86c4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Envoi en cours...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
              </svg>
              Finaliser et envoyer au remplacant
            </>
          )}
        </button>
      </div>
    );
  }

  // En attente — le remplacant doit accepter et signer
  if (contrat.statut === 'en_attente_remplacant' && isRemplacant) {
    return (
      <div className="space-y-4">
        {/* Checkbox d'acceptation */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-jim-beige-dark text-[#ff7c5c] focus:ring-[#ff7c5c] accent-[#ff7c5c]"
          />
          <span className="text-sm text-jim-text-body leading-relaxed group-hover:text-jim-text transition-colors">
            Je certifie avoir lu et accepte l&apos;ensemble des clauses de ce contrat de remplacement.
          </span>
        </label>

        {/* Bouton signer */}
        <button
          type="button"
          onClick={handleSign}
          disabled={!accepted || isLoading}
          className="w-full bg-[#ff7c5c] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#e86c4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signature en cours...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Signer le contrat
            </>
          )}
        </button>
      </div>
    );
  }

  // En attente — vue titulaire (en attente de l'autre partie)
  if (contrat.statut === 'en_attente_remplacant' && isTitulaire) {
    return (
      <div className="flex items-center gap-3 bg-jim-warning-bg border border-[#edd9c4] rounded-xl p-4">
        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-jim-warning"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-jim-warning">
            En attente de la signature de {contrat.donnees.remplacant.first_name}
          </p>
          <p className="text-xs text-jim-warning mt-0.5">
            Le contrat a ete envoye au remplacant pour validation.
          </p>
        </div>
      </div>
    );
  }

  // Confirme — les deux parties ont signe
  if (contrat.statut === 'confirme') {
    return (
      <div className="flex items-center gap-3 bg-jim-success-bg border border-[#cfe3d2] rounded-xl p-4">
        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-jim-success"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-jim-success">Contrat signe par les deux parties</p>
          <p className="text-xs text-jim-success mt-0.5">
            Le contrat est officiel. Vous pouvez le telecharger en PDF.
          </p>
        </div>
      </div>
    );
  }

  // Cas non prevu — ne rien afficher
  return null;
}
