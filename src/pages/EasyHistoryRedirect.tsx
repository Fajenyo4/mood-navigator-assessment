
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const EasyHistoryRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get language from URL parameter or default to English
    const lang = searchParams.get('lang') || 'en';
    
    // Create a simple token for public access
    const simpleToken = btoa(`public:${Date.now()}`);
    
    console.log("EasyHistoryRedirect: Creating redirect to history with language:", lang);
    
    // Redirect to easy access with history view and specified language
    navigate(`/easy-access?token=${simpleToken}&view=history&lang=${lang}`);
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
