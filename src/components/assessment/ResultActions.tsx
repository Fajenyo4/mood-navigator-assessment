
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
      // First remove any page refresh prevention for clean navigation
      const cleanup = preventPageRefresh();
      cleanup();
      
      // Create a URL object for proper parsing and parameter handling
      const redirectUrlWithRef = new URL(redirectUrl);
      
      // Add tracking parameters to help with analytics
      redirectUrlWithRef.searchParams.append('ref', 'mood-assessment');
      redirectUrlWithRef.searchParams.append('completed', 'true');
      redirectUrlWithRef.searchParams.append('timestamp', Date.now().toString());
      
      const finalUrl = redirectUrlWithRef.toString();
      console.log("Redirecting to:", finalUrl);
      
      // Use window.open with _blank for better cross-origin compatibility
      // This prevents issues with referrer policies and cross-site restrictions
      const newWindow = window.open(finalUrl, '_blank');
      
      // Add fallback if popup blocker prevents the window from opening
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.log("Popup may have been blocked, trying alternative method");
        // Try location.href as fallback
        window.location.href = finalUrl;
      }
    } catch (error) {
      console.error("Redirect error:", error);
      // Fallback with direct open if URL parsing fails
      window.open(redirectUrl, '_blank');
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
