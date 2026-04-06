// Barre de filtres combinables — Epic 4, Story 4.2
// 3 filtres : distance (boutons), rétrocession min (boutons), dates (texte)
import { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';

interface FilterBarProps {
  radiusKm: number;
  onRadiusChange: (value: number) => void;
  retrocessionMin?: number;
  onRetrocessionMinChange: (value: number | undefined) => void;
  dateDebut?: string;
  dateFin?: string;
  onDateDebutChange: (value: string | undefined) => void;
  onDateFinChange: (value: string | undefined) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

// Options de distance disponibles (km)
const DISTANCE_OPTIONS = [10, 20, 30, 50, 100];

// Options de rétrocession (0 = désactivé)
const RETROCESSION_OPTIONS = [0, 70, 75, 80, 85, 90];

type ActivePanel = 'distance' | 'retrocession' | 'dates' | null;

export function FilterBar({
  radiusKm,
  onRadiusChange,
  retrocessionMin,
  onRetrocessionMinChange,
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onReset,
  hasActiveFilters,
}: FilterBarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  // Ouvrir/fermer un panneau — ferme si déjà ouvert
  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  // Libellé du badge distance
  const distanceLabel = `≤ ${radiusKm} km`;

  // Libellé du badge rétrocession
  const retrocessionLabel = retrocessionMin
    ? `≥ ${retrocessionMin}%`
    : 'Rétro.';

  // Libellé du badge dates
  const datesLabel =
    dateDebut || dateFin
      ? [dateDebut, dateFin].filter(Boolean).join(' → ')
      : 'Dates';

  // Détermine si un filtre est actif (différent du défaut)
  const isDistanceActive = radiusKm !== 30;
  const isRetrocessionActive = Boolean(retrocessionMin);
  const isDatesActive = Boolean(dateDebut || dateFin);

  return (
    <View className="bg-jim-surface border-b border-jim-border">
      {/* Ligne badges scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-3 px-4"
        contentContainerClassName="gap-2 flex-row items-center"
      >
        {/* Badge distance */}
        <FilterBadge
          label={distanceLabel}
          isActive={isDistanceActive}
          isOpen={activePanel === 'distance'}
          onPress={() => togglePanel('distance')}
        />

        {/* Badge rétrocession */}
        <FilterBadge
          label={retrocessionLabel}
          isActive={isRetrocessionActive}
          isOpen={activePanel === 'retrocession'}
          onPress={() => togglePanel('retrocession')}
        />

        {/* Badge dates */}
        <FilterBadge
          label={datesLabel}
          isActive={isDatesActive}
          isOpen={activePanel === 'dates'}
          onPress={() => togglePanel('dates')}
        />

        {/* Bouton réinitialiser */}
        {hasActiveFilters && (
          <Pressable
            className="h-9 px-3 rounded-full border border-jim-destructive/40 items-center justify-center active:opacity-70"
            onPress={() => {
              setActivePanel(null);
              onReset();
            }}
            accessibilityRole="button"
            accessibilityLabel="Réinitialiser tous les filtres"
          >
            <Text className="text-jim-destructive text-sm font-medium">
              Réinitialiser
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Panneau distance */}
      {activePanel === 'distance' && (
        <FilterPanel title="Distance maximale">
          <View className="flex-row flex-wrap gap-2">
            {DISTANCE_OPTIONS.map((km) => (
              <OptionButton
                key={km}
                label={`${km} km`}
                isSelected={radiusKm === km}
                onPress={() => {
                  onRadiusChange(km);
                  setActivePanel(null);
                }}
              />
            ))}
          </View>
        </FilterPanel>
      )}

      {/* Panneau rétrocession */}
      {activePanel === 'retrocession' && (
        <FilterPanel title="Rétrocession minimale">
          <View className="flex-row flex-wrap gap-2">
            {RETROCESSION_OPTIONS.map((pct) => (
              <OptionButton
                key={pct}
                label={pct === 0 ? 'Tous' : `≥ ${pct}%`}
                isSelected={
                  pct === 0
                    ? !retrocessionMin
                    : retrocessionMin === pct
                }
                onPress={() => {
                  onRetrocessionMinChange(pct === 0 ? undefined : pct);
                  setActivePanel(null);
                }}
              />
            ))}
          </View>
        </FilterPanel>
      )}

      {/* Panneau dates */}
      {activePanel === 'dates' && (
        <FilterPanel title="Période">
          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-jim-muted text-xs">
                Date de début (JJ/MM/AAAA)
              </Text>
              <TextInput
                className="h-11 px-3 rounded-xl border border-jim-border bg-jim-background text-jim-text"
                placeholder="ex : 01/07/2025"
                placeholderTextColor="#9CA3AF"
                value={dateDebut ?? ''}
                onChangeText={(v) =>
                  onDateDebutChange(v.trim() === '' ? undefined : v.trim())
                }
                keyboardType="numeric"
                maxLength={10}
                accessibilityLabel="Date de début"
              />
            </View>
            <View className="gap-1">
              <Text className="text-jim-muted text-xs">
                Date de fin (JJ/MM/AAAA)
              </Text>
              <TextInput
                className="h-11 px-3 rounded-xl border border-jim-border bg-jim-background text-jim-text"
                placeholder="ex : 31/08/2025"
                placeholderTextColor="#9CA3AF"
                value={dateFin ?? ''}
                onChangeText={(v) =>
                  onDateFinChange(v.trim() === '' ? undefined : v.trim())
                }
                keyboardType="numeric"
                maxLength={10}
                accessibilityLabel="Date de fin"
              />
            </View>
            <Pressable
              className="h-11 rounded-xl bg-jim-primary items-center justify-center active:bg-jim-primary/90"
              onPress={() => setActivePanel(null)}
              accessibilityRole="button"
            >
              <Text className="text-white font-semibold">Appliquer</Text>
            </Pressable>
          </View>
        </FilterPanel>
      )}
    </View>
  );
}

// --- Sous-composants internes ---

interface FilterBadgeProps {
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onPress: () => void;
}

function FilterBadge({ label, isActive, isOpen, onPress }: FilterBadgeProps) {
  return (
    <Pressable
      className={[
        'h-9 px-4 rounded-full border items-center justify-center active:opacity-70',
        isActive || isOpen
          ? 'bg-jim-primary border-jim-primary'
          : 'bg-jim-surface border-jim-border',
      ].join(' ')}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text
        className={`text-sm font-medium ${
          isActive || isOpen ? 'text-white' : 'text-jim-text'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface FilterPanelProps {
  title: string;
  children: React.ReactNode;
}

function FilterPanel({ title, children }: FilterPanelProps) {
  return (
    <View className="px-4 pb-4 border-t border-jim-border">
      <Text className="text-jim-text font-semibold mt-3 mb-3">{title}</Text>
      {children}
    </View>
  );
}

interface OptionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function OptionButton({ label, isSelected, onPress }: OptionButtonProps) {
  return (
    <Pressable
      className={[
        'h-10 px-5 rounded-xl border items-center justify-center active:opacity-70',
        isSelected
          ? 'bg-jim-primary border-jim-primary'
          : 'bg-jim-surface border-jim-border',
      ].join(' ')}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        className={`text-sm font-medium ${
          isSelected ? 'text-white' : 'text-jim-text'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
