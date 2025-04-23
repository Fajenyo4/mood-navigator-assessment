
import React, { useEffect, useState } from 'react';

interface EnglishEmbedProps {
  sso?: boolean;
}

const EnglishEmbed: React.FC<EnglishEmbedProps> = ({ sso = false }) => {
  // Check for direct SSO parameters
  const [isDirectSso, setIsDirectSso] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Check URL parameters for direct SSO access
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    
    if (email) {
      setIsDirectSso(true);
      setRedirecting(true);
      
      console.log("Direct SSO detected with email:", email);
      
      try {
        // Create a simple token by encoding the email and timestamp
        const simpleToken = btoa(`${email}:${Date.now()}`);
        
        // Redirect to SSO login endpoint with token and language
        const appDomain = window.location.origin;
        const redirectUrl = `${appDomain}/sso-login?token=${encodeURIComponent(simpleToken)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || email.split('@')[0])}&lang=en`;
        
        console.log("Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      } catch (error) {
        console.error("Error during SSO redirect:", error);
        // Show error state instead of infinite loading
        setRedirecting(false);
      }
    }
  }, []);

  // Determine the URL based on whether this is an SSO embed or not
  const embedUrl = sso 
    ? "https://mood-navigator-assessment.lovable.app/embed/en-sso.html" 
    : "https://mood-navigator-assessment.lovable.app/login/en";

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
