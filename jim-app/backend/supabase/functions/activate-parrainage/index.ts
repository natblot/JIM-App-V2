// Edge Function activate-parrainage — Epic 11, Story 11.3
// Deux operations :
//   1. GET/POST sans body : generer/recuperer le code parrainage
//   2. POST avec filleul_action : activer le parrainage quand le filleul complete sa premiere action
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
  const body = await req.json().catch(() => ({}));

  // Mode activation : le filleul complete sa premiere action
  if (body.filleul_action) {
    const { data: parrainage } = await supabaseAdmin
      .from('parrainages')
      .select('id, parrain_id, status')
      .eq('filleul_id', user.id)
      .eq('status', 'inscrit')
      .maybeSingle();

    if (!parrainage) return json({ data: { activated: false } });

    await supabaseAdmin.from('parrainages').update({
      status: 'actif', activated_at: new Date().toISOString(),
    }).eq('id', parrainage.id);

    // Activer le badge Ambassadeur sur le parrain
    await supabaseAdmin.from('profiles').update({ is_ambassadeur: true }).eq('user_id', parrainage.parrain_id);

    // Notifier le parrain
    await supabaseAdmin.from('notification_queue').insert({
      recipient_id: parrainage.parrain_id,
      event_type: 'PARRAINAGE_ACTIF',
      payload: { filleul_id: user.id },
      priority: 'normal',
    });

    return json({ data: { activated: true } });
  }

  // Mode generation : recuperer ou creer le code parrainage
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('parrainage_code')
    .eq('user_id', user.id)
    .single();

  if (profile?.parrainage_code) {
    return json({ data: { code: profile.parrainage_code } });
  }

  // Generer le code
  const { data: code } = await supabaseAdmin.rpc('generate_parrainage_code', { p_user_id: user.id });
  return json({ data: { code } });
});
