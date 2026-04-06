'use client';

// Page de reinitialisation de mot de passe — envoie un lien par email
import { useState } from 'react';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../../../components/providers/auth-provider';

export default function ResetPasswordPage() {
  const { supabase } = useAuthContext();
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }
    setIsPending(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setIsPending(false);
    if (err) {
      setError(err.message);
    } else {
      setIsSent(true);
    }
  }

  if (isSent) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 text-center">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Email envoye</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Un lien de reinitialisation a ete envoye a <span className="font-medium text-neutral-700">{email}</span>.
            Verifiez votre boite de reception.
          </p>
          <a href="/login" className="text-sm text-brand hover:underline font-medium">
            ← Retour a la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-neutral-900 text-center mb-2">
          Mot de passe oublie
        </h1>
        <p className="text-sm text-neutral-500 text-center mb-6">
          Saisissez votre email pour recevoir un lien de reinitialisation.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              placeholder="votre@email.fr"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Envoyer le lien
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-neutral-500 hover:text-neutral-700 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Retour a la connexion
          </a>
        </div>
      </div>
    </div>
  );
}
