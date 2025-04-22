
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { isTokenValid, parseAccessToken } from '@/utils/accessTokens';

const EasyAccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateWithToken = async () => {
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

        // Validate token
        if (!isTokenValid(token)) {
          setError('Access link has expired. Please request a new one.');
          setIsLoading(false);
          return;
        }

        console.log('Authenticating with easy access link:', { 
          email, 
          lang 
        });

        // Sign in or create user account
        const { data, error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: {
              name: email.split('@')[0],
              source: 'easy_access'
            },
            // We won't send an email, we'll use the return value
            emailRedirectTo: `${window.location.origin}/${lang}`
          }
        });

        if (signInError) {
          console.error('Authentication error:', signInError);
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
          setError('Authentication failed. Please try again.');
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Authentication error:', err);
        setError(`Error: ${err.message}`);
        setIsLoading(false);
      }
    };

    authenticateWithToken();
  }, [searchParams, navigate]);

  // Display loading state or error message
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Authenticating you...</p>
          <p className="text-sm text-gray-500 mt-2">You will be redirected automatically.</p>
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

export default EasyAccess;
