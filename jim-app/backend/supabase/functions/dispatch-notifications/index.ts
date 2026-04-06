// Edge Function : dispatch-notifications
// Point d'entrée unique — délègue la logique à notification.service.ts
// Appelé soit par le trigger immédiat (body.notification_id), soit par pg_cron (body.batch)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { dispatchNotification, dispatchBatch } from '../_shared/notification.service.ts';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const body = await req.json() as { batch?: boolean; notification_id?: string };

  if (body.batch) {
    // Appelé par pg_cron toutes les 5 minutes — dispatch toutes les notifications pending matures
    await dispatchBatch(supabase);
  } else if (body.notification_id) {
    // Appelé par le trigger immédiat — dispatch une seule notification
    await dispatchNotification(supabase, body.notification_id);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
