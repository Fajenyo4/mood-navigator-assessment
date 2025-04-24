import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from 'react-router-dom';
import { MoodResult } from '@/utils/assessmentScoring';
import MoodIcon from './MoodIcon';
import ResultMessage from './ResultMessage';
import ResultActions from './ResultActions';
import AssessmentChart from './AssessmentChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { assessmentResultsTranslations } from '@/translations/assessmentResults';

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: MoodResult | null;
  onManualRedirect: () => void;
  language: string;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({
  open,
  onOpenChange,
  result,
  language,
}) => {
  const [countdown, setCountdown] = useState(10);
  const location = useLocation();
  const isHistoryPage = location.pathname === '/history';
  const isMobile = useIsMobile();

  // The redirect URL with proper https protocol to avoid cross-origin issues
  const REDIRECT_URL = "https://www.mican.life/courses-en";
  
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout | null = null;
    
    if (open && result && !isHistoryPage) {
      setCountdown(10); // Reset countdown when dialog opens
      
      countdownTimer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(countdownTimer!);
            
            // Add a small delay to ensure the UI shows 0 before redirect
            setTimeout(() => {
              console.log("Attempting redirect to:", REDIRECT_URL);
              
              try {
                // Build the full URL with parameters
                const redirectUrlWithRef = new URL(REDIRECT_URL);
                redirectUrlWithRef.searchParams.append('ref', 'mood-assessment');
                redirectUrlWithRef.searchParams.append('completed', 'true');
                
                // Open in the current window using window.location.href
                window.location.href = redirectUrlWithRef.toString();
              } catch (error) {
                console.error("Redirect URL construction error:", error);
                // Fallback to direct redirect
                window.location.href = REDIRECT_URL;
              }
            }, 500);
            
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [open, result, isHistoryPage]);

  const hasAssessmentData = result && 
                           result.depressionResult && 
                           result.anxietyResult && 
                           result.stressResult && 
                           result.satisfactionResult;

  const chartData = hasAssessmentData ? {
    depression: {
      score: result.depressionResult!.score,
      level: result.depressionResult!.level,
    },
    anxiety: {
      score: result.anxietyResult!.score,
      level: result.anxietyResult!.level,
    },
    stress: {
      score: result.stressResult!.score,
      level: result.stressResult!.level,
    },
    lifeSatisfaction: {
      score: result.satisfactionResult!.score,
      level: result.satisfactionResult!.level,
    }
  } : null;

  const translations = assessmentResultsTranslations[language as keyof typeof assessmentResultsTranslations] || assessmentResultsTranslations.en;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md md:max-w-lg ${isMobile ? 'max-h-[90vh] overflow-y-auto p-4' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-center ${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
            {translations.title}
          </DialogTitle>
        </DialogHeader>
        {result ? (
          <div className="flex flex-col items-center space-y-4 py-2">
            <div className="mb-2">
              <MoodIcon iconType={result.iconType} iconColor={result.iconColor} />
            </div>
            
            <ResultMessage message={result.message} language={language} />

            {hasAssessmentData && chartData && (
              <div className="w-full mt-4">
                <h3 className={`text-center ${isMobile ? 'text-sm' : 'text-base'} font-medium mb-2`}>
                  {translations.title}
                </h3>
                <AssessmentChart data={chartData} height={isMobile ? 200 : 250} />
              </div>
            )}

            {!isHistoryPage && (
              <ResultActions 
                redirectUrl={REDIRECT_URL}
                language={language}
              />
            )}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p>Loading results...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
