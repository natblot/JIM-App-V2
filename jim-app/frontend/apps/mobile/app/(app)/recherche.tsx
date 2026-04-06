// Écran Recherche remplaçant — Story 4.2 + 4.3
// FlashList d'annonces + toggle liste/carte + filtres combinables
import { useCallback, useMemo } from 'react';
import { View, Text, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import {
  useUIStore,
  useSearchAnnonces,
  useDebounce,
  useNetworkStatus,
  type GeoAnnonce,
} from '@jim/shared';
import {
  AnnonceCard,
  FilterBar,
  EmptyState,
  AnnonceSkeleton,
  OfflineBanner,
  type AnnonceCardData,
} from '@jim/ui';
import { supabase } from '../_layout';
import { useUserLocation } from '../../hooks/useUserLocation';

// Convertit un GeoAnnonce (API) en AnnonceCardData (composant UI)
function toCardData(annonce: GeoAnnonce): AnnonceCardData {
  return {
    id: annonce.id,
    ville: annonce.ville,
    codePostal: annonce.code_postal,
    dateDebut: annonce.date_debut,
    dateFin: annonce.date_fin,
    retrocession: annonce.retrocession,
    statut: annonce.statut as AnnonceCardData['statut'],
    isUrgent: annonce.is_urgent,
    typeAnnonce: annonce.type_annonce,
    typeCabinet: annonce.type_cabinet,
    source: annonce.source,
  };
}

export default function RechercheScreen() {
  const router = useRouter();
  const { isOffline } = useNetworkStatus();
  const { view, setView, filters, setFilters, resetFilters } = useUIStore();

  // Géolocalisation de l'utilisateur
  const { latitude, longitude, isLoading: isLocationLoading } = useUserLocation();

  // Debounce des filtres — 200ms
  const debouncedFilters = useDebounce(filters, 200);

  // Position utilisée pour la recherche (0,0 si pas encore localisé)
  const searchLat = latitude ?? 0;
  const searchLng = longitude ?? 0;

  const {
    data: annonces,
    isLoading: isSearchLoading,
    refetch,
    isRefetching,
  } = useSearchAnnonces(supabase, {
    lat: searchLat,
    lng: searchLng,
    radiusKm: debouncedFilters.radiusKm,
    dateDebut: debouncedFilters.dateDebut,
    dateFin: debouncedFilters.dateFin,
    retrocessionMin: debouncedFilters.retrocessionMin,
    limit: 50,
  });

  const isLoading = isLocationLoading || isSearchLoading;

  // Détermine si des filtres non-défaut sont actifs
  const hasActiveFilters = useMemo(
    () =>
      filters.radiusKm !== 30 ||
      Boolean(filters.retrocessionMin) ||
      Boolean(filters.dateDebut) ||
      Boolean(filters.dateFin),
    [filters]
  );

  // Rendu d'une carte annonce dans la FlashList
  const renderItem = useCallback(
    ({ item }: { item: GeoAnnonce }) => (
      <AnnonceCard
        annonce={toCardData(item)}
        onPress={() =>
          router.push(`/(app)/annonce/${item.id}` as never)
        }
        className="mb-3"
      />
    ),
    [router]
  );

  // Détermine la variante de l'empty state
  const emptyVariant = useMemo(() => {
    if (isOffline) return 'offline' as const;
    if (hasActiveFilters) return 'no-results' as const;
    return 'empty-zone' as const;
  }, [isOffline, hasActiveFilters]);

  return (
    <View className="flex-1 bg-jim-background">
      {/* Bandeau hors ligne — position absolue */}
      <OfflineBanner isOffline={isOffline} />

      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-jim-text">
            Annonces
          </Text>

          {/* Toggle liste / carte */}
          <View className="flex-row bg-jim-background rounded-xl overflow-hidden border border-jim-border">
            <ToggleTab
              label="Liste"
              isActive={view === 'list'}
              onPress={() => setView('list')}
            />
            <ToggleTab
              label="Carte"
              isActive={view === 'map'}
              onPress={() => setView('map')}
            />
          </View>
        </View>
      </View>

      {/* Barre de filtres */}
      <FilterBar
        radiusKm={filters.radiusKm}
        onRadiusChange={(v) => setFilters({ radiusKm: v })}
        retrocessionMin={filters.retrocessionMin}
        onRetrocessionMinChange={(v) => setFilters({ retrocessionMin: v })}
        dateDebut={filters.dateDebut}
        dateFin={filters.dateFin}
        onDateDebutChange={(v) => setFilters({ dateDebut: v })}
        onDateFinChange={(v) => setFilters({ dateFin: v })}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Corps — liste ou carte */}
      {view === 'list' ? (
        <ListView
          annonces={annonces ?? []}
          isLoading={isLoading}
          isRefetching={isRefetching}
          emptyVariant={emptyVariant}
          onRefresh={refetch}
          renderItem={renderItem}
          onResetFilters={resetFilters}
          onCreateAlerte={() => {
            /* TODO : naviguer vers création d'alerte — Epic 5 */
          }}
        />
      ) : (
        <MapPlaceholder />
      )}
    </View>
  );
}

// --- Vue liste ---

interface ListViewProps {
  annonces: GeoAnnonce[];
  isLoading: boolean;
  isRefetching: boolean;
  emptyVariant: 'offline' | 'no-results' | 'empty-zone';
  onRefresh: () => void;
  renderItem: ({ item }: { item: GeoAnnonce }) => React.ReactElement;
  onResetFilters: () => void;
  onCreateAlerte: () => void;
}

function ListView({
  annonces,
  isLoading,
  isRefetching,
  emptyVariant,
  onRefresh,
  renderItem,
  onResetFilters,
  onCreateAlerte,
}: ListViewProps) {
  if (isLoading) {
    return (
      <View className="flex-1 px-4 pt-4">
        <AnnonceSkeleton count={4} />
      </View>
    );
  }

  if (annonces.length === 0) {
    return (
      <EmptyState
        variant={emptyVariant}
        onPrimaryAction={
          emptyVariant === 'no-results' ? onResetFilters : onCreateAlerte
        }
        onSecondaryAction={
          emptyVariant !== 'offline' ? onCreateAlerte : undefined
        }
      />
    );
  }

  return (
    <FlashList
      data={annonces}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      estimatedItemSize={160}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          tintColor="#4B7BEC"
        />
      }
    />
  );
}

// --- Placeholder carte ---
// TODO: react-native-maps — remplacer par MapView quand la lib sera installée

function MapPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center bg-jim-background px-8">
      <Text className="text-4xl mb-4" aria-hidden>
        🗺️
      </Text>
      <Text className="text-jim-text font-bold text-lg text-center mb-2">
        Carte disponible prochainement
      </Text>
      <Text className="text-jim-muted text-sm text-center leading-5">
        On intègre la vue carte pour que tu puisses explorer les annonces
        autour de toi d'un coup d'œil.
      </Text>
    </View>
  );
}

// --- Toggle tab ---

interface ToggleTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function ToggleTab({ label, isActive, onPress }: ToggleTabProps) {
  return (
    <Pressable
      className={`px-4 py-2 items-center justify-center ${
        isActive ? 'bg-jim-primary' : 'bg-transparent'
      }`}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        className={`text-sm font-medium ${
          isActive ? 'text-white' : 'text-jim-muted'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
