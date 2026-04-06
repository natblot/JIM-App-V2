// Edge Function create-subscription — Epic 9, Story 9.6
// Abonnement Pro (5,90 EUR/mois) via Stripe Billing — 0% commission
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createCustomerIfNeeded, createProSubscription, cancelProSubscription } from '../_shared/stripe/stripe.service.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  // Verifier que la periode de lancement est terminee (sinon Pro inutile)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('launch_period_active, email, is_pro')
    .eq('user_id', user.id)
    .single();

  if (!profile) return json({ error: { code: 'PROFILE_NOT_FOUND', message: 'Profil introuvable' } }, 404);
  if (profile.launch_period_active) {
    return json({ error: { code: 'LAUNCH_PERIOD_ACTIVE', message: 'Pendant la periode de lancement, les versements sont deja sans frais de gestion' } }, 422);
  }

  const body = await req.json().catch(() => ({}));

  // POST = souscrire, DELETE = annuler
  if (req.method === 'POST') {
    if (profile.is_pro) return json({ error: { code: 'ALREADY_PRO', message: 'Vous etes deja abonne Pro' } }, 409);

    const { payment_method_id } = body;
    if (!payment_method_id) return json({ error: { code: 'VALIDATION_ERROR', message: 'payment_method_id requis' } }, 422);

    try {
      const customerId = await createCustomerIfNeeded(user.id, profile.email);
      const { subscriptionId, periodStart, periodEnd } = await createProSubscription(customerId, payment_method_id);

      // Inserer l'abonnement en base
      await supabaseAdmin.from('abonnements_pro').insert({
        profile_id: user.id,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
      });

      // Activer is_pro sur le profil
      await supabaseAdmin
        .from('profiles')
        .update({ is_pro: true })
        .eq('user_id', user.id);

      return json({ data: { subscription_id: subscriptionId, status: 'active' } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur interne';
      return json({ error: { code: 'STRIPE_ERROR', message } }, 500);
    }
  }

  if (req.method === 'DELETE') {
    const { data: abo } = await supabaseAdmin
      .from('abonnements_pro')
      .select('stripe_subscription_id, status')
      .eq('profile_id', user.id)
      .single();

    if (!abo || abo.status !== 'active') {
      return json({ error: { code: 'NO_ACTIVE_SUBSCRIPTION', message: 'Aucun abonnement actif' } }, 404);
    }

    try {
      const cancelAtPeriodEnd = body.cancel_at_period_end !== false;
      await cancelProSubscription(abo.stripe_subscription_id, cancelAtPeriodEnd);

      await supabaseAdmin
        .from('abonnements_pro')
        .update({ cancel_at_period_end: cancelAtPeriodEnd })
        .eq('profile_id', user.id);

      return json({ data: { status: 'cancellation_scheduled', cancel_at_period_end: cancelAtPeriodEnd } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur interne';
      return json({ error: { code: 'STRIPE_ERROR', message } }, 500);
    }
  }

  return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST ou DELETE requis' } }, 405);
});
