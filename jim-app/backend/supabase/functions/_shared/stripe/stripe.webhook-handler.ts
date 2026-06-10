// Webhook handler Stripe — Epic 9
// Traitement idempotent des evenements Stripe
// Signature TOUJOURS verifiee avec constructEvent()

import Stripe from 'https://esm.sh/stripe@14?target=deno';

// Type minimal du client Supabase pour eviter `any`
interface SupabaseQueryBuilder {
  select: (cols: string, opts?: Record<string, unknown>) => SupabaseQueryBuilder;
  insert: (data: Record<string, unknown> | Record<string, unknown>[]) => SupabaseQueryBuilder;
  update: (data: Record<string, unknown>) => SupabaseQueryBuilder;
  eq: (col: string, val: unknown) => SupabaseQueryBuilder;
  neq: (col: string, val: unknown) => SupabaseQueryBuilder;
  in: (col: string, vals: unknown[]) => SupabaseQueryBuilder;
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
  return new Stripe(key, {
    apiVersion: '2024-12-18.acacia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

// Crypto provider base SubtleCrypto (Web Crypto) — obligatoire en Deno car
// stripe.webhooks.constructEvent() synchrone utilise node:crypto indisponible.
// Sans ca, toute verification renvoie "No signatures found matching the expected signature".
const cryptoProvider = Stripe.createSubtleCryptoProvider();

export async function verifyWebhookSignature(
  body: string,
  signature: string,
): Promise<Stripe.Event> {
  const stripe = getStripe();
  const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!endpointSecret) throw new Error('STRIPE_WEBHOOK_SECRET manquante');
  return await stripe.webhooks.constructEventAsync(
    body,
    signature,
    endpointSecret,
    undefined,
    cryptoProvider,
  );
}

// Traiter un evenement webhook — retourne true si traite, false si deja vu
export async function handleWebhookEvent(
  event: Stripe.Event,
  supabaseAdmin: SupabaseAdminClient,
): Promise<{ handled: boolean; action: string }> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabaseAdmin);

    case 'payment_intent.payment_failed':
      return await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabaseAdmin);

    case 'account.updated':
      return await handleAccountUpdated(event.data.object as Stripe.Account, supabaseAdmin);

    case 'invoice.payment_succeeded':
      return await handleInvoiceSucceeded(event.data.object as Stripe.Invoice, supabaseAdmin);

    case 'invoice.payment_failed':
      return await handleInvoiceFailed(event.data.object as Stripe.Invoice, supabaseAdmin);

    case 'customer.subscription.deleted':
      return await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabaseAdmin);

    default:
      return { handled: false, action: `ignored_${event.type}` };
  }
}

// --- Handlers individuels ---

async function handlePaymentSucceeded(
  pi: Stripe.PaymentIntent,
  supabaseAdmin: SupabaseAdminClient,
): Promise<{ handled: boolean; action: string }> {
  const paiementId = pi.metadata?.paiement_id;
  if (!paiementId) return { handled: false, action: 'no_paiement_id' };

  // Idempotence : verifier que le paiement n'est pas deja confirme
  const { data: existing } = await supabaseAdmin
    .from('paiements')
    .select('id, status, stripe_payment_intent_id')
    .eq('id', paiementId)
    .single();

  if (!existing) return { handled: false, action: 'paiement_not_found' };
  if (existing.status === 'confirme') return { handled: true, action: 'already_confirmed' };

  await supabaseAdmin
    .from('paiements')
    .update({
      status: 'confirme',
      stripe_payment_intent_id: pi.id,
      stripe_charge_id: pi.latest_charge as string ?? null,
    })
    .eq('id', paiementId);

  return { handled: true, action: 'paiement_confirmed' };
}

async function handlePaymentFailed(
  pi: Stripe.PaymentIntent,
  supabaseAdmin: SupabaseAdminClient,
): Promise<{ handled: boolean; action: string }> {
  const paiementId = pi.metadata?.paiement_id;
  if (!paiementId) return { handled: false, action: 'no_paiement_id' };

  const { data: existing } = await supabaseAdmin
    .from('paiements')
    .select('id, status')
    .eq('id', paiementId)
    .single();

  if (!existing) return { handled: false, action: 'paiement_not_found' };
  if (existing.status === 'echoue') return { handled: true, action: 'already_failed' };

  await supabaseAdmin
    .from('paiements')
    .update({
      status: 'echoue',
      stripe_payment_intent_id: pi.id,
    })
    .eq('id', paiementId);

  return { handled: true, action: 'paiement_failed' };
}

async function handleAccountUpdated(
  account: Stripe.Account,
  supabaseAdmin: SupabaseAdminClient,
): Promise<{ handled: boolean; action: string }> {
  const jimUserId = account.metadata?.jim_user_id;
  if (!jimUserId) return { handled: false, action: 'no_jim_user_id' };

  let onboardingStatus: string;
  if (account.charges_enabled && account.payouts_enabled) {
    onboardingStatus = 'verified';
  } else if (account.details_submitted) {
    onboardingStatus = 'in_progress';
  } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
    onboardingStatus = 'action_required';
  } else {
    onboardingStatus = 'in_progress';
  }

  await supabaseAdmin
    .from('profiles')
    .update({ stripe_onboarding_status: onboardingStatus })
    .eq('user_id', jimUserId);

  return { handled: true, action: `account_${onboardingStatus}` };
}

async function handleInvoiceSucceeded(
  invoice: Stripe.Invoice,
  supabaseAdmin: SupabaseAdminClient,
): Promise<{ handled: boolean; action: string }> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return { handled: false, action: 'no_subscription' };

  // Mettre a jour la periode de l'abonnement
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await supabaseAdmin
    .from('abonnements_pro')
    .update({
      status: 'active',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  return { handled: true, action: 'subscription_renewed' };
}

async function handleInvoiceFailed(
  invoice: Stripe.Invoice,
  supabaseAdmin: SupabaseAdminClient,
): Promise<{ handled: boolean; action: string }> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return { handled: false, action: 'no_subscription' };

  await supabaseAdmin
    .from('abonnements_pro')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  // Mettre a jour is_pro = false sur le profil
  const { data: abo } = await supabaseAdmin
    .from('abonnements_pro')
    .select('profile_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (abo) {
    await supabaseAdmin
      .from('profiles')
      .update({ is_pro: false })
      .eq('user_id', abo.profile_id);
  }

  return { handled: true, action: 'subscription_past_due' };
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabaseAdmin: SupabaseAdminClient,
): Promise<{ handled: boolean; action: string }> {
  await supabaseAdmin
    .from('abonnements_pro')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id);

  // Mettre a jour is_pro = false
  const { data: abo } = await supabaseAdmin
    .from('abonnements_pro')
    .select('profile_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (abo) {
    await supabaseAdmin
      .from('profiles')
      .update({ is_pro: false })
      .eq('user_id', abo.profile_id);
  }

  return { handled: true, action: 'subscription_cancelled' };
}
