'use client';

// Vue d'accueil du dashboard — design timeline + alertes + paiements
// Differenciee selon le role (titulaire vs remplacant)

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Coins,
  AlertTriangle,
  Receipt,
  MapPin,
  CalendarClock,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  useMyAnnonces,
  useMesCandidatures,
  useMesPaiements,
  useProcessCandidature,
} from '@jim/shared';
import type { SupabaseClient } from '@jim/shared';
import type { CandidatureRow } from '@jim/shared/validators/candidature.schema';

// Formateur d'euros — centimes -> EUR
const formatEUR = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

interface OverviewProps {
  role: 'titulaire' | 'remplacant';
  userId: string;
  supabase: SupabaseClient;
  profileName?: string | undefined;
}

// ─── Badge statut candidature ──────────────────────────────────────────────────
function StatusBadge({ statut }: { statut: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    en_attente: { bg: 'bg-[#fbf0dc]', text: 'text-[#b07824]', label: 'En attente' },
    vue: { bg: 'bg-[#fbf0dc]', text: 'text-[#b07824]', label: 'Vue' },
    en_discussion: { bg: 'bg-[#fff0ea]', text: 'text-[#e06245]', label: 'En discussion' },
    acceptee: { bg: 'bg-[#eaf2ec]', text: 'text-[#2d5e36]', label: 'Acceptee' },
    refusee: { bg: 'bg-[#fff0ea]', text: 'text-[#c14e31]', label: 'Refusee' },
    refusee_auto: { bg: 'bg-[#fff0ea]', text: 'text-[#c14e31]', label: 'Refusee' },
    retiree: { bg: 'bg-[#f7ede0]', text: 'text-[#5a3418]', label: 'Retiree' },
    expiree: { bg: 'bg-[#f7ede0]', text: 'text-[#7a5434]', label: 'Expiree' },
  };
  const c = config[statut] ?? { bg: 'bg-[#f7ede0]', text: 'text-[#5a3418]', label: statut };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ─── Nom du mois courant ──────────────────────────────────────────────────────
function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('fr-FR', { month: 'long' });
}

// ─── Types pour donnees JSONB du contrat ─────────────────────────────────────
interface ContratDonnees {
  titulaire?: { first_name?: string; last_name?: string; rpps?: string };
  remplacant?: { first_name?: string; last_name?: string; rpps?: string };
  dates?: { debut?: string; fin?: string };
  adresse_cabinet?: string;
  taux_retrocession?: number;
}

// Formate une date ISO en jour abrege + numero (ex: "Lun", "12")
function formatShortDate(isoDate: string): { dayLabel: string; dayNumber: string; fullLabel: string } {
  const date = new Date(isoDate);
  const dayLabel = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
  const dayNumber = date.getDate().toString();
  const fullLabel = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return { dayLabel: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1), dayNumber, fullLabel };
}

