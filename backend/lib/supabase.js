import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_KEY &&
  !SUPABASE_KEY.includes('your-') &&
  !SUPABASE_KEY.includes('dummy')
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

if (isSupabaseConfigured) {
  console.log(`✅ [Supabase Backend] Connected to Supabase database (${SUPABASE_URL})`);
} else {
  console.log('ℹ️ [Supabase Backend] Supabase keys not set. Running with built-in data store.');
}

export default supabase;
