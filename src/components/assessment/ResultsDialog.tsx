
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
    courseRecommendation: string;
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
    return result.courseRecommendation.split('\n').map((course, index) => (
      <p key={index} className="text-sm text-blue-600 text-center">{course}</p>
    ));
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
          <div className="space-y-1">
            {renderCourseRecommendations()}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Redirecting in 5 seconds...
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
