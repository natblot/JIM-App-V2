// Écran calendrier de disponibilités — Epic 7, remplaçants uniquement
// Vue mensuelle custom (pas de lib externe) + bottom sheet ajout
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { CalendarDay, type CalendarDayType } from '@jim/ui';

// ---------------------------------------------------------------------------
// Types locaux
// ---------------------------------------------------------------------------
interface Disponibilite {
  id: string;
  date_debut: string;  // YYYY-MM-DD
  date_fin: string;    // YYYY-MM-DD
  type: 'disponible' | 'indisponible';
}

interface Remplacement {
  id: string;
  date_debut: string;
  date_fin: string;
  annonce_titre: string;
}

// ---------------------------------------------------------------------------
// Hook placeholder — sera remplacé par l'implémentation frontend-developer
// qui lira/écrira la table calendar_entries dans Supabase
// ---------------------------------------------------------------------------
function useCalendrier() {
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);

  // Aucun remplacement en cours pour le placeholder
  const remplacements: Remplacement[] = [];

  // Dernière mise à jour (null si jamais mis à jour)
  const lastUpdatedAt: Date | null = null;

  const addDisponibilite = async (entry: Omit<Disponibilite, 'id'>) => {
    const newEntry: Disponibilite = {
      ...entry,
      id: Math.random().toString(36).slice(2),
    };
    setDisponibilites((prev) => [...prev, newEntry]);
  };

  const removeDisponibilite = async (id: string) => {
    setDisponibilites((prev) => prev.filter((d) => d.id !== id));
  };

  return { disponibilites, remplacements, lastUpdatedAt, addDisponibilite, removeDisponibilite };
}
// ---------------------------------------------------------------------------

// Calcule le type d'un jour en croisant les entrées disponibilites + remplacements
function getDayType(
  date: Date,
  disponibilites: Disponibilite[],
  remplacements: Remplacement[]
): CalendarDayType {
  const dateStr = date.toISOString().slice(0, 10);

  // Remplacement prioritaire
  const hasRemplacement = remplacements.some(
    (r) => dateStr >= r.date_debut && dateStr <= r.date_fin
  );
  if (hasRemplacement) return 'remplacement';

  // Indisponible
  const hasIndispo = disponibilites.some(
    (d) => d.type === 'indisponible' && dateStr >= d.date_debut && dateStr <= d.date_fin
  );
  if (hasIndispo) return 'indisponible';

  // Disponible
  const hasDisponible = disponibilites.some(
    (d) => d.type === 'disponible' && dateStr >= d.date_debut && dateStr <= d.date_fin
  );
  if (hasDisponible) return 'disponible';

  return 'none';
}

// Génère tous les jours d'un mois donné (tableau de Date)
function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Nombre de cases vides avant le 1er du mois (lundi = 0)
function getStartOffset(year: number, month: number): number {
  const firstDay = new Date(year, month, 1).getDay();
  // Convertir dimanche(0) → 6, lundi(1) → 0, …
  return firstDay === 0 ? 6 : firstDay - 1;
}

