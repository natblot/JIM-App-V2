'use client';

// Page de connexion — email/password via @jim/shared hooks
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignIn, signInSchema } from '@jim/shared';
import { useAuthContext } from '../../../components/providers/auth-provider';
import { isValidRedirect } from '../../../lib/validate-redirect';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = isValidRedirect(searchParams.get('redirect'));
  const { supabase } = useAuthContext();

  const signIn = useSignIn(supabase);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Rate limiting client-side
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState('');

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  // Countdown timer
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = lockedUntil - Date.now();
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setCountdown('');
      } else {
        const min = Math.floor(remaining / 60000);
        const sec = Math.floor((remaining % 60000) / 1000);
        setCountdown(`${min}:${sec.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isLocked) return;

    // Validation Zod
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    signIn.mutate(result.data, {
      onSuccess: () => router.push(redirect),
      onError: (err) => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
        }
        setErrors({ form: err.message });
      },
    });
  }, [email, password, isLocked, signIn, redirect, router, attempts]);

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-neutral-900 text-center mb-6">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Erreur globale */}
          {errors.form && (
            <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
              {errors.form}
            </div>
          )}

          {/* Rate limiting UI */}
          {isLocked && (
            <div className="bg-amber-50 text-amber-800 text-sm rounded-xl px-4 py-3 border border-amber-200">
              Trop de tentatives — reessayez dans {countdown}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLocked}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors disabled:opacity-50 disabled:bg-neutral-50"
              placeholder="votre@email.fr"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors disabled:opacity-50 disabled:bg-neutral-50"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={signIn.isPending || isLocked}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {signIn.isPending && <Loader2 size={16} className="animate-spin" />}
            Se connecter
          </button>
        </form>

        {/* Liens */}
        <div className="mt-6 text-center text-sm text-neutral-500 space-y-2">
          <p>
            <a href="/reset-password" className="text-brand hover:underline font-medium">
              Mot de passe oublie ?
            </a>
          </p>
          <p>
            Pas encore de compte ?{' '}
            <a href="/register" className="text-brand hover:underline font-medium">
              Creer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
