// Composant PaymentBreakdown — ventilation du versement — Epic 9
// Affiche le detail : honoraires → retrocession → part titulaire → commission → net remplacant
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface PaymentBreakdownProps {
  montantEncaisseCents: number;
  tauxRetrocession: number;
  montantRetrocessionCents: number;
  partTitulaireCents: number;
  commissionJimCents: number;
  montantNetRemplacantCents: number;
  isLaunchPeriod: boolean;
  remplacantName?: string;
  className?: string;
}

function formatEuros(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function BreakdownRow({ label, amount, highlight, muted }: { label: string; amount: string; highlight?: boolean; muted?: boolean }) {
  return (
    <View className="flex-row justify-between items-center py-1.5">
      <Text className={cn('text-sm', muted ? 'text-jim-muted' : 'text-jim-text')}>
        {label}
      </Text>
      <Text className={cn(
        'font-semibold',
        highlight ? 'text-base text-jim-primary' : muted ? 'text-sm text-jim-muted' : 'text-sm text-jim-text',
      )}>
        {amount}
      </Text>
    </View>
  );
}

export function PaymentBreakdown({
  montantEncaisseCents: _montantEncaisseCents,
  tauxRetrocession,
  montantRetrocessionCents,
  partTitulaireCents,
  commissionJimCents,
  montantNetRemplacantCents,
  isLaunchPeriod,
  remplacantName,
  className,
}: PaymentBreakdownProps) {
  return (
    <View
      className={cn('bg-jim-surface rounded-xl border border-jim-border p-4', className)}
      accessibilityLabel="Detail du versement"
    >
      <Text className="text-sm font-semibold text-jim-text mb-3">
        Detail du versement
      </Text>

      <BreakdownRow
        label={`Retrocession (${tauxRetrocession}%)`}
        amount={formatEuros(montantRetrocessionCents)}
      />

      <BreakdownRow
        label={`Votre part (${100 - tauxRetrocession}%)`}
        amount={formatEuros(partTitulaireCents)}
        muted
      />

      <BreakdownRow
        label="Frais de gestion"
        amount={commissionJimCents === 0 ? '0,00 \u20AC' : formatEuros(commissionJimCents)}
        muted
      />

      {isLaunchPeriod && commissionJimCents === 0 && (
        <Text className="text-xs text-jim-success mt-0.5 mb-1">
          Offert pendant le lancement
        </Text>
      )}

      <View className="border-t border-jim-border mt-2 pt-2">
        <BreakdownRow
          label={remplacantName ? `${remplacantName} recevra` : 'Le remplacant recevra'}
          amount={formatEuros(montantNetRemplacantCents)}
          highlight
        />
      </View>
    </View>
  );
}
