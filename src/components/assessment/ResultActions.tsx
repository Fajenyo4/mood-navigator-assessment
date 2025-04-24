
import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { resultActionsTranslations } from '@/translations/resultActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { preventPageRefresh } from '@/utils/preventRefresh';

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

  // Use useCallback to prevent recreation on each render
  const handleRedirect = useCallback(() => {
    try {
      // Use our preventPageRefresh utility to block any automatic refreshes
      const cleanup = preventPageRefresh();
      
      const redirectUrlWithRef = new URL(redirectUrl);
      redirectUrlWithRef.searchParams.append('ref', 'mood-assessment');
      redirectUrlWithRef.searchParams.append('completed', 'true');
      
      // Use a short timeout to ensure UI updates before redirect
      setTimeout(() => {
        // Cleanup the refresh prevention when redirecting
        cleanup();
        // Use window.location.replace for cleaner navigation without back history
        window.location.replace(redirectUrlWithRef.toString());
      }, 100);
    } catch (error) {
      console.error("Redirect error:", error);
      // Fallback with direct open if URL parsing fails
      window.location.replace(redirectUrl);
    }
  }, [redirectUrl]);

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

// Explicitly add displayName to help with debugging
ResultActions.displayName = 'ResultActions';

export default React.memo(ResultActions);
