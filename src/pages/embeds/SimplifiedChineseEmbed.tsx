
import React, { useEffect, useState } from 'react';

interface SimplifiedChineseEmbedProps {
  sso?: boolean;
}

const SimplifiedChineseEmbed: React.FC<SimplifiedChineseEmbedProps> = ({ sso = false }) => {
  // Check for direct SSO parameters
  const [isDirectSso, setIsDirectSso] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Disable beforeunload event for the entire window to prevent refresh confirmations
    const disableBeforeUnload = () => {
      window.removeEventListener('beforeunload', (e) => e.preventDefault());
    };
    
    disableBeforeUnload();
    
    // Check URL parameters for direct SSO access (run immediately for faster performance)
    const performSsoCheck = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email');
      const name = urlParams.get('name');
      
      if (email) {
        setIsDirectSso(true);
        setRedirecting(true);
        
        try {
          // Create a simple token by encoding the email and timestamp
          const simpleToken = btoa(`${email}:${Date.now()}`);
          
          // Get actual name or default to email username
          let displayName = name || email.split('@')[0];
          
          // Redirect to SSO login endpoint with token and language
          const appDomain = window.location.origin;
          const redirectUrl = `${appDomain}/sso-login?token=${simpleToken}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(displayName)}&lang=zh-cn`;
          
          // Redirect immediately - don't wait
          window.location.href = redirectUrl;
        } catch (error) {
          console.error("Error during SSO redirect:", error);
          setRedirecting(false);
          setError("登录处理错误。请重试或联系支持。");
        }
      }
    };

    // Run the check immediately without delay
    performSsoCheck();
    
    // Make sure we clean up beforeunload listeners on unmount
    return () => {
      window.removeEventListener('beforeunload', (e) => e.preventDefault());
    };
  }, []);

  // Determine the URL based on whether this is an SSO embed or not
  const embedUrl = sso 
    ? "https://mood-navigator-assessment.lovable.app/embed/zh-cn-sso.html" 
    : "https://mood-navigator-assessment.lovable.app/login/zh-cn";

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        <div style={{ textAlign: 'center', maxWidth: '80%', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ color: '#e11d48', marginBottom: '16px', fontSize: '24px' }}>⚠️ 配置错误</div>
          <p style={{ marginBottom: '16px', color: '#4b5563', fontFamily: 'Arial, sans-serif' }}>{error}</p>
          <p style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
            请确保您的 LearnWorlds 整合配置正确。
          </p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        {/* Simplified loading indicator - no text to avoid "Signing in" message */}
        <div style={{ width: '40px', height: '40px', border: '4px solid #e0e0e0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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

export default SimplifiedChineseEmbed;
