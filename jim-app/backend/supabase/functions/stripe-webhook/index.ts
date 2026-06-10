// Edge Function stripe-webhook — Epic 9, Story 9.4
// Handler webhook Stripe avec verification de signature OBLIGATOIRE
// Idempotent : meme evenement traite 2x = meme resultat
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { verifyWebhookSignature, handleWebhookEvent } from '../_shared/stripe/stripe.webhook-handler.ts';

Deno.serve(async (req: Request) => {
  // Webhook Stripe = POST uniquement, pas de CORS (serveur-a-serveur)
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 401 });
  }

  const body = await req.text();

  // Verification de la signature — OBLIGATOIRE (jamais parser le JSON directement)
  // verifyWebhookSignature est asynchrone en Deno (SubtleCrypto)
  let event;
  try {
    event = await verifyWebhookSignature(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 401 });
  }

  // Client admin pour les operations en base
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Deduplication — Stripe peut rejouer jusqu'a 10x le meme evenement
  const { error: insertError } = await supabaseAdmin
    .from('stripe_events')
    .insert({ event_id: event.id, event_type: event.type });

  if (insertError) {
    // Conflict = evenement deja traite (PK violation sur event_id)
    if (insertError.code === '23505') {
      console.log(`Webhook ${event.id} already processed — skipping`);
      return Response.json({ received: true, action: 'already_processed' });
    }
    // Autre erreur DB : on laisse passer (mieux vaut traiter 2x que rater)
    console.error('stripe_events insert error:', insertError);
  }

  try {
    const result = await handleWebhookEvent(event, supabaseAdmin);
    console.log(`Webhook ${event.type}: ${result.action} (handled: ${result.handled})`);
    return Response.json({ received: true, ...result });
  } catch (err) {
    console.error(`Webhook ${event.type} error:`, err);
    // Retourner 200 meme en cas d'erreur pour eviter les retries Stripe infinis
    // L'erreur est loguee pour investigation
    return Response.json({ received: true, error: 'internal_error' }, { status: 200 });
  }
});
