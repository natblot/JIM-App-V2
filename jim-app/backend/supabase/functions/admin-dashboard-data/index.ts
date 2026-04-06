// Edge Function admin-dashboard-data — Epic 12, Story 12.1
// Agregation des metriques pour le dashboard admin web
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

  // Verifier admin
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') return json({ error: { code: 'FORBIDDEN', message: 'Acces refuse' } }, 403);

  const now = new Date();
  const h24 = new Date(now.getTime() - 24 * 3600000).toISOString();
  const j7 = new Date(now.getTime() - 7 * 24 * 3600000).toISOString();

  try {
    const [annonces, profiles, candidatures24h, candidatures7j, messages24h, signalements, alertes] = await Promise.all([
      supabaseAdmin.from('annonces').select('id, statut, source, hidden', { count: 'exact', head: false }),
      supabaseAdmin.from('profiles').select('id, rpps_verified, suspended, role', { count: 'exact', head: false }),
      supabaseAdmin.from('candidatures').select('id, statut', { count: 'exact' }).gte('created_at', h24),
      supabaseAdmin.from('candidatures').select('id, statut', { count: 'exact' }).gte('created_at', j7),
      supabaseAdmin.from('messages').select('id', { count: 'exact' }).gte('created_at', h24),
      supabaseAdmin.from('signalements').select('id, status, categorie', { count: 'exact' }).eq('status', 'en_attente'),
      supabaseAdmin.from('admin_alerts').select('id, type, priority, message, source, status, created_at').eq('status', 'active').order('created_at', { ascending: false }).limit(20),
    ]);

    const annoncesData = annonces.data ?? [];
    const profilesData = profiles.data ?? [];
    const cand24 = candidatures24h.data ?? [];
    const cand7 = candidatures7j.data ?? [];

    const metrics = {
      annonces: {
        total: annoncesData.length,
        actives: annoncesData.filter((a: Record<string, unknown>) => a.statut === 'active' && !a.hidden).length,
        natives: annoncesData.filter((a: Record<string, unknown>) => a.source === 'native').length,
        agregees: annoncesData.filter((a: Record<string, unknown>) => a.source !== 'native').length,
        pourvues: annoncesData.filter((a: Record<string, unknown>) => a.statut === 'pourvue').length,
        hidden: annoncesData.filter((a: Record<string, unknown>) => a.hidden).length,
      },
      inscriptions: {
        total: profilesData.length,
        rpps_verifies: profilesData.filter((p: Record<string, unknown>) => p.rpps_verified).length,
        suspendus: profilesData.filter((p: Record<string, unknown>) => p.suspended).length,
        titulaires: profilesData.filter((p: Record<string, unknown>) => p.role === 'titulaire').length,
        remplacants: profilesData.filter((p: Record<string, unknown>) => p.role === 'remplacant').length,
      },
      candidatures: {
        last_24h: cand24.length,
        last_7j: cand7.length,
        acceptees_24h: cand24.filter((c: Record<string, unknown>) => c.statut === 'acceptee').length,
        taux_conversion_7j: cand7.length > 0 ? Math.round(cand7.filter((c: Record<string, unknown>) => c.statut === 'acceptee').length / cand7.length * 100) : 0,
      },
      messages: { last_24h: messages24h.count ?? 0 },
      signalements_en_attente: signalements.count ?? 0,
      alertes_actives: alertes.data ?? [],
    };

    return json({ data: metrics });
  } catch (err: unknown) {
    return json({ error: { code: 'SYSTEM_ERROR', message: err instanceof Error ? err.message : 'Erreur interne' } }, 500);
  }
});
