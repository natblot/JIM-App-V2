'use client';

// Page retour Stripe onboarding — annule / refresh
// Utilisee comme refreshUrl si l'utilisateur interrompt l'onboarding
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { AppPage } from '../../../../components/app-shell/app-page';

export default function AnnulePage() {
  return (
    <AppPage>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-6">
        <div className="bg-white rounded-[20px] shadow-[0_1px_2px_rgba(58,31,8,0.04),0_4px_16px_rgba(58,31,8,0.05)] border border-[#edd9c4] p-8 max-w-md text-center">
          <AlertCircle size={64} className="text-[#b07824] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#3a1f08] mb-2">Configuration interrompue</h1>
          <p className="text-sm text-[#7a5434] mb-6">
            La configuration de votre compte Stripe a ete interrompue. Vous pouvez reessayer a tout
            moment depuis votre dashboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-[#ff7c5c] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#e06245] transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    </AppPage>
  );
}
