import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase Admin Client.
 * Uses SUPABASE_SERVICE_ROLE_KEY to interact with Supabase database bypassing RLS on server.
 * This key is NEVER exposed to the frontend or browser.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Server configuration error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
