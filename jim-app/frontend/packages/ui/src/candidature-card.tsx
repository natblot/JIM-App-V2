// Card candidature — Epic 5, Story 5.3
// Affiche une candidature du point de vue remplaçant
import { View, Text, Pressable } from 'react-native';
import { cn } from './utils/cn';

// Statuts possibles d'une candidature
type CandidatureStatut = 'en_attente' | 'vue' | 'en_discussion' | 'acceptee' | 'refusee' | 'expiree';

interface CandidatureCardProps {
  annonceVille: string;
  annonceStatut: string;
  dateDebut: string;
  dateFin: string;
  retrocession: number;
  statut: CandidatureStatut;
  createdAt: string;
  onRetirer?: () => void;
  onPress?: () => void;
  isUrgent?: boolean;
}

// Configuration couleur sémantique des statuts candidature
const STATUT_CONFIG: Record<CandidatureStatut, { label: string; containerClass: string; textClass: string; dotClass: string }> = {
  en_attente: {
    label: 'En attente',
    containerClass: 'bg-jim-muted/10 border-jim-muted/30',
    textClass: 'text-jim-muted',
    dotClass: 'bg-jim-muted',
  },
  vue: {
    label: 'Vue',
    containerClass: 'bg-jim-primary/10 border-jim-primary/30',
    textClass: 'text-jim-primary',
    dotClass: 'bg-jim-primary',
  },
  en_discussion: {
    label: 'En discussion',
    containerClass: 'bg-jim-accent/10 border-jim-accent/30',
    textClass: 'text-jim-accent',
    dotClass: 'bg-jim-accent',
  },
  acceptee: {
    label: 'Acceptée',
    containerClass: 'bg-jim-success/10 border-jim-success/30',
    textClass: 'text-jim-success',
    dotClass: 'bg-jim-success',
  },
  refusee: {
    label: 'Refusée',
    containerClass: 'bg-jim-destructive/10 border-jim-destructive/30',
    textClass: 'text-jim-destructive',
    dotClass: 'bg-jim-destructive',
  },
  expiree: {
    label: 'Expirée',
    containerClass: 'bg-jim-muted/10 border-jim-muted/30',
    textClass: 'text-jim-muted',
    dotClass: 'bg-jim-muted',
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function CandidatureCard({
  annonceVille,
  dateDebut,
  dateFin,
  retrocession,
  statut,
  createdAt,
  onRetirer,
  onPress,
  isUrgent,
}: CandidatureCardProps) {
  const config = STATUT_CONFIG[statut];

  return (
    <Pressable
      className="bg-jim-surface rounded-2xl border border-jim-border p-4 active:opacity-80"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Candidature pour ${annonceVille} — ${config.label}`}
    >
      {/* En-tête : badge statut + badge urgent */}
      <View className="flex-row items-center justify-between mb-3">
        <View
          className={cn('flex-row items-center gap-1.5 px-3 py-1 rounded-full border', config.containerClass)}
          accessibilityLabel={`Statut candidature : ${config.label}`}
        >
          <View className={cn('w-2 h-2 rounded-full', config.dotClass)} />
          <Text className={cn('text-xs font-medium', config.textClass)}>{config.label}</Text>
        </View>

        {isUrgent && (
          <View className="bg-jim-destructive/10 border border-jim-destructive/30 px-2 py-0.5 rounded-full">
            <Text className="text-jim-destructive text-xs font-bold">URGENT</Text>
          </View>
        )}
      </View>

      {/* Corps : infos annonce compactes */}
      <View className="gap-1.5 mb-3">
        <Text className="text-jim-text font-bold text-lg">{annonceVille}</Text>
        <Text className="text-jim-muted text-sm">
          {formatDate(dateDebut)} → {formatDate(dateFin)}
        </Text>
        <Text className="text-jim-primary font-bold text-base">{retrocession.toFixed(0)}%</Text>
      </View>

      {/* Pied : date d'envoi + actions */}
      <View className="pt-3 border-t border-jim-border flex-row items-center justify-between">
        <Text className="text-jim-muted text-xs">
          Envoyée le {formatDateLong(createdAt)}
        </Text>

        {/* CTA contextuel selon statut */}
        {statut === 'en_attente' && onRetirer && (
          <Pressable
            className="min-h-[44px] min-w-[44px] items-center justify-center px-3 rounded-lg border border-jim-muted/40 active:opacity-70"
            onPress={onRetirer}
            accessibilityRole="button"
            accessibilityLabel="Retirer cette candidature"
          >
            <Text className="text-jim-muted text-sm font-medium">Retirer</Text>
          </Pressable>
        )}

        {statut === 'expiree' && (
          <Text className="text-jim-muted text-xs italic">Expirée sans réponse</Text>
        )}
      </View>
    </Pressable>
  );
}
