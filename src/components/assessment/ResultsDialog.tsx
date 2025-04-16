
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from 'lucide-react';

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
      level: string;
      message: string;
      courseRecommendation: string;
    };
    anxietyResult?: {
      level: string;
      message: string;
      courseRecommendation: string;
    };
    stressResult?: {
      level: string;
      message: string;
      courseRecommendation: string;
    };
    satisfactionResult?: {
      level: string;
      message: string;
      courseRecommendation: string;
    };
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
      <p key={index} className="text-sm text-gray-700 text-center mb-2">{line}</p>
    ));
  };

  const renderCourseRecommendations = () => {
    const recommendations = [];
    
    if (result.depressionResult && result.depressionResult.courseRecommendation) {
      recommendations.push(
        <p key="depression" className="text-xs text-gray-600">
          <span className="font-medium">低落情緒: </span>
          {result.depressionResult.courseRecommendation}
        </p>
      );
    }
    
    if (result.anxietyResult && result.anxietyResult.courseRecommendation) {
      recommendations.push(
        <p key="anxiety" className="text-xs text-gray-600">
          <span className="font-medium">焦慮情緒: </span>
          {result.anxietyResult.courseRecommendation}
        </p>
      );
    }
    
    if (result.stressResult && result.stressResult.courseRecommendation) {
      recommendations.push(
        <p key="stress" className="text-xs text-gray-600">
          <span className="font-medium">受壓情況: </span>
          {result.stressResult.courseRecommendation}
        </p>
      );
    }
    
    if (result.satisfactionResult && result.satisfactionResult.courseRecommendation) {
      recommendations.push(
        <p key="satisfaction" className="text-xs text-gray-600">
          <span className="font-medium">生活滿意程度: </span>
          {result.satisfactionResult.courseRecommendation}
        </p>
      );
    }
    
    return recommendations.length > 0 ? (
      <div className="mt-4 border-t pt-3 space-y-1">
        <p className="text-sm font-medium text-gray-700 text-center mb-2">推薦課程:</p>
        {recommendations}
      </div>
    ) : null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Assessment Results</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          {renderIcon()}
          <p className="text-xl font-semibold text-center">{result.mood}</p>
          <div className="space-y-2">
            {renderMessage()}
          </div>
          {renderCourseRecommendations()}
          <p className="text-sm text-gray-500 text-center">
            Your results have been saved. Redirecting in 10 seconds...
          </p>
          <Button onClick={onManualRedirect} className="mt-4">
            Redirect Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
