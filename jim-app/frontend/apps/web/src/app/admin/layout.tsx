// Layout admin — Epic 12 + Phase 4 "Admin avance"
// Protege par middleware auth admin
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/signalements', label: 'Signalements' },
  { href: '/admin/logs', label: 'Audit Logs' },
  { href: '/admin/alertes', label: 'Alertes' },
  { href: '/admin/support', label: 'Support' },
  { href: '/admin/utilisateurs', label: 'Utilisateurs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-jim-background">
      <nav className="bg-jim-surface border-b border-jim-border px-6 py-3 shadow-jim">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6 overflow-x-auto">
            <Link href="/admin" className="text-lg font-semibold text-jim-primary shrink-0">JIM Admin</Link>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm shrink-0 transition-colors ${
                  isActive(item)
                    ? 'text-[var(--jim-primary)] font-semibold'
                    : 'text-jim-muted hover:text-jim-text'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
