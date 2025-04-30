
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocation, useNavigate } from 'react-router-dom';
import { MoodResult } from '@/utils/scoring';
import ResultActions from './ResultActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assessmentResultsTranslations } from '@/translations/assessmentResults';
import MoodScale from './MoodScale';
import ResultMessage from './ResultMessage';
import MoodIcon from './MoodIcon';

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
  const [isLoading, setIsLoading] = useState(true);
  
  // Add effect to handle loading state
  useEffect(() => {
    if (open) {
      // Start with loading state
      setIsLoading(true);
      
      // Clear loading state after a small delay only if result exists
      const timer = setTimeout(() => {
        setIsLoading(result === null);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [open, result]);

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
      <DialogContent 
        className={`
          sm:max-w-xl 
          ${isMobile ? 'h-[85vh] p-4' : 'p-6'}
        `}
        style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-6">
            {isChineseLanguage ? "你開心嗎？" : "Are you happy?"}
          </DialogTitle>
          {open && <DialogDescription className="sr-only">
            Assessment results showing your mental health status
          </DialogDescription>}
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">Loading results...</p>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center space-y-8" style={{ paddingBottom: isMobile ? '20px' : '0' }}>
            <div className="flex items-center justify-center gap-4">
              <MoodIcon iconType={result.iconType} iconColor={result.iconColor} />
              <p className="text-xl text-center font-medium text-gray-900 max-w-2xl">
                {isChineseLanguage ? "精神心理健康狀態: " : "Mental Health Status: "}
                <span className="font-bold">{result.mood}</span>
              </p>
            </div>
            
            {/* Only display the assessment text in Chinese language without mental health status */}
            {isChineseLanguage && result.assessmentText ? (
              <ResultMessage message={result.assessmentText} language={language} />
            ) : (
              result.message && 
              <p className="text-xl text-center font-medium text-gray-900 max-w-2xl">
                {result.message.split('\n\n')[0].replace(/Mental Health Status:.+/g, '').trim()}
              </p>
            )}
            
            <MoodScale
              value={result.mood === "Healthy" ? 95 :
                     result.mood === "Medium to High Sub-Health Status" ? 75 :
                     result.mood === "Moderate Sub-Health Status" ? 50 :
                     result.mood === "Medium-to-Low Sub-Health Status" ? 25 : 10}
              label={isChineseLanguage ? (result.mood === "Healthy" ? "開心" : "不開心") : 
                     (result.mood === "Healthy" ? "Happy" : "Unhappy")}
              title={isChineseLanguage ? "整體情緒" : "Overall Mood"}
              className="mb-8 w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-8">
              <MoodScale
                value={getScorePercentage(result.satisfactionResult.score, 35)}
                label={result.satisfactionResult.level}
                title={isChineseLanguage ? "生活滿意度" : "Life Satisfaction"}
              />
              <MoodScale
                value={getScorePercentage(result.anxietyResult.score, 40)}
                label={result.anxietyResult.level}
                title={isChineseLanguage ? "焦慮" : "Anxiety"}
                isNegativeScale={true}
              />
              <MoodScale
                value={getScorePercentage(result.depressionResult.score, 40)}
                label={result.depressionResult.level}
                title={isChineseLanguage ? "抑鬱" : "Depression"}
                isNegativeScale={true}
              />
              <MoodScale
                value={getScorePercentage(result.stressResult.score, 40)}
                label={result.stressResult.level}
                title={isChineseLanguage ? "壓力" : "Stress"}
                isNegativeScale={true}
              />
            </div>

            {!isHistoryPage && (
              <div className={`w-full mt-6 ${isMobile ? 'flex flex-col space-y-4' : 'flex space-x-4'}`}>
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
          <div className="p-8 text-center">
            <p className="text-red-500">Failed to load results. Please try again.</p>
            <Button onClick={() => onOpenChange(false)} className="mt-4">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
