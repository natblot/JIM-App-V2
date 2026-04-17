'use client';

// Page retour Stripe onboarding — annule / refresh
// Utilisee comme refreshUrl si l'utilisateur interrompt l'onboarding
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AnnulePage() {
  return (
    <div className="min-h-screen bg-[#fdf6ed] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
        <AlertCircle size={64} className="text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration interrompue</h1>
        <p className="text-sm text-gray-500 mb-6">
          La configuration de votre compte Stripe a ete interrompue. Vous pouvez reessayer a tout
          moment depuis votre dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-[#ff7c5c] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#e86b4d] transition-colors"
        >
          Retour au dashboard
        </Link>
      </div>
    </div>
  );
}
