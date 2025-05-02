import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { User, Provider, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  signIn: (provider: 'google' | 'github' | 'email', email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  setUser: (user: User | null) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('selectedLanguage') || 'en';
  });
  
  const hasHandledSignIn = useRef(false);

  useEffect(() => {
    // Store language in localStorage whenever it changes
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      console.log('Refreshing session...');
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }

      if (refreshedSession) {
        console.log('Session refreshed successfully');
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        return;
      }

      console.log('No session to refresh');
    } catch (error) {
      console.error('Failed to refresh session:', error);
      // Clear session if refresh fails
      setSession(null);
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email);
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          if (!hasHandledSignIn.current) {
            toast.success('Signed in successfully');
            hasHandledSignIn.current = true;
          }
          break;
        case 'SIGNED_OUT':
          hasHandledSignIn.current = false;
          toast.info('Signed out');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          break;
        case 'USER_UPDATED':
          toast.success('Profile updated');
          break;
        case 'PASSWORD_RECOVERY':
          toast.info('Password recovery initiated');
          break;
      }
    });

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error loading auth session:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('Got existing session:', existingSession?.user?.email);

        if (mounted) {
          setSession(existingSession);
          setUser(existingSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading auth session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Set up session refresh interval
    const sessionRefreshInterval = setInterval(() => {
      if (session) {
        // Refresh session every 10 minutes to keep it alive
        refreshSession();
      }
    }, 10 * 60 * 1000); // 10 minutes

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false;
      clearInterval(sessionRefreshInterval);
      subscription.unsubscribe();
    };
  }, [session]);

  const signIn = async (provider: 'google' | 'github' | 'email', email?: string, password?: string) => {
    try {
      console.log(`Attempting to sign in with ${provider}`);
      setLoading(true);

      if (provider === 'email' && email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Sign in error:', error);
          throw error;
        }

        console.log('Sign in successful:', data);
      } else {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider as Provider,
          options: {
            redirectTo: `${window.location.origin}/`,
          }
        });

        if (error) {
          console.error('Sign in with OAuth error:', error);
          throw error;
        }

        console.log('OAuth sign in initiated:', data);
      }
    } catch (error: any) {
      console.error('Sign in process error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      console.log('Attempting to sign up:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up result:', data);

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        toast.info("Please check your email to verify your account");
      }

    } catch (error: any) {
      console.error('Sign up process error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('User signed out successfully');

      // Clear any local state
      localStorage.removeItem('assessment_progress');
    } catch (error: any) {
      console.error('Sign out process error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Memoize context value to prevent unnecessary rerenders
  const value = useMemo(() => ({
    user, session, loading, language, setLanguage, signIn, signOut, signUp, setUser, refreshSession
  }), [user, session, loading, language]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
