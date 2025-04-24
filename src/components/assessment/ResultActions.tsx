
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resultActionsTranslations } from '@/translations/resultActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultActionsProps {
  redirectUrl: string;
  countdown: number;
  language?: string;
}

const ResultActions: React.FC<ResultActionsProps> = ({ 
  redirectUrl, 
  countdown,
  language = 'en'
}) => {
  const isMobile = useIsMobile();
  
  // Get translations based on language
  const translations = resultActionsTranslations[language as keyof typeof resultActionsTranslations] || resultActionsTranslations.en;

  // Direct redirect without using window.open
  const handleRedirect = () => {
    try {
      // Add referrer to help LearnWorlds identify the source
      const redirectUrlWithRef = new URL(redirectUrl);
      redirectUrlWithRef.searchParams.append('ref', 'mood-assessment');
      redirectUrlWithRef.searchParams.append('completed', 'true');
      
      // Use location.href for a clean redirect within the same tab
      window.location.href = redirectUrlWithRef.toString();
    } catch (error) {
      console.error("Redirect error:", error);
      // Fallback to simple redirect if URL construction fails
      window.location.href = redirectUrl;
    }
  };

  return (
    <>
      <div className="text-sm text-gray-500 text-center mt-4 px-4">
        <p>
          {translations.resultsSaved} {countdown} {translations.seconds}...
        </p>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-3 w-full px-4 sm:px-6`}>
        <Button 
          onClick={handleRedirect}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
            ${isMobile ? 'py-4 text-base' : ''}`}
        >
          <ExternalLink className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <span>{translations.goToCourses}</span>
        </Button>
        
        <Link to="/history" className="w-full">
          <Button 
            variant="outline" 
            className={`w-full flex items-center justify-center gap-2
              ${isMobile ? 'py-4 text-base' : ''}`}
          >
            <History className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            <span>{translations.viewHistory}</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ResultActions;

