'use client';

// Page detail contrat — affichage complet, edition clauses, double signature, PDF
// Adapte selon le statut du contrat et le role de l'utilisateur connecte

import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  useConfirmContrat,
  useUpdateClausesOptionnelles,
  queryKeys,
} from '@jim/shared';
import type { Contrat, ContratClause, ContratStatut } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { ContractClauses } from './contract-clauses';
import { SignButton } from './sign-button';

interface ContractDetailProps {
  contratId: string;
}

// Formate une date ISO en date francaise lisible (ex: "15/06/2026 a 14:32")
function formatDateFr(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${date} a ${time}`;
  } catch {
    return iso;
  }
}

// Formate une date ISO en date longue (ex: "15 juin 2026")
function formatDateLong(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// Badge de statut du contrat
function StatusBadge({ statut }: { statut: ContratStatut }) {
  const config: Record<ContratStatut, { bg: string; text: string; label: string }> = {
    brouillon: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Brouillon' },
    en_attente_remplacant: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      label: 'En attente de signature',
    },
    confirme: { bg: 'bg-green-50', text: 'text-green-700', label: 'Confirme' },
  };
  const c = config[statut];
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

// Generation HTML pour impression PDF (alternative web a expo-print)
function buildContractHtml(contrat: Contrat): string {
  const { donnees, clauses_obligatoires, clauses_optionnelles } = contrat;

  // Construction des clauses en HTML
  let articleIdx = 0;
  const buildClause = (clause: ContratClause, locked: boolean): string => {
    articleIdx += 1;
    const icon = locked ? '&#128274;' : '&#9998;';
    return `
      <div style="border-left:4px solid ${locked ? '#d1d5db' : '#ff7c5c'};padding:12px 16px;margin-bottom:12px;border-radius:0 8px 8px 0;background:${locked ? '#f9fafb' : '#fff7f5'};">
        <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;margin-bottom:4px;">
          ${icon} Article ${articleIdx}
        </div>
        <div style="font-size:13px;font-weight:600;color:#1f2937;margin-bottom:4px;">
          ${clause.titre}
        </div>
        <div style="font-size:12px;color:#4b5563;line-height:1.7;white-space:pre-wrap;">
          ${clause.contenu}
        </div>
      </div>
    `;
  };

  const clausesObligatoiresHtml = clauses_obligatoires
    .map((c) => buildClause(c, true))
    .join('');
  const clausesOptionnellesHtml = clauses_optionnelles
    .map((c) => buildClause(c, false))
    .join('');

  // Signatures
  const sigTitulaire = contrat.confirme_par_titulaire_at
    ? `Signe le ${formatDateFr(contrat.confirme_par_titulaire_at)}`
    : 'En attente de signature';
  const sigRemplacant = contrat.confirme_par_remplacant_at
    ? `Signe le ${formatDateFr(contrat.confirme_par_remplacant_at)}`
    : 'En attente de signature';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Contrat de remplacement — JIM</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Manrope', system-ui, sans-serif; color: #1f2937; background: #fff; }
    @page { size: A4; margin: 20mm; }
    @media print {
      body { background: #fff; }
      .page { padding: 0; max-width: none; }
      .no-print { display: none !important; }
    }
    .page { max-width: 780px; margin: 0 auto; padding: 40px 32px; }
    .header { border-bottom: 3px solid #ff7c5c; padding-bottom: 16px; margin-bottom: 32px; text-align: center; }
    .header h1 { font-size: 20px; font-weight: 800; color: #1f2937; letter-spacing: 0.05em; text-transform: uppercase; }
    .header .subtitle { font-size: 11px; color: #6b7280; margin-top: 4px; }
    .header .ref { font-size: 10px; color: #9ca3af; font-family: monospace; margin-top: 8px; }
    .section-title { font-size: 12px; font-weight: 700; color: #1f2937; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin: 28px 0 14px 0; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .party-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
    .party-label { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .party-name { font-size: 14px; font-weight: 700; color: #1f2937; }
    .party-rpps { font-size: 11px; color: #6b7280; margin-top: 2px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .detail-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
    .detail-label { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; }
    .detail-value { font-size: 13px; font-weight: 600; color: #1f2937; margin-top: 2px; }
    .retro-box { background: #fff7ed; border: 2px solid #ff7c5c; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .retro-label { font-size: 10px; font-weight: 700; color: #ff7c5c; text-transform: uppercase; letter-spacing: 0.08em; }
    .retro-value { font-size: 28px; font-weight: 800; color: #ea580c; margin-top: 4px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
    .sig-block { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center; }
    .sig-label { font-size: 10px; color: #9ca3af; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
    .sig-name { font-size: 13px; font-weight: 700; color: #1f2937; }
    .sig-date { font-size: 11px; color: #6b7280; margin-top: 4px; }
    .sig-check { color: #16a34a; font-size: 16px; margin-top: 6px; }
    .disclaimer { margin-top: 40px; padding: 14px; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; font-size: 9px; color: #78350f; line-height: 1.7; }
    .disclaimer strong { display: block; font-size: 10px; margin-bottom: 4px; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>Contrat de remplacement liberal</h1>
      <div class="subtitle">Genere via JIM &mdash; Job In Med &bull; Template v${donnees.template_version}</div>
      <div class="ref">REF : ${contrat.id.slice(0, 8).toUpperCase()} &bull; Cree le ${formatDateLong(contrat.created_at)}</div>
    </div>

    <div class="section-title">Parties au contrat</div>
    <div class="parties">
      <div class="party-card">
        <div class="party-label">Titulaire (cabinet)</div>
        <div class="party-name">${donnees.titulaire.first_name} ${donnees.titulaire.last_name}</div>
        <div class="party-rpps">RPPS : ${donnees.titulaire.rpps}</div>
      </div>
      <div class="party-card">
        <div class="party-label">Remplacant</div>
        <div class="party-name">${donnees.remplacant.first_name} ${donnees.remplacant.last_name}</div>
        <div class="party-rpps">RPPS : ${donnees.remplacant.rpps}</div>
      </div>
    </div>

    <div class="section-title">Details du remplacement</div>
    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Date de debut</div>
        <div class="detail-value">${formatDateLong(donnees.dates.debut)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Date de fin</div>
        <div class="detail-value">${formatDateLong(donnees.dates.fin)}</div>
      </div>
    </div>
    <div class="detail-item" style="margin-bottom:16px;">
      <div class="detail-label">Adresse du cabinet</div>
      <div class="detail-value">${donnees.adresse_cabinet}</div>
    </div>
    <div class="retro-box">
      <div class="retro-label">Taux de retrocession convenu</div>
      <div class="retro-value">${donnees.taux_retrocession} %</div>
    </div>

    ${clauses_obligatoires.length > 0 ? `<div class="section-title">Clauses obligatoires</div>${clausesObligatoiresHtml}` : ''}
    ${clauses_optionnelles.length > 0 ? `<div class="section-title">Clauses complementaires</div>${clausesOptionnellesHtml}` : ''}

    <div class="section-title">Signatures electroniques</div>
    <div class="signatures">
      <div class="sig-block">
        <div class="sig-label">Titulaire</div>
        <div class="sig-name">${donnees.titulaire.first_name} ${donnees.titulaire.last_name}</div>
        <div class="sig-date">${sigTitulaire}</div>
        ${contrat.confirme_par_titulaire_at ? '<div class="sig-check">&#10004;</div>' : ''}
      </div>
      <div class="sig-block">
        <div class="sig-label">Remplacant</div>
        <div class="sig-name">${donnees.remplacant.first_name} ${donnees.remplacant.last_name}</div>
        <div class="sig-date">${sigRemplacant}</div>
        ${contrat.confirme_par_remplacant_at ? '<div class="sig-check">&#10004;</div>' : ''}
      </div>
    </div>

    <div class="disclaimer">
      <strong>Avertissement reglementaire important</strong>
      Ce document a ete genere automatiquement a titre informatif par la plateforme JIM &mdash; Job In Med.
      Il ne constitue pas un acte juridique opposable en l'etat. Conformement aux reglementations
      applicables aux professionnels de sante (Code de la Sante Publique, regles de l'Ordre des
      Masseurs-Kinesitherapeutes), ce contrat doit etre valide par un professionnel du droit avant
      toute signature definitive. JIM decline toute responsabilite quant a l'utilisation de ce document
      sans verification juridique prealable. Donnees personnelles traitees conformement au RGPD.
    </div>

    <div class="footer">
      JIM &mdash; Job In Med &bull; Contrat #${contrat.id} &bull; Genere le ${formatDateLong(new Date().toISOString())}
    </div>
  </div>
</body>
</html>`;
}

