'use client';

// Affichage des clauses contractuelles (obligatoires + optionnelles)
// Les clauses obligatoires sont verrouillees, les optionnelles editables si le contrat est en brouillon

import { useState, useCallback } from 'react';
import type { ContratClause } from '@jim/shared';

interface ContractClausesProps {
  /** Clauses obligatoires — toujours en lecture seule */
  clausesObligatoires: ContratClause[];
  /** Clauses optionnelles — editables selon le statut */
  clausesOptionnelles: ContratClause[];
  /** Active le mode edition des clauses optionnelles */
  editable: boolean;
  /** Callback de sauvegarde des clauses modifiees */
  onSave: (clauses: ContratClause[]) => void;
  /** Indique si la sauvegarde est en cours */
  isSaving: boolean;
}

export function ContractClauses({
  clausesObligatoires,
  clausesOptionnelles,
  editable,
  onSave,
  isSaving,
}: ContractClausesProps) {
  // Etat local des clauses editees
  const [editedClauses, setEditedClauses] = useState<ContratClause[]>(clausesOptionnelles);
  const [hasChanges, setHasChanges] = useState(false);

  // Mise a jour du contenu d'une clause optionnelle
  const handleClauseChange = useCallback(
    (clauseId: string, newContent: string) => {
      setEditedClauses((prev) =>
        prev.map((c) => (c.id === clauseId ? { ...c, contenu: newContent } : c)),
      );
      setHasChanges(true);
    },
    [],
  );

  // Sauvegarde des modifications
  const handleSave = useCallback(() => {
    onSave(editedClauses);
    setHasChanges(false);
  }, [editedClauses, onSave]);

  // Compteur d'articles global (obligatoires d'abord, puis optionnelles)
  let articleIndex = 0;

  return (
    <div className="space-y-6">
      {/* Clauses obligatoires */}
      {clausesObligatoires.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-jim-text uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-jim-muted"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                clipRule="evenodd"
              />
            </svg>
            Clauses obligatoires
          </h3>
          <div className="space-y-3">
            {clausesObligatoires.map((clause) => {
              articleIndex += 1;
              return (
                <div
                  key={clause.id}
                  className="border-l-4 border-jim-beige-dark pl-4 py-3 bg-jim-surface-alt/60 rounded-r-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-jim-muted uppercase">
                      Article {articleIndex}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-3 w-3 text-jim-muted"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-jim-text mb-1">
                    {clause.titre}
                  </h4>
                  <p className="text-sm text-jim-text-body leading-relaxed whitespace-pre-wrap">
                    {clause.contenu}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clauses optionnelles */}
      {clausesOptionnelles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-jim-text uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-[#ff7c5c]"
            >
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
            Clauses complementaires
            {editable && (
              <span className="text-[10px] font-normal text-[#ff7c5c] bg-[#ff7c5c]/10 px-2 py-0.5 rounded-full">
                Modifiable
              </span>
            )}
          </h3>
          <div className="space-y-3">
            {editedClauses.map((clause) => {
              articleIndex += 1;
              return (
                <div
                  key={clause.id}
                  className={`border-l-4 pl-4 py-3 rounded-r-lg ${
                    editable ? 'border-[#ff7c5c] bg-[#ff7c5c]/5' : 'border-jim-beige-mid bg-jim-surface-alt/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-jim-muted uppercase">
                      Article {articleIndex}
                    </span>
                    {editable && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-3 w-3 text-[#ff7c5c]"
                      >
                        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                      </svg>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-jim-text mb-1">
                    {clause.titre}
                  </h4>
                  {editable ? (
                    <textarea
                      value={clause.contenu}
                      onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                      rows={4}
                      className="w-full text-sm text-jim-text-body leading-relaxed bg-white border border-jim-beige-mid rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#ff7c5c]/30 focus:border-[#ff7c5c] resize-y"
                    />
                  ) : (
                    <p className="text-sm text-jim-text-body leading-relaxed whitespace-pre-wrap">
                      {clause.contenu}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bouton sauvegarde clauses */}
          {editable && hasChanges && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-jim-text text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-jim-text-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Enregistrer les modifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Message si aucune clause */}
      {clausesObligatoires.length === 0 && clausesOptionnelles.length === 0 && (
        <div className="text-center py-8 text-jim-muted text-sm">
          Aucune clause disponible pour ce contrat.
        </div>
      )}
    </div>
  );
}
