// Edge Function generate-contrat — Epic 8, Story 8.1
// Génère un contrat à partir d'une candidature acceptée — délègue à _shared/contrat.service.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateContrat } from '../_shared/contrat.service.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  // Authentification obligatoire — Bearer token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifié' } }, 401);

  const body = await req.json().catch(() => ({}));
  const { candidature_id } = body;
  if (!candidature_id || typeof candidature_id !== 'string') return json({ error: { code: 'VALIDATION_ERROR', message: 'candidature_id requis' } }, 422);

  // Client admin (service_role) pour insérer dans contrats via RLS service_role
  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  try {
    const contrat = await generateContrat(candidature_id, supabaseAdmin);

    // Vérifier que l'appelant est une partie du contrat (titulaire OU remplaçant)
    if (user.id !== contrat.titulaire_id && user.id !== contrat.remplacant_id) {
      return json({ error: { code: 'CONTRAT_FORBIDDEN', message: 'Accès refusé à ce contrat' } }, 403);
    }

    return json({ data: { contrat_id: contrat.id } });
  } catch (err: unknown) {
    const code = err instanceof Error ? err.message : 'SYSTEM_ERROR';
    const httpStatus: Record<string, number> = { CANDIDATURE_NOT_FOUND: 404, CANDIDATURE_NOT_ACCEPTED: 409 };
    const messages: Record<string, string> = {
      CANDIDATURE_NOT_FOUND: 'Candidature introuvable',
      CANDIDATURE_NOT_ACCEPTED: 'La candidature doit être acceptée pour générer un contrat',
    };
    return json({ error: { code, message: messages[code] ?? code } }, httpStatus[code] ?? 500);
  }
});
