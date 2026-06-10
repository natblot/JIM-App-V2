// Edge Function create-payment — Epic 9, Story 9.3
// Calcul retrocession + creation du paiement (brouillon → en_attente_validation)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { preparePayment } from '../_shared/stripe/stripe.service.ts';
import { createPaymentSchema } from '../_shared/payment.schema.deno.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const rawBody = await req.json().catch(() => ({}));
  const parsed = createPaymentSchema.safeParse(rawBody);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Paramètres invalides';
    return json({ error: { code: 'VALIDATION_ERROR', message } }, 422);
  }
  const { contrat_id, montant_encaisse_cents, source_montant } = parsed.data;

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  try {
    const { paiementData } = await preparePayment({
      contratId: contrat_id,
      montantEncaisseCents: montant_encaisse_cents,
      sourceMontant: source_montant ?? 'saisie_manuelle',
      userId: user.id,
    }, supabaseAdmin);

    // Inserer le paiement en statut en_attente_validation
    const { data: paiement, error: insertError } = await supabaseAdmin
      .from('paiements')
      .insert({
        ...paiementData,
        status: 'en_attente_validation',
      })
      .select('id, montant_retrocession_cents, montant_net_remplacant_cents, commission_jim_cents, commission_type, status')
      .single();

    if (insertError) {
      // Contrainte unique : un paiement existe deja pour ce contrat
      if (insertError.code === '23505') {
        return json({ error: { code: 'PAIEMENT_ALREADY_EXISTS', message: 'Un paiement existe deja pour ce contrat' } }, 409);
      }
      throw insertError;
    }

    return json({ data: paiement });
  } catch (err: unknown) {
    const code = err instanceof Error ? err.message : 'SYSTEM_ERROR';
    const httpStatus: Record<string, number> = {
      CONTRAT_NOT_FOUND: 404,
      CONTRAT_NOT_CONFIRMED: 409,
      NOT_TITULAIRE: 403,
      SOURCE_EQ_DESTINATION: 422,
      TITULAIRE_NO_STRIPE: 422,
      REMPLACANT_NO_STRIPE: 422,
      REMPLACANT_RCP_NOT_VERIFIED: 422,
      REMPLACANT_ONBOARDING_INCOMPLETE: 422,
    };
    const messages: Record<string, string> = {
      CONTRAT_NOT_FOUND: 'Contrat introuvable',
      CONTRAT_NOT_CONFIRMED: 'Le contrat doit etre confirme avant de creer un paiement',
      NOT_TITULAIRE: 'Seul le titulaire peut initier le versement',
      SOURCE_EQ_DESTINATION: 'Le titulaire ne peut pas s\'auto-verser',
      TITULAIRE_NO_STRIPE: 'Configurez votre compte de versement dans Parametres > Paiement',
      REMPLACANT_NO_STRIPE: 'Le remplacant n\'a pas encore configure la reception des paiements',
      REMPLACANT_RCP_NOT_VERIFIED: 'Le justificatif RCP du remplacant n\'est pas encore verifie',
      REMPLACANT_ONBOARDING_INCOMPLETE: 'L\'onboarding Stripe du remplacant n\'est pas termine',
    };
    return json({ error: { code, message: messages[code] ?? code } }, httpStatus[code] ?? 500);
  }
});
