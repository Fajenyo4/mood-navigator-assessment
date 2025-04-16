
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from 'lucide-react';
import { ExternalLink } from 'lucide-react';

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
    };
    anxietyResult?: {
      level: string;
      message: string;
    };
    stressResult?: {
      level: string;
      message: string;
    };
    satisfactionResult?: {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Assessment Results</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="mb-2">{renderIcon()}</div>
          <div className="space-y-4 text-left w-full">
            {renderMessage()}
          </div>
          <div className="text-sm text-gray-500 text-center mt-4">
            <p>Your results have been saved. Redirecting to courses in 10 seconds...</p>
          </div>
          <Button 
            onClick={onManualRedirect} 
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Go to Mican Capital Courses</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
