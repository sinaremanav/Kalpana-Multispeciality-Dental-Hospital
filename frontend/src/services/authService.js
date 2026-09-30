import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://kalpana-multispeciality-dental-hospital.onrender.com';

export const authService = {
  /**
   * Log in with Email and Password
   * Supports both Express Backend (with Bcrypt Hashed verification) and Supabase Auth.
   */
  /**
   * Log in with Email and Password
   * Prioritizes direct Supabase Auth for instant sub-second verification.
   * Background-syncs backend session tokens non-blockingly to avoid Render free-tier cold-start hangs.
   */
  async signIn(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    let authUser = null;
    let authToken = null;
    let authError = null;

    // Helper for backend login with strict timeout so Render cold starts never hang the browser
    const attemptBackendLogin = async (timeoutMs = 6000) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const result = await response.json().catch(() => null);

        if (response.ok && result?.success && result?.token) {
          localStorage.setItem('admin_token', result.token);
          localStorage.setItem('admin_user', JSON.stringify(result.user));
          return {
            success: true,
            user: {
              id: result.user.id,
              email: result.user.email,
              role: result.user.role,
              fullName: result.user.fullName,
              user_metadata: {
                full_name: result.user.fullName,
                role: result.user.role,
              },
            },
            token: result.token,
            authMethod: 'backend_bcrypt',
          };
        }

        return {
          success: false,
          message: result?.message || 'Invalid email or password credentials.',
        };
      } catch (err) {
        return {
          success: false,
          message:
            err.name === 'AbortError'
              ? 'Backend server took too long to respond. Please try again.'
              : err.message,
        };
      }
    };

    // 1. Direct Supabase Auth (Instant: ~300-500ms)
    if (isSupabaseConfigured) {
      try {
        const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (!sbError && sbData?.user) {
          authUser = sbData.user;
          authToken = sbData.session?.access_token;

          // Asynchronously sync backend token in background without blocking login
          attemptBackendLogin(3500).catch(() => {});

          return {
            user: authUser,
            token: authToken,
            authMethod: 'supabase',
          };
        } else if (sbError) {
          authError = sbError.message;
        }
      } catch (sbErr) {
        console.warn('Supabase auth sign-in exception:', sbErr.message);
        authError = sbErr.message;
      }
    }

    // 2. Fallback to Express backend if Supabase Auth was unconfigured or account only exists in custom admin_users
    const backendResult = await attemptBackendLogin(7000);
    if (backendResult?.success && backendResult?.user) {
      return {
        user: backendResult.user,
        token: backendResult.token,
        authMethod: 'backend_bcrypt',
      };
    }

    throw new Error(
      backendResult?.message || authError || 'Authentication failed. Please verify your email and password.'
    );
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

  // Profile cache to prevent redundant DB requests
  _profileCache: new Map(),

  /**
   * Get profile and role from 'admin_users' or 'profiles' table for a user
   */
  async getUserProfile(userId, email = null) {
    if (!userId && !email) return null;
    const cacheKey = `${userId || ''}_${email || ''}`;
    if (this._profileCache.has(cacheKey)) {
      return this._profileCache.get(cacheKey);
    }

    if (isSupabaseConfigured) {
      try {
        // Query admin_users table first (matches clinic doctors and admins)
        let query = supabase.from('admin_users').select('id, full_name, email, role, is_active');
        if (email) {
          query = query.ilike('email', email.trim());
        } else {
          query = query.eq('id', userId);
        }

        const { data: adminData, error: adminErr } = await query.maybeSingle();
        if (!adminErr && adminData) {
          const profile = {
            user_id: adminData.id,
            full_name: adminData.full_name,
            email: adminData.email,
            role: adminData.role,
          };
          this._profileCache.set(cacheKey, profile);
          return profile;
        }

        // Secondary check: profiles table
        if (userId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (!error && data) {
            this._profileCache.set(cacheKey, data);
            return data;
          }
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
