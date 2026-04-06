'use client';

// Garde d'authentification client — redirige vers /login si pas de session
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '../providers/auth-provider';

interface AuthGuardProps {
  children: React.ReactNode;
  /** Role requis (optionnel) — redirige si le role ne correspond pas */
  requiredRole?: string;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  // Chargement initial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  // Pas connecte — rendu vide pendant la redirection
  if (!user) return null;

  return <>{children}</>;
}
