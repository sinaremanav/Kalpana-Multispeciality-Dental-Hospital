import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const authService = {
  /**
   * Log in with Email and Password
   */
  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign up new user (optional for admin user creation)
   */
  async signUp(email, password, fullName, role = 'doctor') {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Log out current user
   */
  async signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current active session
   */
  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Failed to get Supabase session:', error);
      return null;
    }
    return data.session;
  },

  /**
   * Get current logged-in user
   */
  async getCurrentUser() {
    if (!isSupabaseConfigured) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  },

  /**
   * Get profile and role from 'profiles' table for a user
   */
  async getUserProfile(userId) {
    if (!isSupabaseConfigured || !userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching user profile:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Update profile (e.g. name)
   */
  async updateProfile(userId, profileData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.fullName || profileData.full_name,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;
