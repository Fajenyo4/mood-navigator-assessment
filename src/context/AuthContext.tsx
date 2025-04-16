
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, User, Provider as SupabaseProvider } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Use the direct Supabase URL and anon key values
const supabaseUrl = 'https://rdlwkjcpbxwijipkcdep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbHdramNwYnh3aWppcGtjZGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5OTkyNDgsImV4cCI6MjAzMjU3NTI0OH0.lE4IbloA4aAxaF-zopFQfVOBZDMRY7U5ToDJGmL-14c';

// Create a single supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  }
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
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to load user session. Please try again.",
        });
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
    try {
      if (provider === 'email' && email && password) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Handle social login with proper typing
        const socialProvider = provider as SupabaseProvider; // Cast to proper Supabase Provider type
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: socialProvider,
          options: {
            redirectTo: window.location.origin,
          }
        });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error; // Rethrow to handle in the UI layer
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error; // Rethrow to handle in the UI layer
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error; // Rethrow to handle in the UI layer
    }
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
