
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from 'lucide-react';
import { cn } from "@/lib/utils";
import ScrollIndicator from './ScrollIndicator';

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: any;
  isLoading: boolean;
  hasError: boolean;
  onManualRedirect: () => void;
  language: string;
  onRetry?: () => void;
}

const ResultsDialog = ({ 
  open,
  onOpenChange,
  result,
  isLoading,
  hasError,
  onManualRedirect,
  language,
  onRetry
}: ResultsDialogProps) => {
  const getMoodIcon = (mood: string) => {
    switch(mood.toLowerCase()) {
      case 'healthy':
        return <Smile className="h-12 w-12 text-green-500" />;
      case 'medium to high sub-health status':
        return <Meh className="h-12 w-12 text-blue-500" />;
      case 'moderate sub-health status':
        return <Meh className="h-12 w-12 text-yellow-500" />;
      case 'medium-to-low sub-health status':
        return <Frown className="h-12 w-12 text-orange-500" />;
      case 'psychological disturbance':
      default:
        return <Frown className="h-12 w-12 text-red-500" />;
    }
  };

  const getScaleColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-green-500";
      case 2:
        return "bg-amber-500";
      case 3:
        return "bg-orange-500";
      case 4:
        return "bg-red-500";
      case 5:
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const moodScale = [
    { label: "Healthy", rank: 1 },
    { label: "Mild", rank: 2 },
    { label: "Moderate", rank: 3 },
    { label: "Severe", rank: 4 },
    { label: "Extremely Severe", rank: 5 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md max-h-[90vh] overflow-y-auto" 
        onInteractOutside={(e) => {
          // Prevent closing when clicking outside, but only if it's loading or has an error
          if (isLoading || hasError) {
            e.preventDefault();
          }
        }}
      >
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700"></div>
            <p className="text-gray-500">Loading results...</p>
          </div>
        )}

        {hasError && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-red-500">
              Error loading results. Please try again.
            </p>
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        )}
        
        {!isLoading && !hasError && result && (
          <>
            <DialogHeader>
              <DialogTitle>Assessment Results</DialogTitle>
              <DialogDescription>
                Here's a summary of your mental health assessment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center text-center space-y-4">
              {getMoodIcon(result.mood)}
              <h3 className="text-xl font-semibold">{result.mood}</h3>
              
              <p className="text-gray-600">{result.message}</p>
              
              {/* Add ScrollIndicator here, after the result message */}
              <ScrollIndicator />
              
              <div className="flex items-center space-x-2">
                {moodScale.map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <Badge className={cn(
                      "w-6 h-3 rounded-full",
                      getScaleColor(item.rank),
                      item.rank === result.depressionResult.rank && "ring-2 ring-white"
                    )} />
                    <span className="text-xs text-gray-500 mt-1">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Depression</h4>
                  <p>Score: {result.depressionResult.score}</p>
                  <p>Level: {result.depressionResult.level}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Anxiety</h4>
                  <p>Score: {result.anxietyResult.score}</p>
                  <p>Level: {result.anxietyResult.level}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Stress</h4>
                  <p>Score: {result.stressResult.score}</p>
                  <p>Level: {result.stressResult.level}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Life Satisfaction</h4>
                  <p>Score: {result.satisfactionResult.score}</p>
                  <p>Level: {result.satisfactionResult.level}</p>
                </div>
              </div>
              
              <Button onClick={onManualRedirect}>
                View Recommended Courses
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
