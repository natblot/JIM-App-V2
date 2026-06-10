'use client';

import { useState } from 'react';
import { MapPin, Info } from 'lucide-react';
import Image from 'next/image';

// Bannieres — missions a proximite + toggle prix total
export function Banners() {
  const [showTotal, setShowTotal] = useState(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Missions a proximite */}
      <div className="bg-jim-surface rounded-2xl p-4 flex items-center justify-between shadow-sm border border-jim-border">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-jim-primary-pale flex items-center justify-center text-jim-primary">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-jim-text">
              Missions de remplacement a proximite
            </h3>
            <p className="text-sm text-jim-muted underline decoration-jim-beige-mid underline-offset-2 hover:text-jim-text-body cursor-pointer">
              Paris, France
            </p>
          </div>
        </div>
        <div className="w-24 h-16 rounded-xl bg-jim-beige-light overflow-hidden relative shadow-inner">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyoTaNJdDsQFzQdSQhOSZWkSC9Q0uGTEZ8dZaD3Qw4eq0i-3agcRnleu2Ot2XFeVEmI8AR9KGPzed8jlW0N1bEI6BQada6QrXDPsBXm85M5XcYnk5U47a6k4LqvSg-uDOcy0Z_XU3R_IuW-szoff5efOkcIkXjWG1FYVhKb22D2Y7la_o9wiSalK6ZsSy3hHArP9p1DbWOlHn31BDBTDne_0M7abA1hkD9mHrIu-oh2U17NEdwxfBobWLgKn6zGXAsPnHfvVWEti8d"
            alt="Mini carte"
            width={96}
            height={64}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={20} className="text-jim-primary drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* Toggle prix total */}
      <div className="bg-jim-surface rounded-2xl p-4 flex items-center justify-between shadow-sm border border-jim-border">
        <div>
          <h3 className="font-semibold text-jim-text">Afficher le prix total</h3>
          <p className="text-sm text-jim-muted flex items-center gap-1">
            <Info size={12} /> Tous frais inclus, avant charges
          </p>
        </div>
        <button
          type="button"
          aria-pressed={showTotal ? 'true' : 'false'}
          aria-label="Afficher le prix total"
          onClick={() => setShowTotal(!showTotal)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/40 ${
            showTotal ? 'bg-jim-primary' : 'bg-jim-beige-mid'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-jim-surface shadow-sm transition ${
              showTotal ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
