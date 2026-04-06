'use client';

// Section annonces similaires — client component avec useAnnoncesSimilaires
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import { useAnnoncesSimilaires } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';

interface SimilarAnnoncesProps {
  annonceId: string;
}

export function SimilarAnnonces({ annonceId }: SimilarAnnoncesProps) {
  const { supabase } = useAuthContext();
  const { data: similaires, isLoading } = useAnnoncesSimilaires(supabase, annonceId);

  if (isLoading || !similaires || similaires.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-neutral-900 mb-4">Annonces similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {similaires.map((a) => {
          const dateDebut = new Date(a.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
          const dateFin = new Date(a.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
          const distanceKm = Math.round(a.distance_meters / 1000);

          return (
            <Link
              key={a.id}
              href={`/annonce/${a.id}`}
              className="bg-white rounded-xl border border-neutral-100 p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-neutral-900 capitalize">{a.type_annonce}</span>
                {a.is_urgent && (
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">Urgent</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-neutral-500 mb-1">
                <MapPin size={12} /> {a.ville} {distanceKm > 0 && <span className="text-neutral-400">· {distanceKm} km</span>}
              </div>
              <div className="flex items-center gap-1 text-sm text-neutral-500 mb-2">
                <Calendar size={12} /> {dateDebut} → {dateFin}
              </div>
              <p className="text-sm font-semibold text-brand">{a.retrocession}% retrocession</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
