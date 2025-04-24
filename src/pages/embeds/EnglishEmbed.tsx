
import React, { useEffect, useState } from 'react';

interface EnglishEmbedProps {
  sso?: boolean;
}

const EnglishEmbed: React.FC<EnglishEmbedProps> = ({ sso = false }) => {
  // Check for direct SSO parameters
  const [isDirectSso, setIsDirectSso] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Production domain to use for redirects
  const PRODUCTION_DOMAIN = 'https://mood-navigator-assessment.lovable.app';

  useEffect(() => {
    // Check URL parameters for direct SSO access
    const urlParams = new URLSearchParams(window.location.search);
    let rawEmail = urlParams.get('email');
    let rawName = urlParams.get('name');
    
    // Check and clean up template variables
    if (rawEmail && (rawEmail.includes('{{') || rawEmail.includes('}}'))) {
      console.warn("Template variables detected in email:", rawEmail);
      setError("The URL contains template variables. Please configure LearnWorlds to replace {{USER_EMAIL}} and {{USER_NAME}} with actual values.");
      return;
    }

    if (rawName && (rawName.includes('{{') || rawName.includes('}}'))) {
      console.warn("Template variables detected in name:", rawName);
      rawName = null; // Reset name if it contains template variables
    }

    if (rawEmail) {
      setIsDirectSso(true);
      setRedirecting(true);
      
      console.log("Direct SSO detected with email:", rawEmail);
      
      try {
        // Create a simple token by encoding the email and timestamp
        const simpleToken = btoa(`${rawEmail}:${Date.now()}`);
        
        // Get actual name or default to email username
        let name = rawName || rawEmail.split('@')[0];
        
        // Always use the production domain for redirects
        const redirectUrl = `${PRODUCTION_DOMAIN}/en`;
        
        // Redirect to SSO login endpoint with token, language and explicit redirectUrl
        const ssoLoginUrl = `${PRODUCTION_DOMAIN}/sso-login?token=${encodeURIComponent(simpleToken)}&email=${encodeURIComponent(rawEmail)}&name=${encodeURIComponent(name)}&lang=en&redirectUrl=${encodeURIComponent(redirectUrl)}`;
        
        console.log("Redirecting to:", ssoLoginUrl);
        
        // Add a small delay to allow logs to be sent to console
        setTimeout(() => {
          window.location.href = ssoLoginUrl;
        }, 100);
      } catch (error) {
        console.error("Error during SSO redirect:", error);
        // Show error state instead of infinite loading
        setRedirecting(false);
        setError("Error processing SSO login. Please try again or contact support.");
      }
    }
  }, []);

  // Determine the URL based on whether this is an SSO embed or not
  const embedUrl = sso 
    ? `${PRODUCTION_DOMAIN}/embed/en-sso.html` 
    : `${PRODUCTION_DOMAIN}/login/en`;

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        <div style={{ textAlign: 'center', maxWidth: '80%', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ color: '#e11d48', marginBottom: '16px', fontSize: '24px' }}>⚠️ Configuration Error</div>
          <p style={{ marginBottom: '16px', color: '#4b5563', fontFamily: 'Arial, sans-serif' }}>{error}</p>
          <p style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
            Please ensure your LearnWorlds integration is configured correctly.
          </p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '4px solid #e0e0e0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '20px', color: '#4f46e5', fontFamily: 'Arial, sans-serif' }}>Signing you in...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <iframe 
          id="assessment"
          src={embedUrl}
          width="100%" 
          height="100%"
          style={{ border: 'none' }}
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default EnglishEmbed;
