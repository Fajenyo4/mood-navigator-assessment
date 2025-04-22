
import { supabase } from "@/integrations/supabase/client";

// Simple utility to generate and validate access tokens

/**
 * Generate a magic access token that can be used for a limited time
 * @param email User email
 * @returns Access link that can be shared
 */
export const generateAccessToken = async (email: string): Promise<string> => {
  try {
    // Use supabase's built-in magic link system
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // No email sent, just generate the token
        emailRedirectTo: `${window.location.origin}/`,
      }
    });

    if (error) {
      console.error('Error generating token:', error);
      throw new Error(error.message);
    }

    // Create a simplified token that includes the email
    // In a real implementation, you'd want to encrypt or sign this
    const simpleToken = btoa(`${email}:${Date.now()}`);
    
    return `${window.location.origin}/easy-access?token=${simpleToken}&email=${encodeURIComponent(email)}`;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};

/**
 * Parse an access token from the URL
 */
export const parseAccessToken = (token: string): { email: string, timestamp: number } | null => {
  try {
    const decoded = atob(token);
    const [email, timestamp] = decoded.split(':');
    return { 
      email, 
      timestamp: parseInt(timestamp) 
    };
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};

/**
 * Validate if a token is still valid (within 24 hours)
 */
export const isTokenValid = (token: string): boolean => {
  const parsed = parseAccessToken(token);
  if (!parsed) return false;
  
  const { timestamp } = parsed;
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  return (now - timestamp) < maxAge;
};
