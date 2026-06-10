'use client';

import { useEffect } from 'react';

// Capture les erreurs dans le root layout lui-meme — doit inclure <html> et <body>
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ed] px-4 font-sans antialiased">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-6">😕</p>
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            JIM rencontre un problème
          </h1>
          <p className="text-neutral-500 mb-8 text-sm">
            Une erreur critique s&apos;est produite. Rechargez la page ou revenez plus tard.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[#ff7c5c] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#e86d4f] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
