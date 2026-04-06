'use client';

// Bouton "Postuler" reel — verifie auth, role, deja postule, incompatibilites
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, AlertTriangle, CheckCircle, LogIn, Ban } from 'lucide-react';
import { useCreateCandidature, useIncompatibilityCheck, useCurrentProfile } from '@jim/shared';
import type { IncompatibilityWarning } from '@jim/shared';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../providers/auth-provider';

interface PostulerButtonProps {
  annonceId: string;
}

export function PostulerButton({ annonceId }: PostulerButtonProps) {
  const router = useRouter();
  const { user, isLoading: authLoading, supabase } = useAuthContext();

  const profile = useCurrentProfile(supabase);
  const incompatibilities = useIncompatibilityCheck(supabase, annonceId, !!user);
  const createCandidature = useCreateCandidature(supabase);

  // Verifier si deja postule
  const alreadyApplied = useQuery({
    queryKey: ['candidature-check', annonceId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('candidatures')
        .select('id')
        .eq('annonce_id', annonceId)
        .eq('remplacant_id', user!.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pas connecte — rediriger vers login
  if (!authLoading && !user) {
    return (
      <a
        href={`/login?redirect=${encodeURIComponent(`/annonce/${annonceId}`)}`}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors"
      >
        <LogIn size={16} /> Se connecter pour postuler
      </a>
    );
  }

  // Chargement auth / profil
  if (authLoading || profile.isLoading) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-neutral-200 text-neutral-400 cursor-not-allowed"
      >
        <Loader2 size={16} className="animate-spin" /> Chargement...
      </button>
    );
  }

  // Check role titulaire — seuls les remplacants peuvent postuler
  const role = profile.data?.role as string | undefined;
  if (role === 'titulaire') {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-500 cursor-not-allowed border border-neutral-200"
      >
        <Ban size={16} /> Seuls les remplacants peuvent postuler
      </button>
    );
  }

  // Deja postule
  if (alreadyApplied.data || success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">Candidature envoyee !</p>
          <p className="text-xs text-green-600 mt-0.5">
            Le titulaire sera notifie. Suivez l&apos;avancement dans vos messages.
          </p>
        </div>
      </div>
    );
  }

  // Formulaire de candidature
  if (showForm) {
    const warnings: IncompatibilityWarning[] = incompatibilities.data ?? [];

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const input: { annonce_id: string; message?: string; warnings?: Array<{ type: string; detail: string }> } = {
        annonce_id: annonceId,
      };
      const trimmed = message.trim();
      if (trimmed) input.message = trimmed;
      if (warnings.length > 0) input.warnings = warnings.map((w) => ({ type: w.type, detail: w.detail }));

      createCandidature.mutate(input, {
        onSuccess: () => setSuccess(true),
      });
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Warnings incompatibilites */}
        {warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-amber-800 flex items-center gap-1.5 mb-1">
              <AlertTriangle size={14} /> Points d&apos;attention
            </p>
            <ul className="text-xs text-amber-700 space-y-1">
              {warnings.map((w, i) => (
                <li key={i}>• {w.detail}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Message optionnel */}
        <div>
          <label htmlFor="candidature-message" className="block text-xs font-medium text-neutral-600 mb-1">
            Message au titulaire (optionnel)
          </label>
          <textarea
            id="candidature-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none transition-colors"
            placeholder="Presentez-vous en quelques mots..."
          />
          <p className="text-xs text-neutral-400 text-right">{message.length}/500</p>
        </div>

        {/* Erreur */}
        {createCandidature.isError && (
          <p className="text-sm text-red-600">{createCandidature.error.message}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-600 border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={createCandidature.isPending}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {createCandidature.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Envoyer
          </button>
        </div>
      </form>
    );
  }

  // Bouton initial
  return (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors"
    >
      <Send size={16} /> Postuler a ce remplacement
    </button>
  );
}
