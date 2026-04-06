'use client';

// Contexte d'authentification — fournit user, session et client Supabase a toute l'app
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User, Session, SupabaseClient } from '@jim/shared';
import { getSupabase } from '../../lib/supabase-browser';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabase(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lecture initiale de la session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setIsLoading(false);
    });

    // Ecoute des changements d'auth (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setIsLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, isLoading, supabase }),
    [user, session, isLoading, supabase],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

// Hook pour acceder au contexte d'auth — leve une erreur si utilise hors du provider
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
