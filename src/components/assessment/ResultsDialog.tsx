
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    mood: string;
    redirectUrl: string;
    icon: React.ReactNode;
  };
  onManualRedirect: () => void;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({
  open,
  onOpenChange,
  result,
  onManualRedirect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Assessment Results</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          {result.icon}
          <p className="text-xl font-semibold text-center">{result.mood}</p>
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
