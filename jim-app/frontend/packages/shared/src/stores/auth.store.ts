import { create } from 'zustand';
import type { User, Session } from '../adapters/supabase';

// État auth minimal — les données profil viennent de TanStack Query
interface AuthState {
  user: User | null;
  session: Session | null;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setInitialized: (value: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  reset: () => set({ user: null, session: null, isInitialized: false }),
}));
