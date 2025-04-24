
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate } from 'react-router-dom';
import { MoodResult } from '@/utils/assessmentScoring';
import MoodIcon from './MoodIcon';
import ResultMessage from './ResultMessage';
import ResultActions from './ResultActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assessmentResultsTranslations } from '@/translations/assessmentResults';

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: MoodResult | null;
  language: string;
  onManualRedirect?: () => void; // Make this prop optional
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({
  open,
  onOpenChange,
  result,
  language,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHistoryPage = location.pathname === '/history';
  const isMobile = useIsMobile();

  const handleViewHistory = () => {
    onOpenChange(false);
    navigate(`/history-chart?lang=${language}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md md:max-w-lg ${isMobile ? 'max-h-[90vh] overflow-y-auto p-4' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-center ${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
            {assessmentResultsTranslations[language as keyof typeof assessmentResultsTranslations]?.title || 'Assessment Results'}
          </DialogTitle>
        </DialogHeader>
        {result ? (
          <div className="flex flex-col items-center space-y-4 py-2 animate-fade-in">
            <div className="mb-2 transform transition-transform hover:scale-110 duration-300">
              <MoodIcon iconType={result.iconType} iconColor={result.iconColor} />
            </div>
            
            <ResultMessage message={result.message} language={language} />

            {!isHistoryPage && (
              <div className={`w-full ${isMobile ? 'flex flex-col space-y-3' : 'flex space-x-3'}`}>
                <ResultActions 
                  redirectUrl="https://www.mican.life/courses-en"
                  language={language}
                  className={isMobile ? 'w-full' : 'flex-1'}
                />
                <Button 
                  variant="outline" 
                  className={`flex items-center justify-center gap-2 ${isMobile ? 'w-full' : 'flex-1'}`}
                  onClick={handleViewHistory}
                >
                  <History className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="truncate">
                    {assessmentResultsTranslations[language as keyof typeof assessmentResultsTranslations]?.viewHistory || 'View Assessment History'}
                  </span>
                </Button>
              </div>
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
