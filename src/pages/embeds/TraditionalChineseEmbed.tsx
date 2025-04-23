
import React, { useEffect, useState } from 'react';

interface TraditionalChineseEmbedProps {
  sso?: boolean;
}

const TraditionalChineseEmbed: React.FC<TraditionalChineseEmbedProps> = ({ sso = false }) => {
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
      
      // Create a simple token by encoding the email and timestamp
      const simpleToken = btoa(`${email}:${Date.now()}`);
      
      // Redirect to SSO login endpoint with token and language
      const appDomain = window.location.origin;
      const redirectUrl = `${appDomain}/sso-login?token=${simpleToken}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || email.split('@')[0])}&lang=zh-hk`;
      
      window.location.href = redirectUrl;
    }
  }, []);

  // Determine the URL based on whether this is an SSO embed or not
  const embedUrl = sso 
    ? "https://mood-navigator-assessment.lovable.app/embed/zh-tw-sso.html" 
    : "https://mood-navigator-assessment.lovable.app/login/zh-hk";

  if (redirecting) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '4px solid #e0e0e0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '20px', color: '#4f46e5', fontFamily: 'Arial, sans-serif' }}>正在登錄...</p>
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
        
        {!sso && !isDirectSso && (
          <button 
            onClick={() => quickAccess('zh-hk')} 
            style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              zIndex: 1000, 
              background: '#4f46e5', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            快速訪問
          </button>
        )}
      </div>
    </div>
  );
};

// Function to create a direct access link
function createDirectAccessLink(email: string, language = 'zh-hk') {
  // Create a simple token by encoding the email and timestamp
  const simpleToken = btoa(`${email}:${Date.now()}`);
  
  // Format the URL with the app domain
  const appDomain = "https://mood-navigator-assessment.lovable.app";
  return `${appDomain}/easy-access?token=${simpleToken}&email=${encodeURIComponent(email)}&lang=${language}`;
}

// Function to initiate quick access
function quickAccess(language: string) {
  const testEmail = prompt("輸入電子郵件以訪問繁體中文評估:", "user@example.com");
  if (testEmail) {
    const accessLink = createDirectAccessLink(testEmail, language);
    window.location.href = accessLink;
  }
}

export default TraditionalChineseEmbed;
