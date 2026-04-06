// Card d'annonce — utilisée dans les listes (dashboard titulaire, recherche remplaçant)
import { View, Text, Pressable } from 'react-native';
import { cn } from './utils/cn';
import { StatusBadge, type AnnonceStatut } from './status-badge';
import { UrgentBadge } from './urgent-badge';
import { SourceBadge } from './source-badge';

export interface AnnonceCardData {
  id: string;
  ville: string;
  codePostal?: string | null;
  dateDebut: string;
  dateFin: string;
  retrocession: number;
  statut: AnnonceStatut;
  isUrgent: boolean;
  typeAnnonce?: string;
  typeCabinet?: string | null;
  source?: string;
  lastVerifiedAt?: string | null;    // pour la fraîcheur
  freshnessText?: string;             // pré-calculé par le parent
}

interface AnnonceCardProps {
  annonce: AnnonceCardData;
  onPress?: () => void;
  variant?: 'default' | 'compact';
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function AnnonceCard({ annonce, onPress, variant: _variant = 'default', className }: AnnonceCardProps) {
  const isHistorique = annonce.statut === 'pourvue' || annonce.statut === 'expiree';

  return (
    <Pressable
      className={cn(
        'bg-jim-surface rounded-2xl border border-jim-border p-4',
        isHistorique && 'opacity-70',
        'active:opacity-80',
        className
      )}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Annonce ${annonce.ville} — ${formatDate(annonce.dateDebut)} au ${formatDate(annonce.dateFin)}`}
    >
      {/* En-tête : badges */}
      <View className="flex-row items-center gap-2 mb-3">
        <StatusBadge statut={annonce.statut} size="sm" />
        {annonce.isUrgent && <UrgentBadge />}
      </View>

      {/* Badge source externe — discret, sous les badges principaux */}
      {annonce.source && annonce.source !== 'native' && (
        <SourceBadge
          source={annonce.source}
          freshnessText={annonce.freshnessText}
          className="mb-2"
        />
      )}

      {/* Corps */}
      <View className="gap-1.5">
        {/* Ville + code postal */}
        <Text className="text-jim-text font-bold text-lg leading-tight">
          {annonce.ville}
          {annonce.codePostal ? ` (${annonce.codePostal.slice(0, 2)})` : ''}
        </Text>

        {/* Dates */}
        <Text className="text-jim-muted text-sm">
          {formatDate(annonce.dateDebut)} → {formatDate(annonce.dateFin)}
        </Text>

        {/* Type cabinet si disponible */}
        {annonce.typeCabinet && (
          <Text className="text-jim-muted text-sm capitalize">
            {annonce.typeCabinet}
          </Text>
        )}
      </View>

      {/* Pied : rétrocession */}
      <View className="mt-3 pt-3 border-t border-jim-border flex-row items-center justify-between">
        <Text className="text-jim-text font-bold text-xl">
          {annonce.retrocession.toFixed(0)}%
        </Text>
        <Text className="text-jim-muted text-xs">rétrocession</Text>
      </View>
    </Pressable>
  );
}
