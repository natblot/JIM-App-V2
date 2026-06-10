import type { Metadata } from 'next';
import { Manrope, Fraunces } from 'next/font/google';
import { QueryProvider } from '../components/providers/query-provider';
import { AuthProvider } from '../components/providers/auth-provider';
import './globals.css';

// Police Manrope — corps, UI, titres sans serif
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

// Police Fraunces — accent editorial en italique (hero, citations)
// Utilisee via class `font-serif italic` sur les mots pivots
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-fraunces',
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
    <html lang="fr" className={`${manrope.variable} ${fraunces.variable}`}>
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
