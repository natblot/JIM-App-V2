'use client';

// Shell principal du dashboard — sidebar + contenu principal
// Affiche les onglets selon le role (titulaire/remplacant)

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Inbox,
  ScrollText,
  CreditCard,
  User,
  Search,
  Bell,
  Plus,
} from 'lucide-react';
import { useCurrentProfile } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { Sidebar } from './sidebar';
import { Overview } from './overview';
import { MyListings } from './my-listings';
import { Candidatures } from './candidatures';
import { ContractsList } from './contracts-list';
import { PaymentsList } from './payments-list';

// Onglets du dashboard
export type DashboardTab =
  | 'overview'
  | 'annonces'
  | 'candidatures'
  | 'contrats'
  | 'paiements'
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
  { id: 'paiements', icon: CreditCard, label: 'Paiements' },
];

const VALID_TABS: readonly DashboardTab[] = [
  'overview',
  'annonces',
  'candidatures',
  'contrats',
  'paiements',
  'profil',
];

function isValidTab(value: string | null): value is DashboardTab {
  return value !== null && (VALID_TABS as readonly string[]).includes(value);
}

export function DashboardLayout() {
  const { user, supabase } = useAuthContext();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile(supabase);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lire l'onglet depuis l'URL (?tab=paiements) — permet la deep link
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

  // Quand l'utilisateur change d'onglet via la sidebar, on met l'URL a jour
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
          <p className="text-sm text-gray-500 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fdf6ed]">
      {/* Sidebar desktop (>= lg) */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          role={role}
          profile={profile ? {
            first_name: profile.first_name ?? null,
            last_name: profile.last_name ?? null,
            ville: (profile.city as string | null) ?? null,
            specialites: (profile.specialties as string[] | null) ?? null,
            avatar_url: profile.avatar_url ?? null,
          } : null}
        />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header sticky avec recherche et actions */}
        <header className="flex justify-between items-center px-4 lg:px-8 py-4 w-full top-0 sticky bg-[#fdf6ed]/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-[#f3ede5] rounded-full border-none focus:ring-2 focus:ring-[#ff7c5c] text-sm placeholder:text-gray-400/60"
                placeholder="Trouver une mission..."
                type="text"
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Notifications"
              className="p-2.5 text-gray-500 hover:bg-[#FFF0EA] hover:text-[#ff7c5c] rounded-full transition-all"
            >
              <Bell size={20} />
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#ff7c5c] text-white text-sm font-bold rounded-full shadow-md hover:brightness-105 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              Disponibilité
            </button>
          </div>
        </header>

        {/* Zone scrollable du contenu */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-10">
          <div className="p-4 lg:p-8 space-y-10 max-w-7xl mx-auto w-full">
            {/* Contenu de l'onglet actif */}
            <DashboardContent
              tab={activeTab}
              role={role}
              userId={user?.id ?? ''}
              supabase={supabase}
              profileName={profile?.first_name as string | undefined}
            />
          </div>
        </div>
      </main>

      {/* Bottom tab bar mobile (< lg) — floating pill avec icones seules */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md lg:hidden bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-2 flex justify-between items-center z-[100] border border-gray-200">
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
                isActive
                  ? 'text-[#ff7c5c] bg-[#FFF0EA]'
                  : 'text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            </button>
          );
        })}
      </nav>
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
    case 'paiements':
      return <PaymentsList role={role} userId={userId} supabase={supabase} />;
    case 'profil':
      // Placeholder profil — a completer dans un sprint futur
      return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <User size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            La gestion du profil sera disponible prochainement.
          </p>
        </div>
      );
    default:
      return null;
  }
}
