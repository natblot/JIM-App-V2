// Edge Function create-support-ticket — Epic 12, Story 12.5
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

  const body = await req.json().catch(() => ({}));
  const { categorie, sujet, description, app_version, device_model, os_version, last_screen, screenshot_url } = body;

  if (!categorie || !['bug', 'question', 'suggestion', 'partenariat'].includes(categorie)) {
    return json({ error: { code: 'VALIDATION_ERROR', message: 'categorie invalide' } }, 422);
  }
  if (!sujet || sujet.length > 200) return json({ error: { code: 'VALIDATION_ERROR', message: 'sujet requis (max 200 car.)' } }, 422);
  if (!description || description.length > 2000) return json({ error: { code: 'VALIDATION_ERROR', message: 'description requise (max 2000 car.)' } }, 422);

  try {
    const { data: ticket, error: insertErr } = await supabase
      .from('support_tickets')
      .insert({
        profile_id: user.id, categorie, sujet: sujet.slice(0, 200),
        description: description.slice(0, 2000),
        app_version, device_model, os_version, last_screen, screenshot_url,
      })
      .select('id, status')
      .single();

    if (insertErr) throw insertErr;

    return json({ data: { id: ticket.id, message: 'On vous repond sous 48h' } });
  } catch (err: unknown) {
    return json({ error: { code: 'SYSTEM_ERROR', message: err instanceof Error ? err.message : 'Erreur interne' } }, 500);
  }
});
