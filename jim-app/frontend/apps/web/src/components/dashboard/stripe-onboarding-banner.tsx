'use client';

// Banniere onboarding Stripe Connect — cote remplacant
// Affichee dans l'onglet Paiements tant que le compte Stripe n'est pas verifie
// Prerequis : la RCP doit etre verifiee avant de pouvoir initier l'onboarding

import { useState } from 'react';
import { Banknote, AlertCircle, ShieldAlert } from 'lucide-react';
import { useStripeOnboardingStatus, useStripeOnboarding } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';

interface StripeOnboardingBannerProps {
  userId: string;
}

export function StripeOnboardingBanner({ userId }: StripeOnboardingBannerProps) {
  const { supabase } = useAuthContext();
  const { data: status, isLoading } = useStripeOnboardingStatus(supabase, userId);
  const onboarding = useStripeOnboarding(supabase);
  const [error, setError] = useState<string | null>(null);

  // Pas afficher pendant le chargement ni si verifie
  if (isLoading || !status) return null;
  if (status.onboardingStatus === 'verified') return null;

  // RCP bloque l'onboarding
  if (!status.rcpVerified) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <ShieldAlert size={20} className="text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            Verification RCP requise
          </p>
          <p className="text-xs text-amber-800">
            Vous devez d&apos;abord verifier votre Responsabilite Civile Professionnelle avant de
            pouvoir connecter votre compte bancaire pour recevoir vos retrocessions.
          </p>
        </div>
      </div>
    );
  }

  // Messages selon le statut (verified deja filtre plus haut)
  const messages: Record<'not_started' | 'in_progress' | 'action_required', { title: string; desc: string; cta: string }> = {
    not_started: {
      title: 'Connectez votre compte bancaire',
      desc: 'Pour recevoir vos retrocessions, connectez votre compte bancaire via notre service de securisation Stripe.',
      cta: 'Connecter mon compte',
    },
    in_progress: {
      title: 'Configuration en cours',
      desc: "Votre compte Stripe est partiellement configure. Completez l'onboarding pour commencer a recevoir vos retrocessions.",
      cta: 'Continuer la configuration',
    },
    action_required: {
      title: 'Action requise',
      desc: 'Stripe a besoin d\'informations supplementaires pour verifier votre compte. Completez les etapes manquantes.',
      cta: 'Completer les informations',
    },
  };

  const onboardingKey = status.onboardingStatus as 'not_started' | 'in_progress' | 'action_required';
  const current = messages[onboardingKey];

  // Lancer l'onboarding — redirection vers Stripe
  function handleConnect() {
    setError(null);
    const origin = window.location.origin;
    onboarding.mutate(
      {
        refreshUrl: `${origin}/paiement/annule`,
        returnUrl: `${origin}/paiement/succes`,
      },
      {
        onSuccess: (data) => {
          if (data.onboarding_url) {
            window.location.href = data.onboarding_url;
          } else {
            setError('Impossible de demarrer la configuration. Reessayez.');
          }
        },
        onError: (err) => {
          setError(
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue. Reessayez.'
          );
        },
      }
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#ff7c5c]/10 to-[#ff7c5c]/5 border border-[#ff7c5c]/20 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#ff7c5c] flex items-center justify-center">
          <Banknote size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">{current.title}</p>
          <p className="text-xs text-gray-600 mb-3">{current.desc}</p>

          {error && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleConnect}
            disabled={onboarding.isPending}
            className="bg-[#ff7c5c] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#e86b4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {onboarding.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Redirection...</span>
              </>
            ) : (
              current.cta
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
