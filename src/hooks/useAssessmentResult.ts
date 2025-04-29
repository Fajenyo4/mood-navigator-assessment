
import { useCallback } from 'react';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { MoodResult } from '@/utils/assessmentScoring';

interface UseAssessmentResultProps {
  answers: { [key: number]: number };
  effectiveLanguage: string;
}

export const useAssessmentResult = ({ 
  answers, 
  effectiveLanguage 
}: UseAssessmentResultProps) => {
  // Calculate scores and results only when needed for the results dialog
  const getResultData = useCallback((): MoodResult | null => {
    if (!answers || Object.keys(answers).length === 0) {
      return null;
    }

    const scores = calculateDassScores(answers);
    const depressionLevel = determineLevel(scores.depression, 'depression');
    const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
    const stressLevel = determineLevel(scores.stress, 'stress');
    const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');
    
    return determineMoodResult(
      depressionLevel,
      anxietyLevel,
      stressLevel,
      satisfactionLevel,
      scores.isParent || 0,
      scores.needsHelp || 0,
      effectiveLanguage
    );
  }, [answers, effectiveLanguage]);
  
  return { getResultData };
};
