
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  signIn: (provider: 'google' | 'github' | 'email', email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  setUser: (user: User | null) => void;
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

  useEffect(() => {
    // Store language in localStorage whenever it changes
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email);
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
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

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (provider: 'google' | 'github' | 'email', email?: string, password?: string) => {
    try {
      console.log(`Attempting to sign in with ${provider}`);
      
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
    } catch (error) {
      console.error('Sign in process error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      console.log('Attempting to sign up:', email);
      
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
        toast("Please check your email to verify your account");
      }
      
    } catch (error) {
      console.error('Sign up process error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out process error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      language, 
      setLanguage, 
      signIn, 
      signOut, 
      signUp, 
      setUser 
    }}>
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
