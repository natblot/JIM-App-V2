'use client';

// Barre laterale de navigation — icones JIM, messages, missions, contrats, settings
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Briefcase, ClipboardCheck, Settings } from 'lucide-react';

interface MessagingSidebarProps {
  userAvatarUrl: string | null;
  userName: string | null;
}

const NAV_ITEMS = [
  { icon: MessageCircle, label: 'Messages', href: '/messages', active: true },
  { icon: Briefcase, label: 'Missions', href: '/missions', active: false },
  { icon: ClipboardCheck, label: 'Contrats', href: '/contrats', active: false },
  { icon: Settings, label: 'Parametres', href: '/parametres', active: false },
] as const;

export function MessagingSidebar({ userAvatarUrl, userName }: MessagingSidebarProps) {
  return (
    <aside className="w-20 bg-white border-r border-jim-border flex flex-col items-center py-6 gap-8 flex-shrink-0">
      {/* Logo JIM */}
      <div className="mb-4">
        <Link href="/" className="text-jim-primary font-bold text-2xl tracking-tight">
          JIM
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 flex-1 items-center">
        {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
          <Link
            key={label}
            href={href}
            title={label}
            className={`p-3 rounded-2xl cursor-pointer transition-all ${
              active
                ? 'bg-jim-primary-pale text-jim-primary'
                : 'text-jim-muted hover:bg-jim-primary-pale hover:text-jim-primary'
            }`}
          >
            <Icon size={24} fill={active ? 'currentColor' : 'none'} />
          </Link>
        ))}
      </nav>

      {/* Avatar utilisateur */}
      <div className="mt-auto group cursor-pointer relative">
        {userAvatarUrl ? (
          <Image
            src={userAvatarUrl}
            alt={userName ?? 'Mon profil'}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-2 border-white soft-shadow group-hover:scale-105 transition-transform object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-jim-primary-pale flex items-center justify-center text-jim-primary font-bold text-lg">
            {(userName ?? 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-jim-success border-2 border-white rounded-full" />
      </div>
    </aside>
  );
}
