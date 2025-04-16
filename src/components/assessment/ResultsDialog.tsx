
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, ExternalLink, History } from 'lucide-react';
import AssessmentChart from './AssessmentChart';
import { Link } from 'react-router-dom';

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    mood: string;
    message: string;
    redirectUrl: string;
    iconType: 'smile' | 'meh' | 'frown';
    iconColor: string;
    depressionResult?: {
      score: number;
      level: string;
      message: string;
    };
    anxietyResult?: {
      score: number;
      level: string;
      message: string;
    };
    stressResult?: {
      score: number;
      level: string;
      message: string;
    };
    satisfactionResult?: {
      score: number;
      level: string;
      message: string;
    };
    isParent?: number;
    needsHelp?: number;
  };
  onManualRedirect: () => void;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({
  open,
  onOpenChange,
  result,
  onManualRedirect,
}) => {
  const renderIcon = () => {
    const className = `w-12 h-12 ${result.iconColor}`;
    
    switch (result.iconType) {
      case 'smile':
        return <Smile className={className} />;
      case 'meh':
        return <Meh className={className} />;
      case 'frown':
        return <Frown className={className} />;
      default:
        return <Smile className={className} />;
    }
  };

  const renderMessage = () => {
    return result.message.split('\n').map((line, index) => (
      <p key={index} className="text-sm text-gray-700 mb-2">{line}</p>
    ));
  };

  // Check if all assessment results are available
  const hasAssessmentData = result.depressionResult && 
                           result.anxietyResult && 
                           result.stressResult && 
                           result.satisfactionResult;

  // Prepare chart data
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
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="mb-2">{renderIcon()}</div>
          <div className="space-y-4 text-left w-full">
            {renderMessage()}
          </div>

          {/* Results Chart */}
          {hasAssessmentData && chartData && (
            <div className="w-full mt-6">
              <h3 className="text-center text-base font-medium mb-2">Your Assessment Scores</h3>
              <AssessmentChart data={chartData} height={250} />
            </div>
          )}

          <div className="text-sm text-gray-500 text-center mt-4">
            <p>Your results have been saved. Redirecting to courses in 10 seconds...</p>
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <Button 
              onClick={onManualRedirect} 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to Mican Capital Courses</span>
            </Button>
            
            <Link to="/history" className="w-full">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
              >
                <History className="w-4 h-4" />
                <span>View Assessment History</span>
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
