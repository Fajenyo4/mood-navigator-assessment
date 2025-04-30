
import { useCallback, useState } from 'react';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/scoring';
import type { MoodResult } from '@/utils/scoring';

interface UseAssessmentResultProps {
  answers: { [key: number]: number };
  effectiveLanguage: string;
}

export const useAssessmentResult = ({ 
  answers, 
  effectiveLanguage 
}: UseAssessmentResultProps) => {
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [lastResult, setLastResult] = useState<MoodResult | null>(null);

  // Calculate scores and results only when needed for the results dialog
  const getResultData = useCallback((): MoodResult | null => {
    // Set loading state
    setIsResultLoading(true);
    
    try {
      if (!answers || Object.keys(answers).length === 0) {
        console.log("No answers available to calculate results");
        setIsResultLoading(false);
        return null;
      }

      console.log("Calculating results with answers:", answers);
      const scores = calculateDassScores(answers);
      console.log("Calculated scores:", scores);
      
      const depressionLevel = determineLevel(scores.depression, 'depression');
      const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
      const stressLevel = determineLevel(scores.stress, 'stress');
      const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');
      
      console.log("Determined levels:", { 
        depression: depressionLevel, 
        anxiety: anxietyLevel, 
        stress: stressLevel, 
        satisfaction: satisfactionLevel 
      });
      
      const result = determineMoodResult(
        depressionLevel,
        anxietyLevel,
        stressLevel,
        satisfactionLevel,
        scores.isParent || 0,
        scores.needsHelp || 0,
        effectiveLanguage
      );
      
      console.log("Final mood result:", result);
      setLastResult(result);
      setIsResultLoading(false);
      return result;
    } catch (error) {
      console.error("Error calculating assessment results:", error);
      setIsResultLoading(false);
      return null;
    }
  }, [answers, effectiveLanguage]);
  
  return { 
    getResultData,
    isResultLoading,
    lastResult 
  };
};
