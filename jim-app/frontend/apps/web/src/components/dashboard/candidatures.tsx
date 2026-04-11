'use client';

// Gestion des candidatures — vue differenciee titulaire/remplacant
// Titulaire : candidatures recues avec actions accepter/refuser + generer/voir contrat + contacter
// Remplacant : candidatures envoyees avec retrait / voir contrat / contacter

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  useMesCandidatures,
  useProcessCandidature,
  useWithdrawCandidature,
  useGenerateContrat,
} from '@jim/shared';
import type { SupabaseClient } from '@jim/shared';
import type { CandidatureRow } from '@jim/shared/validators/candidature.schema';

interface CandidaturesProps {
  role: 'titulaire' | 'remplacant';
  userId: string;
  supabase: SupabaseClient;
}

// Badge statut candidature
function StatusBadge({ statut }: { statut: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    en_attente: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
    vue: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Vue' },
    en_discussion: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'En discussion' },
    acceptee: { bg: 'bg-green-50', text: 'text-green-700', label: 'Acceptee' },
    refusee: { bg: 'bg-red-50', text: 'text-red-700', label: 'Refusee' },
    refusee_auto: { bg: 'bg-red-50', text: 'text-red-700', label: 'Refusee' },
    retiree: { bg: 'bg-gray-50', text: 'text-gray-600', label: 'Retiree' },
    expiree: { bg: 'bg-gray-50', text: 'text-gray-500', label: 'Expiree' },
  };
  const c = config[statut] ?? { bg: 'bg-gray-50', text: 'text-gray-600', label: statut };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ─── Vue Titulaire : candidatures recues ────────────────────────────────────────
