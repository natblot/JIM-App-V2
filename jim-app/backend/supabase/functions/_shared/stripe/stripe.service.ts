// Service Stripe Connect — Epic 9
// Logique metier paiement portable — utilisee par les Edge Functions
// Clés sandbox UNIQUEMENT (sk_test_*) — production BLOQUEE jusqu'a HDS

import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { calculateCommission, calculateRetrocession } from './commission.calculator.ts';
import type { CreatePaymentParams, PaiementRow } from './stripe.types.ts';

// Type minimal du client Supabase pour eviter `any` (pas de types generes disponibles dans les Edge Functions)
interface SupabaseQueryBuilder {
  select: (cols: string, opts?: Record<string, unknown>) => SupabaseQueryBuilder;
  insert: (data: Record<string, unknown> | Record<string, unknown>[]) => SupabaseQueryBuilder;
  update: (data: Record<string, unknown>) => SupabaseQueryBuilder;
  upsert: (data: Record<string, unknown>, opts?: Record<string, unknown>) => SupabaseQueryBuilder;
  eq: (col: string, val: unknown) => SupabaseQueryBuilder;
  single: () => Promise<{ data: Record<string, unknown> | null; error: { message: string; code?: string } | null }>;
}

interface SupabaseAdminClient {
  from: (table: string) => SupabaseQueryBuilder;
}

function getStripe(): Stripe {
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) throw new Error('STRIPE_SECRET_KEY manquante');
  if (!key.startsWith('sk_test_')) {
    throw new Error('SECURITE: Seules les cles test sont autorisees avant HDS');
  }
  return new Stripe(key, { apiVersion: '2024-12-18.acacia' });
}

// --- Onboarding ---

export async function createConnectedAccount(userId: string, email: string): Promise<{ accountId: string }> {
  const stripe = getStripe();
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'FR',
    email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: { jim_user_id: userId },
  });
  return { accountId: account.id };
}

export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string): Promise<string> {
  const stripe = getStripe();
  const link = await stripe.accountLinks.create({
    account: accountId,
    type: 'account_onboarding',
    refresh_url: refreshUrl,
    return_url: returnUrl,
  });
  return link.url;
}

export async function getAccountStatus(accountId: string): Promise<{
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}> {
  const stripe = getStripe();
  const account = await stripe.accounts.retrieve(accountId);
  return {
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
    detailsSubmitted: account.details_submitted ?? false,
  };
}

// --- Paiement ---

export interface CreatePaymentResult {
  paiementData: Omit<PaiementRow, 'id' | 'stripe_payment_intent_id' | 'status'>;
}

export async function preparePayment(
  params: CreatePaymentParams,
  supabaseAdmin: SupabaseAdminClient,
): Promise<CreatePaymentResult> {
  // 1. Recuperer le contrat
  const { data: contrat, error: contratError } = await supabaseAdmin
    .from('contrats')
    .select('id, annonce_id, titulaire_id, remplacant_id, statut, donnees')
    .eq('id', params.contratId)
    .single();

  if (contratError || !contrat) throw new Error('CONTRAT_NOT_FOUND');
  if (contrat.statut !== 'confirme') throw new Error('CONTRAT_NOT_CONFIRMED');
  if (contrat.titulaire_id !== params.userId) throw new Error('NOT_TITULAIRE');
  if (contrat.titulaire_id === contrat.remplacant_id) throw new Error('SOURCE_EQ_DESTINATION');

  // 2. Recuperer le taux de retrocession depuis le contrat
  const tauxRetrocession: number = contrat.donnees?.taux_retrocession ?? 80;

  // 3. Calculer la retrocession
  const { montantRetrocessionCents, partTitulaireCents } = calculateRetrocession(
    params.montantEncaisseCents,
    tauxRetrocession,
  );

  // 4. Verifier le profil titulaire (launch_period, is_pro)
  const { data: profileTitulaire } = await supabaseAdmin
    .from('profiles')
    .select('launch_period_active, is_pro, stripe_account_id')
    .eq('user_id', params.userId)
    .single();

  if (!profileTitulaire?.stripe_account_id) throw new Error('TITULAIRE_NO_STRIPE');

  // 5. Verifier le profil remplacant
  const { data: profileRemplacant } = await supabaseAdmin
    .from('profiles')
    .select('stripe_account_id, rcp_verified, stripe_onboarding_status')
    .eq('user_id', contrat.remplacant_id)
    .single();

  if (!profileRemplacant?.stripe_account_id) throw new Error('REMPLACANT_NO_STRIPE');
  if (!profileRemplacant.rcp_verified) throw new Error('REMPLACANT_RCP_NOT_VERIFIED');
  if (profileRemplacant.stripe_onboarding_status !== 'verified') throw new Error('REMPLACANT_ONBOARDING_INCOMPLETE');

  // 6. Calculer la commission
  const commission = calculateCommission({
    montantRetrocessionCents,
    isLaunchPeriod: profileTitulaire.launch_period_active ?? true,
    isPro: profileTitulaire.is_pro ?? false,
  });

  return {
    paiementData: {
      contrat_id: contrat.id,
      annonce_id: contrat.annonce_id,
      titulaire_id: contrat.titulaire_id,
      remplacant_id: contrat.remplacant_id,
      montant_encaisse_cents: params.montantEncaisseCents,
      taux_retrocession: tauxRetrocession,
      montant_retrocession_cents: montantRetrocessionCents,
      part_titulaire_cents: partTitulaireCents,
      commission_jim_cents: commission.commissionCents,
      montant_net_remplacant_cents: commission.montantNetRemplacantCents,
      source_montant: params.sourceMontant,
      stripe_transfer_id: null,
      stripe_charge_id: null,
      commission_type: commission.commissionType,
    },
  };
}

// Creer le PaymentIntent Stripe et confirmer le versement
export async function executePayment(
  paiement: PaiementRow,
  paymentMethodId: string,
): Promise<{ paymentIntentId: string }> {
  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: paiement.montant_retrocession_cents,
    currency: 'eur',
    payment_method: paymentMethodId,
    transfer_data: {
      destination: '', // sera rempli par l'appelant avec le stripe_account_id du remplacant
    },
    application_fee_amount: paiement.commission_jim_cents,
    confirm: true,
    metadata: {
      paiement_id: paiement.id,
      contrat_id: paiement.contrat_id,
    },
  }, {
    idempotencyKey: `paiement_${paiement.id}`,
  });

  return { paymentIntentId: paymentIntent.id };
}

// --- Abonnement Pro ---

const PRO_PRICE_ID = Deno.env.get('STRIPE_PRO_PRICE_ID') ?? '';

export async function createCustomerIfNeeded(userId: string, email: string): Promise<string> {
  const stripe = getStripe();
  // Chercher un customer existant
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;

  const customer = await stripe.customers.create({
    email,
    metadata: { jim_user_id: userId },
  });
  return customer.id;
}

export async function createProSubscription(
  customerId: string,
  paymentMethodId: string,
): Promise<{ subscriptionId: string; periodStart: string; periodEnd: string }> {
  const stripe = getStripe();

  // Attacher le payment method au customer
  await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: PRO_PRICE_ID }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  return {
    subscriptionId: subscription.id,
    periodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    periodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
  };
}

export async function cancelProSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean): Promise<void> {
  const stripe = getStripe();
  if (cancelAtPeriodEnd) {
    await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  } else {
    await stripe.subscriptions.cancel(subscriptionId);
  }
}
