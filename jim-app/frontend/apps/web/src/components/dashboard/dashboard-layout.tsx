'use client';

// Shell principal du dashboard — navbar unifiee (Header de la page d'accueil) + contenu.
// DA template jim-design-system (variante A) : papier chaud, dot-grid, corail.
// Les onglets restent pilotes par ?tab= (deep links conserves) via une rangee
// de pills dans la page (desktop) et la bottom bar (mobile).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Inbox,
  ScrollText,
  CreditCard,
  User,
} from 'lucide-react';
import { useCurrentProfile } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { Header } from '../layout/header';
import { Overview } from './overview';
import { MyListings } from './my-listings';
import { Candidatures } from './candidatures';
import { ContractsList } from './contracts-list';

// Onglets du dashboard
// Note : 'paiements' n'est plus un onglet interne — la page vit a la route /paiement
export type DashboardTab =
  | 'overview'
  | 'annonces'
  | 'candidatures'
  | 'contrats'
  | 'profil';

// Onglets de la bottom bar mobile
const MOBILE_TABS: Array<{
  id: DashboardTab;
  icon: typeof LayoutDashboard;
  label: string;
  titulairOnly?: boolean;
}> = [
  { id: 'overview', icon: LayoutDashboard, label: 'Accueil' },
  { id: 'annonces', icon: FileText, label: 'Annonces', titulairOnly: true },
  { id: 'candidatures', icon: Inbox, label: 'Candidatures' },
  { id: 'contrats', icon: ScrollText, label: 'Contrats' },
];

const VALID_TABS: readonly DashboardTab[] = [
  'overview',
  'annonces',
  'candidatures',
  'contrats',
  'profil',
];

// Libelle du fil d'ariane par onglet (null = racine "Tableau de bord")
const TAB_CRUMB: Record<DashboardTab, string | null> = {
  overview: null,
  annonces: 'Mes annonces',
  candidatures: 'Candidatures',
  contrats: 'Contrats',
  profil: 'Mon profil',
};

function isValidTab(value: string | null): value is DashboardTab {
  return value !== null && (VALID_TABS as readonly string[]).includes(value);
}

