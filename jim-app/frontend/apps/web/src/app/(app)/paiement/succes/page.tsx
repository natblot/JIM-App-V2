'use client';

// Page retour Stripe onboarding — succes
// Utilisee comme returnUrl apres la completion de l'onboarding Stripe Connect
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { AppPage } from '../../../../components/app-shell/app-page';

export default function SuccesPage() {
  return (
    <AppPage>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-6">
        <div className="bg-white rounded-[20px] shadow-[0_1px_2px_rgba(58,31,8,0.04),0_4px_16px_rgba(58,31,8,0.05)] border border-[#edd9c4] p-8 max-w-md text-center">
          <CheckCircle size={64} className="text-[#5d8f66] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#3a1f08] mb-2">Compte connecte</h1>
          <p className="text-sm text-[#7a5434] mb-6">
            Votre compte Stripe est configure. Vous pouvez desormais recevoir vos retrocessions.
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
