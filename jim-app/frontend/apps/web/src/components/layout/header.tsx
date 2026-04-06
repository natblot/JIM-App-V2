'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { SlidersHorizontal, ArrowUp, PlusCircle, Menu, User, LogOut, MessageSquare, Settings, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignOut, useCurrentProfile } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { SearchOverlay } from '../landing/search-overlay';
import { CategoriesNav } from '../landing/categories-nav';

// Header flottant — dashboard kanban avec recherche conversationnelle
export function Header() {
  const router = useRouter();
  const { user, isLoading, supabase } = useAuthContext();
  const profile = useCurrentProfile(supabase);
  const signOut = useSignOut(supabase);
  const searchParams = useSearchParams();
  const activeVille = searchParams.get('ville');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-[1280px] flex flex-col gap-3">
        {/* Top navbar — logo + auth */}
        <div className="flex items-center justify-between">
          <a href="/" className="text-3xl font-extrabold text-brand tracking-tighter">
            jim
          </a>

          {/* Auth bubble */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Bouton messages — icone bulles chat */}
              <button
                onClick={() => router.push('/messages')}
                className="hidden sm:block hover:opacity-80 transition-opacity"
                title="Messages"
              >
                <svg width="32" height="28" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 4C10.268 4 4 9.373 4 16c0 3.16 1.468 6.04 3.886 8.213C7.37 27.16 5.5 30 5.5 30s5.148-1.658 8.086-3.582A17.2 17.2 0 0018 27c7.732 0 14-5.373 14-11S25.732 4 18 4z" fill="#1a1a1a"/>
                  <circle cx="29" cy="22" r="8" fill="#b0b0b0" stroke="#fdf6ed" strokeWidth="2"/>
                </svg>
              </button>

              {/* Menu profil */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="bg-white/90 backdrop-blur-xl rounded-full shadow-sm border border-white/50 flex items-center gap-2 p-1 pl-3 pr-1 hover:shadow-md transition-shadow"
                >
                  <Menu size={14} className="text-gray-500" />
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); router.push('/messages'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <MessageSquare size={16} /> Messages
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); router.push('/settings'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={16} /> Parametres
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
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

        {/* Topic pills (categories) — centered */}
        <Suspense>
          <CategoriesNav />
        </Suspense>

        {/* Conversational search bubble */}
        <div className="flex items-center gap-4 w-full max-w-[900px] mx-auto">
          <button
            onClick={() => setSearchOpen(true)}
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
      </div>

      {/* Overlay recherche */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
