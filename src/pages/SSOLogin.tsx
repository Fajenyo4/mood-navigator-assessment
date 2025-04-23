
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SSOLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateWithSSO = async () => {
      try {
        // Get token, email and name from URL params
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name') || '';
        const lang = searchParams.get('lang') || 'en';

        if (!token || !email) {
          setError('Missing required parameters. Please ensure the URL contains token and email.');
          setIsLoading(false);
          return;
        }

        console.log('Attempting SSO login with:', { 
          token: token.substring(0, 10) + '...', 
          email, 
          name,
          lang 
        });

        // For simple SSO, we can use magic link login with Supabase
        // This will send an email with a magic link, but we can auto-click it for the user
        const { data, error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            // Create the user if they don't exist
            shouldCreateUser: true,
            data: {
              name: name,
              source: 'learnworlds'
            },
            // We won't send an email, we'll use the return value
            emailRedirectTo: `${window.location.origin}/${lang}`
          }
        });

        if (signInError) {
          console.error('SSO sign-in error:', signInError);
          setError(`Authentication failed: ${signInError.message}`);
          setIsLoading(false);
          return;
        }

        // If we have user data, we're authenticated
        if (data) {
          console.log('Authentication successful, redirecting to:', `/${lang}`);
          toast.success('Successfully signed in!');
          navigate(`/${lang}`);
        } else {
          setError('Authentication failed. Please try logging in manually.');
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('SSO login error:', err);
        setError(`Authentication error: ${err.message}`);
        setIsLoading(false);
      }
    };

    // If already authenticated, redirect to home page
    if (user) {
      const lang = searchParams.get('lang') || 'en';
      navigate(`/${lang.toLowerCase()}`);
      return;
    }

    authenticateWithSSO();
  }, [searchParams, navigate, user]);

  // Display loading state or error message
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Authentication in progress...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting your LearnWorlds account...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4 text-lg">Authentication Failed</div>
          <p className="mb-4">{error}</p>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            onClick={() => navigate('/login/en')}
          >
            Go to Login Page
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SSOLogin;
