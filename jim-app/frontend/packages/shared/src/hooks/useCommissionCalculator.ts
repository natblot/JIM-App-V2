// Hook calcul commission cote client (affichage) — Epic 9, Story 9.3
// Le calcul officiel est TOUJOURS cote serveur — ce hook est pour l'apercu UI uniquement
import { useMemo } from 'react';
import type { CommissionType, PaymentBreakdownData } from '../types/paiement';

const COMMISSION_RATE_PERCENT = 1;

interface CommissionCalculatorInput {
  montantEncaisseCents: number;
  tauxRetrocession: number;
  isPro: boolean;
  isLaunchPeriod: boolean;
}

export function useCommissionCalculator(input: CommissionCalculatorInput): PaymentBreakdownData {
  return useMemo(() => {
    const { montantEncaisseCents, tauxRetrocession, isPro, isLaunchPeriod } = input;

    const montantRetrocessionCents = Math.round(montantEncaisseCents * tauxRetrocession / 100);
    const partTitulaireCents = montantEncaisseCents - montantRetrocessionCents;

    let commissionType: CommissionType;
    let commissionJimCents: number;

    if (isLaunchPeriod) {
      commissionType = 'lancement';
      commissionJimCents = 0;
    } else if (isPro) {
      commissionType = 'pro';
      commissionJimCents = 0;
    } else {
      commissionType = 'gratuit';
      commissionJimCents = Math.round(montantRetrocessionCents * COMMISSION_RATE_PERCENT / 100);
    }

    return {
      montantEncaisseCents,
      tauxRetrocession,
      montantRetrocessionCents,
      partTitulaireCents,
      commissionJimCents,
      montantNetRemplacantCents: montantRetrocessionCents - commissionJimCents,
      commissionType,
      isLaunchPeriod,
    };
  }, [input.montantEncaisseCents, input.tauxRetrocession, input.isPro, input.isLaunchPeriod]);
}

// Formateur de montant centimes → euros format FR
export function formatEuros(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}
