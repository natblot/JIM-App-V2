// Edge Function aggregate-annonces — handler HTTP minimaliste (≤ 40 lignes)
// Appelée par pg_cron toutes les 6h et par le script batch
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { runAggregation } from '../_shared/aggregation/orchestrator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Vérification service_role (pg_cron ou admin)
    const authHeader = req.headers.get('Authorization') ?? '';
    const isServiceRole = authHeader.includes(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '___');

    if (!isServiceRole) {
      return Response.json({ error: { code: 'AUTH_REQUIRED', message: 'Service role requis' } }, { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const results = await runAggregation(supabase);
    const summary = results.reduce((acc, r) => ({
      total_inserted: acc.total_inserted + r.inserted,
      total_expired: acc.total_expired + r.expired,
      sources_ok: acc.sources_ok + (r.status !== 'failure' ? 1 : 0),
    }), { total_inserted: 0, total_expired: 0, sources_ok: 0 });

    return Response.json({ data: { results, summary } }, { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return Response.json({ error: { code: 'SYSTEM_ERROR', message } }, { status: 500, headers: corsHeaders });
  }
});
