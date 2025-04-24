
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, RefreshCw, Bug } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SSOLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

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
          // Make sure to use the fully qualified URL to the edge function
          const apiEndpoint = `https://thvtgvvwksbxywhdnwcv.supabase.co/functions/v1/verify-sso`;
          console.log("Calling API endpoint:", apiEndpoint);
          
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, token, name }),
          });

          // Store status and headers for debugging
          const responseInfo = {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          };
          console.log("Response info:", responseInfo);
          setDebugInfo(responseInfo);

          // Check for non-JSON responses first
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            console.error('Non-JSON response:', textResponse);
            setDebugInfo(prev => ({ ...prev, textResponse }));
            throw new Error(`Received non-JSON response from server (${response.status}): ${textResponse.substring(0, 100)}...`);
          }

          // Now parse as JSON
          let data;
          try {
            data = await response.json();
            console.log("Response data:", data);
            setDebugInfo(prev => ({ ...prev, responseData: data }));
          } catch (jsonError) {
            console.error("JSON parse error:", jsonError);
            throw new Error(`Failed to parse server response as JSON: ${jsonError.message}`);
          }
          
          if (!response.ok) {
            console.error('SSO verification error:', data);
            throw new Error(data.error || `Server error: ${response.status}`);
          }
          
          if (data.session) {
            console.log('Authentication successful, setting session with data:', data.session);
            
            try {
              // Set the session in Supabase client using the complete session object
              const { data: sessionData, error: sessionError } = await supabase.auth.setSession(data.session);
              
              if (sessionError) {
                console.error("Error setting session:", sessionError);
                setErrorDetails(JSON.stringify(sessionError));
                throw new Error(`Failed to set session: ${sessionError.message}`);
              }
              
              console.log("Session set successfully:", sessionData);
              
              // Get the user from the session data
              if (sessionData.user) {
                setUser(sessionData.user);
                console.log("User state updated in AuthContext:", sessionData.user);
                
                toast.success('Successfully signed in!');
                
                // Add a slightly longer delay to ensure state is updated before redirecting
                setTimeout(() => {
                  console.log(`Redirecting to /${lang}`);
                  navigate(`/${lang}`, { replace: true });
                }, 800);
              } else {
                throw new Error("User data not available in session after setting it");
              }
            } catch (sessionError: any) {
              console.error('Error setting session:', sessionError);
              setErrorDetails(typeof sessionError === 'object' ? JSON.stringify(sessionError, null, 2) : sessionError.toString());
              throw new Error(`Failed to set session: ${sessionError.message}`);
            }
          } else {
            throw new Error('Authentication failed: No session data returned');
          }
        } catch (fetchError: any) {
          console.error('Error during SSO:', fetchError);
          setErrorDetails(fetchError.stack ? fetchError.stack : null);
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
      navigate(`/${lang}`, { replace: true });
      return;
    }

    authenticateWithSSO();
  }, [searchParams, navigate, user, retryCount, setUser]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setErrorDetails(null);
    setDebugInfo(null);
    setRetryCount(prevCount => prevCount + 1);
  };

  // Display loading state or error message
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
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
          <p className="mb-4">{error}</p>
          
          {errorDetails && (
            <Alert variant="destructive" className="mb-4 text-left">
              <AlertTitle className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Error Details
              </AlertTitle>
              <AlertDescription className="mt-2">
                <div className="whitespace-pre-wrap text-xs font-mono">
                  {errorDetails}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {debugInfo && (
            <div className="mb-6 text-left bg-gray-50 p-4 rounded overflow-auto max-h-60 text-xs">
              <p className="font-semibold mb-2">Debug Information:</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
          
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
