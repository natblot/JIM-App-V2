'use client';

// Page d'inscription multi-etapes : 1) role, 2) identite, 3) verification RPPS
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { useSignUp, useRppsVerify } from '@jim/shared';
import { signUpSchema, rppsVerifySchema } from '@jim/shared';
import { useAuthContext } from '../../../components/providers/auth-provider';

type Step = 'role' | 'identity' | 'rpps';

export default function RegisterPage() {
  const router = useRouter();
  const { supabase } = useAuthContext();

  const signUp = useSignUp(supabase);
  const rppsVerify = useRppsVerify(supabase);

  const [step, setStep] = useState<Step>('role');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Champs formulaire
  const [role, setRole] = useState<'remplacant' | 'titulaire' | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cguAccepted, setCguAccepted] = useState(false);
  const [rppsNumber, setRppsNumber] = useState('');
  const [rppsStatus, setRppsStatus] = useState<'idle' | 'verified' | 'error'>('idle');

  // Etape 1 : choix du role
  function handleRoleSelect(r: 'remplacant' | 'titulaire') {
    setRole(r);
    setStep('identity');
    setErrors({});
  }

  // Etape 2 : validation identite + creation compte
  function handleIdentitySubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    if (!role) {
      setErrors({ form: 'Veuillez choisir un role' });
      setStep('role');
      return;
    }

    const result = signUpSchema.safeParse({
      email,
      password,
      confirmPassword,
      role,
      firstName,
      lastName,
      cguAccepted,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    signUp.mutate(
      { email, password, firstName, lastName, role },
      {
        onSuccess: () => setStep('rpps'),
        onError: (err) => setErrors({ form: err.message }),
      },
    );
  }

  // Etape 3 : verification RPPS
  function handleRppsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setRppsStatus('idle');

    const result = rppsVerifySchema.safeParse({ rppsNumber });
    if (!result.success) {
      setErrors({ rppsNumber: result.error.issues[0]?.message ?? 'Numero invalide' });
      return;
    }

    rppsVerify.mutate(result.data, {
      onSuccess: (data) => {
        if (data.status === 'verified') {
          setRppsStatus('verified');
          // Redirection apres verification reussie
          setTimeout(() => router.push('/'), 1500);
        }
      },
      onError: (err) => {
        setRppsStatus('error');
        setErrors({ rppsNumber: err.message });
      },
    });
  }

  // Passer l'etape RPPS (verifier plus tard)
  function handleSkipRpps() {
    router.push('/');
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
        {/* Indicateur d'etapes */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(['role', 'identity', 'rpps'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step
                    ? 'bg-brand text-white'
                    : (['role', 'identity', 'rpps'].indexOf(step) > i)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {(['role', 'identity', 'rpps'].indexOf(step) > i) ? (
                  <CheckCircle size={16} />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-neutral-200" />}
            </div>
          ))}
        </div>

        {/* Etape 1 : Role */}
        {step === 'role' && (
          <div>
            <h1 className="text-xl font-bold text-neutral-900 text-center mb-2">
              Creer un compte
            </h1>
            <p className="text-sm text-neutral-500 text-center mb-6">
              Etes-vous kinesitherapeute titulaire ou remplacant ?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRoleSelect('remplacant')}
                className="w-full p-4 rounded-xl border-2 border-neutral-200 hover:border-brand hover:bg-brand-light/50 text-left transition-colors group"
              >
                <p className="font-semibold text-neutral-900 group-hover:text-brand">
                  Je suis remplacant
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Je cherche des remplacements disponibles
                </p>
              </button>
              <button
                onClick={() => handleRoleSelect('titulaire')}
                className="w-full p-4 rounded-xl border-2 border-neutral-200 hover:border-brand hover:bg-brand-light/50 text-left transition-colors group"
              >
                <p className="font-semibold text-neutral-900 group-hover:text-brand">
                  Je suis titulaire
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Je cherche un remplacant pour mon cabinet
                </p>
              </button>
            </div>
            <p className="text-center text-sm text-neutral-500 mt-6">
              Deja un compte ?{' '}
              <a href="/login" className="text-brand hover:underline font-medium">
                Se connecter
              </a>
            </p>
          </div>
        )}

        {/* Etape 2 : Identite */}
        {step === 'identity' && (
          <div>
            <h1 className="text-xl font-bold text-neutral-900 text-center mb-2">
              Vos informations
            </h1>
            <p className="text-sm text-neutral-500 text-center mb-6">
              En tant que <span className="font-medium text-brand">{role === 'remplacant' ? 'remplacant' : 'titulaire'}</span>
              {' '}<button onClick={() => setStep('role')} className="underline text-neutral-500 hover:text-brand">(changer)</button>
            </p>

            <form onSubmit={handleIdentitySubmit} className="flex flex-col gap-4">
              {errors.form && (
                <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
                  {errors.form}
                </div>
              )}

              {/* Prenom + Nom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">Prenom</label>
                  <input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    placeholder="Jean"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">Nom</label>
                  <input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    placeholder="Dupont"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  placeholder="votre@email.fr"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                    placeholder="8 caracteres min, 1 majuscule, 1 chiffre"
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

              {/* Confirmation */}
              <div>
                <label htmlFor="reg-confirm" className="block text-sm font-medium text-neutral-700 mb-1">Confirmer le mot de passe</label>
                <input
                  id="reg-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  placeholder="Confirmer le mot de passe"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* CGU */}
              <label className="flex items-start gap-2 text-sm text-neutral-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cguAccepted}
                  onChange={(e) => setCguAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-brand focus:ring-brand"
                />
                <span>
                  J&apos;accepte les{' '}
                  <a href="/cgu" target="_blank" className="text-brand hover:underline">conditions generales</a>
                  {' '}et la{' '}
                  <a href="/confidentialite" target="_blank" className="text-brand hover:underline">politique de confidentialite</a>
                </span>
              </label>
              {errors.cguAccepted && <p className="text-red-500 text-xs">{errors.cguAccepted}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={signUp.isPending}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {signUp.isPending && <Loader2 size={16} className="animate-spin" />}
                Creer mon compte
              </button>
            </form>
          </div>
        )}

        {/* Etape 3 : Verification RPPS */}
        {step === 'rpps' && (
          <div>
            <h1 className="text-xl font-bold text-neutral-900 text-center mb-2">
              Verification RPPS
            </h1>
            <p className="text-sm text-neutral-500 text-center mb-6">
              Votre numero RPPS (11 chiffres) permet de verifier votre inscription a l&apos;Ordre des kinesitherapeutes.
            </p>

            {rppsStatus === 'verified' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-green-800">RPPS verifie !</p>
                <p className="text-sm text-green-600 mt-1">Redirection en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleRppsSubmit} className="flex flex-col gap-4">
                {rppsStatus === 'error' && errors.rppsNumber && (
                  <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100 flex items-start gap-2">
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{errors.rppsNumber}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="rpps" className="block text-sm font-medium text-neutral-700 mb-1">Numero RPPS</label>
                  <div className="relative">
                    <input
                      id="rpps"
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      value={rppsNumber}
                      onChange={(e) => setRppsNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors tracking-wider font-mono"
                      placeholder="10000000000"
                    />
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                  {errors.rppsNumber && rppsStatus !== 'error' && (
                    <p className="text-red-500 text-xs mt-1">{errors.rppsNumber}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    Trouvez votre numero sur{' '}
                    <a href="https://annuaire.sante.fr" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                      annuaire.sante.fr
                    </a>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={rppsVerify.isPending}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {rppsVerify.isPending && <Loader2 size={16} className="animate-spin" />}
                  Verifier mon RPPS
                </button>

                <button
                  type="button"
                  onClick={handleSkipRpps}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:text-neutral-700 border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  Je verifierai plus tard
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
