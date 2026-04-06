// Client Supabase navigateur pour le web — via l'adaptateur @jim/shared
// JAMAIS d'import direct de @supabase/supabase-js dans apps/
// Initialisation lazy pour eviter les erreurs lors du prerendering SSR
import { getSupabaseClient } from '@jim/shared/adapters/supabase/browser';

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required');
  }
  return getSupabaseClient(url, anonKey);
}
