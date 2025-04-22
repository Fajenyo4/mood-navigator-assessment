
import React from 'react';

const TraditionalChineseEmbed: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <iframe 
          id="assessment"
          src="https://mood-navigator-assessment.lovable.app/login/zh-hk"
          width="100%" 
          height="100%"
          style={{ border: 'none' }}
          allow="fullscreen"
        />
        
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
