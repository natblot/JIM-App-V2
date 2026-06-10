// Edge Function stripe-onboarding — Epic 9, Stories 9.1 + 9.2
// Cree un Connected Account Express et retourne l'Account Link URL
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createConnectedAccount, createAccountLink, getAccountStatus } from '../_shared/stripe/stripe.service.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

// Hostnames exacts autorises pour les redirections Stripe
const ALLOWED_HOSTNAMES = new Set(['jim.app']);
// Domaines dont les sous-domaines sont autorises (*.jim.app)
const ALLOWED_PARENT_DOMAINS = ['jim.app'];
// Pour autoriser un preview Vercel specifique, ajouter son hostname exact dans ALLOWED_HOSTNAMES
// ex: ALLOWED_HOSTNAMES.add('jim-app-git-main-monequipe.vercel.app')

function isAllowedRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Rejeter toute URL avec userinfo (bypass potentiel)
    if (parsed.username || parsed.password) return false;
    // Deep link mobile
    if (parsed.protocol === 'jim:') return true;
    // HTTPS uniquement
    if (parsed.protocol !== 'https:') return false;
    // Hostname exact
    if (ALLOWED_HOSTNAMES.has(parsed.hostname)) return true;
    // Sous-domaines autorises — comparaison sur hostname parse uniquement
    return ALLOWED_PARENT_DOMAINS.some(domain => parsed.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  try {
    const body = await req.json().catch(() => ({}));
    const { refresh_url, return_url } = body;
    if (!refresh_url || !return_url) {
      return json({ error: { code: 'VALIDATION_ERROR', message: 'refresh_url et return_url requis' } }, 422);
    }
    if (!isAllowedRedirectUrl(refresh_url) || !isAllowedRedirectUrl(return_url)) {
      return json({ error: { code: 'VALIDATION_ERROR', message: 'URL de redirection invalide' } }, 422);
    }

    // Recuperer le profil
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_account_id, stripe_onboarding_status, email, role, rcp_verified')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) return json({ error: { code: 'PROFILE_NOT_FOUND', message: 'Profil introuvable' } }, 404);

    // Si le remplacant n'a pas son RCP verifie, bloquer l'onboarding
    if (profile.role === 'remplacant' && !profile.rcp_verified) {
      return json({ error: { code: 'RCP_REQUIRED', message: 'Un justificatif d\'assurance RCP est necessaire pour recevoir les paiements' } }, 422);
    }

    let accountId = profile.stripe_account_id;

    // Si pas encore de compte Stripe → creer
    if (!accountId) {
      const result = await createConnectedAccount(user.id, profile.email);
      accountId = result.accountId;

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_account_id: accountId, stripe_onboarding_status: 'in_progress' })
        .eq('user_id', user.id);
    }

    // Si deja verifie, retourner le statut
    if (profile.stripe_onboarding_status === 'verified') {
      const status = await getAccountStatus(accountId);
      return json({ data: { status: 'verified', charges_enabled: status.chargesEnabled } });
    }

    // Generer l'Account Link
    const url = await createAccountLink(accountId, refresh_url, return_url);
    return json({ data: { onboarding_url: url, account_id: accountId } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return json({ error: { code: 'STRIPE_ERROR', message } }, 500);
  }
});
