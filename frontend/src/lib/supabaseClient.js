import { createClient } from '@supabase/supabase-js';

// Live Supabase project credentials for Kalpana Dental Clinic
const DEFAULT_SUPABASE_URL = 'https://wbcifzwxlboepvjumori.supabase.co';
const DEFAULT_SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiY2lmend4bGJvZXB2anVtb3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MjA5NzcsImV4cCI6MjEwMzI5Njk3N30.NMssTC-MqXLch3E6_eo4lhTimztdMCk6kaQAkX0kA38';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_KEY;

// Create Supabase client instance
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
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
