'use client';

// Grille d'accueil kanban — 3 colonnes (Urgentes, Pres de moi, Nouveau)
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, X, SearchX } from 'lucide-react';
import { useSearchAnnonces } from '@jim/shared';
import type { GeoAnnonce, GeoSearchFilters } from '@jim/shared';
import { useAuthContext } from '../providers/auth-provider';
import { ListingCard, type ListingData } from './listing-card';
import type { AnnonceRow } from '../../lib/supabase-server';

interface HomeGridProps {
  /** Annonces chargees cote serveur (ISR) */
  initialAnnonces: AnnonceRow[];
}

// Transforme une annonce Supabase en ListingData (avec source + rpps)
function annonceToListing(annonce: AnnonceRow | GeoAnnonce): ListingData {
  const retro = annonce.retrocession ?? 80;
  const prixJour = Math.round(retro * 3.5);

  // photo_urls est present sur AnnonceRow mais pas sur GeoAnnonce
  const firstPhoto = 'photo_urls' in annonce ? (annonce as AnnonceRow).photo_urls?.[0] : undefined;

  return {
    id: annonce.id,
    ville: annonce.ville ? `${annonce.ville}, France` : 'France',
    description: annonce.description ?? `Remplacement ${annonce.type_annonce ?? 'kinesitherapie'} — ${retro}% retrocession`,
    prixJour,
    ...(firstPhoto ? { image: firstPhoto } : {}),
    specialites: annonce.specialites ?? [],
    isUrgent: annonce.is_urgent,
    // Les annonces natives sont publiees par des titulaires RPPS-verifies (gate obligatoire)
    isRppsVerified: annonce.source === 'native',
    source: annonce.source,
    dateDebut: annonce.date_debut,
    dateFin: annonce.date_fin,
  };
}

interface ClientFilters {
  type: string | null;
  isUrgent: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  retroMin: string | null;
  typeCabinet: string | null;
  specialite: string | null;
  sort: string | null;
}

// Filtre + tri client-side
function filterAndSortAnnonces(annonces: AnnonceRow[], f: ClientFilters): AnnonceRow[] {
  let filtered = annonces;
  if (f.type) filtered = filtered.filter((a) => a.type_annonce === f.type);
  if (f.isUrgent === 'true') filtered = filtered.filter((a) => a.is_urgent);
  if (f.dateDebut) filtered = filtered.filter((a) => a.date_fin >= f.dateDebut!);
  if (f.dateFin) filtered = filtered.filter((a) => a.date_debut <= f.dateFin!);
  if (f.retroMin) {
    const min = parseFloat(f.retroMin);
    filtered = filtered.filter((a) => (a.retrocession ?? 0) >= min);
  }
  if (f.typeCabinet) filtered = filtered.filter((a) => a.type_cabinet === f.typeCabinet);
  if (f.specialite) filtered = filtered.filter((a) => a.specialites?.includes(f.specialite!) ?? false);

  // Tri
  if (f.sort === 'retrocession_desc') {
    filtered = [...filtered].sort((a, b) => (b.retrocession ?? 0) - (a.retrocession ?? 0));
  } else if (f.sort === 'retrocession_asc') {
    filtered = [...filtered].sort((a, b) => (a.retrocession ?? 0) - (b.retrocession ?? 0));
  } else if (f.sort === 'date_debut_asc') {
    filtered = [...filtered].sort((a, b) => a.date_debut.localeCompare(b.date_debut));
  }

  return filtered;
}

// Colonnes kanban avec dot colore
interface KanbanColumnProps {
  title: string;
  dotColor: string;
  listings: ListingData[];
}

function KanbanColumn({ title, dotColor, listings }: KanbanColumnProps) {
  return (
    <div className="kanban-column flex-shrink-0">
      {/* Header colonne */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400 font-medium ml-auto">{listings.length}</span>
      </div>

      {/* Cards scrollables */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            Aucune annonce
          </div>
        )}
      </div>
    </div>
  );
}

