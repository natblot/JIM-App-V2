'use client';

// Suivi des contrats — liste avec statuts et actions
// Affiche les contrats ou l'utilisateur est titulaire ou remplacant

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import type { SupabaseClient } from '@jim/shared';
import type { Contrat, ContratStatut } from '@jim/shared/types/contrat';

interface ContractsListProps {
  userId: string;
  supabase: SupabaseClient;
}

// Badge statut contrat
function ContratStatusBadge({ statut }: { statut: ContratStatut }) {
  const config: Record<ContratStatut, { bg: string; text: string; label: string }> = {
    brouillon: { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Brouillon' },
    en_attente_remplacant: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
    confirme: { bg: 'bg-green-50', text: 'text-green-700', label: 'Confirme' },
  };
  const c = config[statut] ?? { bg: 'bg-gray-50', text: 'text-gray-600', label: statut };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export function ContractsList({ userId, supabase }: ContractsListProps) {
  // Recuperer tous les contrats de l'utilisateur
  const { data: contrats, isLoading } = useQuery({
    queryKey: ['dashboard', 'contrats-all', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contrats')
        .select(`
          *,
          annonces(ville, type_annonce, date_debut, date_fin)
        `)
        .or(`titulaire_id.eq.${userId},remplacant_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Array<
        Contrat & {
          annonces: {
            ville: string;
            type_annonce: string;
            date_debut: string;
            date_fin: string;
          } | null;
        }
      >;
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

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
      <h2 className="text-lg font-bold text-gray-900 mb-6">Mes contrats</h2>

      {(!contrats || contrats.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">Aucun contrat pour le moment</p>
          <p className="text-xs text-gray-400 mt-1">
            Apres l&apos;acceptation d&apos;une candidature, generez le contrat depuis l&apos;onglet
            Candidatures
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* En-tete */}
          <div className="hidden md:grid grid-cols-[80px_1fr_1fr_120px_100px_100px] gap-4 px-5 py-3 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Ref
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Annonce
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Partie
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Dates
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Statut
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </span>
          </div>

          {/* Lignes */}
          {contrats.map((contrat) => {
            const isTitulaire = contrat.titulaire_id === userId;
            const otherParty = isTitulaire
              ? contrat.donnees?.remplacant
              : contrat.donnees?.titulaire;
            const otherName = otherParty
              ? `${otherParty.first_name} ${otherParty.last_name}`
              : 'Inconnu';

            // Determiner si c'est au tour de l'utilisateur de signer
            const canSign =
              contrat.statut === 'en_attente_remplacant' && !isTitulaire;

            return (
              <div
                key={contrat.id}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_120px_100px_100px] gap-2 md:gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                {/* Reference (6 premiers chars) */}
                <div className="text-xs font-mono text-gray-500">
                  #{contrat.id.slice(0, 6).toUpperCase()}
                </div>

                {/* Annonce */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contrat.annonces?.ville ?? 'Annonce'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {contrat.annonces?.type_annonce ?? ''}
                  </p>
                </div>

                {/* Autre partie */}
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 truncate">{otherName}</p>
                  <p className="text-xs text-gray-400">
                    {isTitulaire ? 'Remplacant' : 'Titulaire'}
                  </p>
                </div>

                {/* Dates */}
                <div className="text-xs text-gray-500">
                  {contrat.annonces?.date_debut
                    ? new Date(contrat.annonces.date_debut).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      })
                    : '—'}
                  {' - '}
                  {contrat.annonces?.date_fin
                    ? new Date(contrat.annonces.date_fin).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      })
                    : '—'}
                </div>

                {/* Statut */}
                <div>
                  <ContratStatusBadge statut={contrat.statut} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5">
                  {canSign && (
                    <Link
                      href={`/contrat/${contrat.id}`}
                      className="bg-[#ff7c5c] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#e86c4c] transition-colors"
                    >
                      Signer
                    </Link>
                  )}
                  <Link
                    href={`/contrat/${contrat.id}`}
                    className="text-[11px] font-medium text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
