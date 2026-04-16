'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { SlidersHorizontal, ArrowUp, PlusCircle, Menu, LayoutDashboard, LogOut, MessageSquare, Settings } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSignOut, useCurrentProfile } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { SearchOverlay } from '../landing/search-overlay';
import { CategoriesNav } from '../landing/categories-nav';

// Header flottant — variantes :
// - "landing" (defaut) : 3 lignes (logo+auth | topic pills | search conversationnelle + CTA) — dashboard kanban
// - "compact" : 1 ligne (logo+auth+CTA) — pages detail/contenu pour ne pas ecraser le contenu
// Detection via usePathname : seule la racine "/" utilise "landing".
export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, supabase } = useAuthContext();
  const profile = useCurrentProfile(supabase);
  const signOut = useSignOut(supabase);
  const searchParams = useSearchParams();
  const activeVille = searchParams.get('ville');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Landing = racine "/" uniquement. Tout le reste (detail, marketing, /carte...) utilise le compact.
  const isLanding = pathname === '/';

  // Fermer le menu au clic exterieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  function handleSignOut() {
    setMenuOpen(false);
    signOut.mutate('local', {
      onSuccess: () => router.push('/'),
    });
  }

  const isLoggedIn = !isLoading && !!user;
  const displayName = profile.data?.first_name ?? user?.email?.split('@')[0] ?? '';
  const initials = profile.data
    ? `${(profile.data.first_name as string)?.[0] ?? ''}${(profile.data.last_name as string)?.[0] ?? ''}`.toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <>
      <header
        role="banner"
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[1280px] flex flex-col gap-3"
      >
        {/* Top navbar — logo + (CTA Publier compact) + auth */}
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="text-3xl font-extrabold text-brand tracking-tighter inline-flex items-center h-10 px-1 -ml-1">
            jim
          </a>

          {/* CTA Publier inline en mode compact (deplace depuis la 3e ligne) */}
          {!isLanding && (
            <a
              href="/publier"
              className="ml-auto mr-2 bg-brand text-white h-10 px-5 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 hover:bg-brand-dark transition-colors shadow-sm hidden md:inline-flex"
            >
              <PlusCircle size={14} />
              Publier une annonce
            </a>
          )}

          {/* Auth bubble */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Bouton dashboard rapide — pilule visible des lg+ */}
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-full shadow-sm border border-white/50 px-4 h-10 text-xs font-bold text-gray-700 hover:text-brand hover:shadow-md transition-all"
                title="Tableau de bord"
              >
                <LayoutDashboard size={14} />
                Tableau de bord
              </button>

              {/* Bouton messages — icone bulles chat */}
              <button
                type="button"
                onClick={() => router.push('/messages')}
                className="hidden sm:block hover:opacity-80 transition-opacity"
                title="Messages"
                aria-label="Messages"
              >
                <svg width="32" height="28" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 4C10.268 4 4 9.373 4 16c0 3.16 1.468 6.04 3.886 8.213C7.37 27.16 5.5 30 5.5 30s5.148-1.658 8.086-3.582A17.2 17.2 0 0018 27c7.732 0 14-5.373 14-11S25.732 4 18 4z" fill="#1a1a1a"/>
                  <circle cx="29" cy="22" r="8" fill="#b0b0b0" stroke="#fdf6ed" strokeWidth="2"/>
                </svg>
              </button>

              {/* Menu profil */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Menu profil"
                  className="bg-white/90 backdrop-blur-xl rounded-full shadow-sm border border-white/50 flex items-center gap-2 p-1 pl-3 pr-1 hover:shadow-md transition-shadow"
                >
                  <Menu size={14} className="text-gray-500" />
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50" role="menu">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setMenuOpen(false); router.push('/dashboard'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard size={16} /> Tableau de bord
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setMenuOpen(false); router.push('/messages'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <MessageSquare size={16} /> Messages
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setMenuOpen(false); router.push('/dashboard?tab=paiements'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={16} /> Mes paiements
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Se deconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-sm border border-white/50 py-1 pl-4 pr-1 flex items-center gap-3">
              <a href="/login" className="text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">
                Connexion
              </a>
              <a
                href="/register"
                className="bg-brand text-white px-5 py-2 rounded-full text-[11px] font-extrabold hover:bg-brand-dark transition-colors"
              >
                S&apos;inscrire
              </a>
            </div>
          )}
        </div>

        {/* Lignes 2 et 3 — uniquement sur la landing (dashboard kanban) */}
        {isLanding && (
          <>
            {/* Topic pills (categories) — centered */}
            <Suspense>
              <CategoriesNav />
            </Suspense>

            {/* Conversational search bubble */}
            <div className="flex items-center gap-4 w-full max-w-[900px] mx-auto">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Ouvrir la recherche"
                className="flex-1 bg-white rounded-[32px] shadow-lg border border-gray-100 flex items-center gap-3 px-5 h-14 hover:shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-brand/30"
              >
                <SlidersHorizontal size={18} className="text-gray-400 flex-shrink-0" />
                <span className="flex-grow text-left text-sm text-gray-400 truncate">
                  {activeVille ?? 'Rechercher une mission, une ville...'}
                </span>
                <div className="bg-brand text-white w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-brand-dark transition-colors">
                  <ArrowUp size={16} />
                </div>
              </button>
              <a
                href="/publier"
                className="bg-brand text-white h-14 px-8 rounded-3xl text-sm font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors flex-shrink-0 shadow-lg hidden md:flex"
              >
                <PlusCircle size={18} />
                Publier une annonce
              </a>
            </div>
          </>
        )}
      </header>

      {/* Overlay recherche */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