export function HomeGrid({ initialAnnonces }: HomeGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase } = useAuthContext();

  // Parametres de recherche geospatiale
  const ville = searchParams.get('ville');
  const lat = parseFloat(searchParams.get('lat') ?? '0');
  const lng = parseFloat(searchParams.get('lng') ?? '0');
  const radius = parseInt(searchParams.get('r') ?? '30', 10);
  const isGeoSearchActive = !!ville && lat !== 0 && lng !== 0;

  // Parametres de filtres
  const filters: ClientFilters = {
    type: searchParams.get('type'),
    isUrgent: searchParams.get('is_urgent'),
    dateDebut: searchParams.get('date_debut'),
    dateFin: searchParams.get('date_fin'),
    retroMin: searchParams.get('retro_min'),
    typeCabinet: searchParams.get('type_cabinet'),
    specialite: searchParams.get('specialite'),
    sort: searchParams.get('sort'),
  };
  const hasFilters = Object.values(filters).some(Boolean);

  // Recherche geospatiale — active uniquement si parametres presents
  const geoFilters: GeoSearchFilters = { lat, lng, radiusKm: radius, limit: 50, offset: 0 };
  if (filters.dateDebut) geoFilters.dateDebut = filters.dateDebut;
  if (filters.dateFin) geoFilters.dateFin = filters.dateFin;
  if (filters.retroMin) geoFilters.retrocessionMin = parseFloat(filters.retroMin);
  const search = useSearchAnnonces(supabase, geoFilters);

  function handleClearSearch() {
    router.push('/');
  }

  // Donnees a afficher — geo search OU filtrage local
  let listings: ListingData[];
  if (isGeoSearchActive) {
    let results = search.data ?? [];
    // Filtrer par type/urgent/cabinet/specialite cote client
    if (filters.type) results = results.filter((a) => a.type_annonce === filters.type);
    if (filters.isUrgent === 'true') results = results.filter((a) => a.is_urgent);
    if (filters.typeCabinet) results = results.filter((a) => a.type_cabinet === filters.typeCabinet);
    if (filters.specialite) results = results.filter((a) => a.specialites?.includes(filters.specialite!) ?? false);
    // Tri
    if (filters.sort === 'retrocession_desc') results = [...results].sort((a, b) => b.retrocession - a.retrocession);
    else if (filters.sort === 'retrocession_asc') results = [...results].sort((a, b) => a.retrocession - b.retrocession);
    else if (filters.sort === 'date_debut_asc') results = [...results].sort((a, b) => a.date_debut.localeCompare(b.date_debut));
    listings = results.map(annonceToListing);
  } else {
    const filtered = filterAndSortAnnonces(initialAnnonces, filters);
    listings = filtered.map(annonceToListing);
  }

  const showBanner = isGeoSearchActive || hasFilters;
  const isLoading = isGeoSearchActive && search.isLoading;

  // Repartir les listings en 3 colonnes kanban
  const urgentListings = listings.filter((l) => l.isUrgent);
  const recentListings = [...listings]
    .filter((l) => !l.isUrgent)
    .sort((a, b) => {
      if (a.dateDebut && b.dateDebut) return b.dateDebut.localeCompare(a.dateDebut);
      return 0;
    });
  // "Pres de moi" — toutes les annonces (proximity). On affiche tout.
  const nearbyListings = listings;

  return (
    <div>
      {/* Bandeau recherche/filtre actif */}
      {showBanner && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isGeoSearchActive
                ? `Remplacements autour de ${ville}`
                : filters.type
                ? `Annonces : ${filters.type}`
                : filters.isUrgent
                ? 'Annonces urgentes'
                : 'Resultats filtres'}
            </h2>
            <p className="text-sm text-gray-500">
              {isLoading
                ? 'Recherche en cours...'
                : `${listings.length} resultat${listings.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <X size={14} /> Effacer
          </button>
        </div>
      )}

      {/* Chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-brand" />
        </div>
      )}

      {/* Erreur */}
      {isGeoSearchActive && search.isError && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-6 py-4 text-sm text-red-700">
          Une erreur est survenue lors de la recherche. Veuillez reessayer.
        </div>
      )}

      {/* Etat vide */}
      {!isLoading && listings.length === 0 && showBanner && (
        <div className="text-center py-16">
          <SearchX size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Aucune mission trouvee</p>
          <p className="text-sm text-gray-500 mb-4">
            Essayez d&apos;elargir votre recherche ou de modifier vos criteres.
          </p>
          <button
            onClick={handleClearSearch}
            className="text-sm font-medium text-gray-700 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Reinitialiser les filtres
          </button>
        </div>
      )}

      {/* Kanban board */}
      {!isLoading && listings.length > 0 && (
        <div className="flex gap-4 h-full overflow-x-auto no-scrollbar pb-4">
          <KanbanColumn
            title="Urgentes"
            dotColor="bg-orange-500"
            listings={urgentListings}
          />
          <KanbanColumn
            title="Pres de moi"
            dotColor="bg-blue-500"
            listings={nearbyListings}
          />
          <KanbanColumn
            title="Nouveau"
            dotColor="bg-green-500"
            listings={recentListings}
          />
        </div>
      )}

      {/* Etat initial sans filtres — kanban complet */}
      {!isLoading && listings.length === 0 && !showBanner && (
        <div className="flex gap-4 h-full overflow-x-auto no-scrollbar pb-4">
          <KanbanColumn
            title="Urgentes"
            dotColor="bg-orange-500"
            listings={[]}
          />
          <KanbanColumn
            title="Pres de moi"
            dotColor="bg-blue-500"
            listings={[]}
          />
          <KanbanColumn
            title="Nouveau"
            dotColor="bg-green-500"
            listings={[]}
          />
        </div>
      )}
    </div>
  );
}
