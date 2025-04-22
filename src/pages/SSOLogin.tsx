
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SSOLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateWithSSO = async () => {
      try {
        // Get token and email from URL params
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const lang = searchParams.get('lang') || 'en';

        if (!token || !email) {
          setError('Missing required parameters. Please ensure the URL contains token and email.');
          setIsLoading(false);
          return;
        }

        console.log('Attempting SSO login with:', { token: token.substring(0, 10) + '...', email, lang });

        // Verify token using our edge function
        const { data, error: verifyError } = await supabase.functions.invoke('verify-sso', {
          body: { token, email },
        });

        if (verifyError) {
          console.error('SSO verification error:', verifyError);
          setError('Failed to verify SSO token. Please try logging in manually.');
          setIsLoading(false);
          return;
        }

        if (data?.session) {
          // Store the session in Supabase client
          await supabase.auth.setSession(data.session);
          
          // Redirect to assessment page with the specified language
          const languageRoute = lang.toLowerCase();
          console.log('Authentication successful, redirecting to:', `/${languageRoute}`);
          navigate(`/${languageRoute}`);
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
