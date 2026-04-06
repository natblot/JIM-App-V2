import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { QueryProvider } from '../components/providers/query-provider';
import { AuthProvider } from '../components/providers/auth-provider';
import './globals.css';

// Police Manrope — kanban dashboard design
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'JIM — Le remplacement kine, enfin simple', template: '%s | JIM' },
  description: 'Trouvez ou publiez un remplacement kinesitherapeute en 30 secondes. Verifie RPPS. Contrat integre. Paiement securise. Cree par un kine, pour les kines.',
  keywords: ['remplacement kinesitherapeute', 'remplacant kine', 'trouver remplacant kine', 'application kine remplacement', 'plateforme remplacement kine'],
  metadataBase: new URL('https://jim.app'),
  openGraph: {
    title: 'JIM — Le remplacement kine, enfin simple',
    description: 'Trouvez ou publiez un remplacement kinesitherapeute en 30 secondes.',
    url: 'https://jim.app',
    siteName: 'JIM',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'JIM — Le remplacement kine, enfin simple' },
  other: { 'apple-itunes-app': 'app-id=XXXXXXXXXX' },
};

// Layout racine — providers globaux (auth + cache), chrome ajoute par les sous-layouts
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body className="font-sans text-neutral-800 antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
