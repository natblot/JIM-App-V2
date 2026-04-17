'use client';

// Gestion des annonces du titulaire — liste, statut, actions
// Onglet "Mes annonces" du dashboard

import { useRouter } from 'next/navigation';
import { Plus, Eye, Pencil, XCircle } from 'lucide-react';
import { useMyAnnonces, useUpdateAnnonce } from '@jim/shared';
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '@jim/shared';
import type { AnnonceRow } from '@jim/shared/validators/annonce.schema';

interface MyListingsProps {
  supabase: SupabaseClient;
}

// Badge statut annonce
function AnnonceStatusBadge({ statut }: { statut: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-green-50', text: 'text-green-700', label: 'Active' },
    en_cours: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En cours' },
    non_confirmee: { bg: 'bg-orange-50', text: 'text-orange-600', label: 'Non confirmee' },
    pourvue: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Pourvue' },
    expiree: { bg: 'bg-gray-50', text: 'text-gray-500', label: 'Expiree' },
    source_externe: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Externe' },
  };
  const c = config[statut] ?? { bg: 'bg-gray-50', text: 'text-gray-600', label: statut };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export function MyListings({ supabase }: MyListingsProps) {
  const router = useRouter();
  const { data: annonces, isLoading } = useMyAnnonces(supabase);
  const updateAnnonce = useUpdateAnnonce(supabase);

  // Compter les candidatures par annonce (batch query)
  const annonceIds = annonces?.map((a) => a.id) ?? [];
  const { data: candidatureCounts } = useQuery({
    queryKey: ['dashboard', 'candidature-counts', annonceIds],
    queryFn: async () => {
      if (annonceIds.length === 0) return {};
      const { data, error } = await supabase
        .from('candidatures')
        .select('annonce_id')
        .in('annonce_id', annonceIds);
      if (error) throw new Error(error.message);
      // Compter par annonce_id
      const counts: Record<string, number> = {};
      for (const row of data ?? []) {
        const aid = row.annonce_id as string;
        counts[aid] = (counts[aid] ?? 0) + 1;
      }
      return counts;
    },
    enabled: annonceIds.length > 0,
    staleTime: 30_000,
  });

  // Fermer une annonce (passer en "pourvue")
  function handleClose(annonce: AnnonceRow) {
    if (!confirm('Voulez-vous vraiment cloturer cette annonce ?')) return;
    updateAnnonce.mutate({ id: annonce.id, statut: 'pourvue' });
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff7c5c] border-t-transparent" />
          <span className="text-sm">Chargement des annonces...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header avec bouton publier */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Mes annonces</h2>
        <button
          type="button"
          onClick={() => router.push('/publier')}
          className="flex items-center gap-2 bg-[#ff7c5c] text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-[#e86c4c] transition-colors"
        >
          <Plus size={16} />
          Publier une annonce
        </button>
      </div>

      {/* Etat vide */}
      {(!annonces || annonces.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#ff7c5c]/10 flex items-center justify-center mx-auto mb-4">
            <Plus size={28} className="text-[#ff7c5c]" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">
            Vous n&apos;avez pas encore publie d&apos;annonce
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Publiez votre premiere annonce pour trouver un remplacant
          </p>
          <button
            type="button"
            onClick={() => router.push('/publier')}
            className="bg-[#ff7c5c] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#e86c4c] transition-colors"
          >
            Publier une annonce
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* En-tete du tableau */}
          <div className="hidden md:grid grid-cols-[1fr_120px_100px_100px_140px] gap-4 px-5 py-3 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Annonce
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Dates
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Statut
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
              Candidatures
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </span>
          </div>

          {/* Lignes */}
          {annonces.map((annonce) => (
            <div
              key={annonce.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_100px_140px] gap-2 md:gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              {/* Titre + ville */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {annonce.type_annonce === 'remplacement'
                    ? `Remplacement a ${annonce.ville}`
                    : `${annonce.type_annonce.charAt(0).toUpperCase() + annonce.type_annonce.slice(1)} a ${annonce.ville}`}
                </p>
                <p className="text-xs text-gray-500">
                  {annonce.retrocession}% retrocession
                  {annonce.is_urgent && (
                    <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 uppercase">
                      Urgent
                    </span>
                  )}
                </p>
              </div>

              {/* Dates */}
              <div className="text-xs text-gray-600">
                <span className="md:hidden text-gray-400 mr-1">Dates :</span>
                {new Date(annonce.date_debut).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                })}
                {' - '}
                {new Date(annonce.date_fin).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </div>

              {/* Statut */}
              <div>
                <AnnonceStatusBadge statut={annonce.statut} />
              </div>

              {/* Nb candidatures */}
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-900">
                  {candidatureCounts?.[annonce.id] ?? 0}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => router.push(`/annonce/${annonce.id}`)}
                  title="Voir l'annonce"
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <Eye size={16} />
                </button>
                {annonce.statut === 'active' && (
                  <>
                    <button
                      type="button"
                      onClick={() => router.push(`/annonce/${annonce.id}`)}
                      title="Modifier"
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClose(annonce)}
                      title="Cloturer"
                      disabled={updateAnnonce.isPending}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