// Calcule le nombre de jours avant une date
function daysUntil(isoDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

// Badge statut contrat
function ContratStatusBadge({ statut }: { statut: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    brouillon: { bg: 'bg-[#f7ede0]', text: 'text-[#7a5434]', label: 'Brouillon' },
    en_attente_remplacant: { bg: 'bg-[#fbf0dc]', text: 'text-[#b07824]', label: 'En attente' },
    confirme: { bg: 'bg-[#eaf2ec]', text: 'text-[#2d5e36]', label: 'Confirme' },
  };
  const c = config[statut] ?? { bg: 'bg-[#f7ede0]', text: 'text-[#7a5434]', label: statut };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ─── Vue Titulaire ─────────────────────────────────────────────────────────────
function TitulaireOverview({
  userId,
  supabase,
  profileName,
}: {
  userId: string;
  supabase: SupabaseClient;
  profileName?: string | undefined;
}) {
  const { data: annonces } = useMyAnnonces(supabase);
  const { data: paiements } = useMesPaiements(supabase, userId);
  const processCandidature = useProcessCandidature(supabase);

  // Candidatures recues sur TOUTES les annonces du titulaire
  // Note : useCandidaturesRecues attend un annonceId unique — on fait une query custom
  // Migration 076 : RLS profiles durcie -> profil resolu via profiles_public + merge.
  const { data: allCandidatures } = useQuery({
    queryKey: ['dashboard', 'candidatures-recues', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select(`
          *,
          annonces!inner(profile_id, ville)
        `)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      const cands = (data ?? []) as Array<
        CandidatureRow & {
          annonces: { profile_id: string; ville: string };
        }
      >;

      const userIds = Array.from(
        new Set(cands.map((c) => c.remplacant_id).filter(Boolean) as string[])
      );
      let profileMap = new Map<string, { first_name: string; last_name: string }>();
      if (userIds.length > 0) {
        const { data: profs } = await supabase
          .from('profiles_public')
          .select('user_id, first_name, last_name')
          .in('user_id', userIds);
        profileMap = new Map(
          (profs ?? []).map((p) => [p.user_id, { first_name: p.first_name, last_name: p.last_name }])
        );
      }

      return cands.map((c) => ({ ...c, profiles: profileMap.get(c.remplacant_id) ?? null }));
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  // Filtrer les candidatures sur les annonces du titulaire
  const candidaturesRecues = useMemo(
    () => allCandidatures?.filter((c) => c.annonces?.profile_id === userId) ?? [],
    [allCandidatures, userId]
  );

  // KPIs
  const annoncesActives = annonces?.filter((a) => a.statut === 'active').length ?? 0;
  const candidaturesEnAttente = candidaturesRecues.filter((c) => c.statut === 'en_attente').length;

  // Contrats en cours — on query directement
  const { data: contrats } = useQuery({
    queryKey: ['dashboard', 'contrats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contrats')
        .select('*')
        .or(`titulaire_id.eq.${userId},remplacant_id.eq.${userId}`);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  // Paiements du mois en cours
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const paiementsCeMois = paiements?.versements?.filter(
    (p) => p.created_at >= startOfMonth
  ) ?? [];
  const totalCeMois = paiementsCeMois.reduce(
    (sum, p) => sum + p.montant_retrocession_cents,
    0
  );

  // 5 dernieres candidatures
  const recentCandidatures = candidaturesRecues.slice(0, 5);

  // Nombre d'alertes = candidatures en attente
  const alertCount = candidaturesEnAttente;

  // Mois courant
  const currentMonth = getCurrentMonthName();

  function handleProcess(candidatureId: string, annonceId: string, action: 'accepter' | 'refuser') {
    processCandidature.mutate({
      candidature_id: candidatureId,
      annonce_id: annonceId,
      action,
    });
  }

  // Contrats a venir (tries par date debut)
  const upcomingContrats = useMemo(() => {
    if (!contrats) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return contrats
      .map((c) => {
        const donnees = (c.donnees ?? {}) as ContratDonnees;
        return { ...c, parsedDonnees: donnees };
      })
      .filter((c) => {
        if (c.statut === 'brouillon') return false;
        const dateDebut = c.parsedDonnees.dates?.debut;
        if (!dateDebut) return true; // afficher si pas de date mais non-brouillon
        return new Date(dateDebut) >= today;
      })
      .sort((a, b) => {
        const dateA = a.parsedDonnees.dates?.debut ?? '9999';
        const dateB = b.parsedDonnees.dates?.debut ?? '9999';
        return dateA.localeCompare(dateB);
      })
      .slice(0, 5);
  }, [contrats]);

  const nextContrat = upcomingContrats[0];
  const nextDays = nextContrat?.parsedDonnees.dates?.debut
    ? daysUntil(nextContrat.parsedDonnees.dates.debut)
    : null;
  const nextCountdownLabel = nextDays === 0 ? "Aujourd'hui" : nextDays === 1 ? 'Demain' : nextDays !== null ? `dans ${nextDays} jours` : null;

  return (
    <>
      {/* Section 1 — Accueil + carte versements */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(28px,3.4vw,40px)] leading-[0.98] font-extrabold tracking-[-0.04em] text-[#3a1f08]">
            Bonjour
            {profileName ? (
              <>
                , <em className="not-italic text-[#ff7c5c]">{profileName}</em>
              </>
            ) : null}
            .
          </h2>
          <p className="text-[#7a5434] mt-2 text-sm">
            {alertCount > 0 ? (
              <>Vous avez <span className="font-bold text-[#ff7c5c]">{alertCount} candidature{alertCount > 1 ? 's' : ''}</span> a traiter.</>
            ) : (
              'Tout est en ordre pour le moment.'
            )}
          </p>
        </div>
        <div className="bg-white/70 px-4 py-2 rounded-xl flex items-center gap-3 border border-[#edd9c4]">
          <Coins className="text-[#ff7c5c]" size={20} />
          <div>
            <p className="text-[10px] uppercase font-bold text-[#9a7b58]">Versements {currentMonth}</p>
            <p className="text-lg font-extrabold">{formatEUR.format(totalCeMois / 100)}</p>
          </div>
        </div>
      </div>

      {/* Section 2 — Deux hero cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Card 1 — Remplacements planifies */}
        <div className="group bg-white p-6 rounded-[20px] shadow-[0_1px_2px_rgba(58,31,8,0.04),0_4px_16px_rgba(58,31,8,0.05)] border border-[#edd9c4] hover:border-[#ff7c5c]/30 transition-all cursor-pointer relative overflow-hidden">
          <CalendarClock
            className="absolute -top-4 -right-4 text-[#3a1f08] opacity-5 group-hover:opacity-10 transition-opacity"
            size={120}
          />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-[#fff0ea] text-[#ff7c5c] rounded-xl">
              <CalendarClock size={20} />
            </div>
            <span className="text-xs font-bold text-[#ff7c5c] bg-[#fff0ea] px-3 py-1 rounded-full uppercase tracking-wider">
              A venir
            </span>
          </div>
          <h3 className="text-xl font-extrabold mb-1 relative z-10">Remplacements planifies</h3>
          <p className="text-[#7a5434] text-sm relative z-10">
            {nextCountdownLabel
              ? `Prochain remplacement ${nextCountdownLabel}.`
              : 'Publiez une annonce pour trouver un remplacant.'}
          </p>
          <div className="flex items-end justify-between mt-6 relative z-10">
            <p className="text-4xl font-black">{String(upcomingContrats.length).padStart(2, '0')}</p>
            <span className="text-[#ff7c5c] font-bold text-sm flex items-center gap-1">
              Voir le planning <ArrowRight size={14} />
            </span>
          </div>
        </div>

        {/* Card 2 — Candidatures a traiter */}
        <div className="group bg-white p-6 rounded-[20px] shadow-[0_1px_2px_rgba(58,31,8,0.04),0_4px_16px_rgba(58,31,8,0.05)] border border-[#edd9c4] hover:border-[#dcbfa0] transition-all cursor-pointer relative overflow-hidden">
          <Inbox
            className="absolute -top-4 -right-4 text-[#3a1f08] opacity-5 group-hover:opacity-10 transition-opacity"
            size={120}
          />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-[#fbf0dc] text-[#b07824] rounded-xl">
              <Inbox size={20} />
            </div>
            <span className="text-xs font-bold text-[#b07824] bg-[#fbf0dc] px-3 py-1 rounded-full uppercase tracking-wider">
              En attente
            </span>
          </div>
          <h3 className="text-xl font-extrabold mb-1 relative z-10">Candidatures a traiter</h3>
          <p className="text-[#7a5434] text-sm relative z-10">
            {candidaturesRecues.length} remplacant{candidaturesRecues.length > 1 ? 's' : ''} interesse{candidaturesRecues.length > 1 ? 's' : ''} par vos annonces.
          </p>
          <div className="flex items-end justify-between mt-6 relative z-10">
            <p className="text-4xl font-black">{String(candidaturesEnAttente).padStart(2, '0')}</p>
            <span className="text-[#b07824] font-bold text-sm flex items-center gap-1">
              Traiter maintenant <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Section 3 — Grille 12 colonnes : planning + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
        {/* Colonne gauche — Planning des remplacements (timeline) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold flex items-center gap-2">
              <CalendarClock className="text-[#ff7c5c]" size={20} />
              Planning des remplacements
            </h3>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Semaine precedente" className="p-1.5 rounded-lg hover:bg-[#f7ede0] text-[#9a7b58] transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button type="button" aria-label="Semaine suivante" className="p-1.5 rounded-lg hover:bg-[#f7ede0] text-[#9a7b58] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {upcomingContrats.length === 0 ? (
            <div className="bg-white p-8 rounded-[20px] border border-[#edd9c4] text-center">
              <CalendarClock className="mx-auto text-[#dcbfa0] mb-3" size={40} />
              <p className="text-sm text-[#9a7b58]">
                Aucun remplacement planifie. Publiez une annonce pour recevoir des candidatures.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingContrats.map((contrat, index) => {
                const isFirst = index === 0;
                const donnees = contrat.parsedDonnees;
                const dateDebut = donnees.dates?.debut;
                const dateFin = donnees.dates?.fin;
                const shortDate = dateDebut ? formatShortDate(dateDebut) : null;
                const remplacantName = [donnees.remplacant?.first_name, donnees.remplacant?.last_name].filter(Boolean).join(' ') || 'Remplacant';
                const retrocession = donnees.taux_retrocession;

                return (
                  <div key={contrat.id} className={`relative pl-8 ${index < upcomingContrats.length - 1 ? 'before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-[2px] before:bg-[#ff7c5c]/20' : 'before:absolute before:left-[11px] before:top-0 before:h-1/2 before:w-[2px] before:bg-[#ff7c5c]/20'}`}>
                    {/* Point de la timeline */}
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[#fdf6ed] shadow-sm z-10 ${isFirst ? 'bg-[#ff7c5c]' : 'bg-[#edd9c4]'}`} />

                    {/* Carte */}
                    <div className={`p-5 rounded-[20px] border flex items-center gap-6 transition-all ${
                      isFirst
                        ? 'bg-[#ff7c5c] text-white shadow-lg border-[#ff7c5c]'
                        : contrat.statut === 'confirme'
                          ? 'bg-white border-[#edd9c4] hover:border-[#ff7c5c]/20'
                          : 'bg-[#fbf0e8]/60 border-dashed border-[#e3cdb4] opacity-80'
                    }`}>
                      {/* Colonne date */}
                      {shortDate && (
                        <div className={`text-center pr-6 ${isFirst ? 'border-r border-white/20' : 'border-r border-[#edd9c4]'}`}>
                          <p className={`text-[10px] font-black uppercase ${isFirst ? 'text-white/80' : 'text-[#9a7b58]'}`}>{shortDate.dayLabel}</p>
                          <p className={`text-2xl font-black leading-none ${isFirst ? 'text-white' : 'text-[#3a1f08]'}`}>{shortDate.dayNumber}</p>
                        </div>
                      )}

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-bold uppercase ${isFirst ? 'text-white/70' : 'text-[#9a7b58]'}`}>
                          {shortDate?.fullLabel ?? 'Date a definir'}
                          {dateDebut && dateFin && ` \u2022 ${new Date(dateDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(dateFin).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                        <h4 className={`font-extrabold text-lg truncate ${isFirst ? 'text-white' : 'text-[#3a1f08]'}`}>{remplacantName}</h4>
                        {donnees.adresse_cabinet && (
                          <div className={`flex items-center gap-1 mt-0.5 text-xs ${isFirst ? 'text-white/70' : 'text-[#7a5434]'}`}>
                            <MapPin size={12} /> {donnees.adresse_cabinet}
                          </div>
                        )}
                      </div>

                      {/* Droite : retrocession + statut */}
                      <div className="text-right flex-shrink-0">
                        {retrocession != null && (
                          <p className={`text-lg font-black ${isFirst ? 'text-white' : 'text-[#ff7c5c]'}`}>{retrocession}%</p>
                        )}
                        <ContratStatusBadge statut={contrat.statut} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Colonne droite — Alertes + Paiements recents + CTA Publier */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Alertes */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-[#9a7b58]">
              Alertes
            </h4>
            {candidaturesEnAttente > 0 ? (
              <div className="bg-[#fff0ea] border border-[#ffd9cb] p-5 rounded-[20px] space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#ffd9cb] text-[#e06245] rounded-lg flex-shrink-0">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#a4361c]">
                      {candidaturesEnAttente} candidature{candidaturesEnAttente > 1 ? 's' : ''} en
                      attente
                    </p>
                    <p className="text-xs text-[#b0543c] mt-0.5">
                      Des remplacants attendent votre reponse. Traitez-les pour ne pas les perdre.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-3 bg-[#ff7c5c] text-white text-sm font-bold rounded-xl hover:bg-[#e06245] transition-colors shadow-md shadow-[#ffd9cb]"
                >
                  Traiter les candidatures
                </button>
              </div>
            ) : (
              <div className="bg-[#eaf2ec] border border-[#d7e5da] p-5 rounded-[20px] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d7e5da] text-[#2d5e36] rounded-lg">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm font-bold text-[#2d5e36]">Tout est en ordre</p>
                </div>
                <p className="text-xs text-[#41704b] mt-2">
                  Aucune action requise pour le moment.
                </p>
              </div>
            )}
          </div>

          {/* Paiements recents */}
          <div className="bg-white p-6 rounded-[20px] border border-[#edd9c4] space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-lg">Derniers paiements</h4>
              <button type="button" className="text-[#ff7c5c] text-xs font-bold">
                Tout voir
              </button>
            </div>
            {paiementsCeMois.length === 0 ? (
              <p className="text-sm text-[#9a7b58] text-center py-4">
                Aucun paiement ce mois-ci
              </p>
            ) : (
              <div className="space-y-4">
                {paiementsCeMois.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-1 h-10 bg-[#5d8f66] rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#9a7b58] font-bold">
                        {new Date(p.created_at).toLocaleDateString('fr-FR')} &middot; Paye
                      </p>
                      <p className="text-sm font-bold truncate">
                        Versement #{p.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[#7a5434]">
                        {formatEUR.format(p.montant_retrocession_cents / 100)}
                      </p>
                    </div>
                    <Receipt className="text-[#dcbfa0] flex-shrink-0" size={18} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Publier une annonce */}
          <Link
            href="/publier"
            className="block bg-[#ff7c5c] p-5 rounded-[20px] text-white shadow-lg hover:brightness-105 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Plus size={18} />
              </div>
              <h4 className="font-extrabold">Publier une annonce</h4>
            </div>
            <p className="text-sm text-white/80">
              Trouvez un remplacant pour votre cabinet en quelques clics.
            </p>
          </Link>
        </aside>
      </div>
    </>
  );
}

// ─── Vue Remplacant ────────────────────────────────────────────────────────────
function RemplacantOverview({
  userId,
  supabase,
  profileName,
}: {
  userId: string;
  supabase: SupabaseClient;
  profileName?: string | undefined;
}) {
  const { data: candidatures } = useMesCandidatures(supabase, userId);
  const { data: paiements } = useMesPaiements(supabase, userId);

  // Contrats du remplacant
  const { data: contrats } = useQuery({
    queryKey: ['dashboard', 'contrats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contrats')
        .select('*')
        .eq('remplacant_id', userId);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  // KPIs
  const totalCandidatures = candidatures?.length ?? 0;
  const acceptees = candidatures?.filter((c) => c.statut === 'acceptee').length ?? 0;
  const contratsASigner = contrats?.filter(
    (c) => c.statut === 'en_attente_remplacant'
  ).length ?? 0;

  // Revenus du mois en cours
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const receptionsCeMois = paiements?.receptions?.filter(
    (p) => p.created_at >= startOfMonth
  ) ?? [];
  const totalRevenus = receptionsCeMois.reduce(
    (sum, p) => sum + p.montant_net_remplacant_cents,
    0
  );

  // 5 dernieres candidatures
  const recentCandidatures = (candidatures ?? []).slice(0, 5);

  // Nombre d'alertes = contrats a signer
  const alertCount = contratsASigner;

  // Mois courant
  const currentMonth = getCurrentMonthName();

  return (
    <>
      {/* Section 1 — Accueil + carte revenus */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(28px,3.4vw,40px)] leading-[0.98] font-extrabold tracking-[-0.04em] text-[#3a1f08]">
            Bonjour
            {profileName ? (
              <>
                , <em className="not-italic text-[#ff7c5c]">{profileName}</em>
              </>
            ) : null}
            .
          </h2>
          <p className="text-[#7a5434] mt-2 text-sm">
            {alertCount > 0 ? (
              <>
                Vous avez{' '}
                <span className="font-bold text-[#ff7c5c]">
                  {alertCount} alerte{alertCount > 1 ? 's' : ''}
                </span>{' '}
                necessitant votre attention.
              </>
            ) : (
              'Tout est en ordre pour le moment.'
            )}
          </p>
        </div>
        <div className="bg-white/70 px-4 py-2 rounded-xl flex items-center gap-3 border border-[#edd9c4]">
          <Coins className="text-[#ff7c5c]" size={20} />
          <div>
            <p className="text-[10px] uppercase font-bold text-[#9a7b58]">
              Revenus {currentMonth}
            </p>
            <p className="text-lg font-extrabold">{formatEUR.format(totalRevenus / 100)}</p>
          </div>
        </div>
      </div>

      {/* Section 2 — Deux hero cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Card 1 — Missions (candidatures acceptees) */}
        <div className="group bg-white p-6 rounded-[20px] shadow-[0_1px_2px_rgba(58,31,8,0.04),0_4px_16px_rgba(58,31,8,0.05)] border border-[#edd9c4] hover:border-[#ff7c5c]/30 transition-all cursor-pointer relative overflow-hidden">
          <CheckCircle2
            className="absolute -top-4 -right-4 text-[#3a1f08] opacity-5 group-hover:opacity-10 transition-opacity"
            size={120}
          />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-[#fff0ea] text-[#ff7c5c] rounded-xl">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-[#ff7c5c] bg-[#fff0ea] px-3 py-1 rounded-full uppercase tracking-wider">
              Acceptees
            </span>
          </div>
          <h3 className="text-xl font-extrabold mb-1 relative z-10">Missions obtenues</h3>
          <p className="text-[#7a5434] text-sm relative z-10">
            Vos candidatures acceptees par les titulaires.
          </p>
          <div className="flex items-end justify-between mt-6 relative z-10">
            <p className="text-4xl font-black">{acceptees}</p>
            <span className="text-[#ff7c5c] font-bold text-sm flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </span>
          </div>
        </div>

        {/* Card 2 — Candidatures en cours */}
        <div className="group bg-white p-6 rounded-[20px] shadow-[0_1px_2px_rgba(58,31,8,0.04),0_4px_16px_rgba(58,31,8,0.05)] border border-[#edd9c4] hover:border-[#dcbfa0] transition-all cursor-pointer relative overflow-hidden">
          <Send
            className="absolute -top-4 -right-4 text-[#3a1f08] opacity-5 group-hover:opacity-10 transition-opacity"
            size={120}
          />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-[#fbf0dc] text-[#b07824] rounded-xl">
              <Send size={20} />
            </div>
            <span className="text-xs font-bold text-[#b07824] bg-[#fbf0dc] px-3 py-1 rounded-full uppercase tracking-wider">
              En cours
            </span>
          </div>
          <h3 className="text-xl font-extrabold mb-1 relative z-10">Candidatures en cours</h3>
          <p className="text-[#7a5434] text-sm relative z-10">
            Les annonces auxquelles vous avez postule.
          </p>
          <div className="flex items-end justify-between mt-6 relative z-10">
            <p className="text-4xl font-black">{totalCandidatures}</p>
            <span className="text-[#b07824] font-bold text-sm flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Section 3 — Grille 12 colonnes : timeline + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
        {/* Colonne gauche — Activite recente (timeline) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold flex items-center gap-2">
              <Clock className="text-[#ff7c5c]" size={20} />
              Activite recente
            </h3>
          </div>

          {recentCandidatures.length === 0 ? (
            <div className="bg-white p-8 rounded-[20px] border border-[#edd9c4] text-center">
              <CalendarClock className="mx-auto text-[#dcbfa0] mb-3" size={40} />
              <p className="text-sm text-[#9a7b58]">
                Vous n&apos;avez pas encore postule a une annonce
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCandidatures.map((candidature, index) => {
                const isFirst = index === 0;
                const annonce = candidature.annonces as Record<string, unknown> | null;
                return (
                  <div
                    key={candidature.id}
                    className="relative pl-8 before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-[2px] before:bg-[#ff7c5c]/20"
                  >
                    {/* Point de la timeline */}
                    <div
                      className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-[#fdf6ed] shadow-sm z-10 ${
                        isFirst ? 'bg-[#ff7c5c]' : 'bg-[#edd9c4]'
                      }`}
                    />
                    {/* Carte */}
                    <div
                      className={`p-5 rounded-[20px] border flex items-center gap-6 transition-all ${
                        isFirst
                          ? 'bg-[#ff7c5c] text-white shadow-lg border-[#ff7c5c]'
                          : 'bg-white border-[#edd9c4] hover:border-[#ff7c5c]/20'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium mb-1 ${
                            isFirst ? 'text-white/70' : 'text-[#9a7b58]'
                          }`}
                        >
                          {new Date(candidature.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p
                          className={`text-sm font-bold truncate ${
                            isFirst ? 'text-white' : 'text-[#3a1f08]'
                          }`}
                        >
                          {(annonce?.ville as string) ?? 'Annonce'}
                        </p>
                        {annonce?.retrocession != null && (
                          <p
                            className={`text-xs mt-0.5 ${
                              isFirst ? 'text-white/70' : 'text-[#7a5434]'
                            }`}
                          >
                            {annonce.retrocession as number}% retrocession
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge statut={candidature.statut} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Colonne droite — Alertes + Paiements recents */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Alertes */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-[#9a7b58]">
              Alertes
            </h4>
            {contratsASigner > 0 ? (
              <div className="bg-[#fff0ea] border border-[#ffd9cb] p-5 rounded-[20px] space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#ffd9cb] text-[#e06245] rounded-lg flex-shrink-0">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#a4361c]">
                      {contratsASigner} contrat{contratsASigner > 1 ? 's' : ''} a signer
                    </p>
                    <p className="text-xs text-[#b0543c] mt-0.5">
                      Un titulaire attend votre signature. Signez pour confirmer votre remplacement.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-3 bg-[#ff7c5c] text-white text-sm font-bold rounded-xl hover:bg-[#e06245] transition-colors shadow-md shadow-[#ffd9cb]"
                >
                  Voir les contrats
                </button>
              </div>
            ) : (
              <div className="bg-[#eaf2ec] border border-[#d7e5da] p-5 rounded-[20px] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d7e5da] text-[#2d5e36] rounded-lg">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm font-bold text-[#2d5e36]">Tout est en ordre</p>
                </div>
                <p className="text-xs text-[#41704b] mt-2">
                  Aucune action requise pour le moment.
                </p>
              </div>
            )}
          </div>

          {/* Paiements recents */}
          <div className="bg-white p-6 rounded-[20px] border border-[#edd9c4] space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-lg">Derniers paiements</h4>
              <button type="button" className="text-[#ff7c5c] text-xs font-bold">
                Tout voir
              </button>
            </div>
            {receptionsCeMois.length === 0 ? (
              <p className="text-sm text-[#9a7b58] text-center py-4">
                Aucun paiement ce mois-ci
              </p>
            ) : (
              <div className="space-y-4">
                {receptionsCeMois.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-1 h-10 bg-[#5d8f66] rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#9a7b58] font-bold">
                        {new Date(p.created_at).toLocaleDateString('fr-FR')} &middot; Paye
                      </p>
                      <p className="text-sm font-bold truncate">
                        Reception #{p.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[#7a5434]">
                        {formatEUR.format(p.montant_net_remplacant_cents / 100)}
                      </p>
                    </div>
                    <Receipt className="text-[#dcbfa0] flex-shrink-0" size={18} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export function Overview({ role, userId, supabase, profileName }: OverviewProps) {
  if (role === 'titulaire') {
    return (
      <TitulaireOverview userId={userId} supabase={supabase} profileName={profileName} />
    );
  }
  return (
    <RemplacantOverview userId={userId} supabase={supabase} profileName={profileName} />
  );
}
