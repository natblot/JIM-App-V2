import { createClient, type SupabaseClient } from '@supabase/supabase-js'; // eslint-disable-line no-restricted-imports
import type { Database } from '../../types/database';

// Re-export des types Supabase pour que les hooks n'importent JAMAIS directement @supabase/supabase-js
export type { SupabaseClient, User, Session } from '@supabase/supabase-js'; // eslint-disable-line no-restricted-imports

// Client Supabase typé pour le navigateur et React Native
// Utiliser UNIQUEMENT via @jim/shared/adapters — jamais d'import direct dans apps/
let _client: SupabaseClient<Database> | null = null;

export function getSupabaseClient(
  url: string,
  anonKey: string
): SupabaseClient<Database> {
  if (!_client) {
    _client = createClient<Database>(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _client;
}
