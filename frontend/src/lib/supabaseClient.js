import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wbcifzwxlboepvjumori.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    '⚠️ [Supabase Warning] VITE_SUPABASE_PUBLISHABLE_KEY is not set in your .env file.\n' +
    'Please add VITE_SUPABASE_PUBLISHABLE_KEY to your frontend .env file to enable live database and auth features.\n' +
    'The app will use local fallback data in the meantime.'
  );
}

// Create Supabase client instance (with dummy fallback string if empty to avoid SDK init throw)
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_offline_preview',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const isSupabaseConfigured = Boolean(
  SUPABASE_PUBLISHABLE_KEY &&
  SUPABASE_PUBLISHABLE_KEY !== 'your_supabase_anon_public_key_here' &&
  !SUPABASE_PUBLISHABLE_KEY.includes('dummy')
);

export default supabase;