function TitulaireCandidatures({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SupabaseClient;
}) {
  const processCandidature = useProcessCandidature(supabase);
  const generateContrat = useGenerateContrat(supabase);

  // Candidatures recues sur toutes les annonces du titulaire
  const { data: candidatures, isLoading } = useQuery({
    queryKey: ['dashboard', 'candidatures-recues-all', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          *,
          profiles!candidatures_remplacant_id_fkey(first_name, last_name),
          annonces!inner(profile_id, ville, type_annonce)
        `)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      // Filtrer sur les annonces du titulaire
      return ((data ?? []) as Array<
        CandidatureRow & {
          profiles: { first_name: string; last_name: string } | null;
          annonces: { profile_id: string; ville: string; type_annonce: string };
        }
      >).filter((c) => c.annonces?.profile_id === userId);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  // Recupere les contrats lies aux candidatures acceptees pour savoir si un contrat existe deja
  const acceptedIds = (candidatures ?? [])
    .filter((c) => c.statut === 'acceptee')
    .map((c) => c.id);

  const { data: contratsByCandidature } = useQuery({
    queryKey: ['dashboard', 'contrats-by-candidature', acceptedIds.join(',')],
    queryFn: async () => {
      if (acceptedIds.length === 0) return {} as Record<string, string>;
      const { data, error } = await supabase
        .from('contrats')
        .select('id, candidature_id')
        .in('candidature_id', acceptedIds);
      if (error) throw new Error(error.message);
      const map: Record<string, string> = {};
      for (const c of data ?? []) {
        if (c.candidature_id) map[c.candidature_id] = c.id;
      }
      return map;
    },
    enabled: acceptedIds.length > 0,
    staleTime: 30_000,
  });

  function handleProcess(candidatureId: string, annonceId: string, action: 'accepter' | 'refuser') {
    processCandidature.mutate({
      candidature_id: candidatureId,
      annonce_id: annonceId,
      action,
    });
  }

  function handleGenerate(candidatureId: string) {
    generateContrat.mutate(candidatureId);
  }

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
      <h2 className="text-lg font-bold text-gray-900 mb-6">Candidatures recues</h2>

      {(!candidatures || candidatures.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">Aucune candidature recue pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* En-tete */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_100px_100px_220px] gap-4 px-5 py-3 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Remplacant
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Annonce
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Date
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Statut
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </span>
          </div>

          {/* Lignes */}
          {candidatures.map((c) => {
            const existingContratId = contratsByCandidature?.[c.id];
            return (
            <div
              key={c.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_100px_220px] gap-2 md:gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {c.profiles?.first_name ?? 'Anonyme'} {c.profiles?.last_name ?? ''}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-600 truncate">
                  {c.annonces?.type_annonce === 'remplacement'
                    ? `Remplacement a ${c.annonces?.ville}`
                    : c.annonces?.ville ?? ''}
                </p>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(c.created_at).toLocaleDateString('fr-FR')}
              </div>
              <div>
                <StatusBadge statut={c.statut} />
              </div>
              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                {c.statut === 'en_attente' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleProcess(c.id, c.annonce_id, 'accepter')}
                      disabled={processCandidature.isPending}
                      className="bg-green-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      Accepter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProcess(c.id, c.annonce_id, 'refuser')}
                      disabled={processCandidature.isPending}
                      className="bg-red-50 text-red-600 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Refuser
                    </button>
                  </>
                ) : c.statut === 'acceptee' ? (
                  <>
                    {existingContratId ? (
                      <Link
                        href={`/contrat/${existingContratId}`}
                        className="bg-[#ff7c5c] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#e86c4c] transition-colors"
                      >
                        Voir contrat
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleGenerate(c.id)}
                        disabled={
                          generateContrat.isPending &&
                          generateContrat.variables === c.id
                        }
                        className="bg-[#ff7c5c] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#e86c4c] transition-colors disabled:opacity-50"
                      >
                        {generateContrat.isPending && generateContrat.variables === c.id
                          ? 'Generation...'
                          : 'Generer contrat'}
                      </button>
                    )}
                    <Link
                      href="/messages"
                      className="text-[11px] font-semibold text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Contacter
                    </Link>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Vue Remplacant : candidatures envoyees ─────────────────────────────────────
function RemplacantCandidatures({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SupabaseClient;
}) {
  const { data: candidatures, isLoading } = useMesCandidatures(supabase, userId);
  const withdrawCandidature = useWithdrawCandidature(supabase);

  // Recupere les contrats pour les candidatures acceptees
  const acceptedIds = (candidatures ?? [])
    .filter((c) => c.statut === 'acceptee')
    .map((c) => c.id);

  const { data: contratsByCandidature } = useQuery({
    queryKey: ['dashboard', 'contrats-by-candidature-remplacant', acceptedIds.join(',')],
    queryFn: async () => {
      if (acceptedIds.length === 0) return {} as Record<string, string>;
      const { data, error } = await supabase
        .from('contrats')
        .select('id, candidature_id')
        .in('candidature_id', acceptedIds);
      if (error) throw new Error(error.message);
      const map: Record<string, string> = {};
      for (const c of data ?? []) {
        if (c.candidature_id) map[c.candidature_id] = c.id;
      }
      return map;
    },
    enabled: acceptedIds.length > 0,
    staleTime: 30_000,
  });

  function handleWithdraw(candidatureId: string) {
    if (!confirm('Voulez-vous vraiment retirer cette candidature ?')) return;
    withdrawCandidature.mutate(candidatureId);
  }

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
      <h2 className="text-lg font-bold text-gray-900 mb-6">Mes candidatures</h2>

      {(!candidatures || candidatures.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">
            Vous n&apos;avez pas encore postule a une annonce
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* En-tete */}
          <div className="hidden md:grid grid-cols-[1fr_100px_100px_220px] gap-4 px-5 py-3 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Annonce
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Date
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Statut
            </span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </span>
          </div>

          {/* Lignes */}
          {candidatures.map((c) => {
            const annonce = c.annonces as Record<string, unknown> | null;
            const existingContratId = contratsByCandidature?.[c.id];
            return (
              <div
                key={c.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_220px] gap-2 md:gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {(annonce?.ville as string) ?? 'Annonce'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {annonce?.retrocession != null && `${annonce.retrocession as number}% retro`}
                  </p>
                </div>
                <div className="text-xs text-gray-500 self-center">
                  {new Date(c.created_at).toLocaleDateString('fr-FR')}
                </div>
                <div className="self-center">
                  <StatusBadge statut={c.statut} />
                </div>
                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                  {c.statut === 'en_attente' ? (
                    <button
                      type="button"
                      onClick={() => handleWithdraw(c.id)}
                      disabled={withdrawCandidature.isPending}
                      className="text-red-500 text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Retirer
                    </button>
                  ) : c.statut === 'acceptee' ? (
                    <>
                      {existingContratId && (
                        <Link
                          href={`/contrat/${existingContratId}`}
                          className="bg-[#ff7c5c] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#e86c4c] transition-colors"
                        >
                          Voir contrat
                        </Link>
                      )}
                      <Link
                        href="/messages"
                        className="text-[11px] font-semibold text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Contacter
                      </Link>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export function Candidatures({ role, userId, supabase }: CandidaturesProps) {
  if (role === 'titulaire') {
    return <TitulaireCandidatures userId={userId} supabase={supabase} />;
  }
  return <RemplacantCandidatures userId={userId} supabase={supabase} />;
}
