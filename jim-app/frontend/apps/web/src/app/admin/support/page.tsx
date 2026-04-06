// Page support tickets admin — Phase 4 "Admin avance"
// Gestion des tickets de support utilisateurs
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../../../components/providers/auth-provider';

type TicketStatus = 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
type TicketFilter = 'tous' | TicketStatus;

interface SupportTicket {
  id: string;
  profile_id: string;
  categorie: 'bug' | 'question' | 'suggestion' | 'partenariat';
  sujet: string;
  description: string;
  status: TicketStatus;
  reponse: string | null;
  repondu_at: string | null;
  app_version: string | null;
  device_model: string | null;
  os_version: string | null;
  last_screen: string | null;
  screenshot_url: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  ouvert: 'Ouvert',
  en_cours: 'En cours',
  resolu: 'Resolu',
  ferme: 'Ferme',
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  ouvert: 'bg-blue-100 text-blue-700',
  en_cours: 'bg-amber-100 text-amber-700',
  resolu: 'bg-green-100 text-green-700',
  ferme: 'bg-gray-100 text-gray-500',
};

const CATEGORIE_COLORS: Record<string, string> = {
  bug: 'bg-red-100 text-red-700',
  question: 'bg-blue-100 text-blue-700',
  suggestion: 'bg-purple-100 text-purple-700',
  partenariat: 'bg-teal-100 text-teal-700',
};

const FILTER_TABS: TicketFilter[] = ['tous', 'ouvert', 'en_cours', 'resolu', 'ferme'];

function TicketCard({
  ticket,
  onTakeCharge,
  onReply,
  onClose,
  isPending,
}: {
  ticket: SupportTicket;
  onTakeCharge: (id: string) => void;
  onReply: (id: string, reponse: string) => void;
  onClose: (id: string) => void;
  isPending: boolean;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    if (replyText.trim().length === 0) return;
    onReply(ticket.id, replyText.trim());
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-jim-border p-5 shadow-[var(--jim-shadow-sm)]">
      {/* En-tete : categorie + date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORIE_COLORS[ticket.categorie] ?? 'bg-gray-100 text-gray-600'}`}>
            {ticket.categorie}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[ticket.status]}`}>
            {STATUS_LABELS[ticket.status]}
          </span>
        </div>
        <span className="text-xs text-jim-muted">
          {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Sujet + description */}
      <h3 className="font-semibold text-jim-text mb-1">{ticket.sujet}</h3>
      <p className="text-sm text-jim-text-body line-clamp-3 mb-3">{ticket.description}</p>

      {/* Metadonnees techniques */}
      {(ticket.app_version || ticket.device_model) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {ticket.app_version && (
            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">v{ticket.app_version}</span>
          )}
          {ticket.device_model && (
            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">{ticket.device_model}</span>
          )}
          {ticket.os_version && (
            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">{ticket.os_version}</span>
          )}
        </div>
      )}

      {/* Reponse existante */}
      {ticket.reponse && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
          <p className="text-xs font-medium text-green-700 mb-1">Reponse admin</p>
          <p className="text-sm text-green-800">{ticket.reponse}</p>
          {ticket.repondu_at && (
            <p className="text-xs text-green-600 mt-1">
              {new Date(ticket.repondu_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}

      {/* Zone de reponse */}
      {showReply && (
        <div className="mb-3">
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Redigez votre reponse..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-jim-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--jim-primary)] focus:border-transparent resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmitReply}
              disabled={isPending || replyText.trim().length === 0}
              className="px-4 py-1.5 text-sm font-medium text-white bg-[var(--jim-primary)] rounded-lg hover:bg-[var(--jim-primary-hover)] disabled:opacity-50 transition-colors"
            >
              Envoyer
            </button>
            <button
              onClick={() => { setShowReply(false); setReplyText(''); }}
              className="px-4 py-1.5 text-sm text-jim-muted hover:text-jim-text transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        {ticket.status === 'ouvert' && (
          <button
            onClick={() => onTakeCharge(ticket.id)}
            disabled={isPending}
            className="px-3 py-1.5 text-xs font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            Prendre en charge
          </button>
        )}
        {(ticket.status === 'ouvert' || ticket.status === 'en_cours') && (
          <button
            onClick={() => setShowReply(true)}
            disabled={isPending || showReply}
            className="px-3 py-1.5 text-xs font-medium text-[var(--jim-primary)] bg-[var(--jim-primary-light)] rounded-lg hover:bg-orange-100 disabled:opacity-50 transition-colors"
          >
            Repondre
          </button>
        )}
        {ticket.status !== 'ferme' && (
          <button
            onClick={() => onClose(ticket.id)}
            disabled={isPending}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Fermer
          </button>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const { supabase } = useAuthContext();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TicketFilter>('tous');

  // Requete tickets
  const tickets = useQuery({
    queryKey: ['admin-tickets', filter],
    queryFn: async () => {
      let q = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (filter !== 'tous') q = q.eq('status', filter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as SupportTicket[];
    },
  });

  // Mutation : prendre en charge (status -> en_cours)
  const takeCharge = useMutation({
    mutationFn: async (ticketId: string) => {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'en_cours' })
        .eq('id', ticketId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
  });

  // Mutation : repondre (reponse + status -> resolu)
  const reply = useMutation({
    mutationFn: async ({ ticketId, reponse }: { ticketId: string; reponse: string }) => {
      const { error } = await supabase
        .from('support_tickets')
        .update({ reponse, repondu_at: new Date().toISOString(), status: 'resolu' })
        .eq('id', ticketId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
  });

  // Mutation : fermer (status -> ferme)
  const close = useMutation({
    mutationFn: async (ticketId: string) => {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'ferme' })
        .eq('id', ticketId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
  });

  const isPending = takeCharge.isPending || reply.isPending || close.isPending;

  return (
    <div>
      <h1 className="text-2xl font-bold text-jim-text mb-6">Support</h1>

      {/* Onglets de filtre */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === tab
                ? 'bg-[var(--jim-primary)] text-white shadow-sm'
                : 'bg-white text-jim-muted border border-jim-border hover:border-[var(--jim-primary)] hover:text-[var(--jim-primary)]'
            }`}
          >
            {tab === 'tous' ? 'Tous' : STATUS_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Erreur */}
      {tickets.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-700">Erreur lors du chargement des tickets.</p>
        </div>
      )}

      {/* Mutation erreur */}
      {(takeCharge.isError || reply.isError || close.isError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-700">Erreur lors de la mise a jour du ticket.</p>
        </div>
      )}

      {/* Chargement */}
      {tickets.isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-jim-border p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Liste des tickets */}
      {tickets.data && tickets.data.length === 0 && (
        <p className="text-jim-muted text-center py-12">
          Aucun ticket {filter !== 'tous' ? STATUS_LABELS[filter].toLowerCase() : ''}.
        </p>
      )}

      {tickets.data && tickets.data.length > 0 && (
        <div className="space-y-4">
          {tickets.data.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onTakeCharge={id => takeCharge.mutate(id)}
              onReply={(id, reponse) => reply.mutate({ ticketId: id, reponse })}
              onClose={id => close.mutate(id)}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
