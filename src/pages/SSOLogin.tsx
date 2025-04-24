import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
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
        const name = searchParams.get('name');
        const lang = searchParams.get('lang') || 'en';

        if (!token || !email) {
          setError('Missing required parameters. Please ensure the URL contains token and email.');
          setIsLoading(false);
          return;
        }

        console.log('Attempting SSO login with:', { email, name });

        try {
          const response = await fetch(`${window.location.origin}/functions/v1/verify-sso`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, token, name }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('SSO verification error:', errorData);
            throw new Error(errorData.error || `Server error: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.session) {
            console.log('Authentication successful, setting session');
            
            // Set the session in Supabase client
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token
            });
            
            toast.success('Successfully signed in!');
            navigate(`/${lang}`);
          } else {
            throw new Error('Authentication failed: No session data returned');
          }
        } catch (fetchError: any) {
          console.error('Error during SSO:', fetchError);
          setError(`Authentication failed: ${fetchError.message}`);
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
      navigate(`/${lang}`);
      return;
    }

    authenticateWithSSO();
  }, [searchParams, navigate, user]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    // Force a new authentication attempt
    const authenticateWithSSO = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');
      const name = searchParams.get('name') || '';
      const lang = searchParams.get('lang') || 'en';
      
      try {
        const response = await fetch(`${window.location.origin}/functions/v1/verify-sso`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, token, name }),
        });
        
        const data = await response.json();
        
        if (data.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
          
          toast.success('Successfully signed in!');
          navigate(`/${lang}`);
        } else {
          setError('Authentication failed. Please try again.');
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(`Authentication error: ${err.message}`);
        setIsLoading(false);
      }
    };
    
    authenticateWithSSO();
  };

  // Display loading state or error message
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Authenticating you...</p>
          <p className="text-sm text-gray-500 mt-2">This should only take a moment</p>
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 mb-4 text-lg font-medium">Authentication Failed</div>
          <p className="mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors flex items-center justify-center"
              onClick={handleRetry}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              onClick={() => navigate('/login/en')}
            >
              Go to Login Page
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SSOLogin;
