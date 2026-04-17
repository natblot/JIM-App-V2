'use client';

// Sidebar navigation du dashboard — desktop uniquement
// Affiche les liens de navigation selon le role + carte profil utilisateur

import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Inbox,
  ScrollText,
  CreditCard,
  MessageSquare,
  User,
  ArrowLeft,
} from 'lucide-react';
import type { DashboardTab } from './dashboard-layout';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  role: 'titulaire' | 'remplacant';
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    ville?: string | null;
    specialites?: string[] | null;
    avatar_url?: string | null;
  } | null;
}

// Items de navigation avec leurs icones
const NAV_ITEMS: Array<{
  id: DashboardTab;
  icon: typeof LayoutDashboard;
  label: string;
  titulairOnly?: boolean;
}> = [
  { id: 'overview', icon: LayoutDashboard, label: 'Tableau de bord' },
  { id: 'annonces', icon: FileText, label: 'Mes annonces', titulairOnly: true },
  { id: 'candidatures', icon: Inbox, label: 'Candidatures' },
  { id: 'contrats', icon: ScrollText, label: 'Contrats' },
  { id: 'paiements', icon: CreditCard, label: 'Paiements' },
];

// Extrait les initiales du prenom et nom pour le fallback avatar
function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? '';
  const last = lastName?.charAt(0)?.toUpperCase() ?? '';
  return first + last || '?';
}

export function Sidebar({ activeTab, onTabChange, role, profile }: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.titulairOnly || role === 'titulaire'
  );

  const roleLabel = role === 'titulaire' ? 'Titulaire' : 'Remplacant';
  const initials = getInitials(profile?.first_name, profile?.last_name);
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
  const firstSpecialite = profile?.specialites?.[0];
  const subtitle = [firstSpecialite, profile?.ville].filter(Boolean).join(' - ');

  return (
    <aside className="h-full flex flex-col bg-[#f9f3eb] p-6 shadow-sm">
      {/* Header : logo Jim + sous-titre role */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-[#ff7c5c]"
        >
          Jim
        </Link>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {roleLabel}
        </p>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 flex flex-col gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-[#ff7c5c] text-white shadow-lg font-bold'
                  : 'text-gray-500 hover:bg-white/50 font-medium'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              {item.label}
            </button>
          );
        })}

        {/* Lien messages (navigation externe) */}
        <Link
          href="/messages"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-white/50 font-medium transition-colors"
        >
          <MessageSquare size={18} strokeWidth={1.5} />
          Messages
        </Link>

        {/* Lien profil */}
        <button
          type="button"
          onClick={() => onTabChange('profil')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
            activeTab === 'profil'
              ? 'bg-[#ff7c5c] text-white shadow-lg font-bold'
              : 'text-gray-500 hover:bg-white/50 font-medium'
          }`}
        >
          <User size={18} strokeWidth={activeTab === 'profil' ? 2.5 : 1.5} />
          Mon profil
        </button>
      </nav>

      {/* Retour au site — au-dessus de la carte profil */}
      <div className="mb-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au site
        </Link>
      </div>

      {/* Carte profil utilisateur */}
      <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
        <div className="flex items-center gap-3">
          {/* Avatar avec fallback initiales */}
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={fullName || 'Avatar'}
              className="h-10 w-10 rounded-full border-2 border-[#ff7c5c] shadow-sm object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full border-2 border-[#ff7c5c] shadow-sm bg-[#ff7c5c]/10 flex items-center justify-center text-[#ff7c5c] text-xs font-bold">
              {initials}
            </div>
          )}

          {/* Nom + sous-titre */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-gray-900">
              {fullName || 'Utilisateur'}
            </p>
            {subtitle && (
              <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Badges role + specialites */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="px-2 py-0.5 bg-[#ff7c5c]/10 text-[#ff7c5c] text-[9px] font-extrabold rounded-full uppercase">
            {roleLabel}
          </span>
          {profile?.specialites?.slice(0, 2).map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 bg-[#ff7c5c]/10 text-[#ff7c5c] text-[9px] font-extrabold rounded-full uppercase"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