// Telecharger le contrat en PDF via impression navigateur
function handleDownloadPdf(contrat: Contrat) {
  const html = buildContractHtml(contrat);
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.print();
  }
}

export function ContractDetail({ contratId }: ContractDetailProps) {
  const { supabase, user } = useAuthContext();
  const queryClient = useQueryClient();

  // Recuperation du contrat par ID
  const {
    data: contrat,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.contrats.detail(contratId),
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from('contrats')
        .select('*')
        .eq('id', contratId)
        .maybeSingle();
      if (fetchError) throw new Error(fetchError.message);
      return data as Contrat | null;
    },
    enabled: !!contratId,
    staleTime: 15_000,
  });

  // Mutation : confirmer le contrat (signer)
  const confirmMutation = useConfirmContrat(supabase);

  // Mutation : mettre a jour les clauses optionnelles
  const updateClausesMutation = useUpdateClausesOptionnelles(supabase);

  // Determination du role de l'utilisateur
  const isTitulaire = user?.id === contrat?.titulaire_id;
  const isRemplacant = user?.id === contrat?.remplacant_id;

  // Indicateur : clauses optionnelles editables
  const canEditClauses = contrat?.statut === 'brouillon' && isTitulaire;

  // Handler signature
  const handleSign = useCallback(() => {
    if (!contrat) return;
    confirmMutation.mutate(
      { contratId: contrat.id, candidatureId: contrat.candidature_id },
      {
        onSuccess: () => {
          // Rafraichir le contrat apres signature
          void queryClient.invalidateQueries({
            queryKey: queryKeys.contrats.detail(contratId),
          });
        },
      },
    );
  }, [contrat, confirmMutation, queryClient, contratId]);

  // Handler sauvegarde clauses optionnelles
  const handleSaveClauses = useCallback(
    (clauses: ContratClause[]) => {
      if (!contrat) return;
      updateClausesMutation.mutate(
        {
          contratId: contrat.id,
          candidatureId: contrat.candidature_id,
          clauses,
        },
        {
          onSuccess: () => {
            void queryClient.invalidateQueries({
              queryKey: queryKeys.contrats.detail(contratId),
            });
          },
        },
      );
    },
    [contrat, updateClausesMutation, queryClient, contratId],
  );

  // Texte du role de l'utilisateur
  const roleLabel = useMemo(() => {
    if (isTitulaire) return 'Titulaire';
    if (isRemplacant) return 'Remplacant';
    return null;
  }, [isTitulaire, isRemplacant]);

  // --- ETATS DE CHARGEMENT / ERREUR ---

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff7c5c] border-t-transparent" />
          <span className="text-sm text-gray-500">Chargement du contrat...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-12 text-center">
          <p className="text-sm text-red-600 font-medium">Erreur lors du chargement du contrat</p>
          <p className="text-xs text-red-400 mt-1">{error.message}</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 text-sm font-semibold text-[#ff7c5c] hover:underline"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  if (!contrat) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-sm text-gray-500">Contrat introuvable</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 text-sm font-semibold text-[#ff7c5c] hover:underline"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  // Acces interdit si l'utilisateur n'est ni titulaire ni remplacant
  if (!isTitulaire && !isRemplacant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-12 text-center">
          <p className="text-sm text-red-600 font-medium">
            Vous n&apos;avez pas acces a ce contrat.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 text-sm font-semibold text-[#ff7c5c] hover:underline"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const { donnees } = contrat;

  return (
    <div className="min-h-screen bg-[#fdf6ed]">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Navigation retour + meta */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            Tableau de bord
          </Link>
          {roleLabel && (
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              Connecte en tant que {roleLabel}
            </span>
          )}
        </div>

        {/* En-tete du contrat */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                Contrat de remplacement liberal
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-1">
                REF : {contrat.id.slice(0, 8).toUpperCase()} &bull; Cree le{' '}
                {formatDateLong(contrat.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge statut={contrat.statut} />
              {contrat.statut === 'confirme' && (
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(contrat)}
                  className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                  </svg>
                  Telecharger PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Parties au contrat — deux colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Titulaire */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Titulaire (cabinet)
            </p>
            <p className="text-base font-bold text-gray-900">
              {donnees.titulaire.first_name} {donnees.titulaire.last_name}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              RPPS : {donnees.titulaire.rpps}
            </p>
            {contrat.confirme_par_titulaire_at && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                    clipRule="evenodd"
                  />
                </svg>
                Signe le {formatDateFr(contrat.confirme_par_titulaire_at)}
              </div>
            )}
          </div>

          {/* Remplacant */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Remplacant
            </p>
            <p className="text-base font-bold text-gray-900">
              {donnees.remplacant.first_name} {donnees.remplacant.last_name}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              RPPS : {donnees.remplacant.rpps}
            </p>
            {contrat.confirme_par_remplacant_at && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                    clipRule="evenodd"
                  />
                </svg>
                Signe le {formatDateFr(contrat.confirme_par_remplacant_at)}
              </div>
            )}
          </div>
        </div>

        {/* Details du remplacement */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Details du remplacement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Date de debut
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatDateLong(donnees.dates.debut)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Date de fin
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatDateLong(donnees.dates.fin)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Adresse du cabinet
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {donnees.adresse_cabinet}
              </p>
            </div>
          </div>

          {/* Taux de retrocession mis en avant */}
          <div className="mt-5 bg-[#fff7ed] border-2 border-[#ff7c5c]/30 rounded-xl p-4 text-center">
            <p className="text-[10px] font-bold text-[#ff7c5c] uppercase tracking-widest">
              Taux de retrocession convenu
            </p>
            <p className="text-3xl font-extrabold text-[#ea580c] mt-1">
              {donnees.taux_retrocession} %
            </p>
          </div>
        </div>

        {/* Clauses contractuelles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
            Clauses du contrat
          </h2>
          <ContractClauses
            clausesObligatoires={contrat.clauses_obligatoires}
            clausesOptionnelles={contrat.clauses_optionnelles}
            editable={!!canEditClauses}
            onSave={handleSaveClauses}
            isSaving={updateClausesMutation.isPending}
          />
        </div>

        {/* Section signatures */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
            Signatures
          </h2>

          {/* Affichage des signatures existantes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Signature titulaire */}
            <div
              className={`rounded-xl p-4 border ${
                contrat.confirme_par_titulaire_at
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Titulaire
              </p>
              {contrat.confirme_par_titulaire_at ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">
                    Signe par {donnees.titulaire.first_name} {donnees.titulaire.last_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Le {formatDateFr(contrat.confirme_par_titulaire_at)}
                  </p>
                  <div className="mt-2 text-green-600 text-lg">&#10003;</div>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">En attente de signature</p>
              )}
            </div>

            {/* Signature remplacant */}
            <div
              className={`rounded-xl p-4 border ${
                contrat.confirme_par_remplacant_at
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Remplacant
              </p>
              {contrat.confirme_par_remplacant_at ? (
                <>
                  <p className="text-sm font-semibold text-gray-900">
                    Signe par {donnees.remplacant.first_name} {donnees.remplacant.last_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Le {formatDateFr(contrat.confirme_par_remplacant_at)}
                  </p>
                  <div className="mt-2 text-green-600 text-lg">&#10003;</div>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">En attente de signature</p>
              )}
            </div>
          </div>

          {/* CTA contextuel de signature */}
          <SignButton
            contrat={contrat}
            currentUserId={user?.id ?? ''}
            onSign={handleSign}
            isLoading={confirmMutation.isPending}
          />

          {/* Prochaines etapes apres confirmation */}
          {contrat.statut === 'confirme' && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Prochaines etapes
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {isTitulaire && (
                  <Link
                    href="/dashboard?tab=paiements"
                    className="flex-1 bg-[#ff7c5c] text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-[#e86c4c] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M1 4.25a3.733 3.733 0 0 1 2.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0 0 16.75 2H3.25A2.25 2.25 0 0 0 1 4.25ZM1 7.25a3.733 3.733 0 0 1 2.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0 0 16.75 5H3.25A2.25 2.25 0 0 0 1 7.25ZM7 8a1 1 0 0 0-1 1v.5a2.5 2.5 0 0 0 2.5 2.5h.5v.5a.5.5 0 0 0 1 0V12h.5a2.5 2.5 0 0 0 2.5-2.5V9a1 1 0 0 0-1-1H7Z" />
                      <path d="M1.75 10.25a.75.75 0 0 0-.75.75v4.75A2.25 2.25 0 0 0 3.25 18h13.5a2.25 2.25 0 0 0 2.25-2.25V11a.75.75 0 0 0-.75-.75H1.75Z" />
                    </svg>
                    Creer le versement
                  </Link>
                )}
                <Link
                  href="/messages"
                  className="flex-1 bg-white border border-gray-200 text-gray-700 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 0 0 1.33 0l1.713-3.293a.783.783 0 0 1 .642-.413 41.102 41.102 0 0 0 3.55-.414c1.437-.232 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ouvrir la messagerie
                </Link>
              </div>
              {isTitulaire && (
                <p className="text-[11px] text-gray-400 mt-3 text-center sm:text-left">
                  Le remplacant aura 7 jours pour valider le versement apres sa creation.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Erreurs mutations */}
        {confirmMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Erreur lors de la signature : {confirmMutation.error.message}
          </div>
        )}
        {updateClausesMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Erreur lors de la sauvegarde des clauses : {updateClausesMutation.error.message}
          </div>
        )}

        {/* Avertissement reglementaire */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-xs font-bold text-amber-800 mb-1">
            Avertissement reglementaire
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Ce document a ete genere automatiquement a titre informatif par la plateforme JIM. Il ne
            constitue pas un acte juridique opposable en l&apos;etat. Conformement aux reglementations
            applicables, ce contrat doit etre valide par un professionnel du droit avant toute
            signature definitive.
          </p>
        </div>
      </div>
    </div>
  );
}
