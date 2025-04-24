
import React, { useEffect, useState, useRef } from 'react';
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [magicLink, setMagicLink] = useState<string | null>(null);

  useEffect(() => {
    // If already authenticated, redirect to home page
    if (user) {
      const lang = searchParams.get('lang') || 'en';
      navigate(`/${lang}`, { replace: true });
      return;
    }

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
          
          // Get current URL to use as redirect URL
          const currentUrl = window.location.origin + `/${lang}`;
          
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email, 
              token, 
              name,
              redirectUrl: currentUrl
            }),
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
          
          if (data.magicLink) {
            console.log('Magic link received:', data.magicLink);
            setMagicLink(data.magicLink);
            
            // Create a hidden iframe to automatically load the magic link
            // This will trigger the auth flow without user interaction
            setTimeout(() => {
              if (!user) {
                // After 5 seconds, if still not logged in, show a message
                setError("Automatic login is taking longer than expected. Please wait or try refreshing the page.");
                setIsLoading(false);
              }
            }, 5000);
          } else {
            throw new Error('Authentication failed: No magic link returned');
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

    authenticateWithSSO();
    
    // Set up auth state listener to detect when magic link succeeds
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        const lang = searchParams.get('lang') || 'en';
        toast.success('Successfully signed in!');
        navigate(`/${lang}`, { replace: true });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
    
  }, [searchParams, navigate, user, retryCount, setUser]);

  // Auto-open magic link when it's available
  useEffect(() => {
    if (magicLink) {
      // Use an iframe to silently process the magic link
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = magicLink;
      document.body.appendChild(iframe);
      
      // Fallback: If iframe doesn't work, open in a new tab or redirect
      setTimeout(() => {
        if (!user) {
          window.open(magicLink, '_blank');
        }
      }, 3000);
    }
  }, [magicLink, user]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setErrorDetails(null);
    setDebugInfo(null);
    setMagicLink(null);
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
      
      {/* Hidden iframe to load the magic link */}
      {magicLink && (
        <iframe 
          ref={iframeRef}
          src={magicLink}
          style={{ display: 'none', width: 0, height: 0, border: 0 }}
          title="SSO Authentication"
        />
      )}
    </div>
  );
};

export default SSOLogin;
