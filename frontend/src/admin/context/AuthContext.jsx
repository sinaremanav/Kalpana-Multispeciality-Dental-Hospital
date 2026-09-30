import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile corresponding to the user id
  const fetchProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    const defaultRole = currentUser.role || currentUser.user_metadata?.role || null;
    const defaultName =
      currentUser.user_metadata?.full_name ||
      currentUser.fullName ||
      currentUser.email?.split('@')[0];

    const initialProfile = {
      user_id: currentUser.id,
      full_name: defaultName,
      email: currentUser.email,
      role: defaultRole,
    };

    // If metadata already has a role, set it immediately to eliminate navigation latency
    if (defaultRole) {
      setProfile(initialProfile);
    }

    try {
      const userProfile = await authService.getUserProfile(currentUser.id, currentUser.email);
      if (userProfile) {
        setProfile(userProfile);
        return userProfile;
      }
    } catch (err) {
      console.warn('Error fetching profile in AuthProvider:', err);
    }

    setProfile(initialProfile);
    return initialProfile;
  };

  useEffect(() => {
    let isMounted = true;
    let lastHandledUserId = null;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }

        const session = await authService.getSession();
        if (session?.user && isMounted) {
          lastHandledUserId = session.user.id;
          setUser(session.user);
          await fetchProfile(session.user);
        } else if (isMounted) {
          const backendUser = authService.getBackendUser();
          if (backendUser) {
            lastHandledUserId = backendUser.id;
            setUser(backendUser);
            await fetchProfile(backendUser);
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth events
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        if (lastHandledUserId !== session.user.id) {
          lastHandledUserId = session.user.id;
          await fetchProfile(session.user);
        }
      } else {
        lastHandledUserId = null;
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const { user: loggedInUser } = await authService.signIn(email, password);
      setUser(loggedInUser);
      const userProfile = await fetchProfile(loggedInUser);

      const detectedRole = userProfile?.role || loggedInUser.user_metadata?.role || loggedInUser.role;
      if (!['admin', 'doctor'].includes(detectedRole)) {
        await authService.signOut();
        setUser(null);
        setProfile(null);
        throw new Error('This account is not authorized for the admin portal.');
      }

      return { user: loggedInUser, profile: userProfile };
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const role = profile?.role || user?.user_metadata?.role || null;
  const isAdmin = role === 'admin';
  const isDoctor = role === 'doctor';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isDoctor,
        loading,
        error,
        login,
        logout,
        refreshProfile,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
