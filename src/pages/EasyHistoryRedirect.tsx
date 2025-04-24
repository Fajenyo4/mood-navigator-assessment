
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const EasyHistoryRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get language from URL parameter or default to English
    const lang = searchParams.get('lang') || 'en';
    // Get optional email and name parameters for SSO-like flow
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    
    // Add detailed logging for debugging
    console.log("EasyHistoryRedirect: Processing parameters", { lang, email, name });
    
    // Create token based on whether we have email (SSO flow) or public access
    let token, redirectUrl;
    
    if (email && email !== "{{USER_EMAIL}}") {
      // For SSO-like access with email
      token = btoa(`${email}:${Date.now()}`);
      redirectUrl = `/sso-login?token=${token}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || email)}&lang=${lang}&redirectUrl=${encodeURIComponent(window.location.origin + '/history-chart')}`;
      console.log("EasyHistoryRedirect: Using SSO flow with", { email, token: token.substring(0, 10) + "..." });
    } else {
      // For public access
      token = btoa(`public:${Date.now()}`);
      redirectUrl = `/easy-access?token=${token}&view=history&lang=${lang}`;
      console.log("EasyHistoryRedirect: Using public access with token", token.substring(0, 10) + "...");
    }
    
    console.log("EasyHistoryRedirect: Redirecting to", redirectUrl);
    navigate(redirectUrl);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <img 
        src="/lovable-uploads/32730d45-90eb-4971-b489-51a01e471c37.png"
        alt="ICAN Live Well"
        className="w-20 h-20 mb-5"
      />
      <p className="text-gray-600 mb-4">Redirecting to assessment history...</p>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default EasyHistoryRedirect;