const JOURS_SEMAINE = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const MOIS_LABELS: Record<number, string> = {
  0: 'Janvier', 1: 'Février', 2: 'Mars', 3: 'Avril',
  4: 'Mai', 5: 'Juin', 6: 'Juillet', 7: 'Août',
  8: 'Septembre', 9: 'Octobre', 10: 'Novembre', 11: 'Décembre',
};

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------
export default function CalendrierScreen() {
  const router = useRouter();
  const { disponibilites, remplacements, lastUpdatedAt, addDisponibilite, removeDisponibilite } =
    useCalendrier();

  // Navigation mensuelle
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Jour sélectionné (tap sur un jour)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Bottom sheet ajout
  const [sheetVisible, setSheetVisible] = useState(false);
  const [newDateDebut, setNewDateDebut] = useState('');
  const [newDateFin, setNewDateFin] = useState('');
  const [newType, setNewType] = useState<'disponible' | 'indisponible'>('disponible');
  const [isAdding, setIsAdding] = useState(false);

  // Jours du mois courant
  const days = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  );
  const startOffset = useMemo(
    () => getStartOffset(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Avertissement si dernière mise à jour > 7 jours
  const daysSinceUpdate = lastUpdatedAt
    ? Math.floor((today.getTime() - lastUpdatedAt.getTime()) / 86_400_000)
    : null;
  const showStalenessWarning = daysSinceUpdate !== null && daysSinceUpdate > 7;

  // Pas encore de disponibilités saisies
  const isEmpty = disponibilites.length === 0 && remplacements.length === 0;

  // Navigation mois précédent / suivant
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Tap sur un jour du calendrier
  const handleDayPress = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);

    // Vérifier si le jour appartient à un remplacement (readonly)
    const remplacement = remplacements.find(
      (r) => dateStr >= r.date_debut && dateStr <= r.date_fin
    );
    if (remplacement) {
      Alert.alert('Remplacement en cours', remplacement.annonce_titre, [
        { text: 'OK', style: 'cancel' },
      ]);
      return;
    }

    // Vérifier si le jour appartient à une disponibilité (proposer suppression)
    const dispo = disponibilites.find(
      (d) => dateStr >= d.date_debut && dateStr <= d.date_fin
    );
    if (dispo) {
      const label = dispo.type === 'disponible' ? 'disponible' : 'indisponible';
      Alert.alert(
        `Période ${label}`,
        `Du ${dispo.date_debut} au ${dispo.date_fin}`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => void removeDisponibilite(dispo.id),
          },
        ]
      );
      return;
    }

    setSelectedDate(date);
  };

  // Raccourcis date dans le bottom sheet
  const fillCurrentWeek = () => {
    const now = new Date();
    const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - day);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setNewDateDebut(monday.toISOString().slice(0, 10));
    setNewDateFin(sunday.toISOString().slice(0, 10));
  };

  const fillCurrentMonth = () => {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setNewDateDebut(firstDay.toISOString().slice(0, 10));
    setNewDateFin(lastDay.toISOString().slice(0, 10));
  };

  // Soumission du formulaire
  const handleAdd = async () => {
    // Validation basique
    if (!newDateDebut || !newDateFin) {
      Alert.alert('Dates manquantes', 'Veuillez saisir une date de début et de fin.');
      return;
    }
    if (newDateFin < newDateDebut) {
      Alert.alert('Dates invalides', 'La date de fin doit être après la date de début.');
      return;
    }

    setIsAdding(true);
    try {
      await addDisponibilite({ date_debut: newDateDebut, date_fin: newDateFin, type: newType });
      setSheetVisible(false);
      setNewDateDebut('');
      setNewDateFin('');
      setNewType('disponible');
    } catch {
      Alert.alert('Erreur', "Impossible d'ajouter la disponibilité. Réessayez.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête avec bouton retour + navigation mois */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        className="bg-jim-surface border-b border-jim-border px-4 pt-14 pb-4"
      >
        <View className="flex-row items-center mb-3">
          <Pressable
            className="w-11 h-11 items-center justify-center rounded-xl active:bg-jim-background mr-2"
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Text className="text-jim-primary text-lg font-medium">←</Text>
          </Pressable>
          <Text className="text-xl font-bold text-jim-text flex-1">Disponibilités</Text>
        </View>

        {/* Navigation mensuelle */}
        <View className="flex-row items-center justify-between">
          <Pressable
            className="w-11 h-11 items-center justify-center rounded-xl active:bg-jim-background"
            onPress={goToPrevMonth}
            accessibilityRole="button"
            accessibilityLabel="Mois précédent"
          >
            <Text className="text-jim-primary text-xl font-medium">‹</Text>
          </Pressable>

          <Text className="text-jim-text font-semibold text-base">
            {MOIS_LABELS[currentMonth]} {currentYear}
          </Text>

          <Pressable
            className="w-11 h-11 items-center justify-center rounded-xl active:bg-jim-background"
            onPress={goToNextMonth}
            accessibilityRole="button"
            accessibilityLabel="Mois suivant"
          >
            <Text className="text-jim-primary text-xl font-medium">›</Text>
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Avertissement données périmées (> 7 jours) */}
        {showStalenessWarning && (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="mx-4 mt-4 px-4 py-3 bg-jim-accent/10 border border-jim-accent/30 rounded-xl"
            accessibilityRole="alert"
          >
            <Text className="text-jim-muted text-sm leading-5">
              Dernière mise à jour il y a {daysSinceUpdate} jours — vos disponibilités
              sont-elles à jour ?
            </Text>
          </Animated.View>
        )}

        {/* Grille calendrier */}
        <Animated.View
          entering={FadeInDown.duration(350).delay(60)}
          className="mx-4 mt-4 bg-jim-surface border border-jim-border rounded-xl overflow-hidden p-3"
        >
          {/* En-tête jours de la semaine */}
          <View className="flex-row mb-2">
            {JOURS_SEMAINE.map((jour, idx) => (
              <View key={idx} className="flex-1 items-center">
                <Text className="text-jim-muted text-xs font-semibold">{jour}</Text>
              </View>
            ))}
          </View>

          {/* Grille des jours */}
          {(() => {
            // Aplatir : [offset vides, jours du mois] → lignes de 7
            const totalCells = startOffset + days.length;
            const rows = Math.ceil(totalCells / 7);
            const grid: (Date | null)[][] = [];

            for (let row = 0; row < rows; row++) {
              const rowDays: (Date | null)[] = [];
              for (let col = 0; col < 7; col++) {
                const cellIndex = row * 7 + col;
                const dayIndex = cellIndex - startOffset;
                rowDays.push(dayIndex >= 0 && dayIndex < days.length ? days[dayIndex] : null);
              }
              grid.push(rowDays);
            }

            return grid.map((rowDays, rowIdx) => (
              <View key={rowIdx} className="flex-row mb-1">
                {rowDays.map((date, colIdx) => (
                  <View key={colIdx} className="flex-1 items-center">
                    {date ? (
                      <CalendarDay
                        date={date}
                        type={getDayType(date, disponibilites, remplacements)}
                        isSelected={
                          selectedDate?.toISOString().slice(0, 10) ===
                          date.toISOString().slice(0, 10)
                        }
                        isInRange={false}
                        isToday={
                          date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10)
                        }
                        onPress={handleDayPress}
                      />
                    ) : (
                      // Cellule vide pour l'alignement
                      <View className="w-11 h-11" />
                    )}
                  </View>
                ))}
              </View>
            ));
          })()}
        </Animated.View>

        {/* Légende */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(120)}
          className="mx-4 mt-3 flex-row flex-wrap gap-3 px-1"
        >
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-sm bg-jim-success/40" />
            <Text className="text-jim-muted text-xs">Disponible</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-sm bg-jim-muted/40" />
            <Text className="text-jim-muted text-xs">Indisponible</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-sm bg-jim-primary/40" />
            <Text className="text-jim-muted text-xs">Remplacement</Text>
          </View>
        </Animated.View>

        {/* Empty state */}
        {isEmpty && (
          <Animated.View
            entering={FadeIn.duration(400)}
            className="mx-4 mt-6 items-center px-6 py-8 bg-jim-surface border border-jim-border rounded-xl"
          >
            <Text className="text-4xl mb-3">📅</Text>
            <Text className="text-jim-text font-semibold text-base text-center mb-2">
              Votre agenda est vide
            </Text>
            <Text className="text-jim-muted text-sm text-center leading-5 mb-5">
              Ajoutez vos disponibilités pour recevoir les annonces qui vous correspondent.
            </Text>
            <Pressable
              className="bg-jim-primary px-6 py-3 rounded-xl active:bg-jim-primary/90"
              onPress={() => setSheetVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Ajouter mes disponibilités"
            >
              <Text className="text-white font-semibold text-sm">
                Ajouter mes disponibilités
              </Text>
            </Pressable>
          </Animated.View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* FAB "+" — visible si pas en empty state */}
      {!isEmpty && (
        <Pressable
          className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-jim-primary items-center justify-center shadow-lg active:bg-jim-primary/90"
          onPress={() => setSheetVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Ajouter une disponibilité"
        >
          <Text className="text-white text-2xl font-light leading-none">+</Text>
        </Pressable>
      )}

      {/* Bottom sheet — Ajouter une disponibilité */}
      <Modal
        visible={sheetVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSheetVisible(false)}
      >
        <View className="flex-1 bg-jim-background">
          {/* Handle + titre */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-jim-border" />
          </View>

          <Animated.View
            entering={SlideInDown.duration(250)}
            className="flex-1"
          >
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-jim-border">
              <Text className="text-lg font-bold text-jim-text">
                Ajouter une disponibilité
              </Text>
              <Pressable
                className="w-11 h-11 items-center justify-center rounded-xl active:bg-jim-background"
                onPress={() => setSheetVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
              >
                <Text className="text-jim-muted text-xl">✕</Text>
              </Pressable>
            </View>

            <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
              {/* Dates */}
              <Text className="text-jim-muted text-xs font-semibold uppercase tracking-wider mb-2">
                Période
              </Text>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-jim-muted text-xs mb-1.5">Date de début</Text>
                  <TextInput
                    className="bg-jim-surface border border-jim-border rounded-xl px-3 py-3 text-jim-text text-sm"
                    placeholder="AAAA-MM-JJ"
                    placeholderTextColor="oklch(0.55 0.01 250)"
                    value={newDateDebut}
                    onChangeText={setNewDateDebut}
                    keyboardType="numeric"
                    accessibilityLabel="Date de début"
                    accessibilityHint="Format AAAA-MM-JJ"
                    maxLength={10}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-jim-muted text-xs mb-1.5">Date de fin</Text>
                  <TextInput
                    className="bg-jim-surface border border-jim-border rounded-xl px-3 py-3 text-jim-text text-sm"
                    placeholder="AAAA-MM-JJ"
                    placeholderTextColor="oklch(0.55 0.01 250)"
                    value={newDateFin}
                    onChangeText={setNewDateFin}
                    keyboardType="numeric"
                    accessibilityLabel="Date de fin"
                    accessibilityHint="Format AAAA-MM-JJ"
                    maxLength={10}
                  />
                </View>
              </View>

              {/* Raccourcis de dates */}
              <View className="flex-row gap-2 mb-5">
                <Pressable
                  className="flex-1 py-2.5 rounded-xl border border-jim-border bg-jim-surface items-center active:bg-jim-background"
                  onPress={fillCurrentWeek}
                  accessibilityRole="button"
                  accessibilityLabel="Remplir avec toute la semaine courante"
                >
                  <Text className="text-jim-text text-sm font-medium">Toute la semaine</Text>
                </Pressable>
                <Pressable
                  className="flex-1 py-2.5 rounded-xl border border-jim-border bg-jim-surface items-center active:bg-jim-background"
                  onPress={fillCurrentMonth}
                  accessibilityRole="button"
                  accessibilityLabel="Remplir avec tout le mois courant"
                >
                  <Text className="text-jim-text text-sm font-medium">Tout le mois</Text>
                </Pressable>
              </View>

              {/* Sélecteur de type */}
              <Text className="text-jim-muted text-xs font-semibold uppercase tracking-wider mb-2">
                Type
              </Text>

              <View className="flex-row gap-3 mb-6">
                {(['disponible', 'indisponible'] as const).map((t) => (
                  <Pressable
                    key={t}
                    className={[
                      'flex-1 py-3 rounded-xl border items-center',
                      newType === t
                        ? 'bg-jim-primary/10 border-jim-primary'
                        : 'bg-jim-surface border-jim-border',
                    ].join(' ')}
                    onPress={() => setNewType(t)}
                    accessibilityRole="radio"
                    accessibilityLabel={t.charAt(0).toUpperCase() + t.slice(1)}
                    accessibilityState={{ checked: newType === t }}
                  >
                    <Text
                      className={[
                        'text-sm font-medium capitalize',
                        newType === t ? 'text-jim-primary' : 'text-jim-muted',
                      ].join(' ')}
                    >
                      {t === 'disponible' ? '✅ Disponible' : '🚫 Indisponible'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Bouton Ajouter */}
              <Pressable
                className={[
                  'h-14 rounded-xl items-center justify-center',
                  isAdding
                    ? 'bg-jim-primary/50'
                    : 'bg-jim-primary active:bg-jim-primary/90',
                ].join(' ')}
                onPress={() => void handleAdd()}
                disabled={isAdding}
                accessibilityRole="button"
                accessibilityLabel="Confirmer l'ajout de la disponibilité"
                accessibilityState={{ disabled: isAdding }}
              >
                <Text className="text-white font-semibold text-base">
                  {isAdding ? 'Enregistrement…' : 'Ajouter'}
                </Text>
              </Pressable>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
