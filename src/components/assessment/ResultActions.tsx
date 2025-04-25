
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { resultActionsTranslations } from '@/translations/resultActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResultActionsProps {
  redirectUrl: string;
  language?: string;
  className?: string;
}

const ResultActions: React.FC<ResultActionsProps> = ({ 
  redirectUrl,
  language = 'en',
  className
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
    <div className={cn("w-full", className)}>
      <Button 
        onClick={handleRedirect}
        variant="default"
        className={`w-full flex items-center justify-center gap-2
          ${isMobile ? 'py-4 text-base' : ''}`}
      >
        <ExternalLink className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <span className="truncate">{translations.goToCourses}</span>
      </Button>
    </div>
  );
};

export default ResultActions;
