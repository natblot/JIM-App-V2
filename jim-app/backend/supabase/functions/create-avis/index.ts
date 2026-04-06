// Edge Function create-avis — Epic 11, Story 11.1
// Notation mutuelle post-remplacement : etoiles (1-5) + tags
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logAudit, extractRequestInfo } from '../_shared/audit.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const VALID_TAGS = ['ponctuel', 'professionnel', 'recommande', 'bonne_communication'];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST requis' } }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: { code: 'AUTH_REQUIRED', message: 'Token requis' } }, 401);

  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: { code: 'AUTH_INVALID', message: 'Utilisateur non authentifie' } }, 401);

  const body = await req.json().catch(() => ({}));
  const { contrat_id, note, tags } = body;

  // Validation
  if (!contrat_id) return json({ error: { code: 'VALIDATION_ERROR', message: 'contrat_id requis' } }, 422);
  if (!note || typeof note !== 'number' || note < 1 || note > 5) return json({ error: { code: 'VALIDATION_ERROR', message: 'Note entre 1 et 5 requise' } }, 422);
  if (tags && !Array.isArray(tags)) return json({ error: { code: 'VALIDATION_ERROR', message: 'Tags doit etre un tableau' } }, 422);

  const validTags = (tags ?? []).filter((t: string) => VALID_TAGS.includes(t));

  const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  try {
    // Verifier le contrat : confirme + l'user est une partie
    const { data: contrat, error: contratErr } = await supabaseAdmin
      .from('contrats')
      .select('id, titulaire_id, remplacant_id, statut')
      .eq('id', contrat_id)
      .single();

    if (contratErr || !contrat) return json({ error: { code: 'CONTRAT_NOT_FOUND', message: 'Contrat introuvable' } }, 404);
    if (contrat.statut !== 'confirme') return json({ error: { code: 'CONTRAT_NOT_CONFIRMED', message: 'Le contrat doit etre confirme' } }, 409);

    const isTitulaire = contrat.titulaire_id === user.id;
    const isRemplacant = contrat.remplacant_id === user.id;
    if (!isTitulaire && !isRemplacant) return json({ error: { code: 'NOT_PARTY', message: 'Vous n\'etes pas partie de ce contrat' } }, 403);

    const destinataireId = isTitulaire ? contrat.remplacant_id : contrat.titulaire_id;

    // Inserer l'avis (RLS + contrainte UNIQUE gerent les doublons et l'auto-notation)
    const { data: avis, error: insertErr } = await supabase
      .from('avis')
      .insert({
        auteur_id: user.id,
        destinataire_id: destinataireId,
        contrat_id,
        note,
        tags: validTags,
      })
      .select('id, note, tags, anonyme_until, created_at')
      .single();

    if (insertErr) {
      if (insertErr.code === '23505') return json({ error: { code: 'ALREADY_RATED', message: 'Vous avez deja note ce remplacement' } }, 409);
      throw insertErr;
    }

    // Audit log
    const { ipAddress, userAgent } = extractRequestInfo(req);
    await logAudit(supabaseAdmin, {
      userId: user.id, action: 'avis.create', resourceType: 'avis', resourceId: avis.id,
      ipAddress, userAgent, details: { contrat_id, note },
    });

    return json({ data: avis });
  } catch (err: unknown) {
    return json({ error: { code: 'SYSTEM_ERROR', message: err instanceof Error ? err.message : 'Erreur interne' } }, 500);
  }
});
