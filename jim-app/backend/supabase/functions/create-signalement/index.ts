// Edge Function create-signalement — Epic 12, Story 12.2
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logAudit, extractRequestInfo } from '../_shared/audit.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const VALID_TYPES = ['profile', 'annonce', 'message', 'avis'];
const VALID_CATEGORIES = ['faux_profil', 'annonce_frauduleuse', 'comportement_inapproprie', 'contenu_offensant', 'autre'];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const body = await req.json().catch(() => ({}));
  const { contenu_type, contenu_id, categorie, description } = body;

  if (!contenu_type || !VALID_TYPES.includes(contenu_type)) return json({ error: { code: 'VALIDATION_ERROR', message: 'contenu_type invalide' } }, 422);
  if (!contenu_id) return json({ error: { code: 'VALIDATION_ERROR', message: 'contenu_id requis' } }, 422);
  if (!categorie || !VALID_CATEGORIES.includes(categorie)) return json({ error: { code: 'VALIDATION_ERROR', message: 'categorie invalide' } }, 422);

  try {
    const { data: signalement, error: insertErr } = await supabase
      .from('signalements')
      .insert({ reporter_id: user.id, contenu_type, contenu_id, categorie, description: description?.slice(0, 500) })
      .select('id, status')
      .single();

    if (insertErr) {
      if (insertErr.code === '23505') return json({ error: { code: 'ALREADY_REPORTED', message: 'Vous avez deja signale ce contenu' } }, 409);
      throw insertErr;
    }

    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { ipAddress, userAgent } = extractRequestInfo(req);
    await logAudit(supabaseAdmin, {
      userId: user.id, action: 'signalement.create', resourceType: contenu_type, resourceId: contenu_id,
      ipAddress, userAgent, details: { categorie },
    });

    return json({ data: { id: signalement.id, message: 'Merci pour votre signalement — on s\'en occupe' } });
  } catch (err: unknown) {
    return json({ error: { code: 'SYSTEM_ERROR', message: err instanceof Error ? err.message : 'Erreur interne' } }, 500);
  }
});
