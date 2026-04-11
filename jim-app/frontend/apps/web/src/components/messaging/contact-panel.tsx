'use client';

// Panneau droit — profil du contact, missions en commun, contrats, signalement
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MoreHorizontal, FileText, Flag, CheckCircle, AlertCircle, Loader2, ArrowRight, Banknote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { ConversationWithParticipant } from '@jim/shared/hooks/useConversations';
import { useCreateSignalement } from '@jim/shared/hooks/useCreateSignalement';
import { useAuthContext } from '../providers/auth-provider';

// Categories de signalement
const SIGNALEMENT_CATEGORIES = [
  { value: 'profil_frauduleux', label: 'Profil frauduleux' },
  { value: 'contenu_inapproprie', label: 'Contenu inapproprie' },
  { value: 'harcelement', label: 'Harcelement' },
  { value: 'annonce_suspecte', label: 'Annonce suspecte' },
  { value: 'autre', label: 'Autre' },
] as const;

type SignalementCategorie = (typeof SIGNALEMENT_CATEGORIES)[number]['value'];

// Statuts de contrat avec styles associes
const CONTRAT_STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  brouillon: { label: 'Brouillon', bg: 'bg-gray-100', text: 'text-gray-600' },
  en_attente: { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700' },
  confirme: { label: 'Confirme', bg: 'bg-jim-success-bg', text: 'text-jim-success' },
  annule: { label: 'Annule', bg: 'bg-jim-destructive-bg', text: 'text-jim-destructive' },
};

