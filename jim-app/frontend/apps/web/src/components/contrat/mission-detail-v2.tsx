'use client';

// Detail mission V2 — port du design `ui_kits/web/mission-detail-v2.html`
// (template jim-design-system, handoff Claude Design du 11/06/2026).
// Layout : en-tete mission + 4 hero stats + parcours 6 etapes + 3 mini-cartes
// (Contrat / Transmissions / Messagerie). Le detail riche s'ouvre en overlay.
// Donnees reelles : contrat Supabase (parties, dates, retrocession, clauses,
// signatures). Hors scope design (pas de donnees) : net estime, patients, chat IA.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  FileSignature,
  GitCommitHorizontal,
  KeyRound,
  Landmark,
  Lock,
  MapPin,
  MessagesSquare,
  PenTool,
  Percent,
  Route,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  useConfirmContrat,
  useUpdateClausesOptionnelles,
  queryKeys,
} from '@jim/shared';
import type { Contrat, ContratClause, ContratStatut } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { ContractClauses } from './contract-clauses';
import { SignButton } from './sign-button';

interface MissionDetailV2Props {
  contratId: string;
}

type OverlayPanel = 'contrat' | 'transmissions' | null;

const DAY_MS = 86_400_000;

// ─── Helpers dates ───────────────────────────────────────────

// Formate une date ISO en date francaise lisible (ex: "15/06/2026 a 14:32")
function formatDateFr(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${date} à ${time}`;
  } catch {
    return iso;
  }
}

// Formate une date ISO en date longue (ex: "15 juin 2026")
function formatDateLong(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

// Formate une date ISO en court (ex: "12 mai")
function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

// Jour + mois pour la datechip (ex: { dd: "12", mm: "Mai" })
function dayChip(iso: string): { dd: string; mm: string } {
  try {
    const d = new Date(iso);
    return {
      dd: String(d.getDate()),
      mm: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
    };
  } catch {
    return { dd: '–', mm: '' };
  }
}

function initialsOf(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
}

// ─── Statut → pill d'etat (palette chaude DA) ────────────────
const STATUS_META: Record<ContratStatut, { lbl: string; bg: string; fg: string }> = {
  brouillon: { lbl: 'Contrat en préparation', bg: '#fbf0dc', fg: '#b07824' },
  en_attente_remplacant: { lbl: 'Contrat à signer', bg: '#fbf0dc', fg: '#b07824' },
  confirme: { lbl: 'Contrat confirmé', bg: '#eaf3eb', fg: '#5d8f66' },
};

// ─── Generation HTML pour impression PDF (reprise de l'existant) ─
function buildContractHtml(contrat: Contrat): string {
  const { donnees, clauses_obligatoires, clauses_optionnelles } = contrat;

  let articleIdx = 0;
  const buildClause = (clause: ContratClause, locked: boolean): string => {
    articleIdx += 1;
    const icon = locked ? '&#128274;' : '&#9998;';
    return `
      <div style="border-left:4px solid ${locked ? '#dcbfa0' : '#ff7c5c'};padding:12px 16px;margin-bottom:12px;border-radius:0 8px 8px 0;background:${locked ? '#fbf0e8' : '#fff0ea'};">
        <div style="font-size:10px;font-weight:700;color:#7a5434;text-transform:uppercase;margin-bottom:4px;">
          ${icon} Article ${articleIdx}
        </div>
        <div style="font-size:13px;font-weight:600;color:#3a1f08;margin-bottom:4px;">
          ${clause.titre}
        </div>
        <div style="font-size:12px;color:#5a3418;line-height:1.7;white-space:pre-wrap;">
          ${clause.contenu}
        </div>
      </div>
    `;
  };

  const clausesObligatoiresHtml = clauses_obligatoires.map((c) => buildClause(c, true)).join('');
  const clausesOptionnellesHtml = clauses_optionnelles.map((c) => buildClause(c, false)).join('');

  const sigTitulaire = contrat.confirme_par_titulaire_at
    ? `Signé le ${formatDateFr(contrat.confirme_par_titulaire_at)}`
    : 'En attente de signature';
  const sigRemplacant = contrat.confirme_par_remplacant_at
    ? `Signé le ${formatDateFr(contrat.confirme_par_remplacant_at)}`
    : 'En attente de signature';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Contrat de remplacement — JIM</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Manrope', system-ui, sans-serif; color: #3a1f08; background: #fff; }
    @page { size: A4; margin: 20mm; }
    @media print {
      body { background: #fff; }
      .page { padding: 0; max-width: none; }
      .no-print { display: none !important; }
    }
    .page { max-width: 780px; margin: 0 auto; padding: 40px 32px; }
    .header { border-bottom: 3px solid #ff7c5c; padding-bottom: 16px; margin-bottom: 32px; text-align: center; }
    .header h1 { font-size: 20px; font-weight: 800; color: #3a1f08; letter-spacing: 0.05em; text-transform: uppercase; }
    .header .subtitle { font-size: 11px; color: #7a5434; margin-top: 4px; }
    .header .ref { font-size: 10px; color: #7a5434; font-family: monospace; margin-top: 8px; }
    .section-title { font-size: 12px; font-weight: 700; color: #3a1f08; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #edd9c4; padding-bottom: 6px; margin: 28px 0 14px 0; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .party-card { background: #fbf0e8; border: 1px solid #edd9c4; border-radius: 10px; padding: 16px; }
    .party-label { font-size: 9px; font-weight: 700; color: #7a5434; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .party-name { font-size: 14px; font-weight: 700; color: #3a1f08; }
    .party-rpps { font-size: 11px; color: #5a3418; margin-top: 2px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .detail-item { background: #fbf0e8; border: 1px solid #edd9c4; border-radius: 8px; padding: 12px; }
    .detail-label { font-size: 9px; font-weight: 700; color: #7a5434; text-transform: uppercase; letter-spacing: 0.08em; }
    .detail-value { font-size: 13px; font-weight: 600; color: #3a1f08; margin-top: 2px; }
    .retro-box { background: #fff0ea; border: 2px solid #ff7c5c; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .retro-label { font-size: 10px; font-weight: 700; color: #ff7c5c; text-transform: uppercase; letter-spacing: 0.08em; }
    .retro-value { font-size: 28px; font-weight: 800; color: #e06245; margin-top: 4px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
    .sig-block { border: 1px solid #edd9c4; border-radius: 10px; padding: 16px; text-align: center; }
    .sig-label { font-size: 10px; color: #7a5434; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
    .sig-name { font-size: 13px; font-weight: 700; color: #3a1f08; }
    .sig-date { font-size: 11px; color: #5a3418; margin-top: 4px; }
    .sig-check { color: #5d8f66; font-size: 16px; margin-top: 6px; }
    .disclaimer { margin-top: 40px; padding: 14px; background: #fbf0dc; border: 1px solid #edd9c4; border-radius: 8px; font-size: 9px; color: #5a3418; line-height: 1.7; }
    .disclaimer strong { display: block; font-size: 10px; margin-bottom: 4px; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #edd9c4; font-size: 9px; color: #7a5434; text-align: center; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>Contrat de remplacement libéral</h1>
      <div class="subtitle">Généré via JIM &mdash; Job In Med &bull; Template v${donnees.template_version}</div>
      <div class="ref">REF : ${contrat.id.slice(0, 8).toUpperCase()} &bull; Créé le ${formatDateLong(contrat.created_at)}</div>
    </div>

    <div class="section-title">Parties au contrat</div>
    <div class="parties">
      <div class="party-card">
        <div class="party-label">Titulaire (cabinet)</div>
        <div class="party-name">${donnees.titulaire.first_name} ${donnees.titulaire.last_name}</div>
        <div class="party-rpps">RPPS : ${donnees.titulaire.rpps}</div>
      </div>
      <div class="party-card">
        <div class="party-label">Remplaçant</div>
        <div class="party-name">${donnees.remplacant.first_name} ${donnees.remplacant.last_name}</div>
        <div class="party-rpps">RPPS : ${donnees.remplacant.rpps}</div>
      </div>
    </div>

    <div class="section-title">Détails du remplacement</div>
    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Date de début</div>
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
      <div class="retro-label">Taux de rétrocession convenu</div>
      <div class="retro-value">${donnees.taux_retrocession} %</div>
    </div>

    ${clauses_obligatoires.length > 0 ? `<div class="section-title">Clauses obligatoires</div>${clausesObligatoiresHtml}` : ''}
    ${clauses_optionnelles.length > 0 ? `<div class="section-title">Clauses complémentaires</div>${clausesOptionnellesHtml}` : ''}

    <div class="section-title">Signatures électroniques</div>
    <div class="signatures">
      <div class="sig-block">
        <div class="sig-label">Titulaire</div>
        <div class="sig-name">${donnees.titulaire.first_name} ${donnees.titulaire.last_name}</div>
        <div class="sig-date">${sigTitulaire}</div>
        ${contrat.confirme_par_titulaire_at ? '<div class="sig-check">&#10004;</div>' : ''}
      </div>
      <div class="sig-block">
        <div class="sig-label">Remplaçant</div>
        <div class="sig-name">${donnees.remplacant.first_name} ${donnees.remplacant.last_name}</div>
        <div class="sig-date">${sigRemplacant}</div>
        ${contrat.confirme_par_remplacant_at ? '<div class="sig-check">&#10004;</div>' : ''}
      </div>
    </div>

    <div class="disclaimer">
      <strong>Avertissement réglementaire important</strong>
      Ce document a été généré automatiquement à titre informatif par la plateforme JIM &mdash; Job In Med.
      Il ne constitue pas un acte juridique opposable en l'état. Conformément aux réglementations
      applicables aux professionnels de santé (Code de la Santé Publique, règles de l'Ordre des
      Masseurs-Kinésithérapeutes), ce contrat doit être validé par un professionnel du droit avant
      toute signature définitive. JIM décline toute responsabilité quant à l'utilisation de ce document
      sans vérification juridique préalable. Données personnelles traitées conformément au RGPD.
    </div>

    <div class="footer">
      JIM &mdash; Job In Med &bull; Contrat #${contrat.id} &bull; Généré le ${formatDateLong(new Date().toISOString())}
    </div>
  </div>
  <script>window.addEventListener('load', function () { window.print(); });</script>
</body>
</html>`;
}

