
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, User, Provider } from '@supabase/supabase-js';

// Use the direct Supabase URL and anon key values
const supabaseUrl = 'https://rdlwkjcpbxwijipkcdep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbHdramNwYnh3aWppcGtjZGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5OTkyNDgsImV4cCI6MjAzMjU3NTI0OH0.lE4IbloA4aAxaF-zopFQfVOBZDMRY7U5ToDJGmL-14c';

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (provider: 'google' | 'github' | 'email', email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error loading auth session:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (provider: 'google' | 'github' | 'email', email?: string, password?: string) => {
    if (provider === 'email' && email && password) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } else {
      // Social login with proper typing to match Supabase's Provider type
      const providerValue = provider as Provider; // Type assertion for Supabase's Provider type
      const { error } = await supabase.auth.signInWithOAuth({
        provider: providerValue,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
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
