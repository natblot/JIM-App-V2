import { AuthGuard } from '../../components/auth/auth-guard';

// Layout app — pages authentifiees (messagerie, dashboard)
// Pas de Header/Footer marketing — layout plein ecran
// QueryProvider et AuthProvider sont dans le root layout
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
