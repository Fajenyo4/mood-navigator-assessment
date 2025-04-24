
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, RefreshCw, Bug, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
  const [showManualButton, setShowManualButton] = useState(false);
  const [attemptedAutoLogin, setAttemptedAutoLogin] = useState(false);

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
          
          // Get current URL to use as redirect URL - use window.location.origin to ensure correct domain
          const currentOrigin = window.location.origin;
          const redirectUrl = `${currentOrigin}/${lang}`;
          
          console.log("Using redirect URL:", redirectUrl);
          
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email, 
              token, 
              name,
              redirectUrl
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
            
            // Only try auto-login once to prevent infinite loops
            if (!attemptedAutoLogin) {
              setAttemptedAutoLogin(true);
              
              // Try multiple approaches to open the magic link automatically
              
              // 1. First attempt: Create a popup window
              try {
                const popup = window.open(data.magicLink, "loginWindow", "width=600,height=400");
                
                // Check if popup was blocked
                if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                  console.warn("Popup was blocked, trying direct navigation");
                  // Fall back to direct navigation
                  window.location.href = data.magicLink;
                }
                
                console.log("Opened magic link in popup");
              } catch (popupError) {
                console.error("Popup failed:", popupError);
                
                // 2. Second attempt: Direct window.location change
                try {
                  window.location.href = data.magicLink;
                  console.log("Redirected to magic link");
                } catch (redirectError) {
                  console.error("Direct redirect failed:", redirectError);
                  
                  // 3. Third attempt: Try to open in current window
                  window.open(data.magicLink, "_self");
                }
              }
            }
            
            // Show manual button immediately as backup
            setShowManualButton(true);
            
            // After 5 seconds, if still not logged in, show error
            setTimeout(() => {
              if (!user) {
                setError("Automatic login is taking longer than expected. Please use the manual login button below.");
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
    
  }, [searchParams, navigate, user, retryCount, setUser, attemptedAutoLogin]);

  const handleManualLogin = () => {
    if (magicLink) {
      // Try multiple approaches for manual login
      
      // First try: Open in new tab
      const newTab = window.open(magicLink, '_blank');
      
      // If popup blocked or failed
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // Second try: Open in current window
        window.location.href = magicLink;
      }
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setErrorDetails(null);
    setDebugInfo(null);
    setMagicLink(null);
    setAttemptedAutoLogin(false);
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
          
          {showManualButton && magicLink && (
            <Button 
              onClick={handleManualLogin}
              className="mt-6 flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Click here to login manually
            </Button>
          )}
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 mb-4 text-lg font-medium">Authentication Failed</div>
          <p className="mb-4">{error}</p>
          
          {magicLink && (
            <div className="mb-6">
              <Button 
                onClick={handleManualLogin} 
                className="w-full mb-4 flex items-center justify-center gap-2"
                size="lg"
              >
                <ExternalLink className="h-4 w-4" />
                Login Manually
              </Button>
              <p className="text-sm text-gray-500">
                Click the button above to open the login link in a new tab
              </p>
            </div>
          )}
          
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
