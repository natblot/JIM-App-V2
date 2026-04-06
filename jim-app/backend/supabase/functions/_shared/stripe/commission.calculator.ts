// Calcul de la commission JIM — Epic 9
// 0% pendant le lancement, 1% en gratuit, 0% si Pro
// Montants en centimes (INT), arrondi Math.round()

import type { CommissionType } from './stripe.types.ts';

export interface CommissionInput {
  montantRetrocessionCents: number;
  isLaunchPeriod: boolean;
  isPro: boolean;
}

export interface CommissionResult {
  commissionType: CommissionType;
  commissionRatePercent: number;
  commissionCents: number;
  montantNetRemplacantCents: number;
}

const COMMISSION_RATE_PERCENT = 1; // 1% post-lancement gratuit

export function calculateCommission(input: CommissionInput): CommissionResult {
  const { montantRetrocessionCents, isLaunchPeriod, isPro } = input;

  // Periode de lancement → 0%
  if (isLaunchPeriod) {
    return {
      commissionType: 'lancement',
      commissionRatePercent: 0,
      commissionCents: 0,
      montantNetRemplacantCents: montantRetrocessionCents,
    };
  }

  // Abonnement Pro → 0%
  if (isPro) {
    return {
      commissionType: 'pro',
      commissionRatePercent: 0,
      commissionCents: 0,
      montantNetRemplacantCents: montantRetrocessionCents,
    };
  }

  // Gratuit post-lancement → 1%
  const commissionCents = Math.round(montantRetrocessionCents * COMMISSION_RATE_PERCENT / 100);
  return {
    commissionType: 'gratuit',
    commissionRatePercent: COMMISSION_RATE_PERCENT,
    commissionCents,
    montantNetRemplacantCents: montantRetrocessionCents - commissionCents,
  };
}

// Calcul de la retrocession a partir du montant encaisse
export function calculateRetrocession(montantEncaisseCents: number, tauxRetrocession: number) {
  const montantRetrocessionCents = Math.round(montantEncaisseCents * tauxRetrocession / 100);
  const partTitulaireCents = montantEncaisseCents - montantRetrocessionCents;
  return { montantRetrocessionCents, partTitulaireCents };
}
