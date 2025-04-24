
import { useRef } from 'react';
import { saveAssessmentResult } from '@/services/assessment';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { toast } from 'sonner';

export const useAssessmentSubmission = (
  userId: string | undefined,
  userName: string | undefined,
  userEmail: string | undefined,
  defaultLanguage: string,
  setShowResults: (show: boolean) => void,
  setIsSubmitting: (submitting: boolean) => void
) => {
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (finalAnswers: { [key: number]: number }) => {
    if (isSubmittingRef.current) return;
    
    if (!userId) {
      toast.error("You must be logged in to submit the assessment");
      return;
    }
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    
    try {
      const scores = calculateDassScores(finalAnswers);
      const depressionLevel = determineLevel(scores.depression, 'depression');
      const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
      const stressLevel = determineLevel(scores.stress, 'stress');
      const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');

      const result = determineMoodResult(
        depressionLevel,
        anxietyLevel,
        stressLevel,
        satisfactionLevel,
        scores.isParent,
        scores.needsHelp
      );

      setShowResults(true);
      localStorage.removeItem('assessment_progress');

      await saveAssessmentResult(
        userId,
        userName || userEmail || '',
        userEmail || '',
        {
          numeric: finalAnswers,
          text: createTextAnswers(finalAnswers),
          scores,
          levels: {
            depression: depressionLevel.level,
            anxiety: anxietyLevel.level,
            stress: stressLevel.level,
            lifeSatisfaction: satisfactionLevel.level
          }
        },
        result.mood,
        defaultLanguage,
        {
          depression: scores.depression,
          anxiety: scores.anxiety,
          stress: scores.stress,
          lifeSatisfaction: scores.lifeSatisfaction
        }
      );
    } catch (error) {
      console.error('Error processing assessment:', error);
      toast.error('Failed to process your assessment');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
};
