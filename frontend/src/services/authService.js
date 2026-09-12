import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://kalpana-multispeciality-dental-hospital.onrender.com';

export const authService = {
  /**
   * Log in with Email and Password
   * Supports both Express Backend (with Bcrypt Hashed verification) and Supabase Auth.
   */
  async signIn(email, password) {
    let backendError = null;
    let authUser = null;
    let authToken = null;

    // 1. Authenticate with Supabase Auth so direct database queries (Appointments, Messages, Settings) are authorized
    if (isSupabaseConfigured) {
      try {
        const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (!sbError && sbData?.user) {
          authUser = sbData.user;
          authToken = sbData.session?.access_token;
        } else if (sbError) {
          console.warn('Supabase auth sign-in warning:', sbError.message);
        }
      } catch (sbErr) {
        console.warn('Supabase auth sign-in exception:', sbErr.message);
      }
    }

    // 2. Also authenticate with Express Backend Bcrypt verification endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result?.token) {
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', JSON.stringify(result.user));
        if (!authUser) {
          authUser = {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            user_metadata: {
              full_name: result.user.fullName,
              role: result.user.role,
            },
          };
          authToken = result.token;
        }
      } else if (response.status === 401) {
        backendError = result?.message || 'Invalid email or password credentials.';
      }
    } catch (backendErr) {
      console.info('Backend auth endpoint unavailable:', backendErr.message);
    }

    if (authUser) {
      return {
        user: authUser,
        token: authToken,
        authMethod: 'unified_auth',
      };
    }

    throw new Error(backendError || 'Authentication failed. Please verify your email and password.');
  },

  /**
   * Sign up new user with Bcrypt password hashing
   */
  async signUp(email, password, fullName, role = 'doctor') {
    // Attempt backend registration first (which hashes password with bcrypt)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        return data;
      }
    } catch (err) {
      console.warn('Backend signup error, falling back to Supabase:', err.message);
    }

    if (!isSupabaseConfigured) {
      throw new Error('Database is not configured.');
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
   * Log out current user (clears both backend tokens and Supabase session)
   */
  async signOut() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signout warning:', err.message);
    }
  },

  /**
   * Get current stored backend user if any
   */
  getBackendUser() {
    try {
      const stored = localStorage.getItem('admin_user');
      const token = localStorage.getItem('admin_token');
      if (stored && token) {
        const parsed = JSON.parse(stored);
        return {
          id: parsed.id,
          email: parsed.email,
          role: parsed.role,
          user_metadata: {
            full_name: parsed.fullName,
            role: parsed.role,
          },
        };
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  /**
   * Get current active session
   */
  async getSession() {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Failed to get Supabase session:', error);
        return null;
      }
      return data.session;
    } catch (err) {
      return null;
    }
  },

  /**
   * Get current logged-in user
   */
  async getCurrentUser() {
    // Check backend user first
    const backendUser = this.getBackendUser();
    if (backendUser) return backendUser;

    if (!isSupabaseConfigured) return null;
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
    } catch (err) {
      return null;
    }
  },

  /**
   * Get profile and role from 'profiles' or 'admin_users' table for a user
   */
  async getUserProfile(userId) {
    if (!userId) return null;

    if (isSupabaseConfigured) {
      try {
        // Try profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!error && data) return data;

        // Try admin_users table
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('id, full_name, email, role, is_active')
          .eq('id', userId)
          .maybeSingle();

        if (adminData) {
          return {
            user_id: adminData.id,
            full_name: adminData.full_name,
            email: adminData.email,
            role: adminData.role,
          };
        }
      } catch (err) {
        console.warn('Error fetching user profile:', err.message);
      }
    }

    return null;
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
