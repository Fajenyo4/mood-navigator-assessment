
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

  // Use a single redirect URL for all languages
  const REDIRECT_URL = "https://www.micancapital.au/courses-en";
  
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    
    if (open && result && !isHistoryPage) {
      setCountdown(10); // Reset countdown when dialog opens
      
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          // When countdown reaches 0, trigger redirect in a new tab
          if (prev <= 1) {
            const newWindow = window.open(REDIRECT_URL, '_blank');
            // If popup blocker prevents opening, handle it gracefully
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
              console.log("Popup blocked, unable to redirect automatically");
            }
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [open, result, isHistoryPage, REDIRECT_URL]);

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
              <ResultActions redirectUrl={REDIRECT_URL} countdown={countdown} />
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
