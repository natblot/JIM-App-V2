'use client';

// Page retour Stripe onboarding — succes
// Utilisee comme returnUrl apres la completion de l'onboarding Stripe Connect
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccesPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ed] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compte connecte</h1>
        <p className="text-sm text-gray-500 mb-6">
          Votre compte Stripe est configure. Vous pouvez desormais recevoir vos retrocessions.
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
