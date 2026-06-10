'use client';

import { useEffect } from 'react';

export default function Error({
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6ed] px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-6">😕</p>
        <h1 className="font-sans text-2xl font-semibold text-neutral-800 mb-2">
          Quelque chose s&apos;est mal passé
        </h1>
        <p className="text-neutral-500 mb-8 text-sm">
          Une erreur inattendue s&apos;est produite. Notre équipe a été notifiée.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 bg-[#ff7c5c] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#e86d4f] transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
