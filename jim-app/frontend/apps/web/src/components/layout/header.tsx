'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Menu, X, LayoutDashboard, LogOut, MessageSquare, Settings, Briefcase, Euro, ChevronRight, Plus } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSignOut, useCurrentProfile } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { SearchOverlay } from '../landing/search-overlay';

const NAV_ITEMS = [{ label: 'Missions', href: '/' }];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, supabase } = useAuthContext();
  const profile = useCurrentProfile(supabase);
  const signOut = useSignOut(supabase);

  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const isLoggedIn = !isLoading && !!user;
  const displayName = profile.data?.first_name ?? user?.email?.split('@')[0] ?? '';
  const initials = profile.data
    ? `${(profile.data.first_name as string)?.[0] ?? ''}${(profile.data.last_name as string)?.[0] ?? ''}`.toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase();

  // Positionne le pill indicateur de nav sous l'item actif/survolé
  const movePill = useCallback((el: HTMLElement | null) => {
    const pill = pillRef.current;
    if (!el || !pill) return;
    pill.style.width = el.offsetWidth + 'px';
    pill.style.transform = `translateX(${el.offsetLeft}px)`;
    pill.style.opacity = '1';
  }, []);

  const resetPill = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelectorAll('a')[activeNav] as HTMLElement | undefined;
    if (active) movePill(active);
  }, [activeNav, movePill]);

  useEffect(() => {
    const frame = requestAnimationFrame(resetPill);
    window.addEventListener('resize', resetPill);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resetPill); };
  }, [resetPill]);

  // Fermer le dropdown profil au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Bloquer le scroll quand le drawer mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  function handleSignOut() {
    setMenuOpen(false);
    setDrawerOpen(false);
    signOut.mutate('local', { onSuccess: () => router.push('/') });
  }

  const isLandingActive = pathname === '/';

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-40 flex justify-center pt-[18px] pb-[14px] px-6 bg-jim-background"
      >
        {/* Pill principale */}
        <div className="inline-flex items-center gap-2.5 rounded-full px-[22px] py-[7px] border border-[rgba(58,31,8,0.06)] backdrop-blur-[22px] saturate-180 bg-white/[0.78]"
          style={{ boxShadow: '0 18px 50px -20px rgba(58,31,8,.25), 0 2px 6px rgba(58,31,8,.04)' }}
        >
          {/* Logo */}
          <a href="/" aria-label="JIM — accueil" className="inline-flex items-center mr-2 flex-shrink-0">
            <img src="/jim-logo-anim.svg" alt="JIM" className="h-[26px] w-auto block" />
          </a>

          {/* Nav avec pill indicateur — masquée sur mobile */}
          <nav ref={navRef} className="hidden md:flex relative gap-0.5 rounded-full" onMouseLeave={resetPill}>
            <span
              ref={pillRef}
              aria-hidden
              className="absolute top-0 left-0 h-full rounded-full bg-jim-primary-pale pointer-events-none z-0"
              style={{ transition: 'transform .42s cubic-bezier(0.34,1.56,0.64,1), width .42s cubic-bezier(0.34,1.56,0.64,1), opacity .25s', opacity: 0 }}
            />
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative z-[1] text-[14px] font-semibold px-[18px] py-2.5 rounded-full whitespace-nowrap transition-colors ${
                  isLandingActive && i === activeNav ? 'text-jim-primary font-bold' : 'text-jim-text'
                }`}
                onMouseEnter={(e) => movePill(e.currentTarget)}
                onFocus={(e) => movePill(e.currentTarget)}
                onClick={() => setActiveNav(i)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Séparateur — desktop */}
          <span className="hidden md:block w-px h-4 bg-[rgba(58,31,8,0.1)]" />

          {/* Bouton Publier — expanding pill */}
          <a
            href="/publier"
            aria-label="Publier une annonce"
            className="header-publish bg-jim-text flex-shrink-0"
          >
            {/* Cercle corail avec pulse */}
            <span className="absolute top-[4px] left-[4px] w-9 h-9 bg-jim-primary rounded-full flex items-center justify-center flex-shrink-0 z-[1]"
              style={{ boxShadow: '0 4px 12px rgba(255,124,92,.5)' }}
            >
              <span className="pc-ring absolute inset-0 rounded-full border-2 border-jim-primary opacity-0" />
              <Plus size={18} strokeWidth={2.6} className="text-white" />
            </span>
            <span className="hp-label">Publier une annonce</span>
          </a>

          {/* Search bar sombre — trigger SearchOverlay */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Ouvrir la recherche"
            className="inline-flex items-center bg-jim-text rounded-full py-1.5 pl-0 pr-1.5 gap-0 flex-shrink-0 min-h-[40px]"
          >
            <div className="hidden xl:flex flex-col items-start px-3.5 border-r border-white/[0.12] min-w-[110px] cursor-text">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40 mb-[1px]">Où</span>
              <span className="text-[12px] font-medium text-white/60 whitespace-nowrap">Ville, code postal</span>
            </div>
            <div className="hidden xl:flex flex-col items-start px-3.5 min-w-[110px] cursor-text">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40 mb-[1px]">Quand</span>
              <span className="text-[12px] font-medium text-white/60 whitespace-nowrap">Ajouter dates</span>
            </div>
            <span className="ml-2 xl:ml-2 w-8 h-8 rounded-full bg-jim-primary flex items-center justify-center text-white flex-shrink-0">
              <Search size={14} strokeWidth={2.5} />
            </span>
            <span className="hidden xl:block text-[13px] font-bold text-white pl-2.5 pr-1.5 whitespace-nowrap">
              Rechercher
            </span>
          </button>

          {/* Zone auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* Dropdown profil */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen ? 'true' : 'false'}
                  aria-label="Mon compte"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-jim-primary to-jim-accent flex items-center justify-center text-white text-[12px] font-bold cursor-pointer transition-shadow"
                  style={menuOpen ? { boxShadow: '0 0 0 3px rgba(255,124,92,.35), 0 6px 18px -6px rgba(255,124,92,.5)' } : {}}
                >
                  {initials}
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div
                    className={`absolute top-[calc(100%+20px)] right-0 w-64 rounded-[18px] border border-[rgba(58,31,8,.07)] p-[7px] z-50 bg-white/90 backdrop-blur-[22px] ${menuOpen ? 'me-menu-open' : ''}`}
                    role="menu"
                    aria-label="Mon compte"
                    style={{ boxShadow: '0 24px 60px -18px rgba(58,31,8,.32), 0 2px 8px rgba(58,31,8,.06)' }}
                  >
                    {/* Entête */}
                    <div className="flex items-center gap-3 px-[11px] py-[10px] mb-[5px] border-b border-jim-beige-light">
                      <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-jim-primary to-jim-accent flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-jim-text m-0 leading-[1.2] truncate">{displayName}</p>
                        <p className="text-[11px] text-jim-muted m-0 mt-0.5 uppercase tracking-[0.1em] font-semibold truncate">{user?.email}</p>
                      </div>
                    </div>
                    {/* Items */}
                    {[
                      { icon: Briefcase, label: 'Missions', sub: 'Mes remplacements en cours', href: '/dashboard' },
                      { icon: Euro, label: 'Paiements', sub: 'Rétrocessions & factures', href: '/dashboard?tab=paiements' },
                      { icon: MessageSquare, label: 'Messages', sub: 'Conversations & contrats', href: '/messages', badge: 0 },
                      { icon: Settings, label: 'Paramètres', sub: 'Compte & préférences', href: '/dashboard?tab=parametres' },
                    ].map(({ icon: Icon, label, sub, href, badge }) => (
                      <button
                        key={label}
                        type="button"
                        role="menuitem"
                        onClick={() => { setMenuOpen(false); router.push(href); }}
                        className="me-menu-item w-full flex items-center gap-3 px-[11px] py-[9px] rounded-xl hover:bg-jim-surface-alt cursor-pointer text-left"
                      >
                        <span className="w-[34px] h-[34px] rounded-[10px] bg-jim-surface-alt flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-jim-primary-pale">
                          <Icon size={17} strokeWidth={1.9} className="text-jim-text-body" />
                        </span>
                        <span className="flex flex-col leading-[1.2] min-w-0 flex-1">
                          <span className="text-[14px] font-semibold text-jim-text tracking-[-0.01em]">{label}</span>
                          <span className="text-[11px] font-medium text-jim-muted mt-[1px] truncate">{sub}</span>
                        </span>
                        {badge ? (
                          <span className="ml-auto bg-jim-primary text-white text-[10px] font-bold px-[7px] py-[2px] rounded-full flex-shrink-0">{badge}</span>
                        ) : (
                          <ChevronRight size={16} strokeWidth={2} className="ml-auto text-jim-beige-dark flex-shrink-0" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-jim-beige-mid mt-1 pt-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="me-menu-item w-full flex items-center gap-3 px-[11px] py-[9px] rounded-xl hover:bg-jim-destructive-bg cursor-pointer text-left"
                      >
                        <span className="w-[34px] h-[34px] rounded-[10px] bg-jim-surface-alt flex items-center justify-center flex-shrink-0">
                          <LogOut size={17} strokeWidth={1.9} className="text-jim-destructive" />
                        </span>
                        <span className="text-[14px] font-semibold text-jim-destructive tracking-[-0.01em]">Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a href="/login" className="text-[13px] font-semibold text-jim-text-body hover:text-jim-primary transition-colors px-2 hidden sm:block">
                Connexion
              </a>
              <a
                href="/register"
                className="bg-jim-primary text-white px-4 py-2 rounded-full text-[13px] font-bold hover:bg-jim-accent transition-colors"
              >
                S&apos;inscrire
              </a>
            </div>
          )}

          {/* Burger — mobile uniquement */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu"
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-jim-text hover:bg-[rgba(58,31,8,.05)] transition-colors"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ── Drawer mobile ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[49] bg-[rgba(58,31,8,.35)] backdrop-blur-[4px] transition-opacity ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-jim-background transition-transform duration-[250ms] ease-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: 'min(320px, 86vw)', boxShadow: '-20px 0 60px rgba(58,31,8,.2)' }}
        aria-label="Navigation mobile"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-jim-beige-mid">
          <img src="/jim-logo-anim.svg" alt="JIM" className="h-10 w-auto" />
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Fermer"
            className="w-9 h-9 rounded-xl bg-white border border-jim-beige-mid flex items-center justify-center text-jim-text hover:bg-jim-beige-light transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {isLoggedIn && (
          <div className="flex items-center gap-3 mx-4 my-4 px-4 py-4 bg-white rounded-2xl border border-jim-beige-mid">
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-jim-primary to-jim-accent flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-[14px] font-bold text-jim-text m-0 leading-tight">{displayName}</p>
              <p className="text-[11px] text-jim-muted m-0 mt-0.5 uppercase tracking-[0.1em] font-semibold">Kiné libéral</p>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-0.5 px-3 py-1">
          {[
            { icon: Search, label: 'Missions', href: '/', active: pathname === '/' },
            { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard', active: false },
            { icon: MessageSquare, label: 'Messages', href: '/messages', active: false, badge: 0 },
            { icon: Settings, label: 'Paramètres', href: '/dashboard?tab=parametres', active: false },
          ].map(({ icon: Icon, label, href, active, badge }) => (
            <a
              key={label}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                active ? 'bg-jim-primary-pale text-jim-primary font-semibold' : 'text-jim-text hover:bg-jim-surface-alt'
              }`}
            >
              <Icon size={18} strokeWidth={1.75} className={active ? 'text-jim-primary' : 'text-jim-muted'} />
              {label}
              {badge ? (
                <span className="ml-auto bg-jim-primary text-white text-[10px] font-bold px-[7px] py-[2px] rounded-full">{badge}</span>
              ) : null}
            </a>
          ))}
          {isLoggedIn && (
            <>
              <div className="h-px bg-jim-beige-mid my-2 mx-1" />
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium text-jim-destructive hover:bg-jim-destructive-bg transition-colors text-left"
              >
                <LogOut size={18} strokeWidth={1.75} />
                Se déconnecter
              </button>
            </>
          )}
        </nav>

        <div className="mt-auto px-5 py-4 border-t border-jim-beige-mid text-[11px] text-jim-muted uppercase tracking-[0.12em] font-semibold">
          Vérifié RPPS · 0 % commission
        </div>
      </aside>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
