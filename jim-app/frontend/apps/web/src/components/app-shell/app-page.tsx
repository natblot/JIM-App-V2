'use client';

// Chrome de page commun (app) — navbar de la page d'accueil + fond papier chaud + dot-grid.
// La navbar est unifiee sur tout le site : `Header` (landing) partout, la navigation
// app (Missions, Paiements, Messages, Parametres) vit dans le dropdown profil.

import { Header } from '../layout/header';

interface AppPageProps {
  children: React.ReactNode;
}

export function AppPage({ children }: AppPageProps) {
  return (
    <div className="app-page-root">
      <Header />
      <div className="app-page-content">{children}</div>

      <style jsx>{`
        .app-page-root {
          position: relative;
          min-height: 100vh;
          background: #fdf6ed;
          color: #3a1f08;
          font-family: var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif;
        }

        /* warm brand backdrop */
        .app-page-root::before {
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
        .app-page-root::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: radial-gradient(circle, rgba(58, 31, 8, 1) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.045;
        }

        .app-page-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
