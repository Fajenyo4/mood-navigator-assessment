
import React from 'react';

const EnglishEmbed: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <iframe 
          id="assessment"
          src="https://mood-navigator-assessment.lovable.app/login/en"
          width="100%" 
          height="100%"
          style={{ border: 'none' }}
          allow="fullscreen"
        />
        
        <button 
          onClick={() => quickAccess('en')} 
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
          Quick Access
        </button>
      </div>
    </div>
  );
};

// Function to create a direct access link
function createDirectAccessLink(email: string, language = 'en') {
  // Create a simple token by encoding the email and timestamp
  const simpleToken = btoa(`${email}:${Date.now()}`);
  
  // Format the URL with the app domain
  const appDomain = "https://mood-navigator-assessment.lovable.app";
  return `${appDomain}/easy-access?token=${simpleToken}&email=${encodeURIComponent(email)}&lang=${language}`;
}

// Function to initiate quick access
function quickAccess(language: string) {
  const testEmail = prompt("Enter email to access the English assessment:", "user@example.com");
  if (testEmail) {
    const accessLink = createDirectAccessLink(testEmail, language);
    window.location.href = accessLink;
  }
}

export default EnglishEmbed;
