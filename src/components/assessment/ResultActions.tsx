
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resultActionsTranslations } from '@/translations/resultActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultActionsProps {
  redirectUrl: string;
  language?: string;
}

const ResultActions: React.FC<ResultActionsProps> = ({ 
  redirectUrl,
  language = 'en'
}) => {
  const isMobile = useIsMobile();
  const translations = resultActionsTranslations[language as keyof typeof resultActionsTranslations] || resultActionsTranslations.en;

  const handleRedirect = () => {
    try {
      const redirectUrlWithRef = new URL(redirectUrl);
      redirectUrlWithRef.searchParams.append('ref', 'mood-assessment');
      redirectUrlWithRef.searchParams.append('completed', 'true');
      window.open(redirectUrlWithRef.toString(), '_blank');
    } catch (error) {
      console.error("Redirect error:", error);
      window.open(redirectUrl, '_blank');
    }
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-3 w-full px-4 sm:px-6`}>
      <Button 
        onClick={handleRedirect}
        className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
          ${isMobile ? 'py-4 text-base' : ''}`}
      >
        <ExternalLink className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <span>{translations.goToCourses}</span>
      </Button>
      
      <Link to="/history-chart" className="w-full">
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
  );
};

export default ResultActions;
