
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
  language
}) => {
  const [countdown, setCountdown] = useState(10);
  const location = useLocation();
  const isHistoryPage = location.pathname === '/history';

  // The redirect URL with no protocol to avoid cross-origin issues
  const REDIRECT_URL = "www.micancapital.au/courses-en";
  
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
              
              // Build the full URL with protocol and parameters
              const redirectUrlWithRef = new URL(`https://${REDIRECT_URL}`);
              redirectUrlWithRef.searchParams.append('ref', 'mood-assessment');
              redirectUrlWithRef.searchParams.append('completed', 'true');
              
              // Open in the current window using window.location.href
              window.location.href = redirectUrlWithRef.toString();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Assessment Results</DialogTitle>
        </DialogHeader>
        {result ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="mb-2">
              <MoodIcon iconType={result.iconType} iconColor={result.iconColor} />
            </div>
            
            <ResultMessage message={result.message} />

            {hasAssessmentData && chartData && (
              <div className="w-full mt-6">
                <h3 className="text-center text-base font-medium mb-2">Your Assessment Scores</h3>
                <AssessmentChart data={chartData} height={250} />
              </div>
            )}

            {!isHistoryPage && (
              <ResultActions redirectUrl={`https://${REDIRECT_URL}`} countdown={countdown} />
            )}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p>Loading results...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