// Telecharger le contrat en PDF via impression navigateur (Blob URL — pas de document.write)
function handleDownloadPdf(contrat: Contrat) {
  const html = buildContractHtml(contrat);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  // Libere l'URL une fois la fenetre chargee (le print est declenche par le document lui-meme)
  if (win) {
    win.addEventListener('load', () => URL.revokeObjectURL(url));
  } else {
    URL.revokeObjectURL(url);
  }
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function MissionDetailV2({ contratId }: MissionDetailV2Props) {
  const { supabase, user } = useAuthContext();
  const queryClient = useQueryClient();
  const [openPanel, setOpenPanel] = useState<OverlayPanel>(null);

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

  const confirmMutation = useConfirmContrat(supabase);
  const updateClausesMutation = useUpdateClausesOptionnelles(supabase);

  const isTitulaire = user?.id === contrat?.titulaire_id;
  const isRemplacant = user?.id === contrat?.remplacant_id;
  const canEditClauses = contrat?.statut === 'brouillon' && isTitulaire;

  const handleSign = useCallback(() => {
    if (!contrat) return;
    confirmMutation.mutate(
      { contratId: contrat.id, candidatureId: contrat.candidature_id },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.contrats.detail(contratId) });
        },
      },
    );
  }, [contrat, confirmMutation, queryClient, contratId]);

  const handleSaveClauses = useCallback(
    (clauses: ContratClause[]) => {
      if (!contrat) return;
      updateClausesMutation.mutate(
        { contratId: contrat.id, candidatureId: contrat.candidature_id, clauses },
        {
          onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.contrats.detail(contratId) });
          },
        },
      );
    },
    [contrat, updateClausesMutation, queryClient, contratId],
  );

  // Fermer l'overlay avec Echap
  useEffect(() => {
    if (!openPanel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPanel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openPanel]);

  // ─── Donnees derivees (avant les early returns pour respecter les hooks) ───
  const derived = useMemo(() => {
    if (!contrat) return null;
    const { donnees } = contrat;
    const debut = new Date(donnees.dates.debut);
    const fin = new Date(donnees.dates.fin);
    const now = new Date();

    const days = Math.max(1, Math.round((fin.getTime() - debut.getTime()) / DAY_MS));
    const daysUntilStart = Math.ceil((debut.getTime() - now.getTime()) / DAY_MS);
    const elapsedDays = Math.min(days, Math.max(0, Math.floor((now.getTime() - debut.getTime()) / DAY_MS)));

    // Parcours 6 etapes — etat derive du statut + des dates
    let doneCount: number;
    let nowIndex: number;
    if (contrat.statut === 'brouillon') {
      doneCount = 1;
      nowIndex = 1; // Negociation (clauses en cours d'edition)
    } else if (contrat.statut === 'en_attente_remplacant') {
      doneCount = 2;
      nowIndex = 2; // Signature
    } else if (now.getTime() > fin.getTime()) {
      doneCount = 4;
      nowIndex = 4; // Paiement
    } else {
      doneCount = 3;
      nowIndex = 3; // Mission (a venir ou en cours)
    }

    const signatures =
      (contrat.confirme_par_titulaire_at ? 1 : 0) + (contrat.confirme_par_remplacant_at ? 1 : 0);

    const taux = donnees.taux_retrocession;
    const otherParty = isTitulaire ? donnees.remplacant : donnees.titulaire;

    // Barres de la viz "Duree" (14 max, comme le design)
    const tickCount = Math.min(days, 14);
    const filledTicks = days > 0 ? Math.round((elapsedDays / days) * tickCount) : 0;

    return {
      debut,
      fin,
      days,
      daysUntilStart,
      doneCount,
      nowIndex,
      signatures,
      taux,
      otherParty,
      tickCount,
      filledTicks,
      ref: contrat.id.slice(0, 8).toUpperCase(),
      chip: dayChip(donnees.dates.debut),
      status: STATUS_META[contrat.statut],
    };
  }, [contrat, isTitulaire]);

  // ─── Etats chargement / erreur / acces (palette chaude) ───
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-center gap-3 rounded-[20px] border border-jim-beige-mid bg-white p-12 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-jim-primary border-t-transparent" />
          <span className="text-sm font-medium text-jim-muted">Chargement de la mission...</span>
        </div>
      </div>
    );
  }

  if (error || !contrat || !derived) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-[20px] border border-jim-beige-mid bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-jim-destructive">
            {error ? 'Erreur lors du chargement du contrat' : 'Contrat introuvable'}
          </p>
          {error && <p className="mt-1 text-xs text-jim-muted">{error.message}</p>}
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm font-semibold text-jim-primary hover:underline"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  if (!isTitulaire && !isRemplacant) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-[20px] border border-jim-beige-mid bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-jim-destructive">
            Vous n&apos;avez pas accès à ce contrat.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm font-semibold text-jim-primary hover:underline"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const { donnees } = contrat;
  const {
    days,
    daysUntilStart,
    doneCount,
    nowIndex,
    signatures,
    taux,
    otherParty,
    tickCount,
    filledTicks,
    ref,
    chip,
    status,
  } = derived;

  const keepPct = 100 - taux;
  const missionStarted = daysUntilStart <= 0;
  const missionOver = nowIndex >= 4;

  // Etapes du parcours (libelles + dates affichees)
  const parcoursSteps = [
    { icon: UserPlus, lbl: 'Candidature', when: 'acceptée' },
    { icon: GitCommitHorizontal, lbl: 'Négociation', when: contrat.statut === 'brouillon' ? 'en cours' : 'terminée' },
    { icon: FileSignature, lbl: 'Signature', when: contrat.statut === 'confirme' ? formatDateShort(contrat.confirme_par_remplacant_at ?? contrat.created_at) : 'en cours' },
    { icon: Stethoscope, lbl: 'Mission', when: `${formatDateShort(donnees.dates.debut)} → ${formatDateShort(donnees.dates.fin)}` },
    { icon: Landmark, lbl: 'Paiement', when: 'post-mission' },
    { icon: Users, lbl: 'Avis', when: 'post-mission' },
  ];
  const pbWidths = ['5%', '22%', '38%', '55%', '72%', '88%'];

  // Parcours signature (rail lateral de l'overlay contrat)
  const sigFlow = [
    {
      icon: Sparkles,
      t: 'Génération du contrat',
      s: `Template v.${donnees.template_version} · clauses pré-remplies`,
      when: formatDateShort(contrat.created_at),
      state: 'done' as const,
    },
    {
      icon: PenTool,
      t: 'Finalisation titulaire',
      s: contrat.statut === 'brouillon' ? 'Clauses complémentaires éditables' : 'Envoyé au remplaçant',
      when: contrat.statut === 'brouillon' ? 'EN COURS' : (contrat.confirme_par_titulaire_at ? formatDateShort(contrat.confirme_par_titulaire_at) : 'FAIT'),
      state: contrat.statut === 'brouillon' ? ('now' as const) : ('done' as const),
    },
    {
      icon: FileSignature,
      t: 'Signature remplaçant',
      s: contrat.confirme_par_remplacant_at ? 'Contrat signé électroniquement' : 'En attente de signature',
      when: contrat.confirme_par_remplacant_at
        ? formatDateShort(contrat.confirme_par_remplacant_at)
        : contrat.statut === 'en_attente_remplacant'
          ? 'À FAIRE'
          : '—',
      state: contrat.confirme_par_remplacant_at
        ? ('done' as const)
        : contrat.statut === 'en_attente_remplacant'
          ? ('now' as const)
          : ('none' as const),
    },
    {
      icon: ShieldCheck,
      t: 'Contrat confirmé',
      s: contrat.statut === 'confirme' ? 'Les deux parties ont signé' : 'Après signature des deux parties',
      when: contrat.statut === 'confirme' ? 'OK' : '—',
      state: contrat.statut === 'confirme' ? ('done' as const) : ('none' as const),
    },
  ];

  return (
    <div className="mdv2-root">
      <div className="dash">
        {/* ─── En-tete mission ─── */}
        <div className="dash-head">
          <div className="left">
            <div className="crumb">
              <Link href="/dashboard?tab=contrats" className="crumb-back">
                Mission
              </Link>
              <ChevronRight size={11} />
              <b>Contrat #{ref}</b>
            </div>
            <h1 className="dash-title">
              Remplacement <em>libéral</em> · {days} jours
            </h1>
            <div className="sub">
              <span>{donnees.adresse_cabinet}</span>
              <span className="sep">·</span>
              <span>
                avec <b>{otherParty.first_name} {otherParty.last_name}</b>
              </span>
              <span className="sep">·</span>
              <span>
                rétrocession <b>{taux} %</b>
              </span>
            </div>
          </div>
          <div className="right">
            <div className="datechip">
              <div className="d">
                <span className="dd">{chip.dd}</span>
                <span className="mm">{chip.mm}</span>
              </div>
              <div className="t">
                Début mission
                <b>
                  {missionOver
                    ? 'terminée'
                    : missionStarted
                      ? 'en cours'
                      : `dans ${daysUntilStart} jour${daysUntilStart > 1 ? 's' : ''}`}
                </b>
              </div>
            </div>
            <div className="status" style={{ background: status.bg, color: status.fg }}>
              <span className="pulse" style={{ background: status.fg }} />
              {status.lbl}
            </div>
          </div>
        </div>

        {/* ─── Hero stats ─── */}
        <div className="dash-stats">
          <div className="stat" data-tone="peach">
            <div className="lbl">
              Durée de mission
              <span className="ico">
                <CalendarDays size={15} />
              </span>
            </div>
            <div className="big">
              {days}
              <em> jour{days > 1 ? 's' : ''}</em>
            </div>
            <div className="sub">
              {formatDateShort(donnees.dates.debut)} → {formatDateShort(donnees.dates.fin)}
              {!missionStarted && !missionOver ? ` · J-${daysUntilStart}` : ''}
            </div>
            <div className="viz">
              <div className="viz-ticks">
                {Array.from({ length: tickCount }).map((_, i) => (
                  <span key={i} className={i < filledTicks ? 'f' : ''} style={{ animationDelay: `${0.3 + i * 0.04}s` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="stat" data-tone="sage">
            <div className="lbl">
              Rétrocession
              <span className="ico">
                <Percent size={15} />
              </span>
            </div>
            <div className="big">
              {taux}
              <em> % bruts</em>
            </div>
            <div className="sub">
              {isRemplacant ? `tu gardes ${keepPct} % des honoraires` : `le remplaçant garde ${keepPct} %`}
            </div>
            <div className="viz">
              <div className="viz-split">
                <span className="keep" style={{ width: `${keepPct}%` }} />
                <span className="give" style={{ width: `${taux}%` }} />
              </div>
            </div>
          </div>

          <div className="stat" data-tone="lilac">
            <div className="lbl">
              Signatures
              <span className="ico">
                <PenTool size={15} />
              </span>
            </div>
            <div className="big">
              {signatures}
              <em> / 2</em>
            </div>
            <div className="sub">
              {contrat.statut === 'confirme'
                ? 'contrat signé des deux côtés'
                : contrat.statut === 'en_attente_remplacant'
                  ? 'en attente du remplaçant'
                  : 'en cours de préparation'}
            </div>
            <div className="viz">
              <div className="viz-dots">
                <span className={`av${contrat.confirme_par_titulaire_at ? ' ok' : ''}`}>
                  {initialsOf(donnees.titulaire.first_name, donnees.titulaire.last_name)}
                </span>
                <span className={`av${contrat.confirme_par_remplacant_at ? ' ok' : ''}`}>
                  {initialsOf(donnees.remplacant.first_name, donnees.remplacant.last_name)}
                </span>
                <span className="more">titulaire · remplaçant</span>
              </div>
            </div>
          </div>

          <div className="stat" data-tone="honey">
            <div className="lbl">
              Étape du dossier
              <span className="ico">
                <GitCommitHorizontal size={15} />
              </span>
            </div>
            <div className="big">
              {nowIndex + 1}
              <em> / 6</em>
            </div>
            <div className="sub">{parcoursSteps[nowIndex]?.lbl}</div>
            <div className="viz">
              <div className="viz-seg">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={i < doneCount ? 'f' : i === nowIndex ? 'now' : ''}
                    style={{ animationDelay: `${0.42 + i * 0.08}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Parcours de la mission ─── */}
        <div className="dash-band">
          <div className="band-h">
            <Route size={12} />
            Parcours de la mission
            {!missionStarted && !missionOver && (
              <span className="right">
                Début de mission dans <b>{daysUntilStart} jour{daysUntilStart > 1 ? 's' : ''}</b>
              </span>
            )}
          </div>
          <div className="stripwrap">
            <div className="strip">
              <div className="pb" style={{ width: pbWidths[nowIndex] }} />
              {parcoursSteps.map((step, i) => {
                const StepIcon = step.icon;
                const cls = i < doneCount ? 'done' : i === nowIndex ? 'now' : '';
                return (
                  <div key={step.lbl} className={`step ${cls}`}>
                    <div className="node">
                      <StepIcon size={14} />
                    </div>
                    <div className="slbl">{step.lbl}</div>
                    <div className="when">{step.when}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Grille V2 : 3 mini-cartes ─── */}
        <div className="dash-grid">
          <button type="button" className="card mini" onClick={() => setOpenPanel('contrat')}>
            <div className="mh">
              <div className="ic">
                <FileSignature size={21} />
              </div>
              <div className="mt">
                <h3>
                  Contrat
                  <span
                    className={`pill ${contrat.statut === 'confirme' ? 'ok' : 'warn'}`}
                  >
                    {contrat.statut === 'confirme'
                      ? 'Signé'
                      : contrat.statut === 'en_attente_remplacant'
                        ? 'À signer'
                        : 'Brouillon'}
                  </span>
                </h3>
                <p className="sub">
                  Template v.{donnees.template_version} · <em>{signatures}/2 signatures</em>
                </p>
              </div>
              <span className="arr">
                <ArrowUpRight size={21} />
              </span>
            </div>
          </button>

          <button type="button" className="card mini" onClick={() => setOpenPanel('transmissions')}>
            <div className="mh">
              <div className="ic">
                <ClipboardList size={21} />
              </div>
              <div className="mt">
                <h3>Transmissions</h3>
                <p className="sub">
                  Cabinet · <em>{donnees.adresse_cabinet}</em>
                </p>
              </div>
              <span className="arr">
                <ArrowUpRight size={21} />
              </span>
            </div>
          </button>

          <Link href="/messages" className="card mini">
            <div className="mh">
              <div className="ic">
                <MessagesSquare size={21} />
              </div>
              <div className="mt">
                <h3>Messagerie</h3>
                <p className="sub">
                  avec <em>{otherParty.first_name} {otherParty.last_name}</em>
                </p>
              </div>
              <span className="arr">
                <ArrowUpRight size={21} />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── Overlay detail ─── */}
      {openPanel && (
        <div
          className="dash-ov"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpenPanel(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={openPanel === 'contrat' ? 'Contrat de remplacement' : 'Transmissions'}
        >
          <div className="dash-ov-panel">
            <div className="dash-ov-head">
              <div className="ic">
                {openPanel === 'contrat' ? <FileSignature size={16} /> : <ClipboardList size={16} />}
              </div>
              <div className="meta">
                <h3>
                  {openPanel === 'contrat' ? (
                    <>
                      Contrat de <em>remplacement</em>
                    </>
                  ) : (
                    'Transmissions'
                  )}
                </h3>
                <div className="s">
                  {openPanel === 'contrat'
                    ? `Template v.${donnees.template_version} · REF ${ref} · créé le ${formatDateShort(contrat.created_at)}`
                    : 'Cabinet · accès · patients'}
                </div>
              </div>
              <div className="seg">
                <button
                  type="button"
                  className={openPanel === 'contrat' ? 'on' : ''}
                  onClick={() => setOpenPanel('contrat')}
                >
                  <FileSignature size={13} />
                  Contrat
                </button>
                <button
                  type="button"
                  className={openPanel === 'transmissions' ? 'on' : ''}
                  onClick={() => setOpenPanel('transmissions')}
                >
                  <ClipboardList size={13} />
                  Transmissions
                </button>
              </div>
              <button type="button" className="close" onClick={() => setOpenPanel(null)} aria-label="Fermer">
                <X size={17} />
              </button>
            </div>

            <div className="dash-ov-body">
              {openPanel === 'contrat' ? (
                <div className="co">
                  {/* ── Document (papier) ── */}
                  <div className="co-doc">
                    <div className="paper">
                      <div className="ptitle">Contrat de remplacement libéral</div>
                      <div className="psub">
                        Généré via JIM · template v.{donnees.template_version} · REF {ref}
                      </div>

                      <div className="preamble">
                        <span className="plbl">Entre :</span>
                        <p>
                          <b>
                            {donnees.titulaire.first_name} {donnees.titulaire.last_name}
                          </b>
                          , masseur-kinésithérapeute, n° RPPS <span className="hl ok">{donnees.titulaire.rpps}</span>,
                          exerçant au cabinet sis {donnees.adresse_cabinet} — ci-après « la partie titulaire ».
                        </p>
                        <span className="plbl">Et :</span>
                        <p>
                          <b>
                            {donnees.remplacant.first_name} {donnees.remplacant.last_name}
                          </b>
                          , masseur-kinésithérapeute, n° RPPS <span className="hl ok">{donnees.remplacant.rpps}</span> —
                          ci-après « la partie remplaçante ».
                        </p>
                      </div>

                      <div className="keyfacts">
                        <p>
                          Le remplacement court du <span className="hl">{formatDateLong(donnees.dates.debut)}</span> au{' '}
                          <span className="hl">{formatDateLong(donnees.dates.fin)}</span> inclus, soit{' '}
                          <span className="hl">{days} jour{days > 1 ? 's' : ''} calendaires</span>, avec une rétrocession
                          de <span className="hl warn">{taux} % des honoraires bruts</span> versée à la partie titulaire.
                        </p>
                      </div>

                      <ContractClauses
                        clausesObligatoires={contrat.clauses_obligatoires}
                        clausesOptionnelles={contrat.clauses_optionnelles}
                        editable={!!canEditClauses}
                        onSave={handleSaveClauses}
                        isSaving={updateClausesMutation.isPending}
                      />

                      <div className="sig-area">
                        <div className={`sig-box${contrat.confirme_par_titulaire_at ? '' : ' empty'}`}>
                          <div className="lab">Titulaire</div>
                          <div className="nm">
                            {donnees.titulaire.first_name} {donnees.titulaire.last_name}
                          </div>
                          <div className="ss">
                            {contrat.confirme_par_titulaire_at
                              ? `Signé le ${formatDateFr(contrat.confirme_par_titulaire_at)}`
                              : 'En attente de signature'}
                          </div>
                          <div className="stamp">
                            {contrat.confirme_par_titulaire_at
                              ? `${donnees.titulaire.first_name} ${donnees.titulaire.last_name}`
                              : '— signature —'}
                          </div>
                        </div>
                        <div className={`sig-box${contrat.confirme_par_remplacant_at ? '' : ' empty'}`}>
                          <div className="lab">Remplaçant</div>
                          <div className="nm">
                            {donnees.remplacant.first_name} {donnees.remplacant.last_name}
                          </div>
                          <div className="ss">
                            {contrat.confirme_par_remplacant_at
                              ? `Signé le ${formatDateFr(contrat.confirme_par_remplacant_at)}`
                              : 'En attente de signature'}
                          </div>
                          <div className="stamp">
                            {contrat.confirme_par_remplacant_at
                              ? `${donnees.remplacant.first_name} ${donnees.remplacant.last_name}`
                              : '— signature —'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="actbar">
                      <div className="left">
                        <Lock size={13} />
                        <span>Données chiffrées · accès restreint aux deux parties</span>
                      </div>
                      <div className="spacer" />
                      {contrat.statut === 'confirme' && (
                        <button type="button" className="sec" onClick={() => handleDownloadPdf(contrat)}>
                          <Download size={13} />
                          PDF
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Rail lateral ── */}
                  <div className="co-side">
                    <div className="co-block">
                      <h5>
                        <KeyRound size={12} />
                        Termes clés
                      </h5>
                      <div className="co-key">
                        <div className="row">
                          <span className="k">
                            <CalendarDays size={11} />
                            Période
                          </span>
                          <span className="v">
                            {formatDateShort(donnees.dates.debut)} → {formatDateShort(donnees.dates.fin)}{' '}
                            <em>· {days} j</em>
                          </span>
                        </div>
                        <div className="row">
                          <span className="k">
                            <Percent size={11} />
                            Rétrocession
                          </span>
                          <span className="v">
                            {taux} <em>% bruts</em>
                          </span>
                        </div>
                        <div className="row">
                          <span className="k">
                            <MapPin size={11} />
                            Cabinet
                          </span>
                          <span className="v">{donnees.adresse_cabinet}</span>
                        </div>
                        <div className="row">
                          <span className="k">
                            <ShieldCheck size={11} />
                            RPPS vérifiés
                          </span>
                          <span className="v">2 / 2</span>
                        </div>
                      </div>
                    </div>

                    <div className="co-flow">
                      <h5>
                        <GitCommitHorizontal size={13} />
                        Parcours signature
                      </h5>
                      {sigFlow.map((s) => {
                        const FlowIcon = s.state === 'done' ? Check : s.icon;
                        return (
                          <div key={s.t} className={`fstep ${s.state}`}>
                            <div className="node">
                              <FlowIcon size={11} />
                            </div>
                            <div className="col">
                              <div className="t">{s.t}</div>
                              <div className="s">{s.s}</div>
                            </div>
                            <div className="when">{s.when}</div>
                          </div>
                        );
                      })}
                    </div>

                    <SignButton
                      contrat={contrat}
                      currentUserId={user?.id ?? ''}
                      onSign={handleSign}
                      isLoading={confirmMutation.isPending}
                    />

                    {contrat.statut === 'confirme' && isTitulaire && (
                      <Link href="/paiement" className="pay-cta">
                        <Landmark size={14} />
                        Créer le versement
                      </Link>
                    )}

                    {confirmMutation.isError && (
                      <div className="mut-error">
                        Erreur lors de la signature : {confirmMutation.error.message}
                      </div>
                    )}
                    {updateClausesMutation.isError && (
                      <div className="mut-error">
                        Erreur lors de la sauvegarde des clauses : {updateClausesMutation.error.message}
                      </div>
                    )}

                    <div className="legal">
                      <b>Avertissement réglementaire.</b> Document généré automatiquement à titre informatif.
                      Il doit être validé par un professionnel du droit avant toute signature définitive.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tr">
                  {/* ── Cabinet hero ── */}
                  <div className="tr-cabhero">
                    <div className="map">
                      <div className="lpill">
                        <MapPin size={10} />
                        {donnees.adresse_cabinet}
                      </div>
                    </div>
                    <div className="info">
                      <div className="nm">
                        Cabinet de <em>{donnees.titulaire.last_name}</em>
                      </div>
                      <div className="addr">{donnees.adresse_cabinet}</div>
                      <div className="ms">
                        <div className="m">
                          <div className="v">{days} j</div>
                          <div className="k">Durée</div>
                        </div>
                        <div className="m">
                          <div className="v">{formatDateShort(donnees.dates.debut)}</div>
                          <div className="k">Début</div>
                        </div>
                        <div className="m">
                          <div className="v">{formatDateShort(donnees.dates.fin)}</div>
                          <div className="k">Fin</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Empty state transmissions ── */}
                  <div className="tr-empty">
                    <div className="ic">
                      <ClipboardList size={22} />
                    </div>
                    <h4>Les transmissions arrivent bientôt</h4>
                    <p>
                      Patients récurrents, accès &amp; codes, équipement du cabinet : la partie titulaire pourra
                      tout transmettre ici à l&apos;approche de la mission.
                    </p>
                    <Link href="/messages" className="cta">
                      <MessagesSquare size={14} />
                      Poser une question à {otherParty.first_name}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════ Styles (port mission-dashboard*.css, palette DA) ════════════ */}
      <style jsx>{`
        .mdv2-root {
          --jim-primary: #ff7c5c;
          --jim-primary-mid: #ff9a80;
          --jim-primary-pale: #fff0ea;
          --jim-accent: #e06245;
          --jim-background: #fdf6ed;
          --jim-surface-alt: #fbf0e8;
          --jim-beige-dark: #dcbfa0;
          --jim-beige-mid: #edd9c4;
          --jim-beige-light: #f7ede0;
          --jim-text: #3a1f08;
          --jim-text-body: #5a3418;
          --jim-muted: #7a5434;
          --jim-success: #5d8f66;
          --jim-success-bg: #eaf3eb;
          --jim-warning: #b07824;
          --jim-warning-bg: #fbf0dc;
          --jim-shadow-sm: 0 1px 3px rgba(58, 31, 8, 0.06);
          --jim-shadow-lg: 0 6px 20px rgba(58, 31, 8, 0.1);
          --jim-shadow-xl: 0 12px 40px rgba(58, 31, 8, 0.12);
          --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
          --ease-fade: cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dash {
          max-width: 1180px;
          margin: 0 auto;
          padding: 26px 24px 70px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* ── En-tete ── */
        .dash-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          padding: 14px 4px 0;
          flex-wrap: wrap;
          animation: dash-up 0.5s var(--ease-fade) both;
        }
        .dash-head .left {
          min-width: 0;
        }
        .crumb {
          font-size: 11px;
          color: var(--jim-muted);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .crumb :global(.crumb-back) {
          color: var(--jim-muted);
          text-decoration: none;
        }
        .crumb :global(.crumb-back:hover) {
          color: var(--jim-primary);
        }
        .crumb b {
          color: var(--jim-text-body);
          letter-spacing: 0.05em;
        }
        h1.dash-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1;
          color: var(--jim-text);
          margin: 0;
        }
        h1.dash-title em {
          font-style: normal;
          font-weight: 800;
          color: var(--jim-primary);
          letter-spacing: -0.01em;
        }
        .dash-head .sub {
          font-size: 13px;
          color: var(--jim-muted);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 9px;
        }
        .dash-head .sub b {
          color: var(--jim-text-body);
          font-weight: 700;
        }
        .dash-head .sub .sep {
          color: var(--jim-beige-dark);
        }
        .dash-head .right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .datechip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border-radius: 14px;
          padding: 8px 14px 8px 10px;
          box-shadow: var(--jim-shadow-sm);
        }
        .datechip .d {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: var(--jim-primary-pale);
          color: var(--jim-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .datechip .d .dd {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .datechip .d .mm {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 1px;
        }
        .datechip .t {
          font-size: 11px;
          color: var(--jim-muted);
          font-weight: 600;
          line-height: 1.3;
        }
        .datechip .t b {
          display: block;
          font-size: 12.5px;
          color: var(--jim-text);
          font-weight: 800;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 15px;
          border-radius: 14px;
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: -0.01em;
          box-shadow: var(--jim-shadow-sm);
        }
        .status .pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: dash-pulse 2s ease-in-out infinite;
        }

        /* ── Hero stats ── */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .stat {
          position: relative;
          border-radius: 20px;
          padding: 17px 18px 15px;
          overflow: hidden;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--jim-shadow-sm);
          transition: transform 0.32s var(--ease-spring), box-shadow 0.32s ease;
          animation: dash-up 0.55s var(--ease-fade) both;
        }
        .dash-stats > *:nth-child(1) {
          animation-delay: 60ms;
        }
        .dash-stats > *:nth-child(2) {
          animation-delay: 110ms;
        }
        .dash-stats > *:nth-child(3) {
          animation-delay: 160ms;
        }
        .dash-stats > *:nth-child(4) {
          animation-delay: 210ms;
        }
        .stat:hover {
          transform: translateY(-3px);
          box-shadow: var(--jim-shadow-lg);
        }
        .stat[data-tone='peach'] {
          background: linear-gradient(150deg, #ffe9df 0%, #ffd4c4 52%, #ffc0aa 100%);
        }
        .stat[data-tone='sage'] {
          background: linear-gradient(150deg, #e6efe3 0%, #d2e4d1 52%, #bedabf 100%);
        }
        .stat[data-tone='lilac'] {
          background: linear-gradient(150deg, #f0e7f6 0%, #e2d2ef 52%, #d4c0e8 100%);
        }
        .stat[data-tone='honey'] {
          background: linear-gradient(150deg, #fdedd1 0%, #f8ddad 52%, #f2ce8d 100%);
        }
        .stat .lbl {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          color: var(--jim-text);
          letter-spacing: -0.01em;
        }
        .stat .ico {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--jim-text);
          box-shadow: 0 1px 2px rgba(58, 31, 8, 0.06);
        }
        .stat .big {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.035em;
          color: var(--jim-text);
          line-height: 1;
          margin-top: 12px;
          font-variant-numeric: tabular-nums;
        }
        .stat .big em {
          font-style: normal;
          font-weight: 700;
          font-size: 17px;
          color: var(--jim-text-body);
          letter-spacing: 0;
        }
        .stat .sub {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--jim-muted);
          margin-top: 4px;
          letter-spacing: -0.01em;
        }
        .stat .viz {
          margin-top: auto;
          padding-top: 12px;
        }

        /* viz : barres jour par jour */
        .viz-ticks {
          display: flex;
          gap: 3px;
          align-items: flex-end;
          height: 26px;
        }
        .viz-ticks span {
          flex: 1;
          border-radius: 2px;
          background: rgba(58, 31, 8, 0.14);
          height: 40%;
          transform: scaleY(0);
          transform-origin: bottom;
          animation: viz-bar-rise 0.46s cubic-bezier(0.22, 0.7, 0.3, 1) both;
        }
        .viz-ticks span.f {
          background: var(--jim-primary);
          height: 100%;
        }

        /* viz : split retrocession */
        .viz-split {
          display: flex;
          gap: 3px;
          height: 10px;
        }
        .viz-split span {
          border-radius: 5px;
          transform: scaleX(0);
          transform-origin: left center;
          animation: seg-grow 0.6s cubic-bezier(0.3, 0.8, 0.3, 1) 0.4s both;
        }
        .viz-split .keep {
          background: var(--jim-success);
        }
        .viz-split .give {
          background: rgba(58, 31, 8, 0.18);
          animation-delay: 0.55s;
        }

        /* viz : avatars signatures */
        .viz-dots {
          display: flex;
          align-items: center;
        }
        .viz-dots .av {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          font-size: 9px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: var(--jim-beige-dark);
          border: 2px solid #fff;
          margin-left: -7px;
          box-shadow: 0 1px 3px rgba(58, 31, 8, 0.12);
          opacity: 0;
          transform: scale(0);
          animation: dot-pop 0.44s var(--ease-spring) both;
        }
        .viz-dots .av:first-child {
          margin-left: 0;
          animation-delay: 0.5s;
        }
        .viz-dots .av:nth-child(2) {
          animation-delay: 0.58s;
        }
        .viz-dots .av.ok {
          background: linear-gradient(135deg, var(--jim-primary), var(--jim-accent));
        }
        .viz-dots .more {
          margin-left: 9px;
          font-size: 10px;
          font-weight: 800;
          color: var(--jim-text-body);
          letter-spacing: -0.01em;
          opacity: 0;
          animation: dot-more 0.42s ease 0.7s both;
        }

        /* viz : segments etape */
        .viz-seg {
          display: flex;
          gap: 4px;
        }
        .viz-seg span {
          flex: 1;
          height: 7px;
          border-radius: 4px;
          background: rgba(58, 31, 8, 0.13);
          transform: scaleX(0);
          transform-origin: left center;
          animation: seg-grow 0.5s cubic-bezier(0.3, 0.8, 0.3, 1) both;
        }
        .viz-seg span.f {
          background: var(--jim-success);
        }
        .viz-seg span.now {
          background: var(--jim-primary);
          box-shadow: 0 0 0 3px rgba(255, 124, 92, 0.18);
        }

        /* ── Parcours band ── */
        .dash-band {
          background: #fff;
          border-radius: 18px;
          padding: 14px 20px 8px;
          box-shadow: var(--jim-shadow-sm);
          animation: dash-up 0.55s var(--ease-fade) both;
          animation-delay: 240ms;
        }
        .band-h {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 8px 2px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--jim-muted);
        }
        .band-h :global(svg) {
          color: var(--jim-primary);
        }
        .band-h .right {
          margin-left: auto;
          text-transform: none;
          letter-spacing: -0.01em;
          font-size: 11px;
          color: var(--jim-text-body);
        }
        .band-h .right b {
          color: var(--jim-primary);
        }
        .stripwrap {
          padding: 14px 8px 10px;
          position: relative;
        }
        .strip {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          position: relative;
        }
        .strip::before {
          content: '';
          position: absolute;
          top: 18px;
          left: 5%;
          right: 5%;
          height: 2px;
          background: var(--jim-beige-mid);
          z-index: 0;
        }
        .strip .pb {
          position: absolute;
          top: 18px;
          left: 5%;
          height: 2px;
          background: var(--jim-success);
          z-index: 0;
        }
        .strip .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          position: relative;
          z-index: 1;
        }
        .strip .step .node {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--jim-beige-mid);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--jim-muted);
          box-shadow: 0 0 0 4px #fff;
        }
        .strip .step.done .node {
          background: var(--jim-success);
          border-color: var(--jim-success);
          color: #fff;
        }
        .strip .step.now .node {
          background: var(--jim-primary);
          border-color: var(--jim-primary);
          color: #fff;
          box-shadow: 0 0 0 4px #fff, 0 0 0 8px var(--jim-primary-pale);
        }
        .strip .step .slbl {
          font-size: 10.5px;
          color: var(--jim-muted);
          font-weight: 600;
          text-align: center;
          white-space: nowrap;
        }
        .strip .step.done .slbl {
          color: var(--jim-text-body);
          font-weight: 700;
        }
        .strip .step.now .slbl {
          color: var(--jim-primary);
          font-weight: 800;
        }
        .strip .step .when {
          font-size: 9px;
          color: var(--jim-muted);
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          text-align: center;
        }

        /* ── Grille V2 : mini-cartes ── */
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 1fr;
          gap: 16px;
          align-items: stretch;
        }
        .dash-grid > :global(*) {
          animation: dash-up 0.5s var(--ease-fade) both;
        }
        .dash-grid > :global(*:nth-child(1)) {
          animation-delay: 300ms;
        }
        .dash-grid > :global(*:nth-child(2)) {
          animation-delay: 350ms;
        }
        .dash-grid > :global(*:nth-child(3)) {
          animation-delay: 400ms;
        }
        .dash-grid :global(.card.mini) {
          background: #fff;
          border-radius: 18px;
          padding: 22px 24px;
          box-shadow: var(--jim-shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          cursor: pointer;
          border: 1px solid transparent;
          text-decoration: none;
          text-align: left;
          font-family: inherit;
          transition: transform 0.28s var(--ease-spring), box-shadow 0.28s ease, border-color 0.28s ease;
        }
        .dash-grid :global(.card.mini:hover) {
          transform: translateY(-4px) scale(1.015);
          box-shadow: var(--jim-shadow-lg);
          border-color: rgba(255, 124, 92, 0.22);
        }
        .dash-grid :global(.mh) {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .dash-grid :global(.card.mini .ic) {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          flex-shrink: 0;
          background: var(--jim-primary-pale);
          color: var(--jim-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s var(--ease-fade), color 0.3s var(--ease-fade);
        }
        .dash-grid :global(.card.mini:hover .ic) {
          background: var(--jim-primary);
          color: #fff;
        }
        .dash-grid :global(.mt) {
          min-width: 0;
          flex: 1;
        }
        .dash-grid :global(.mt h3) {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
          color: var(--jim-text);
          line-height: 1.15;
        }
        .dash-grid :global(.mt .sub) {
          font-size: 12.5px;
          color: var(--jim-muted);
          font-weight: 600;
          margin: 4px 0 0;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dash-grid :global(.mt .sub em) {
          font-style: normal;
          font-weight: 800;
          color: var(--jim-text-body);
        }
        .dash-grid :global(.pill) {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 7px;
          line-height: 1;
          white-space: nowrap;
        }
        .dash-grid :global(.pill.warn) {
          background: var(--jim-warning-bg);
          color: var(--jim-warning);
        }
        .dash-grid :global(.pill.ok) {
          background: var(--jim-success-bg);
          color: var(--jim-success);
        }
        .dash-grid :global(.arr) {
          flex-shrink: 0;
          color: var(--jim-muted);
          transition: transform 0.3s var(--ease-fade), color 0.3s var(--ease-fade);
        }
        .dash-grid :global(.card.mini:hover .arr) {
          color: var(--jim-primary);
          transform: translate(3px, -3px);
        }

        /* ── Overlay ── */
        .dash-ov {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          padding: 22px;
          background: rgba(58, 31, 8, 0.32);
          backdrop-filter: blur(4px);
          animation: ov-fade 0.22s ease both;
        }
        .dash-ov-panel {
          margin: auto;
          background: var(--jim-background);
          border-radius: 22px;
          width: 100%;
          max-width: 1200px;
          height: 100%;
          max-height: calc(100vh - 44px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: var(--jim-shadow-xl);
          animation: ov-rise 0.34s var(--ease-fade) both;
        }
        .dash-ov-head {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 18px;
          border-bottom: 1px solid rgba(58, 31, 8, 0.07);
          background: rgba(255, 255, 255, 0.55);
          flex-shrink: 0;
        }
        .dash-ov-head .ic {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: var(--jim-primary-pale);
          color: var(--jim-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dash-ov-head .meta h3 {
          font-size: 15.5px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
          color: var(--jim-text);
        }
        .dash-ov-head .meta h3 em {
          font-style: normal;
          font-weight: 800;
          color: var(--jim-primary);
        }
        .dash-ov-head .meta .s {
          font-size: 11px;
          color: var(--jim-muted);
          font-weight: 600;
          margin-top: 1px;
        }
        .dash-ov-head .seg {
          margin-left: auto;
          display: flex;
          gap: 4px;
          background: var(--jim-surface-alt);
          border-radius: 11px;
          padding: 4px;
        }
        .dash-ov-head .seg button {
          padding: 6px 13px;
          border-radius: 8px;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          color: var(--jim-muted);
          letter-spacing: -0.01em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .dash-ov-head .seg button.on {
          background: #fff;
          color: var(--jim-primary);
          box-shadow: var(--jim-shadow-sm);
        }
        .dash-ov-head .close {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 0;
          background: var(--jim-surface-alt);
          color: var(--jim-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .dash-ov-head .close:hover {
          background: var(--jim-beige-mid);
          transform: rotate(90deg);
        }
        .dash-ov-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        /* ── Panel contrat ── */
        .co {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 16px;
          padding: 16px 26px 18px;
          align-items: start;
        }
        .co-doc {
          background: #fff;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          box-shadow: var(--jim-shadow-sm);
          overflow: hidden;
        }
        .paper {
          padding: 24px 32px;
          font-size: 12px;
          line-height: 1.6;
          color: var(--jim-text-body);
        }
        .ptitle {
          font-size: 13px;
          font-weight: 800;
          color: var(--jim-text);
          text-align: center;
          margin: 0 0 4px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .psub {
          text-align: center;
          font-size: 10.5px;
          color: var(--jim-muted);
          font-weight: 600;
          margin-bottom: 18px;
          letter-spacing: 0.02em;
        }
        .preamble {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 14px;
        }
        .preamble p {
          margin: 0;
          font-size: 12px;
        }
        .plbl {
          font-size: 10.5px;
          font-weight: 800;
          color: var(--jim-text);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .keyfacts {
          margin-bottom: 18px;
        }
        .keyfacts p {
          margin: 0;
          font-size: 12px;
        }
        .hl {
          background: linear-gradient(transparent 55%, rgba(176, 136, 217, 0.28) 55%);
          padding: 0 2px;
          font-weight: 600;
          color: var(--jim-text);
        }
        .hl.warn {
          background: linear-gradient(transparent 55%, rgba(176, 120, 36, 0.28) 55%);
        }
        .hl.ok {
          background: linear-gradient(transparent 55%, rgba(93, 143, 102, 0.24) 55%);
        }
        .sig-area {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 18px;
          padding-top: 12px;
          border-top: 1px dashed rgba(58, 31, 8, 0.12);
        }
        .sig-box {
          padding: 10px 12px;
          background: var(--jim-surface-alt);
          border-radius: 9px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .sig-box .lab {
          font-size: 9px;
          color: var(--jim-muted);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .sig-box .nm {
          font-size: 11.5px;
          font-weight: 800;
          color: var(--jim-text);
        }
        .sig-box .ss {
          font-size: 9.5px;
          color: var(--jim-muted);
          font-weight: 600;
        }
        .sig-box .stamp {
          margin-top: 4px;
          font-weight: 800;
          color: var(--jim-primary);
          font-size: 15px;
          letter-spacing: -0.01em;
        }
        .sig-box.empty .stamp {
          color: var(--jim-beige-dark);
          font-size: 10.5px;
          font-weight: 600;
        }
        .actbar {
          padding: 10px 14px;
          border-top: 1px solid rgba(58, 31, 8, 0.06);
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), #fff);
        }
        .actbar .left {
          display: flex;
          gap: 6px;
          align-items: center;
          color: var(--jim-muted);
          font-size: 11px;
          font-weight: 700;
        }
        .actbar .left :global(svg) {
          color: var(--jim-success);
          flex-shrink: 0;
        }
        .actbar .spacer {
          flex: 1;
        }
        .actbar .sec {
          padding: 8px 12px;
          border-radius: 10px;
          border: 0;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -0.01em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--jim-surface-alt);
          color: var(--jim-text);
          transition: background 0.2s;
        }
        .actbar .sec:hover {
          background: var(--jim-beige-light);
        }

        /* rail lateral */
        .co-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }
        .co-block,
        .co-flow {
          background: #fff;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .co-block h5,
        .co-flow h5 {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.01em;
          margin: 0;
          color: var(--jim-text);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .co-block h5 :global(svg),
        .co-flow h5 :global(svg) {
          color: var(--jim-primary);
        }
        .co-key {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .co-key .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11.5px;
          padding: 6px 0;
          border-top: 1px dashed rgba(58, 31, 8, 0.08);
          gap: 8px;
        }
        .co-key .row:first-child {
          border-top: 0;
        }
        .co-key .row .k {
          color: var(--jim-muted);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .co-key .row .k :global(svg) {
          color: var(--jim-primary);
        }
        .co-key .row .v {
          font-weight: 800;
          color: var(--jim-text);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.01em;
          font-size: 12px;
          text-align: right;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .co-key .row .v em {
          font-style: normal;
          font-weight: 800;
          color: var(--jim-primary);
          font-size: 11px;
        }
        .co-flow .fstep {
          display: grid;
          grid-template-columns: 22px 1fr auto;
          gap: 10px;
          padding: 6px 0;
          align-items: flex-start;
          position: relative;
        }
        .co-flow .fstep:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 24px;
          left: 10px;
          bottom: -4px;
          width: 2px;
          background: var(--jim-beige-mid);
          border-radius: 1px;
        }
        .co-flow .fstep.done:not(:last-child)::after {
          background: var(--jim-success);
        }
        .co-flow .fstep .node {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid var(--jim-beige-mid);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--jim-muted);
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }
        .co-flow .fstep.done .node {
          background: var(--jim-success);
          border-color: var(--jim-success);
          color: #fff;
        }
        .co-flow .fstep.now .node {
          background: var(--jim-primary);
          border-color: var(--jim-primary);
          color: #fff;
          animation: pulse-ring 1.8s ease-in-out infinite;
        }
        .co-flow .fstep .col .t {
          font-size: 12px;
          font-weight: 800;
          color: var(--jim-text);
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .co-flow .fstep.now .col .t {
          color: var(--jim-primary);
        }
        .co-flow .fstep .col .s {
          font-size: 10.5px;
          color: var(--jim-muted);
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1px;
        }
        .co-flow .fstep .when {
          font-size: 9.5px;
          color: var(--jim-muted);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          padding-top: 3px;
        }
        .co-flow .fstep.done .when {
          color: var(--jim-success);
        }
        .co-flow .fstep.now .when {
          color: var(--jim-primary);
        }
        .co-side :global(.pay-cta) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 11px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.01em;
          background: var(--jim-primary);
          color: #fff;
          text-decoration: none;
          box-shadow: 0 4px 14px -4px rgba(255, 124, 92, 0.5);
          transition: background 0.2s, transform 0.2s;
        }
        .co-side :global(.pay-cta:hover) {
          background: var(--jim-accent);
          transform: translateY(-1px);
        }
        .mut-error {
          background: #faebe8;
          border: 1px solid rgba(184, 64, 48, 0.25);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 12px;
          color: #b84030;
          font-weight: 600;
        }
        .legal {
          font-size: 10.5px;
          line-height: 1.55;
          color: var(--jim-text-body);
          font-weight: 500;
          background: var(--jim-warning-bg);
          border: 1px dashed rgba(176, 120, 36, 0.35);
          border-radius: 11px;
          padding: 10px 12px;
        }
        .legal b {
          font-weight: 800;
          color: var(--jim-warning);
        }

        /* ── Panel transmissions ── */
        .tr {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 16px 26px 18px;
        }
        .tr-cabhero {
          background: linear-gradient(135deg, #fff 0%, #fff 70%, var(--jim-surface-alt) 100%);
          border-radius: 18px;
          padding: 14px 18px;
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr);
          gap: 18px;
          align-items: center;
          box-shadow: var(--jim-shadow-sm);
        }
        .tr-cabhero .map {
          position: relative;
          height: 96px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(160deg, #f4e8d8 0%, #e9d5bb 60%, #dbb98e 100%);
        }
        .tr-cabhero .map::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(58, 31, 8, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58, 31, 8, 0.05) 1px, transparent 1px);
          background-size: 18px 18px;
          opacity: 0.7;
        }
        .tr-cabhero .map::after {
          content: '';
          position: absolute;
          left: 38%;
          top: 30%;
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          background: var(--jim-primary);
          transform: rotate(-45deg);
          box-shadow: 0 6px 16px rgba(255, 124, 92, 0.45);
        }
        .tr-cabhero .map .lpill {
          position: absolute;
          left: 12px;
          bottom: 10px;
          right: 12px;
          font-size: 10px;
          color: var(--jim-text);
          font-weight: 700;
          background: rgba(255, 255, 255, 0.95);
          padding: 4px 10px;
          border-radius: 7px;
          letter-spacing: -0.01em;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
          overflow: hidden;
        }
        .tr-cabhero .map .lpill :global(svg) {
          color: var(--jim-primary);
          flex-shrink: 0;
        }
        .tr-cabhero .info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .tr-cabhero .info .nm {
          font-size: 18px;
          font-weight: 800;
          color: var(--jim-text);
          letter-spacing: -0.025em;
          line-height: 1.1;
        }
        .tr-cabhero .info .nm em {
          font-style: normal;
          font-weight: 800;
          color: var(--jim-primary);
        }
        .tr-cabhero .info .addr {
          font-size: 12.5px;
          color: var(--jim-text-body);
          font-weight: 600;
          line-height: 1.4;
        }
        .tr-cabhero .info .ms {
          display: flex;
          gap: 18px;
          margin-top: 2px;
        }
        .tr-cabhero .info .ms .m .v {
          font-size: 15px;
          font-weight: 800;
          color: var(--jim-text);
          letter-spacing: -0.02em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .tr-cabhero .info .ms .m .k {
          font-size: 9.5px;
          color: var(--jim-muted);
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .tr-empty {
          background: #fff;
          border-radius: 18px;
          padding: 40px 24px;
          box-shadow: var(--jim-shadow-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }
        .tr-empty .ic {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: var(--jim-primary-pale);
          color: var(--jim-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .tr-empty h4 {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--jim-text);
          margin: 0;
        }
        .tr-empty p {
          font-size: 12.5px;
          line-height: 1.55;
          color: var(--jim-muted);
          font-weight: 500;
          max-width: 420px;
          margin: 0;
        }
        .tr-empty :global(.cta) {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.01em;
          background: var(--jim-primary);
          color: #fff;
          text-decoration: none;
          box-shadow: 0 4px 14px -4px rgba(255, 124, 92, 0.5);
          transition: background 0.2s, transform 0.2s;
        }
        .tr-empty :global(.cta:hover) {
          background: var(--jim-accent);
          transform: translateY(-1px);
        }

        /* ── Animations ── */
        @keyframes dash-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes dash-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.85);
          }
        }
        @keyframes viz-bar-rise {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
        @keyframes seg-grow {
          to {
            transform: scaleX(1);
          }
        }
        @keyframes dot-pop {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes dot-more {
          from {
            opacity: 0;
            transform: translateX(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes ov-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes ov-rise {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse-ring {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(255, 124, 92, 0.5);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(255, 124, 92, 0);
          }
        }

        /* ── Responsive ── */
        @media (max-width: 1023px) {
          .dash-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .dash-grid {
            grid-template-columns: 1fr;
          }
          .co {
            grid-template-columns: 1fr;
            padding: 14px 16px 16px;
          }
          .strip .step .when {
            display: none;
          }
        }
        @media (max-width: 639px) {
          .dash {
            padding: 18px 16px 60px;
          }
          .dash-stats {
            grid-template-columns: 1fr;
          }
          h1.dash-title {
            font-size: 24px;
          }
          .strip .step .slbl {
            font-size: 8.5px;
          }
          .dash-ov {
            padding: 10px;
          }
          .tr-cabhero {
            grid-template-columns: 1fr;
          }
          .sig-area {
            grid-template-columns: 1fr;
          }
          .dash-ov-head .seg {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mdv2-root *,
          .mdv2-root :global(*) {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .viz-ticks span,
          .viz-seg span,
          .viz-split span {
            transform: none;
          }
          .viz-dots .av,
          .viz-dots .more {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