export function DashboardLayout() {
  const { user, supabase } = useAuthContext();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile(supabase);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lire l'onglet depuis l'URL (?tab=candidatures) — permet la deep link
  const tabFromUrl = searchParams.get('tab');
  const initialTab: DashboardTab = isValidTab(tabFromUrl) ? tabFromUrl : 'overview';
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Garder le state en sync si l'URL change (nav depuis chat/contrat)
  useEffect(() => {
    if (isValidTab(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  // Quand l'utilisateur change d'onglet via la navbar, on met l'URL a jour
  function handleTabChange(tab: DashboardTab) {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'overview') params.delete('tab');
    else params.set('tab', tab);
    const qs = params.toString();
    router.replace(`/dashboard${qs ? `?${qs}` : ''}`, { scroll: false });
  }

  // Determiner le role depuis le profil Supabase
  const role = (profile?.role as 'titulaire' | 'remplacant') ?? 'remplacant';

  // Filtrer les onglets mobile selon le role
  const visibleMobileTabs = MOBILE_TABS.filter(
    (tab) => !tab.titulairOnly || role === 'titulaire'
  );

  if (profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdf6ed]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff7c5c] border-t-transparent" />
          <p className="text-sm text-[#7a5434] font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // Pills de navigation desktop — onglets internes + page Paiements
  const tabPills: Array<{ id: string; label: string; onClick?: () => void; href?: string }> = [
    { id: 'overview', label: 'Tableau de bord', onClick: () => handleTabChange('overview') },
    ...(role === 'titulaire'
      ? [{ id: 'annonces', label: 'Mes annonces', onClick: () => handleTabChange('annonces') }]
      : []),
    { id: 'candidatures', label: 'Candidatures', onClick: () => handleTabChange('candidatures') },
    { id: 'contrats', label: 'Contrats', onClick: () => handleTabChange('contrats') },
    { id: 'paiements', label: 'Paiements', href: '/paiement' },
  ];

  const crumb = TAB_CRUMB[activeTab];

  return (
    <div className="dash-root">
      {/* Navbar unifiee — la meme que la page d'accueil */}
      <Header />

      <div className="page">
        {/* Fil d'ariane pill */}
        <div className="crumbs">
          <span className={crumb ? undefined : 'cur'}>Tableau de bord</span>
          {crumb && (
            <>
              <span className="sep">/</span>
              <span className="cur">{crumb}</span>
            </>
          )}
        </div>

        {/* Onglets du dashboard — pills en page (desktop) */}
        <div className="tab-pills" role="tablist" aria-label="Sections du tableau de bord">
          {tabPills.map((pill) =>
            pill.href ? (
              <Link key={pill.id} href={pill.href} className="tab-pill">
                {pill.label}
              </Link>
            ) : (
              <button
                key={pill.id}
                type="button"
                role="tab"
                aria-selected={activeTab === pill.id}
                onClick={pill.onClick}
                className={`tab-pill${activeTab === pill.id ? ' active' : ''}`}
              >
                {pill.label}
              </button>
            )
          )}
        </div>

        {/* Contenu de l'onglet actif */}
        <div className="space-y-10">
          <DashboardContent
            tab={activeTab}
            role={role}
            userId={user?.id ?? ''}
            supabase={supabase}
            profileName={profile?.first_name as string | undefined}
          />
        </div>
      </div>

      {/* Bottom tab bar mobile (< lg) — floating pill avec icones seules */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md lg:hidden bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_18px_50px_-20px_rgba(58,31,8,0.4)] p-2 flex justify-between items-center z-[100] border border-[#edd9c4]">
        {visibleMobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              title={tab.label}
              onClick={() => handleTabChange(tab.id)}
              className={`p-3 rounded-xl transition-all ${
                isActive ? 'text-[#ff7c5c] bg-[#fff0ea]' : 'text-[#bca183]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            </button>
          );
        })}
        {/* Paiements — page autonome /paiement (hors onglets internes) */}
        <Link
          href="/paiement"
          title="Paiements"
          className="p-3 rounded-xl transition-all text-[#bca183]"
        >
          <CreditCard size={20} strokeWidth={1.5} />
        </Link>
      </nav>

      {/* ════════════ Chrome DA (port de paiements-split.html) ════════════ */}
      <style jsx>{`
        .dash-root {
          position: relative;
          min-height: 100vh;
          background: #fdf6ed;
          color: #3a1f08;
          font-family: var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif;
        }

        /* warm brand backdrop */
        .dash-root::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: radial-gradient(
              circle at 14% 12%,
              rgba(255, 124, 92, 0.08) 0%,
              transparent 42%
            ),
            radial-gradient(circle at 88% 78%, rgba(245, 184, 106, 0.06) 0%, transparent 50%);
        }
        .dash-root::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: radial-gradient(circle, rgba(58, 31, 8, 1) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.045;
        }

        .page {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 30px 24px 70px;
        }
        @media (max-width: 1023px) {
          .page {
            padding: 24px 16px 130px;
          }
        }

        .crumbs {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #7a5434;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid #edd9c4;
          border-radius: 999px;
          white-space: nowrap;
          margin-bottom: 22px;
        }
        .crumbs .cur {
          color: #3a1f08;
        }
        .crumbs .sep {
          opacity: 0.4;
        }

        /* Onglets en page — pills blanches glass, actif corail pale */
        .tab-pills {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px;
          margin: 0 0 26px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(58, 31, 8, 0.06);
          border-radius: 999px;
          box-shadow: 0 1px 3px rgba(58, 31, 8, 0.06);
        }
        .tab-pills :global(.tab-pill) {
          font-size: 13.5px;
          font-weight: 600;
          font-family: inherit;
          color: #3a1f08;
          text-decoration: none;
          background: transparent;
          border: 0;
          cursor: pointer;
          padding: 9px 16px;
          border-radius: 999px;
          white-space: nowrap;
          transition: color 0.25s, background 0.2s;
        }
        .tab-pills :global(.tab-pill:hover) {
          background: #f7ede0;
        }
        .tab-pills :global(.tab-pill.active) {
          color: #ff7c5c;
          font-weight: 700;
          background: #fff0ea;
        }
        @media (max-width: 1023px) {
          .tab-pills {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// Routeur interne du dashboard — affiche le bon composant selon l'onglet
function DashboardContent({
  tab,
  role,
  userId,
  supabase,
  profileName,
}: {
  tab: DashboardTab;
  role: 'titulaire' | 'remplacant';
  userId: string;
  supabase: ReturnType<typeof useAuthContext>['supabase'];
  profileName?: string | undefined;
}) {
  switch (tab) {
    case 'overview':
      return <Overview role={role} userId={userId} supabase={supabase} profileName={profileName} />;
    case 'annonces':
      return role === 'titulaire' ? (
        <MyListings supabase={supabase} />
      ) : (
        // Le remplacant n'a pas d'onglet annonces — fallback overview
        <Overview role={role} userId={userId} supabase={supabase} profileName={profileName} />
      );
    case 'candidatures':
      return <Candidatures role={role} userId={userId} supabase={supabase} />;
    case 'contrats':
      return <ContractsList userId={userId} supabase={supabase} />;
    case 'profil':
      // Placeholder profil — a completer dans un sprint futur
      return (
        <div className="bg-white rounded-[20px] border border-[#edd9c4] shadow-[0_1px_2px_rgba(58,31,8,0.04),0_4px_16px_rgba(58,31,8,0.05)] p-8 text-center">
          <User size={48} className="mx-auto text-[#dcbfa0] mb-3" />
          <p className="text-[#7a5434] text-sm">
            La gestion du profil sera disponible prochainement.
          </p>
        </div>
      );
    default:
      return null;
  }
}
