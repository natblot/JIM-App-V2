// Edge Function : re-vérification RPPS batch quotidienne
// Appelée par pg_cron : "0 3 * * *"
// Traite les profils : pending, api_down, failed (RPPS connu) + caches expirés

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { createAnnuaireSanteClient } from '../_shared/annuaire-sante.ts';
import { verifyRppsForUser } from '../_shared/rpps-service.ts';

Deno.serve(async (req: Request): Promise<Response> => {
  // Sécurité : seul Supabase Cron peut appeler cette fonction
  // Vérification via le header Authorization avec le service role key
  const authHeader = req.headers.get('Authorization');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Récupérer les profils à re-vérifier (max 50 par batch pour éviter timeout)
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('id, user_id, first_name, last_name, rpps_number, rpps_verification_status')
    .not('rpps_number', 'is', null)
    .in('rpps_verification_status', ['pending', 'api_down', 'failed'])
    .limit(50);

  if (error || !profiles) {
    console.error('[reverify-rpps-batch] Failed to fetch profiles:', error);
    return new Response(JSON.stringify({ error: 'DB error' }), { status: 500 });
  }

  console.log(`[reverify-rpps-batch] Processing ${profiles.length} profiles`);

  const annuaireClient = createAnnuaireSanteClient();
  const results = { verified: 0, still_pending: 0, errors: 0 };

  for (const profile of profiles) {
    if (!profile.rpps_number) continue;

    try {
      const result = await verifyRppsForUser(annuaireClient, {
        rppsNumber: profile.rpps_number,
        userFirstName: profile.first_name,
        userLastName: profile.last_name,
      });

      if (result.success) {
        // RPPS activé ! Mettre à jour le profil + créer notification push
        const cacheExpiry = new Date();
        cacheExpiry.setMonth(cacheExpiry.getMonth() + 6);

        await supabaseAdmin
          .from('profiles')
          .update({
            rpps_verified: true,
            rpps_verified_at: new Date().toISOString(),
            rpps_cache_expires_at: cacheExpiry.toISOString(),
            rpps_verification_status: 'verified',
            rpps_last_attempt_at: new Date().toISOString(),
          })
          .eq('id', profile.id);

        // Notifier l'utilisateur que son RPPS est activé (payload générique NFR18)
        await supabaseAdmin
          .from('notification_queue')
          .insert({
            user_id: profile.user_id,
            type: 'rpps_verified',
            payload: { type: 'rpps_verified' }, // Aucune donnée personnelle dans le payload push
            channel: 'both', // push + email
          });

        results.verified++;
        console.log(`[reverify-rpps-batch] RPPS verified for profile ${profile.id}`);
      } else if (result.code === 'RPPS_API_DOWN') {
        // API down — on réessaie demain
        await supabaseAdmin
          .from('profiles')
          .update({
            rpps_verification_status: 'api_down',
            rpps_last_attempt_at: new Date().toISOString(),
          })
          .eq('id', profile.id);
        results.still_pending++;
      } else {
        // Toujours en attente (RPPS pas encore enregistré)
        await supabaseAdmin
          .from('profiles')
          .update({ rpps_last_attempt_at: new Date().toISOString() })
          .eq('id', profile.id);
        results.still_pending++;
      }
    } catch (err) {
      console.error(`[reverify-rpps-batch] Error for profile ${profile.id}:`, err);
      results.errors++;
    }
  }

  console.log('[reverify-rpps-batch] Done:', results);
  return new Response(JSON.stringify({ data: results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