interface ContactPanelProps {
  conversation: ConversationWithParticipant;
  onClose: () => void;
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function ContactPanel({ conversation, onClose }: ContactPanelProps) {
  const { supabase, user } = useAuthContext();
  const name = conversation.other_participant_name ?? 'Praticien';
  const avatar = conversation.other_participant_avatar;

  // Determiner l'ID de l'autre participant
  const otherParticipantId =
    conversation.participant_1_id === user?.id
      ? conversation.participant_2_id
      : conversation.participant_1_id;

  // --- Contrats reels ---
  const contrats = useQuery({
    queryKey: ['contrats', conversation.candidature_id],
    queryFn: async () => {
      if (!conversation.candidature_id) return [];
      const { data } = await supabase
        .from('contrats')
        .select('id, statut, created_at, montant_total_cents')
        .eq('candidature_id', conversation.candidature_id)
        .order('created_at', { ascending: false });
      return data ?? [];
    },
    enabled: !!conversation.candidature_id,
  });

  // --- Signalement ---
  const createSignalement = useCreateSignalement(supabase);
  const [showSignalementForm, setShowSignalementForm] = useState(false);
  const [signalementCategorie, setSignalementCategorie] = useState<SignalementCategorie>('profil_frauduleux');
  const [signalementDescription, setSignalementDescription] = useState('');
  const [signalementSuccess, setSignalementSuccess] = useState(false);

  function handleSignalementSubmit() {
    if (!otherParticipantId) return;
    createSignalement.mutate(
      {
        contenuType: 'profile',
        contenuId: otherParticipantId,
        categorie: signalementCategorie,
        ...(signalementDescription ? { description: signalementDescription } : {}),
      },
      {
        onSuccess: () => {
          setSignalementSuccess(true);
          setShowSignalementForm(false);
          setSignalementDescription('');
        },
      },
    );
  }

  return (
    <aside className="w-80 bg-white border-l border-jim-border flex flex-col p-8 overflow-y-auto messaging-scroll flex-shrink-0 rounded-r-3xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-jim-primary-pale text-jim-muted hover:text-jim-primary transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-jim-primary-pale text-jim-muted hover:text-jim-primary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </header>

      {/* Profil */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative mb-4">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full border-4 border-jim-background soft-shadow object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-jim-background soft-shadow bg-jim-primary-pale flex items-center justify-center text-jim-primary font-bold text-2xl">
              {getInitials(name)}
            </div>
          )}
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-jim-success border-4 border-white rounded-full" />
        </div>
        <h2 className="text-xl font-bold text-jim-text mb-1">{name}</h2>
        <div className="flex items-center gap-2 text-xs text-jim-success font-medium">
          <span className="w-1.5 h-1.5 bg-jim-success rounded-full" />
          En ligne
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Missions en commun */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-jim-text mb-4">
            Missions en commun
          </h3>
          <div className="space-y-3">
            {conversation.annonce_title ? (
              <div className="p-4 bg-jim-background rounded-2xl hover:bg-jim-primary-pale transition-colors cursor-pointer border border-jim-border">
                <h4 className="text-xs font-bold truncate text-jim-text">
                  {conversation.annonce_title}
                </h4>
                <p className="text-[10px] text-jim-muted mt-1">Mission active</p>
              </div>
            ) : (
              <p className="text-xs text-jim-muted">Aucune mission en commun</p>
            )}
          </div>
        </div>

        {/* Contrats */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-jim-text mb-4">
            Contrats
          </h3>
          {contrats.isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={18} className="animate-spin text-jim-muted" />
            </div>
          ) : !contrats.data || contrats.data.length === 0 ? (
            <p className="text-xs text-jim-muted">Aucun contrat</p>
          ) : (
            <div className="space-y-3">
              {contrats.data.map((contrat) => {
                const fallback = { label: 'Brouillon', bg: 'bg-gray-100', text: 'text-gray-600' };
                const style = CONTRAT_STATUS_STYLES[contrat.statut] ?? fallback;
                return (
                  <Link
                    key={contrat.id}
                    href={`/contrat/${contrat.id}`}
                    className="block p-4 bg-jim-background rounded-2xl border border-jim-border hover:bg-jim-primary-pale transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-jim-muted" />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-jim-muted group-hover:text-jim-primary transition-colors" />
                    </div>
                    <p className="text-[10px] text-jim-muted">
                      {formatDate(contrat.created_at)}
                    </p>
                    {contrat.montant_total_cents != null && contrat.montant_total_cents > 0 && (
                      <p className="text-xs font-bold text-jim-text mt-1">
                        {formatCents(contrat.montant_total_cents)}
                      </p>
                    )}
                  </Link>
                );
              })}
              {/* Raccourci vers les paiements si au moins un contrat confirme */}
              {contrats.data.some((c) => c.statut === 'confirme') && (
                <Link
                  href="/dashboard?tab=paiements"
                  className="flex items-center justify-between p-3 bg-jim-primary-pale rounded-2xl border border-jim-primary/20 hover:bg-jim-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Banknote size={14} className="text-jim-primary" />
                    <span className="text-xs font-semibold text-jim-primary">
                      Gerer les versements
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-jim-primary group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Signaler */}
        <div className="pt-4">
          {signalementSuccess ? (
            <div className="flex items-center gap-2 p-4 bg-jim-success-bg rounded-2xl border border-jim-success/20">
              <CheckCircle size={16} className="text-jim-success flex-shrink-0" />
              <p className="text-xs font-medium text-jim-success">
                Signalement envoye. Merci.
              </p>
            </div>
          ) : showSignalementForm ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-jim-text">
                Signaler {name}
              </h3>

              {/* Categorie */}
              <select
                value={signalementCategorie}
                onChange={(e) => setSignalementCategorie(e.target.value as SignalementCategorie)}
                className="w-full px-3 py-2 text-xs border border-jim-border rounded-xl bg-jim-background text-jim-text focus:outline-none focus:ring-2 focus:ring-jim-primary/30"
              >
                {SIGNALEMENT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Description */}
              <textarea
                value={signalementDescription}
                onChange={(e) => setSignalementDescription(e.target.value)}
                placeholder="Decrivez le probleme (optionnel)..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-jim-border rounded-xl bg-jim-background text-jim-text placeholder:text-jim-muted resize-none focus:outline-none focus:ring-2 focus:ring-jim-primary/30"
              />

              {/* Erreur */}
              {createSignalement.isError && (
                <div className="flex items-center gap-2 text-xs text-jim-destructive">
                  <AlertCircle size={14} />
                  <span>Erreur lors de l&apos;envoi. Reessayez.</span>
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSignalementForm(false)}
                  className="flex-1 py-2 px-3 border border-jim-border rounded-xl text-jim-muted font-medium text-xs hover:bg-jim-background transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSignalementSubmit}
                  disabled={createSignalement.isPending}
                  className="flex-1 py-2 px-3 bg-jim-destructive text-white rounded-xl font-medium text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {createSignalement.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Flag size={14} />
                  )}
                  Envoyer
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSignalementForm(true)}
              className="w-full py-4 px-6 border border-jim-border rounded-2xl text-jim-primary font-bold text-sm hover:bg-jim-primary-pale transition-all flex items-center justify-center gap-2"
            >
              <Flag size={16} />
              Signaler
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
