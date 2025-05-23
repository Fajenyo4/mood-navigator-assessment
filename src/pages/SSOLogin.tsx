import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, RefreshCw, Bug, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const SSOLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUser, setLanguage } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [showManualButton, setShowManualButton] = useState(false);
  const [attemptedAutoLogin, setAttemptedAutoLogin] = useState(false);

  // Production domain to use for redirects
  const PRODUCTION_DOMAIN = 'https://mood-navigator-assessment.lovable.app';

  useEffect(() => {
    // Get language from URL params
    const lang = searchParams.get('lang') || 'en';
    
    // Store language in auth context
    setLanguage(lang);
    
    // If already authenticated, redirect to home page silently
    if (user) {
      navigate(`/${lang}`, { replace: true });
      return;
    }

    const authenticateWithSSO = async () => {
      try {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const lang = searchParams.get('lang') || 'en';
        let redirectUrl = searchParams.get('redirectUrl');

        if (!token || !email) {
          setError('Missing required parameters. Please ensure the URL contains token and email.');
          setIsLoading(false);
          return;
        }

        // Always ensure we're using the production domain for redirects
        if (!redirectUrl || redirectUrl.includes('localhost')) {
          // Get the correct language path
          let langPath = 'en';
          if (lang === 'zh-cn') langPath = 'zh-cn';
          else if (lang === 'zh-hk' || lang === 'zh-tw') langPath = 'zh-hk';
          
          redirectUrl = `https://mood-navigator-assessment.lovable.app/${langPath}`;
        }

        try {
          const apiEndpoint = `https://thvtgvvwksbxywhdnwcv.supabase.co/functions/v1/verify-sso`;
          
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email, 
              token, 
              name,
              redirectUrl,
              lang
            }),
          });

          // Store status and headers for debugging
          const responseInfo = {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          };
          setDebugInfo(responseInfo);

          // Check for non-JSON responses first
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            setDebugInfo(prev => ({ ...prev, textResponse }));
            throw new Error(`Received non-JSON response from server (${response.status}): ${textResponse.substring(0, 100)}...`);
          }

          // Parse response as JSON
          let data;
          try {
            data = await response.json();
            setDebugInfo(prev => ({ ...prev, responseData: data }));
          } catch (jsonError) {
            throw new Error(`Failed to parse server response as JSON: ${jsonError.message}`);
          }
          
          if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
          }
          
          if (data.magicLink) {
            let finalMagicLink = data.magicLink;
            
            // Double-verify the magic link doesn't contain localhost
            try {
              const magicLinkUrl = new URL(finalMagicLink);
              const redirectParam = magicLinkUrl.searchParams.get('redirect_to');
              
              if (redirectParam) {
                if (redirectParam.includes('localhost') || !redirectParam.includes('mood-navigator-assessment.lovable.app')) {
                  // Get the correct language path
                  let langPath = 'en';
                  if (lang === 'zh-cn') langPath = 'zh-cn';
                  else if (lang === 'zh-hk' || lang === 'zh-tw') langPath = 'zh-hk';
                  
                  magicLinkUrl.searchParams.set('redirect_to', `https://mood-navigator-assessment.lovable.app/${langPath}`);
                  finalMagicLink = magicLinkUrl.toString();
                }
              }
            } catch (urlError) {
              console.error("Error parsing magic link URL:", urlError);
            }
            
            setMagicLink(finalMagicLink);
            setShowManualButton(true);
            
            if (!attemptedAutoLogin) {
              setAttemptedAutoLogin(true);
              
              try {
                window.location.href = finalMagicLink;
              } catch (redirectError) {
                setError("Automatic login failed. Please use the manual login button below.");
                setIsLoading(false);
              }
            }
            
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
          setErrorDetails(fetchError.stack ? fetchError.stack : null);
          setError(`Authentication failed: ${fetchError.message}`);
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(`Authentication error: ${err.message}`);
        setIsLoading(false);
      }
    };

    authenticateWithSSO();
    
    // Set up auth state listener to detect when magic link succeeds (without toast)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        const lang = searchParams.get('lang') || 'en';
        // Silently navigate to the assessment page without toast
        navigate(`/${lang}`, { replace: true });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
    
  }, [searchParams, navigate, user, retryCount, setUser, setLanguage, attemptedAutoLogin]);

  const handleManualLogin = () => {
    if (magicLink) {
      // Double-check the magic link doesn't contain localhost
      let finalLink = magicLink;
      const lang = searchParams.get('lang') || 'en';
      
      try {
        const linkUrl = new URL(finalLink);
        const redirectParam = linkUrl.searchParams.get('redirect_to');
        
        if (redirectParam) {
          if (redirectParam.includes('localhost') || !redirectParam.includes(PRODUCTION_DOMAIN)) {
            linkUrl.searchParams.set('redirect_to', `${PRODUCTION_DOMAIN}/${lang}`);
            finalLink = linkUrl.toString();
            console.log("Fixed manual login link:", finalLink);
          }
        }
      } catch (urlError) {
        console.error("Error parsing manual login URL:", urlError);
      }
      
      // Open in current window - most reliable method for manual click
      window.location.href = finalLink;
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
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
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
