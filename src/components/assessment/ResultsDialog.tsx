
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate } from 'react-router-dom';
import { MoodResult } from '@/utils/assessmentScoring';
import ResultActions from './ResultActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assessmentResultsTranslations } from '@/translations/assessmentResults';
import MoodScale from './MoodScale';
import ResultMessage from './ResultMessage';

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
  const location = useLocation();
  const navigate = useNavigate();
  const isHistoryPage = location.pathname === '/history';
  const isMobile = useIsMobile();
  const isChineseLanguage = language.startsWith('zh');

  const REDIRECT_URL = "https://www.mican.life/courses-en";

  const handleViewHistory = () => {
    onOpenChange(false);
    navigate(`/history-chart?lang=${language}`);
  };

  const getScorePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-xl ${isMobile ? 'max-h-[90vh] overflow-y-auto p-4' : 'p-8'}`}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-8">
            {isChineseLanguage ? "你開心嗎？" : "Are you happy?"}
          </DialogTitle>
        </DialogHeader>
        {result ? (
          <div className="flex flex-col items-center space-y-12">
            {isChineseLanguage && result.assessmentText ? (
              <ResultMessage message={result.assessmentText} language={language} />
            ) : (
              <p className="text-xl text-center font-medium text-gray-900 max-w-2xl">
                {result.message.split('\n\n')[0]}
              </p>
            )}
            
            <MoodScale
              value={getScorePercentage(result.satisfactionResult.score, 35)}
              label={isChineseLanguage ? "極度不開心" : "Extremely Unhappy"}
              title={isChineseLanguage ? "整體情緒" : "Overall Mood"}
              className="mb-12"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 w-full mb-10">
              <MoodScale
                value={getScorePercentage(result.satisfactionResult.score, 35)}
                label={result.satisfactionResult.level}
                title={isChineseLanguage ? "生活滿意度" : "Life Satisfaction"}
              />
              <MoodScale
                value={getScorePercentage(result.anxietyResult.score, 40)}
                label={result.anxietyResult.level}
                title={isChineseLanguage ? "焦慮" : "Anxiety"}
              />
              <MoodScale
                value={getScorePercentage(result.depressionResult.score, 40)}
                label={result.depressionResult.level}
                title={isChineseLanguage ? "抑鬱" : "Depression"}
              />
              <MoodScale
                value={getScorePercentage(result.stressResult.score, 40)}
                label={result.stressResult.level}
                title={isChineseLanguage ? "壓力" : "Stress"}
              />
            </div>

            {!isHistoryPage && (
              <div className={`w-full ${isMobile ? 'flex flex-col space-y-4' : 'flex space-x-4'}`}>
                <ResultActions 
                  redirectUrl={REDIRECT_URL}
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
