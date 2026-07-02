// Middleware Next.js — protection routes serveur + rafraichissement session
import { createClient } from '@supabase/supabase-js'; // eslint-disable-line no-restricted-imports -- middleware SSR
import { NextResponse, type NextRequest } from 'next/server';
import { isValidRedirect } from './lib/validate-redirect';

// Routes qui necessitent une session authentifiee
// Note : Les routes du groupe (app)/ sont protegees par AuthGuard client-side
// dans (app)/layout.tsx. Le middleware ne voit pas les sessions localStorage-only
// de Supabase, donc on retire /messages, /dashboard, /publier, /contrat, /paiement
// pour eviter une redirection en boucle.
const PROTECTED_ROUTES: string[] = [];
const ADMIN_ROUTES = ['/admin'];
// Routes accessibles UNIQUEMENT sans session
const AUTH_ROUTES = ['/login', '/register', '/reset-password', '/update-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Creer un client Supabase avec le token d'acces depuis les cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return NextResponse.next();

  // Lire le token depuis les cookies Supabase Auth
  const accessToken = request.cookies.get(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`)?.value;

  let user: { id: string; app_metadata?: Record<string, unknown> } | null = null;

  if (accessToken) {
    try {
      // Parser le JSON du cookie (Supabase stocke un array [access_token, refresh_token])
      const parsed = JSON.parse(accessToken) as unknown;
      const token = Array.isArray(parsed) ? (parsed[0] as string) : (typeof parsed === 'string' ? parsed : null);

      if (token) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data } = await supabase.auth.getUser();
        user = data.user;
      }
    } catch {
      // Cookie invalide ou expire — traiter comme non-authentifie
    }
  }

  const isAuthenticated = !!user;

  // Routes protegees — rediriger vers login si pas de session
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Routes admin — verifier session + role admin
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    // Verifier le role admin dans app_metadata UNIQUEMENT.
    // app_metadata n'est modifiable que par le service_role (admin API), contrairement
    // a user_metadata que l'utilisateur peut editer lui-meme via auth.updateUser() —
    // s'y fier serait une elevation de privilege triviale.
    // Provisionner un admin : supabase.auth.admin.updateUserById(id, { app_metadata: { role: 'admin' } }).
    const role = user?.app_metadata?.role as string | undefined;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Routes auth — rediriger vers / si deja connecte
  if (AUTH_ROUTES.some((r) => pathname === r)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
